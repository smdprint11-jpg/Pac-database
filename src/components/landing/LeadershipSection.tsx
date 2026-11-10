import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Users,
  Sparkles,
  Play,
  Pause,
} from 'lucide-react';
import { Officer, PacOfficerSlide } from '../../types';

export const LeadershipSection: React.FC = () => {
  const { officers, settings } = useApp();
  const [filterOrg, setFilterOrg] = useState<'ALL' | 'IPNU' | 'IPPNU'>('ALL');
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  // Normalize period text so "Masa Khidmat" is NEVER duplicated
  const formattedPeriod = settings.period
    ? settings.period.toLowerCase().includes('masa khidmat')
      ? settings.period
      : `Masa Khidmat ${settings.period}`
    : 'Masa Khidmat 2024 - 2026';

  // Filter PAC-level officers from live main PAC database
  const pacOfficers = officers
    .filter((o) => !o.unitId)
    .sort((a, b) => (a.displayOrder ?? a.orderIndex ?? 99) - (b.displayOrder ?? b.orderIndex ?? 99));

  const filteredOfficers = pacOfficers.filter((o) => {
    if (filterOrg === 'ALL') return true;
    return o.organization === filterOrg;
  });

  // Build unified photo slider directly from all filtered PAC officers (100% synchronized with main PAC data)
  const pacSlides: (PacOfficerSlide & { rawOfficer: Officer })[] = filteredOfficers.map((o) => ({
    id: `off-slide-${o.id}`,
    name: o.fullName,
    position: o.position,
    organization: o.organization === 'IPPNU' ? 'IPPNU' : 'IPNU',
    photo:
      o.photoUrl ||
      o.avatar ||
      (o.organization === 'IPPNU'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    quote:
      o.bio ||
      o.description ||
      `Pengurus Harian PAC ${o.organization} Kecamatan Dukun (${formattedPeriod})`,
    rawOfficer: o,
  }));

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Max index when sliding 1-by-1 with 4 visible cards on desktop
  const maxSlideOffset = Math.max(0, pacSlides.length - 4);

  useEffect(() => {
    if (activeSlideIndex > maxSlideOffset) {
      setActiveSlideIndex(0);
    }
  }, [maxSlideOffset, activeSlideIndex]);

  useEffect(() => {
    if (isPaused || maxSlideOffset <= 0) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev >= maxSlideOffset ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, maxSlideOffset]);

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev >= maxSlideOffset ? 0 : prev + 1));
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev <= 0 ? maxSlideOffset : prev - 1));
  };

  // Data officers below: 4 cards per row, sliding one by one smoothly across all PAC officers
  const [officerOffset, setOfficerOffset] = useState(0);
  const [isOfficersPaused, setIsOfficersPaused] = useState(false);
  const maxOfficerOffset = Math.max(0, filteredOfficers.length - 4);

  useEffect(() => {
    if (isOfficersPaused || maxOfficerOffset <= 0) return;
    const timer = setInterval(() => {
      setOfficerOffset((prev) => (prev >= maxOfficerOffset ? 0 : prev + 1));
    }, 4200);
    return () => clearInterval(timer);
  }, [isOfficersPaused, maxOfficerOffset]);

  useEffect(() => {
    setActiveSlideIndex(0);
    setOfficerOffset(0);
  }, [filterOrg]);

  return (
    <section id="pengurus" className="py-4 sm:py-14 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-3">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Struktur Kepemimpinan</span>
            </div>
            <h2 className="text-lg sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {settings.sectionTitles?.pengurusTitle || 'Pimpinan Harian PAC IPNU IPPNU DUKUN'}
            </h2>
            <p className="mt-0.5 sm:mt-1 text-slate-600 text-[11px] sm:text-sm line-clamp-2 sm:line-clamp-none">
              {formattedPeriod}.{' '}
              {settings.sectionTitles?.pengurusSubtitle ||
                'Berikhtiar mengayomi dan menggerakkan pelajar Nahdliyin dengan kepemimpinan yang amanah, cerdas, dan transformatif.'}
            </p>
          </div>

          {/* Org Filter Buttons */}
          <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setFilterOrg('ALL')}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({pacOfficers.length})
            </button>
            <button
              onClick={() => setFilterOrg('IPNU')}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'IPNU'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IPNU ({pacOfficers.filter((o) => o.organization === 'IPNU').length})
            </button>
            <button
              onClick={() => setFilterOrg('IPPNU')}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'IPPNU'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IPPNU ({pacOfficers.filter((o) => o.organization === 'IPPNU').length})
            </button>
          </div>
        </div>

        {/* SLIDER BAR FOTO PENGURUS HARIAN PAC: SEMUA PENGURUS HARIAN PAC SLIDE HALUS KE SAMPING SATU-SATU */}
        {pacSlides.length > 0 && (
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 rounded-2xl sm:rounded-3xl p-3 sm:p-7 text-white shadow-xl relative overflow-hidden"
          >
            {/* Background Decorative Rings */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-2.5 sm:space-y-5">
              {/* Top Slider Header & Controls */}
              <div className="flex flex-row items-center justify-between gap-2 border-b border-white/10 pb-2 sm:pb-3.5">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-400/30 text-[9px] sm:text-[10px] font-bold text-amber-300">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="truncate">
                      {pacSlides.length} Foto Pimpinan Harian • Geser Halus
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-xl font-black text-white tracking-tight mt-0.5 sm:mt-1 truncate">
                    Galeri Foto Pengurus Harian PAC Dukun ({pacSlides.length} Kader)
                  </h3>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer"
                    title={isPaused ? 'Putar Slide Otomatis' : 'Jeda Slide'}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> : <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer"
                    aria-label="Geser Kiri"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <div className="hidden sm:flex items-center gap-1 px-1">
                    {Array.from({ length: maxSlideOffset + 1 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activeSlideIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'
                        }`}
                        aria-label={`Slide posisi ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer"
                    aria-label="Geser Kanan"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* All PAC Officers Smooth Horizontal Track (4 visible on desktop, sliding 1-by-1) */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${activeSlideIndex * 25}%)`,
                  }}
                >
                  {pacSlides.map((slideItem, sIdx) => (
                    <div
                      key={`${slideItem.id}-${sIdx}`}
                      onClick={() => setSelectedOfficer(slideItem.rawOfficer)}
                      className="w-1/2 sm:w-1/4 shrink-0 px-1 sm:px-2 cursor-pointer"
                    >
                      <div className="h-full bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-2 sm:p-4 flex flex-col justify-between hover:bg-white/15 transition duration-300 shadow-lg">
                        <div className="space-y-1.5 sm:space-y-3">
                          <div className="aspect-[4/4] sm:aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden border border-emerald-400/40 shadow-md bg-slate-800 relative">
                            <img
                              src={slideItem.photo}
                              alt={slideItem.name}
                              className="w-full h-full object-cover transition duration-500 hover:scale-105"
                            />
                            <span
                              className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider shadow ${
                                slideItem.organization === 'IPNU'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-400 text-slate-950'
                              }`}
                            >
                              {slideItem.organization}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-[11px] sm:text-sm font-black text-white tracking-tight line-clamp-1">
                              {slideItem.name}
                            </h4>
                            <p className="text-[9px] sm:text-xs font-semibold text-emerald-300 mt-0.5 line-clamp-1">
                              {slideItem.position}
                            </p>
                          </div>

                          {slideItem.quote && (
                            <p className="hidden md:block text-[11px] text-slate-200 italic line-clamp-2 bg-black/20 p-2 rounded-lg border border-white/10">
                              "{slideItem.quote}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DATA PENGURUS HARIAN (Satu Baris Slide Halus ke Samping Satu-Satu - Semua Data Pengurus Harian PAC) */}
        <div
          onMouseEnter={() => setIsOfficersPaused(true)}
          onMouseLeave={() => setIsOfficersPaused(false)}
          className="space-y-2.5 sm:space-y-4"
        >
          <div className="flex flex-row items-center justify-between gap-2 pb-1.5 sm:pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs sm:text-lg font-bold text-slate-900 tracking-tight">
                Daftar Pengurus Harian PAC ({filteredOfficers.length} Kader)
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500">
                Geser ke samping untuk melihat seluruh data pengurus harian PAC ({filteredOfficers.length} pengurus)
              </p>
            </div>

            {filteredOfficers.length > 1 && (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOfficersPaused(!isOfficersPaused)}
                  className="p-1 sm:p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  title={isOfficersPaused ? 'Putar Otomatis' : 'Jeda'}
                >
                  {isOfficersPaused ? (
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                  ) : (
                    <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOfficerOffset((prev) => (prev <= 0 ? maxOfficerOffset : prev - 1))
                  }
                  className="p-1 sm:p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <div className="hidden sm:flex items-center gap-1 px-1">
                  {Array.from({ length: maxOfficerOffset + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setOfficerOffset(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === officerOffset ? 'w-4 bg-emerald-600' : 'w-1.5 bg-slate-300'
                      }`}
                      aria-label={`Slide daftar pengurus ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setOfficerOffset((prev) => (prev >= maxOfficerOffset ? 0 : prev + 1))
                  }
                  className="p-1 sm:p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${officerOffset * 25}%)`,
              }}
            >
              {filteredOfficers.map((officer) => {
                const isIpnu = officer.organization === 'IPNU';
                const badgeColor = isIpnu
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-green-100 text-green-800 border-green-200';
                const officerPhoto = officer.photoUrl || officer.avatar;
                const officerBio = officer.bio || officer.description;

                return (
                  <div
                    key={officer.id}
                    className="w-1/2 sm:w-1/2 lg:w-1/4 shrink-0 px-1 sm:px-2"
                  >
                    <div
                      onClick={() => setSelectedOfficer(officer)}
                      className="h-full bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-2.5 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer border-t-4 border-t-emerald-600"
                    >
                      <div className="space-y-1.5 sm:space-y-2.5">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="relative shrink-0">
                            {officerPhoto ? (
                              <img
                                src={officerPhoto}
                                alt={officer.fullName}
                                className="w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover border border-emerald-500/20 group-hover:scale-105 transition"
                              />
                            ) : (
                              <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-700 font-bold text-xs sm:text-base">
                                {officer.fullName.charAt(0)}
                              </div>
                            )}
                            <span
                              className={`absolute -bottom-1 -right-1 px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-black uppercase border ${badgeColor}`}
                            >
                              {officer.organization}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] sm:text-[10px] font-bold text-emerald-700 uppercase tracking-wider truncate">
                              {officer.position}
                            </div>
                            <h3 className="text-[11px] sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">
                              {officer.fullName}
                            </h3>
                            {officer.nia && (
                              <div className="hidden sm:block text-[9px] font-mono text-slate-400 truncate">
                                NIA: {officer.nia}
                              </div>
                            )}
                          </div>
                        </div>

                        {officerBio && (
                          <p className="hidden sm:block text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {officerBio}
                          </p>
                        )}
                      </div>

                      <div className="pt-1.5 mt-1.5 sm:pt-2.5 sm:mt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                        <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 truncate">
                          {officer.department || 'Pengurus Harian'}
                        </span>
                        <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700 group-hover:translate-x-0.5 transition shrink-0">
                          <span>Detail</span>
                          <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Officer Detail Modal */}
      {selectedOfficer && (
        <Modal
          isOpen={!!selectedOfficer}
          onClose={() => setSelectedOfficer(null)}
          title="Profil Pengurus Harian PAC"
          subtitle={formattedPeriod}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              {selectedOfficer.photoUrl || selectedOfficer.avatar ? (
                <img
                  src={selectedOfficer.photoUrl || selectedOfficer.avatar}
                  alt={selectedOfficer.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
                  {selectedOfficer.fullName.charAt(0)}
                </div>
              )}

              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 uppercase mb-1">
                  {selectedOfficer.organization}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {selectedOfficer.fullName}
                </h3>
                <p className="text-xs text-emerald-800 font-semibold">{selectedOfficer.position}</p>
                {selectedOfficer.nia && (
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    NIA: {selectedOfficer.nia}
                  </p>
                )}
              </div>
            </div>

            {(selectedOfficer.bio || selectedOfficer.description) && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Profil & Dedikasi:</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedOfficer.bio || selectedOfficer.description}
                </p>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              {selectedOfficer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono">{selectedOfficer.phone}</span>
                </div>
              )}
              {selectedOfficer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono">{selectedOfficer.email}</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
