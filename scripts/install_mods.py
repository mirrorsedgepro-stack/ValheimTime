#!/usr/bin/env python3
import json
import os
import shutil
import tempfile
import urllib.request
import zipfile

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BEPINEX_DIR = os.path.join(BASE_DIR, "server", "BepInEx")
PLUGINS_DIR = os.path.join(BEPINEX_DIR, "plugins")
PATCHERS_DIR = os.path.join(BEPINEX_DIR, "patchers")

os.makedirs(PLUGINS_DIR, exist_ok=True)
os.makedirs(PATCHERS_DIR, exist_ok=True)

# Remove outdated default plugins if present
stale_devcommands = os.path.join(PLUGINS_DIR, "ServerDevcommands.dll")
if os.path.exists(stale_devcommands):
    print("Removing outdated ServerDevcommands.dll...")
    os.remove(stale_devcommands)

PACKAGES = [
    # Dependencies
    ("ValheimModding", "Jotunn"),
    ("ValheimModding", "YamlDotNet"),
    ("ValheimModding", "JsonDotNET"),
    ("shudnal", "ConditionalConfigSync"),

    # User requested mods
    ("Toxo", "CraftFromChests"),
    ("ModdedWolf", "EasyRelocate"),
    ("Goldenrevolver", "Quick_Stack_Store_Sort_Trash_Restock"),
    ("shudnal", "ConfigurationManager"),
    ("shudnal", "ExtraSlots"),
    ("Vapok", "AdventureBackpacks"),
    ("Balrond", "balrond_DualMastery"),
    ("NoPetRides", "CropUtils"),
    ("Neobotics", "HUDCompass"),
    ("SpikeHimself", "XPortal"),
    ("Skarif", "BuildOnShip"),
    ("MathiasDecrock", "PlanBuild"),
]

def fetch_package_info(author, name):
    url = f"https://thunderstore.io/api/experimental/package/{author}/{name}/"
    req = urllib.request.Request(url, headers={"User-Agent": "ValheimModInstaller/1.0"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def install_package(author, name):
    print(f"Fetching metadata for {author}/{name}...")
    info = fetch_package_info(author, name)
    latest = info.get("latest", {})
    download_url = latest.get("download_url")
    version = latest.get("version_number")
    print(f"Downloading {author}/{name} v{version} from {download_url}...")

    with tempfile.TemporaryDirectory() as tmpdir:
        zip_path = os.path.join(tmpdir, "package.zip")
        req = urllib.request.Request(download_url, headers={"User-Agent": "ValheimModInstaller/1.0"})
        with urllib.request.urlopen(req) as resp, open(zip_path, "wb") as f:
            f.write(resp.read())

        extract_dir = os.path.join(tmpdir, "extracted")
        with zipfile.ZipFile(zip_path, "r") as zf:
            for member in zf.infolist():
                normalized_name = member.filename.replace('\\', '/')
                target_path = os.path.join(extract_dir, normalized_name)
                if member.is_dir() or normalized_name.endswith('/'):
                    os.makedirs(target_path, exist_ok=True)
                else:
                    os.makedirs(os.path.dirname(target_path), exist_ok=True)
                    with zf.open(member) as source, open(target_path, "wb") as target:
                        shutil.copyfileobj(source, target)

        # Inspect extracted contents
        entries = os.listdir(extract_dir)
        print(f"  Contents: {entries}")

        # Case 1: Package has BepInEx/ folder
        if os.path.exists(os.path.join(extract_dir, "BepInEx")):
            bep = os.path.join(extract_dir, "BepInEx")
            for sub in os.listdir(bep):
                src = os.path.join(bep, sub)
                dst = os.path.join(BEPINEX_DIR, sub)
                if os.path.isdir(src):
                    shutil.copytree(src, dst, dirs_exist_ok=True)
                else:
                    shutil.copy2(src, dst)
            print(f"  Installed via BepInEx/ layout for {name}")
            return

        # Case 2: Package has plugins/ folder
        if os.path.exists(os.path.join(extract_dir, "plugins")):
            src_plugins = os.path.join(extract_dir, "plugins")
            target_mod_dir = os.path.join(PLUGINS_DIR, name)
            os.makedirs(target_mod_dir, exist_ok=True)
            for item in os.listdir(src_plugins):
                s = os.path.join(src_plugins, item)
                d = os.path.join(target_mod_dir, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d, dirs_exist_ok=True)
                else:
                    shutil.copy2(s, d)
            # Also check if patchers exists
            if os.path.exists(os.path.join(extract_dir, "patchers")):
                shutil.copytree(os.path.join(extract_dir, "patchers"), PATCHERS_DIR, dirs_exist_ok=True)
            print(f"  Installed via plugins/ layout for {name}")
            return

        # Case 3: Flat files (.dll and assets in root of zip)
        target_mod_dir = os.path.join(PLUGINS_DIR, name)
        os.makedirs(target_mod_dir, exist_ok=True)
        ignored = {"manifest.json", "icon.png", "README.md", "package.zip"}
        for item in entries:
            if item in ignored or item.startswith("."):
                continue
            s = os.path.join(extract_dir, item)
            d = os.path.join(target_mod_dir, item)
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)
        print(f"  Installed into {target_mod_dir}")

def main():
    print("=== Starting Mod Installation ===")
    for author, name in PACKAGES:
        try:
            install_package(author, name)
        except Exception as e:
            print(f"ERROR installing {author}/{name}: {e}")
            raise
    print("=== All Mods and Dependencies Successfully Installed! ===")

if __name__ == "__main__":
    main()
