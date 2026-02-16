"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { BlockSample } from "@/lib/types";

interface Props {
  blocks: BlockSample[];
}

export default function ChartBlockTime({ blocks }: Props) {
  const data = blocks
    .filter((b) => b.blockTime !== null)
    .map((b) => ({
      block: b.number,
      time: b.blockTime,
    }));

  const avg =
    data.length > 0
      ? Math.round(
          (data.reduce((s, d) => s + (d.time ?? 0), 0) / data.length) * 100
        ) / 100
      : 0;

  return (
    <div className="panel flex flex-col h-full overflow-hidden">
      <div className="panel-header">
        <span className="panel-title">BLOCK TIME</span>
        <span className="text-[12px] text-[var(--cyan)] tracking-wider font-mono">
          AVG {avg}S
        </span>
      </div>
      <div className="flex-1 min-h-0 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="gradBT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              domain={[0, "auto"]}
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
              formatter={(v) => [`${v}S`, "TIME"]}
            />
            <ReferenceLine
              y={avg}
              stroke="#06b6d4"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
            />
            <Area
              type="monotone"
              dataKey="time"
              stroke="#06b6d4"
              strokeWidth={1.5}
              fill="url(#gradBT)"
              dot={false}
              activeDot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
