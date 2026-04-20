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
  deepBlue: '#0E2A47',
  gold: '#F5B400',
  white: '#FFFFFF',
  lightBlue: '#0F3558',
  darkBlue: '#071A2F',
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
  officeRelocation:  'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  houseMoving:       'https://images.pexels.com/photos/3970332/pexels-photo-3970332.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  studentMoves:      'https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  furnitureDelivery: 'https://images.pexels.com/photos/4246222/pexels-photo-4246222.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  sameDayDelivery:   'https://images.pexels.com/photos/6169047/pexels-photo-6169047.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  scheduled:         'https://images.pexels.com/photos/13811650/pexels-photo-13811650.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
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

export const SUBSCRIPTION_PLANS = [
  { id: 'silver', name: 'Silver', price: 0, period: '/mo', commissionRate: 20, dispatchPriority: 'Standard', priorityLevel: 1, popular: false, features: ['20% platform commission', 'Standard job queue access', 'Verified driver badge', 'Goods-in-transit insurance included', 'Weekly BACS payout', 'Community support forum'] },
  { id: 'silver_plus', name: 'Silver Plus', price: 29, period: '/mo', commissionRate: 18, dispatchPriority: 'Moderate', priorityLevel: 2, popular: false, features: ['18% platform commission — save 2%', 'Moderate dispatch priority', 'Silver Plus profile badge', 'Enhanced insurance coverage', 'Weekly BACS payout', '24/7 driver support'] },
  { id: 'gold', name: 'Gold', price: 49, period: '/mo', commissionRate: 15, dispatchPriority: 'High', priorityLevel: 3, popular: true, features: ['15% platform commission', 'High dispatch priority', 'Gold profile badge & trust seal', 'Premium insurance coverage', 'Bi-weekly BACS payout', 'Dedicated account manager'] },
  { id: 'gold_pro', name: 'Gold Pro', price: 79, period: '/mo', commissionRate: 12, dispatchPriority: 'Very High', priorityLevel: 4, popular: false, features: ['12% platform commission', 'Very high dispatch priority', 'Gold Pro badge + featured listing', 'Corporate job access', 'Weekly BACS payout', 'Priority phone support'] },
  { id: 'elite', name: 'Elite', price: 129, period: '/mo', commissionRate: 10, dispatchPriority: 'Highest', priorityLevel: 5, popular: false, features: ['10% platform commission', 'First access to ALL jobs', 'Elite badge + top of marketplace', 'Corporate & enterprise accounts', 'Same-day BACS payout', 'Personal account manager'] },
] as const;

export function calculateCommission(jobValue: number, planId: string): { rate: number; commission: number; earning: number } {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  const rate = plan?.commissionRate ?? 20;
  const commission = Math.round(jobValue * (rate / 100));
  const earning = jobValue - commission;
  return { rate, commission, earning };
}

