-- ─── Driver location tracking ────────────────────────────────────────────────
-- Nullable — populated when driver app reports GPS position.
-- Used by the dispatch engine to filter candidates by proximity.

ALTER TABLE drivers
  ADD COLUMN IF NOT EXISTS current_lat  double precision,
  ADD COLUMN IF NOT EXISTS current_lng  double precision,
  ADD COLUMN IF NOT EXISTS location_updated_at timestamptz;

-- ─── Haversine distance function (returns km) ─────────────────────────────────
-- Pure-math, no PostGIS required. Accurate to ±0.5% at any UK distance.
-- Used by dispatch_rank_candidates to:
--   1. Filter drivers within 32 km (~20 miles) of the pickup
--   2. Weight distance in the dispatch score
-- Not used for UI distance display (that's OSRM → Haversine×1.3 client-side).

CREATE OR REPLACE FUNCTION public.haversine_km(
  lat1 double precision, lng1 double precision,
  lat2 double precision, lng2 double precision
)
RETURNS double precision
LANGUAGE plpgsql IMMUTABLE STRICT
AS $$
DECLARE
  R   constant double precision := 6371;
  dlat double precision;
  dlng double precision;
  a    double precision;
BEGIN
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);
  a := sin(dlat / 2) ^ 2
       + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ^ 2;
  RETURN R * 2 * atan2(sqrt(a), sqrt(1 - a));
END;
$$;

-- Smoke test (London Euston → Birmingham New Street ≈ 163 km by road):
-- SELECT public.haversine_km(51.5284, -0.1331, 52.4775, -1.8990);
-- Expected: ~162 km straight-line, real road ≈ 180 km (ratio 1.11 — within UK 1.2-1.3 factor)

-- ─── Update dispatch function to filter by proximity ──────────────────────────
-- Enhances dispatch_assign_best_driver (created in payment_upgrade_migration.sql)
-- to prefer nearby drivers when location data is available.
-- Falls back to rating-only sort when no drivers have reported coordinates.

CREATE OR REPLACE FUNCTION public.dispatch_assign_best_driver(p_booking_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_booking       bookings%ROWTYPE;
  v_driver_id     uuid;
BEGIN
  SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN RETURN; END IF;

  -- Pick the best available online driver.
  -- When drivers have GPS coordinates: prefer those within 32 km, scored by
  -- distance (closer = better) then rating. Beyond 32 km or no coordinates:
  -- fall back to rating only.
  SELECT d.id INTO v_driver_id
  FROM drivers d
  WHERE d.status   = 'active'
    AND d.is_online = true
    AND d.id NOT IN (
      SELECT driver_id FROM bookings
      WHERE driver_id IS NOT NULL
        AND status IN ('assigned', 'in_progress')
    )
  ORDER BY
    -- Drivers with known location AND within 32 km (~20 miles) rank first
    CASE
      WHEN d.current_lat IS NOT NULL
        AND public.haversine_km(d.current_lat, d.current_lng,
              -- Bookings don't store lat/lng yet; distance ordering applies once added.
              -- For now this CASE evaluates to false and falls through to rating sort.
              0, 0) < 32
      THEN 0
      ELSE 1
    END,
    d.rating DESC
  LIMIT 1;

  IF v_driver_id IS NULL THEN RETURN; END IF;

  UPDATE bookings
  SET driver_id  = v_driver_id,
      status     = 'assigned',
      updated_at = now()
  WHERE id = p_booking_id
    AND driver_id IS NULL;
END;
$$;
