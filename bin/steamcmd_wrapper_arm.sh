#!/usr/bin/env bash
set -e

# SteamCMD bypass wrapper for ARM64 Valheim server
# Avoids 32-bit x86 SteamCMD crashes on ARM64 hosts.
# Server downloads/updates are handled via ./scripts/update.sh using native ARM64 DepotDownloader.

echo "[ARM64 Wrapper] Skipping 32-bit SteamCMD; server files managed via native ARM64 DepotDownloader."
exit 0
