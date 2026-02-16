"use client";

import type { DashboardData, ValidatorData } from "@/lib/types";
import { resolveValidatorName } from "@/lib/validators";
import ChartValidators from "@/components/chart-validators";
import StatCard from "@/components/stat-card";
import { IconShield } from "@/lib/icons";

interface Props {
  data: DashboardData;
  onSelectValidator: (v: ValidatorData) => void;
}

export default function ValidatorsView({ data, onSelectValidator }: Props) {
  const sorted = [...data.validators].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return a.index - b.index;
  });

  const uptimePct = data.totalValidators > 0
    ? Math.round((data.activeValidators / data.totalValidators) * 1000) / 10
    : 0;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-1.5">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#0c1a2a] flex items-center justify-center">
            <IconShield className="w-4 h-4 text-[var(--cyan)]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold tracking-widest text-[var(--white)]">
              VALIDATORS
            </h2>
            <p className="text-[11px] text-[var(--muted)] tracking-wider">
              {data.activeValidators} ACTIVE / {data.totalValidators} TOTAL ON MODERATO
            </p>
          </div>
        </div>
        <a
          href="https://explore.tempo.xyz/validators"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--cyan)] tracking-widest hover:underline"
        >
          VIEW ON EXPLORER
        </a>
      </div>

      {/* Stats row */}
      <div className="shrink-0 grid grid-cols-4 gap-1.5">
        <StatCard label="ACTIVE" value={String(data.activeValidators)} icon={<IconShield />} color="cyan" />
        <StatCard label="INACTIVE" value={String(data.inactiveValidators)} icon={<IconShield />} color="rose" />
        <StatCard label="UPTIME" value={`${uptimePct}%`} icon={<IconShield />} color="cyan" />
        <div className="panel overflow-hidden">
          <ChartValidators
            active={data.activeValidators}
            inactive={data.inactiveValidators}
            total={data.totalValidators}
          />
        </div>
      </div>

      {/* Full table */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="panel flex flex-col h-full overflow-hidden">
          <div className="overflow-auto min-h-0 flex-1">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0 bg-[var(--surface)] z-10">
                <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">#</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">NAME</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">STATUS</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">VALIDATOR ADDRESS</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">ED25519 PUBLIC KEY</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">INBOUND</th>
                  <th className="text-left px-4 py-2.5 font-medium tracking-widest whitespace-nowrap">OUTBOUND</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((v) => {
                  const name = resolveValidatorName(v.validatorAddress);
                  return (
                    <tr
                      key={v.publicKey}
                      onClick={() => onSelectValidator(v)}
                      className="border-b border-[#141a2d] row-hover cursor-pointer"
                    >
                      <td className="px-4 py-2 text-[var(--muted)] font-mono font-bold whitespace-nowrap">
                        {v.index}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {name ? (
                          <a
                            href={`https://explore.tempo.xyz/address/${v.validatorAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[var(--cyan)] font-bold tracking-wider hover:underline"
                          >
                            {name}
                          </a>
                        ) : (
                          <span className="text-[var(--muted)]">UNKNOWN</span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              v.active ? "bg-[var(--cyan)] live-dot" : "bg-[var(--rose)]"
                            }`}
                          />
                          <span
                            className={`text-[13px] font-bold tracking-wider ${
                              v.active ? "text-[var(--cyan)]" : "text-[var(--rose)]"
                            }`}
                          >
                            {v.active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono text-[12px] whitespace-nowrap">
                        <a
                          href={`https://explore.tempo.xyz/address/${v.validatorAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#9898a8] hover:text-[var(--cyan)] transition-colors"
                        >
                          {v.validatorAddress}
                        </a>
                      </td>
                      <td className="px-4 py-2 font-mono text-[12px] text-[#707080] whitespace-nowrap">
                        {v.publicKey}
                      </td>
                      <td className="px-4 py-2 font-mono text-[12px] text-[#707080] whitespace-nowrap">
                        {v.inboundAddress || "--"}
                      </td>
                      <td className="px-4 py-2 font-mono text-[12px] text-[#707080] whitespace-nowrap">
                        {v.outboundAddress || "--"}
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
