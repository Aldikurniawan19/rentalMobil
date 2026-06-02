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

export const cars: Car[] = [
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
    description:
      "Mobil MPV keluarga favorit dengan ruang kabin luas dan efisiensi bahan bakar yang sangat baik. Sangat cocok untuk perjalanan dalam kota maupun luar kota bersama keluarga tercinta. Bagasi belakang luas memuat banyak barang bawaan.",
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
    description: "MPV premium yang menawarkan kenyamanan ekstra, suspensi empuk, dan performa mesin tangguh. Pilihan tepat untuk perjalanan bisnis atau liburan keluarga dengan gaya dan prestise tinggi.",
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
    description: "City car gesit dan irit bahan bakar dengan desain stylish. Sangat mudah dikendarai bermanuver di jalanan kota yang padat dan sangat mudah untuk mencari tempat parkir.",
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
    description: "SUV tangguh dengan desain maskulin. Mampu melewati berbagai medan jalan dengan mudah tanpa mengorbankan kenyamanan eksklusif penumpang di dalamnya. Cocok untuk petualangan maupun gaya hidup urban.",
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
    description: "SUV mewah dengan fitur keamanan canggih dan performa mesin diesel yang sangat bertenaga. Interior premium berbahan kulit memberikan pengalaman berkendara yang mewah dan tak terlupakan.",
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
    description: "Minibus komersial dengan kapasitas tempat duduk besar dan formasi kursi yang lega. Sangat ideal untuk rombongan wisata, acara keluarga besar, atau keperluan antar jemput rombongan perusahaan dengan kabin sejuk.",
  },
  {
    id: 7,
    name: "Suzuki Ertiga",
    type: "MPV",
    capacity: "7 Penumpang",
    trans: "Manual",
    price: 380000,
    img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80",
    status: true,
    category: "mpv",
    description: "Mobil MPV keluarga yang sangat efisien dan nyaman. Dengan kabin yang senyap dan performa mesin yang andal, Ertiga sangat tepat untuk keperluan harian Anda di perkotaan maupun perjalanan keluarga jauh.",
  },
  {
    id: 8,
    name: "Honda Civic RS",
    type: "Sedan Premium",
    capacity: "5 Penumpang",
    trans: "Matic",
    price: 750000,
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
    status: true,
    category: "city car",
    description: "Sedan premium dengan karakter sporty yang kuat. Dilengkapi dengan teknologi keselamatan canggih, mesin turbo bertenaga, dan interior mewah yang memanjakan pengemudi maupun penumpang.",
  },
];

