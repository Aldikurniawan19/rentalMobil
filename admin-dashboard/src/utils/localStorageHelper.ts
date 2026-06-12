import { Car, Booking, LandingContent } from '../types';

// ─── Constants ───────────────────────────────────────────────
export const LATE_FEE_PERCENT = 10; // 10% of daily rate per hour
export const MAX_LATE_HOURS_BEFORE_FULL_DAY = 5;
export const RETURN_DEADLINE_HOUR = 16; // Batas jam pengembalian: 16:00

// ─── Helper Functions ────────────────────────────────────────

/** Generate unique booking code like KGYK-A3F8X2 */
export const generateBookingCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `KGYK-${code}`;
};

/** Calculate late fee based on hours late, using pricing policy:
 *  - Deadline: jam 16:00 pada tanggal akhir sewa
 *  - Denda: 10% tarif harian per jam keterlambatan
 *  - > 5 jam keterlambatan = 1 hari penuh tambahan
 */
export const calculateLateFee = (pricePerDay: number, returnDatetime: Date, endDate: string): { lateHours: number; lateFee: number } => {
  // Build deadline: endDate at 16:00
  const deadline = new Date(endDate);
  deadline.setHours(RETURN_DEADLINE_HOUR, 0, 0, 0);

  if (returnDatetime <= deadline) {
    return { lateHours: 0, lateFee: 0 };
  }

  const diffMs = returnDatetime.getTime() - deadline.getTime();
  const lateHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Round up to nearest hour

  const feePerHour = Math.round(pricePerDay * LATE_FEE_PERCENT / 100);

  let lateFee: number;
  if (lateHours > MAX_LATE_HOURS_BEFORE_FULL_DAY) {
    // More than 5 hours late → charge a full extra day
    lateFee = pricePerDay;
  } else {
    lateFee = feePerHour * lateHours;
  }

  return { lateHours, lateFee };
};

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
};

// ─── Default Data ────────────────────────────────────────────

