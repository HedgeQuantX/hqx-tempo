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
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-5 animate-[slideUp_0.4s_ease-out]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium tracking-widest text-[var(--muted)]">
            EPOCH {epoch}
          </span>
          <span className="text-xs text-[var(--muted)]">
            {progress} / {epochLength} BLOCKS
          </span>
        </div>
        <span className="text-xs text-[var(--muted)] tracking-wider">
          NEXT FULL DKG: EPOCH {nextFullDkg}
        </span>
      </div>
      <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-[var(--muted)] tracking-wider">
          {progressPct}% COMPLETE
        </span>
        <span className="text-[10px] text-[var(--muted)] tracking-wider">
          ~{Math.round((epochLength - progress) * 2)} SEC REMAINING
        </span>
      </div>
    </div>
  );
}
