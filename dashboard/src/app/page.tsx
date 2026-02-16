"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { DashboardData, ValidatorData } from "@/lib/types";
import { fetchDashboardData, watchBlocks } from "@/lib/fetcher";
import StatCard from "@/components/stat-card";
import EpochBar from "@/components/epoch-bar";
import ValidatorTable from "@/components/validator-table";
import ValidatorDetail from "@/components/validator-detail";
import ChartBlockTime from "@/components/chart-block-time";
import ChartTps from "@/components/chart-tps";
import ChartGas from "@/components/chart-gas";
import ChartValidators from "@/components/chart-validators";
import BlockFeed from "@/components/block-feed";
import RecentTransactions from "@/components/recent-transactions";
import ChainInfo from "@/components/chain-info";
import {
  IconCube,
  IconShield,
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
  const [selectedValidator, setSelectedValidator] =
    useState<ValidatorData | null>(null);
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* ── HEADER ── */}
      <header className="shrink-0 border-b border-[var(--border)]">
        <div className="max-w-[1600px] mx-auto px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-sm bg-[var(--cyan)]/10 flex items-center justify-center">
              <IconCube className="w-3 h-3 text-[var(--cyan)]" />
            </div>
            <div>
              <h1 className="text-[11px] font-bold tracking-widest text-[var(--white)] leading-none">
                TEMPO MONITOR
              </h1>
              <p className="text-[7px] text-[var(--muted)] tracking-[0.2em] mt-0.5">
                HEDGEQUANTX / MODERATO TESTNET
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-sm bg-[var(--surface)] border border-[var(--border)]">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${
                  connected ? "bg-[var(--cyan)] live-dot" : "bg-[var(--rose)]"
                }`}
              />
              <span className="text-[8px] text-[var(--muted)] tracking-widest">
                {connected ? "WSS LIVE" : "DISCONNECTED"}
              </span>
            </div>
            <span className="text-[8px] text-[var(--muted)] tracking-wider font-mono">
              {lastUpdate}
            </span>
            <button
              onClick={refresh}
              className="p-1 rounded-sm border border-[var(--border)] hover:border-[var(--cyan)]/40 transition-colors"
            >
              <IconRefresh className="w-3 h-3 text-[var(--muted)]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 min-h-0 max-w-[1600px] mx-auto w-full px-3 py-2 flex flex-col gap-1.5">

        {/* ROW 1 : STATS + EPOCH (compact, fixed) */}
        <div className="shrink-0 grid grid-cols-6 gap-1.5">
          <StatCard
            label="BLOCK HEIGHT"
            value={data.blockHeight.toLocaleString()}
            icon={<IconCube />}
            color="cyan"
          />
          <StatCard
            label="EPOCH"
            value={data.currentEpoch}
            sub={`${data.epochProgressPct}%`}
            icon={<IconClock />}
            color="white"
          />
          <StatCard
            label="VALIDATORS"
            value={`${data.activeValidators} / ${data.totalValidators}`}
            icon={<IconShield />}
            color="cyan"
          />
          <StatCard
            label="BLOCK TIME"
            value={network.blockTime !== null ? `${network.blockTime}S` : "--"}
            icon={<IconClock />}
            color="white"
          />
          <StatCard
            label="THROUGHPUT"
            value={network.tps !== null ? `${network.tps} TPS` : "--"}
            sub={network.peakTps !== null ? `PEAK ${network.peakTps}` : undefined}
            icon={<IconBolt />}
            color="cyan"
          />
          <StatCard
            label="GAS USAGE"
            value={
              network.gasUtilization !== null
                ? `${network.gasUtilization}%`
                : "--"
            }
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

        <div className="shrink-0">
          <EpochBar
            epoch={data.currentEpoch}
            progress={data.epochProgress}
            progressPct={data.epochProgressPct}
            epochLength={data.epochLength}
            nextFullDkg={data.nextFullDkgEpoch}
          />
        </div>

        {/* ROW 2 : 3 CHARTS (fixed height) */}
        <div className="shrink-0 grid grid-cols-3 gap-1.5" style={{ height: 180 }}>
          <ChartBlockTime blocks={data.blockHistory} />
          <ChartTps blocks={data.blockHistory} />
          <ChartGas blocks={data.blockHistory} />
        </div>

        {/* ROW 3 : FEEDS + VALIDATORS + INFO (fills remaining space, internal scroll) */}
        <div className="flex-1 min-h-0 grid grid-cols-4 gap-1.5">
          <BlockFeed blocks={data.blockHistory} />
          <RecentTransactions transactions={data.recentTransactions} />
          <ValidatorTable
            validators={data.validators}
            onSelect={setSelectedValidator}
          />
          {/* Right column: pie + chain info stacked */}
          <div className="flex flex-col gap-1.5 min-h-0">
            <ChartValidators
              active={data.activeValidators}
              inactive={data.inactiveValidators}
              total={data.totalValidators}
            />
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ChainInfo data={data} />
            </div>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="shrink-0 border-t border-[var(--border)]">
        <div className="max-w-[1600px] mx-auto px-3 py-1 flex items-center justify-between text-[8px] text-[var(--muted)] tracking-widest">
          <span>CHAIN ID 42431 / MODERATO / {data.blockHistory.length}-BLOCK WINDOW</span>
          <div className="flex items-center gap-4">
            <a href="https://explore.tempo.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">
              EXPLORER
            </a>
            <a href="https://docs.tempo.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">
              DOCS
            </a>
            <a href="https://github.com/HedgeQuantX" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--cyan)] transition-colors">
              HEDGEQUANTX
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {selectedValidator && (
        <ValidatorDetail
          validator={selectedValidator}
          onClose={() => setSelectedValidator(null)}
        />
      )}
    </div>
  );
}
