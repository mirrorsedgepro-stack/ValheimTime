#!/usr/bin/env bash
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Preserve env variables if passed in environment
CLI_WEBHOOK_URL="${WEBHOOK_URL:-}"
CLI_WEBHOOK_SECRET="${WEBHOOK_SECRET:-}"

# Load environment configuration if available
if [ -f "${PROJECT_DIR}/.env" ]; then
    # shellcheck disable=SC1091
    source "${PROJECT_DIR}/.env"
fi

CONTAINER_NAME="valheim-server"
FALLBACK_SERVER_NAME="${SERVER_NAME:-Valheim Server}"
FALLBACK_PORT="${SERVER_PORT:-2456}"
SERVER_PASS="${SERVER_PASSWORD:-}"
WEBHOOK_URL="${CLI_WEBHOOK_URL:-${WEBHOOK_URL:-}}"
WEBHOOK_SECRET="${CLI_WEBHOOK_SECRET:-${WEBHOOK_SECRET:-}}"

# Ignore default placeholder URL
if [[ "${WEBHOOK_URL}" == *"your-valheim-portal"* ]]; then
    WEBHOOK_URL=""
fi

sync_once() {
    local is_online="false"
    local join_code=""
    local ip_port=""
    local player_count=0
    local server_name="${FALLBACK_SERVER_NAME}"
    local cpu_usage="0%"
    local mem_usage="0MiB"
    local status_text="OFFLINE"

    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        is_online="true"
        status_text="RUNNING"

        # Extract container stats
        local stats_line
        stats_line=$(docker stats --no-stream --format "{{.CPUPerc}}|{{.MemUsage}}" "${CONTAINER_NAME}" 2>/dev/null || echo "0%|0MiB")
        cpu_usage=$(echo "$stats_line" | cut -d'|' -f1)
        mem_usage=$(echo "$stats_line" | cut -d'|' -f2)

        # Parse Join Code and IP from logs
        local session_line
        session_line=$(docker logs "${CONTAINER_NAME}" 2>&1 | grep -iE "Session \".*\" with join code [0-9]+" | tail -n 1 || true)

        if [[ "$session_line" =~ Session\ \"([^\"]+)\"\ with\ join\ code\ ([0-9]+)\ and\ IP\ ([^ ]+)\ is\ active\ with\ ([0-9]+)\ player ]]; then
            server_name="${BASH_REMATCH[1]}"
            join_code="${BASH_REMATCH[2]}"
            ip_port="${BASH_REMATCH[3]}"
            player_count="${BASH_REMATCH[4]}"
        else
            # Check if server is still initializing
            local connected_line
            connected_line=$(docker logs "${CONTAINER_NAME}" 2>&1 | grep -i "Game server connected" | tail -n 1 || true)
            if [ -n "$connected_line" ]; then
                status_text="INITIALIZING"
            fi
        fi

        # If IP wasn't captured from session line, try public IP lookup
        if [ -z "$ip_port" ]; then
            local public_ip
            public_ip=$(curl -s -m 3 https://api.ipify.org 2>/dev/null || echo "")
            if [ -n "$public_ip" ]; then
                ip_port="${public_ip}:${FALLBACK_PORT}"
            fi
        fi
    fi

    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Build JSON payload
    local payload
    payload=$(cat <<EOF
{
  "isOnline": ${is_online},
  "status": "${status_text}",
  "serverName": "${server_name}",
  "joinCode": "${join_code}",
  "ipPort": "${ip_port}",
  "playerCount": ${player_count},
  "cpuUsage": "${cpu_usage}",
  "memUsage": "${mem_usage}",
  "serverPassword": "${SERVER_PASS}",
  "updatedAt": "${timestamp}"
}
EOF
)

    # Save to local cache file
    echo "$payload" > "${PROJECT_DIR}/scripts/.last_status.json"

    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Valheim Status: ${status_text} | Join Code: ${join_code:-N/A} | Players: ${player_count} | IP: ${ip_port:-N/A}"

    if [ -n "$WEBHOOK_URL" ]; then
        echo "Pushing status update to ${WEBHOOK_URL}..."
        local http_code
        http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${WEBHOOK_URL}" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${WEBHOOK_SECRET}" \
            -H "x-webhook-secret: ${WEBHOOK_SECRET}" \
            -d "$payload" || echo "failed")

        if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
            echo "Successfully updated Vercel status (HTTP ${http_code})"
        else
            echo "Webhook push warning: Received HTTP code ${http_code} from ${WEBHOOK_URL}"
        fi
    else
        echo "Note: WEBHOOK_URL not set in .env. Saved status locally to scripts/.last_status.json"
    fi
}

# Check argument for watch mode
if [ "${1:-}" = "--watch" ]; then
    INTERVAL="${2:-60}"
    echo "Starting Valheim Status Sync daemon (interval: ${INTERVAL}s)..."
    while true; do
        sync_once || true
        sleep "${INTERVAL}"
    done
else
    sync_once
fi
