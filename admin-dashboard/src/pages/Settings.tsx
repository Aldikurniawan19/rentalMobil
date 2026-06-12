import React, { useState, useEffect } from 'react';

interface SettingsProps {
  adminUser: { username: string; email: string } | null;
  onProfileUpdate: (updatedUser: { username: string; email: string }) => void;
}

export default function Settings({ adminUser, onProfileUpdate }: SettingsProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      const adminUsers = JSON.parse(localStorage.getItem('kgyk_admin_users') || '[]');
      const active = adminUsers.find((u: any) => u.username === adminUser?.username);
      if (active) {
        setUsername(active.username);
        setEmail(active.email);
        setWhatsapp(active.whatsapp || '+6281234567890');
      }
    } catch (err) {
      console.error(err);
    }
  }, [adminUser]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!username || !email || !whatsapp) {
      setErrorMsg('Mohon lengkapi semua data profil.');
      return;
    }

    try {
      const adminUsers = JSON.parse(localStorage.getItem('kgyk_admin_users') || '[]');
      const updated = adminUsers.map((u: any) => {
        if (u.username === adminUser?.username) {
          return { ...u, username, email, whatsapp };
        }
        return u;
      });
      localStorage.setItem('kgyk_admin_users', JSON.stringify(updated));
      onProfileUpdate({ username, email });
      setSuccessMsg('Profil dan data kontak berhasil diperbarui!');
    } catch (err) {
      setErrorMsg('Gagal memperbarui profil.');
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!password || !newPassword || !confirmPassword) {
      setErrorMsg('Mohon lengkapi data kata sandi.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    try {
      const adminUsers = JSON.parse(localStorage.getItem('kgyk_admin_users') || '[]');
      const userIdx = adminUsers.findIndex((u: any) => u.username === adminUser?.username);
      
      if (userIdx === -1) {
        setErrorMsg('Pengguna admin aktif tidak ditemukan.');
        return;
      }

      if (adminUsers[userIdx].password !== password) {
        setErrorMsg('Kata sandi lama Anda salah.');
        return;
      }

      adminUsers[userIdx].password = newPassword;
      localStorage.setItem('kgyk_admin_users', JSON.stringify(adminUsers));
      setSuccessMsg('Kata sandi berhasil diperbarui!');
      
      // Reset form
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg('Gagal memperbarui kata sandi.');
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {/* Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700">
          <i className="ph-fill ph-check-circle text-xl flex-shrink-0"></i>
          <span className="text-xs font-bold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700">
          <i className="ph-fill ph-warning-circle text-xl flex-shrink-0"></i>
          <span className="text-xs font-bold">{errorMsg}</span>
        </div>
      )}

      {/* Grid forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Profil & Kontak Notifikasi</h4>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username Admin</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">No. WhatsApp Admin (Notifikasi)</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white font-mono text-slate-700"
                placeholder="+62..."
              />
              <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                Nomor ini digunakan sebagai tujuan redirect chat WhatsApp saat customer menekan tombol booking di landing page.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Simpan Profil & Kontak
            </button>
          </form>
        </div>

        {/* Change Password Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Ganti Kata Sandi</h4>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kata Sandi Lama</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-700"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-700"
                placeholder="Min. 6 karakter"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white text-slate-700"
                placeholder="Ulangi kata sandi baru"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Ubah Kata Sandi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
