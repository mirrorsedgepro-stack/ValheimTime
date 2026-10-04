import { Redis } from "@upstash/redis";

export interface ServerStatus {
  isOnline: boolean;
  status: string;
  serverName: string;
  joinCode?: string;
  ipPort: string;
  playerCount: number;
  cpuUsage?: string;
  memUsage?: string;
  serverPassword?: string;
  updatedAt: string;
}

// In-memory fallback for development or when Redis is not configured
declare global {
  // eslint-disable-next-line no-var
  var __VALHEIM_STATUS_CACHE: ServerStatus | undefined;
}

const DEFAULT_STATUS: ServerStatus = {
  isOnline: true,
  status: "RUNNING",
  serverName: process.env.SERVER_NAME || "Odin's Hall",
  joinCode: process.env.SERVER_JOIN_CODE || "079650",
  ipPort: process.env.SERVER_IP_PORT || "180.181.238.103:2456",
  playerCount: 0,
  serverPassword: process.env.SERVER_PASSWORD || "Valheim2026!",
  updatedAt: new Date().toISOString(),
};

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      return new Redis({ url, token });
    } catch (e) {
      console.error("Failed to initialize Upstash Redis:", e);
    }
  }
  return null;
}

export async function getServerStatus(): Promise<ServerStatus> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<ServerStatus>("valheim:server_status");
      if (data) {
        return {
          ...DEFAULT_STATUS,
          ...data,
          serverPassword: data.serverPassword || process.env.SERVER_PASSWORD || DEFAULT_STATUS.serverPassword,
        };
      }
    } catch (err) {
      console.warn("Error fetching status from Upstash Redis, falling back to local memory:", err);
    }
  }

  // Memory fallback
  if (global.__VALHEIM_STATUS_CACHE) {
    return {
      ...global.__VALHEIM_STATUS_CACHE,
      serverPassword: global.__VALHEIM_STATUS_CACHE.serverPassword || process.env.SERVER_PASSWORD || DEFAULT_STATUS.serverPassword,
    };
  }

  return DEFAULT_STATUS;
}

export async function setServerStatus(status: Partial<ServerStatus>): Promise<ServerStatus> {
  const current = await getServerStatus();
  const updated: ServerStatus = {
    ...current,
    ...status,
    updatedAt: new Date().toISOString(),
  };

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set("valheim:server_status", updated);
    } catch (err) {
      console.warn("Error saving status to Upstash Redis:", err);
    }
  }

  global.__VALHEIM_STATUS_CACHE = updated;
  return updated;
}

export function validateWebhookSecret(providedSecret?: string | null): boolean {
  const configuredSecret = process.env.WEBHOOK_SECRET;
  if (!configuredSecret) {
    // If no secret configured, reject or allow in dev? Default to requiring secret
    return process.env.NODE_ENV === "development";
  }
  if (!providedSecret) return false;

  // Clean Bearer prefix if present
  const cleanToken = providedSecret.startsWith("Bearer ")
    ? providedSecret.slice(7).trim()
    : providedSecret.trim();

  return cleanToken === configuredSecret.trim();
}
