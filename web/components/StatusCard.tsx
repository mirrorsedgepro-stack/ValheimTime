"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Eye, EyeOff, RefreshCw, Radio, Server, Key, Globe, Activity } from "lucide-react";
import { ServerStatus } from "@/lib/serverStatus";

interface StatusCardProps {
  initialStatus: ServerStatus;
}

export const StatusCard: React.FC<StatusCardProps> = ({ initialStatus }) => {
  const [status, setStatus] = useState<ServerStatus>(initialStatus);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchLatestStatus = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error("Failed to refresh status:", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    // Poll every 30 seconds for live changes
    const interval = setInterval(fetchLatestStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const isOnline = status.isOnline;

  return (
    <div className="relative rounded-2xl bg-valheim-card/90 border border-valheim-border p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-valheim-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Status indicator & Refresh button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-valheim-border/60">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                isOnline ? "bg-valheim-emerald animate-pulse" : "bg-red-500"
              }`}
            />
            {isOnline && (
              <span className="absolute w-5 h-5 rounded-full bg-valheim-emerald/40 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-wide">
                {status.serverName || "Odin's Hall"}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  isOnline
                    ? "bg-valheim-emerald/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {isOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Crossplay Enabled • PlayFab Network
            </p>
          </div>
        </div>

        <button
          onClick={fetchLatestStatus}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-valheim-surface/80 hover:bg-valheim-surface border border-valheim-border px-3.5 py-2 rounded-lg transition-all disabled:opacity-50"
          title="Refresh live status"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-valheim-gold" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Primary Connection Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {/* Join Code Card (High Priority) */}
        <div className="p-5 rounded-xl bg-valheim-surface/90 border border-valheim-gold/30 hover:border-valheim-gold/60 transition-colors relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-valheim-gold uppercase tracking-wider">
              <Radio className="w-4 h-4 text-valheim-gold animate-pulse" />
              <span>Crossplay Join Code</span>
            </div>
            <span className="text-[11px] text-slate-400 bg-valheim-card px-2 py-0.5 rounded border border-valheim-border/60">
              Recommended
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 bg-valheim-bg/80 border border-valheim-border rounded-lg p-3">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-widest selection:bg-valheim-gold selection:text-black">
              {status.joinCode || "Generating..."}
            </span>

            <button
              onClick={() => handleCopy(status.joinCode || "", "joinCode")}
              disabled={!status.joinCode}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-valheim-gold hover:bg-valheim-goldLight text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40"
            >
              {copiedField === "joinCode" ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Paste directly into Valheim: <strong>Join Game &rarr; Join Code</strong>
          </p>
        </div>

        {/* Server Password Card */}
        <div className="p-5 rounded-xl bg-valheim-surface/90 border border-valheim-border hover:border-slate-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Server Password</span>
            </div>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Hide
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Reveal
                </>
              )}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 bg-valheim-bg/80 border border-valheim-border rounded-lg p-3">
            <span className="font-mono text-xl sm:text-2xl font-bold text-slate-200 tracking-wider">
              {showPassword
                ? status.serverPassword || "No Password"
                : "••••••••••••"}
            </span>

            <button
              onClick={() => handleCopy(status.serverPassword || "", "password")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-valheim-card hover:bg-valheim-border text-slate-200 font-semibold text-xs border border-valheim-border transition-all active:scale-95"
            >
              {copiedField === "password" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Required when entering both Join Code and Direct IP
          </p>
        </div>
      </div>

      {/* Secondary Info: Direct IP & Server Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-valheim-border/60 text-xs">
        {/* Direct IP */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-valheim-surface/50 border border-valheim-border/50">
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-valheim-rune" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Direct IP & Port</p>
              <p className="font-mono font-medium text-slate-200 text-xs mt-0.5">{status.ipPort || "N/A"}</p>
            </div>
          </div>
          <button
            onClick={() => handleCopy(status.ipPort || "", "directIp")}
            className="p-1.5 rounded hover:bg-valheim-card text-slate-400 hover:text-white transition-colors"
            title="Copy Direct IP"
          >
            {copiedField === "directIp" ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Active Players */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-valheim-surface/50 border border-valheim-border/50">
          <Activity className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Players</p>
            <p className="font-semibold text-slate-200 text-xs mt-0.5">
              {status.playerCount} / 10 Connected
            </p>
          </div>
        </div>

        {/* Server Health */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-valheim-surface/50 border border-valheim-border/50">
          <Server className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Host Telemetry</p>
            <p className="font-mono text-slate-300 text-xs mt-0.5">
              CPU: {status.cpuUsage || "Active"} • RAM: {status.memUsage ? status.memUsage.split(" / ")[0] : "Normal"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
