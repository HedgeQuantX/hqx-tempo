#!/usr/bin/env bash
# ============================================================
# hedgequantx — Validator Management CLI
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE="docker compose -f ${SCRIPT_DIR}/docker-compose.yml --env-file ${SCRIPT_DIR}/.env"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${CYAN}[hedgequantx]${NC} $*"; }
ok()   { echo -e "${GREEN}[hedgequantx]${NC} $*"; }
err()  { echo -e "${RED}[hedgequantx]${NC} $*" >&2; }

preflight() {
    local fail=0
    [[ -f "${SCRIPT_DIR}/secrets/validator.key" ]] || { err "Missing validator.key"; fail=1; }
    [[ -f "${SCRIPT_DIR}/secrets/fee_recipient.json" ]] || { err "Missing fee_recipient.json"; fail=1; }
    [[ -f "${SCRIPT_DIR}/.env" ]] || { err "Missing .env"; fail=1; }
    docker info &>/dev/null || { err "Docker daemon not reachable"; fail=1; }
    (( fail )) && { err "Preflight failed — aborting."; exit 1; }
    ok "Preflight passed"
}

cmd_start() {
    preflight
    log "Starting hedgequantx validator..."
    ${COMPOSE} up -d --remove-orphans
    ok "Validator is running"
    cmd_status
}

cmd_stop() {
    log "Stopping hedgequantx validator..."
    ${COMPOSE} down
    ok "Validator stopped"
}

cmd_restart() {
    cmd_stop
    cmd_start
}

cmd_status() {
    echo -e "\n${BOLD}--- hedgequantx Status ---${NC}"
    ${COMPOSE} ps
    echo ""
    docker inspect hedgequantx-validator --format='{{.State.Status}} | uptime: {{.State.StartedAt}}' 2>/dev/null || echo "Container not running"
}

cmd_logs() {
    ${COMPOSE} logs -f --tail="${1:-200}" validator
}

cmd_health() {
    echo -e "${BOLD}--- hedgequantx Health ---${NC}"
    local health
    health=$(docker inspect hedgequantx-validator --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
    echo -e "Health: ${health}"
    # Block height check via RPC (internal)
    docker exec hedgequantx-validator wget -qO- \
        http://127.0.0.1:8545 \
        --post-data='{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        --header='Content-Type:application/json' 2>/dev/null | python3 -c "
import sys, json
try:
    r = json.load(sys.stdin)
    print(f\"Block height: {int(r['result'], 16)}\")
except: print('RPC not ready')
" 2>/dev/null || echo "RPC not reachable"
}

cmd_snapshot() {
    log "Downloading latest moderato snapshot..."
    docker run --rm -v hedgequantx-data:/data \
        ghcr.io/tempoxyz/tempo:latest \
        download --chain moderato --datadir /data
    ok "Snapshot downloaded"
}

cmd_pubkey() {
    docker run --rm \
        -v "${SCRIPT_DIR}/secrets/validator.key:/secrets/validator.key:ro" \
        ghcr.io/tempoxyz/tempo:latest \
        consensus calculate-public-key --private-key /secrets/validator.key
}

cmd_help() {
    cat <<EOF

${BOLD}hedgequantx — Tempo Validator Management${NC}

Usage: ./manage.sh <command>

Commands:
  start       Start the validator
  stop        Stop the validator
  restart     Restart the validator
  status      Show container status
  logs [N]    Tail logs (default: 200 lines)
  health      Health check + block height
  snapshot    Download latest chain snapshot
  pubkey      Display validator public key
  help        Show this help

EOF
}

case "${1:-help}" in
    start)    cmd_start ;;
    stop)     cmd_stop ;;
    restart)  cmd_restart ;;
    status)   cmd_status ;;
    logs)     cmd_logs "${2:-200}" ;;
    health)   cmd_health ;;
    snapshot) cmd_snapshot ;;
    pubkey)   cmd_pubkey ;;
    help|*)   cmd_help ;;
esac
