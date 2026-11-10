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
  School,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, users, units, settings } = useApp();
  const [loginType, setLoginType] = useState<'PAC' | 'BRANCH'>('PAC');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const appLogo = settings.navbarLogoUrl || settings.logoUrl;

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    setErrorMsg('');
    if (!unitId) {
      setUsername('');
      return;
    }
    // Find the user associated with this unit
    const matchedUser = users.find((u) => u.targetUnitId === unitId);
    if (matchedUser) {
      setUsername(matchedUser.username);
    } else {
      // Fallback: derive from unit name
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

    const ok = login(username.trim(), password);
    if (ok) {
      setUsername('');
      setPassword('');
      setSelectedUnitId('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Kredensial tidak valid. Periksa kembali username dan kata sandi Anda.');
    }
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
      <div className="space-y-5">
        {/* Logo and Brand Header */}
        <div className="flex items-center justify-center gap-3 pb-1 border-b border-slate-100">
          {appLogo ? (
            <img
              src={appLogo}
              alt="Logo Organisasi"
              className="w-12 h-12 object-contain rounded-xl shadow-xs"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white font-bold text-lg shadow-xs font-serif">
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

        {/* Tab Selector: PAC vs Ranting/PK */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setLoginType('PAC');
              setErrorMsg('');
              setUsername('');
              setPassword('');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              loginType === 'PAC'
                ? 'bg-emerald-600 text-white shadow-xs'
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
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              loginType === 'BRANCH'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Ranting / PK</span>
          </button>
        </div>

        {/* Description Banner */}
        <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-emerald-950 text-xs">
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
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium animate-in fade-in duration-150">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Unit selector for Ranting / PK */}
          {loginType === 'BRANCH' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilih Pangkalan Ranting / PK *
              </label>
              <div className="relative">
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
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {loginType === 'PAC' ? 'Username / Email Admin PAC *' : 'Username Akun Ranting / PK *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={loginType === 'PAC' ? 'Contoh: admin atau superadmin' : 'Contoh: pr_dukun atau pk_maarif'}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi (Password) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Masuk ke Dashboard {loginType === 'PAC' ? 'Admin PAC' : 'Ranting / PK'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Modal>
  );
};
