import { createPublicClient, http, webSocket, defineChain, fallback } from "viem";

export const tempoModerato = defineChain({
  id: 42431,
  name: "Tempo Moderato",
  nativeCurrency: { name: "USD", symbol: "USD", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.moderato.tempo.xyz"],
      webSocket: ["wss://rpc.moderato.tempo.xyz"],
    },
  },
  blockExplorers: {
    default: { name: "Tempo Explorer", url: "https://explore.tempo.xyz" },
  },
  testnet: true,
});

// WebSocket-first client with HTTP fallback for resilience.
export const client = createPublicClient({
  chain: tempoModerato,
  transport: fallback([
    webSocket("wss://rpc.moderato.tempo.xyz"),
    http("https://rpc.moderato.tempo.xyz"),
  ]),
});

export const VALIDATOR_CONFIG_ADDRESS =
  "0xCccCcCCC00000000000000000000000000000000" as const;

export const EPOCH_LENGTH = 21600n; // moderato chainspec
