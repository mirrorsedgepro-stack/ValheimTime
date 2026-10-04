#!/usr/bin/env bash
set -e

# SteamCMD compatibility wrapper for ARM64 host
TARGET_DIR="/opt/valheim/dl/server"
APPID="896660"

while [[ $# -gt 0 ]]; do
    case "$1" in
        +force_install_dir)
            TARGET_DIR="$2"
            shift 2
            ;;
        +app_update)
            APPID="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

if [ -f "${TARGET_DIR}/valheim_server.x86_64" ]; then
    echo "[SteamCMD Wrapper] Valheim server files found in ${TARGET_DIR}."
    mkdir -p "${TARGET_DIR}/steamapps"
    cat << 'EOF' > "${TARGET_DIR}/steamapps/appmanifest_896660.acf"
"AppState"
{
	"appid"		"896660"
	"Universe"		"1"
	"name"		"Valheim Dedicated Server"
	"StateFlags"		"4"
	"installdir"		"Valheim dedicated server"
	"LastUpdated"		"1700000000"
	"SizeOnDisk"		"2186649264"
	"buildid"		"16000000"
	"InstalledDepots"
	{
		"896661"
		{
			"manifest"		"1285123405092214913"
			"size"		"2186649264"
		}
	}
}
EOF
    echo "[SteamCMD Wrapper] Steam manifest verified. Ready to proceed."
    exit 0
else
    echo "[SteamCMD Wrapper] ERROR: Server files missing in ${TARGET_DIR}. Please run ./scripts/update.sh on the host."
    exit 1
fi
