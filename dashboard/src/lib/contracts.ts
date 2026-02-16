// ABI for the ValidatorConfig precompile.
// Source: crates/contracts/src/precompiles/validator_config.rs
export const validatorConfigAbi = [
  {
    type: "function",
    name: "getValidators",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        name: "validators",
        components: [
          { type: "bytes32", name: "publicKey" },
          { type: "bool", name: "active" },
          { type: "uint64", name: "index" },
          { type: "address", name: "validatorAddress" },
          { type: "string", name: "inboundAddress" },
          { type: "string", name: "outboundAddress" },
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
  {
    type: "function",
    name: "validatorCount",
    inputs: [],
    outputs: [{ type: "uint64", name: "" }],
    stateMutability: "view",
  },
] as const;
