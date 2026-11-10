import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Activity } from '../../types';
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sparkles,
  Play,
  Pause,
} from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { activities, settings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<Activity | null>(null);
  const [slideOffset, setSlideOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Only published articles on public landing page
  const published = activities.filter(
    (a) => a.publicationStatus === 'Dipublikasikan' || a.publicationStatus === 'PUBLISHED'
  );

  const filtered = published.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.category === selectedCategory;
  });

  const categories = [
    'ALL',
    'Kaderisasi',
    'Organisasi',
    'Sosial',
    'Kegiatan PAC',
    'Kegiatan PK',
  ];

  // Single-row smooth slideshow (3 cards visible on desktop, sliding 1 by 1)
  const maxOffset = Math.max(0, filtered.length - 3);

  useEffect(() => {
    setSlideOffset(0);
  }, [selectedCategory]);

  useEffect(() => {
    if (isPaused || maxOffset <= 0) return;
    const timer = setInterval(() => {
      setSlideOffset((prev) => (prev >= maxOffset ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, maxOffset]);

  return (
    <section
      id="kegiatan"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-4 sm:py-14 bg-white border-b border-slate-200/60"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-3.5 sm:mb-7 gap-2 sm:gap-3">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Kabar Pelajar NU • Satu Baris Slideshow</span>
            </div>
            <h2 className="text-lg sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {settings.sectionTitles?.kegiatanTitle || 'Berita & Dokumentasi Kegiatan'}
            </h2>
            <p className="mt-0.5 sm:mt-1 text-slate-600 text-[11px] sm:text-sm line-clamp-2 sm:line-clamp-none">
              {settings.sectionTitles?.kegiatanSubtitle ||
                'Rekam jejak perkhidmatan, dinamika kaderisasi, dan ragam kegiatan positif pelajar Nahdlatul Ulama se-Kecamatan Dukun.'}
            </p>
          </div>

          {/* Categories Tab & Slider Controls */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-start md:self-auto">
            <div className="flex flex-wrap items-center gap-1 p-0.5 sm:p-1 bg-slate-100 rounded-xl border border-slate-200">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 sm:px-2.5 rounded-lg text-[10px] sm:text-[11px] font-semibold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua' : cat}
                </button>
              ))}
            </div>

            {filtered.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1 sm:p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  title={isPaused ? 'Putar Slideshow' : 'Jeda Slideshow'}
                >
                  {isPaused ? (
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                  ) : (
                    <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSlideOffset((prev) => (prev <= 0 ? maxOffset : prev - 1))}
                  className="p-1 sm:p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  aria-label="Berita sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSlideOffset((prev) => (prev >= maxOffset ? 0 : prev + 1))}
                  className="p-1 sm:p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  aria-label="Berita berikutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SINGLE-ROW SMOOTH SLIDESHOW (Satu Baris Saja, 2 Kartu di Seluler & 3 di Desktop) */}
        {filtered.length > 0 ? (
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${slideOffset * (100 / Math.min(3, Math.max(1, filtered.length)))}%)`,
              }}
            >
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="w-1/2 sm:w-1/2 lg:w-1/3 shrink-0 px-1 sm:px-2.5"
                >
                  <article
                    onClick={() => setActiveArticle(item)}
                    className="h-full bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 hover:border-emerald-300 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-slate-100">
                        <img
                          src={item.coverImage || item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex gap-1">
                          <span className="px-1.5 py-0.5 sm:px-2 rounded-md text-[8px] sm:text-[9px] font-bold uppercase bg-emerald-600 text-white shadow">
                            {item.category}
                          </span>
                          {item.isFeatured && (
                            <span className="hidden sm:flex px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500 text-white shadow items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              Unggulan
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-2.5 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[11px] text-slate-500 mb-1 sm:mb-2">
                          <div className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                            <span>{item.date}</span>
                          </div>
                          <div className="hidden sm:flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        </div>

                        <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug mb-1 sm:mb-1.5 line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="hidden sm:block text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-2.5 sm:px-4 pb-2 sm:pb-3 pt-1.5 sm:pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px]">
                      <span className="font-semibold text-emerald-800 truncate max-w-[95px] sm:max-w-[160px]">
                        {item.organizer}
                      </span>
                      <span className="text-emerald-600 font-bold group-hover:translate-x-0.5 transition flex items-center gap-0.5 shrink-0">
                        <span>Baca</span>
                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            {maxOffset > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-4">
                {Array.from({ length: maxOffset + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlideOffset(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === slideOffset ? 'w-5 sm:w-6 bg-emerald-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide berita ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200">
            <BookOpen className="w-7 h-7 text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-700">Belum ada berita pada kategori ini</p>
          </div>
        )}
      </div>

      {/* Reader Modal */}
      {activeArticle && (
        <Modal
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
          subtitle={`${activeArticle.organizer} • ${activeArticle.date}`}
          maxWidth="4xl"
        >
          <div className="space-y-5">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              <img
                src={activeArticle.coverImage || activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>
                  Tanggal: <strong>{activeArticle.date}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>
                  Lokasi: <strong>{activeArticle.location}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>
                  Kategori: <strong>{activeArticle.category}</strong>
                </span>
              </div>
              {activeArticle.participantCount && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>
                    Peserta: <strong>{activeArticle.participantCount} Orang</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {activeArticle.description}
            </div>

            {activeArticle.photos && activeArticle.photos.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Galeri Foto Dokumentasi Kegiatan:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeArticle.photos.map((photo, i) => (
                    <div
                      key={i}
                      className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      <img
                        src={photo}
                        alt={`Dokumentasi ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveArticle(null)}
              className="w-full py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Tutup Berita
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};
