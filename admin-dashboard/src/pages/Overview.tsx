import React, { useState, useEffect } from 'react';
import { getBookings, getCars, saveBookings, formatRupiah } from '../utils/localStorageHelper';
import { Booking, Car } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface OverviewProps {
  onNavigate: (tab: string) => void;
}

export default function Overview({ onNavigate }: OverviewProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    setBookings(getBookings());
    setCars(getCars());
  }, []);

  // formatRupiah imported from localStorageHelper

  // Compute stats
  const totalRevenue = bookings
    .filter(b => b.status === 'Selesai' || b.status === 'Disetujui')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const activeRentals = bookings.filter(b => b.status === 'Disetujui' || b.status === 'Dalam Penyewaan').length;
  const pendingRequests = bookings.filter(b => b.status === 'Menunggu Verifikasi').length;
  const totalCars = cars.length;
  const totalLateFees = bookings.reduce((sum, b) => sum + (b.lateFee || 0), 0);

  // Handler for booking quick action (Approve/Reject)
  const handleBookingAction = (id: number, newStatus: 'Disetujui' | 'Ditolak') => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBookings(updated);
    saveBookings(updated);
  };

  // Line Chart Data: Monthly Booking Trends
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        fill: true,
        label: 'Pemesanan Selesai & Disetujui (Rp)',
        data: [1500000, 2400000, 1800000, 3100000, 4200000, totalRevenue, 0, 0, 0, 0, 0, 0],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(241, 245, 249, 1)' },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 10 },
          callback: function (value: any) {
            return value >= 1000000 ? (value / 1000000) + ' Jt' : value;
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } }
      }
    }
  };

  // Doughnut Chart Data: Car Category Popularity
  const categoryCounts = bookings.reduce((acc: Record<string, number>, b) => {
    const car = cars.find(c => c.id === b.carId);
    const cat = car?.category || 'mpv';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const doughnutChartData = {
    labels: ['City Car', 'MPV', 'SUV', 'Van'],
    datasets: [
      {
        data: [
          categoryCounts['city car'] || 1,
          categoryCounts['mpv'] || 2,
          categoryCounts['suv'] || 1,
          categoryCounts['van'] || 0
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
        borderWidth: 2,
        borderColor: '#ffffff',
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' as const },
          padding: 15
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{formatRupiah(totalRevenue)}</h3>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
              <i className="ph ph-arrow-up-right inline mr-0.5"></i> +12% vs bln lalu
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
            <i className="ph-fill ph-wallet"></i>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sewa Aktif</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{activeRentals} Mobil</h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-2 inline-block">
              Sedang dikendarai
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
            <i className="ph-fill ph-car"></i>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menunggu Verifikasi</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{pendingRequests} Pesanan</h3>
            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-2 inline-block">
              Butuh tindakan segera
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl">
            <i className="ph-fill ph-bell-ringing"></i>
          </div>
        </div>

        {/* Total Cars */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Armada</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">{totalCars} Tipe Mobil</h3>
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-2 inline-block">
              {totalLateFees > 0 ? `Denda: ${formatRupiah(totalLateFees)}` : 'Terdaftar di katalog'}
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
            <i className="ph-fill ph-garage"></i>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Statistik Penjualan Harian</h4>
              <p className="text-[11px] text-slate-400 font-medium">Tren grafik pendapatan bulanan tahun ini</p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
              2026
            </span>
          </div>
          <div className="h-64 relative">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-800">Popularitas Kategori Mobil</h4>
            <p className="text-[11px] text-slate-400 font-medium">Persentase pesanan berdasarkan tipe mobil</p>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Pesanan Masuk Terbaru</h4>
            <p className="text-[11px] text-slate-400 font-medium">Daftar booking yang butuh konfirmasi admin</p>
          </div>
          <button
            onClick={() => onNavigate('bookings')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            Lihat Semua Pesanan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider pl-6">ID & Pelanggan</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kendaraan</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Sewa</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Biaya</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right pr-6">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.filter(b => b.status === 'Menunggu Verifikasi').slice(0, 4).length === 0 ? (
                bookings.slice(0, 4).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-700 text-sm">{b.userName}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{b.userEmail}</div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm font-semibold">{b.carName}</td>
                    <td className="p-4 text-slate-500 text-xs font-medium">
                      {b.startDate} s/d {b.endDate} <span className="font-bold text-slate-400">({b.duration} Hari)</span>
                    </td>
                    <td className="p-4 text-slate-800 text-sm font-bold">{formatRupiah(b.totalPrice)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        b.status === 'Selesai' ? 'bg-slate-100 text-slate-700' :
                        b.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        b.status === 'Dalam Penyewaan' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        b.status === 'Ditolak' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          b.status === 'Selesai' ? 'bg-slate-500' :
                          b.status === 'Disetujui' ? 'bg-emerald-500' :
                          b.status === 'Dalam Penyewaan' ? 'bg-blue-500' :
                          b.status === 'Ditolak' ? 'bg-rose-500' :
                          'bg-amber-500'
                        }`}></span>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 text-slate-400 text-xs font-bold">
                      Sudah Diproses
                    </td>
                  </tr>
                ))
              ) : (
                bookings.filter(b => b.status === 'Menunggu Verifikasi').slice(0, 4).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-700 text-sm">{b.userName}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{b.userEmail}</div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm font-semibold">{b.carName}</td>
                    <td className="p-4 text-slate-500 text-xs font-medium">
                      {b.startDate} s/d {b.endDate} <span className="font-bold text-slate-400">({b.duration} Hari)</span>
                    </td>
                    <td className="p-4 text-slate-800 text-sm font-bold">{formatRupiah(b.totalPrice)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-lg text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Menunggu Verifikasi
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleBookingAction(b.id, 'Disetujui')}
                          className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/10"
                          title="Setujui Booking"
                        >
                          <i className="ph ph-check text-md font-bold"></i>
                        </button>
                        <button
                          onClick={() => handleBookingAction(b.id, 'Ditolak')}
                          className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-rose-500/10"
                          title="Tolak Booking"
                        >
                          <i className="ph ph-x text-md font-bold"></i>
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
    </div>
  );
}
