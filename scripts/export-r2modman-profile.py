#!/usr/bin/env python3
"""
Exports the Odin's Hall Valheim mod list & server configs to Thunderstore/r2modman format:
1. Generates OdinsHall.r2z (for "Import from File")
2. Uploads to Thunderstore API to generate a valid live Profile Code (for "Import from Code")
3. Writes the key to web/public/downloads/r2modman-profile.json
"""

import base64
import io
import json
import os
import sys
import urllib.request
import zipfile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOWNLOADS_DIR = os.path.join(BASE_DIR, "web", "public", "downloads")
CONFIG_DIR = os.path.join(BASE_DIR, "server", "BepInEx", "config")
OUTPUT_R2Z = os.path.join(DOWNLOADS_DIR, "OdinsHall.r2z")
PROFILE_JSON = os.path.join(DOWNLOADS_DIR, "r2modman-profile.json")

os.makedirs(DOWNLOADS_DIR, exist_ok=True)

EXPORT_R2X = """profileName: OdinsHall
mods:
  - name: denikson-BepInExPack_Valheim
    version:
      major: 5
      minor: 4
      patch: 2303
    enabled: true
  - name: ValheimModding-Jotunn
    version:
      major: 2
      minor: 30
      patch: 2
    enabled: true
  - name: ValheimModding-YamlDotNet
    version:
      major: 1
      minor: 0
      patch: 0
    enabled: true
  - name: ValheimModding-JsonDotNET
    version:
      major: 1
      minor: 0
      patch: 0
    enabled: true
  - name: shudnal-ConditionalConfigSync
    version:
      major: 1
      minor: 0
      patch: 10
    enabled: true
  - name: Toxo-CraftFromChests
    version:
      major: 0
      minor: 4
      patch: 0
    enabled: true
  - name: ModdedWolf-EasyRelocate
    version:
      major: 1
      minor: 1
      patch: 1
    enabled: true
  - name: Goldenrevolver-Quick_Stack_Store_Sort_Trash_Restock
    version:
      major: 1
      minor: 4
      patch: 15
    enabled: true
  - name: shudnal-ConfigurationManager
    version:
      major: 1
      minor: 1
      patch: 23
    enabled: true
  - name: shudnal-ExtraSlots
    version:
      major: 1
      minor: 2
      patch: 16
    enabled: true
  - name: Vapok-AdventureBackpacks
    version:
      major: 2
      minor: 2
      patch: 9
    enabled: true
  - name: Balrond-balrond_DualMastery
    version:
      major: 0
      minor: 3
      patch: 10
    enabled: true
  - name: NoPetRides-CropUtils
    version:
      major: 2
      minor: 1
      patch: 1
    enabled: true
  - name: Neobotics-HUDCompass
    version:
      major: 1
      minor: 2
      patch: 0
    enabled: true
  - name: SpikeHimself-XPortal
    version:
      major: 1
      minor: 2
      patch: 25
    enabled: true
  - name: Skarif-BuildOnShip
    version:
      major: 4
      minor: 0
      patch: 0
    enabled: true
  - name: MathiasDecrock-PlanBuild
    version:
      major: 0
      minor: 20
      patch: 0
    enabled: true
"""

def generate_profile_zip():
    print("Building r2modman profile export (.r2z)...")
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("export.r2x", EXPORT_R2X)
        if os.path.exists(CONFIG_DIR):
            for root, _, files in os.walk(CONFIG_DIR):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, os.path.join(BASE_DIR, "server", "BepInEx"))
                    zf.write(full_path, rel_path)

    zip_bytes = zip_buffer.getvalue()

    # Save to public downloads as OdinsHall.r2z
    with open(OUTPUT_R2Z, "wb") as f:
        f.write(zip_bytes)
    print(f"Saved {OUTPUT_R2Z} ({len(zip_bytes)} bytes)")

    return zip_bytes

def upload_to_thunderstore(zip_bytes):
    print("Uploading profile to Thunderstore API to generate code...")
    b64_zip = base64.b64encode(zip_bytes).decode("utf-8")
    payload = f"#r2modman\n{b64_zip}".encode("utf-8")

    url = "https://thunderstore.io/api/experimental/legacyprofile/create/"
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/octet-stream",
            "User-Agent": "r2modman/3.1.48"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            key = data.get("key")
            print(f"Successfully generated Thunderstore Profile Code: {key}")
            return key
    except Exception as e:
        print(f"Failed to generate Thunderstore code: {e}")
        return None

def main():
    zip_bytes = generate_profile_zip()
    key = upload_to_thunderstore(zip_bytes)
    if not key:
        print("Using fallback key...")
        key = "01a106e1-2dbb-8f6a-6d39-249d80d1ef17"

    result = {
        "profileName": "OdinsHall",
        "profileCode": key,
        "fileDownload": "/downloads/OdinsHall.r2z",
        "modCount": 17,
    }

    with open(PROFILE_JSON, "w") as f:
        json.dump(result, f, indent=2)

    print(f"Wrote metadata to {PROFILE_JSON}")
    print(f"ACTIVE CODE: {key}")

if __name__ == "__main__":
    main()
