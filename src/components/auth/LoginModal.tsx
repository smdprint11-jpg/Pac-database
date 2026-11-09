import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ShieldCheck, UserCheck, School, Building2, Lock, ArrowRight, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, quickLogin, users } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim()) {
      setErrorMsg('Masukkan username atau email');
      return;
    }
    const ok = login(username, password);
    if (ok) {
      setUsername('');
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Username tidak terdaftar atau kredensial salah');
    }
  };

  const handleQuickLogin = (userId: string) => {
    quickLogin(userId);
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Login Pengurus & Operator"
      subtitle="Sistem Informasi & Database Terpadu PAC IPNU IPPNU DUKUN"
      maxWidth="md"
    >
      <div className="space-y-6">
        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-900 text-xs flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <div className="font-semibold text-emerald-950">Akses Multi-User Berjenjang (RBAC)</div>
            <p className="text-emerald-700 mt-0.5">
              Super Admin memiliki hak kelola penuh; User Ranting/PK mengelola data khusus unit masing-masing.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username atau Email Akun
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: admin atau pr_dukun"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password (Kata Sandi)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Default password akun demo: <code className="text-slate-600 font-mono">123456</code>
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            Masuk ke Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Atau Pilih Akun Demo Instan:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {users.slice(0, 4).map((u) => {
              let badgeColor = 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-950';
              let icon = <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />;

              if (u.role === 'user_ranting') {
                badgeColor = 'border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 text-teal-950';
                icon = <Building2 className="w-4 h-4 text-teal-600 shrink-0" />;
              } else if (u.role === 'user_pk') {
                badgeColor = 'border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-950';
                icon = <School className="w-4 h-4 text-blue-600 shrink-0" />;
              }

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2.5 cursor-pointer ${badgeColor}`}
                >
                  {icon}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{u.fullName}</div>
                    <div className="text-[11px] opacity-75 truncate capitalize">
                      {u.role.replace('_', ' ')} ({u.username})
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
