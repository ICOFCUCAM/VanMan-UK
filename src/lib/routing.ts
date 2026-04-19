// Dual-track routing: OSRM (real road distance) → Haversine×1.3 fallback

const CACHE_MAX = 100;
const routeCache = new Map<string, RouteResult>();

export interface RouteResult {
  distanceMiles: number;
  durationMinutes: number;
  source: 'osrm' | 'haversine';
}

function cacheKey(from: [number, number], to: [number, number]): string {
  // 4 decimal places ≈ 11m precision — same pair within the session hits cache
  return `${from[0].toFixed(4)},${from[1].toFixed(4)}|${to[0].toFixed(4)},${to[1].toFixed(4)}`;
}

function haversineFallback(from: [number, number], to: [number, number]): RouteResult {
  const R = 3958.8; // Earth radius in miles
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(to[0] - from[0]);
  const dLon = toRad(to[1] - from[1]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from[0])) * Math.cos(toRad(to[0])) * Math.sin(dLon / 2) ** 2;
  const straightMiles = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // UK road factor: 1.3 — motorway detours and A-road curves, less winding than Norway (1.4)
  const distanceMiles = Math.max(1, Math.round(straightMiles * 1.3 * 10) / 10);
  const durationMinutes = Math.round(distanceMiles * 1.7); // ~35 mph UK average
  return { distanceMiles, durationMinutes, source: 'haversine' };
}

/**
 * Returns real driving distance and duration.
 * Primary: OSRM public demo server (no API key, no cost).
 * Fallback: Haversine × 1.3 UK road factor if OSRM is unreachable.
 * Results are cached in-memory (LRU, max 100 entries) for the session.
 *
 * @param from [lat, lng] of the origin
 * @param to   [lat, lng] of the destination
 */
export async function getRoute(
  from: [number, number],
  to: [number, number],
): Promise<RouteResult> {
  const key = cacheKey(from, to);
  if (routeCache.has(key)) return routeCache.get(key)!;

  try {
    // OSRM expects [lng, lat] order in the URL
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=false`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) throw new Error('No route returned');

    const distanceMiles = Math.max(1, Math.round((route.distance / 1609.34) * 10) / 10);
    const durationMinutes = Math.max(1, Math.round(route.duration / 60));
    const result: RouteResult = { distanceMiles, durationMinutes, source: 'osrm' };

    if (routeCache.size >= CACHE_MAX) routeCache.delete(routeCache.keys().next().value!);
    routeCache.set(key, result);
    return result;
  } catch {
    // Network error, rate limit, or timeout — fall back to Haversine
    const result = haversineFallback(from, to);
    if (routeCache.size >= CACHE_MAX) routeCache.delete(routeCache.keys().next().value!);
    routeCache.set(key, result);
    return result;
  }
}
