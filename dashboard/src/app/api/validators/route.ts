import { NextResponse } from "next/server";
import { client, VALIDATOR_CONFIG_ADDRESS, EPOCH_LENGTH } from "@/lib/tempo";
import { validatorConfigAbi } from "@/lib/contracts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ValidatorData {
  publicKey: string;
  inboundAddress: string;
  outboundAddress: string;
  active: boolean;
  validatorAddress: string;
  index: number;
}

export async function GET() {
  try {
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

    const parsed: ValidatorData[] = (
      validators as readonly {
        publicKey: `0x${string}`;
        inboundAddress: string;
        outboundAddress: string;
        active: boolean;
        validatorAddress: `0x${string}`;
        index: bigint;
      }[]
    ).map((v) => ({
      publicKey: v.publicKey,
      inboundAddress: v.inboundAddress,
      outboundAddress: v.outboundAddress,
      active: v.active,
      validatorAddress: v.validatorAddress,
      index: Number(v.index),
    }));

    const activeCount = parsed.filter((v) => v.active).length;

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("RPC query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch validator data" },
      { status: 502 }
    );
  }
}
