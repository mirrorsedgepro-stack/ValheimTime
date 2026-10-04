"use client";

import React from "react";
import { ShieldCheck, HeartHandshake, Save, AlertTriangle } from "lucide-react";

export const ServerRules: React.FC = () => {
  return (
    <section className="mt-10 rounded-2xl bg-valheim-surface/80 border border-valheim-border p-6 sm:p-8 backdrop-blur-md">
      <div className="pb-6 border-b border-valheim-border/60">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-valheim-emerald" />
          Server Rules & World Guidelines
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Keep the realm enjoyable and lag-free for every Viking exploring the tenth world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <div className="p-5 rounded-xl bg-valheim-card/60 border border-valheim-border">
          <HeartHandshake className="w-5 h-5 text-valheim-gold mb-3" />
          <h3 className="font-semibold text-white text-sm">Base Etiquette & Chests</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Respect shared communal bases. If you take ingots, food, or building materials from shared workshop chests, replenish them when returning from expeditions.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-valheim-card/60 border border-valheim-border">
          <AlertTriangle className="w-5 h-5 text-amber-400 mb-3" />
          <h3 className="font-semibold text-white text-sm">Performance & Cleanliness</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Valheim calculates physics instances per zone. Avoid unnecessary terraforming (deep flattening), chop down stump remnants, and avoid leaving thousands of dropped loose items on the ground.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-valheim-card/60 border border-valheim-border">
          <Save className="w-5 h-5 text-valheim-rune mb-3" />
          <h3 className="font-semibold text-white text-sm">Automated World Backups</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            The server automatically saves progress every 30 minutes and maintains 8 redundant rolling backups. If an unexpected crash occurs, worlds can be restored with minimal rollback.
          </p>
        </div>
      </div>
    </section>
  );
};
