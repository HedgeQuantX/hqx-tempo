"use client";

import type { DashboardData } from "@/lib/types";
import { IconGlobe } from "@/lib/icons";

interface Props {
  data: DashboardData;
}

function Row({ label, value, color, href }: { label: string; value: string; color?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] text-[var(--muted)] tracking-widest">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-mono text-[var(--cyan)] hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className={`text-[11px] font-mono ${color ?? "text-[#9898a8]"}`}>
          {value}
        </span>
      )}
    </div>
  );
}

export default function ChainInfo({ data }: Props) {
  const { network } = data;

  return (
    <div className="panel flex flex-col h-full min-h-0 overflow-hidden">
      <div className="panel-header">
        <div className="flex items-center gap-1.5">
          <IconGlobe className="w-3 h-3 text-[var(--cyan)]" />
          <span className="panel-title">CHAIN INFO</span>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-1.5">
        <Row label="CHAIN" value="MODERATO" />
        <Row label="CHAIN ID" value="42431" />
        <Row label="CURRENCY" value="USD" />
        <Row label="CONSENSUS" value="TSS / DKG" href="https://docs.tempo.xyz/the-tempo-network/architecture/consensus" />
        <Row label="BLOCK TIME" value={network.blockTime !== null ? `${network.blockTime}S` : "--"} color="text-[var(--cyan)]" />
        <Row label="TPS" value={network.tps !== null ? `${network.tps}` : "--"} color="text-[var(--cyan)]" />
        <Row label="PEAK TPS" value={network.peakTps !== null ? `${network.peakTps}` : "--"} color="text-[var(--yellow)]" />
        <Row label="AVG GAS" value={network.avgGasPerBlock.toLocaleString()} />
        <Row label="EPOCH LEN" value={`${data.epochLength.toLocaleString()}`} />
        <Row label="NEXT DKG" value={`EPOCH ${data.nextFullDkgEpoch}`} color="text-[var(--rose)]" />
        <Row label="RPC" value="RPC.MODERATO.TEMPO.XYZ" href="https://rpc.moderato.tempo.xyz" />
        <Row label="WSS" value="WSS://RPC.MODERATO.TEMPO.XYZ" href="wss://rpc.moderato.tempo.xyz" />
        <Row label="EXPLORER" value="EXPLORE.TEMPO.XYZ" href="https://explore.tempo.xyz" />
        <Row label="DOCS" value="DOCS.TEMPO.XYZ" href="https://docs.tempo.xyz" />
        <Row label="GITHUB" value="GITHUB.COM/TEMPOXYZ" href="https://github.com/tempoxyz/tempo" />
      </div>
    </div>
  );
}
