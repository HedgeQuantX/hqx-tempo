"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { DashboardData, ValidatorData } from "@/lib/types";
import { fetchDashboardData, watchBlocks } from "@/lib/fetcher";
import Sidebar, { type View } from "@/components/sidebar";
import ValidatorDetail from "@/components/validator-detail";
import OverviewView from "@/views/overview";
import BlocksView from "@/views/blocks";
import TransactionsView from "@/views/transactions";
import ValidatorsView from "@/views/validators";
import NetworkView from "@/views/network";
import EpochsView from "@/views/epochs";
import { IconRefresh } from "@/lib/icons";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [view, setView] = useState<View>("overview");
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
        <div className="flex items-center gap-3 text-[var(--muted)] text-base tracking-widest">
          <IconRefresh className="w-4 h-4 animate-spin" />
          CONNECTING TO TEMPO NETWORK
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-[var(--rose)] text-base tracking-widest">
          RPC ERROR: {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  function renderView() {
    if (!data) return null;
    switch (view) {
      case "overview":
        return (
          <OverviewView
            data={data}
            onSelectValidator={setSelectedValidator}
          />
        );
      case "blocks":
        return <BlocksView data={data} />;
      case "transactions":
        return <TransactionsView data={data} />;
      case "validators":
        return (
          <ValidatorsView
            data={data}
            onSelectValidator={setSelectedValidator}
          />
        );
      case "network":
        return <NetworkView data={data} />;
      case "epochs":
        return <EpochsView data={data} />;
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar active={view} onChange={setView} connected={connected} />

      {/* CONTENT */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-[14px] font-bold tracking-widest text-[var(--white)]">
                {view.toUpperCase()}
              </h1>
              <span className="text-[11px] text-[var(--muted)] tracking-wider">
                BLOCK #{data.blockHeight.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-[var(--muted)] tracking-wider font-mono">
                {lastUpdate}
              </span>
              <button
                onClick={refresh}
                className="p-1.5 rounded-sm border border-[var(--border)] hover:border-[#0f2a35] transition-colors"
              >
                <IconRefresh className="w-3.5 h-3.5 text-[var(--muted)]" />
              </button>
            </div>
          </div>
        </header>

        {/* VIEW CONTENT */}
        <main className="flex-1 min-h-0 p-3 flex flex-col overflow-hidden">
          {renderView()}
        </main>
      </div>

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
