export interface ValidatorData {
  publicKey: string;
  inboundAddress: string;
  outboundAddress: string;
  active: boolean;
  validatorAddress: string;
  index: number;
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
  timestamp: number;
}
