/**
 * Best-effort fixed-window rate limiter.
 *
 * Deliberately in-memory: it is per-instance and resets on redeploy, which is
 * the right trade for a low-volume contact form on serverless. It stops
 * casual flooding, not a determined attacker — the honeypot and server-side
 * validation carry the rest, and a durable store (Upstash/Redis) is the
 * upgrade path if volume ever justifies it.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Bounds memory if a burst of unique keys arrives. */
const MAX_TRACKED_KEYS = 5_000;

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || now >= existing.resetAt) {
    if (windows.size >= MAX_TRACKED_KEYS) {
      for (const [k, v] of windows) if (now >= v.resetAt) windows.delete(k);
      if (windows.size >= MAX_TRACKED_KEYS) windows.clear();
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { ok: true, retryAfterSeconds: 0 };
}
