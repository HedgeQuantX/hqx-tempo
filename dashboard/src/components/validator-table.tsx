"use client";

import type { ValidatorData } from "@/lib/types";
import { resolveValidatorName } from "@/lib/validators";

interface ValidatorTableProps {
  validators: ValidatorData[];
  onSelect?: (validator: ValidatorData) => void;
}

function truncate(s: string, len: number = 8): string {
  if (s.length <= len * 2 + 3) return s;
  return `${s.slice(0, len + 2)}...${s.slice(-len)}`;
}

export default function ValidatorTable({ validators, onSelect }: ValidatorTableProps) {
  const sorted = [...validators].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return a.index - b.index;
  });

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm flex flex-col min-h-0 flex-1">
      <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <span className="text-[10px] font-semibold tracking-widest text-[var(--muted)]">
          VALIDATOR SET
        </span>
        <span className="text-[10px] text-[var(--muted)] tracking-wider">
          {validators.length} TOTAL
        </span>
      </div>
      <div className="overflow-y-auto min-h-0 flex-1">
        <table className="w-full text-[11px]">
          <thead className="sticky top-0 bg-[var(--surface)] z-10">
            <tr className="border-b border-[var(--border)] text-[var(--muted)]">
              <th className="text-left px-4 py-2 font-medium tracking-widest w-10">
                #
              </th>
              <th className="text-left px-4 py-2 font-medium tracking-widest">
                NAME
              </th>
              <th className="text-left px-4 py-2 font-medium tracking-widest">
                STATUS
              </th>
              <th className="text-left px-4 py-2 font-medium tracking-widest">
                PUBLIC KEY
              </th>
              <th className="text-left px-4 py-2 font-medium tracking-widest">
                ADDRESS
              </th>
              <th className="text-left px-4 py-2 font-medium tracking-widest">
                ENDPOINT
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((v) => {
              const name = resolveValidatorName(v.validatorAddress);
              return (
                <tr
                  key={v.publicKey}
                  onClick={() => onSelect?.(v)}
                  className="border-b border-[var(--border)]/30 row-hover cursor-pointer"
                >
                  <td className="px-4 py-2 text-[var(--muted)] font-mono">
                    {v.index}
                  </td>
                  <td className="px-4 py-2">
                    {name ? (
                      <span className="text-[var(--cyan)] font-semibold tracking-wider">
                        {name}
                      </span>
                    ) : (
                      <span className="text-[var(--muted)]">--</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          v.active
                            ? "bg-[var(--cyan)] live-dot"
                            : "bg-[var(--rose)]"
                        }`}
                      />
                      <span
                        className={`text-[10px] font-medium tracking-wider ${
                          v.active
                            ? "text-[var(--cyan)]"
                            : "text-[var(--rose)]"
                        }`}
                      >
                        {v.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono text-[var(--white)]/50">
                    {truncate(v.publicKey)}
                  </td>
                  <td className="px-4 py-2 font-mono text-[var(--white)]/30">
                    {truncate(v.validatorAddress, 6)}
                  </td>
                  <td className="px-4 py-2 font-mono text-[var(--white)]/30">
                    {v.inboundAddress || "--"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
