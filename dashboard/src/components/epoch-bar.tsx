"use client";

interface EpochBarProps {
  epoch: number;
  progress: number;
  progressPct: number;
  epochLength: number;
  nextFullDkg: number;
}

export default function EpochBar({
  epoch,
  progress,
  progressPct,
  epochLength,
  nextFullDkg,
}: EpochBarProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold tracking-widest text-[var(--cyan)]">
            EPOCH {epoch}
          </span>
          <span className="text-[10px] text-[var(--muted)]">
            {progress} / {epochLength}
          </span>
        </div>
        <span className="text-[10px] text-[var(--muted)] tracking-wider">
          NEXT DKG: EPOCH {nextFullDkg}
        </span>
      </div>
      <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--cyan)] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-[var(--muted)] tracking-wider">
          {progressPct}%
        </span>
        <span className="text-[9px] text-[var(--muted)] tracking-wider">
          ~{Math.round((epochLength - progress) * 2)}S
        </span>
      </div>
    </div>
  );
}
