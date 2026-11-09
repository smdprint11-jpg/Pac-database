import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Camera, Image as ImageIcon, ZoomIn, Calendar, MapPin, Tag } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { activities, settings } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    title: string;
    date: string;
    organizer: string;
    category?: string;
  } | null>(null);

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
        // avoid exact duplicate URLs
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

  return (
    <section id="galeri" className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Dokumentasi Visual</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Galeri Kegiatan Pelajar NU Dukun
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Sorotan potret kebersamaan, semangat belajar, perjuangan, dan khidmat para kader santri di berbagai penjuru ranting dan madrasah se-Kecamatan Dukun.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {allPhotos.slice(0, 12).map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(item)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                {item.category && (
                  <span className="self-start px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-600/90 text-white mb-1">
                    {item.category}
                  </span>
                )}
                <div className="text-xs font-bold line-clamp-1">{item.title}</div>
                <div className="text-[10px] text-emerald-300 mt-0.5 line-clamp-1">{item.organizer}</div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-white/80">
                  <ZoomIn className="w-3 h-3 text-emerald-400" />
                  <span>Perbesar Foto</span>
                </div>
              </div>
            </div>
          ))}
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
