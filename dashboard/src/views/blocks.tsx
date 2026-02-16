"use client";

import type { DashboardData } from "@/lib/types";
import { IconCube } from "@/lib/icons";
import StatCard from "@/components/stat-card";
import { IconClock, IconBolt, IconFire } from "@/lib/icons";

interface Props {
  data: DashboardData;
}

function formatGas(gas: number): string {
  if (gas >= 1_000_000) return `${(gas / 1_000_000).toFixed(2)}M`;
  if (gas >= 1_000) return `${(gas / 1_000).toFixed(1)}K`;
  return String(gas);
}

function timeSince(ts: number): string {
  const delta = Math.floor(Date.now() / 1000) - ts;
  if (delta < 2) return "JUST NOW";
  if (delta < 60) return `${delta}S AGO`;
  if (delta < 3600) return `${Math.floor(delta / 60)}M AGO`;
  return `${Math.floor(delta / 3600)}H AGO`;
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString("en-US", { hour12: false });
}

export default function BlocksView({ data }: Props) {
  const blocks = [...data.blockHistory].reverse();
  const { network } = data;

  const totalTx = data.blockHistory.reduce((s, b) => s + b.txCount, 0);
  const avgGas = data.blockHistory.length > 0
    ? Math.round(data.blockHistory.reduce((s, b) => s + b.gasUsed, 0) / data.blockHistory.length)
    : 0;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-1.5">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#0c1a2a] flex items-center justify-center">
            <IconCube className="w-4 h-4 text-[var(--cyan)]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold tracking-widest text-[var(--white)]">
              BLOCKS
            </h2>
            <p className="text-[11px] text-[var(--muted)] tracking-wider">
              LATEST {data.blockHistory.length} BLOCKS ON MODERATO TESTNET
            </p>
          </div>
        </div>
        <a
          href="https://explore.tempo.xyz/blocks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--cyan)] tracking-widest hover:underline"
        >
          VIEW ALL ON EXPLORER
        </a>
      </div>

      {/* Stats */}
      <div className="shrink-0 grid grid-cols-4 gap-1.5">
        <StatCard label="LATEST BLOCK" value={`#${data.blockHeight.toLocaleString()}`} icon={<IconCube />} color="cyan" />
        <StatCard label="AVG BLOCK TIME" value={network.blockTime !== null ? `${network.blockTime}S` : "--"} icon={<IconClock />} color="white" />
        <StatCard label="TOTAL TX IN WINDOW" value={totalTx.toLocaleString()} icon={<IconBolt />} color="cyan" />
        <StatCard label="AVG GAS / BLOCK" value={formatGas(avgGas)} icon={<IconFire />} color="yellow" />
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="panel flex flex-col h-full overflow-hidden">
          <div className="overflow-auto min-h-0 flex-1">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0 bg-[var(--surface)] z-10">
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">BLOCK</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">BLOCK HASH</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">TIMESTAMP</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">AGE</th>
                  <th className="text-right px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">TXS</th>
                  <th className="text-right px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">GAS USED</th>
                  <th className="text-right px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">UTIL %</th>
                  <th className="text-right px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">BT</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => {
                  const utilPct = b.gasLimit > 0
                    ? Math.round((b.gasUsed / b.gasLimit) * 10000) / 100
                    : 0;
                  return (
                    <tr key={b.number} className="border-b border-[#141a2d] row-hover">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <a
                          href={`https://explore.tempo.xyz/block/${b.number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--cyan)] font-bold hover:underline"
                        >
                          #{b.number.toLocaleString()}
                        </a>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <a
                          href={`https://explore.tempo.xyz/block/${b.number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#707080] hover:text-[var(--cyan)] transition-colors text-[12px]"
                        >
                          {b.hash}
                        </a>
                      </td>
                      <td className="px-4 py-2 font-mono text-[#9898a8] text-[12px] whitespace-nowrap">
                        {formatTime(b.timestamp)}
                      </td>
                      <td className="px-4 py-2 text-[var(--muted)] whitespace-nowrap">
                        {timeSince(b.timestamp)}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[#dcdce4] font-bold whitespace-nowrap">
                        {b.txCount}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[#b0b0c0] whitespace-nowrap">
                        {formatGas(b.gasUsed)}
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <span className={`font-mono font-bold ${
                          utilPct > 80 ? "text-[var(--rose)]" :
                          utilPct > 50 ? "text-[var(--yellow)]" :
                          "text-[var(--cyan)]"
                        }`}>
                          {utilPct}%
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[var(--muted)] whitespace-nowrap">
                        {b.blockTime !== null ? `${b.blockTime}S` : "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
