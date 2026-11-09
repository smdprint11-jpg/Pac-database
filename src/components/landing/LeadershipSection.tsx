import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  User,
  Phone,
  Mail,
  Award,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Users,
  Sparkles,
  Quote,
} from 'lucide-react';
import { Officer, PacOfficerSlide } from '../../types';

export const LeadershipSection: React.FC = () => {
  const { officers, settings } = useApp();
  const [filterOrg, setFilterOrg] = useState<'ALL' | 'IPNU' | 'IPPNU'>('ALL');
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  // Slider Bar Foto Pengurus PAC State
  const pacSlides: PacOfficerSlide[] = settings.pacOfficersSlider && settings.pacOfficersSlider.length > 0
    ? settings.pacOfficersSlider
    : [
        {
          id: 'pos-1',
          name: 'M. Ainun Najib, S.Pd',
          position: 'Ketua Mandisioner PAC IPNU Dukun',
          organization: 'IPNU',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          quote: 'Kader santri masa depan adalah mereka yang kokoh dalam Aswaja dan tangkas dalam peradaban digital.',
        },
        {
          id: 'pos-2',
          name: 'Fatimatus Zahro, S.Ag',
          position: 'Ketua Mandisioner PAC IPPNU Dukun',
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
      ];

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic slideshow for PAC Leadership Carousel
  useEffect(() => {
    if (isPaused || pacSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % pacSlides.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [isPaused, pacSlides.length]);

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % pacSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + pacSlides.length) % pacSlides.length);
  };

  // Filter PAC-level officers
  const pacOfficers = officers
    .filter((o) => !o.unitId)
    .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

  const filteredOfficers = pacOfficers.filter((o) => {
    if (filterOrg === 'ALL') return true;
    return o.organization === filterOrg;
  });

  return (
    <section id="pengurus" className="py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Struktur Kepemimpinan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pimpinan Harian PAC IPNU IPPNU DUKUN
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Masa Khidmat {settings.period || '2024 - 2026'}. Berikhtiar mengayomi dan menggerakkan pelajar Nahdliyin dengan kepemimpinan yang amanah, cerdas, dan transformatif.
            </p>
          </div>

          {/* Org Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setFilterOrg('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({pacOfficers.length})
            </button>
            <button
              onClick={() => setFilterOrg('IPNU')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'IPNU'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IPNU ({pacOfficers.filter((o) => o.organization === 'IPNU').length})
            </button>
            <button
              onClick={() => setFilterOrg('IPPNU')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterOrg === 'IPPNU'
                  ? 'bg-green-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IPPNU ({pacOfficers.filter((o) => o.organization === 'IPPNU').length})
            </button>
          </div>
        </div>

        {/* SLIDER BAR FOTO PENGURUS PAC (Interactive Carousel with Auto-Slideshow) */}
        {pacSlides.length > 0 && (
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
          >
            {/* Background Decorative Rings */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
              {/* Photo Card in Slider */}
              <div className="w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-emerald-400/40 shadow-2xl shrink-0 bg-slate-800">
                <img
                  src={pacSlides[activeSlideIndex].photo}
                  alt={pacSlides[activeSlideIndex].name}
                  className="w-full h-full object-cover transition duration-500"
                />
              </div>

              {/* Slider Content */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 border border-emerald-400/30 text-[11px] font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sorotan Kepemimpinan PAC • Slide {activeSlideIndex + 1} dari {pacSlides.length}</span>
                </div>

                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider mb-2 ${
                      pacSlides[activeSlideIndex].organization === 'IPNU'
                        ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                        : 'bg-green-500/30 text-green-200 border border-green-400/40'
                    }`}
                  >
                    {pacSlides[activeSlideIndex].organization}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {pacSlides[activeSlideIndex].name}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-emerald-300 mt-1">
                    {pacSlides[activeSlideIndex].position}
                  </p>
                </div>

                {pacSlides[activeSlideIndex].quote && (
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs sm:text-sm text-slate-100 italic leading-relaxed relative max-w-2xl">
                    <Quote className="w-4 h-4 text-emerald-300 inline mr-2 -mt-1 opacity-70" />
                    "{pacSlides[activeSlideIndex].quote}"
                  </div>
                )}

                {/* Slider Controls */}
                <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer"
                    aria-label="Slide sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-1.5 px-2">
                    {pacSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          idx === activeSlideIndex ? 'w-7 bg-amber-400' : 'w-2 bg-white/40'
                        }`}
                        aria-label={`Pindah ke slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition cursor-pointer"
                    aria-label="Slide berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Officers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOfficers.map((officer) => {
            const isIpnu = officer.organization === 'IPNU';
            const badgeColor = isIpnu
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : 'bg-green-100 text-green-800 border-green-200';

            return (
              <div
                key={officer.id}
                onClick={() => setSelectedOfficer(officer)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer border-t-4 border-t-emerald-600"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {officer.avatar ? (
                        <img
                          src={officer.avatar}
                          alt={officer.fullName}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-xs group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-700 font-bold text-xl group-hover:scale-105 transition">
                          {officer.fullName.charAt(0)}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${badgeColor}`}
                      >
                        {officer.organization}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                        {officer.position}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                        {officer.fullName}
                      </h3>
                      {officer.nia && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          NIA: {officer.nia}
                        </div>
                      )}
                    </div>
                  </div>

                  {officer.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {officer.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-slate-400">
                    Badan Pengurus Harian
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 group-hover:translate-x-1 transition">
                    <span>Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Officer Detail Modal */}
      {selectedOfficer && (
        <Modal
          isOpen={!!selectedOfficer}
          onClose={() => setSelectedOfficer(null)}
          title="Profil Pengurus Harian PAC"
          subtitle={`Masa Khidmat ${settings.period || '2024 - 2026'}`}
          maxWidth="md"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              {selectedOfficer.avatar ? (
                <img
                  src={selectedOfficer.avatar}
                  alt={selectedOfficer.fullName}
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-emerald-600 shadow-md shrink-0"
                />
              ) : (
                <div className="w-18 h-18 rounded-2xl bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
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
