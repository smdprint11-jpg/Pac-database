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

  // Slider Bar Foto Pengurus PAC State (Minimal 5 items so 4-item slider glides smoothly one by one)
  const defaultSlides: PacOfficerSlide[] = [
    {
      id: 'pos-1',
      name: 'M. Ainun Najib, S.Pd',
      position: 'Ketua PAC IPNU Dukun',
      organization: 'IPNU',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      quote: 'Kader santri masa depan adalah mereka yang kokoh dalam Aswaja dan tangkas dalam peradaban digital.',
    },
    {
      id: 'pos-2',
      name: 'Fatimatus Zahro, S.Ag',
      position: 'Ketua PAC IPPNU Dukun',
      organization: 'IPPNU',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      quote: 'Pelajar putri Nahdliyin adalah benteng moral dan penggerak inovasi sosial di tengah masyarakat.',
    },
    {
      id: 'pos-3',
      name: 'Ahmad Rizal Fanani',
      position: 'Sekretaris PAC IPNU Dukun',
      organization: 'IPNU',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      quote: 'Tertib administrasi adalah separuh dari keberhasilan gerak roda organisasi.',
    },
    {
      id: 'pos-4',
      name: 'Nur Lailatul Maghfiroh',
      position: 'Sekretaris PAC IPPNU Dukun',
      organization: 'IPPNU',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      quote: 'Dokumentasi rapi dan data akurat melahirkan keputusan organisasi yang tepat sasaran.',
    },
    {
      id: 'pos-5',
      name: 'M.Bahrul Ulum',
      position: 'Bendahara PAC IPNU Dukun',
      organization: 'IPNU',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      quote: 'Kemandirian ekonomi organisasi menjadi fondasi utama keberlanjutan syiar pelajar.',
    },
    {
      id: 'pos-6',
      name: 'Siti Khuzaimah',
      position: 'Bendahara PAC IPPNU Dukun',
      organization: 'IPPNU',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      quote: 'Transparansi dan akuntabilitas pengelolaan kas adalah wujud amanah perkhidmatan.',
    },
  ];

  const baseSlides =
    settings.pacOfficersSlider && settings.pacOfficersSlider.length > 0
      ? settings.pacOfficersSlider
      : defaultSlides;

  // Ensure we have enough slides for a smooth 4-card one-by-one track
  const pacSlides: PacOfficerSlide[] =
    baseSlides.length < 5 ? [...baseSlides, ...defaultSlides.slice(baseSlides.length, 6)] : baseSlides;

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Max index when sliding 1-by-1 with 4 visible cards on desktop
  const maxSlideOffset = Math.max(0, pacSlides.length - 4);

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

  // Normalize period text so "Masa Khidmat" is NEVER duplicated
  const formattedPeriod = settings.period
    ? settings.period.toLowerCase().includes('masa khidmat')
      ? settings.period
      : `Masa Khidmat ${settings.period}`
    : 'Masa Khidmat 2024 - 2026';

  // Filter PAC-level officers
  const pacOfficers = officers
    .filter((o) => !o.unitId)
    .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  const filteredOfficers = pacOfficers.filter((o) => {
    if (filterOrg === 'ALL') return true;
    return o.organization === filterOrg;
  });

  // Data officers below: 4 cards per row, sliding one by one smoothly
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
    setOfficerOffset(0);
  }, [filterOrg]);

  return (
    <section id="pengurus" className="py-7 sm:py-14 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Struktur Kepemimpinan</span>
            </div>
            <h2 className="text-xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {settings.sectionTitles?.pengurusTitle || 'Pimpinan Harian PAC IPNU IPPNU DUKUN'}
            </h2>
            <p className="mt-1 text-slate-600 text-xs sm:text-sm">
              {formattedPeriod}.{' '}
              {settings.sectionTitles?.pengurusSubtitle ||
                'Berikhtiar mengayomi dan menggerakkan pelajar Nahdliyin dengan kepemimpinan yang amanah, cerdas, dan transformatif.'}
            </p>
          </div>

          {/* Org Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setFilterOrg('ALL')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({pacOfficers.length})
            </button>
            <button
              onClick={() => setFilterOrg('IPNU')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'IPNU'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IPNU ({pacOfficers.filter((o) => o.organization === 'IPNU').length})
            </button>
            <button
              onClick={() => setFilterOrg('IPPNU')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'IPPNU'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IPPNU ({pacOfficers.filter((o) => o.organization === 'IPPNU').length})
            </button>
          </div>
        </div>

        {/* SLIDER BAR FOTO PENGURUS HARIAN PAC: 4 FOTO SLIDE HALUS KE SAMPING SATU-SATU */}
        {pacSlides.length > 0 && (
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-white shadow-xl relative overflow-hidden"
          >
            {/* Background Decorative Rings */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-4 sm:space-y-5">
              {/* Top Slider Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-400/30 text-[10px] font-bold text-amber-300">
                    <Sparkles className="w-3 h-3" />
                    <span>4 Foto Pimpinan Harian • Geser Halus Satu per Satu</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white tracking-tight mt-1">
                    Galeri Foto Pengurus Harian PAC Dukun
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer"
                    title={isPaused ? 'Putar Slide Otomatis' : 'Jeda Slide'}
                  >
                    {isPaused ? <Play className="w-4 h-4 text-amber-300" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer"
                    aria-label="Geser Kiri"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 px-1">
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
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer"
                    aria-label="Geser Kanan"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Photos Smooth Horizontal Track (Geser halus ke samping satu-satu) */}
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
                      className="w-1/2 sm:w-1/4 shrink-0 px-1.5 sm:px-2"
                    >
                      <div className="h-full bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-2.5 sm:p-4 flex flex-col justify-between hover:bg-white/15 transition duration-300 shadow-lg">
                        <div className="space-y-2 sm:space-y-3">
                          <div className="aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden border border-emerald-400/40 shadow-md bg-slate-800 relative">
                            <img
                              src={slideItem.photo}
                              alt={slideItem.name}
                              className="w-full h-full object-cover transition duration-500 hover:scale-105"
                            />
                            <span
                              className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider shadow ${
                                slideItem.organization === 'IPNU'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-400 text-slate-950'
                              }`}
                            >
                              {slideItem.organization}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white tracking-tight line-clamp-1">
                              {slideItem.name}
                            </h4>
                            <p className="text-[10px] sm:text-xs font-semibold text-emerald-300 mt-0.5 line-clamp-1">
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

        {/* DATA PENGURUS HARIAN (Satu Baris Slide Halus ke Samping Satu-Satu) */}
        <div
          onMouseEnter={() => setIsOfficersPaused(true)}
          onMouseLeave={() => setIsOfficersPaused(false)}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Daftar Pengurus Harian PAC ({filteredOfficers.length} Kader)
              </h3>
              <p className="text-[11px] text-slate-500">
                Geser ke samping untuk melihat detail pengurus harian
              </p>
            </div>

            {filteredOfficers.length > 4 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsOfficersPaused(!isOfficersPaused)}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  title={isOfficersPaused ? 'Putar Otomatis' : 'Jeda'}
                >
                  {isOfficersPaused ? (
                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Pause className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOfficerOffset((prev) => (prev <= 0 ? maxOfficerOffset : prev - 1))
                  }
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setOfficerOffset((prev) => (prev >= maxOfficerOffset ? 0 : prev + 1))
                  }
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
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

                return (
                  <div
                    key={officer.id}
                    className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-1.5 sm:px-2"
                  >
                    <div
                      onClick={() => setSelectedOfficer(officer)}
                      className="h-full bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer border-t-4 border-t-emerald-600"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            {officer.avatar ? (
                              <img
                                src={officer.avatar}
                                alt={officer.fullName}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-emerald-500/20 group-hover:scale-105 transition"
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-700 font-bold text-base">
                                {officer.fullName.charAt(0)}
                              </div>
                            )}
                            <span
                              className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[8px] font-black uppercase border ${badgeColor}`}
                            >
                              {officer.organization}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider truncate">
                              {officer.position}
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">
                              {officer.fullName}
                            </h3>
                            {officer.nia && (
                              <div className="text-[9px] font-mono text-slate-400 truncate">
                                NIA: {officer.nia}
                              </div>
                            )}
                          </div>
                        </div>

                        {officer.description && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {officer.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="text-[10px] font-medium text-slate-400">
                          Pengurus Harian
                        </span>
                        <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700 group-hover:translate-x-0.5 transition">
                          <span>Detail</span>
                          <ChevronRight className="w-3 h-3" />
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
              {selectedOfficer.avatar ? (
                <img
                  src={selectedOfficer.avatar}
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

            {selectedOfficer.description && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Profil & Dedikasi:</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedOfficer.description}
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