const DEFAULT_CARS: Car[] = [
  {
    id: 1,
    name: "Toyota Avanza",
    type: "MPV",
    capacity: "7 Penumpang",
    trans: "Manual/Matic",
    price: 350000,
    img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80",
    status: true,
    category: "mpv",
    description: "Mobil MPV keluarga favorit dengan ruang kabin luas dan efisiensi bahan bakar yang sangat baik. Sangat cocok untuk perjalanan dalam kota maupun luar kota bersama keluarga tercinta."
  },
  {
    id: 2,
    name: "Toyota Innova Reborn",
    type: "MPV Premium",
    capacity: "7 Penumpang",
    trans: "Matic",
    price: 550000,
    img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
    status: true,
    category: "mpv",
    description: "MPV premium yang menawarkan kenyamanan ekstra, suspensi empuk, dan performa mesin tangguh. Pilihan tepat untuk perjalanan bisnis atau liburan keluarga dengan gaya dan prestise tinggi."
  },
  {
    id: 3,
    name: "Honda Brio",
    type: "City Car",
    capacity: "5 Penumpang",
    trans: "Matic",
    price: 300000,
    img: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=600&q=80",
    status: true,
    category: "city car",
    description: "City car gesit dan irit bahan bakar dengan desain stylish. Sangat mudah dikendarai bermanuver di jalanan kota yang padat."
  },
  {
    id: 4,
    name: "Toyota Fortuner",
    type: "SUV",
    capacity: "7 Penumpang",
    trans: "Matic",
    price: 900000,
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    status: true,
    category: "suv",
    description: "SUV tangguh dengan desain maskulin. Mampu melewati berbagai medan jalan dengan mudah tanpa mengorbankan kenyamanan eksklusif penumpang di dalamnya."
  },
  {
    id: 5,
    name: "Mitsubishi Pajero Sport",
    type: "SUV Premium",
    capacity: "7 Penumpang",
    trans: "Matic",
    price: 950000,
    img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=600&q=80",
    status: false,
    category: "suv",
    description: "SUV mewah dengan fitur keamanan canggih dan performa mesin diesel yang sangat bertenaga."
  },
  {
    id: 6,
    name: "Toyota Hiace",
    type: "Van",
    capacity: "12-15 Penumpang",
    trans: "Manual",
    price: 1200000,
    img: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80",
    status: true,
    category: "van",
    description: "Minibus komersial dengan kapasitas tempat duduk besar dan formasi kursi yang lega. Sangat ideal untuk rombongan wisata atau acara keluarga besar."
  }
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 1717000000001,
    bookingCode: "KGYK-B4X9K2",
    userEmail: "budi.santoso@gmail.com",
    userName: "Budi Santoso",
    carId: 2,
    carName: "Toyota Innova Reborn",
    startDate: "2026-06-10",
    endDate: "2026-06-12",
    duration: 3,
    serviceType: "Lepas kunci",
    pickupLocation: "Bandara Adisutjipto (JOG)",
    dropoffLocation: "Hotel Ambarrukmo",
    notes: "Tolong kirimkan mobil yang bersih dan wangi ya, terima kasih.",
    totalPrice: 1650000,
    status: "Menunggu Verifikasi",
    paymentStatus: "Belum Bayar",
    paidAt: null,
    releasedAt: null,
    returnedAt: null,
    lateFeeHours: 0,
    lateFee: 0,
    grandTotal: 1650000
  },
  {
    id: 1717000000002,
    bookingCode: "KGYK-S7R3M5",
    userEmail: "siti.rahma@yahoo.com",
    userName: "Siti Rahmawati",
    carId: 3,
    carName: "Honda Brio",
    startDate: "2026-06-08",
    endDate: "2026-06-09",
    duration: 2,
    serviceType: "Ambil di kantor rental",
    pickupLocation: "Kantor Pusat KGYK",
    dropoffLocation: "Kantor Pusat KGYK",
    notes: "Pengambilan sekitar jam 9 pagi.",
    totalPrice: 600000,
    status: "Disetujui",
    paymentStatus: "Belum Bayar",
    paidAt: null,
    releasedAt: null,
    returnedAt: null,
    lateFeeHours: 0,
    lateFee: 0,
    grandTotal: 600000
  },
  {
    id: 1717000000003,
    bookingCode: "KGYK-A8P2N7",
    userEmail: "andika.pratama@gmail.com",
    userName: "Andika Pratama",
    carId: 4,
    carName: "Toyota Fortuner",
    startDate: "2026-06-01",
    endDate: "2026-06-03",
    duration: 3,
    serviceType: "Dengan supir",
    pickupLocation: "Stasiun Tugu Yogyakarta",
    dropoffLocation: "Stasiun Tugu Yogyakarta",
    notes: "Untuk penjemputan tamu dinas luar kota.",
    totalPrice: 2700000,
    status: "Selesai",
    paymentStatus: "Lunas",
    paidAt: "2026-06-01T08:30:00",
    releasedAt: "2026-06-01T09:00:00",
    returnedAt: "2026-06-03T14:00:00",
    lateFeeHours: 0,
    lateFee: 0,
    grandTotal: 2700000
  },
  {
    id: 1717000000004,
    bookingCode: "KGYK-D3L6W9",
    userEmail: "dewi.lestari@gmail.com",
    userName: "Dewi Lestari",
    carId: 1,
    carName: "Toyota Avanza",
    startDate: "2026-06-05",
    endDate: "2026-06-07",
    duration: 3,
    serviceType: "Antar kendaraan ke lokasi",
    pickupLocation: "Stasiun Lempuyangan",
    dropoffLocation: "Stasiun Lempuyangan",
    notes: "Pembayaran via transfer bank.",
    totalPrice: 1050000,
    status: "Ditolak",
    paymentStatus: "Belum Bayar",
    paidAt: null,
    releasedAt: null,
    returnedAt: null,
    lateFeeHours: 0,
    lateFee: 0,
    grandTotal: 1050000
  }
];

