import React from 'react';

interface HeaderProps {
  activeTab: string;
}

export default function Header({ activeTab }: HeaderProps) {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'overview':
        return { title: 'Dashboard Overview', desc: 'Ringkasan performa bisnis dan pesanan terbaru rental mobil Anda.' };
      case 'cars':
        return { title: 'Kelola Armada Mobil', desc: 'Tambah, edit, dan atur ketersediaan armada mobil rental Anda.' };
      case 'bookings':
        return { title: 'Kelola Pesanan (Booking)', desc: 'Konfirmasi, tolak, atau tandai selesai pesanan dari customer.' };
      case 'content':
        return { title: 'Konten Landing Page', desc: 'Sesuaikan teks headline, banner promo, FAQ, dan review testimoni.' };
      case 'settings':
        return { title: 'Pengaturan Sistem', desc: 'Atur kredensial login admin dan nomor kontak WhatsApp tujuan.' };
      default:
        return { title: 'Admin Panel', desc: 'Selamat datang kembali di panel kontrol admin.' };
    }
  };

  const info = getTabTitle(activeTab);

  // Format Current Date (Bahasa Indonesia)
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('id-ID', options);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div>
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{info.title}</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{info.desc}</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
          <i className="ph ph-calendar text-slate-500 text-md"></i>
          <span className="text-xs font-bold text-slate-600">{getFormattedDate()}</span>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
            Simulasi Database Aktif
          </span>
        </div>
      </div>
    </header>
  );
}
