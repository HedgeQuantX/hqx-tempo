export interface ValidatorData {
  publicKey: string;
  inboundAddress: string;
  outboundAddress: string;
  active: boolean;
  validatorAddress: string;
  index: number;
}

export interface NetworkMetrics {
  blockTime: number | null;     // avg seconds between blocks
  tps: number | null;           // transactions per second
  gasUtilization: number | null; // percentage of gas limit used
  latestBlockTxCount: number;
  latestBlockGasUsed: bigint | null;
  latestBlockGasLimit: bigint | null;
}

export interface DashboardData {
  blockHeight: number;
  currentEpoch: number;
  epochProgress: number;
  epochProgressPct: number;
  epochLength: number;
  nextFullDkgEpoch: number;
  totalValidators: number;
  activeValidators: number;
  inactiveValidators: number;
  validators: ValidatorData[];
  network: NetworkMetrics;
  timestamp: number;
}
