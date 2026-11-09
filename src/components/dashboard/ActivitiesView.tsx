import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { Activity, ActivityCategory } from '../../types';
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Users,
  Eye,
  ShieldCheck,
  Tag,
  Upload,
  Camera,
  Image as ImageIcon,
  Type,
  AlignLeft,
  X,
  Lock,
} from 'lucide-react';

export const ActivitiesView: React.FC = () => {
  const {
    activities,
    settings,
    currentUser,
    addActivity,
    updateActivity,
    deleteActivity,
    moderateActivity,
    showToast,
  } = useApp();

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_pac';
  const isBranchUser = currentUser?.role === 'user_ranting' || currentUser?.role === 'user_pk';
  const targetUnitId = currentUser?.targetUnitId;
  const targetUnitName = currentUser?.targetUnitName;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | ActivityCategory>('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docPhotosInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Kaderisasi' as ActivityCategory,
    organizer: isBranchUser && targetUnitName ? targetUnitName : 'PAC IPNU IPPNU DUKUN',
    unitId: isBranchUser && targetUnitId ? targetUnitId : '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    summary: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    photos: [] as string[],
    fontFamily: 'font-sans',
    paragraphStyle: 'normal',
    publicationStatus: (isAdmin ? 'PUBLISHED' : 'PENDING_MODERATION') as Activity['publicationStatus'],
    isFeatured: false,
  });

  // Strict scoping: branch users ONLY see their own unit's activities
  const availableActivities = isBranchUser && (targetUnitId || targetUnitName)
    ? activities.filter(
        (a) => (targetUnitId && a.unitId === targetUnitId) || (targetUnitName && a.organizer === targetUnitName)
      )
    : activities;

  const filtered = availableActivities.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.publicationStatus === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle cover image upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('Ukuran foto terlalu besar, maksimal 3 MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        showToast('Foto sampul kegiatan berhasil diunggah', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle documentation photos upload (multiple)
  const handleDocPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, reader.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
      showToast(`${files.length} foto dokumentasi berhasil ditambahkan`, 'success');
    }
  };

  const handleOpenAdd = () => {
    setSelectedActivity(null);
    setFormData({
      title: '',
      category: 'Kaderisasi',
      organizer: isBranchUser && targetUnitName ? targetUnitName : 'PAC IPNU IPPNU DUKUN',
      unitId: isBranchUser && targetUnitId ? targetUnitId : '',
      date: new Date().toISOString().split('T')[0],
      location: 'Dukun, Gresik',
      summary: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      photos: [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      ],
      fontFamily: 'font-sans',
      paragraphStyle: 'normal',
      publicationStatus: isAdmin ? 'PUBLISHED' : 'PENDING_MODERATION',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (act: Activity) => {
    // Only allow editing if Admin or own branch
    if (isBranchUser && act.unitId !== targetUnitId && act.organizer !== targetUnitName) {
      showToast('Anda hanya memiliki hak mengedit laporan kegiatan pangkalan sendiri', 'error');
      return;
    }
    setSelectedActivity(act);
    setFormData({
      title: act.title,
      category: act.category,
      organizer: act.organizer,
      unitId: act.unitId || '',
      date: act.date,
      location: act.location,
      summary: act.summary || '',
      content: act.content || act.summary || '',
      imageUrl: act.imageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      photos: act.photos || [],
      fontFamily: act.fontFamily || 'font-sans',
      paragraphStyle: act.paragraphStyle || 'normal',
      publicationStatus: act.publicationStatus,
      isFeatured: !!act.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUnitId = isBranchUser && targetUnitId ? targetUnitId : formData.unitId;
    const finalOrganizer = isBranchUser && targetUnitName ? targetUnitName : formData.organizer;

    if (selectedActivity) {
      updateActivity(selectedActivity.id, {
        title: formData.title,
        category: formData.category,
        organizer: finalOrganizer,
        unitId: finalUnitId,
        date: formData.date,
        location: formData.location,
        summary: formData.summary || formData.content.slice(0, 160),
        content: formData.content,
        imageUrl: formData.imageUrl,
        photos: formData.photos,
        fontFamily: formData.fontFamily,
        paragraphStyle: formData.paragraphStyle,
        isFeatured: formData.isFeatured,
      });
      showToast('Laporan kegiatan berhasil diperbarui', 'success');
    } else {
      addActivity({
        title: formData.title,
        category: formData.category,
        organizer: finalOrganizer,
        unitId: finalUnitId,
        date: formData.date,
        location: formData.location,
        summary: formData.summary || formData.content.slice(0, 160),
        content: formData.content,
        imageUrl: formData.imageUrl,
        photos: formData.photos,
        fontFamily: formData.fontFamily,
        paragraphStyle: formData.paragraphStyle,
        publicationStatus: formData.publicationStatus,
        isFeatured: formData.isFeatured,
      });
      showToast('Kegiatan baru berhasil dicatat', 'success');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Manajemen Berita & Laporan Kegiatan
            </h2>
            {isBranchUser && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>Kegiatan {targetUnitName || 'Pangkalan Anda'}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBranchUser
              ? `Penginputan dan pelaporan kegiatan mandiri khusus ${targetUnitName}`
              : 'Publikasi artikel kaderisasi, kegiatan ranting, dan agenda dakwah pelajar NU se-Kecamatan'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Input Kegiatan Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul berita, penyelenggara, atau lokasi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as any)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden"
        >
          <option value="ALL">Semua Kategori</option>
          <option value="Kaderisasi">Kaderisasi</option>
          <option value="Organisasi">Organisasi</option>
          <option value="Keagamaan">Keagamaan</option>
          <option value="Sosial">Sosial</option>
          <option value="Kegiatan PAC">Kegiatan PAC</option>
          <option value="Kegiatan Ranting">Kegiatan Ranting</option>
          <option value="Kegiatan PK">Kegiatan PK</option>
        </select>

        <span className="text-xs font-semibold text-slate-500 ml-auto">
          Total: <strong>{filtered.length}</strong> Agenda
        </span>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Belum ada kegiatan yang cocok dengan kriteria pencarian.
          </div>
        ) : (
          filtered.map((act) => {
            const canEdit = !isBranchUser || act.unitId === targetUnitId || act.organizer === targetUnitName;
            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-emerald-800 shadow-xs backdrop-blur-xs">
                      {act.category}
                    </span>
                    {act.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Unggulan</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{act.date}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="line-clamp-1">{act.location}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {act.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {act.summary || act.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-700 line-clamp-1">
                      {act.organizer}
                    </span>

                    {canEdit && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(act)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Edit Kegiatan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(act.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Activity Modal with Font, Paragraph & Gallery Selection */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedActivity ? 'Edit Berita & Laporan Kegiatan' : 'Input Kegiatan Baru'}
        subtitle="Lengkapi informasi, pilih gaya teks, dan unggah foto dokumentasi"
        maxWidth="4xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Kegiatan / Berita *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Masa Kesetiaan Anggota (MAKESTA) PR Dukun"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Kaderisasi">Kaderisasi</option>
                <option value="Organisasi">Organisasi</option>
                <option value="Keagamaan">Keagamaan</option>
                <option value="Sosial">Sosial</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Pelatihan">Pelatihan</option>
                <option value="Kegiatan Ranting">Kegiatan Ranting</option>
                <option value="Kegiatan PK">Kegiatan PK</option>
                <option value="Kegiatan PAC">Kegiatan PAC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Penyelenggara *</label>
              <input
                type="text"
                required
                disabled={isBranchUser}
                value={isBranchUser && targetUnitName ? targetUnitName : formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Pelaksanaan *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Kegiatan *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Aula / Lapangan / Komplek Madrasah"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Typography & Paragraph Formatting Toolbar */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Type className="w-4 h-4 text-emerald-600" />
                Format Tipografi & Paragraf Konten
              </span>
              <span className="text-[11px] font-normal text-slate-500">Kustomisasi tampilan narasi berita</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pilihan Font Tulisan:
                </label>
                <select
                  value={formData.fontFamily}
                  onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="font-sans">Plus Jakarta Sans (Modern Default)</option>
                  <option value="font-serif">Amiri / Merriweather (Nuansa Klasik Islami)</option>
                  <option value="font-mono">Monospace (Gaya Arsip Resmi)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Gaya Format Paragraf:
                </label>
                <select
                  value={formData.paragraphStyle}
                  onChange={(e) => setFormData({ ...formData, paragraphStyle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="normal">Paragraf Standar (Rata Kiri)</option>
                  <option value="lead">Lead Paragraf (Teks Pembuka Menonjol)</option>
                  <option value="quote">Kutipan / Blockquote Berbingkai Hijau</option>
                  <option value="numbered">Format Poin / Risalah Terstruktur</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cover Photo Upload & Select from Gallery */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Foto Sampul Utama (Cover Image)
              </label>
              <button
                type="button"
                onClick={() => setIsGalleryPickerOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-100 transition cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pilih dari Galeri Kegiatan ({settings.activityGallery?.length || 0})</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Cover"
                  className="w-20 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                />
              )}
              <div className="flex-1 space-y-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Foto dari Komputer/HP</span>
                </button>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Atau tempel URL gambar..."
                  className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Multi-photo Documentation Upload Form */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Dokumentasi Foto Tambahan Kegiatan (Galeri Dokumentasi)
              </label>
              <input
                type="file"
                ref={docPhotosInputRef}
                accept="image/*"
                multiple
                onChange={handleDocPhotosUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => docPhotosInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Tambah Foto Dokumentasi</span>
              </button>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                {formData.photos.map((p, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-300 bg-slate-100">
                    <img src={p} alt="Doc" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          photos: prev.photos.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                      title="Hapus foto"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ringkasan Singkat (Lead Berita)
            </label>
            <input
              type="text"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="1-2 kalimat pengantar kegiatan..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Isi Lengkap Laporan / Artikel Berita *
            </label>
            <textarea
              rows={5}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Tuliskan jalannya kegiatan, susunan materi, nama pemateri, dan poin penting hasil kegiatan..."
              className={`w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 resize-none ${formData.fontFamily}`}
            />
          </div>

          {isAdmin && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Tampilkan sebagai Berita Unggulan di Halaman Utama:</span>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 rounded-sm cursor-pointer"
              />
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {selectedActivity ? 'Simpan Perubahan' : 'Terbitkan Kegiatan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Select Photo From Consolidated Activity Gallery Modal */}
      <Modal
        isOpen={isGalleryPickerOpen}
        onClose={() => setIsGalleryPickerOpen(false)}
        title="Pilih Foto dari Galeri Kegiatan Terkumpul"
        subtitle="Pilih salah satu dokumentasi untuk dijadikan sampul kegiatan"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {(settings.activityGallery || []).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, imageUrl: item.imageUrl }));
                  setIsGalleryPickerOpen(false);
                  showToast(`Foto '${item.title}' dipilih sebagai sampul`, 'success');
                }}
                className="group relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 hover:border-emerald-500 cursor-pointer shadow-xs transition"
              >
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2 text-white text-[10px]">
                  <span className="font-bold line-clamp-1">{item.title}</span>
                  <span className="text-emerald-300">{item.unitName}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsGalleryPickerOpen(false)}
              className="px-4 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteActivity(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Hapus Laporan Kegiatan"
        message="Apakah Anda yakin ingin menghapus laporan berita dan dokumentasi ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Sekarang"
        type="danger"
      />
    </div>
  );
};
