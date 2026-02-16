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
  cyan: "border-[var(--cyan)]/20",
  rose: "border-[var(--rose)]/20",
  yellow: "border-[var(--yellow)]/20",
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
      className={`bg-[var(--surface)] border ${borderMap[color]} rounded-sm p-4 flex flex-col gap-2`}
    >
      <div className="flex items-center gap-2 text-[var(--muted)] text-[10px] font-medium tracking-widest">
        {icon}
        {label}
      </div>
      <div className={`text-2xl font-bold tracking-tight ${colorMap[color]}`}>
        {value}
      </div>
      {sub && (
        <div className="text-[var(--muted)] text-[10px] tracking-wider">
          {sub}
        </div>
      )}
    </div>
  );
}
