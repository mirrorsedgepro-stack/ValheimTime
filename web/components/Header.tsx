"use client";

import React from "react";
import { Shield, Sparkles, Swords, Users } from "lucide-react";

interface HeaderProps {
  serverName: string;
}

export const Header: React.FC<HeaderProps> = ({ serverName }) => {
  return (
    <header className="relative border-b border-valheim-border/60 bg-gradient-to-b from-valheim-surface to-valheim-bg/90 backdrop-blur-md pt-10 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Norse Runes / Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-24 bg-gradient-to-b from-valheim-gold/15 via-valheim-gold/5 to-transparent blur-2xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-valheim-card/80 border border-valheim-gold/30 text-valheim-gold text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Crossplay & BepInEx Enabled • Dedicated Server</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-valheim-gold to-amber-500">
            {serverName || "Odin's Hall"}
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Welcome, Viking. Access the realm with our live join code, explore the enhanced modpack, and prepare your gear for battle.
        </p>

        {/* Feature quick badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-valheim-surface/80 border border-valheim-border">
            <Users className="w-4 h-4 text-valheim-rune" />
            10-Player Capacity
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-valheim-surface/80 border border-valheim-border">
            <Swords className="w-4 h-4 text-valheim-gold" />
            16 Curated Mods
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-valheim-surface/80 border border-valheim-border">
            <Shield className="w-4 h-4 text-valheim-emerald" />
            Steam & Xbox Crossplay
          </span>
        </div>
      </div>
    </header>
  );
};
