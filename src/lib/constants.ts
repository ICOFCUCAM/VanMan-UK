// FAST MAN & VAN - Constants and Data

export const BRAND = {
  name: 'FAST MAN & VAN',
  tagline: 'Fast Reliable Transport for Your Goods',
  whatsapp: '+447432112438',
  whatsappDisplay: '+44 7432 112438',
  email: 'support@fastmanandvan.com',
  phone: '+44 20 7946 0958',
};

export const COLORS = {
  deepBlue: '#0A2463',
  gold: '#D4AF37',
  white: '#FFFFFF',
  lightBlue: '#1B3A8C',
  darkBlue: '#061539',
};

export const HERO_IMAGES = [
  'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002084324_d8caa6b6.png',
  'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002085117_c648ee0d.png',
  'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002085562_edbe4bc4.jpg',
];

export const DRIVER_IMAGES = [
  'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002102724_520f116c.png',
  'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002106278_cbed0cbd.jpg',
  'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002105207_df9852f7.jpg',
];

export const FEATURE_IMAGES = {
  dashboard: 'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002127223_561cac6a.png',
  tracking: 'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002126462_04ce1dee.png',
  corporate: 'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002150569_36e635bb.png',
  cityRoutes: 'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002170400_8c601e09.jpg',
  vanLoaded: 'https://d64gsuwffb70l.cloudfront.net/69addce9f38fe37cac4cb887_1773002187830_b366b069.png',
};

export const SERVICE_IMAGES = {
  houseMoving:      '/images/services/house-moving.svg',
  officeRelocation: '/images/services/office-relocation.svg',
  furnitureDelivery:'/images/services/furniture-delivery.svg',
  studentMoves:     '/images/services/student-moves.svg',
  sameDayDelivery:  '/images/services/same-day-delivery.svg',
  scheduled:        '/images/services/scheduled-transport.svg',
};

export const PRICING = {
  minimumBookingFee: 50,
  minimumJobDuration: 2, // hours
  minimumJobCost: 80,
  additionalTimeCharge: 30, // per additional 1-30 minutes
  studentDiscount: 0.10, // 10%
  platformCommission: 0.20, // 20% default (silver tier)
  surgeMultiplierMax: 2.5,
};

// Commission by driver tier — gold gets rewarded for comprehensive insurance
export const COMMISSION = {
  gold: 0.15,
  silver: 0.20,
  cashDeposit: 0.30,   // 30% upfront platform deposit for cash-payment jobs
  smallJobThreshold: 50,
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending:         'Awaiting Payment',
  escrow:          'Payment Secured',
  released:        'Completed & Paid',
  refunded:        'Refunded',
  invoice_pending: 'Invoice Pending',
};

export const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending:         'bg-yellow-100 text-yellow-700',
  escrow:          'bg-blue-100 text-blue-700',
  released:        'bg-green-100 text-green-700',
  refunded:        'bg-red-100 text-red-700',
  invoice_pending: 'bg-purple-100 text-purple-700',
};

export const VEHICLE_TYPES = [
  { id: 'small', name: 'Small Van', capacity: '1-2 items', basePrice: 50, image: '🚐', description: 'Perfect for single items or small moves' },
  { id: 'medium', name: 'Medium Van', capacity: '3-8 items', basePrice: 70, image: '🚛', description: 'Ideal for apartment moves' },
  { id: 'large', name: 'Large Van', capacity: '9-20 items', basePrice: 100, image: '🚚', description: 'Full house moves and large deliveries' },
  { id: 'luton', name: 'Luton Van', capacity: '20+ items', basePrice: 130, image: '📦', description: 'Maximum capacity for big moves' },
];

export const PROHIBITED_ITEMS = [
  'Weapons and firearms',
  'Illegal drugs and substances',
  'Explosives and ammunition',
  'Hazardous chemicals',
  'Radioactive materials',
  'Flammable liquids in bulk',
];

