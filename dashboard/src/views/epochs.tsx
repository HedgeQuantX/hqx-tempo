"use client";

import type { DashboardData } from "@/lib/types";
import EpochBar from "@/components/epoch-bar";
import { IconArrowPath } from "@/lib/icons";

interface Props {
  data: DashboardData;
}

export default function EpochsView({ data }: Props) {
  const blocksRemaining = data.epochLength - data.epochProgress;
  const estimatedSecondsLeft = blocksRemaining * 2;
  const minutesLeft = Math.floor(estimatedSecondsLeft / 60);
  const hoursLeft = Math.floor(minutesLeft / 60);

  const epochsUntilDkg = data.nextFullDkgEpoch - data.currentEpoch;
  const blocksUntilDkg = epochsUntilDkg * data.epochLength - data.epochProgress;
  const dkgSecondsLeft = blocksUntilDkg * 2;
  const dkgMinutesLeft = Math.floor(dkgSecondsLeft / 60);
  const dkgHoursLeft = Math.floor(dkgMinutesLeft / 60);

  const currentEpochStart = (data.currentEpoch - 1) * data.epochLength;
  const epochs = Array.from({ length: 10 }, (_, i) => {
    const epochNum = data.currentEpoch - i;
    if (epochNum < 1) return null;
    const start = (epochNum - 1) * data.epochLength;
    const end = start + data.epochLength - 1;
    const isCurrent = epochNum === data.currentEpoch;
    return { epochNum, start, end, isCurrent };
  }).filter(Boolean) as { epochNum: number; start: number; end: number; isCurrent: boolean }[];

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-1.5">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#0c1a2a] flex items-center justify-center">
            <IconArrowPath className="w-4 h-4 text-[var(--cyan)]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold tracking-widest text-[var(--white)]">
              EPOCHS & DKG
            </h2>
            <p className="text-[11px] text-[var(--muted)] tracking-wider">
              EPOCH PROGRESSION & DKG CEREMONY TRACKING
            </p>
          </div>
        </div>
        <a
          href="https://docs.tempo.xyz/the-tempo-network/architecture/consensus"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--cyan)] tracking-widest hover:underline"
        >
          CONSENSUS DOCS
        </a>
      </div>

      {/* Epoch bar */}
      <div className="shrink-0">
        <EpochBar
          epoch={data.currentEpoch}
          progress={data.epochProgress}
          progressPct={data.epochProgressPct}
          epochLength={data.epochLength}
          nextFullDkg={data.nextFullDkgEpoch}
        />
      </div>

      {/* Stats */}
      <div className="shrink-0 grid grid-cols-4 gap-1.5">
        <div className="panel px-5 py-3">
          <div className="text-[11px] text-[var(--muted)] tracking-widest mb-1">CURRENT EPOCH</div>
          <div className="text-2xl font-bold text-[var(--cyan)]">{data.currentEpoch}</div>
        </div>
        <div className="panel px-5 py-3">
          <div className="text-[11px] text-[var(--muted)] tracking-widest mb-1">EPOCH PROGRESS</div>
          <div className="text-2xl font-bold text-[var(--white)]">{data.epochProgressPct}%</div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">
            {data.epochProgress.toLocaleString()} / {data.epochLength.toLocaleString()} BLOCKS
          </div>
        </div>
        <div className="panel px-5 py-3">
          <div className="text-[11px] text-[var(--muted)] tracking-widest mb-1">EST. TIME REMAINING</div>
          <div className="text-2xl font-bold text-[var(--yellow)]">
            {hoursLeft > 0 ? `${hoursLeft}H ${minutesLeft % 60}M` : `${minutesLeft}M`}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">
            ~{blocksRemaining.toLocaleString()} BLOCKS LEFT
          </div>
        </div>
        <div className="panel px-5 py-3">
          <div className="text-[11px] text-[var(--muted)] tracking-widest mb-1">NEXT DKG CEREMONY</div>
          <div className="text-2xl font-bold text-[var(--rose)]">EPOCH {data.nextFullDkgEpoch}</div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">
            {epochsUntilDkg} EPOCHS / ~{dkgHoursLeft}H AWAY
          </div>
        </div>
      </div>

      {/* Config + epoch history table */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-1.5">
        {/* Config */}
        <div className="min-h-0 overflow-hidden">
          <div className="panel flex flex-col h-full overflow-hidden">
            <div className="panel-header">
              <span className="panel-title">EPOCH CONFIGURATION</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-2">
              <ConfigRow label="EPOCH LENGTH" value={`${data.epochLength.toLocaleString()} BLOCKS`} />
              <ConfigRow label="EPOCH DURATION" value={`~${Math.round(data.epochLength * 2 / 3600)}H (@ ~2S/BLOCK)`} />
              <ConfigRow label="CHAIN" value="MODERATO TESTNET" />
              <ConfigRow label="CHAIN ID" value="42431" />
              <ConfigRow label="CONSENSUS" value="TSS / DKG" />
              <ConfigRow label="BLOCK TIME TARGET" value="~1-2S" />
              <ConfigRow label="VALIDATOR CONFIG" value="0XCCCC...0000" href="https://explore.tempo.xyz/address/0xCccCcCCC00000000000000000000000000000000" />
              <ConfigRow label="CURRENT BLOCK" value={`#${data.blockHeight.toLocaleString()}`} href={`https://explore.tempo.xyz/block/${data.blockHeight}`} />
              <ConfigRow label="EPOCH START BLOCK" value={`#${currentEpochStart.toLocaleString()}`} href={`https://explore.tempo.xyz/block/${currentEpochStart}`} />
              <ConfigRow label="NEXT DKG EPOCH" value={`${data.nextFullDkgEpoch}`} />
              <ConfigRow label="DKG BLOCKS AWAY" value={blocksUntilDkg.toLocaleString()} />
            </div>
          </div>
        </div>

        {/* Epoch history */}
        <div className="min-h-0 overflow-hidden">
          <div className="panel flex flex-col h-full overflow-hidden">
            <div className="panel-header">
              <span className="panel-title">RECENT EPOCHS</span>
              <span className="panel-badge">{epochs.length} EPOCHS</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 bg-[var(--surface)] z-10">
                  <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                    <th className="text-left px-5 py-2.5 font-medium tracking-widest">EPOCH</th>
                    <th className="text-left px-5 py-2.5 font-medium tracking-widest">START BLOCK</th>
                    <th className="text-left px-5 py-2.5 font-medium tracking-widest">END BLOCK</th>
                    <th className="text-left px-5 py-2.5 font-medium tracking-widest">BLOCKS</th>
                    <th className="text-left px-5 py-2.5 font-medium tracking-widest">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {epochs.map((ep) => (
                    <tr key={ep.epochNum} className="border-b border-[#141a2d] row-hover">
                      <td className="px-5 py-2.5 text-[var(--cyan)] font-bold text-[14px]">
                        {ep.epochNum}
                      </td>
                      <td className="px-5 py-2.5">
                        <a
                          href={`https://explore.tempo.xyz/block/${ep.start}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#9898a8] hover:text-[var(--cyan)] transition-colors"
                        >
                          #{ep.start.toLocaleString()}
                        </a>
                      </td>
                      <td className="px-5 py-2.5">
                        <a
                          href={`https://explore.tempo.xyz/block/${ep.end}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#9898a8] hover:text-[var(--cyan)] transition-colors"
                        >
                          #{ep.end.toLocaleString()}
                        </a>
                      </td>
                      <td className="px-5 py-2.5 font-mono text-[#dcdce4]">
                        {data.epochLength.toLocaleString()}
                      </td>
                      <td className="px-5 py-2.5">
                        {ep.isCurrent ? (
                          <span className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-[var(--cyan)] live-dot" />
                            <span className="text-[var(--cyan)] text-[13px] font-bold tracking-wider">
                              CURRENT
                            </span>
                          </span>
                        ) : (
                          <span className="text-[var(--green)] text-[13px] font-bold tracking-wider">
                            COMPLETED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#141a2d]">
      <span className="text-[12px] text-[var(--muted)] tracking-widest">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-mono text-[var(--cyan)] hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-[13px] font-mono text-[#dcdce4]">{value}</span>
      )}
    </div>
  );
}
