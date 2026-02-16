"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import type { BlockSample } from "@/lib/types";

interface Props {
  blocks: BlockSample[];
}

export default function ChartTps({ blocks }: Props) {
  const maxTx = Math.max(...blocks.map((b) => b.txCount), 1);
  const data = blocks.map((b) => ({
    block: b.number,
    tx: b.txCount,
    intensity: b.txCount / maxTx,
  }));

  const total = blocks.reduce((s, b) => s + b.txCount, 0);

  return (
    <div className="panel flex flex-col h-full overflow-hidden">
      <div className="panel-header">
        <span className="panel-title">TX PER BLOCK</span>
        <span className="text-[12px] text-[var(--cyan)] tracking-wider font-mono">
          {total.toLocaleString()} TOTAL
        </span>
      </div>
      <div className="flex-1 min-h-0 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2035" vertical={false} />
            <XAxis
              dataKey="block"
              tick={{ fontSize: 11, fill: "#8b8b9a" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}`}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#8b8b9a" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: "#0f1424",
                border: "1px solid #1a2035",
                borderRadius: 2,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
              labelFormatter={(v) => `BLOCK #${v}`}
              formatter={(v) => [`${v}`, "TRANSACTIONS"]}
            />
            <Bar dataKey="tx" radius={[2, 2, 0, 0]} maxBarSize={14}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={`rgba(6, 182, 212, ${0.35 + entry.intensity * 0.65})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
