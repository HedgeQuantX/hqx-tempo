"use client";

import type { BlockSample } from "@/lib/types";
import { IconCube } from "@/lib/icons";

interface Props {
  blocks: BlockSample[];
}

function truncate(s: string, n: number = 8): string {
  if (s.length <= n * 2 + 3) return s;
  return `${s.slice(0, n + 2)}...${s.slice(-n)}`;
}

function timeSince(ts: number): string {
  const delta = Math.floor(Date.now() / 1000) - ts;
  if (delta < 2) return "JUST NOW";
  if (delta < 60) return `${delta}S AGO`;
  if (delta < 3600) return `${Math.floor(delta / 60)}M AGO`;
  return `${Math.floor(delta / 3600)}H AGO`;
}

function formatGas(gas: number): string {
  if (gas >= 1_000_000) return `${(gas / 1_000_000).toFixed(1)}M`;
  if (gas >= 1_000) return `${(gas / 1_000).toFixed(0)}K`;
  return String(gas);
}

export default function BlockFeed({ blocks }: Props) {
  const sorted = [...blocks].reverse(); // newest first

  return (
    <div className="panel flex flex-col h-full min-h-0 overflow-hidden">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <IconCube className="w-3 h-3 text-[var(--cyan)]" />
          <span className="panel-title">LATEST BLOCKS</span>
        </div>
        <span className="panel-badge">{blocks.length} BLOCKS</span>
      </div>
      <div className="overflow-y-auto min-h-0 flex-1">
        {sorted.map((b) => (
          <div
            key={b.number}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-[#141a2d] row-hover fade-in"
          >
            {/* Block icon + number */}
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <div className="w-8 h-8 rounded-sm bg-[#0c1a2a] flex items-center justify-center shrink-0">
                <IconCube className="w-3.5 h-3.5 text-[var(--cyan)]" />
              </div>
              <div className="flex flex-col min-w-0">
                <a
                  href={`https://explore.tempo.xyz/block/${b.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-bold text-[var(--cyan)] hover:underline"
                >
                  #{b.number.toLocaleString()}
                </a>
                <span className="text-[11px] text-[var(--muted)] tracking-wider">
                  {timeSince(b.timestamp)}
                </span>
              </div>
            </div>

            {/* Hash */}
            <a
              href={`https://explore.tempo.xyz/block/${b.number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-[#404050] hover:text-[var(--cyan)] hidden xl:block flex-1 truncate transition-colors"
            >
              {truncate(b.hash, 10)}
            </a>

            {/* Stats */}
            <div className="flex items-center gap-3 ml-auto shrink-0">
              <div className="text-right">
                <div className="text-[12px] font-bold text-[#c8c8d0]">
                  {b.txCount} TX
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  {formatGas(b.gasUsed)} GAS
                </div>
              </div>
              {b.blockTime !== null && (
                <span className="text-[11px] font-mono text-[var(--muted)] w-10 text-right">
                  {b.blockTime}S
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
