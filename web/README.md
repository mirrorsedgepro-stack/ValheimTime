# Valheim Server Portal & Join Guide (Next.js for Vercel)

A modern, responsive Norse/Viking themed web portal for your dedicated Valheim server. Features real-time Join Code synchronization, masked server password with click-to-reveal & 1-click copy, automated modpack downloads, and interactive mod guides.

---

## Features

- **Dynamic Join Code**: Live sync with your running Valheim Docker container. Shows online/offline status, current crossplay join code, direct IP connection, and player count.
- **One-Click Clipboard Copying**: Rapid copying for join code, direct IP, and server password.
- **Pre-Configured Client Modpack**: Automated ZIP download containing BepInEx, all 16 server-matched mods, and pre-configured server sync files.
- **r2modman / Thunderstore Guide**: Step-by-step instructions and profile code for mod manager users.
- **Interactive Mod Showcase**: Searchable catalog of all 16 installed mods with gameplay descriptions and default keybindings (Backpack hotkeys, F1 Configuration Manager, Quick Stack, etc.).
- **Vercel Native**: Built on Next.js 14 App Router, optimized for serverless edge deployment with Upstash Redis / Vercel KV and in-memory fallbacks.

---

## 🚀 How to Deploy to Vercel

### Method 1: Deploy with Git (Recommended)

1. Push this repository (or the `web/` subfolder) to your GitHub, GitLab, or Bitbucket account.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. **Set Root Directory**:
   - If deploying from the root of this repo, set the **Root Directory** to `web`.
5. **Environment Variables**:
   In the Vercel deployment settings, add the following environment variables:
   | Variable | Description | Example |
   | :--- | :--- | :--- |
   | `WEBHOOK_SECRET` | Secret token to authenticate status pushes from your server | `dfff0be2ffea0e2e6fad1c7bc2f97df4f972aa43a8c21828` |
   | `SERVER_PASSWORD` | Server password for the reveal toggle | `Valheim2026!` |
   | `SERVER_NAME` | Default server display name | `Odin's Hall` |
   | `SERVER_IP_PORT` | Direct IP fallback | `180.181.238.103:2456` |
   | `UPSTASH_REDIS_REST_URL` | *(Optional)* Upstash REST URL | `https://...upstash.io` |
   | `UPSTASH_REDIS_REST_TOKEN`| *(Optional)* Upstash REST Token | `AX...` |
6. Click **Deploy**.

*(Optional)* To enable persistent storage across all Vercel regions:
- Go to your Vercel Project &rarr; **Storage** &rarr; **Create Database** &rarr; **Upstash Redis** (Free).
- Vercel will automatically populate `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`!

---

### Method 2: Deploy with Vercel CLI

```bash
cd web
npm i -g vercel
vercel
```

Follow the prompts and add your environment variables when requested.

---

## 🔄 Connecting Your Linux Server (Status Synchronization)

Once your Vercel site is deployed (e.g. `https://valheim-odins-hall.vercel.app`):

1. On your Linux server, edit `/home/jcee-slave/Valheim/.env`:
   ```bash
   WEBHOOK_URL="https://valheim-odins-hall.vercel.app/api/webhook/status"
   WEBHOOK_SECRET="dfff0be2ffea0e2e6fad1c7bc2f97df4f972aa43a8c21828"
   ```

2. Test pushing status manually:
   ```bash
   ./scripts/sync-status.sh
   ```

3. Enable automated background syncing (Runs every minute):
   ```bash
   sudo cp systemd/valheim-sync.* /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now valheim-sync.timer
   ```

   *Alternatively, via crontab:*
   ```bash
   crontab -e
   # Add this line to run every minute:
   * * * * * cd /home/jcee-slave/Valheim && ./scripts/sync-status.sh >/dev/null 2>&1
   ```

---

## 📦 Updating Client Mods

Whenever you add or update mods on the server in `server/BepInEx/plugins/`:
```bash
./scripts/package-client-mods.sh
```
This automatically updates `web/public/downloads/valheim-modpack.zip` and regenerates the manifest.
