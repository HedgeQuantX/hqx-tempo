"use client";

import type { DashboardData, ValidatorData } from "@/lib/types";
import StatCard from "@/components/stat-card";
import EpochBar from "@/components/epoch-bar";
import ChartBlockTime from "@/components/chart-block-time";
import ChartTps from "@/components/chart-tps";
import ChartGas from "@/components/chart-gas";
import BlockFeed from "@/components/block-feed";
import RecentTransactions from "@/components/recent-transactions";
import ValidatorTable from "@/components/validator-table";
import {
  IconCube,
  IconShield,
  IconClock,
  IconBolt,
  IconFire,
} from "@/lib/icons";

interface Props {
  data: DashboardData;
  onSelectValidator: (v: ValidatorData) => void;
}

export default function OverviewView({ data, onSelectValidator }: Props) {
  const { network } = data;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-1.5 overflow-hidden">
      {/* ROW 1: STATS */}
      <div className="shrink-0 grid grid-cols-6 gap-1.5">
        <StatCard
          label="BLOCK HEIGHT"
          value={data.blockHeight.toLocaleString()}
          icon={<IconCube />}
          color="cyan"
        />
        <StatCard
          label="EPOCH"
          value={data.currentEpoch}
          sub={`${data.epochProgressPct}%`}
          icon={<IconClock />}
          color="white"
        />
        <StatCard
          label="VALIDATORS"
          value={`${data.activeValidators} / ${data.totalValidators}`}
          icon={<IconShield />}
          color="cyan"
        />
        <StatCard
          label="BLOCK TIME"
          value={network.blockTime !== null ? `${network.blockTime}S` : "--"}
          icon={<IconClock />}
          color="white"
        />
        <StatCard
          label="THROUGHPUT"
          value={network.tps !== null ? `${network.tps} TPS` : "--"}
          sub={network.peakTps !== null ? `PEAK ${network.peakTps}` : undefined}
          icon={<IconBolt />}
          color="cyan"
        />
        <StatCard
          label="GAS USAGE"
          value={
            network.gasUtilization !== null
              ? `${network.gasUtilization}%`
              : "--"
          }
          icon={<IconFire />}
          color={
            network.gasUtilization !== null && network.gasUtilization > 80
              ? "rose"
              : network.gasUtilization !== null && network.gasUtilization > 50
                ? "yellow"
                : "white"
          }
        />
      </div>

      <div className="shrink-0">
        <EpochBar
          epoch={data.currentEpoch}
          progress={data.epochProgress}
          progressPct={data.epochProgressPct}
          epochLength={data.epochLength}
          nextFullDkg={data.nextFullDkgEpoch}
        />
      </div>

      {/* ROW 2: CHARTS -- flex-shrink allowed, min-h keeps them visible */}
      <div className="shrink grid grid-cols-3 gap-1.5 min-h-[120px]" style={{ height: 180 }}>
        <div className="min-h-0 overflow-hidden"><ChartBlockTime blocks={data.blockHistory} /></div>
        <div className="min-h-0 overflow-hidden"><ChartTps blocks={data.blockHistory} /></div>
        <div className="min-h-0 overflow-hidden"><ChartGas blocks={data.blockHistory} /></div>
      </div>

      {/* ROW 3: FEEDS -- each grid cell is an isolated overflow container */}
      <div className="flex-1 min-h-0 grid grid-cols-3 gap-1.5">
        <div className="min-h-0 overflow-hidden">
          <BlockFeed blocks={data.blockHistory} />
        </div>
        <div className="min-h-0 overflow-hidden">
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
        <div className="min-h-0 overflow-hidden flex flex-col gap-1.5">
          <ValidatorTable
            validators={data.validators}
            onSelect={onSelectValidator}
          />
        </div>
      </div>
    </div>
  );
}
