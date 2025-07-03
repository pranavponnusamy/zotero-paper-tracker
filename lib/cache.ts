const cache = new Map();

export function setCache(key: string, value: any, ttl: number = 300000) { // ttl in milliseconds, default 5 minutes
    cache.set(key, { value, expiry: Date.now() + ttl });
}

export function getCache(key: string) {
    const item = cache.get(key);
    if (!item) {
        return null;
    }
    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }
    return item.value;
}

export function invalidateCache(key: string) {
    cache.delete(key);
}

export function invalidateUserCache(userId: string) {
    // Invalidate all cache entries related to a specific user
    for (const key of cache.keys()) {
        if (key.startsWith(`collections-${userId}`) || key.startsWith(`items-${userId}`)) {
            cache.delete(key);
        }
    }
}
