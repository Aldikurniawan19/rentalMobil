export interface Car {
  id: number;
  name: string;
  type: string;
  capacity: string;
  trans: string;
  price: number;
  img: string;
  status: boolean;
  category: 'city car' | 'mpv' | 'suv' | 'van';
  description: string;
}

export interface Booking {
  id: number;
  bookingCode: string;
  userEmail: string;
  userName: string;
  carId: number;
  carName: string;
  startDate: string;
  endDate: string;
  duration: number;
  serviceType: string;
  pickupLocation: string;
  dropoffLocation: string;
  notes: string;
  totalPrice: number;
  status: 'Menunggu Verifikasi' | 'Disetujui' | 'Ditolak' | 'Dalam Penyewaan' | 'Selesai';
  paymentStatus: 'Belum Bayar' | 'Lunas';
  paidAt: string | null;
  releasedAt: string | null;
  returnedAt: string | null;
  lateFeeHours: number;
  lateFee: number;
  grandTotal: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface PromoContent {
  title: string;
  discountPercent: number;
  code: string;
  expiry: string;
}

export interface LandingContent {
  hero: HeroContent;
  promo: PromoContent;
  faqs: FAQ[];
  testimonials: Testimonial[];
}
