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
    <div className="bg-emerald-950 text-white pt-20 pb-6 sm:pt-24 sm:pb-8 border-b border-emerald-900/60 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            {showBreadcrumb && (
              <nav className="flex items-center gap-2 text-xs font-medium text-emerald-300/90 mb-2">
                <button
                  type="button"
                  onClick={onBackHome}
                  className="inline-flex items-center gap-1 hover:text-white transition cursor-pointer"
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
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition cursor-pointer"
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
  const { settings } = useApp();
  const historicalLeaders = settings.historicalLeaders || [];
  const titles = settings.sectionTitles || {};
  const cleanPeriod = settings.period
    ? settings.period.toLowerCase().includes('masa khidmat')
      ? settings.period
      : `Masa Khidmat ${settings.period}`
    : 'Masa Khidmat 2024 - 2026';

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbBar
        currentPageLabel={
          settings.navMenuLabels?.profilSubSejarah ||
          'Profil, Sejarah, Data Ketua & Pengurus Harian PAC'
        }
        onBackHome={onBackHome}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Quick Switch Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Halaman Lengkap Profil & Kepengurusan PAC IPNU IPPNU Dukun
              </p>
              <p className="text-[11px] text-slate-500">
                Memuat Sejarah Organisasi, Visi-Misi, Foto & Data Ketua IPNU IPPNU, serta Pengurus Harian PAC
              </p>
            </div>
          </div>
          {onSwitchPage && (
            <button
              type="button"
              onClick={() => onSwitchPage('pelindung-pembina')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Lihat Halaman Dewan Pelindung & Pembina →</span>
            </button>
          )}
        </div>

        {/* Section 1: Sejarah & Visi Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
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

        {/* Section 2: Foto & Data Ketua IPNU IPPNU */}
        <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/60 mb-2">
              <Award className="w-3.5 h-3.5" /> Pucuk Pimpinan PAC
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {titles.ketuaTitle || 'Foto dan Data Ketua IPNU IPPNU'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {titles.ketuaSubtitle ||
                'Profil Ketua Mandataris Konferancab PAC IPNU & IPPNU Kecamatan Dukun beserta jejak kepemimpinan.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {historicalLeaders.map((leader) => (
              <div
                key={leader.id}
                className={`rounded-2xl p-4 border transition-all ${
                  leader.status === 'Aktif'
                    ? 'bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/40 border-emerald-300 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={
                      leader.photo ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={leader.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          leader.organization === 'IPNU'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        KETUA {leader.organization}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          leader.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {leader.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                      {leader.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-700">
                      Masa Khidmat {leader.period.replace(/masa khidmat/i, '').trim()}
                    </p>
                  </div>
                </div>
                {leader.originUnit && (
                  <p className="text-[11px] text-slate-500 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Asal Pangkalan: {leader.originUnit}</span>
                  </p>
                )}
                {leader.visionOrQuote && (
                  <p className="text-xs text-slate-600 italic bg-white/90 p-2.5 rounded-xl border border-slate-100">
                    &ldquo;{leader.visionOrQuote}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
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
    <div className="min-h-screen bg-slate-50 pb-14">
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
              className="self-start lg:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-bold transition cursor-pointer shrink-0"
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
