# HQX TEMPO

Validator infrastructure and real-time dashboard for the [Tempo](https://tempo.xyz) Moderato testnet.

**Live dashboard:** [https://tempo.hedgequantx.com](https://tempo.hedgequantx.com)

---

## Overview

This repository contains two components:

1. **Validator Node** -- A hardened Docker Compose setup running a Tempo validator on Moderato (Chain ID 42431).
2. **Validator Dashboard** -- A Next.js single-page application providing real-time network telemetry via WebSocket.

## Dashboard

The dashboard connects directly to `wss://rpc.moderato.tempo.xyz` and renders live data with no backend server. All state is fetched client-side from the Tempo RPC and the `ValidatorConfig` precompile.

### Features

- Real-time block height, epoch progress, and DKG ceremony tracking
- Network metrics: block time, throughput (TPS), gas utilization
- Full validator set with status, public keys, and endpoint info
- Clickable validator rows open a detail modal with explorer links
- WebSocket-first with automatic HTTP fallback
- Single-page, no routing -- the page itself never scrolls

### Stack

- **Next.js 14** (App Router, static export on Vercel)
- **viem** (Ethereum client, WebSocket + HTTP transports)
- **Tailwind CSS** (custom design system: Rajdhani font, dark theme)
- **TypeScript** (strict, ES2020 target for BigInt)

### Run Locally

```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validator Node

The validator runs via Docker Compose using the official `ghcr.io/tempoxyz/tempo:latest` image.

### Management

```bash
./manage.sh start    # Start the validator container
./manage.sh stop     # Stop the validator
./manage.sh health   # Check sync and peer status
./manage.sh logs     # Tail container logs
./manage.sh pubkey   # Print the validator public key
```

### Security

- Signing keys and secrets are stored in `secrets/` (chmod 700, gitignored).
- Environment variables live in `.env` (gitignored).
- No private keys, mnemonics, or sensitive data are committed to this repository.

## Contributions to Tempo

PRs submitted to [tempoxyz/tempo](https://github.com/tempoxyz/tempo):

| PR | Title | Status |
|----|-------|--------|
| [#2727](https://github.com/tempoxyz/tempo/pull/2727) | `feat(config): encrypt signing key and signing share at rest` | Open |
| [#2729](https://github.com/tempoxyz/tempo/pull/2729) | `feat(cmd): add consensus check-peers connectivity diagnostic` | Open |
| [#2730](https://github.com/tempoxyz/tempo/pull/2730) | `fix(docs): remove defunct --disable-thread-pinning from bench README` | Open |

## License

MIT
