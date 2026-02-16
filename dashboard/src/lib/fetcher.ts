import { client, VALIDATOR_CONFIG_ADDRESS, EPOCH_LENGTH } from "./tempo";
import { validatorConfigAbi } from "./contracts";
import type { DashboardData, ValidatorData, NetworkMetrics } from "./types";

async function fetchNetworkMetrics(): Promise<NetworkMetrics> {
  const latest = await client.getBlock({ blockTag: "latest" });
  const prev = await client.getBlock({
    blockNumber: latest.number - 5n,
  });

  const timeDelta = Number(latest.timestamp - prev.timestamp);
  const blockDelta = Number(latest.number - prev.number);
  const blockTime = blockDelta > 0 ? timeDelta / blockDelta : null;

  let totalTx = 0;
  for (let i = latest.number; i > latest.number - 5n; i--) {
    const b = i === latest.number
      ? latest
      : await client.getBlock({ blockNumber: i });
    totalTx += b.transactions.length;
  }
  const tps = timeDelta > 0 ? totalTx / timeDelta : null;

  const gasUsed = latest.gasUsed;
  const gasLimit = latest.gasLimit;
  const gasUtilization =
    gasLimit > 0n
      ? Math.round(Number((gasUsed * 10000n) / gasLimit)) / 100
      : null;

  return {
    blockTime: blockTime ? Math.round(blockTime * 100) / 100 : null,
    tps: tps ? Math.round(tps * 10) / 10 : null,
    gasUtilization,
    latestBlockTxCount: latest.transactions.length,
    latestBlockGasUsed: gasUsed,
    latestBlockGasLimit: gasLimit,
  };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [validators, blockNumber, nextFullDkg, network] = await Promise.all([
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
    fetchNetworkMetrics(),
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
    network,
    timestamp: Date.now(),
  };
}

export function watchBlocks(onBlock: () => void): () => void {
  return client.watchBlockNumber({
    onBlockNumber: () => onBlock(),
  });
}
