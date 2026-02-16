"use client";

import { useEffect, useState, useCallback } from "react";
import type { DashboardData } from "@/lib/types";
import StatCard from "@/components/stat-card";
import EpochBar from "@/components/epoch-bar";
import ValidatorTable from "@/components/validator-table";
import {
  IconCube,
  IconShield,
  IconSignal,
  IconClock,
  IconRefresh,
} from "@/lib/icons";

const POLL_INTERVAL = 6000;

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/validators", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: DashboardData = await res.json();
      setData(json);
      setError(null);
      setLastUpdate(
        new Date(json.timestamp).toLocaleTimeString("en-US", {
          hour12: false,
        })
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "UNKNOWN ERROR");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--muted)] text-sm tracking-widest">
          <IconRefresh className="w-4 h-4 animate-spin" />
          CONNECTING TO TEMPO NETWORK
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--negative)] text-sm tracking-widest">
          RPC ERROR: {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen p-6 max-w-[1440px] mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[var(--foreground)]">
            TEMPO VALIDATOR DASHBOARD
          </h1>
          <p className="text-[10px] text-[var(--muted)] tracking-[0.2em] mt-1">
            BUILT BY HEDGEQUANTX / MODERATO TESTNET
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--positive)] live-dot" />
            <span className="text-[10px] text-[var(--muted)] tracking-widest">
              LIVE
            </span>
          </div>
          <span className="text-[10px] text-[var(--muted)] tracking-wider font-mono">
            {lastUpdate}
          </span>
          <button
            onClick={fetchData}
            className="p-1.5 rounded-sm border border-[var(--border)] hover:border-[var(--muted)] transition-colors"
            title="REFRESH"
          >
            <IconRefresh className="w-3.5 h-3.5 text-[var(--muted)]" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard
          label="BLOCK HEIGHT"
          value={data.blockHeight.toLocaleString()}
          icon={<IconCube />}
        />
        <StatCard
          label="CURRENT EPOCH"
          value={data.currentEpoch}
          sub={`${data.epochLength} BLOCKS PER EPOCH`}
          icon={<IconClock />}
        />
        <StatCard
          label="ACTIVE VALIDATORS"
          value={`${data.activeValidators} / ${data.totalValidators}`}
          accent="positive"
          icon={<IconShield />}
        />
        <StatCard
          label="INACTIVE"
          value={data.inactiveValidators}
          accent={data.inactiveValidators > 0 ? "warning" : "default"}
          icon={<IconSignal />}
        />
      </div>

      <div className="mb-4">
        <EpochBar
          epoch={data.currentEpoch}
          progress={data.epochProgress}
          progressPct={data.epochProgressPct}
          epochLength={data.epochLength}
          nextFullDkg={data.nextFullDkgEpoch}
        />
      </div>

      <ValidatorTable validators={data.validators} />

      <footer className="mt-8 pb-4 flex items-center justify-between text-[10px] text-[var(--muted)] tracking-widest">
        <span>TEMPO MODERATO TESTNET / CHAIN ID 42431</span>
        <a
          href="https://github.com/HedgeQuantX"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--foreground)] transition-colors"
        >
          HEDGEQUANTX
        </a>
      </footer>
    </div>
  );
}
