import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  Camera,
  Image as ImageIcon,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { activities, settings } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    title: string;
    date: string;
    organizer: string;
    category?: string;
  } | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Combine curated activity gallery with activity documentation photos
  const allPhotos: { url: string; title: string; date: string; organizer: string; category?: string }[] = [];

  // Curated activity gallery from settings
  if (settings.activityGallery && settings.activityGallery.length > 0) {
    settings.activityGallery.forEach((item) => {
      allPhotos.push({
        url: item.imageUrl,
        title: item.title,
        date: item.date || '2026',
        organizer: item.unitName,
        category: item.category || 'Dokumentasi',
      });
    });
  }

  // Photos from reported activities
  activities.forEach((act) => {
    if (act.photos && act.photos.length > 0) {
      act.photos.forEach((p) => {
        if (!allPhotos.some((ap) => ap.url === p)) {
          allPhotos.push({
            url: p,
            title: act.title,
            date: act.date,
            organizer: act.organizer,
            category: act.category,
          });
        }
      });
    }
  });

  // Auto Slideshow Interval
  useEffect(() => {
    if (isPaused || allPhotos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPaused, allPhotos.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
  };

  // Visible items window (displaying 4 items per row on desktop, 2 on tablet, 1 on mobile)
  const visiblePhotos = [];
  const total = allPhotos.length;
  if (total > 0) {
    for (let i = 0; i < Math.min(total, 5); i++) {
      const idx = (currentIndex + i) % total;
      visiblePhotos.push({ ...allPhotos[idx], originalIndex: idx });
    }
  }

  return (
    <section id="galeri" className="py-20 bg-slate-50 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Dokumentasi Visual 1 Baris • Slideshow Otomatis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Galeri Kegiatan Pelajar NU Dukun
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Sorotan potret kebersamaan, semangat belajar, perjuangan, dan khidmat para kader santri di berbagai penjuru ranting dan madrasah se-Kecamatan Dukun.
            </p>
          </div>

          {/* Slideshow Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition cursor-pointer"
              title={isPaused ? 'Lanjutkan Putar Otomatis' : 'Jeda Slideshow'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition cursor-pointer"
              title="Foto Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition cursor-pointer"
              title="Foto Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SINGLE ROW SLIDESHOW CONTAINER (COMPACT 4 SLIDES) */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-2xl p-2.5 sm:p-3.5 bg-white border border-slate-200/80 shadow-xs"
        >
          {allPhotos.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {visiblePhotos.slice(0, 4).map((item, idx) => (
                <div
                  key={`${item.originalIndex}-${idx}`}
                  onClick={() => setSelectedPhoto(item)}
                  className="group relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2.5 text-white">
                    {item.category && (
                      <span className="self-start px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-600/90 text-white mb-0.5 shadow-xs">
                        {item.category}
                      </span>
                    )}
                    <div className="text-[11px] font-bold line-clamp-1">{item.title}</div>
                    <div className="text-[9px] text-emerald-300 mt-0.5 line-clamp-1">{item.organizer}</div>
                    <div className="mt-1 flex items-center gap-1 text-[9px] text-white/90">
                      <ZoomIn className="w-3 h-3 text-emerald-400" />
                      <span>Perbesar foto</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada foto kegiatan di galeri.
            </div>
          )}

          {/* Dots Indicator */}
          {allPhotos.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-4 pb-2">
              {allPhotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-emerald-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Pindah ke foto ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto.title}
          subtitle={`${selectedPhoto.organizer} • ${selectedPhoto.date}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-emerald-700">{selectedPhoto.organizer}</span>
                <span>•</span>
                <span>{selectedPhoto.date}</span>
                {selectedPhoto.category && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                      {selectedPhoto.category}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
