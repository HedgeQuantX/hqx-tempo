// ABI for the ValidatorConfig precompile -- only the read functions we need.
// Extracted from the on-chain interface used by `tempo consensus validators-info`.
export const validatorConfigAbi = [
  {
    type: "function",
    name: "getValidators",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        name: "",
        components: [
          { type: "bytes32", name: "publicKey" },
          { type: "string", name: "inboundAddress" },
          { type: "string", name: "outboundAddress" },
          { type: "bool", name: "active" },
          { type: "address", name: "validatorAddress" },
          { type: "uint64", name: "index" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNextFullDkgCeremony",
    inputs: [],
    outputs: [{ type: "uint64", name: "" }],
    stateMutability: "view",
  },
] as const;
