"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Props {
  active: number;
  inactive: number;
  total: number;
}

export default function ChartValidators({ active, inactive, total }: Props) {
  const data = [
    { name: "ACTIVE", value: active, color: "#06b6d4" },
    { name: "INACTIVE", value: inactive, color: "#be185d" },
  ];

  const uptimePct = total > 0 ? Math.round((active / total) * 1000) / 10 : 0;

  return (
    <div className="panel flex flex-col shrink-0">
      <div className="panel-header">
        <span className="panel-title">VALIDATORS</span>
        <span className="panel-badge">{uptimePct}% UP</span>
      </div>
      <div className="flex items-center px-3 py-2 gap-2">
        <div className="w-16 h-16 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                dataKey="value"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-base font-bold text-[var(--white)] leading-none">
              {active}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shrink-0" />
            <span className="text-[11px] text-[var(--muted)] tracking-widest">ACTIVE</span>
            <span className="text-[12px] font-bold text-[var(--cyan)] ml-auto">{active}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--rose)] shrink-0" />
            <span className="text-[11px] text-[var(--muted)] tracking-widest">INACTIVE</span>
            <span className="text-[12px] font-bold text-[var(--rose)] ml-auto">{inactive}</span>
          </div>
          <div className="w-full h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--cyan)] rounded-full"
              style={{ width: `${total > 0 ? (active / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
