import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (adminUser: { username: string; email: string }) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate short loading delay for premium feel
    setTimeout(() => {
      try {
        const adminUsers = JSON.parse(localStorage.getItem('kgyk_admin_users') || '[]');
        const user = adminUsers.find(
          (u: any) => u.username === username.trim() && u.password === password
        );

        if (user) {
          onLoginSuccess({ username: user.username, email: user.email });
        } else {
          setError('Username atau password salah. Silakan coba lagi.');
        }
      } catch (err) {
        setError('Terjadi kesalahan sistem saat memproses login.');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#070c1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10 -translate-y-1/2 -translate-x-1/3"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 translate-y-1/2 translate-x-1/3"></div>

      <div className="w-full max-w-md bg-[#0b1329]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Branding header inside login card */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
            <i className="ph-fill ph-steering-wheel text-3xl text-white"></i>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">KGYK Rent Yogyakarta</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Log in ke Portal Dashboard Admin</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-2xl flex items-start gap-3 text-red-200 animate-shake">
            <i className="ph-bold ph-warning-circle text-lg mt-0.5 flex-shrink-0"></i>
            <span className="text-xs font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <i className="ph-bold ph-user-circle text-lg"></i>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 border border-slate-850 hover:border-slate-700 focus:border-blue-500 focus:outline-none text-white rounded-2xl text-sm transition-all focus:ring-4 focus:ring-blue-500/10 placeholder-slate-500 font-medium"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <i className="ph-bold ph-key text-lg"></i>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 border border-slate-850 hover:border-slate-700 focus:border-blue-500 focus:outline-none text-white rounded-2xl text-sm transition-all focus:ring-4 focus:ring-blue-500/10 placeholder-slate-500 font-medium"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <i className="ph-bold ph-sign-in text-lg"></i>
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Tip Panel */}
        <div className="mt-8 pt-6 border-t border-slate-850 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-400">Demo Account Credentials:</span><br />
            Username: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-400 font-mono">admin</code> &nbsp;&bull;&nbsp;
            Password: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-400 font-mono">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
