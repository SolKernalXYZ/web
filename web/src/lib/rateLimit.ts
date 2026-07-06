/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * NOTE: State is per-process. In a multi-instance / serverless deployment this
 * provides best-effort protection only; for hard guarantees back it with a
 * shared store (e.g. Redis / Upstash). It is sufficient to blunt accidental
 * loops and casual abuse on a single instance.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt, limit };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt, limit };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt, limit };
}

/** Periodically drop expired buckets so the map does not grow unbounded. */
function sweep() {
  const now = Date.now();
  buckets.forEach((bucket, key) => {
    if (now >= bucket.resetAt) buckets.delete(key);
  });
}

// Best-effort cleanup; unref so it never keeps the process alive.
if (typeof setInterval !== "undefined") {
  const timer = setInterval(sweep, 60_000);
  if (typeof timer === "object" && "unref" in timer) timer.unref();
}