export const VEHICLE_TYPES = [
  { id: 'small', name: 'Small Van', capacity: '1–2 items', capacity_m3: 3.5, payload: '500 kg', basePrice: 50, pricePerHour: 35, image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop', description: 'Perfect for single items or small moves', bestFor: ['Single items', 'Box moves', 'eBay collections'], items: ['Armchair, 10 boxes', 'Small wardrobe'], examples: ['Ford Transit Connect', 'VW Caddy'] },
  { id: 'medium', name: 'Medium Van', capacity: '3–8 items', capacity_m3: 8.0, payload: '850 kg', basePrice: 70, pricePerHour: 50, image: 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop', description: 'Ideal for studio or 1-bed flat moves', bestFor: ['Studio flat', '1-bed flat', 'Office equipment'], items: ['Sofa, bed, 20 boxes', 'Studio flat contents'], examples: ['Ford Transit MWB', 'Mercedes Vito'] },
  { id: 'large', name: 'Large Van', capacity: '9–20 items', capacity_m3: 12.0, payload: '1100 kg', basePrice: 100, pricePerHour: 65, image: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop', description: 'Full 1–2 bed flat or small office move', bestFor: ['1–2 bed flat', 'Small office', 'Large furniture'], items: ['Double bed, 2 wardrobes, sofa, 30 boxes'], examples: ['Mercedes Sprinter', 'Ford Transit LWB'] },
  { id: 'luton', name: 'Luton Van', capacity: '20+ items', capacity_m3: 22.0, payload: '1500 kg', basePrice: 130, pricePerHour: 85, image: 'https://images.pexels.com/photos/6334834/pexels-photo-6334834.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop', description: 'Maximum capacity for large house moves', bestFor: ['3-bed house', 'Full house move', 'Large office'], items: ['Full house contents, piano, large appliances'], examples: ['Luton Box Van', 'Tail-lift Luton'] },
];

export const INVENTORY_ITEMS: Record<string, { name: string; volume: number; weight: number }[]> = {
  'Living Room': [
    { name: 'Sofa (2-seater)', volume: 1.2, weight: 60 },
    { name: 'Sofa (3-seater)', volume: 1.8, weight: 90 },
    { name: 'Armchair', volume: 0.6, weight: 30 },
    { name: 'Coffee Table', volume: 0.3, weight: 15 },
    { name: 'TV (55"+)', volume: 0.4, weight: 20 },
    { name: 'Bookcase', volume: 0.8, weight: 35 },
    { name: 'Dining Table', volume: 1.0, weight: 40 },
    { name: 'Dining Chair (×1)', volume: 0.2, weight: 8 },
  ],
  'Bedroom': [
    { name: 'Double Bed Frame', volume: 1.5, weight: 50 },
    { name: 'Single Bed Frame', volume: 0.9, weight: 30 },
    { name: 'Wardrobe (double)', volume: 2.0, weight: 80 },
    { name: 'Chest of Drawers', volume: 0.7, weight: 40 },
    { name: 'Bedside Table', volume: 0.2, weight: 10 },
    { name: 'Mattress (double)', volume: 0.8, weight: 30 },
  ],
  'Kitchen & Appliances': [
    { name: 'Fridge Freezer', volume: 0.6, weight: 70 },
    { name: 'Washing Machine', volume: 0.5, weight: 80 },
    { name: 'Tumble Dryer', volume: 0.5, weight: 40 },
    { name: 'Dishwasher', volume: 0.5, weight: 50 },
    { name: 'Microwave', volume: 0.1, weight: 12 },
    { name: 'Box of Kitchen Items', volume: 0.1, weight: 8 },
  ],
  'Office': [
    { name: 'Desk', volume: 0.8, weight: 40 },
    { name: 'Office Chair', volume: 0.5, weight: 15 },
    { name: 'Filing Cabinet', volume: 0.5, weight: 30 },
    { name: 'Box of Files / Books', volume: 0.1, weight: 12 },
  ],
  'Boxes & Bags': [
    { name: 'Small Box', volume: 0.04, weight: 8 },
    { name: 'Medium Box', volume: 0.07, weight: 12 },
    { name: 'Large Box', volume: 0.12, weight: 18 },
    { name: 'Suitcase', volume: 0.15, weight: 10 },
  ],
};

export const PROPERTY_PRESETS: Record<string, Record<string, number>> = {
  'Studio Flat': { 'Single Bed Frame': 1, 'Mattress (double)': 1, 'Sofa (2-seater)': 1, 'Small Box': 10, 'Medium Box': 5 },
  '1-Bed Flat': { 'Double Bed Frame': 1, 'Mattress (double)': 1, 'Sofa (2-seater)': 1, 'Dining Table': 1, 'Dining Chair (×1)': 4, 'Wardrobe (double)': 1, 'Medium Box': 10 },
  '2-Bed Flat': { 'Double Bed Frame': 1, 'Single Bed Frame': 1, 'Mattress (double)': 2, 'Sofa (3-seater)': 1, 'Armchair': 1, 'Dining Table': 1, 'Dining Chair (×1)': 4, 'Wardrobe (double)': 2, 'Fridge Freezer': 1, 'Medium Box': 15 },
  '3-Bed House': { 'Double Bed Frame': 1, 'Single Bed Frame': 2, 'Mattress (double)': 3, 'Sofa (3-seater)': 1, 'Armchair': 2, 'Dining Table': 1, 'Dining Chair (×1)': 6, 'Wardrobe (double)': 3, 'Fridge Freezer': 1, 'Washing Machine': 1, 'Large Box': 15 },
  'Office Move': { 'Desk': 4, 'Office Chair': 4, 'Filing Cabinet': 2, 'Box of Files / Books': 8 },
};

export function recommendVan(volumeM3: number): string {
  if (volumeM3 <= 3.5) return 'small';
  if (volumeM3 <= 8) return 'medium';
  if (volumeM3 <= 12) return 'large';
  return 'luton';
}

export const UK_CITIES = [
  { name: 'London', slug: 'london', drivers: '3,200+', bookings: '12,000+', image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
  { name: 'Manchester', slug: 'manchester', drivers: '580+', bookings: '2,100+', image: 'https://images.pexels.com/photos/3757144/pexels-photo-3757144.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
  { name: 'Birmingham', slug: 'birmingham', drivers: '420+', bookings: '1,800+', image: 'https://images.pexels.com/photos/4940764/pexels-photo-4940764.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
  { name: 'Edinburgh', slug: 'edinburgh', drivers: '280+', bookings: '900+', image: 'https://images.pexels.com/photos/2131828/pexels-photo-2131828.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop' },
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


export const NAV_LINKS = [
  { label: 'Book',        page: 'home' },
  { label: 'Services',    page: 'services' },
  { label: 'Enterprise',  page: 'enterprise' },
  { label: 'Drivers',     page: 'drivers' },
  { label: 'Track Order', page: 'tracking' },
];
