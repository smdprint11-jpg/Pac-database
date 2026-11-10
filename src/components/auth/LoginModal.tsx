import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  User,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, loginWithGoogle, users, units, settings } = useApp();
  const [loginType, setLoginType] = useState<'PAC' | 'BRANCH'>('PAC');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const appLogo = settings.navbarLogoUrl || settings.logoUrl;

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);
    const ok = await loginWithGoogle();
    setIsGoogleLoading(false);
    if (ok) {
      onClose();
      onSuccess();
    }
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setErrorMsg('');
    if (!unitId) {
      setUsername('');
      return;
    }
    const matchedUser = users.find((u) => u.targetUnitId === unitId);
    if (matchedUser) {
      setUsername(matchedUser.username);
    } else {
      const unit = units.find((u) => u.id === unitId);
      if (unit) {
        const fallbackName = unit.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        setUsername(fallbackName);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim()) {
      setErrorMsg(
        loginType === 'PAC'
          ? 'Masukkan username Admin PAC'
          : 'Pilih pangkalan atau masukkan username Ranting/PK'
      );
      return;
    }
    if (!password) {
      setErrorMsg('Masukkan kata sandi (password)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ok = login(username.trim(), password);
      setIsSubmitting(false);
      if (ok) {
        setUsername('');
        setPassword('');
        setSelectedUnitId('');
        onClose();
        onSuccess();
      } else {
        setErrorMsg('Kredensial tidak valid. Periksa kembali username dan kata sandi Anda.');
      }
    }, 320);
  };

  const rantingUnits = units.filter((u) => u.type === 'RANTING');
  const pkUnits = units.filter((u) => u.type === 'KOMISARIAT');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Login Pengurus & Operator"
      subtitle="Sistem Informasi & Database Terpadu PAC IPNU IPPNU DUKUN"
      maxWidth="md"
    >
      <div className="space-y-4 transition-all duration-300">
        {/* Logo and Brand Header */}
        <div className="flex items-center justify-center gap-3 pb-2 border-b border-slate-100">
          {appLogo ? (
            <img
              src={appLogo}
              alt="Logo Organisasi"
              className="w-11 h-11 object-contain rounded-xl shadow-xs transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white font-bold text-base shadow-xs font-serif">
              NU
            </div>
          )}
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight leading-tight">
              {settings.siteTitle || 'PELAJAR NU DUKUN'}
            </h3>
            <p className="text-[11px] font-semibold text-emerald-700 uppercase">
              {settings.organization || 'PAC IPNU IPPNU DUKUN'}
            </p>
          </div>
        </div>

        {/* Smooth Tab Selector: PAC vs Ranting/PK */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setLoginType('PAC');
              setErrorMsg('');
              setUsername('');
              setPassword('');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              loginType === 'PAC'
                ? 'bg-emerald-600 text-white shadow-sm scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin PAC Utama</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('BRANCH');
              setErrorMsg('');
              setUsername('');
              setPassword('');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              loginType === 'BRANCH'
                ? 'bg-emerald-600 text-white shadow-sm scale-[1.01]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Ranting / PK</span>
          </button>
        </div>

        {/* Description Banner */}
        <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-emerald-950 text-xs transition-all duration-200">
          {loginType === 'PAC' ? (
            <p className="text-[11px] leading-relaxed">
              <strong>Akses Pimpinan PAC:</strong> Kelola data terpadu se-Kecamatan, bobot indikator, pengesahan SP, CMS website, dan manajemen pengguna.
            </p>
          ) : (
            <p className="text-[11px] leading-relaxed">
              <strong>Akses Pangkalan Basis:</strong> Pilih pangkalan Ranting Desa (PR) atau Komisariat (PK) Anda untuk mengelola database khusus unit Anda.
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium animate-in fade-in duration-150">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Unit selector for Ranting / PK */}
          {loginType === 'BRANCH' && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Pangkalan Ranting / PK *
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => handleSelectUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                <option value="">-- Pilih Pangkalan Anda --</option>
                <optgroup label="Pimpinan Ranting (Desa)">
                  {rantingUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.villageOrSchool})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Pimpinan Komisariat (Sekolah / Madrasah)">
                  {pkUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.villageOrSchool})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {loginType === 'PAC' ? 'Username / Email Admin PAC *' : 'Username Akun Ranting / PK *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  loginType === 'PAC' ? 'Contoh: admin atau superadmin' : 'Contoh: pr_dukun atau pk_maarif'
                }
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi (Password) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Akses...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard {loginType === 'PAC' ? 'Admin PAC' : 'Ranting / PK'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="shrink mx-2 text-[10px] font-semibold text-slate-400 uppercase">Atau</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleLoading}
            className="w-full py-2 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <span>Masuk dengan Akun Google Resmi</span>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};
