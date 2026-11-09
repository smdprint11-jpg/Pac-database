import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Activity } from '../../types';
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  ChevronRight,
  BookOpen,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { activities } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<Activity | null>(null);

  // Only published articles on public landing page
  const published = activities.filter((a) => a.publicationStatus === 'Dipublikasikan');

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

  return (
    <section id="kegiatan" className="py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kabar Pelajar NU</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Berita & Dokumentasi Kegiatan
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Rekam jejak perkhidmatan, dinamika kaderisasi, dan ragam kegiatan positif pelajar Nahdlatul Ulama se-Kecamatan Dukun.
            </p>
          </div>

          {/* Categories Tab */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'Semua Berita' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <article
              key={item.id}
              onClick={() => setActiveArticle(item)}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-emerald-600 text-white shadow-md">
                      {item.category}
                    </span>
                    {item.isFeatured && (
                      <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-white shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Unggulan
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta items */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800">
                  {item.organizer}
                </span>
                <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  Baca Selengkapnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Belum ada berita pada kategori ini</p>
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
          <div className="space-y-6">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md">
              <img
                src={activeArticle.coverImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Tanggal: <strong>{activeArticle.date}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Lokasi: <strong>{activeArticle.location}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Kategori: <strong>{activeArticle.category}</strong></span>
              </div>
              {activeArticle.participantCount && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Peserta: <strong>{activeArticle.participantCount} Orang</strong></span>
                </div>
              )}
            </div>

            <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {activeArticle.description}
            </div>

            {/* Photo Gallery inside article */}
            {activeArticle.photos && activeArticle.photos.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Galeri Foto Dokumentasi Kegiatan:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeArticle.photos.map((photo, i) => (
                    <div key={i} className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={photo} alt={`Dokumentasi ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveArticle(null)}
              className="w-full py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100 transition"
            >
              Tutup Berita
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};
