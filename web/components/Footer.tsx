"use client";

import React from "react";
import { Shield } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-valheim-border/60 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Shield className="w-4 h-4 text-valheim-gold" />
          <span className="font-semibold text-slate-300">Odin&apos;s Hall Dedicated Server</span>
          <span>• Valheim Modded Portal</span>
        </div>

        <p className="text-slate-500">
          Powered by Docker, Box64 + Wine, BepInEx & Vercel
        </p>
      </div>
    </footer>
  );
};
