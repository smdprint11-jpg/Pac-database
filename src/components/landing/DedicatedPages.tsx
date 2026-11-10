import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Target,
  CheckCircle2,
  MapPin,
  Calendar,
  Award,
  ShieldCheck,
  Users,
  Search,
  MessageCircle,
  Home,
  Phone,
  Mail,
  IdCard,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LeadershipSection } from './LeadershipSection';

interface DedicatedPageProps {
  onBackHome: () => void;
  onSwitchPage?: (page: 'home' | 'profil-pac' | 'pelindung-pembina') => void;
}

export const BreadcrumbBar: React.FC<{
  currentPageLabel: string;
  onBackHome: () => void;
}> = ({ currentPageLabel, onBackHome }) => {
  const { settings } = useApp();
  const bc = settings.breadcrumbConfig || {};
  const showBreadcrumb = bc.showBreadcrumb !== false;
  const homeLabel = bc.homeLabel || settings.navMenuLabels?.beranda || 'Menu Utama';
  const separator = bc.separator || '/';

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white pt-20 pb-6 sm:pt-24 sm:pb-8 border-b border-emerald-800/50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            {showBreadcrumb && (
              <nav className="flex items-center gap-2 text-xs font-medium text-emerald-300/90 mb-2">
                <button
                  type="button"
                  onClick={onBackHome}
                  className="inline-flex items-center gap-1 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{homeLabel}</span>
                </button>
                <span className="text-emerald-600">{separator}</span>
                <span className="text-emerald-200">{settings.navMenuLabels?.profil || 'Profil PAC'}</span>
                <span className="text-emerald-600">{separator}</span>
                <span className="text-amber-300 font-bold">{currentPageLabel}</span>
              </nav>
            )}
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentPageLabel}
            </h1>
          </div>

          <button
            type="button"
            onClick={onBackHome}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-emerald-600 text-white border border-white/20 hover:border-emerald-400 text-xs font-bold transition-all duration-300 shadow-sm hover:-translate-x-0.5 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke {settings.dashboardMenuLabels?.menuUtamaBtn || 'MENU UTAMA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfilPacDedicatedPage: React.FC<DedicatedPageProps> = ({
  onBackHome,
  onSwitchPage,
}) => {
  const { settings, officers } = useApp();
  const historicalLeaders = settings.historicalLeaders || [];
  const titles = settings.sectionTitles || {};
  const cleanPeriod = settings.period
    ? settings.period.toLowerCase().includes('masa khidmat')
      ? settings.period
      : `Masa Khidmat ${settings.period}`
    : 'Masa Khidmat 2024 - 2026';

  // Ambil Data Ketua PAC IPNU & Ketua PAC IPPNU dari database Pengurus PAC + Historical Leaders
  const pacOfficers = officers.filter((o) => !o.unitId);
  const ketuaIpnuOfficer = pacOfficers.find(
    (o) => o.organization === 'IPNU' && o.position.toLowerCase().includes('ketua')
  );
  const ketuaIppnuOfficer = pacOfficers.find(
    (o) => o.organization === 'IPPNU' && o.position.toLowerCase().includes('ketua')
  );

  const activeLeaderIpnu = historicalLeaders.find(
    (l) => l.organization === 'IPNU' && l.status === 'Aktif'
  );
  const activeLeaderIppnu = historicalLeaders.find(
    (l) => l.organization === 'IPPNU' && l.status === 'Aktif'
  );

  const primaryChairs = [
    {
      id: 'chair-ipnu',
      organization: 'IPNU' as const,
      roleTitle: ketuaIpnuOfficer?.position || 'Ketua PAC IPNU Dukun',
      fullName:
        ketuaIpnuOfficer?.fullName || activeLeaderIpnu?.name || 'M. Ainun Najib, S.Pd',
      photo:
        ketuaIpnuOfficer?.avatar ||
        ketuaIpnuOfficer?.photoUrl ||
        activeLeaderIpnu?.photo ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      nia: ketuaIpnuOfficer?.nia || '13.07.05.2021.0001',
      period: ketuaIpnuOfficer?.period || activeLeaderIpnu?.period || cleanPeriod,
      originUnit: activeLeaderIpnu?.originUnit || 'PR IPNU Dukun',
      phone: ketuaIpnuOfficer?.phone || settings.phone || '0812-3456-7890',
      email: ketuaIpnuOfficer?.email || settings.email || 'pacipnudukun@gmail.com',
      quote:
        activeLeaderIpnu?.visionOrQuote ||
        ketuaIpnuOfficer?.description ||
        'Mengokohkan basis kaderisasi pelajar santri yang unggul dalam keilmuan, tertib organisasi, dan berdaya saing digital.',
      achievements: activeLeaderIpnu?.achievements || [
        'Digitalisasi Database Terpadu Ranting & Komisariat se-Kecamatan Dukun',
        'Penguatan Kurikulum Kaderisasi MAKESTA & LAKMUD Terstandar',
      ],
    },
    {
      id: 'chair-ippnu',
      organization: 'IPPNU' as const,
      roleTitle: ketuaIppnuOfficer?.position || 'Ketua PAC IPPNU Dukun',
      fullName:
        ketuaIppnuOfficer?.fullName || activeLeaderIppnu?.name || 'Fatimatus Zahro, S.Ag',
      photo:
        ketuaIppnuOfficer?.avatar ||
        ketuaIppnuOfficer?.photoUrl ||
        activeLeaderIppnu?.photo ||
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
      nia: ketuaIppnuOfficer?.nia || '23.07.05.2021.0002',
      period: ketuaIppnuOfficer?.period || activeLeaderIppnu?.period || cleanPeriod,
      originUnit: activeLeaderIppnu?.originUnit || 'PR IPPNU Sumber',
      phone: ketuaIppnuOfficer?.phone || settings.phone || '0812-3456-7891',
      email: ketuaIppnuOfficer?.email || settings.email || 'pacippnudukun@gmail.com',
      quote:
        activeLeaderIppnu?.visionOrQuote ||
        ketuaIppnuOfficer?.description ||
        'Mewujudkan pelajar putri Nahdliyin yang berakhlakul karimah, mandiri, kreatif, dan pelopor literasi di lingkungan madrasah serta desa.',
      achievements: activeLeaderIppnu?.achievements || [
        'Pemberdayaan Kemandirian Pelajar Putri & Forum Kajian Keputrian Ranting',
        'Sinkronisasi Tertib Administrasi E-SP IPPNU se-Kecamatan Dukun',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
      <BreadcrumbBar
        currentPageLabel={
          settings.navMenuLabels?.profilSubSejarah ||
          'Profil, Sejarah & Data Ketua PAC'
        }
        onBackHome={onBackHome}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* Quick Switch Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Halaman Lengkap Profil, Sejarah & Data Ketua PAC IPNU IPPNU Dukun
              </p>
              <p className="text-[11px] text-slate-500">
                Memuat Sejarah Organisasi, Visi-Misi, Foto & Biodata Ketua PAC IPNU IPPNU, serta Pengurus Harian PAC
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onSwitchPage && (
              <button
                type="button"
                onClick={() => onSwitchPage('pelindung-pembina')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Lihat Dewan Pelindung & Pembina →</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Sejarah & Visi Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {titles.profilTitle || 'Sejarah & Perjalanan Khidmat PAC Dukun'}
                  </h2>
                  <p className="text-[11px] font-semibold text-emerald-700">{cleanPeriod}</p>
                </div>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {settings.historyText || settings.history}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Wilayah Kerja
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {settings.workArea || 'Kecamatan Dukun, Kab. Gresik'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Periode Kepengurusan
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{cleanPeriod}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
              <div className="flex items-center space-x-2.5 mb-2.5">
                <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Target className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold tracking-wide uppercase text-amber-300">
                  Visi Organisasi
                </h3>
              </div>
              <p className="text-sm sm:text-base font-medium leading-relaxed text-emerald-50 italic">
                &ldquo;{settings.vision}&rdquo;
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-5 rounded-full bg-emerald-600 inline-block" />
                <span>Misi Strategis & Panca Khidmat</span>
              </h3>
              <ul className="space-y-2">
                {settings.missions.map((mission, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 group">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {mission}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: SOROTAN UTAMA FOTO & DATA LENGKAP KETUA PAC IPNU & IPPNU */}
        <div className="bg-white rounded-3xl p-4 sm:p-7 border border-emerald-200/80 shadow-sm space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Foto & Data Lengkap Ketua PAC
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
              {titles.ketuaTitle || 'Foto dan Data Ketua PAC IPNU & IPPNU Dukun'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {titles.ketuaSubtitle ||
                `Profil Mandataris Ketua Pimpinan Anak Cabang IPNU & IPPNU Kecamatan Dukun (${cleanPeriod})`}
            </p>
          </div>

          {/* 2 Featured Large Cards: Ketua PAC IPNU & Ketua PAC IPPNU */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {primaryChairs.map((chair) => {
              const isIpnu = chair.organization === 'IPNU';
              const cleanWa = chair.phone.replace(/[^0-9]/g, '');
              const waUrl = cleanWa
                ? `https://wa.me/${cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa}`
                : '';

              return (
                <div
                  key={chair.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-5 ${
                    isIpnu
                      ? 'bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border-emerald-300 shadow-xs'
                      : 'bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/40 border-amber-300 shadow-xs'
                  }`}
                >
                  {/* Pas Foto Resmi Ketua PAC */}
                  <div className="w-32 sm:w-40 shrink-0 mx-auto sm:mx-0">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200 relative">
                      <img
                        src={chair.photo}
                        alt={chair.fullName}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute bottom-2 inset-x-2 text-center py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow ${
                          isIpnu
                            ? 'bg-emerald-700/95 text-white'
                            : 'bg-amber-500/95 text-slate-950'
                        }`}
                      >
                        KETUA PAC {chair.organization}
                      </span>
                    </div>
                  </div>

                  {/* Biodata Lengkap Ketua PAC */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Mandataris Aktif
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {chair.period.toLowerCase().includes('masa khidmat')
                            ? chair.period
                            : `Masa Khidmat ${chair.period}`}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                        {chair.fullName}
                      </h3>
                      <p className="text-xs font-bold text-emerald-700">{chair.roleTitle}</p>

                      {/* Tabel Ringkas Biodata */}
                      <div className="mt-3 space-y-1.5 text-xs bg-white/90 p-3 rounded-xl border border-slate-200/70">
                        <div className="flex items-center gap-2 text-slate-700">
                          <IdCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-slate-500">NIA:</span>
                          <span className="font-mono font-bold text-slate-900">{chair.nia}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-slate-500">Asal Pangkalan:</span>
                          <span className="font-semibold text-slate-900">{chair.originUnit}</span>
                        </div>
                        {chair.phone && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-slate-500">Kontak:</span>
                            <span className="font-mono text-slate-800">{chair.phone}</span>
                          </div>
                        )}
                        {chair.email && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-mono text-[11px] text-slate-700 truncate">
                              {chair.email}
                            </span>
                          </div>
                        )}
                      </div>

                      {chair.quote && (
                        <p className="mt-2.5 text-xs text-slate-600 italic bg-white/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                          &ldquo;{chair.quote}&rdquo;
                        </p>
                      )}
                    </div>

                    {waUrl && (
                      <div className="pt-2 flex justify-end">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Hubungi Ketua {chair.organization}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daftar Riwayat & Estafet Ketua PAC IPNU IPPNU */}
          {historicalLeaders.length > 0 && (
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Data Ketua PAC IPNU & IPPNU Lintas Masa Khidmat</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  Total {historicalLeaders.length} Data Ketua
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {historicalLeaders.map((leader) => (
                  <div
                    key={leader.id}
                    className={`rounded-2xl p-3.5 border transition-all ${
                      leader.status === 'Aktif'
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <img
                        src={
                          leader.photo ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                        }
                        alt={leader.name}
                        className="w-14 h-16 rounded-xl object-cover border border-white shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 flex-wrap mb-0.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              leader.organization === 'IPNU'
                                ? 'bg-emerald-700 text-white'
                                : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            KETUA {leader.organization}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              leader.status === 'Aktif'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {leader.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug truncate">
                          {leader.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-emerald-700">
                          Masa Khidmat {leader.period.replace(/masa khidmat/i, '').trim()}
                        </p>
                      </div>
                    </div>
                    {leader.originUnit && (
                      <p className="text-[11px] text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Asal Pangkalan: {leader.originUnit}</span>
                      </p>
                    )}
                    {leader.visionOrQuote && (
                      <p className="text-[11px] text-slate-600 italic bg-white/90 p-2 rounded-xl border border-slate-100 line-clamp-2">
                        &ldquo;{leader.visionOrQuote}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Data Pengurus Harian PAC (Reuses LeadershipSection with 4-photo smooth slider) */}
      <LeadershipSection />
    </div>
  );
};

export const PelindungPembinaDedicatedPage: React.FC<DedicatedPageProps> = ({
  onBackHome,
  onSwitchPage,
}) => {
  const { supervisors, alumni, settings } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PELINDUNG' | 'PEMBINA'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const titles = settings.sectionTitles || {};

  const unifiedList = [
    ...supervisors.map((sup) => ({
      id: sup.id,
      fullName: sup.fullName,
      category: 'PELINDUNG' as const,
      categoryLabel: 'Dewan Pelindung',
      roleLabel: sup.role || sup.roleOrTitle || sup.title || 'Dewan Pelindung PAC',
      subLabel: sup.originOrganization || 'Tokoh Masyarakat / Ulama NU Dukun',
      period: sup.period || settings.period || '2024 - 2026',
      address: sup.address || 'Kecamatan Dukun',
      photo: sup.photo,
      phone: sup.phone,
      notes: sup.notes,
    })),
    ...alumni.map((alm) => ({
      id: alm.id,
      fullName: alm.fullName,
      category: 'PEMBINA' as const,
      categoryLabel: 'Dewan Pembina (Majelis Alumni)',
      roleLabel: alm.formerPosition || alm.pastPosition || 'Dewan Pembina / Majelis Alumni',
      subLabel: alm.currentProfession || alm.currentActivity || 'Majelis Alumni IPNU IPPNU',
      period: alm.period ? `Alumni Periode ${alm.period}` : 'Majelis Alumni PAC',
      address: alm.address || alm.city || 'Kecamatan Dukun',
      photo: alm.photo,
      phone: alm.phone,
      notes: alm.notes,
    })),
  ];

  const filteredItems = unifiedList.filter((item) => {
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchSearch =
      !searchQuery.trim() ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-14 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
      <BreadcrumbBar
        currentPageLabel={
          settings.navMenuLabels?.profilSubPelindungPembina ||
          'Database Dewan Pelindung & Dewan Pembina'
        }
        onBackHome={onBackHome}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Satu Folder Database Terpadu
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {titles.pelindungTitle || 'Dewan Pelindung & Dewan Pembina PAC IPNU IPPNU Dukun'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {titles.pelindungSubtitle ||
                'Daftar Masyayikh, Pengurus MWC NU (Dewan Pelindung) serta Jajaran Majelis Alumni (Dewan Pembina) dalam satu direktori.'}
            </p>
          </div>

          {onSwitchPage && (
            <button
              type="button"
              onClick={() => onSwitchPage('profil-pac')}
              className="self-start lg:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-bold transition-all duration-200 cursor-pointer shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buka Profil, Sejarah & Data Ketua →</span>
            </button>
          )}
        </div>

        {/* Category Filter Tabs & Search */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                categoryFilter === 'ALL'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Kategori ({unifiedList.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('PELINDUNG')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                categoryFilter === 'PELINDUNG'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dewan Pelindung ({supervisors.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('PEMBINA')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                categoryFilter === 'PEMBINA'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Dewan Pembina / Majelis Alumni ({alumni.length})</span>
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tokoh / jabatan..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isPelindung = item.category === 'PELINDUNG';
            const cleanWa = item.phone ? item.phone.replace(/[^0-9]/g, '') : '';
            const waLink = cleanWa
              ? `https://wa.me/${cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa}`
              : '';

            return (
              <div
                key={`${item.category}-${item.id}`}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3">
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-base shrink-0 ${
                          isPelindung
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {item.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold mb-1 ${
                          isPelindung
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {item.categoryLabel}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {item.fullName}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {item.roleLabel}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p>
                      <span className="font-semibold text-slate-700">Instansi/Kiprah:</span>{' '}
                      {item.subLabel}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">Periode:</span> {item.period}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">Domisili:</span> {item.address}
                    </p>
                  </div>
                </div>

                {waLink && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Silaturahmi WA</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
