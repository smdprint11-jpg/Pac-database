import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Sparkles, Database } from 'lucide-react';

interface HeroCarouselProps {
  onOpenLogin: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onOpenLogin }) => {
  const { slides, settings } = useApp();
  const activeSlides = slides
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
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
  const cta = settings.heroCtaConfig || {};

  const formattedPeriod = settings.period
    ? settings.period.toLowerCase().includes('masa khidmat')
      ? settings.period
      : `Masa Khidmat ${settings.period}`
    : 'Masa Khidmat 2024 – 2026';

  const badgeLabel =
    cta.badgeText ||
    `${settings.organizationName || 'PAC IPNU IPPNU DUKUN'} • ${formattedPeriod}`;

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <section
      id="beranda"
      className="relative pt-20 pb-10 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-900 text-white"
    >
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

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Organization badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] sm:text-sm font-semibold backdrop-blur-md mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{badgeLabel}</span>
          </div>

          {/* Big Titles - Centered & Larger */}
          <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] text-white mb-4 sm:mb-6 text-center">
            <span className="block text-emerald-400 font-serif tracking-normal mb-1.5 sm:mb-2 text-base sm:text-2xl md:text-3xl font-semibold">
              {slide.tagline || slide.subtitle}
            </span>
            {slide.title}
          </h1>

          <p className="text-xs sm:text-lg md:text-xl text-slate-300 leading-relaxed mb-5 sm:mb-8 max-w-2xl mx-auto text-center font-normal">
            {slide.description}
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <a
              href={cta.primaryBtnLink || slide.buttonLink || '#profil'}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 hover:shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>{cta.primaryBtnText || slide.buttonText || 'Kenali Organisasi'}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>

            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>{cta.secondaryBtnText || settings.navMenuLabels?.loginBtn || 'Login Pengurus'}</span>
            </button>

            <a
              href={cta.tertiaryBtnLink || '#ranting-pk'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-3.5 rounded-xl text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition"
            >
              <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>{cta.tertiaryBtnText || 'Akses Database Ranting'}</span>
            </a>
          </div>

          {/* Quick micro highlights */}
          <div className="mt-7 pt-5 sm:mt-12 sm:pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-10 text-[11px] sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{cta.highlight1 || '18 Ranting Desa Terdata'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400" />
              <span>{cta.highlight2 || '6 Komisariat Lembaga'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{cta.highlight3 || 'Pengesahan Dokumen SP Terintegrasi'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-8 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <div className="flex gap-1">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                  i === currentIdx ? 'w-5 sm:w-6 bg-emerald-400' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Pindah ke slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Slide berikutnya"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
