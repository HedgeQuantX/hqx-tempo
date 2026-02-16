import { client, VALIDATOR_CONFIG_ADDRESS, EPOCH_LENGTH } from "./tempo";
import { validatorConfigAbi } from "./contracts";
import type { DashboardData, ValidatorData } from "./types";

export async function fetchDashboardData(): Promise<DashboardData> {
  const [validators, blockNumber, nextFullDkg] = await Promise.all([
    client.readContract({
      address: VALIDATOR_CONFIG_ADDRESS,
      abi: validatorConfigAbi,
      functionName: "getValidators",
    }),
    client.getBlockNumber(),
    client.readContract({
      address: VALIDATOR_CONFIG_ADDRESS,
      abi: validatorConfigAbi,
      functionName: "getNextFullDkgCeremony",
    }),
  ]);

  const currentEpoch = Number(blockNumber / EPOCH_LENGTH) + 1;
  const epochProgress = Number(blockNumber % EPOCH_LENGTH);
  const epochProgressPct = Math.round(
    (epochProgress / Number(EPOCH_LENGTH)) * 100
  );

  const parsed: ValidatorData[] = validators.map((v) => ({
    publicKey: v.publicKey,
    active: v.active,
    index: Number(v.index),
    validatorAddress: v.validatorAddress,
    inboundAddress: v.inboundAddress,
    outboundAddress: v.outboundAddress,
  }));

  const activeCount = parsed.filter((v) => v.active).length;

  return {
    blockHeight: Number(blockNumber),
    currentEpoch,
    epochProgress,
    epochProgressPct,
    epochLength: Number(EPOCH_LENGTH),
    nextFullDkgEpoch: Number(nextFullDkg),
    totalValidators: parsed.length,
    activeValidators: activeCount,
    inactiveValidators: parsed.length - activeCount,
    validators: parsed,
    timestamp: Date.now(),
  };
}
