import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminUser: { username: string; email: string } | null;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, adminUser, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: 'ph-fill ph-chart-pie-slice' },
    { id: 'cars', name: 'Armada Mobil', icon: 'ph-fill ph-car-profile' },
    { id: 'bookings', name: 'Kelola Pesanan', icon: 'ph-fill ph-calendar-check' },
    { id: 'content', name: 'Konten Landing', icon: 'ph-fill ph-article' },
    { id: 'settings', name: 'Pengaturan', icon: 'ph-fill ph-gear-six' }
  ];

  return (
    <aside className="w-68 bg-[#0b1329] text-white flex flex-col h-screen fixed left-0 top-0 z-30 shadow-2xl border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i className="ph-fill ph-steering-wheel text-xl text-white"></i>
        </div>
        <div>
          <h1 className="font-extrabold text-md tracking-wider uppercase text-blue-400">KGYK Rent</h1>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide">ADMIN PORTAL v1.0</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <i className={`${item.icon} text-lg transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}></i>
              <span>{item.name}</span>
              {item.id === 'bookings' && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                  Baru
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-[#070c1a]">
        <div className="flex items-center gap-3 p-2 rounded-xl mb-3">
          <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold text-white border border-slate-600">
            {adminUser?.username.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold truncate text-slate-200">{adminUser?.username || 'Administrator'}</h4>
            <p className="text-[10px] text-slate-400 truncate">{adminUser?.email || 'admin@kgyk.com'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/40 hover:bg-red-950/40 hover:text-red-300 border border-slate-800 hover:border-red-900/50 text-slate-300 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer"
        >
          <i className="ph-bold ph-sign-out"></i>
          <span>Keluar Aplikasi</span>
        </button>
      </div>
    </aside>
  );
}
