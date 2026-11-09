import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompletenessWeights } from '../../types';
import { getGradeBadgeColor, getActiveStatusBadge } from '../../utils/scoring';
import {
  Award,
  Sliders,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  School,
  TrendingUp,
  Info,
  Lock,
  ShieldAlert,
} from 'lucide-react';

export const ScoringConfigView: React.FC = () => {
  const { weights, updateWeights, units, recalculateAllUnitScores, showToast, currentUser } = useApp();

  const isPacAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_pac';

  const [formWeights, setFormWeights] = useState<CompletenessWeights>({ ...weights });

  const totalWeights =
    Number(formWeights.profile) +
    Number(formWeights.officers) +
    Number(formWeights.members) +
    Number(formWeights.sp) +
    Number(formWeights.activities) +
    Number(formWeights.documentation);

  const isValidTotal = totalWeights === 100;

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPacAdmin) {
      showToast('Akses ditolak: Pengaturan bobot indikator hanya dapat diubah oleh Admin PAC', 'error');
      return;
    }
    if (!isValidTotal) {
      showToast(`Total bobot saat ini ${totalWeights}%, harus tepat 100%!`, 'error');
      return;
    }
    updateWeights({
      profile: Number(formWeights.profile),
      officers: Number(formWeights.officers),
      members: Number(formWeights.members),
      sp: Number(formWeights.sp),
      activities: Number(formWeights.activities),
      documentation: Number(formWeights.documentation),
    });
  };

  const handleResetDefault = () => {
    if (!isPacAdmin) return;
    setFormWeights({
      profile: 10,
      officers: 20,
      members: 25,
      sp: 20,
      activities: 15,
      documentation: 10,
    });
  };

  // Sorted league table
  const sortedUnits = [...units].sort((a, b) => b.completenessScore - a.completenessScore);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Sistem Penilaian Persentase Kelengkapan Organisasi
            </h2>
            {!isPacAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                <Lock className="w-3 h-3 text-amber-700" />
                <span>Hanya Baca (Khusus Admin PAC)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi pembobotan indikator dan klasifikasi ranking kelengkapan administrasi pangkalan
          </p>
        </div>

        {isPacAdmin && (
          <button
            onClick={() => {
              recalculateAllUnitScores();
              showToast('Seluruh skor kelengkapan unit berhasil disinkronkan', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sinkronkan & Hitung Ulang Semua Unit</span>
          </button>
        )}
      </div>

      {/* Role Notice for Branch Users */}
      {!isPacAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-amber-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm">Mode Tinjau Acuan Bobot Indikator</div>
            <p className="text-amber-800 leading-relaxed">
              Akun ranting/PK hanya dapat melihat acuan bobot kelengkapan administrasi yang berlaku.
              <strong> Pengaturan bobot ini dikunci dan hanya dapat diedit serta disimpan oleh Admin PAC IPNU IPPNU Dukun.</strong>
            </p>
          </div>
        </div>
      )}

      {/* Important Principle Banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3.5 text-emerald-950 text-xs">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm">Prinsip Penting Tata Kelola Organisasi:</div>
          <p className="text-emerald-900/90 leading-relaxed">
            <strong>Persentase Kelengkapan Database TIDAK SAMA dengan Status Keaktifan.</strong> Ranting yang sangat aktif berkegiatan bisa jadi memiliki persentase database yang belum lengkap jika berkas belum diunggah. Begitu pula ranting dengan database lengkap tetap dipantau dinamika kegiatannya secara langsung di lapangan.
          </p>
        </div>
      </div>

      {/* Main Grid: Weight Config & Standards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Weight Sliders Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">
                Bobot 6 Indikator Penilaian
              </h3>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isValidTotal
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-700 animate-pulse'
              }`}
            >
              Total: {totalWeights}%
            </div>
          </div>

          <form onSubmit={handleSaveWeights} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>1. Profil Organisasi (Ketua & Alamat)</span>
                <span className="font-mono text-emerald-700">{formWeights.profile}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                disabled={!isPacAdmin}
                value={formWeights.profile}
                onChange={(e) => setFormWeights({ ...formWeights, profile: Number(e.target.value) })}
                className={`w-full accent-emerald-600 ${isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>2. Data Pengurus Ranting/PK</span>
                <span className="font-mono text-emerald-700">{formWeights.officers}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                disabled={!isPacAdmin}
                value={formWeights.officers}
                onChange={(e) => setFormWeights({ ...formWeights, officers: Number(e.target.value) })}
                className={`w-full accent-emerald-600 ${isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>3. Database Anggota (Kader)</span>
                <span className="font-mono text-emerald-700">{formWeights.members}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                disabled={!isPacAdmin}
                value={formWeights.members}
                onChange={(e) => setFormWeights({ ...formWeights, members: Number(e.target.value) })}
                className={`w-full accent-emerald-600 ${isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>4. Dokumen SP IPNU & IPPNU</span>
                <span className="font-mono text-emerald-700">{formWeights.sp}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                disabled={!isPacAdmin}
                value={formWeights.sp}
                onChange={(e) => setFormWeights({ ...formWeights, sp: Number(e.target.value) })}
                className={`w-full accent-emerald-600 ${isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>5. Laporan Agenda & Kegiatan</span>
                <span className="font-mono text-emerald-700">{formWeights.activities}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                disabled={!isPacAdmin}
                value={formWeights.activities}
                onChange={(e) => setFormWeights({ ...formWeights, activities: Number(e.target.value) })}
                className={`w-full accent-emerald-600 ${isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700">
                <span>6. Dokumentasi Foto Kegiatan</span>
                <span className="font-mono text-emerald-700">{formWeights.documentation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                disabled={!isPacAdmin}
                value={formWeights.documentation}
                onChange={(e) =>
                  setFormWeights({ ...formWeights, documentation: Number(e.target.value) })
                }
                className={`w-full accent-emerald-600 ${isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              />
            </div>

            {isPacAdmin ? (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Reset Standar (10-20-25-20-15-10)
                </button>

                <button
                  type="submit"
                  disabled={!isValidTotal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50 transition cursor-pointer shadow-xs"
                >
                  Simpan Perubahan Bobot
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 text-center text-slate-400 italic">
                Tombol simpan hanya tersedia untuk akun Admin PAC.
              </div>
            )}
          </form>
        </div>

        {/* Right: Grade Scales & Standards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Klasifikasi & Kategori Kelengkapan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50">
                <div className="font-bold text-emerald-900 flex justify-between">
                  <span>Sangat Baik</span>
                  <span>85% - 100%</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Seluruh berkas, kepengurusan sah, database anggota, dan kegiatan rutin terpenuhi lengkap.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50">
                <div className="font-bold text-blue-900 flex justify-between">
                  <span>Baik</span>
                  <span>70% - 84%</span>
                </div>
                <p className="text-[11px] text-blue-700 mt-1">
                  Administrasi umum terpenuhi, memerlukan pelengkapan pada dokumentasi atau arsip anggota.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50">
                <div className="font-bold text-amber-900 flex justify-between">
                  <span>Cukup</span>
                  <span>50% - 69%</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  Data dasar tercatat namun SP perlu diperpanjang atau laporan kegiatan belum diunggah.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-red-200 bg-red-50">
                <div className="font-bold text-red-900 flex justify-between">
                  <span>Perlu Pembinaan</span>
                  <span>1% - 49%</span>
                </div>
                <p className="text-[11px] text-red-700 mt-1">
                  Pangkalan membutuhkan pendampingan khusus dari Departemen Organisasi PAC.
                </p>
              </div>
            </div>
          </div>

          {/* Ranking Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Peringkat Kelengkapan Ranting & PK (Top 10)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Total {units.length} Pangkalan</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-4 w-12 text-center">Rank</th>
                    <th className="py-2.5 px-4">Nama Pangkalan</th>
                    <th className="py-2.5 px-4">Tipe</th>
                    <th className="py-2.5 px-4 text-center">Skor</th>
                    <th className="py-2.5 px-4">Kategori</th>
                    <th className="py-2.5 px-4">Status Organisasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedUnits.slice(0, 10).map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 px-4 text-center font-bold text-slate-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">
                        {u.name}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {u.type === 'RANTING' ? 'Ranting' : 'Komisariat'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono font-extrabold text-emerald-700">
                        {u.completenessScore}%
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getGradeBadgeColor(
                            u.completenessGrade
                          )}`}
                        >
                          {u.completenessGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getActiveStatusBadge(
                            u.activeStatus
                          )}`}
                        >
                          {u.activeStatus === 'AKTIF'
                            ? 'Aktif'
                            : u.activeStatus === 'PERLU_PERHATIAN'
                            ? 'Perhatian'
                            : 'Tidak Aktif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
