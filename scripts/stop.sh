#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"
echo "Stopping Valheim Dedicated Server safely (allowing world save)..."
docker compose stop
echo "Server stopped."
"${SCRIPT_DIR}/sync-status.sh" >/dev/null 2>&1 || true
