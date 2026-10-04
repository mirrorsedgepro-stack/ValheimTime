#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

echo "=========================================="
echo "          Valheim Server Status           "
echo "=========================================="

if ! docker ps --format '{{.Names}}' | grep -q "^valheim-server$"; then
    echo "Status: STOPPED (Container 'valheim-server' is not running)"
    echo "Start it with: ./scripts/start.sh"
    exit 0
fi

echo "Status: RUNNING"
echo ""

echo "--- Container Details ---"
docker ps --filter "name=valheim-server" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "--- Resource Usage ---"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" valheim-server
echo ""

echo "--- Join Code / Connection Info ---"
JOIN_CODE=$(docker logs valheim-server 2>&1 | grep -iE "Session \".*\" with join code [0-9]+" | tail -n 1)
if [ -n "$JOIN_CODE" ]; then
    echo "Found: $JOIN_CODE"
else
    CONNECTED=$(docker logs valheim-server 2>&1 | grep -i "Game server connected" | tail -n 1)
    if [ -n "$CONNECTED" ]; then
        echo "Server is CONNECTED ($CONNECTED). Generating world / awaiting join code..."
    else
        echo "Server is initializing... Run './scripts/logs.sh' to follow startup."
    fi
fi
echo ""

echo "--- World Saves & Backups ---"
if [ -d "${PROJECT_DIR}/saves/worlds_local" ]; then
    echo "World files in saves/worlds_local:"
    ls -lh "${PROJECT_DIR}/saves/worlds_local" 2>/dev/null | tail -n 5
elif [ -d "${PROJECT_DIR}/saves" ]; then
    echo "Saves directory:"
    ls -lh "${PROJECT_DIR}/saves" 2>/dev/null | tail -n 5
fi
echo "=========================================="
