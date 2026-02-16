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
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm px-3 py-1.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold tracking-widest text-[var(--cyan)]">
            EPOCH {epoch}
          </span>
          <span className="text-[11px] text-[var(--muted)]">
            {progress.toLocaleString()} / {epochLength.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-[var(--muted)] tracking-wider">
            ~{Math.round((epochLength - progress) * 2)}S LEFT
          </span>
          <span className="text-[11px] text-[var(--muted)] tracking-wider">
            NEXT DKG: EPOCH {nextFullDkg}
          </span>
        </div>
      </div>
      <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--cyan)] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
