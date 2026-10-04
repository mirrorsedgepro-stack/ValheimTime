"use client";

import React, { useState } from "react";
import { Search, Layers, Compass, Backpack, Swords, Hammer, Sparkles, Box, KeyRound, Wrench } from "lucide-react";

interface ModItem {
  name: string;
  package: string;
  version: string;
  category: "Combat" | "Building" | "Equipment" | "Quality of Life" | "Navigation" | "Utility" | "Core";
  description: string;
  usage?: string;
  hotkey?: string;
}

const MODS: ModItem[] = [
  {
    name: "Adventure Backpacks",
    package: "Vapok-AdventureBackpacks",
    version: "2.2.9",
    category: "Equipment",
    description: "Craftable, upgradeable backpacks that add separate inventory storage, carry weight reduction, and environmental effects like freezing protection.",
    usage: "Equip to back. Open backpack storage with default key.",
    hotkey: "Press 'B' while worn",
  },
  {
    name: "Balrond Dual Mastery",
    package: "balrond-DualMastery",
    version: "0.3.10",
    category: "Combat",
    description: "Enables dual-wielding combinations (dual swords, axes, daggers, maces) complete with fluid dual-attack animations and a brand new Dual Mastery skill.",
    usage: "Equip one weapon in main hand and a compatible one-handed weapon in off-hand.",
    hotkey: "Standard Attack / Secondary Attack",
  },
  {
    name: "Build On Ship",
    package: "Searica-BuildOnShip",
    version: "4.0.0",
    category: "Building",
    description: "Allows building structures, crafting tables, chests, torches, and banners directly on boats (Karve, Longship) and carts for mobile sea bases.",
    usage: "Select hammer and aim building ghost directly onto ship deck.",
    hotkey: "Hammer build mode",
  },
  {
    name: "Craft From Chests",
    package: "toxo-CraftFromChests",
    version: "0.4.0",
    category: "Quality of Life",
    description: "Automatically pulls crafting and building materials from nearby chests without having to manually search containers and load up your pockets.",
    usage: "Stand near your storage area and craft or build normally.",
    hotkey: "Automatic in range",
  },
  {
    name: "Extra Slots",
    package: "shudnal-ExtraSlots",
    version: "1.2.16",
    category: "Equipment",
    description: "Adds dedicated equipment slots for Armor, Cape, Utility (Megingjord/Wisplight) plus dedicated quick-access consumable potion slots.",
    usage: "Open inventory (Tab). Equip gear directly into the dedicated slots.",
    hotkey: "Hotkeys 6, 7, 8 for quick slots",
  },
  {
    name: "HUD Compass",
    package: "neobotics-HUDCompass",
    version: "1.2.0",
    category: "Navigation",
    description: "An elegant, Skyrim-style compass banner at the top of your screen showing cardinal directions, map pins, bed location, and carts.",
    usage: "Always visible at top of HUD. Pin icons appear dynamically based on view distance.",
    hotkey: "Configurable in F1 menu",
  },
  {
    name: "PlanBuild",
    package: "marcopogo-PlanBuild",
    version: "0.20.0",
    category: "Building",
    description: "Plan structures ahead of time with zero-cost transparent ghost pieces, capture blueprints, and collaborate on massive community builds.",
    usage: "Craft the Rune of Planning or Blueprint Rune at the workbench.",
    hotkey: "Equip Planning Rune",
  },
  {
    name: "Quick Stack, Store, Sort & Trash",
    package: "Goldenrevolver-Quick_Stack_Store_Sort_Trash_Restock",
    version: "1.4.15",
    category: "Quality of Life",
    description: "Instantly deposit matching items from inventory into nearby chests with 1 key. Sort containers, favorite items to prevent stacking, and quick restock consumables.",
    usage: "Walk near chests and hit Quick Stack, or use buttons added to chest UI. Alt+Click to favorite items.",
    hotkey: "Default '~' (Tilde) key or UI button",
  },
  {
    name: "XPortal",
    package: "SpikeHimself-XPortal",
    version: "1.2.25",
    category: "Navigation",
    description: "Eliminates the hassle of portal pairs! Step up to any portal and pick your destination from a clean dropdown list of all existing portals.",
    usage: "Interact with any portal (E) and select your target destination from the menu.",
    hotkey: "Interact (E)",
  },
  {
    name: "Crop Utils",
    package: "CropUtils",
    version: "2.1.1",
    category: "Quality of Life",
    description: "Automatic grid alignment for farming carrots, turnips, onions, and barley to maximize farm yield and prevent crowded crops from decaying.",
    usage: "Hold Cultivator while planting crops for grid snapping.",
    hotkey: "Cultivator snap",
  },
  {
    name: "Easy Relocate",
    package: "ModdedWolf-EasyRelocate",
    version: "1.1.1",
    category: "Building",
    description: "Pick up, reposition, and rotate already-built furniture, signs, and chests without destroying them and dropping items on the floor.",
    usage: "Aim at piece with hammer and press relocate hotkey.",
    hotkey: "Middle Click / Relocate Key",
  },
  {
    name: "Valheim Configuration Manager",
    package: "shudnal-ConfigurationManager",
    version: "1.1.23",
    category: "Utility",
    description: "In-game settings overlay. Allows you to tweak client preferences, mod hotkeys, compass position, and UI scales without quitting the game.",
    usage: "Press F1 anywhere in-game or in main menu to open settings panel.",
    hotkey: "Press 'F1'",
  },
  {
    name: "Conditional Config Sync",
    package: "shudnal-ConditionalConfigSync",
    version: "1.0.10",
    category: "Core",
    description: "Server synchronization engine that ensures all connecting clients enforce matching server gameplay rules and configs seamlessly.",
    usage: "Fully automated server-side sync.",
    hotkey: "Automatic",
  },
  {
    name: "Jötunn, the Valheim Library",
    package: "ValheimModding-Jotunn",
    version: "2.30.2",
    category: "Core",
    description: "Industry-standard Valheim modding framework providing custom item registrations, localization, and network sync APIs.",
    usage: "Core dependency for advanced mods.",
    hotkey: "Library",
  },
  {
    name: "JsonDotNET & YamlDotNet",
    package: "Newtonsoft.Json & YamlDotNet",
    version: "13.0.3",
    category: "Core",
    description: "High-performance serialization libraries for custom configs, translations, and blueprint data files.",
    usage: "Background system libraries.",
    hotkey: "Library",
  }
];

