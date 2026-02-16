// Known validator identities from the official Tempo Explorer.
// Source: https://explore.tempo.xyz/validators
const KNOWN: Record<string, string> = {
  "0x9899Cd5b8190BFD9bBAee463F7bDE4C7E687FDAc": "TEMPO 1",
  "0xA1dD6FC0791b186654E246A8966b1A44854a4E27": "TEMPO 2",
  "0xDe19771801AFC496E1C4BB584Bb5875322F68A4A": "TEMPO 3",
  "0xCF12263139789466D91b9fdE920053BDa20e7Af5": "TEMPO 4",
  "0x0000000000000000000000000000000000000995": "TEMPO 5",
};

export function resolveValidatorName(address: string): string | null {
  // Normalize to checksummed comparison
  const normalized = Object.entries(KNOWN).find(
    ([k]) => k.toLowerCase() === address.toLowerCase()
  );
  return normalized ? normalized[1] : null;
}
