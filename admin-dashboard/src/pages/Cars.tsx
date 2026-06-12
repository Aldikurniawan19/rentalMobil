import React, { useState, useEffect } from 'react';
import { getCars, saveCars } from '../utils/localStorageHelper';
import { Car } from '../types';

export default function Cars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('');
  const [formCategory, setFormCategory] = useState<'city car' | 'mpv' | 'suv' | 'van'>('city car');
  const [formCapacity, setFormCapacity] = useState('5 Penumpang');
  const [formTrans, setFormTrans] = useState('Matic');
  const [formPrice, setFormPrice] = useState(300000);
  const [formImg, setFormImg] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState(true);

  useEffect(() => {
    setCars(getCars());
  }, []);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
  };

  const openAddModal = () => {
    setEditingCar(null);
    setFormName('');
    setFormType('');
    setFormCategory('city car');
    setFormCapacity('5 Penumpang');
    setFormTrans('Matic');
    setFormPrice(300000);
    setFormImg('https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=600&q=80');
    setFormDescription('');
    setFormStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setFormName(car.name);
    setFormType(car.type);
    setFormCategory(car.category);
    setFormCapacity(car.capacity);
    setFormTrans(car.trans);
    setFormPrice(car.price);
    setFormImg(car.img);
    setFormDescription(car.description);
    setFormStatus(car.status);
    setIsModalOpen(true);
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formType || !formImg || !formDescription) {
      alert('Mohon lengkapi semua kolom formulir.');
      return;
    }

    let updatedCars: Car[];

    if (editingCar) {
      // EDIT MODE
      updatedCars = cars.map(c => {
        if (c.id === editingCar.id) {
          return {
            ...c,
            name: formName,
            type: formType,
            category: formCategory,
            capacity: formCapacity,
            trans: formTrans,
            price: formPrice,
            img: formImg,
            description: formDescription,
            status: formStatus
          };
        }
        return c;
      });
    } else {
      // ADD MODE
      const newCar: Car = {
        id: Date.now(),
        name: formName,
        type: formType,
        category: formCategory,
        capacity: formCapacity,
        trans: formTrans,
        price: formPrice,
        img: formImg,
        description: formDescription,
        status: formStatus
      };
      updatedCars = [...cars, newCar];
    }

    setCars(updatedCars);
    saveCars(updatedCars);
    setIsModalOpen(false);
  };

  const handleDeleteCar = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus mobil ini dari katalog?')) {
      const updated = cars.filter(c => c.id !== id);
      setCars(updated);
      saveCars(updated);
    }
  };

  const toggleCarStatus = (id: number) => {
    const updated = cars.map(c => {
      if (c.id === id) {
        return { ...c, status: !c.status };
      }
      return c;
    });
    setCars(updated);
    saveCars(updated);
  };

  // Filtering Logic
  const filteredCars = cars.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <i className="ph ph-magnifying-glass"></i>
            </span>
            <input
              type="text"
              placeholder="Cari mobil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 font-medium"
          >
            <option value="all">Semua Kategori</option>
            <option value="city car">City Car</option>
            <option value="mpv">MPV</option>
            <option value="suv">SUV</option>
            <option value="van">Van</option>
          </select>
        </div>

        {/* Add New Car Button */}
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <i className="ph ph-plus-circle text-md font-bold"></i>
          <span>Tambah Mobil Baru</span>
        </button>
      </div>

      {/* Cars Grid/Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Foto & Tipe</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Spesifikasi</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Harga Harian</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status Ready</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-bold text-slate-400">
                    Tidak ada mobil yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Foto & Nama */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={car.img}
                          alt={car.name}
                          className="w-16 h-10 object-cover rounded-lg border border-slate-100 shadow-sm bg-slate-50 flex-shrink-0"
                          onError={(e) => {
                            // Fallback if image fails
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=150&q=80';
                          }}
                        />
                        <div>
                          <div className="font-extrabold text-slate-700 text-sm">{car.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{car.type}</div>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="p-4">
                      <span className="capitalize text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {car.category}
                      </span>
                    </td>

                    {/* Spesifikasi */}
                    <td className="p-4">
                      <div className="flex gap-3 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <i className="ph ph-users text-slate-400"></i> {car.capacity}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ph ph-arrows-split-c text-slate-400"></i> {car.trans}
                        </span>
                      </div>
                    </td>

                    {/* Harga Harian */}
                    <td className="p-4 text-slate-800 text-sm font-extrabold">
                      {formatRupiah(car.price)} <span className="text-[10px] text-slate-400 font-medium">/hari</span>
                    </td>

                    {/* Status Ketersediaan */}
                    <td className="p-4">
                      <button
                        onClick={() => toggleCarStatus(car.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          car.status 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${car.status ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {car.status ? 'Tersedia' : 'Kosong'}
                      </button>
                    </td>

                    {/* Aksi Edit/Delete */}
                    <td className="p-4 text-right pr-6">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEditModal(car)}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Ubah Rincian"
                        >
                          <i className="ph ph-pencil-simple text-sm font-bold"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-600 text-slate-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Hapus Mobil"
                        >
                          <i className="ph ph-trash text-sm font-bold"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-md font-extrabold text-slate-800">
                {editingCar ? 'Ubah Rincian Armada Mobil' : 'Tambah Armada Mobil Baru'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ph ph-x text-lg"></i>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveCar} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Mobil */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Mobil</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                    placeholder="Contoh: Toyota Avanza Veloz"
                  />
                </div>

                {/* Tipe / Sub-Tipe */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipe Transmisi/Mesin</label>
                  <input
                    type="text"
                    required
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                    placeholder="Contoh: MPV Premium / Manual/Matic"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori Mobil</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-semibold"
                  >
                    <option value="city car">City Car</option>
                    <option value="mpv">MPV (Mobil Keluarga)</option>
                    <option value="suv">SUV (Gagah/Petualang)</option>
                    <option value="van">Van (Minibus/Rombongan)</option>
                  </select>
                </div>

                {/* Harga Harian */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Harga Sewa Per Hari (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-800 font-bold"
                    placeholder="350000"
                  />
                </div>

                {/* Kapasitas Penumpang */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kapasitas Penumpang</label>
                  <input
                    type="text"
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                    placeholder="Contoh: 7 Penumpang atau 12-15 Penumpang"
                  />
                </div>

                {/* Transmisi Ringkas */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jenis Transmisi</label>
                  <input
                    type="text"
                    required
                    value={formTrans}
                    onChange={(e) => setFormTrans(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                    placeholder="Contoh: Matic, Manual, atau Manual/Matic"
                  />
                </div>
              </div>

              {/* URL Foto Mobil */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">URL Foto Kendaraan</label>
                <input
                  type="url"
                  required
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-mono text-slate-600"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Deskripsi Singkat */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Detail Kendaraan</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white resize-none text-slate-600 leading-relaxed"
                  placeholder="Jelaskan kenyamanan mobil, suspensi, efisiensi bahan bakar, serta kelebihan utamanya..."
                />
              </div>

              {/* Status Ready / Switch */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <input
                  type="checkbox"
                  id="status-checkbox"
                  checked={formStatus}
                  onChange={(e) => setFormStatus(e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="status-checkbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Tandai mobil langsung berstatus 'Tersedia' (Ready untuk dipesan online)
                </label>
              </div>

              {/* Footer Aksi */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-blue-500/10 transition-colors"
                >
                  Simpan Armada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
