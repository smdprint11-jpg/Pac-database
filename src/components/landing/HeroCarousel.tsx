import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles, Building, Database } from 'lucide-react';

interface HeroCarouselProps {
  onOpenLogin: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onOpenLogin }) => {
  const { slides, settings } = useApp();
  const activeSlides = slides.filter((s) => s.isActive !== false).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) {
    return null;
  }

  const slide = activeSlides[currentIdx] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <section id="beranda" className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-900 text-white">
      {/* Background slide images with crossfade */}
      <div className="absolute inset-0 z-0">
        {activeSlides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIdx ? 'opacity-35 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{
              backgroundImage: `url(${s.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: idx === currentIdx ? 'scale(1)' : 'scale(1.05)',
              transition: 'transform 7s ease, opacity 1s ease',
            }}
          />
        ))}
        {/* Islamic gradient and vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-emerald-950/85 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Organization badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{settings.organizationName || 'PAC IPNU IPPNU DUKUN'} • {settings.period || 'Masa Khidmat 2024 – 2026'}</span>
          </div>

          {/* Big Titles - Centered & Larger */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] sm:leading-[1.1] text-white mb-6 text-center">
            <span className="block text-emerald-400 font-serif tracking-normal mb-2 text-xl sm:text-2xl md:text-3xl font-semibold">
              {slide.tagline}
            </span>
            {slide.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto text-center font-normal">
            {slide.description}
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <a
              href="#profil"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 hover:shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>Kenali Organisasi</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Login Pengurus</span>
            </button>

            <a
              href="#ranting-pk"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-medium text-sm transition"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Akses Database Ranting</span>
            </a>
          </div>

          {/* Quick micro highlights */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>18 Ranting Desa Terdata</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>6 Komisariat Lembaga</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Pengesahan Dokumen SP Terintegrasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Indicators */}
      {activeSlides.length > 1 && (
        <>
          <div className="absolute bottom-6 right-4 sm:right-8 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIdx ? 'w-6 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Pindah ke slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
              aria-label="Slide berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
};
