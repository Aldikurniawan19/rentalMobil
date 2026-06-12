import React, { useState, useEffect } from 'react';
import { getBookings, saveBookings, getCars, calculateLateFee, formatRupiah } from '../utils/localStorageHelper';
import { Booking } from '../types';
import ReceiptModal, { ReceiptType } from '../components/ReceiptModal';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Receipt modal state
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [receiptType, setReceiptType] = useState<ReceiptType>('pemesanan');
  const [receiptPricePerDay, setReceiptPricePerDay] = useState(0);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const cars = getCars();

  const getPricePerDay = (carId: number) => {
    const car = cars.find(c => c.id === carId);
    return car?.price || 0;
  };

  const handleUpdateStatus = (id: number, status: Booking['status']) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status };
      }
      return b;
    });
    setBookings(updated);
    saveBookings(updated);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status });
    }
  };

  // Process vehicle release + payment
  const handleReleaseAndPay = (id: number) => {
    const now = new Date().toISOString();
    const updated = bookings.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: 'Dalam Penyewaan' as const,
          paymentStatus: 'Lunas' as const,
          paidAt: now,
          releasedAt: now,
        };
      }
      return b;
    });
    setBookings(updated);
    saveBookings(updated);

    const updatedBooking = updated.find(b => b.id === id)!;
    setSelectedBooking(updatedBooking);

    // Auto-open payment receipt
    setReceiptBooking(updatedBooking);
    setReceiptType('pembayaran');
    setReceiptPricePerDay(getPricePerDay(updatedBooking.carId));
  };

  // Process vehicle return with late fee calculation
  const handleReturn = (id: number) => {
    const now = new Date();
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const pricePerDay = getPricePerDay(booking.carId);
    const { lateHours, lateFee } = calculateLateFee(pricePerDay, now, booking.endDate);

    const updated = bookings.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: 'Selesai' as const,
          returnedAt: now.toISOString(),
          lateFeeHours: lateHours,
          lateFee: lateFee,
          grandTotal: b.totalPrice + lateFee,
        };
      }
      return b;
    });
    setBookings(updated);
    saveBookings(updated);

    const updatedBooking = updated.find(b => b.id === id)!;
    setSelectedBooking(updatedBooking);

    // Auto-open return receipt
    setReceiptBooking(updatedBooking);
    setReceiptType('pengembalian');
    setReceiptPricePerDay(pricePerDay);
  };

  const openReceipt = (booking: Booking, type: ReceiptType) => {
    setReceiptBooking(booking);
    setReceiptType(type);
    setReceiptPricePerDay(getPricePerDay(booking.carId));
  };

  const handleDeleteBooking = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan pesanan ini? Tindakan ini tidak dapat dibatalkan.')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      saveBookings(updated);
      setSelectedBooking(null);
    }
  };

  // Filter & Search
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.bookingCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') matchesStatus = b.status === 'Menunggu Verifikasi';
      else if (statusFilter === 'approved') matchesStatus = b.status === 'Disetujui';
      else if (statusFilter === 'renting') matchesStatus = b.status === 'Dalam Penyewaan';
      else if (statusFilter === 'completed') matchesStatus = b.status === 'Selesai';
      else if (statusFilter === 'rejected') matchesStatus = b.status === 'Ditolak';
    }
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Selesai': return { bg: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' };
      case 'Disetujui': return { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-100', dot: 'bg-emerald-500' };
      case 'Dalam Penyewaan': return { bg: 'bg-blue-50 text-blue-700 border border-blue-100', dot: 'bg-blue-500' };
      case 'Ditolak': return { bg: 'bg-rose-50 text-rose-700 border border-rose-100', dot: 'bg-rose-500' };
      default: return { bg: 'bg-amber-50 text-amber-700 border border-amber-100', dot: 'bg-amber-500 animate-pulse' };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filtering Tabs & Search */}
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl w-full xl:w-auto">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Menunggu' },
            { id: 'approved', label: 'Disetujui' },
            { id: 'renting', label: 'Dalam Sewa' },
            { id: 'completed', label: 'Selesai' },
            { id: 'rejected', label: 'Ditolak' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full xl:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <i className="ph ph-magnifying-glass"></i>
          </span>
          <input
            type="text"
            placeholder="Cari nama, email, kode booking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">Kode & Penyewa</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Mobil</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Periode</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-bold text-slate-400">
                    Tidak ada pesanan dalam kategori ini.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const style = getStatusStyle(b.status);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-mono text-[10px] font-bold text-blue-600 mb-0.5">
                          {b.bookingCode || `#BK-${String(b.id).substring(8)}`}
                        </div>
                        <div className="font-bold text-slate-700 text-sm">{b.userName}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{b.userEmail}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-700 text-sm block">{b.carName}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block uppercase">
                          {b.serviceType}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-600 text-xs font-semibold">
                          {b.startDate} s/d {b.endDate}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">
                          <i className="ph ph-clock inline mr-0.5"></i> {b.duration} Hari
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-800 text-sm font-extrabold block">{formatRupiah(b.grandTotal || b.totalPrice)}</span>
                        {b.lateFee > 0 && (
                          <span className="text-[9px] text-red-500 font-bold">+denda {formatRupiah(b.lateFee)}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${style.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer ml-auto"
                        >
                          <i className="ph ph-eye text-sm"></i> Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Booking Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 animate-scale-in">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedBooking.bookingCode || `#BK-${selectedBooking.id}`}</span>
                <h4 className="text-md font-extrabold text-slate-800 mt-0.5">Detail Rincian Reservasi</h4>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ph ph-x text-lg"></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[75vh] grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Booking & Customer Info */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Data Pelanggan & Sewa</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">NAMA</span>
                    <span className="text-xs font-extrabold text-slate-700">{selectedBooking.userName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">EMAIL</span>
                    <span className="text-xs font-semibold text-slate-700">{selectedBooking.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">MOBIL</span>
                    <span className="text-xs font-extrabold text-slate-700">{selectedBooking.carName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">LAYANAN</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block uppercase mt-0.5">{selectedBooking.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">MULAI</span>
                    <span className="text-xs font-bold text-slate-700">{selectedBooking.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">SELESAI</span>
                    <span className="text-xs font-bold text-slate-700">{selectedBooking.endDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">DURASI</span>
                    <span className="text-xs font-bold text-slate-700">{selectedBooking.duration} Hari</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">BIAYA SEWA</span>
                    <span className="text-sm font-extrabold text-slate-700">{formatRupiah(selectedBooking.totalPrice)}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">LOKASI AMBIL</span>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">{selectedBooking.pickupLocation}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">LOKASI KEMBALI</span>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">{selectedBooking.dropoffLocation}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">CATATAN</span>
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    {selectedBooking.notes || 'Tidak ada pesan.'}
                  </p>
                </div>

                {/* Late Fee Info (if applicable) */}
                {selectedBooking.status === 'Selesai' && selectedBooking.lateFee > 0 && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-3 space-y-1">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Denda Keterlambatan</span>
                    <p className="text-xs text-red-700 font-extrabold">{formatRupiah(selectedBooking.lateFee)} ({selectedBooking.lateFeeHours} jam)</p>
                    <p className="text-xs font-extrabold text-slate-800">Grand Total: {formatRupiah(selectedBooking.grandTotal)}</p>
                  </div>
                )}
              </div>

              {/* Right: Actions & Identity */}
              <div className="space-y-6 flex flex-col justify-between">
                {/* KTP Mock */}
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Identitas (KTP/SIM)</h5>
                  <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-40">
                    <div className="w-36 h-20 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl flex flex-col justify-between p-2.5 text-white shadow-md">
                      <div className="flex justify-between items-center">
                        <span className="text-[7px] font-extrabold tracking-widest text-slate-300">INDONESIA KTP</span>
                        <i className="ph-fill ph-check-square text-emerald-400 text-[8px]"></i>
                      </div>
                      <div className="space-y-0.5">
                        <div className="w-14 h-1 bg-slate-400/50 rounded"></div>
                        <div className="w-20 h-1 bg-slate-400/50 rounded"></div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-3 h-4 bg-slate-500/50 rounded-sm"></div>
                        <div className="w-10 h-0.5 bg-slate-400/30 rounded"></div>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold mt-2">KTP_{selectedBooking.userName.replace(/\s+/g, '_')}.png</span>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kontrol Status</span>

                  {/* Status: Menunggu Verifikasi */}
                  {selectedBooking.status === 'Menunggu Verifikasi' && (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleUpdateStatus(selectedBooking.id, 'Disetujui')}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-500/10">
                        <i className="ph ph-check-circle text-md"></i> Setujui
                      </button>
                      <button onClick={() => handleUpdateStatus(selectedBooking.id, 'Ditolak')}
                        className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-rose-500/10">
                        <i className="ph ph-x-circle text-md"></i> Tolak
                      </button>
                    </div>
                  )}

                  {/* Status: Disetujui → Proses Pelepasan & Pembayaran */}
                  {selectedBooking.status === 'Disetujui' && (
                    <div className="space-y-2">
                      <button onClick={() => handleReleaseAndPay(selectedBooking.id)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-500/15">
                        <i className="ph ph-hand-coins text-md"></i> Proses Pelepasan Kendaraan & Pembayaran
                      </button>
                      <p className="text-[10px] text-slate-400 font-medium text-center italic">
                        Pastikan pelanggan menunjukkan struk pemesanan dan identitas diri. Struk pembayaran akan otomatis tercetak.
                      </p>
                    </div>
                  )}

                  {/* Status: Dalam Penyewaan → Proses Pengembalian */}
                  {selectedBooking.status === 'Dalam Penyewaan' && (
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 text-center">
                        <span className="text-[10px] font-bold text-blue-600 flex items-center justify-center gap-1">
                          <i className="ph-fill ph-car text-sm"></i> Kendaraan sedang disewa — Lunas
                        </span>
                      </div>
                      <button onClick={() => handleReturn(selectedBooking.id)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/15">
                        <i className="ph ph-flag-chequered text-md"></i> Proses Pengembalian Mobil
                      </button>
                      <p className="text-[10px] text-slate-400 font-medium text-center italic">
                        Jika melewati batas jam 16:00 pada tanggal akhir sewa, denda keterlambatan otomatis dihitung.
                      </p>
                    </div>
                  )}

                  {/* Status: Selesai */}
                  {selectedBooking.status === 'Selesai' && (
                    <div className="space-y-2">
                      <div className="text-center py-1">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl inline-flex items-center gap-1.5">
                          <i className="ph-fill ph-check-circle text-md"></i> Transaksi Selesai
                        </span>
                      </div>
                      <button onClick={() => openReceipt(selectedBooking, 'pengembalian')}
                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-200">
                        <i className="ph ph-printer text-md"></i> Cetak Ulang Struk Pengembalian
                      </button>
                    </div>
                  )}

                  {/* Status: Ditolak */}
                  {selectedBooking.status === 'Ditolak' && (
                    <div className="text-center py-1">
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl inline-flex items-center gap-1.5">
                        <i className="ph-fill ph-x-circle text-md"></i> Reservasi Ditolak
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Print Buttons */}
                {(selectedBooking.status !== 'Ditolak' && selectedBooking.status !== 'Menunggu Verifikasi') && (
                  <div className="flex gap-2">
                    <button onClick={() => openReceipt(selectedBooking, 'pemesanan')}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-[10px] font-bold border border-slate-200 cursor-pointer transition-colors flex items-center justify-center gap-1">
                      <i className="ph ph-receipt text-sm"></i> Struk Pemesanan
                    </button>
                    {selectedBooking.paymentStatus === 'Lunas' && (
                      <button onClick={() => openReceipt(selectedBooking, 'pembayaran')}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-[10px] font-bold border border-slate-200 cursor-pointer transition-colors flex items-center justify-center gap-1">
                        <i className="ph ph-receipt text-sm"></i> Struk Bayar
                      </button>
                    )}
                  </div>
                )}

                {/* Delete */}
                <button onClick={() => handleDeleteBooking(selectedBooking.id)}
                  className="w-full py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl text-xs font-bold transition-all border border-slate-200 hover:border-red-200 cursor-pointer">
                  <i className="ph ph-trash mr-1"></i> Hapus dari Riwayat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Print Modal */}
      {receiptBooking && (
        <ReceiptModal
          booking={receiptBooking}
          type={receiptType}
          pricePerDay={receiptPricePerDay}
          onClose={() => setReceiptBooking(null)}
        />
      )}
    </div>
  );
}
