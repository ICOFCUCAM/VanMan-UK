-- ============================================================
-- VanMan-UK Escrow Management RPCs
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ─── 1. add_driver_pending ────────────────────────────────────────────────────
-- Called by the stripe-webhook edge function when payment is captured.
-- Adds the driver's share to their wallet pending balance.

CREATE OR REPLACE FUNCTION public.add_driver_pending(
  p_driver_id uuid,
  p_amount    numeric
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  UPDATE driver_wallets
  SET    pending    = pending + p_amount,
         updated_at = now()
  WHERE  driver_id  = p_driver_id;

  -- Wallet may not exist yet (driver registered before trigger was added)
  IF NOT FOUND THEN
    INSERT INTO driver_wallets (driver_id, pending)
    VALUES (p_driver_id, p_amount)
    ON CONFLICT (driver_id) DO UPDATE
      SET pending    = driver_wallets.pending + p_amount,
          updated_at = now();
  END IF;
END;
$$;

-- ─── 2. release_escrow_manually ──────────────────────────────────────────────
-- Admin-only: release funds held in escrow to the driver.
-- Use when both parties have confirmed but the automatic trigger misfired,
-- or when admin adjudicates a dispute in the driver's favour.

CREATE OR REPLACE FUNCTION public.release_escrow_manually(p_booking_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_escrow    escrow_payments%ROWTYPE;
  v_driver_id uuid;
  v_earning   numeric;
  v_commission numeric;
  v_rate      numeric;
BEGIN
  v_escrow := (
    SELECT ep FROM escrow_payments ep
    WHERE  ep.booking_id = p_booking_id
      AND  ep.status     = 'escrow'
    LIMIT 1
  );

  IF v_escrow.id IS NULL THEN RETURN; END IF;

  v_driver_id  := (SELECT driver_id FROM bookings WHERE id = p_booking_id LIMIT 1);
  v_earning    := COALESCE(v_escrow.driver_earning, 0);
  v_commission := COALESCE(v_escrow.commission_amount, 0);
  v_rate       := CASE WHEN (v_earning + v_commission) > 0
                       THEN v_commission / (v_earning + v_commission)
                       ELSE 0.20 END;

  IF v_driver_id IS NOT NULL AND v_earning > 0 THEN
    UPDATE driver_wallets
    SET    balance      = balance      + v_earning,
           pending      = GREATEST(0, pending - v_earning),
           total_earned = total_earned + v_earning,
           updated_at   = now()
    WHERE  driver_id = v_driver_id;

    INSERT INTO driver_wallet_transactions
      (driver_id, booking_id, type, amount, description)
    VALUES
      (v_driver_id, p_booking_id, 'escrow_release', v_earning,
       'Admin manual release for booking ' || p_booking_id::text);

    INSERT INTO commission_ledger
      (booking_id, driver_id, commission_amount, commission_rate)
    VALUES
      (p_booking_id, v_driver_id, v_commission, v_rate)
    ON CONFLICT DO NOTHING;
  END IF;

  UPDATE escrow_payments
  SET    status      = 'released',
         released_at = now()
  WHERE  id = v_escrow.id;

  UPDATE bookings
  SET    payment_status = 'released',
         status         = 'completed',
         updated_at     = now()
  WHERE  id = p_booking_id;
END;
$$;

-- ─── 3. refund_escrow_manually ────────────────────────────────────────────────
-- Admin-only: cancel escrow and mark booking refunded.
-- Reverses the driver's pending balance. Actual Stripe refund must be
-- initiated separately via the Stripe Dashboard.

CREATE OR REPLACE FUNCTION public.refund_escrow_manually(p_booking_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_escrow    escrow_payments%ROWTYPE;
  v_driver_id uuid;
  v_earning   numeric;
BEGIN
  v_escrow := (
    SELECT ep FROM escrow_payments ep
    WHERE  ep.booking_id = p_booking_id
      AND  ep.status     = 'escrow'
    LIMIT 1
  );

  IF v_escrow.id IS NULL THEN RETURN; END IF;

  v_driver_id := (SELECT driver_id FROM bookings WHERE id = p_booking_id LIMIT 1);
  v_earning   := COALESCE(v_escrow.driver_earning, 0);

  IF v_driver_id IS NOT NULL AND v_earning > 0 THEN
    UPDATE driver_wallets
    SET    pending    = GREATEST(0, pending - v_earning),
           updated_at = now()
    WHERE  driver_id  = v_driver_id;
  END IF;

  UPDATE escrow_payments
  SET    status = 'refunded'
  WHERE  id     = v_escrow.id;

  UPDATE bookings
  SET    payment_status = 'refunded',
         status         = 'cancelled',
         updated_at     = now()
  WHERE  id = p_booking_id;
END;
$$;

-- ─── 4. Grant execute to service_role (used by edge functions) ────────────────
GRANT EXECUTE ON FUNCTION public.add_driver_pending(uuid, numeric)       TO service_role;
GRANT EXECUTE ON FUNCTION public.release_escrow_manually(uuid)           TO service_role;
GRANT EXECUTE ON FUNCTION public.refund_escrow_manually(uuid)            TO service_role;
