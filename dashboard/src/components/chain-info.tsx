"use client";

import type { DashboardData } from "@/lib/types";
import { IconGlobe, IconDatabase, IconLink, IconShield } from "@/lib/icons";

interface Props {
  data: DashboardData;
}

function Row({
  label,
  value,
  mono,
  color,
}: {
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[9px] text-[var(--muted)] tracking-widest">{label}</span>
      <span
        className={`text-[10px] ${color ?? "text-[var(--white)]/70"} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ChainInfo({ data }: Props) {
  const { network } = data;

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <IconGlobe className="w-3 h-3 text-[var(--cyan)]" />
          <span className="panel-title">CHAIN INFO</span>
        </div>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-2">
          <IconDatabase className="w-3 h-3 text-[var(--muted)]" />
          <span className="text-[9px] text-[var(--muted)] tracking-widest">NETWORK</span>
        </div>
        <Row label="CHAIN" value="TEMPO MODERATO" />
        <Row label="CHAIN ID" value="42431" mono />
        <Row label="CURRENCY" value="USD" />
        <Row label="CONSENSUS" value="TSS / DKG" />

        <div className="flex items-center gap-2 mt-3 mb-2">
          <IconLink className="w-3 h-3 text-[var(--muted)]" />
          <span className="text-[9px] text-[var(--muted)] tracking-widest">ENDPOINTS</span>
        </div>
        <Row label="RPC" value="RPC.MODERATO.TEMPO.XYZ" mono />
        <Row label="WSS" value="WSS://RPC.MODERATO.TEMPO.XYZ" mono />
        <Row label="EXPLORER" value="EXPLORE.TEMPO.XYZ" mono />

        <div className="flex items-center gap-2 mt-3 mb-2">
          <IconShield className="w-3 h-3 text-[var(--muted)]" />
          <span className="text-[9px] text-[var(--muted)] tracking-widest">METRICS</span>
        </div>
        <Row
          label="BLOCK TIME"
          value={network.blockTime !== null ? `${network.blockTime}S` : "--"}
          color="text-[var(--cyan)]"
        />
        <Row
          label="THROUGHPUT"
          value={network.tps !== null ? `${network.tps} TPS` : "--"}
          color="text-[var(--cyan)]"
        />
        <Row
          label="PEAK TPS"
          value={network.peakTps !== null ? `${network.peakTps} TPS` : "--"}
          color="text-[var(--yellow)]"
        />
        <Row
          label="AVG GAS/BLOCK"
          value={network.avgGasPerBlock.toLocaleString()}
          mono
        />
        <Row
          label="EPOCH LENGTH"
          value={`${data.epochLength.toLocaleString()} BLOCKS`}
          mono
        />
        <Row
          label="NEXT DKG"
          value={`EPOCH ${data.nextFullDkgEpoch}`}
          color="text-[var(--rose)]"
        />
      </div>
    </div>
  );
}
