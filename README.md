# Valheim Dedicated Server (ARM64 Optimized)

This repository contains the configuration, automation scripts, and Docker Compose setup for running a dedicated Valheim server (up to 10 players) on ARM64 Linux hardware.

---

## Architecture & Compatibility

Valheim's server engine is built on Unity 6 and distributed exclusively as an x86_64 binary. On ARM64 Linux, standard user-mode QEMU emulation fails because of a known Mono 64-bit memory offset limitation (`condition offset == (gint32)offset not met`). 

To solve this, this setup uses **Box64 + Wine** (via `tsxcloud/valheim-arm:latest`), which provides stable instruction emulation and memory allocation for the 64-bit server, coupled with a native ARM64 Steam depot downloader to bypass 32-bit SteamCMD crashes.

---

## Features

- **Crossplay Enabled**: Supports PC (Steam), PC Game Pass, and Xbox console players via PlayFab.
- **Mod Ready**: BepInEx mod loader is enabled (`ENABLE_PLUGINS=true`). Mods can be placed in `server/BepInEx/plugins/`.
- **Automated World Saves & Backups**: Configured with automated in-game saves every 30 minutes and periodic world backups stored in `saves/`.
- **Private & Secure**: Hidden from public community lists (`SERVER_VISIBILITY=0`). Players join via Join Code or direct IP connection.
- **Native ARM64 Updater**: Includes `./scripts/update.sh` powered by a native ARM64 DepotDownloader to verify and update server files from Steam with zero emulation overhead.

---

## Directory Structure

```text
/home/jcee-slave/Valheim/
├── .env                  # Server name, password, world, and ports
├── .env.example          # Configuration template
├── docker-compose.yml    # Docker Compose definition
├── web/                  # Next.js web portal (Vercel ready)
│   ├── app/              # UI components & webhook API routes
│   └── public/downloads/ # Generated client modpack ZIP
├── server/               # Valheim dedicated server installation & BepInEx mods
│   └── BepInEx/plugins/  # Place .dll mod files here
├── saves/                # World saves (.db, .fwl) and automated backups
├── bin/                  # Native ARM64 downloaders and bypass wrappers
├── scripts/
│   ├── start.sh          # Start server in background
│   ├── stop.sh           # Gracefully stop server & save world
│   ├── restart.sh        # Restart server
│   ├── logs.sh           # Follow live server logs
│   ├── status.sh         # View status, join code, and saves
│   ├── sync-status.sh    # Push live status & join code to Vercel webhook
│   ├── package-client-mods.sh # Bundle client modpack ZIP for the website
│   └── update.sh         # Update server files directly from Steam
├── systemd/
│   ├── valheim.service   # Systemd service unit for auto-boot
│   ├── valheim-sync.service # Systemd service unit for Vercel webhook sync
│   └── valheim-sync.timer   # Systemd timer unit (every minute)
└── README.md             # This guide
```

---

## Quick Start & Management

Use the helper scripts in `scripts/` or standard `docker compose` commands:

### Start Server
```bash
./scripts/start.sh
# Or: docker compose up -d
```

### View Live Logs
```bash
./scripts/logs.sh
# Or: docker compose logs -f --tail=100
```

### Check Server Status & Find Join Code
```bash
./scripts/status.sh
```

### Stop Server (Graceful World Save)
```bash
./scripts/stop.sh
# Or: docker compose stop
```

### Restart Server
```bash
./scripts/restart.sh
# Or: docker compose restart
```

### Update Server from Steam
```bash
./scripts/update.sh
```

---

## How Players Connect

### 1. Using the Crossplay Join Code (Recommended)
With crossplay enabled, the server generates a unique alphanumeric **Join Code** on startup.
Check your current code using:
```bash
./scripts/status.sh
```
Or check the live logs:
```bash
docker logs valheim-server 2>&1 | grep -iE "join code [0-9]+"
```
In Valheim, players click **Join Game** -> **Join Code**, paste the code, and enter the password (`Valheim2026!` or the password configured in `.env`).

### 2. Using Direct IP Connection
In Valheim, click **Join Game** -> **Join IP**:
- Address: `<YOUR_SERVER_IP>:2456`
- Enter the password configured in `.env`.

*Ensure UDP ports 2456-2458 are open on your host firewall and forwarded on your router if hosting over the internet.*

---

## Installing Mods (BepInEx)

BepInEx is pre-configured and enabled (`ENABLE_PLUGINS=true`).
To install server-side mods:
1. Stop the server: `./scripts/stop.sh`
2. Place downloaded `.dll` mod files into:
   ```bash
   server/BepInEx/plugins/
   ```
3. Start the server: `./scripts/start.sh`

---

## Optional: Auto-start on System Boot (systemd)

To make the server run automatically when the machine boots:

```bash
sudo cp systemd/valheim.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable valheim.service
sudo systemctl start valheim.service
```

---

## Web Portal & Live Join Code Sync (Vercel)

The `web/` directory contains a full Next.js portal designed to be deployed to **Vercel**. It provides friends and players with:
- The live Join Code (auto-updated when the server restarts)
- Server password (masked with click-to-reveal)
- Pre-configured `.zip` client modpack download (`public/downloads/valheim-modpack.zip`)
- 1-click r2modman / Thunderstore import profile code
- Interactive guide with hotkeys for all 16 mods

### 1. Deploy Web App to Vercel
See the full guide in [`web/README.md`](file:///home/jcee-slave/Valheim/web/README.md).
- Push to GitHub and import into Vercel with Root Directory set to `web`.
- Configure `WEBHOOK_SECRET` in Vercel project environment variables.

### 2. Connect Your Linux Server to Vercel
In `.env`, configure your deployed Vercel domain:
```bash
WEBHOOK_URL="https://your-site.vercel.app/api/webhook/status"
```

Test pushing status:
```bash
./scripts/sync-status.sh
```

Enable automatic syncing every minute:
```bash
sudo cp systemd/valheim-sync.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now valheim-sync.timer
```

### 3. Packaging Client Mods
Whenever you add or update mods in `server/BepInEx/plugins/`:
```bash
./scripts/package-client-mods.sh
```
This updates the downloadable client ZIP and manifest in `web/public/downloads/`.