const DEFAULT_LANDING_CONTENT: LandingContent = {
  hero: {
    title: "Rental Mobil Terpercaya di Yogyakarta",
    subtitle: "Solusi sewa mobil harian, mingguan, dan bulanan terbaik dengan pelayanan prima, armada bersih terawat, dan harga bersahabat.",
    ctaText: "Booking Sekarang"
  },
  promo: {
    title: "Promo Liburan Sekolah - Diskon 15% untuk semua tipe City Car!",
    discountPercent: 15,
    code: "LIBURSERU15",
    expiry: "2026-07-31"
  },
  faqs: [
    {
      id: 1,
      question: "Apa saja syarat untuk menyewa mobil lepas kunci?",
      answer: "Syarat utama sewa lepas kunci antara lain: KTP asli, SIM A yang masih aktif, Kartu Keluarga (KK), dan bukti pembayaran tagihan listrik/PBB atau kartu identitas karyawan."
    },
    {
      id: 2,
      question: "Apakah tarif sewa sudah termasuk bahan bakar (BBM) dan tol?",
      answer: "Tarif dasar sewa mobil yang tertera belum termasuk BBM, tol, parkir, dan makan supir (jika menyewa dengan supir), kecuali jika Anda mengambil paket all-inclusive khusus."
    },
    {
      id: 3,
      question: "Bagaimana jika terjadi keterlambatan pengembalian mobil?",
      answer: "Keterlambatan pengembalian dikenakan denda (overtime) sebesar 10% dari tarif sewa harian untuk setiap jam keterlambatan. Jika lebih dari 5 jam, akan dihitung sewa 1 hari penuh."
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Rian Hidayat",
      role: "Wisatawan, Jakarta",
      rating: 5,
      comment: "Pelayanannya luar biasa! Mobil Avanza yang saya sewa sangat bersih, AC dingin, dan mesinnya halus. Supirnya juga ramah dan tahu rute-rute wisata tersembunyi di Jogja.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Siska Amelia",
      role: "Pengusaha, Surabaya",
      rating: 5,
      comment: "Sangat puas dengan sewa Innova Reborn di KGYK. Proses booking cepat, mobil diantar tepat waktu ke Bandara, dan kondisi interiornya seperti mobil baru. Recomended!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    }
  ]
};

// ─── Storage Init & CRUD ─────────────────────────────────────

export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('kgyk_cars')) {
    localStorage.setItem('kgyk_cars', JSON.stringify(DEFAULT_CARS));
  }
  if (!localStorage.getItem('kgyk_bookings')) {
    localStorage.setItem('kgyk_bookings', JSON.stringify(DEFAULT_BOOKINGS));
  }
  if (!localStorage.getItem('kgyk_landing_content')) {
    localStorage.setItem('kgyk_landing_content', JSON.stringify(DEFAULT_LANDING_CONTENT));
  }
  const adminUsers = JSON.parse(localStorage.getItem('kgyk_admin_users') || '[]');
  if (adminUsers.length === 0) {
    localStorage.setItem('kgyk_admin_users', JSON.stringify([
      { username: 'admin', password: 'admin123', email: 'admin@kgyk.com', whatsapp: '+6281234567890' }
    ]));
  }
};

// Cars
export const getCars = (): Car[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('kgyk_cars') || '[]');
};

export const saveCars = (cars: Car[]) => {
  localStorage.setItem('kgyk_cars', JSON.stringify(cars));
};

// Bookings
export const getBookings = (): Booking[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('kgyk_bookings') || '[]');
};

export const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem('kgyk_bookings', JSON.stringify(bookings));
};

// Landing Content
export const getLandingContent = (): LandingContent => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('kgyk_landing_content') || JSON.stringify(DEFAULT_LANDING_CONTENT));
};

export const saveLandingContent = (content: LandingContent) => {
  localStorage.setItem('kgyk_landing_content', JSON.stringify(content));
};
