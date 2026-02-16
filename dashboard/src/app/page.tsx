"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { DashboardData, ValidatorData } from "@/lib/types";
import { fetchDashboardData, watchBlocks } from "@/lib/fetcher";
import StatCard from "@/components/stat-card";
import EpochBar from "@/components/epoch-bar";
import ValidatorTable from "@/components/validator-table";
import ValidatorDetail from "@/components/validator-detail";
import {
  IconCube,
  IconShield,
  IconSignal,
  IconClock,
  IconBolt,
  IconFire,
  IconRefresh,
} from "@/lib/icons";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState<ValidatorData | null>(null);
  const unwatchRef = useRef<(() => void) | null>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchDashboardData();
      setData(result);
      setError(null);
      setConnected(true);
      setLastUpdate(
        new Date(result.timestamp).toLocaleTimeString("en-US", {
          hour12: false,
        })
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "UNKNOWN ERROR");
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    // WebSocket subscription: refresh data on every new block.
    unwatchRef.current = watchBlocks(() => {
      refresh();
    });

    return () => {
      unwatchRef.current?.();
    };
  }, [refresh]);

  if (loading && !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--muted)] text-sm tracking-widest">
          <IconRefresh className="w-4 h-4 animate-spin" />
          CONNECTING TO TEMPO NETWORK
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-[var(--rose)] text-sm tracking-widest">
          RPC ERROR: {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { network } = data;

  return (
    <div className="h-screen flex flex-col p-4 max-w-[1440px] mx-auto">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-widest text-[var(--white)]">
            TEMPO VALIDATOR DASHBOARD
          </h1>
          <p className="text-[9px] text-[var(--muted)] tracking-[0.2em] mt-0.5">
            BUILT BY HEDGEQUANTX / MODERATO TESTNET
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                connected
                  ? "bg-[var(--cyan)] live-dot"
                  : "bg-[var(--rose)]"
              }`}
            />
            <span className="text-[9px] text-[var(--muted)] tracking-widest">
              {connected ? "WSS LIVE" : "DISCONNECTED"}
            </span>
          </div>
          <span className="text-[9px] text-[var(--muted)] tracking-wider font-mono">
            {lastUpdate}
          </span>
          <button
            onClick={refresh}
            className="p-1 rounded-sm border border-[var(--border)] hover:border-[var(--cyan)]/40 transition-colors"
          >
            <IconRefresh className="w-3 h-3 text-[var(--muted)]" />
          </button>
        </div>
      </header>

      {/* STATS ROW 1 -- VALIDATORS */}
      <div className="grid grid-cols-4 gap-2 mb-2 shrink-0">
        <StatCard
          label="BLOCK HEIGHT"
          value={data.blockHeight.toLocaleString()}
          icon={<IconCube />}
          color="cyan"
        />
        <StatCard
          label="CURRENT EPOCH"
          value={data.currentEpoch}
          sub={`${data.epochLength} BLOCKS / EPOCH`}
          icon={<IconClock />}
          color="white"
        />
        <StatCard
          label="ACTIVE VALIDATORS"
          value={`${data.activeValidators} / ${data.totalValidators}`}
          icon={<IconShield />}
          color="cyan"
        />
        <StatCard
          label="INACTIVE"
          value={data.inactiveValidators}
          icon={<IconSignal />}
          color={data.inactiveValidators > 0 ? "yellow" : "white"}
        />
      </div>

      {/* STATS ROW 2 -- NETWORK METRICS */}
      <div className="grid grid-cols-3 gap-2 mb-2 shrink-0">
        <StatCard
          label="BLOCK TIME"
          value={network.blockTime !== null ? `${network.blockTime}S` : "--"}
          sub={`${network.latestBlockTxCount} TX IN LATEST BLOCK`}
          icon={<IconClock />}
          color="white"
        />
        <StatCard
          label="THROUGHPUT"
          value={network.tps !== null ? `${network.tps} TPS` : "--"}
          icon={<IconBolt />}
          color="cyan"
        />
        <StatCard
          label="GAS UTILIZATION"
          value={network.gasUtilization !== null ? `${network.gasUtilization}%` : "--"}
          icon={<IconFire />}
          color={
            network.gasUtilization !== null && network.gasUtilization > 80
              ? "rose"
              : network.gasUtilization !== null && network.gasUtilization > 50
                ? "yellow"
                : "white"
          }
        />
      </div>

      {/* EPOCH PROGRESS */}
      <div className="mb-2 shrink-0">
        <EpochBar
          epoch={data.currentEpoch}
          progress={data.epochProgress}
          progressPct={data.epochProgressPct}
          epochLength={data.epochLength}
          nextFullDkg={data.nextFullDkgEpoch}
        />
      </div>

      {/* VALIDATOR TABLE -- takes remaining space, internal scroll */}
      <ValidatorTable
        validators={data.validators}
        onSelect={setSelectedValidator}
      />

      {/* FOOTER */}
      <footer className="flex items-center justify-between text-[9px] text-[var(--muted)] tracking-widest py-2 shrink-0">
        <span>CHAIN ID 42431 / WSS://RPC.MODERATO.TEMPO.XYZ</span>
        <a
          href="https://github.com/HedgeQuantX"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--cyan)] transition-colors"
        >
          HEDGEQUANTX
        </a>
      </footer>

      {/* VALIDATOR DETAIL MODAL */}
      {selectedValidator && (
        <ValidatorDetail
          validator={selectedValidator}
          onClose={() => setSelectedValidator(null)}
        />
      )}
    </div>
  );
}
