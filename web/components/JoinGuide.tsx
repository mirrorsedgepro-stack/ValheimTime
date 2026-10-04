"use client";

import React, { useState } from "react";
import { Gamepad2, Globe, Radio, AlertCircle, CheckCircle2 } from "lucide-react";

export const JoinGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"code" | "ip">("code");

  return (
    <section className="mt-10 rounded-2xl bg-valheim-surface/80 border border-valheim-border p-6 sm:p-8 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-valheim-border/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-valheim-gold" />
            How to Connect
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Follow these steps to connect your character to the server in-game.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 rounded-xl bg-valheim-card border border-valheim-border text-xs">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "code"
                ? "bg-valheim-gold text-slate-950 font-bold shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4" />
            Join via Code (Recommended)
          </button>
          <button
            onClick={() => setActiveTab("ip")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "ip"
                ? "bg-valheim-gold text-slate-950 font-bold shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            Direct IP
          </button>
        </div>
      </div>

      {activeTab === "code" ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border/60 relative">
            <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
              1
            </span>
            <h3 className="font-semibold text-white text-sm">Launch Modded Valheim</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Launch the game via Steam or r2modman. Verify the BepInEx console opens in the background.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border/60 relative">
            <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
              2
            </span>
            <h3 className="font-semibold text-white text-sm">Select Your Viking</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Click <strong>Start Game</strong> and select your existing character or forge a brand-new one.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border/60 relative">
            <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
              3
            </span>
            <h3 className="font-semibold text-white text-sm">Join Game &rarr; Join Code</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Switch to the <strong>Join Game</strong> tab, click the <strong>Join Code</strong> button at the bottom, and paste the code.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-gold/20 bg-gradient-to-br from-valheim-card/80 to-amber-950/20 relative">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mb-3 border border-emerald-500/30">
              4
            </span>
            <h3 className="font-semibold text-white text-sm">Enter Password & Play</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Click Connect, enter the server password revealed above, and step through the stones into the world!
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border/60 relative">
            <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
              1
            </span>
            <h3 className="font-semibold text-white text-sm">Launch Modded Valheim</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Ensure mods and BepInEx are installed into your Valheim installation folder.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border/60 relative">
            <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
              2
            </span>
            <h3 className="font-semibold text-white text-sm">Join Game &rarr; Join IP</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Navigate to the <strong>Join Game</strong> tab and click the <strong>Join IP</strong> button.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-border/60 relative">
            <span className="w-6 h-6 rounded-full bg-valheim-gold/20 text-valheim-gold flex items-center justify-center text-xs font-bold mb-3 border border-valheim-gold/30">
              3
            </span>
            <h3 className="font-semibold text-white text-sm">Enter IP & Port</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-mono">
              Type the direct host IP: <strong>180.181.238.103:2456</strong> and click Connect.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-valheim-card/70 border border-valheim-gold/20 bg-gradient-to-br from-valheim-card/80 to-amber-950/20 relative">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mb-3 border border-emerald-500/30">
              4
            </span>
            <h3 className="font-semibold text-white text-sm">Enter Password</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Type the server password and press Enter to connect directly to the host.
            </p>
          </div>
        </div>
      )}

      {/* Pro tip banner */}
      <div className="mt-5 flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90">
        <AlertCircle className="w-4 h-4 text-valheim-gold shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Crossplay Compatibility:</span> If you are playing on PC (Steam or PC Game Pass) or Xbox console, the <strong>Join Code</strong> routes automatically through PlayFab relays to bypass NAT and router firewall restrictions.
        </div>
      </div>
    </section>
  );
};
