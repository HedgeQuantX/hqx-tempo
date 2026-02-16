import { formatEther } from "viem";
import { client, VALIDATOR_CONFIG_ADDRESS, EPOCH_LENGTH } from "./tempo";
import { validatorConfigAbi } from "./contracts";
import type {
  DashboardData,
  ValidatorData,
  NetworkMetrics,
  BlockSample,
  RecentTx,
} from "./types";

const HISTORY_DEPTH = 30;
const BATCH_SIZE = 5;
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 50;

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimit = msg.includes("429") || msg.includes("rate limit");
      if (!isRateLimit || attempt === MAX_RETRIES) throw err;
      await sleep(BASE_DELAY_MS * Math.pow(2, attempt));
    }
  }
  throw new Error("unreachable");
}

async function fetchBlockHistory(): Promise<{
  samples: BlockSample[];
  network: NetworkMetrics;
  recentTx: RecentTx[];
}> {
  const latest = await withRetry(() =>
    client.getBlock({ blockTag: "latest", includeTransactions: true })
  );

  const blockNumbers = Array.from(
    { length: HISTORY_DEPTH },
    (_, i) => latest.number - BigInt(i)
  );

  // Fetch in small batches to avoid RPC rate limits.
  const blocks = [latest];
  const remaining = blockNumbers.slice(1); // skip latest, already fetched
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    const batch = remaining.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((n) =>
        withRetry(() =>
          client.getBlock({ blockNumber: n, includeTransactions: true })
        )
      )
    );
    blocks.push(...results);
    if (i + BATCH_SIZE < remaining.length) await sleep(BASE_DELAY_MS);
  }

  // Oldest first for charts
  blocks.reverse();

  const samples: BlockSample[] = blocks.map((b, i) => {
    const prevTs = i > 0 ? blocks[i - 1].timestamp : null;
    const bt = prevTs !== null ? Number(b.timestamp - prevTs) : null;
    return {
      number: Number(b.number),
      timestamp: Number(b.timestamp),
      txCount: b.transactions.length,
      gasUsed: Number(b.gasUsed),
      gasLimit: Number(b.gasLimit),
      blockTime: bt,
      miner: b.miner,
      hash: b.hash,
    };
  });

  // Network metrics from last 10 blocks
  const window = samples.slice(-10);
  const timeDelta =
    window.length >= 2
      ? window[window.length - 1].timestamp - window[0].timestamp
      : 0;
  const blockDelta = window.length - 1;
  const blockTime =
    blockDelta > 0 && timeDelta > 0
      ? Math.round((timeDelta / blockDelta) * 100) / 100
      : null;

  const totalTxInWindow = window.reduce((s, b) => s + b.txCount, 0);
  const tps =
    timeDelta > 0 ? Math.round((totalTxInWindow / timeDelta) * 10) / 10 : null;

  // Peak TPS: max tx count in a single block / block time
  let peakTps: number | null = null;
  for (const s of samples) {
    if (s.blockTime && s.blockTime > 0) {
      const instantTps = s.txCount / s.blockTime;
      if (peakTps === null || instantTps > peakTps) {
        peakTps = Math.round(instantTps * 10) / 10;
      }
    }
  }

  const lastSample = samples[samples.length - 1];
  const gasUtilization =
    lastSample.gasLimit > 0
      ? Math.round((lastSample.gasUsed / lastSample.gasLimit) * 10000) / 100
      : null;

  const avgGasPerBlock = Math.round(
    samples.reduce((s, b) => s + b.gasUsed, 0) / samples.length
  );

  const network: NetworkMetrics = {
    blockTime,
    tps,
    gasUtilization,
    latestBlockTxCount: lastSample.txCount,
    latestBlockGasUsed: latest.gasUsed,
    latestBlockGasLimit: latest.gasLimit,
    peakTps,
    avgGasPerBlock,
    totalTxInWindow,
  };

  // Collect transactions from the latest 3 blocks
  const txBlocks = blocks.slice(-3).reverse();
  const recentTx: RecentTx[] = [];
  for (const blk of txBlocks) {
    for (const tx of blk.transactions.slice(0, 10)) {
      if (recentTx.length >= 20) break;
      recentTx.push({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: formatEther(tx.value),
        blockNumber: Number(blk.number),
        timestamp: Number(blk.timestamp),
        gasUsed: null, // would require receipt call, skip for perf
      });
    }
    if (recentTx.length >= 20) break;
  }

  return { samples, network, recentTx };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const [validators, blockNumber, nextFullDkg, history] = await Promise.all([
    withRetry(() =>
      client.readContract({
        address: VALIDATOR_CONFIG_ADDRESS,
        abi: validatorConfigAbi,
        functionName: "getValidators",
      })
    ),
    withRetry(() => client.getBlockNumber()),
    withRetry(() =>
      client.readContract({
        address: VALIDATOR_CONFIG_ADDRESS,
        abi: validatorConfigAbi,
        functionName: "getNextFullDkgCeremony",
      })
    ),
    fetchBlockHistory(),
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
    network: history.network,
    blockHistory: history.samples,
    recentTransactions: history.recentTx,
    timestamp: Date.now(),
  };
}

export function watchBlocks(onBlock: () => void): () => void {
  return client.watchBlockNumber({
    onBlockNumber: () => onBlock(),
  });
}
