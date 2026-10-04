#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "Triggering immediate Valheim world backup..."
docker exec valheim-server supervisorctl restart valheim-backup

echo "Backup triggered. Waiting 5 seconds..."
sleep 5

echo "Latest backups in ${PROJECT_DIR}/config/backups:"
ls -lh "${PROJECT_DIR}/config/backups" | tail -n 5
