#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "=== Valheim Dedicated Server Updater (ARM64 Native) ==="
echo "Downloading / verifying latest Valheim Windows server build from Steam..."

"${PROJECT_DIR}/bin/depotdownloader-arm64/DepotDownloader" \
    -app 896660 \
    -dir "${PROJECT_DIR}/server" \
    -os windows

echo "Files updated."

if docker ps --format '{{.Names}}' | grep -q "^valheim-server$"; then
    echo "Restarting server container..."
    "${PROJECT_DIR}/scripts/restart.sh"
fi

echo "Valheim server is up to date."
