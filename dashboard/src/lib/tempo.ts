import { createPublicClient, http, defineChain } from "viem";

export const tempoModerato = defineChain({
  id: 42431,
  name: "Tempo Moderato",
  nativeCurrency: { name: "USD", symbol: "USD", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.moderato.tempo.xyz"] },
  },
  blockExplorers: {
    default: { name: "Tempo Explorer", url: "https://explore.tempo.xyz" },
  },
  testnet: true,
});

export const client = createPublicClient({
  chain: tempoModerato,
  transport: http(),
});

export const VALIDATOR_CONFIG_ADDRESS =
  "0x56c0000000000000000000000000000000000000" as const;

export const EPOCH_LENGTH = 900n; // blocks per epoch on moderato
