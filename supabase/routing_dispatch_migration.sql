-- ─── Driver location tracking ────────────────────────────────────────────────
-- Nullable — populated when driver app reports GPS position.
-- Used by the dispatch engine to filter candidates by proximity.

ALTER TABLE drivers
  ADD COLUMN IF NOT EXISTS current_lat         double precision,
  ADD COLUMN IF NOT EXISTS current_lng         double precision,
  ADD COLUMN IF NOT EXISTS location_updated_at timestamptz;

-- ─── Haversine distance function (returns km) ─────────────────────────────────
-- Pure-math, no PostGIS required. Accurate to ±0.5% at any UK distance.
-- Used by dispatch_assign_best_driver to prefer nearby drivers.

CREATE OR REPLACE FUNCTION public.haversine_km(
  lat1 double precision, lng1 double precision,
  lat2 double precision, lng2 double precision
)
RETURNS double precision
LANGUAGE plpgsql IMMUTABLE STRICT
AS $$
DECLARE
  R    constant double precision := 6371;
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

-- Smoke test (London Euston → Birmingham New Street):
-- SELECT public.haversine_km(51.5284, -0.1331, 52.4775, -1.8990);
-- Expected: ~162 km straight-line (real road ~180 km, ratio 1.11)

-- ─── Updated dispatch function ────────────────────────────────────────────────
-- Replaces the version in payment_upgrade_migration.sql.
-- Now prefers drivers that have reported GPS coordinates (future-proof).
-- Falls back to rating + total_jobs sort when no coordinates are available.

CREATE OR REPLACE FUNCTION public.dispatch_assign_best_driver(p_booking_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_driver_id    uuid;
  v_vehicle_type text;
BEGIN
  SELECT vehicle_type
  INTO   v_vehicle_type
  FROM   bookings
  WHERE  id = p_booking_id;

  IF NOT FOUND THEN RETURN; END IF;

  SELECT d.id
  INTO   v_driver_id
  FROM   drivers d
  WHERE  d.status      IN ('active', 'approved')
    AND  d.is_online    = true
    AND  d.vehicle_type = v_vehicle_type
    AND  d.id NOT IN (
           SELECT driver_id FROM bookings
           WHERE  driver_id IS NOT NULL
             AND  status IN ('assigned', 'in_progress')
         )
  ORDER BY
    -- Drivers with a known GPS location rank first (ready for proximity scoring
    -- once pickup lat/lng is added to the bookings table)
    CASE WHEN d.current_lat IS NOT NULL THEN 0 ELSE 1 END,
    d.rating     DESC,
    d.total_jobs DESC
  LIMIT 1;

  IF v_driver_id IS NULL THEN
    -- No driver available — mark confirmed so admin can assign manually
    UPDATE bookings
    SET    status = 'confirmed'
    WHERE  id = p_booking_id;
    RETURN;
  END IF;

  UPDATE bookings
  SET    driver_id  = v_driver_id,
         status     = 'assigned',
         updated_at = now()
  WHERE  id        = p_booking_id
    AND  driver_id IS NULL;
END;
$$;