export const ModCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Equipment", "Combat", "Building", "Quality of Life", "Navigation", "Utility", "Core"];

  const filteredMods = MODS.filter((mod) => {
    const matchesSearch =
      mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.package.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || mod.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="mod-catalog" className="mt-10 rounded-2xl bg-valheim-surface/80 border border-valheim-border p-6 sm:p-8 backdrop-blur-md">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-valheim-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-valheim-rune/15 text-valheim-rune text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            Server Mod Catalog
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Included Server Mods ({MODS.length})
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Every mod is configured and synced with the server for a balanced, quality-of-life enhanced Viking experience.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mods or hotkeys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-valheim-card/90 border border-valheim-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-valheim-gold transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-valheim-gold text-slate-950 font-bold"
                : "bg-valheim-card/60 text-slate-300 hover:text-white hover:bg-valheim-card border border-valheim-border/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {filteredMods.map((mod) => (
          <div
            key={mod.name}
            className="p-5 rounded-xl bg-valheim-card/60 border border-valheim-border hover:border-valheim-gold/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                  {mod.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-valheim-surface border border-valheim-border text-slate-400 shrink-0">
                  v{mod.version}
                </span>
              </div>

              <span className="inline-block text-[10px] uppercase font-semibold text-valheim-gold tracking-wider mb-2">
                {mod.category}
              </span>

              <p className="text-xs text-slate-300 leading-relaxed">
                {mod.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-valheim-border/40 text-[11px] text-slate-400 space-y-1">
              {mod.hotkey && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Hotkey / Control:</span>
                  <span className="font-mono text-amber-200 bg-valheim-surface px-1.5 py-0.5 rounded border border-valheim-border/60">
                    {mod.hotkey}
                  </span>
                </div>
              )}
              {mod.usage && (
                <div className="text-[10px] text-slate-400 italic">
                  Tip: {mod.usage}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMods.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm">
          No mods matching &quot;{searchTerm}&quot; found.
        </div>
      )}
    </section>
  );
};
