import React from 'react';
import { useApp } from '../../context/AppContext';
import { getGradeBadgeColor, getActiveStatusBadge, evaluateUnitIndicators } from '../../utils/scoring';
import {
  Building2,
  School,
  Users,
  UserCheck,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Upload,
  UserPlus,
} from 'lucide-react';

interface BranchOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const BranchOverview: React.FC<BranchOverviewProps> = ({ onNavigateTab }) => {
  const { currentUser, units, members, officers, spDocuments, activities, weights } = useApp();

  // Find the unit managed by this user
  const unit = units.find((u) => u.id === currentUser?.targetUnitId) || units[0];

  const unitMembers = members.filter((m) => m.unitId === unit.id);
  const unitOfficers = officers.filter((o) => o.unitId === unit.id);
  const unitSps = spDocuments.filter((s) => s.unitId === unit.id);
  const unitActs = activities.filter((a) => a.unitId === unit.id);

  const indicators = evaluateUnitIndicators({
    leaderIpnu: unit.leaderIpnu,
    leaderIppnu: unit.leaderIppnu,
    address: unit.address,
    officersCount: unitOfficers.length,
    membersCount: unitMembers.length,
    spIpnuStatus: unit.spIpnuStatus,
    spIppnuStatus: unit.spIppnuStatus,
    activitiesCount: unitActs.length,
    hasDocumentation: unitActs.some((a) => a.photos && a.photos.length > 0),
  });

  const gradeStyle = getGradeBadgeColor(unit.completenessGrade);
  const statusStyle = getActiveStatusBadge(unit.activeStatus);

  const checklistItems = [
    {
      title: 'Profil Organisasi',
      weight: weights.profile,
      isComplete: indicators.profile,
      desc: 'Nama ketua IPNU/IPPNU, kontak, dan alamat sekretariat',
    },
    {
      title: 'Data Pengurus Ranting/PK',
      weight: weights.officers,
      isComplete: indicators.officers,
      desc: `Minimal 3 pengurus terdaftar (Saat ini: ${unitOfficers.length})`,
    },
    {
      title: 'Database Anggota Kader',
      weight: weights.members,
      isComplete: indicators.members,
      desc: `Minimal 5 anggota terdaftar (Saat ini: ${unitMembers.length})`,
    },
    {
      title: 'Surat Pengesahan (SP) Sah',
      weight: weights.sp,
      isComplete: indicators.sp,
      desc: `Status SP IPNU/IPPNU sah dan aktif (Status: ${unit.spIpnuStatus})`,
    },
    {
      title: 'Laporan Agenda & Kegiatan',
      weight: weights.activities,
      isComplete: indicators.activities,
      desc: `Minimal 1 kegiatan terinput (Saat ini: ${unitActs.length})`,
    },
    {
      title: 'Dokumentasi Foto Kegiatan',
      weight: weights.documentation,
      isComplete: indicators.documentation,
      desc: 'Foto kegiatan diunggah dan terverifikasi',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
            {unit.type === 'RANTING' ? <Building2 className="w-3.5 h-3.5" /> : <School className="w-3.5 h-3.5" />}
            <span>{unit.type} • Wilayah {unit.villageOrSchool}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Selamat Datang di Portal {unit.name}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Kelola data kader santri, ajukan perpanjangan SP pengurus, dan laporkan kegiatan pimpinan ranting/komisariat secara mandiri dan terintegrasi dengan PAC Dukun.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('members')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Input Anggota Baru</span>
            </button>

            <button
              onClick={() => onNavigateTab('sp')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition"
            >
              <Upload className="w-4 h-4 text-emerald-300" />
              <span>Unggah Dokumen SP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Score Meter & Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Score Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Indeks Kelengkapan Database Anda
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                {unit.completenessScore}%
              </span>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}
              >
                {unit.completenessGrade}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${gradeStyle.barColor}`}
                style={{ width: `${unit.completenessScore}%` }}
              />
            </div>
          </div>

          {/* Active status note */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Status Keaktifan:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`} />
                {statusStyle.label}
              </span>
            </div>
            {unit.statusNotes && (
              <p className="text-xs text-slate-600 pt-2 border-t border-slate-200 leading-relaxed">
                <strong>Catatan PAC:</strong> {unit.statusNotes}
              </p>
            )}
          </div>

          {/* Quick counts */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[11px] font-semibold text-emerald-800 block">Anggota</span>
              <strong className="text-lg font-bold text-emerald-950">{unitMembers.length}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100">
              <span className="text-[11px] font-semibold text-teal-800 block">Pengurus</span>
              <strong className="text-lg font-bold text-teal-950">{unitOfficers.length}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
              <span className="text-[11px] font-semibold text-blue-800 block">Kegiatan</span>
              <strong className="text-lg font-bold text-blue-950">{unitActs.length}</strong>
            </div>
          </div>
        </div>

        {/* Right: 6-Indicator Checklist */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Checklist Indikator Standar Administrasi
              </h3>
              <p className="text-xs text-slate-500">
                Penuhi seluruh indikator berikut agar persentase ranting Anda mencapai 100%
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Total Bobot: 100%
            </span>
          </div>

          <div className="space-y-3">
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition flex items-start gap-3.5 ${
                  item.isComplete
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                    item.isComplete
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="text-[11px] font-semibold text-slate-500 font-mono">
                      Bobot: {item.weight}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 uppercase ${
                    item.isComplete
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.isComplete ? 'Terpenuhi' : 'Belum'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
