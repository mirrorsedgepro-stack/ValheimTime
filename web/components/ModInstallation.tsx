"use client";

import React, { useState } from "react";
import { Download, PackageCheck, FolderArchive, ArrowRight, Check, Copy, ExternalLink, Terminal, ShieldAlert } from "lucide-react";

export const ModInstallation: React.FC = () => {
  const [activeMethod, setActiveMethod] = useState<"zip" | "r2modman">("zip");
  const [copiedCode, setCopiedCode] = useState(false);

  // Verified active Thunderstore profile code
  const r2modmanProfileCode = "01a106e1-b55d-b661-38b0-2e8305b8e3fb";

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(r2modmanProfileCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="mod-install" className="mt-10 rounded-2xl bg-valheim-surface/80 border border-valheim-border p-6 sm:p-8 backdrop-blur-md">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-valheim-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-valheim-gold/15 text-valheim-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <PackageCheck className="w-3.5 h-3.5" />
            Client Modding Guide
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            How to Install Required Mods
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Choose your preferred installation method below. Both methods include the exact same mods & server configs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-valheim-card border border-valheim-border text-xs">
          <button
            onClick={() => setActiveMethod("zip")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
              activeMethod === "zip"
                ? "bg-valheim-gold text-slate-950 font-bold shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Download className="w-4 h-4" />
            Direct ZIP (Simplest)
          </button>
          <button
            onClick={() => setActiveMethod("r2modman")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
              activeMethod === "r2modman"
                ? "bg-valheim-gold text-slate-950 font-bold shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            r2modman / Thunderstore
          </button>
        </div>
      </div>

      {activeMethod === "zip" ? (
        <div className="mt-6 space-y-6">
          {/* Main Download Callout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-valheim-card via-valheim-card to-amber-950/30 border border-valheim-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Pre-Configured Client Modpack</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-valheim-gold/20 text-valheim-gold border border-valheim-gold/30 font-semibold">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Includes BepInExPack 5.4.23.3, all 16 server-matched plugins, and official server configuration files. Just extract into your Valheim folder!
              </p>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Size: ~50 MB • Format: .zip • Verified clean & virus-free
              </p>
            </div>

            <a
              href="/downloads/valheim-modpack.zip"
              download="valheim-modpack.zip"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-valheim-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl hover:shadow-valheim-gold/20 transition-all shrink-0 active:scale-95"
            >
              <Download className="w-5 h-5 text-slate-950" />
              <span>Download Modpack (.zip)</span>
            </a>
          </div>

          {/* Step by step manual extraction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-valheim-card/70 border border-valheim-border">
              <span className="w-7 h-7 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
                1
              </span>
              <h4 className="font-semibold text-white text-sm">Download & Unzip</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Download <code className="text-amber-300 bg-valheim-bg px-1 rounded">valheim-modpack.zip</code> using the button above and open the archive.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-valheim-card/70 border border-valheim-border">
              <span className="w-7 h-7 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
                2
              </span>
              <h4 className="font-semibold text-white text-sm">Open Valheim Game Folder</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                In Steam, right-click <strong>Valheim &rarr; Manage &rarr; Browse local files</strong>.
              </p>
              <div className="mt-2 text-[10px] font-mono text-slate-400 bg-valheim-bg/80 p-2 rounded border border-valheim-border/60 break-all">
                C:\Program Files (x86)\Steam\steamapps\common\Valheim
              </div>
            </div>

            <div className="p-5 rounded-xl bg-valheim-card/70 border border-valheim-border">
              <span className="w-7 h-7 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
                3
              </span>
              <h4 className="font-semibold text-white text-sm">Extract All Files Here</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Extract the contents directly into the Valheim root folder so <code className="text-amber-300 bg-valheim-bg px-1 rounded">winhttp.dll</code> sits right next to <code className="text-amber-300 bg-valheim-bg px-1 rounded">valheim.exe</code>.
              </p>
            </div>
          </div>

          {/* Launch verification */}
          <div className="p-4 rounded-xl bg-valheim-bg/70 border border-valheim-border text-xs text-slate-300 flex items-start gap-3">
            <Terminal className="w-4 h-4 text-valheim-rune shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">How to verify:</span> When you launch Valheim from Steam, a black BepInEx console window will appear alongside the game for a few seconds. In the main menu, press <strong className="text-valheim-gold">F1</strong> to open the in-game Configuration Manager!
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* r2modman Profile Import Code & File */}
          <div className="p-6 rounded-2xl bg-valheim-card border border-valheim-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FolderArchive className="w-5 h-5 text-valheim-gold" />
                  Import Profile (Code or File)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Import this verified Thunderstore profile into r2modman or Thunderstore Mod Manager to auto-download and sync all 16 mods and configs in 1 click.
                </p>
              </div>

              <a
                href="/downloads/OdinsHall.r2z"
                download="OdinsHall.r2z"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-valheim-surface hover:bg-valheim-border text-slate-200 border border-valheim-border text-xs font-semibold shrink-0 transition-colors"
                title="Download profile file for Import from File"
              >
                <Download className="w-4 h-4 text-valheim-gold" />
                <span>Download OdinsHall.r2z</span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 bg-valheim-bg border border-valheim-gold/40 rounded-lg px-4 py-3 font-mono text-xs sm:text-sm text-amber-300 flex items-center justify-between overflow-x-auto">
                <span className="tracking-wider select-all">{r2modmanProfileCode}</span>
                <span className="text-[10px] text-emerald-400 font-sans uppercase font-bold ml-2 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified Active
                </span>
              </div>

              <button
                onClick={handleCopyProfile}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-valheim-gold hover:bg-valheim-goldLight text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Copied Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Profile Code</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              In r2modman, select <strong>Import / Update &rarr; Import new profile &rarr; From code</strong> and paste the code above, or select <strong>From file</strong> and choose <code className="text-amber-300">OdinsHall.r2z</code>.
            </p>
          </div>

          {/* Step by step r2modman */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border">
              <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
                1
              </span>
              <h4 className="font-semibold text-white text-sm">Install r2modman</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Download <a href="https://thunderstore.io/package/ebkr/r2modman/" target="_blank" rel="noreferrer" className="text-valheim-rune underline hover:text-sky-300">r2modman</a> if you do not have it already.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border">
              <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
                2
              </span>
              <h4 className="font-semibold text-white text-sm">Select Valheim</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Launch r2modman, scroll down or search for <strong>Valheim</strong>, and select the game.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border">
              <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
                3
              </span>
              <h4 className="font-semibold text-white text-sm">Import Profile</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Click <strong>Import / Update &rarr; Import new profile &rarr; From code</strong> and paste the profile code.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-gold/20 bg-gradient-to-br from-valheim-card/80 to-amber-950/20">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mb-3 border border-emerald-500/30">
                4
              </span>
              <h4 className="font-semibold text-white text-sm">Start Modded</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Click the blue <strong>Start modded</strong> button in the top left corner of r2modman to launch!
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
