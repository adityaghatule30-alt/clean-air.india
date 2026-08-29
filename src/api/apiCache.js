// CleanAir India - In-Memory API Cache & Rate-Limit Shield
// Reuses fresh responses within 10 minutes (TTL) and provides stale fallbacks during network hiccups.

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

class ApiCache {
  constructor() {
    this.cache = new Map();
  }

  generateKey(prefix, lat, lon) {
    const rLat = Number(lat).toFixed(3);
    const rLon = Number(lon).toFixed(3);
    return `${prefix}_${rLat}_${rLon}`;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
    return {
      data: entry.data,
      timestamp: entry.timestamp,
      isExpired
    };
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();
