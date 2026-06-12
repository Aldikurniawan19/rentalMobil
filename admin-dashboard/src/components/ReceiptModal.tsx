import React from 'react';
import { Booking } from '../types';
import { formatRupiah, LATE_FEE_PERCENT, MAX_LATE_HOURS_BEFORE_FULL_DAY, RETURN_DEADLINE_HOUR } from '../utils/localStorageHelper';

export type ReceiptType = 'pemesanan' | 'pembayaran' | 'pengembalian';

interface ReceiptModalProps {
  booking: Booking;
  type: ReceiptType;
  pricePerDay: number;
  onClose: () => void;
}

export default function ReceiptModal({ booking, type, pricePerDay, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const getTitle = () => {
    switch (type) {
      case 'pemesanan': return 'STRUK PEMESANAN';
      case 'pembayaran': return 'STRUK PEMBAYARAN';
      case 'pengembalian': return 'STRUK PENGEMBALIAN';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'pemesanan': return 'Tunjukkan struk ini kepada petugas saat pengambilan kendaraan';
      case 'pembayaran': return 'Bukti pembayaran sewa kendaraan yang sah';
      case 'pengembalian': return 'Bukti pengembalian kendaraan dan penyelesaian transaksi';
    }
  };

  const formatDatetime = (datetime: string | null) => {
    if (!datetime) return '-';
    return new Date(datetime).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Non-printable header controls */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <span className="text-xs font-bold text-slate-500">Preview Struk — Siap Dicetak</span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md shadow-blue-500/10"
            >
              <i className="ph ph-printer text-sm"></i> Cetak Struk
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <i className="ph ph-x text-lg"></i>
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div id="receipt-print-area" className="p-4 sm:p-6 overflow-y-auto print:overflow-visible print:p-4">
          {/* Receipt Header */}
          <div className="text-center border-b-2 border-dashed border-slate-200 pb-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ph-fill ph-steering-wheel text-sm text-white"></i>
              </div>
              <span className="font-extrabold text-sm text-slate-800 tracking-tight">KGYK RENTAL MOBIL</span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
              Jl. Pandega Marga, Caturtunggal, Kec. Depok, Sleman, DIY 55281<br/>
              Telp/WA: +62 812 3456 7890 • Email: cs@kgyk.com
            </p>
          </div>

          {/* Receipt Title */}
          <div className="text-center mb-4">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase">{getTitle()}</h3>
            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{getSubtitle()}</p>
          </div>

          {/* Booking Code & Date */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Kode Booking</span>
              <span className="text-md font-extrabold text-blue-600 font-mono tracking-widest">{booking.bookingCode}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Tanggal Cetak</span>
              <span className="text-[10px] font-bold text-slate-600">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-3 space-y-1.5">
            <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Data Penyewa</h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">NAMA</span>
                <span className="text-[10px] font-bold text-slate-700">{booking.userName}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">EMAIL</span>
                <span className="text-[10px] font-semibold text-slate-600">{booking.userEmail}</span>
              </div>
            </div>
          </div>

          {/* Vehicle & Rental Details */}
          <div className="mb-3 space-y-1.5">
            <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Detail Sewa Kendaraan</h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">KENDARAAN</span>
                <span className="text-[10px] font-bold text-slate-700">{booking.carName}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">LAYANAN</span>
                <span className="text-[10px] font-semibold text-slate-600">{booking.serviceType}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">TANGGAL MULAI</span>
                <span className="text-[10px] font-bold text-slate-700">{formatDate(booking.startDate)}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">TANGGAL SELESAI</span>
                <span className="text-[10px] font-bold text-slate-700">{formatDate(booking.endDate)}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">DURASI</span>
                <span className="text-[10px] font-bold text-slate-700">{booking.duration} Hari</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">BATAS KEMBALI</span>
                <span className="text-[10px] font-bold text-slate-700">{formatDate(booking.endDate)}, {RETURN_DEADLINE_HOUR}:00 WIB</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">LOKASI AMBIL</span>
                <span className="text-[10px] font-semibold text-slate-600">{booking.pickupLocation}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold block">LOKASI KEMBALI</span>
                <span className="text-[10px] font-semibold text-slate-600">{booking.dropoffLocation}</span>
              </div>
            </div>
          </div>

          {/* Timestamps (for pembayaran/pengembalian) */}
          {(type === 'pembayaran' || type === 'pengembalian') && (
            <div className="mb-3 space-y-1.5">
              <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Catatan Waktu Proses</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {booking.paidAt && (
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold block">WAKTU BAYAR</span>
                    <span className="text-[10px] font-bold text-emerald-600">{formatDatetime(booking.paidAt)}</span>
                  </div>
                )}
                {booking.releasedAt && (
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold block">WAKTU LEPAS KENDARAAN</span>
                    <span className="text-[10px] font-bold text-slate-700">{formatDatetime(booking.releasedAt)}</span>
                  </div>
                )}
                {type === 'pengembalian' && booking.returnedAt && (
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold block">WAKTU PENGEMBALIAN</span>
                    <span className="text-[10px] font-bold text-slate-700">{formatDatetime(booking.returnedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="border-t-2 border-dashed border-slate-200 pt-3 mb-3 space-y-2">
            <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rincian Biaya</h5>

            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-500 font-medium">Tarif Harian ({formatRupiah(pricePerDay)} × {booking.duration} hari)</span>
              <span className="font-bold text-slate-700">{formatRupiah(booking.totalPrice)}</span>
            </div>

            {type === 'pengembalian' && booking.lateFee > 0 && (
              <div className="flex justify-between items-center text-[10px] bg-red-50 border border-red-100 rounded-lg px-2 py-1.5">
                <span className="text-red-600 font-semibold">
                  Denda Keterlambatan ({booking.lateFeeHours} jam × {LATE_FEE_PERCENT}% tarif/jam)
                  {booking.lateFeeHours > MAX_LATE_HOURS_BEFORE_FULL_DAY && (
                    <span className="block text-[8px] text-red-400">&gt;{MAX_LATE_HOURS_BEFORE_FULL_DAY} jam → dihitung 1 hari penuh</span>
                  )}
                </span>
                <span className="font-extrabold text-red-700">+{formatRupiah(booking.lateFee)}</span>
              </div>
            )}

            {type === 'pengembalian' && booking.lateFeeHours === 0 && (
              <div className="flex justify-between items-center text-[10px] bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1.5">
                <span className="text-emerald-600 font-semibold">Denda Keterlambatan</span>
                <span className="font-extrabold text-emerald-700">Rp 0 (Tepat Waktu ✓)</span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-slate-200 pt-2">
              <span className="text-xs font-extrabold text-slate-800">TOTAL AKHIR</span>
              <span className="text-md font-extrabold text-slate-800">{formatRupiah(booking.grandTotal)}</span>
            </div>
          </div>

          {/* Payment Status Badge */}
          <div className="text-center mb-3">
            {booking.paymentStatus === 'Lunas' ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                <i className="ph-fill ph-check-circle text-sm"></i> LUNAS
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                <i className="ph-fill ph-clock text-sm"></i> BELUM BAYAR
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-dashed border-slate-200 pt-3 text-center space-y-1">
            <p className="text-[8px] text-slate-400 font-medium leading-relaxed">
              {type === 'pemesanan' && 'Struk ini wajib ditunjukkan kepada petugas kami saat pengambilan kendaraan. Pembayaran dilakukan di tempat.'}
              {type === 'pembayaran' && 'Simpan struk ini sebagai bukti pembayaran yang sah. Harap kembalikan kendaraan tepat waktu.'}
              {type === 'pengembalian' && 'Transaksi sewa kendaraan telah diselesaikan. Terima kasih telah menggunakan layanan KGYK Rental.'}
            </p>
            <p className="text-[8px] text-slate-400 font-semibold">
              Keterlambatan pengembalian melewati jam {RETURN_DEADLINE_HOUR}:00 WIB pada tanggal akhir sewa<br/>
              dikenakan denda {LATE_FEE_PERCENT}% tarif harian per jam. Lebih dari {MAX_LATE_HOURS_BEFORE_FULL_DAY} jam = 1 hari penuh.
            </p>

            {/* Signature Area */}
            {(type === 'pembayaran' || type === 'pengembalian') && (
              <div className="grid grid-cols-2 gap-8 pt-6 pb-2 mt-2">
                <div className="text-center">
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Petugas Admin</p>
                  <div className="h-10 border-b border-slate-200 mt-6 mb-1"></div>
                  <p className="text-[8px] text-slate-500 font-semibold">( ........................ )</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Penyewa</p>
                  <div className="h-10 border-b border-slate-200 mt-6 mb-1"></div>
                  <p className="text-[8px] text-slate-500 font-semibold">( {booking.userName} )</p>
                </div>
              </div>
            )}

            <p className="text-[7px] text-slate-300 font-semibold pt-2">
              Dicetak pada: {new Date().toLocaleString('id-ID')} • KGYK Rental Mobil Yogyakarta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
