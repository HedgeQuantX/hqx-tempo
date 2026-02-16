"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color?: "cyan" | "rose" | "yellow" | "white";
}

const colorMap = {
  cyan: "text-[var(--cyan)]",
  rose: "text-[var(--rose)]",
  yellow: "text-[var(--yellow)]",
  white: "text-[var(--white)]",
};

const borderMap = {
  cyan: "border-[var(--cyan)]/15",
  rose: "border-[var(--rose)]/15",
  yellow: "border-[var(--yellow)]/15",
  white: "border-[var(--border)]",
};

export default function StatCard({
  label,
  value,
  sub,
  icon,
  color = "white",
}: StatCardProps) {
  return (
    <div
      className={`bg-[var(--surface)] border ${borderMap[color]} rounded-sm px-3 py-2 flex flex-col gap-1`}
    >
      <div className="flex items-center gap-1.5 text-[var(--muted)] text-[8px] font-medium tracking-widest">
        {icon}
        {label}
      </div>
      <div className={`text-lg font-bold tracking-tight leading-none ${colorMap[color]}`}>
        {value}
      </div>
      {sub && (
        <div className="text-[var(--muted)] text-[7px] tracking-wider leading-none">
          {sub}
        </div>
      )}
    </div>
  );
}
