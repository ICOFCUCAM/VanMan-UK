// ─── Navigation ──────────────────────────────────────────────────────────────

export type PageName =
  | 'home'
  | 'login'
  | 'driver-login'
  | 'driver-register'
  | 'driver-marketplace'
  | 'driver-dashboard'
  | 'customer-dashboard'
  | 'tracking'
  | 'admin'
  | 'corporate'
  | 'terms'
  | 'privacy'
  | 'cookies'
  | 'driver-agreement'
  | 'cancellation'
  | 'contact'
  | 'about';

// ─── Auth / Users ─────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'driver' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  is_student: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  driver: Driver | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  is_student?: boolean;
}

export interface SignInInput {
  email: string;
  password: string;
}

// ─── Drivers ─────────────────────────────────────────────────────────────────

export type DriverTier = 'gold' | 'silver';
export type DriverStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'active';
export type InsuranceType = 'comprehensive' | 'third-party';

export interface Driver {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_reg: string;
  insurance_type: InsuranceType;
  tier: DriverTier;
  status: DriverStatus;
  is_online: boolean;
  rating: number;
  total_jobs: number;
  total_earnings: number;
  created_at: string;
}

export interface CreateDriverInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_reg: string;
  insurance_type: InsuranceType;
  user_id?: string;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type DeliveryType = 'dedicated' | 'shared';
export type PaymentMethod = 'card' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  booking_ref: string | null;
  customer_id: string | null;
  driver_id: string | null;
  collection_address: string;
  delivery_address: string;
  stop_addresses: string[];
  has_stairs: boolean;
  vehicle_type: string;
  delivery_type: DeliveryType;
  helpers: number;
  distance_miles: number;
  duration: string;
  estimated_price: number;
  final_price: number | null;
  surge_multiplier: number;
  status: BookingStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  scheduled_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations (joined)
  driver?: Driver;
  customer?: UserProfile;
}

export interface CreateBookingInput {
  collection_address: string;
  delivery_address: string;
  stop_addresses: string[];
  has_stairs: boolean;
  vehicle_type: string;
  delivery_type: DeliveryType;
  helpers: number;
  distance_miles: number;
  duration: string;
  estimated_price: number;
  surge_multiplier: number;
  payment_method: PaymentMethod;
  customer_id?: string;
  scheduled_at?: string;
}

// ─── Quote (in-memory, not persisted) ────────────────────────────────────────

export interface QuoteData {
  distance: number;
  duration: string;
  basePrice: number;
  surgeMultiplier: number;
  vehicle: string;
  vehicleId: string;
  isSurge: boolean;
}

// ─── Jobs (driver marketplace) ────────────────────────────────────────────────

export type JobStatus = 'available' | 'assigned' | 'in_progress' | 'completed';

export interface Job {
  id: string;
  pickup: string;
  dropoff: string;
  distance: string;
  duration: string;
  price: number;
  customerRating: number;
  tier: DriverTier;
  status: JobStatus;
  items: string;
  helpers: number;
  booking_id?: string;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string | number;
  booking_id?: string;
  reviewer_id?: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  location: string;
}

// ─── Service response wrapper ─────────────────────────────────────────────────

export interface ServiceResult<T> {
  data: T | null;
  error: Error | null;
}

export interface ServiceListResult<T> {
  data: T[];
  error: Error | null;
}
