"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: "default" | "positive" | "negative" | "warning";
}

const accentMap = {
  default: "border-[var(--border)]",
  positive: "border-[var(--positive)]/30",
  negative: "border-[var(--negative)]/30",
  warning: "border-[var(--warning)]/30",
};

const valueMap = {
  default: "text-[var(--foreground)]",
  positive: "text-[var(--positive)]",
  negative: "text-[var(--negative)]",
  warning: "text-[var(--warning)]",
};

export default function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "default",
}: StatCardProps) {
  return (
    <div
      className={`relative bg-[var(--surface)] border ${accentMap[accent]} rounded-sm p-5 flex flex-col gap-3 animate-[slideUp_0.4s_ease-out]`}
    >
      <div className="flex items-center gap-2 text-[var(--muted)] text-xs font-medium tracking-widest">
        {icon}
        {label}
      </div>
      <div className={`text-3xl font-bold tracking-tight ${valueMap[accent]}`}>
        {value}
      </div>
      {sub && (
        <div className="text-[var(--muted)] text-xs tracking-wider">{sub}</div>
      )}
    </div>
  );
}
