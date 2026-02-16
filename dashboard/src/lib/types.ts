export interface ValidatorData {
  publicKey: string;
  inboundAddress: string;
  outboundAddress: string;
  active: boolean;
  validatorAddress: string;
  index: number;
}

export interface NetworkMetrics {
  blockTime: number | null;
  tps: number | null;
  gasUtilization: number | null;
  latestBlockTxCount: number;
  latestBlockGasUsed: bigint | null;
  latestBlockGasLimit: bigint | null;
  peakTps: number | null;
  avgGasPerBlock: number;
  totalTxInWindow: number;
}

/** Single block snapshot for chart history. */
export interface BlockSample {
  number: number;
  timestamp: number;
  txCount: number;
  gasUsed: number;
  gasLimit: number;
  blockTime: number | null;
  miner: string;
  hash: string;
}

/** Recent on-chain transaction summary. */
export interface RecentTx {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: number;
  timestamp: number;
  gasUsed: number | null;
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
  blockHistory: BlockSample[];
  recentTransactions: RecentTx[];
  timestamp: number;
}
