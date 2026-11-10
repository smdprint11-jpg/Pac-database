import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Target,
  CheckCircle2,
  MapPin,
  Calendar,
  BookOpen,
  Quote,
  Award,
  FolderOpen,
  Shield,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

interface AboutSectionProps {
  onOpenDedicatedPage?: (page: 'profil-pac' | 'pelindung-pembina') => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenDedicatedPage }) => {
  const { settings, supervisors, alumni, officers } = useApp();
  const [patronCategory, setPatronCategory] = useState<'ALL' | 'PELINDUNG' | 'PEMBINA'>('ALL');

  // Sync category tab if user clicks #pelindung or #pembina
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#pelindung') {
        setPatronCategory('PELINDUNG');
      } else if (window.location.hash === '#pembina') {
        setPatronCategory('PEMBINA');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Unified items for Dewan Pelindung & Dewan Pembina (Satu Folder Beda Kategori)
  const unifiedPatrons = [
    ...supervisors.map((s) => ({
      id: `pel-${s.id}`,
      category: 'PELINDUNG' as const,
      categoryLabel: 'Dewan Pelindung',
      badgeText: s.originOrganization || 'Dewan Pelindung',
      fullName: s.fullName,
      subtitle: s.roleOrTitle || s.title || 'Pelindung PAC IPNU IPPNU Dukun',
      description: s.notes || '',
      phone: s.phone || '',
      photo: s.photo || '',
    })),
    ...alumni.map((a) => ({
      id: `pem-${a.id}`,
      category: 'PEMBINA' as const,
      categoryLabel: 'Dewan Pembina',
      badgeText: a.period ? `Majelis Alumni (${a.period})` : 'Dewan Pembina',
      fullName: a.fullName,
      subtitle: a.pastPosition || a.formerPosition || 'Dewan Pembina PAC',
      description: a.currentActivity || a.currentProfession || a.notes || '',
      phone: a.phone || '',
      photo: a.photo || '',
    })),
  ];

  const filteredPatrons = unifiedPatrons.filter((item) => {
    if (patronCategory === 'ALL') return true;
    return item.category === patronCategory;
  });

  const cleanPeriod = settings.period
    ? settings.period.toLowerCase().includes('masa khidmat')
      ? settings.period
      : `Masa Khidmat ${settings.period}`
    : 'Masa Khidmat 2024 - 2026';

  // Synchronize active Ketua IPNU & IPPNU from live PAC officers database with historicalLeaders
  const pacOfficers = officers.filter((o) => !o.unitId);
  const ketuaIpnuOfficer = pacOfficers.find(
    (o) => o.organization === 'IPNU' && o.position.toLowerCase().includes('ketua') && !o.position.toLowerCase().includes('wakil')
  );
  const ketuaIppnuOfficer = pacOfficers.find(
    (o) => o.organization === 'IPPNU' && o.position.toLowerCase().includes('ketua') && !o.position.toLowerCase().includes('wakil')
  );

  const syncedLeaders = (settings.historicalLeaders || []).map((leader) => {
    if (leader.status === 'Aktif' && leader.organization === 'IPNU' && ketuaIpnuOfficer) {
      return {
        ...leader,
        name: ketuaIpnuOfficer.fullName,
        photo: ketuaIpnuOfficer.photoUrl || ketuaIpnuOfficer.avatar || leader.photo,
        period: ketuaIpnuOfficer.period || leader.period,
      };
    }
    if (leader.status === 'Aktif' && leader.organization === 'IPPNU' && ketuaIppnuOfficer) {
      return {
        ...leader,
        name: ketuaIppnuOfficer.fullName,
        photo: ketuaIppnuOfficer.photoUrl || ketuaIppnuOfficer.avatar || leader.photo,
        period: ketuaIppnuOfficer.period || leader.period,
      };
    }
    return leader;
  });

  return (
    <section id="profil" className="py-4 sm:py-14 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-3.5 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Profil Organisasi PAC IPNU IPPNU Dukun</span>
          </div>
          <h2 className="text-lg sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {settings.sectionTitles?.profilTitle ||
              'Bergerak, Berilmu, dan Berkhidmat Demi Kemaslahatan Pelajar Nahdliyin'}
          </h2>
          <p className="mt-1 text-[11px] sm:text-base text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
            {settings.sectionTitles?.profilSubtitle ||
              'Sejarah perjuangan, visi misi strategis, serta data ketua IPNU IPPNU Kecamatan Dukun, Kabupaten Gresik.'}
          </p>

          {onOpenDedicatedPage && (
            <div className="mt-2.5 sm:mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => onOpenDedicatedPage('profil-pac')}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] sm:text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Profil, Sejarah & Data Ketua</span>
                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
              <button
                type="button"
                onClick={() => onOpenDedicatedPage('pelindung-pembina')}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] sm:text-xs font-bold shadow-2xs transition cursor-pointer"
              >
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700" />
                <span>Dewan Pelindung & Pembina</span>
                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          )}
        </div>

        {/* 1. SEJARAH & VISI ORGANISASI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-6 items-stretch mb-3 sm:mb-8">
          {/* Sejarah & Wilayah */}
          <div className="lg:col-span-7 bg-white p-3 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-[10px] sm:text-[11px] mb-1 sm:mb-2">
                <span className="w-4 sm:w-5 h-1 bg-emerald-600 rounded-full" />
                <span>SEJARAH & IDENTITAS PAC</span>
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2 leading-snug">
                Pilar Pengkaderan Generasi Muda Nahdlatul Ulama di Wilayah Dukun
              </h3>
              <p className="text-slate-600 text-[11px] sm:text-sm leading-relaxed mb-2.5 sm:mb-3 whitespace-pre-line line-clamp-3 sm:line-clamp-none">
                {settings.historyText || settings.history}
              </p>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-slate-100">
                <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Periode Khidmat</div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 truncate">{cleanPeriod}</div>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Wilayah Kerja</div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 leading-tight truncate">
                      {settings.workArea || 'Kecamatan Dukun, Gresik'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 sm:mt-3 p-2 sm:p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 text-xs flex flex-wrap items-center justify-between gap-1.5">
              <span className="font-semibold text-[10px] sm:text-[11px]">Motto Perjuangan:</span>
              <span className="font-serif italic text-emerald-800 text-[11px] sm:text-xs font-bold">
                "Belajar, Berjuang, Bertaqwa"
              </span>
            </div>
          </div>

          {/* Visi & Misi Ringkas Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 p-3 sm:p-7 rounded-2xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
            <Quote className="absolute -bottom-6 -right-6 w-24 h-24 sm:w-28 sm:h-28 text-emerald-700/20 pointer-events-none" />

            <div className="relative z-10 space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-700/50 text-emerald-200 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border border-emerald-600/40">
                <Compass className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>Visi & Misi Strategis</span>
              </div>
              <blockquote className="text-[11px] sm:text-base font-medium leading-relaxed font-serif italic text-emerald-50 line-clamp-2 sm:line-clamp-none">
                "{settings.vision}"
              </blockquote>

              <div className="pt-1.5 sm:pt-2 border-t border-emerald-700/40 space-y-1">
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Panca Misi Prioritas:
                </div>
                <ul className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-[11px] text-emerald-100/90">
                  {settings.missions.slice(0, 3).map((misi, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{misi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {onOpenDedicatedPage && (
              <div className="relative z-10 pt-2 mt-2 sm:pt-3 sm:mt-3 border-t border-emerald-700/40 flex justify-end">
                <button
                  type="button"
                  onClick={() => onOpenDedicatedPage('profil-pac')}
                  className="text-[10px] sm:text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Baca Sejarah & Misi Lengkap</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. FOTO DAN DATA KETUA IPNU & IPPNU (Di Dalam Profil PAC) */}
        <div id="ketua-ipnu-ippnu" className="pt-2 sm:pt-6 scroll-mt-20">
          <div className="bg-white p-3 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 sm:space-y-4">
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Kepemimpinan Utama</span>
                </div>
                <h3 className="text-sm sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
                  {settings.sectionTitles?.ketuaTitle || 'Foto dan Data Ketua IPNU IPPNU'}
                </h3>
              </div>

              {onOpenDedicatedPage && (
                <button
                  type="button"
                  onClick={() => onOpenDedicatedPage('profil-pac')}
                  className="shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Detail</span>
                  <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              )}
            </div>

            {/* Leaders Grid - Compact 2 cols on mobile, 3 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {syncedLeaders.slice(0, 6).map((leader) => {
                const isIpnu = leader.organization === 'IPNU';
                return (
                  <div
                    key={leader.id}
                    className={`rounded-xl border p-2 sm:p-3 bg-gradient-to-b from-white to-slate-50/50 shadow-2xs hover:shadow-sm transition-all flex items-center gap-2 sm:gap-3 ${
                      leader.status === 'Aktif'
                        ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="relative shrink-0">
                      {leader.photo ? (
                        <img
                          src={leader.photo}
                          alt={leader.name}
                          className="w-9 h-11 sm:w-14 sm:h-16 rounded-lg sm:rounded-xl object-cover border border-emerald-400/40"
                        />
                      ) : (
                        <div className="w-9 h-11 sm:w-14 sm:h-16 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-base flex items-center justify-center">
                          {leader.name.charAt(0)}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-black uppercase ${
                          isIpnu ? 'bg-emerald-600 text-white' : 'bg-green-700 text-white'
                        }`}
                      >
                        {leader.organization}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[8px] sm:text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-slate-100 text-slate-700 font-mono truncate">
                          {leader.period}
                        </span>
                        <span
                          className={`hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            leader.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {leader.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-[11px] sm:text-sm leading-snug truncate">
                        {leader.name}
                      </h4>
                      {leader.originUnit && (
                        <div className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold truncate">
                          {leader.originUnit}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. SATU FOLDER GABUNGAN: DEWAN PELINDUNG & DEWAN PEMBINA (BEDA KATEGORI) */}
        <div id="pelindung" className="pt-2.5 sm:pt-6 scroll-mt-20">
          <div id="pembina" className="scroll-mt-20" />
          <div className="bg-white p-3 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 sm:space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3 pb-2 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  <FolderOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Direktori Kehormatan • Satu Folder</span>
                </div>
                <h3 className="text-sm sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {patronCategory === 'PELINDUNG'
                    ? settings.sectionTitles?.pelindungTitle || 'Dewan Pelindung PAC IPNU IPPNU Dukun'
                    : patronCategory === 'PEMBINA'
                    ? settings.sectionTitles?.pembinaTitle || 'Dewan Pembina (Majelis Alumni) PAC Dukun'
                    : `${settings.sectionTitles?.pelindungTitle || 'Dewan Pelindung'} & ${
                        settings.sectionTitles?.pembinaTitle || 'Dewan Pembina'
                      }`}
                </h3>
              </div>

              {/* Filter Kategori Folder + Dedicated Page Button */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex flex-wrap items-center gap-1 p-0.5 sm:p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPatronCategory('ALL')}
                    className={`px-2 py-1 sm:px-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      patronCategory === 'ALL'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Semua ({unifiedPatrons.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatronCategory('PELINDUNG')}
                    className={`px-2 py-1 sm:px-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      patronCategory === 'PELINDUNG'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Pelindung ({supervisors.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatronCategory('PEMBINA')}
                    className={`px-2 py-1 sm:px-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      patronCategory === 'PEMBINA'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Pembina ({alumni.length})</span>
                  </button>
                </div>

                {onOpenDedicatedPage && (
                  <button
                    type="button"
                    onClick={() => onOpenDedicatedPage('pelindung-pembina')}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>Detail</span>
                    <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid Items - 2 Columns on Mobile for Minimal Scroll */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5">
              {filteredPatrons.slice(0, 6).map((item) => {
                const isPelindung = item.category === 'PELINDUNG';
                return (
                  <div
                    key={item.id}
                    className="p-2 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50/40 transition flex items-center justify-between gap-1.5 sm:gap-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.fullName}
                          className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl object-cover border border-emerald-500/20 shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 ${
                            isPelindung
                              ? 'bg-emerald-200 text-emerald-900'
                              : 'bg-teal-200 text-teal-900'
                          }`}
                        >
                          {item.fullName.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span
                          className={`inline-block text-[8px] sm:text-[9px] font-bold uppercase px-1 sm:px-1.5 py-0.2 rounded truncate max-w-full ${
                            isPelindung
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {isPelindung ? 'Pelindung' : 'Pembina'}
                        </span>
                        <h4 className="font-bold text-slate-900 text-[11px] sm:text-xs mt-0.5 truncate">
                          {item.fullName}
                        </h4>
                        <p className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    {item.phone && (
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-1.5 py-1 sm:px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] sm:text-[10px] font-semibold shrink-0 transition"
                      >
                        WA
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
