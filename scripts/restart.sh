#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"
echo "Restarting Valheim Dedicated Server..."
docker compose restart
echo "Restart command sent. Monitor logs with: ./scripts/logs.sh"
# Trigger status sync in background once container is restarted
(sleep 15 && "${SCRIPT_DIR}/sync-status.sh" >/dev/null 2>&1 &)
