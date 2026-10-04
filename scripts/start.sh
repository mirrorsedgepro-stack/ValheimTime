#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"
echo "Starting Valheim Dedicated Server..."
docker compose up -d

echo "Container started. View logs with: ./scripts/logs.sh"
# Trigger status sync in background once container is up
(sleep 5 && "${SCRIPT_DIR}/sync-status.sh" >/dev/null 2>&1 &)