export const SAMPLE_REVIEWS = [
  { id: 1, name: 'Sarah Mitchell', rating: 5, text: 'Absolutely brilliant service! The driver arrived on time and handled all my furniture with great care. Will definitely use again.', date: '2 days ago', location: 'London to Brighton' },
  { id: 2, name: 'James Thompson', rating: 5, text: 'Used Fast Man & Van for my office relocation. Professional, efficient, and very reasonably priced. Highly recommended!', date: '1 week ago', location: 'Manchester' },
  { id: 3, name: 'Emily Chen', rating: 4, text: 'Great experience overall. The booking process was super easy and the driver was very friendly. Minor delay due to traffic but kept me updated.', date: '2 weeks ago', location: 'Birmingham to Leeds' },
  { id: 4, name: 'David Williams', rating: 5, text: 'As a student, the 10% discount was a lifesaver! Moved my entire flat in under 3 hours. Fantastic value for money.', date: '3 weeks ago', location: 'Oxford' },
  { id: 5, name: 'Rachel Green', rating: 5, text: 'The real-time tracking feature is amazing. I could see exactly where my driver was. Modern, tech-savvy service!', date: '1 month ago', location: 'London' },
  { id: 6, name: 'Michael Brown', rating: 4, text: 'Used the corporate account for our business deliveries. Excellent analytics dashboard and reliable drivers every time.', date: '1 month ago', location: 'Edinburgh' },
];

export const SAMPLE_JOBS = [
  { id: 'JOB-001', pickup: '15 Baker Street, London W1U', dropoff: '42 Oxford Road, Manchester M1', distance: '208 miles', duration: '3h 45m', price: 285, customerRating: 4.8, tier: 'gold', status: 'available', items: 'Furniture & boxes', helpers: 1 },
  { id: 'JOB-002', pickup: '7 Kings Road, Chelsea SW3', dropoff: '23 Park Lane, Mayfair W1K', distance: '2.3 miles', duration: '25m', price: 80, customerRating: 4.5, tier: 'silver', status: 'available', items: 'Office equipment', helpers: 0 },
  { id: 'JOB-003', pickup: '88 High Street, Edinburgh EH1', dropoff: '12 George Street, Glasgow G1', distance: '47 miles', duration: '1h 10m', price: 145, customerRating: 4.9, tier: 'gold', status: 'available', items: 'Full house move', helpers: 2 },
  { id: 'JOB-004', pickup: '5 Broad Street, Birmingham B1', dropoff: '19 Castle Street, Bristol BS1', distance: '88 miles', duration: '1h 40m', price: 175, customerRating: 4.7, tier: 'silver', status: 'available', items: 'Appliances', helpers: 1 },
  { id: 'JOB-005', pickup: '31 Queen Street, Cardiff CF10', dropoff: '8 Wind Street, Swansea SA1', distance: '42 miles', duration: '55m', price: 110, customerRating: 4.6, tier: 'silver', status: 'available', items: 'Student move', helpers: 0 },
  { id: 'JOB-006', pickup: '22 Deansgate, Manchester M3', dropoff: '15 The Headrow, Leeds LS1', distance: '43 miles', duration: '1h 05m', price: 120, customerRating: 5.0, tier: 'gold', status: 'available', items: 'Fragile items', helpers: 1 },
  { id: 'JOB-007', pickup: '9 Princes Street, Edinburgh EH2', dropoff: '45 Union Street, Aberdeen AB11', distance: '125 miles', duration: '2h 30m', price: 220, customerRating: 4.4, tier: 'silver', status: 'available', items: 'Mixed cargo', helpers: 1 },
  { id: 'JOB-008', pickup: '14 Cornmarket Street, Oxford OX1', dropoff: '3 Sidney Street, Cambridge CB2', distance: '80 miles', duration: '1h 35m', price: 160, customerRating: 4.8, tier: 'gold', status: 'available', items: 'Lab equipment', helpers: 2 },
];

export const NAV_LINKS = [
  { label: 'Home', page: 'home' },
  { label: 'Book Now', page: 'home' },
  { label: 'How It Works', page: 'home' },
  { label: 'For Drivers', page: 'driver-register' },
  { label: 'Corporate', page: 'corporate' },
  { label: 'Track Order', page: 'tracking' },
];
