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
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="panel-title">VALIDATOR SET</span>
        <span className="panel-badge">{total} TOTAL</span>
      </div>
      <div className="flex-1 min-h-0 p-3 flex items-center">
        <div className="w-2/5 h-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="82%"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-[var(--white)] leading-none">
              {active}
            </span>
            <span className="text-[8px] text-[var(--muted)] tracking-widest mt-0.5">
              ACTIVE
            </span>
          </div>
        </div>
        <div className="w-3/5 flex flex-col gap-2.5 pl-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)]" />
              <span className="text-[9px] text-[var(--muted)] tracking-widest">ACTIVE</span>
              <span className="text-xs font-bold text-[var(--cyan)] ml-auto">{active}</span>
            </div>
            <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--cyan)] rounded-full"
                style={{ width: `${total > 0 ? (active / total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[var(--rose)]" />
              <span className="text-[9px] text-[var(--muted)] tracking-widest">INACTIVE</span>
              <span className="text-xs font-bold text-[var(--rose)] ml-auto">{inactive}</span>
            </div>
            <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--rose)] rounded-full"
                style={{ width: `${total > 0 ? (inactive / total) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-2 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-[var(--muted)] tracking-widest">UPTIME</span>
              <span className="text-sm font-bold text-[var(--green)]">{uptimePct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
