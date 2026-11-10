import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompletenessWeights, OrganizationType } from '../../types';
import { getGradeBadgeColor, getActiveStatusBadge } from '../../utils/scoring';
import { Modal } from '../common/Modal';
import {
  Award,
  Sliders,
  RefreshCw,
  Info,
  Lock,
  ShieldAlert,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface ScoringConfigViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export const ScoringConfigView: React.FC<ScoringConfigViewProps> = ({ onNavigateTab }) => {
  const {
    weights,
    updateWeights,
    units,
    spDocuments,
    addSpDocument,
    recalculateAllUnitScores,
    showToast,
    currentUser,
  } = useApp();

  const isPacAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_pac';
  const isBranchUser = currentUser?.role === 'user_ranting' || currentUser?.role === 'user_pk';
  const targetUnitId = currentUser?.targetUnitId;

  const [formWeights, setFormWeights] = useState<CompletenessWeights>({ ...weights });
  const [isQuickSpModalOpen, setIsQuickSpModalOpen] = useState(false);
  const [spUploadForm, setSpUploadForm] = useState({
    spNumber: `SP/${Math.floor(100 + Math.random() * 900)}/PC-IPNU/2026`,
    unitId: isBranchUser && targetUnitId ? targetUnitId : units[0]?.id || '',
    organization: 'IPNU' as OrganizationType,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '2028-12-31',
    leaderName: '',
    secretaryName: '',
    fileName: 'SK_SP_TERBARU.pdf',
    fileSize: '1.2 MB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const reader = new FileReader();
    reader.onload = () => {
      setSpUploadForm((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: sizeInMb,
        fileUrl: typeof reader.result === 'string' ? reader.result : prev.fileUrl,
      }));
      showToast(`Berkas ${file.name} siap diunggah`, 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleQuickSpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUnit = units.find((u) => u.id === spUploadForm.unitId) || units[0];
    if (!assignedUnit) return;

    addSpDocument({
      spNumber: spUploadForm.spNumber,
      unitId: assignedUnit.id,
      unitName: assignedUnit.name,
      unitType: assignedUnit.type,
      organization: spUploadForm.organization,
      validFrom: spUploadForm.validFrom,
      validUntil: spUploadForm.validUntil,
      legalizationDate: spUploadForm.validFrom,
      leaderName: spUploadForm.leaderName || assignedUnit.leaderIpnu,
      secretaryName: spUploadForm.secretaryName,
      fileUrl: spUploadForm.fileUrl,
      fileName: spUploadForm.fileName,
      fileSize: spUploadForm.fileSize,
      status: isPacAdmin ? 'AKTIF' : 'MENUNGGU_VERIFIKASI',
    });
    recalculateAllUnitScores();
    setIsQuickSpModalOpen(false);
  };

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

  const sortedUnits = [...units].sort((a, b) => b.completenessScore - a.completenessScore);
  const activeSpCount = spDocuments.filter((d) => d.status === 'AKTIF').length;
  const pendingSpCount = spDocuments.filter((d) => d.status === 'MENUNGGU_VERIFIKASI').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Statistik Penilaian & Database Upload SP
            </h2>
            {!isPacAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                <Lock className="w-3 h-3 text-amber-700" />
                <span>Hanya Baca (Khusus Admin PAC)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi bobot indikator kelengkapan administrasi, rekapitulasi SP, dan peringkat pangkalan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQuickSpModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Dokumen SP</span>
          </button>

          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('sp')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Buka Database SP</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isPacAdmin && (
            <button
              onClick={() => {
                recalculateAllUnitScores();
                showToast('Seluruh skor kelengkapan unit berhasil disinkronkan', 'success');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Hitung Ulang Skor</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick SP Database & Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Arsip Database SP</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{spDocuments.length} Berkas</div>
            <span className="text-[11px] text-emerald-700 font-semibold">Bobot Indikator SP: {weights.sp}%</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">SP Sah & Aktif</span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{activeSpCount} Pangkalan</div>
            <span className="text-[11px] text-slate-500">Terverifikasi Admin PAC</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">SP Menunggu Verifikasi</span>
            <div className="text-2xl font-black text-amber-600 mt-0.5">{pendingSpCount} Pengajuan</div>
            <button
              type="button"
              onClick={() => (onNavigateTab ? onNavigateTab('sp') : setIsQuickSpModalOpen(true))}
              className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
            >
              <span>Kelola & Upload SP →</span>
            </button>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Role Notice for Branch Users */}
      {!isPacAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-amber-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm">Mode Tinjau Acuan Bobot Indikator</div>
            <p className="text-amber-800 leading-relaxed">
              Akun ranting/PK dapat mengunggah dokumen SP di atas dan melihat acuan bobot kelengkapan administrasi.
              <strong> Pengaturan persentase bobot dikunci khusus Admin PAC IPNU IPPNU Dukun.</strong>
            </p>
          </div>
        </div>
      )}

      {/* Important Principle Banner */}
      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-950 text-xs">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Prinsip Tata Kelola: </span>
          <span className="text-emerald-900/90">
            Persentase Kelengkapan Database dihitung otomatis dari 6 indikator (termasuk Upload SP). Unggah berkas SP terbaru agar skor pangkalan meningkat.
          </span>
        </div>
      </div>

      {/* Main Grid: Weight Config & Standards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Weight Sliders Form */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">Bobot 6 Indikator Penilaian</h3>
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

          <form onSubmit={handleSaveWeights} className="space-y-3.5 text-xs">
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
                className={`w-full accent-emerald-600 ${
                  isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
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
                className={`w-full accent-emerald-600 ${
                  isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
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
                className={`w-full accent-emerald-600 ${
                  isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
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
                className={`w-full accent-emerald-600 ${
                  isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
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
                onChange={(e) =>
                  setFormWeights({ ...formWeights, activities: Number(e.target.value) })
                }
                className={`w-full accent-emerald-600 ${
                  isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
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
                className={`w-full accent-emerald-600 ${
                  isPacAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              />
            </div>

            {isPacAdmin ? (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Reset Standar
                </button>

                <button
                  type="submit"
                  disabled={!isValidTotal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50 transition cursor-pointer shadow-xs"
                >
                  Simpan Bobot
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 text-center text-slate-400 italic">
                Tombol simpan hanya tersedia untuk akun Admin PAC.
              </div>
            )}
          </form>
        </div>

        {/* Right: Grade Scales & Ranking Table */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Klasifikasi & Kategori Kelengkapan</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50">
                <div className="font-bold text-emerald-900">Sangat Baik</div>
                <div className="text-[11px] font-mono text-emerald-700 font-bold">85% - 100%</div>
              </div>
              <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50">
                <div className="font-bold text-blue-900">Baik</div>
                <div className="text-[11px] font-mono text-blue-700 font-bold">70% - 84%</div>
              </div>
              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50">
                <div className="font-bold text-amber-900">Cukup</div>
                <div className="text-[11px] font-mono text-amber-700 font-bold">50% - 69%</div>
              </div>
              <div className="p-2.5 rounded-xl border border-red-200 bg-red-50">
                <div className="font-bold text-red-900">Pembinaan</div>
                <div className="text-[11px] font-mono text-red-700 font-bold">1% - 49%</div>
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
                    <th className="py-2.5 px-3 w-10 text-center">Rank</th>
                    <th className="py-2.5 px-3">Nama Pangkalan</th>
                    <th className="py-2.5 px-3">Status SP</th>
                    <th className="py-2.5 px-3 text-center">Skor</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Keaktifan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedUnits.slice(0, 10).map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{u.name}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.spIpnuStatus === 'AKTIF' || u.spIppnuStatus === 'AKTIF'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {u.spIpnuStatus === 'AKTIF' ? 'SP Aktif' : 'Perlu Upload'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-extrabold text-emerald-700">
                        {u.completenessScore}%
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getGradeBadgeColor(
                            u.completenessGrade
                          )}`}
                        >
                          {u.completenessGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
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

      {/* Quick SP Upload Modal right inside Statistik View */}
      <Modal
        isOpen={isQuickSpModalOpen}
        onClose={() => setIsQuickSpModalOpen(false)}
        title="Upload Cepat Dokumen Surat Pengesahan (SP)"
        subtitle="Unggah berkas PDF/Scan SP untuk meningkatkan skor kelengkapan pangkalan"
        maxWidth="lg"
      >
        <form onSubmit={handleQuickSpSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pangkalan Ranting / PK *
              </label>
              <select
                disabled={isBranchUser}
                value={spUploadForm.unitId}
                onChange={(e) => setSpUploadForm({ ...spUploadForm, unitId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organisasi *
              </label>
              <select
                value={spUploadForm.organization}
                onChange={(e) =>
                  setSpUploadForm({ ...spUploadForm, organization: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor SP *
              </label>
              <input
                type="text"
                required
                value={spUploadForm.spNumber}
                onChange={(e) => setSpUploadForm({ ...spUploadForm, spNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Masa Berlaku Hingga *
              </label>
              <input
                type="date"
                required
                value={spUploadForm.validUntil}
                onChange={(e) => setSpUploadForm({ ...spUploadForm, validUntil: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Ketua *
              </label>
              <input
                type="text"
                required
                value={spUploadForm.leaderName}
                onChange={(e) => setSpUploadForm({ ...spUploadForm, leaderName: e.target.value })}
                placeholder="Nama Ketua Terpilih"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Sekretaris
              </label>
              <input
                type="text"
                value={spUploadForm.secretaryName}
                onChange={(e) =>
                  setSpUploadForm({ ...spUploadForm, secretaryName: e.target.value })
                }
                placeholder="Nama Sekretaris"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih File Berkas SP (PDF / Gambar Scan) *
            </label>
            <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 p-4 rounded-2xl text-center bg-emerald-50/40 cursor-pointer transition block">
              <Upload className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-800">{spUploadForm.fileName}</div>
              <span className="text-[11px] text-slate-500 block">
                Klik untuk memilih file PDF atau Foto Scan SP dari perangkat ({spUploadForm.fileSize})
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsQuickSpModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
            >
              Upload & Simpan SP
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
