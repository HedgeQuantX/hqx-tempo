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
  cyan: "border-[#0f2a35]",
  rose: "border-[#2a0f1e]",
  yellow: "border-[#2a2500]",
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
      <div className="flex items-center gap-1.5 text-[var(--muted)] text-[11px] font-medium tracking-widest">
        {icon}
        {label}
      </div>
      <div className={`text-xl font-bold tracking-tight leading-none ${colorMap[color]}`}>
        {value}
      </div>
      {sub && (
        <div className="text-[var(--muted)] text-[11px] tracking-wider leading-none">
          {sub}
        </div>
      )}
    </div>
  );
}
