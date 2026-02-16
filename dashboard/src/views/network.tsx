"use client";

import type { DashboardData } from "@/lib/types";
import ChartBlockTime from "@/components/chart-block-time";
import ChartTps from "@/components/chart-tps";
import ChartGas from "@/components/chart-gas";
import StatCard from "@/components/stat-card";
import {
  IconChart,
  IconClock,
  IconBolt,
  IconCube,
} from "@/lib/icons";

interface Props {
  data: DashboardData;
}

export default function NetworkView({ data }: Props) {
  const { network } = data;
  const samples = data.blockHistory;

  const blockTimes = samples.filter((b) => b.blockTime !== null).map((b) => b.blockTime!);
  const minBt = blockTimes.length > 0 ? Math.min(...blockTimes) : 0;
  const maxBt = blockTimes.length > 0 ? Math.max(...blockTimes) : 0;
  const avgBt = blockTimes.length > 0
    ? Math.round((blockTimes.reduce((s, v) => s + v, 0) / blockTimes.length) * 100) / 100
    : 0;

  const gasValues = samples.map((b) =>
    b.gasLimit > 0 ? Math.round((b.gasUsed / b.gasLimit) * 10000) / 100 : 0
  );
  const avgGas = gasValues.length > 0
    ? Math.round((gasValues.reduce((s, v) => s + v, 0) / gasValues.length) * 100) / 100
    : 0;
  const maxGas = gasValues.length > 0 ? Math.max(...gasValues) : 0;

  const txCounts = samples.map((b) => b.txCount);
  const totalTx = txCounts.reduce((s, v) => s + v, 0);
  const avgTxPerBlock = txCounts.length > 0 ? Math.round(totalTx / txCounts.length) : 0;
  const maxTxInBlock = Math.max(...txCounts, 0);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-1.5">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[#0c1a2a] flex items-center justify-center">
            <IconChart className="w-4 h-4 text-[var(--cyan)]" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold tracking-widest text-[var(--white)]">
              NETWORK
            </h2>
            <p className="text-[11px] text-[var(--muted)] tracking-wider">
              PERFORMANCE METRICS / {samples.length}-BLOCK WINDOW
            </p>
          </div>
        </div>
        <a
          href="https://explore.tempo.xyz/stats"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--cyan)] tracking-widest hover:underline"
        >
          EXPLORER STATS
        </a>
      </div>

      {/* Stats row */}
      <div className="shrink-0 grid grid-cols-6 gap-1.5">
        <StatCard label="AVG BLOCK TIME" value={`${avgBt}S`} icon={<IconClock />} color="cyan" />
        <StatCard label="MIN BLOCK TIME" value={`${minBt}S`} icon={<IconClock />} color="white" />
        <StatCard label="MAX BLOCK TIME" value={`${maxBt}S`} icon={<IconClock />} color={maxBt > 5 ? "rose" : "white"} />
        <StatCard label="CURRENT TPS" value={network.tps !== null ? `${network.tps}` : "--"} icon={<IconBolt />} color="cyan" />
        <StatCard label="PEAK TPS" value={network.peakTps !== null ? `${network.peakTps}` : "--"} icon={<IconBolt />} color="yellow" />
        <StatCard label="TOTAL TX" value={totalTx.toLocaleString()} icon={<IconCube />} color="white" />
      </div>

      {/* Charts -- allow shrink, set preferred height */}
      <div className="shrink grid grid-cols-3 gap-1.5 min-h-[100px]" style={{ height: 220 }}>
        <div className="min-h-0 overflow-hidden"><ChartBlockTime blocks={data.blockHistory} /></div>
        <div className="min-h-0 overflow-hidden"><ChartTps blocks={data.blockHistory} /></div>
        <div className="min-h-0 overflow-hidden"><ChartGas blocks={data.blockHistory} /></div>
      </div>

      {/* Bottom analysis panels */}
      <div className="flex-1 min-h-0 grid grid-cols-3 gap-1.5">
        <div className="min-h-0 overflow-hidden">
          <div className="panel flex flex-col h-full overflow-hidden">
            <div className="panel-header">
              <span className="panel-title">BLOCK TIME ANALYSIS</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-2">
              <MetricRow label="AVERAGE" value={`${avgBt}S`} color="text-[var(--cyan)]" />
              <MetricRow label="MINIMUM" value={`${minBt}S`} />
              <MetricRow label="MAXIMUM" value={`${maxBt}S`} />
              <MetricRow label="STDDEV" value={`${stddev(blockTimes)}S`} />
              <MetricRow label="WINDOW SIZE" value={`${blockTimes.length} BLOCKS`} />
              <MetricRow label="TARGET" value="~1.0S" color="text-[var(--muted)]" />
            </div>
          </div>
        </div>

        <div className="min-h-0 overflow-hidden">
          <div className="panel flex flex-col h-full overflow-hidden">
            <div className="panel-header">
              <span className="panel-title">THROUGHPUT ANALYSIS</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-2">
              <MetricRow label="CURRENT TPS" value={network.tps !== null ? `${network.tps}` : "--"} color="text-[var(--cyan)]" />
              <MetricRow label="PEAK TPS" value={network.peakTps !== null ? `${network.peakTps}` : "--"} color="text-[var(--yellow)]" />
              <MetricRow label="AVG TX / BLOCK" value={`${avgTxPerBlock}`} />
              <MetricRow label="MAX TX / BLOCK" value={`${maxTxInBlock}`} />
              <MetricRow label="TOTAL TX IN WINDOW" value={totalTx.toLocaleString()} />
              <MetricRow label="BLOCK WINDOW" value={`${samples.length} BLOCKS`} />
            </div>
          </div>
        </div>

        <div className="min-h-0 overflow-hidden">
          <div className="panel flex flex-col h-full overflow-hidden">
            <div className="panel-header">
              <span className="panel-title">GAS ANALYSIS</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-2">
              <MetricRow label="AVG UTILIZATION" value={`${avgGas}%`} color="text-[var(--yellow)]" />
              <MetricRow label="PEAK UTILIZATION" value={`${maxGas}%`} color={maxGas > 80 ? "text-[var(--rose)]" : "text-[var(--yellow)]"} />
              <MetricRow label="AVG GAS / BLOCK" value={network.avgGasPerBlock.toLocaleString()} />
              <MetricRow label="LATEST GAS USED" value={network.latestBlockGasUsed !== null ? Number(network.latestBlockGasUsed).toLocaleString() : "--"} />
              <MetricRow label="LATEST GAS LIMIT" value={network.latestBlockGasLimit !== null ? Number(network.latestBlockGasLimit).toLocaleString() : "--"} />
              <MetricRow label="LATEST BLOCK TXS" value={`${network.latestBlockTxCount}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function stddev(values: number[]): string {
  if (values.length < 2) return "0";
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1);
  return (Math.round(Math.sqrt(variance) * 100) / 100).toFixed(2);
}

function MetricRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#141a2d]">
      <span className="text-[12px] text-[var(--muted)] tracking-widest">{label}</span>
      <span className={`text-[13px] font-mono font-bold ${color ?? "text-[#dcdce4]"}`}>
        {value}
      </span>
    </div>
  );
}
