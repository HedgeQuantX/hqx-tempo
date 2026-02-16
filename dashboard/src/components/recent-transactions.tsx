"use client";

import type { RecentTx } from "@/lib/types";
import { IconBolt } from "@/lib/icons";

interface Props {
  transactions: RecentTx[];
}

function truncate(s: string, len: number = 6): string {
  if (s.length <= len * 2 + 3) return s;
  return `${s.slice(0, len + 2)}...${s.slice(-len)}`;
}

function timeSince(ts: number): string {
  const delta = Math.floor(Date.now() / 1000) - ts;
  if (delta < 2) return "JUST NOW";
  if (delta < 60) return `${delta}S AGO`;
  if (delta < 3600) return `${Math.floor(delta / 60)}M AGO`;
  return `${Math.floor(delta / 3600)}H AGO`;
}

export default function RecentTransactions({ transactions }: Props) {
  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <IconBolt className="w-3 h-3 text-[var(--yellow)]" />
          <span className="panel-title">LATEST TRANSACTIONS</span>
        </div>
        <span className="panel-badge">{transactions.length} TX</span>
      </div>
      <div className="overflow-y-auto min-h-0 flex-1">
        {transactions.length === 0 ? (
          <div className="px-4 py-8 text-center text-[10px] text-[var(--muted)] tracking-widest">
            NO TRANSACTIONS IN RECENT BLOCKS
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.hash}
              className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)]/30 row-hover fade-in"
            >
              {/* TX icon */}
              <div className="w-8 h-8 rounded-sm bg-[var(--yellow)]/10 flex items-center justify-center shrink-0">
                <IconBolt className="w-3.5 h-3.5 text-[var(--yellow)]" />
              </div>

              {/* Hash + from/to */}
              <div className="flex flex-col min-w-0 flex-1">
                <a
                  href={`https://explore.tempo.xyz/receipt/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-[var(--cyan)] hover:underline truncate"
                >
                  {truncate(tx.hash, 8)}
                </a>
                <div className="flex items-center gap-1 text-[8px] text-[var(--muted)] tracking-wider">
                  <span className="font-mono">{truncate(tx.from, 4)}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5 shrink-0 opacity-40">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                  </svg>
                  <span className="font-mono">
                    {tx.to ? truncate(tx.to, 4) : "CREATE"}
                  </span>
                </div>
              </div>

              {/* Value + age */}
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[10px] font-mono text-[var(--yellow)] font-bold">
                  {parseFloat(tx.value) > 0
                    ? `${parseFloat(tx.value).toFixed(2)}`
                    : "0"}
                </span>
                <span className="text-[8px] text-[var(--muted)] tracking-wider">
                  {timeSince(tx.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
