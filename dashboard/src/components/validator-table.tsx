"use client";

import type { ValidatorData } from "@/lib/types";

interface ValidatorTableProps {
  validators: ValidatorData[];
}

function truncate(s: string, len: number = 10): string {
  if (s.length <= len * 2 + 3) return s;
  return `${s.slice(0, len)}...${s.slice(-len)}`;
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          active ? "bg-[var(--positive)] live-dot" : "bg-[var(--negative)]"
        }`}
      />
      <span
        className={`text-xs font-medium tracking-wider ${
          active ? "text-[var(--positive)]" : "text-[var(--negative)]"
        }`}
      >
        {active ? "ACTIVE" : "INACTIVE"}
      </span>
    </span>
  );
}

export default function ValidatorTable({ validators }: ValidatorTableProps) {
  const sorted = [...validators].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return a.index - b.index;
  });

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm overflow-hidden animate-[slideUp_0.4s_ease-out]">
      <div className="px-5 py-4 border-b border-[var(--border)]">
        <span className="text-xs font-semibold tracking-widest text-[var(--muted)]">
          VALIDATOR SET
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th className="text-left px-5 py-3 font-medium tracking-widest">
                #
              </th>
              <th className="text-left px-5 py-3 font-medium tracking-widest">
                STATUS
              </th>
              <th className="text-left px-5 py-3 font-medium tracking-widest">
                PUBLIC KEY
              </th>
              <th className="text-left px-5 py-3 font-medium tracking-widest">
                VALIDATOR ADDRESS
              </th>
              <th className="text-left px-5 py-3 font-medium tracking-widest">
                INBOUND
              </th>
              <th className="text-left px-5 py-3 font-medium tracking-widest">
                OUTBOUND
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((v) => (
              <tr
                key={v.publicKey}
                className="border-b border-[var(--border)]/50 row-hover"
              >
                <td className="px-5 py-3 text-[var(--muted)] font-mono">
                  {v.index}
                </td>
                <td className="px-5 py-3">
                  <StatusDot active={v.active} />
                </td>
                <td className="px-5 py-3 font-mono text-[var(--foreground)]/80">
                  {truncate(v.publicKey, 8)}
                </td>
                <td className="px-5 py-3 font-mono text-[var(--foreground)]/60">
                  {truncate(v.validatorAddress, 6)}
                </td>
                <td className="px-5 py-3 font-mono text-[var(--foreground)]/60">
                  {v.inboundAddress || "--"}
                </td>
                <td className="px-5 py-3 font-mono text-[var(--foreground)]/60">
                  {v.outboundAddress || "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
