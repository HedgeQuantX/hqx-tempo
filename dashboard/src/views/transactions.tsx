"use client";

import type { DashboardData } from "@/lib/types";
import { IconBolt, IconCube } from "@/lib/icons";
import StatCard from "@/components/stat-card";

interface Props {
  data: DashboardData;
}

function timeSince(ts: number): string {
  const delta = Math.floor(Date.now() / 1000) - ts;
  if (delta < 2) return "JUST NOW";
  if (delta < 60) return `${delta}S AGO`;
  if (delta < 3600) return `${Math.floor(delta / 60)}M AGO`;
  return `${Math.floor(delta / 3600)}H AGO`;
}

export default function TransactionsView({ data }: Props) {
  const txs = data.recentTransactions;
  const { network } = data;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-1.5">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#1a1800] flex items-center justify-center">
            <IconBolt className="w-4 h-4 text-[var(--yellow)]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold tracking-widest text-[var(--white)]">
              TRANSACTIONS
            </h2>
            <p className="text-[11px] text-[var(--muted)] tracking-wider">
              {txs.length} RECENT TRANSACTIONS FROM LATEST BLOCKS
            </p>
          </div>
        </div>
        <a
          href="https://explore.tempo.xyz/txs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--cyan)] tracking-widest hover:underline"
        >
          VIEW ALL ON EXPLORER
        </a>
      </div>

      {/* Stats */}
      <div className="shrink-0 grid grid-cols-4 gap-1.5">
        <StatCard label="TOTAL TX IN WINDOW" value={network.totalTxInWindow.toLocaleString()} icon={<IconBolt />} color="cyan" />
        <StatCard label="CURRENT TPS" value={network.tps !== null ? `${network.tps}` : "--"} icon={<IconBolt />} color="white" />
        <StatCard label="PEAK TPS" value={network.peakTps !== null ? `${network.peakTps}` : "--"} icon={<IconBolt />} color="yellow" />
        <StatCard label="LATEST BLOCK" value={`#${data.blockHeight.toLocaleString()}`} icon={<IconCube />} color="cyan" />
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="panel flex flex-col h-full overflow-hidden">
          <div className="overflow-auto min-h-0 flex-1">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0 bg-[var(--surface)] z-10">
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">TX HASH</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">BLOCK</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">AGE</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">FROM</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">TO</th>
                  <th className="text-right px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">VALUE</th>
                </tr>
              </thead>
              <tbody>
                {txs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-[var(--muted)] tracking-widest">
                      NO TRANSACTIONS IN RECENT BLOCKS
                    </td>
                  </tr>
                ) : (
                  txs.map((tx) => (
                    <tr key={tx.hash} className="border-b border-[#141a2d] row-hover">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <a
                          href={`https://explore.tempo.xyz/receipt/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[var(--cyan)] hover:underline text-[12px]"
                        >
                          {tx.hash}
                        </a>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <a
                          href={`https://explore.tempo.xyz/block/${tx.blockNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--cyan)] hover:underline font-bold"
                        >
                          #{tx.blockNumber.toLocaleString()}
                        </a>
                      </td>
                      <td className="px-4 py-2 text-[var(--muted)] whitespace-nowrap">
                        {timeSince(tx.timestamp)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <a
                          href={`https://explore.tempo.xyz/address/${tx.from}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#9898a8] hover:text-[var(--cyan)] transition-colors text-[12px]"
                        >
                          {tx.from}
                        </a>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {tx.to ? (
                          <a
                            href={`https://explore.tempo.xyz/address/${tx.to}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[#9898a8] hover:text-[var(--cyan)] transition-colors text-[12px]"
                          >
                            {tx.to}
                          </a>
                        ) : (
                          <span className="text-[var(--yellow)] font-bold tracking-wider">
                            CONTRACT CREATE
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[var(--yellow)] font-bold whitespace-nowrap">
                        {parseFloat(tx.value) > 0
                          ? parseFloat(tx.value).toFixed(4)
                          : "0"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
