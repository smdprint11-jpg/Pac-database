import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { HeroSlide, WebsiteSettings, FooterNavLink, PacOfficerSlide, ActivityGalleryItem } from '../../types';
import {
  Settings,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Globe,
  Share2,
  MapPin,
  Compass,
  Sliders,
  CheckCircle2,
  Users,
  Footprints,
  Camera,
  Upload,
  X,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const WebsiteSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    slides,
    addSlide,
    updateSlide,
    deleteSlide,
    resetDatabase,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'content' | 'logo' | 'slides' | 'pac_slider' | 'footer' | 'gallery' | 'social' | 'danger'
  >('content');

  // Logo & Branding Navigasi Form
  const [logoForm, setLogoForm] = useState({
    navbarLogoUrl: settings.navbarLogoUrl || '',
    navbarBrandTitle: settings.navbarBrandTitle || settings.siteName || 'PELAJAR NU DUKUN',
    navbarBrandSubtitle: settings.navbarBrandSubtitle || settings.organization || 'PAC IPNU IPPNU DUKUN',
  });
  const navLogoInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [contentForm, setContentForm] = useState({
    siteName: settings.siteName || settings.siteTitle || 'PELAJAR NU DUKUN',
    organization: settings.organization || settings.organizationName || 'PAC IPNU IPPNU DUKUN',
    tagline: settings.tagline || '',
    historyText: settings.historyText || settings.history || '',
    workArea: settings.workArea || '',
    vision: settings.vision || '',
    missions: [...settings.missions],
  });

  // Footer & Nav Form
  const [footerForm, setFooterForm] = useState({
    footerText: settings.footerDescription || settings.footerText || '',
    footerAddress: settings.footerAddress || settings.address || '',
    footerEmail: settings.footerEmail || settings.email || '',
    footerPhone: settings.footerPhone || settings.phone || '',
    footerCopyright: settings.footerCopyright || '© 2026 PAC IPNU IPPNU DUKUN. Hak Cipta Dilindungi.',
    footerNavLinks: [...(settings.footerNavLinks || [])],
  });

  // Social Links Form
  const [socialForm, setSocialForm] = useState({
    instagram: settings.socialLinks?.instagram || settings.instagram || '',
    facebook: settings.socialLinks?.facebook || settings.facebook || '',
    tiktok: settings.socialLinks?.tiktok || settings.tiktok || '',
    youtube: settings.socialLinks?.youtube || settings.youtube || '',
    whatsapp: settings.socialLinks?.whatsapp || settings.whatsapp || '',
  });

  // Slider Bar Foto Pengurus PAC State
  const [pacSliderList, setPacSliderList] = useState<PacOfficerSlide[]>([
    ...(settings.pacOfficersSlider || []),
  ]);
  const [isPacSlideModalOpen, setIsPacSlideModalOpen] = useState(false);
  const [selectedPacSlide, setSelectedPacSlide] = useState<PacOfficerSlide | null>(null);
  const [pacSlideForm, setPacSlideForm] = useState({
    name: '',
    position: '',
    organization: 'IPNU' as 'IPNU' | 'IPPNU',
    photo: '',
    quote: '',
  });

  // Galeri Kegiatan yang Terkumpul State
  const [galleryList, setGalleryList] = useState<ActivityGalleryItem[]>([
    ...(settings.activityGallery || []),
  ]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<ActivityGalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    imageUrl: '',
    unitName: 'PAC IPNU IPPNU DUKUN',
    category: 'Kaderisasi',
    date: new Date().toISOString().split('T')[0],
    isFeatured: true,
  });

  // Slide modal (Hero Slider)
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [slideForm, setSlideForm] = useState({
    title: '',
    tagline: '',
    description: '',
    imageUrl: '',
    buttonText: 'Pelajari Selengkapnya',
    buttonLink: '#profil',
  });

  // New Nav Link State
  const [newNavLink, setNewNavLink] = useState({ label: '', url: '' });

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const pacPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryPhotoInputRef = useRef<HTMLInputElement>(null);
  const heroSlidePhotoInputRef = useRef<HTMLInputElement>(null);

  // Handlers for Content
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteName: contentForm.siteName,
      siteTitle: contentForm.siteName,
      organization: contentForm.organization,
      organizationName: contentForm.organization,
      tagline: contentForm.tagline,
      historyText: contentForm.historyText,
      history: contentForm.historyText,
      workArea: contentForm.workArea,
      vision: contentForm.vision,
      missions: contentForm.missions,
    });
    showToast('Konten utama website berhasil disimpan', 'success');
  };

  const handleAddMission = () => {
    setContentForm((prev) => ({
      ...prev,
      missions: [...prev.missions, 'Program kerja prioritas baru'],
    }));
  };

  const handleRemoveMission = (idx: number) => {
    setContentForm((prev) => ({
      ...prev,
      missions: prev.missions.filter((_, i) => i !== idx),
    }));
  };

  // Handlers for Footer & Navigasi Catatan Kaki
  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      footerDescription: footerForm.footerText,
      footerText: footerForm.footerText,
      footerAddress: footerForm.footerAddress,
      footerEmail: footerForm.footerEmail,
      footerPhone: footerForm.footerPhone,
      footerCopyright: footerForm.footerCopyright,
      footerNavLinks: footerForm.footerNavLinks,
    });
    showToast('Pengaturan footer & navigasi catatan kaki berhasil diperbarui', 'success');
  };

  const handleAddFooterNavLink = () => {
    if (!newNavLink.label || !newNavLink.url) {
      showToast('Masukkan label dan tautan link navigasi', 'error');
      return;
    }
    const item: FooterNavLink = {
      id: 'fn-' + Date.now(),
      label: newNavLink.label,
      url: newNavLink.url,
    };
    setFooterForm((prev) => ({
      ...prev,
      footerNavLinks: [...prev.footerNavLinks, item],
    }));
    setNewNavLink({ label: '', url: '' });
  };

  const handleRemoveFooterNavLink = (id: string) => {
    setFooterForm((prev) => ({
      ...prev,
      footerNavLinks: prev.footerNavLinks.filter((l) => l.id !== id),
    }));
  };

  // Handlers for Slider Bar Foto Pengurus PAC
  const handleOpenAddPacSlide = () => {
    setSelectedPacSlide(null);
    setPacSlideForm({
      name: '',
      position: 'Ketua PAC IPNU Dukun',
      organization: 'IPNU',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      quote: 'Kader santri tangkas mengawal peradaban dengan akhlak mulia.',
    });
    setIsPacSlideModalOpen(true);
  };

  const handleOpenEditPacSlide = (slide: PacOfficerSlide) => {
    setSelectedPacSlide(slide);
    setPacSlideForm({
      name: slide.name,
      position: slide.position,
      organization: slide.organization,
      photo: slide.photo,
      quote: slide.quote || '',
    });
    setIsPacSlideModalOpen(true);
  };

  const handleSavePacSlide = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: PacOfficerSlide[];
    if (selectedPacSlide) {
      updated = pacSliderList.map((s) =>
        s.id === selectedPacSlide.id ? { ...s, ...pacSlideForm } : s
      );
    } else {
      updated = [
        ...pacSliderList,
        {
          id: 'pos-' + Date.now(),
          ...pacSlideForm,
        },
      ];
    }
    setPacSliderList(updated);
    updateSettings({ pacOfficersSlider: updated });
    setIsPacSlideModalOpen(false);
    showToast('Slider foto pengurus PAC berhasil diperbarui', 'success');
  };

  const handleDeletePacSlide = (id: string) => {
    const updated = pacSliderList.filter((s) => s.id !== id);
    setPacSliderList(updated);
    updateSettings({ pacOfficersSlider: updated });
    showToast('Foto pengurus dihapus dari slider', 'info');
  };

  // Handlers for Navigation Logo & Branding
  const handleNavLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran logo maksimal 2MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoForm((prev) => ({ ...prev, navbarLogoUrl: reader.result as string }));
        showToast('Logo bilah navigasi berhasil diunggah', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      navbarLogoUrl: logoForm.navbarLogoUrl,
      navbarBrandTitle: logoForm.navbarBrandTitle,
      navbarBrandSubtitle: logoForm.navbarBrandSubtitle,
    });
    showToast('Pengaturan logo dan navigasi berhasil disimpan', 'success');
  };

  // Reordering helpers (Pengaturan Urutan Tampilan CMS)
  const handleMoveSlideUp = (idx: number) => {
    if (idx <= 0) return;
    const reordered = [...slides];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx - 1];
    reordered[idx - 1] = temp;
    reordered.forEach((s, i) => {
      updateSlide(s.id, { orderIndex: i + 1 });
    });
    showToast('Urutan slide berhasil dinaikkan', 'success');
  };

  const handleMoveSlideDown = (idx: number) => {
    if (idx >= slides.length - 1) return;
    const reordered = [...slides];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx + 1];
    reordered[idx + 1] = temp;
    reordered.forEach((s, i) => {
      updateSlide(s.id, { orderIndex: i + 1 });
    });
    showToast('Urutan slide berhasil diturunkan', 'success');
  };

  const handleMovePacSlideUp = (idx: number) => {
    if (idx <= 0) return;
    const reordered = [...pacSliderList];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx - 1];
    reordered[idx - 1] = temp;
    setPacSliderList(reordered);
    updateSettings({ pacOfficersSlider: reordered });
    showToast('Urutan foto pengurus dinaikkan', 'success');
  };

  const handleMovePacSlideDown = (idx: number) => {
    if (idx >= pacSliderList.length - 1) return;
    const reordered = [...pacSliderList];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx + 1];
    reordered[idx + 1] = temp;
    setPacSliderList(reordered);
    updateSettings({ pacOfficersSlider: reordered });
    showToast('Urutan foto pengurus diturunkan', 'success');
  };

  const handleMoveNavLinkUp = (idx: number) => {
    if (idx <= 0) return;
    const reordered = [...footerForm.footerNavLinks];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx - 1];
    reordered[idx - 1] = temp;
    setFooterForm((prev) => ({ ...prev, footerNavLinks: reordered }));
    updateSettings({ footerNavLinks: reordered });
    showToast('Urutan tautan catatan kaki dinaikkan', 'success');
  };

  const handleMoveNavLinkDown = (idx: number) => {
    if (idx >= footerForm.footerNavLinks.length - 1) return;
    const reordered = [...footerForm.footerNavLinks];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx + 1];
    reordered[idx + 1] = temp;
    setFooterForm((prev) => ({ ...prev, footerNavLinks: reordered }));
    updateSettings({ footerNavLinks: reordered });
    showToast('Urutan tautan catatan kaki diturunkan', 'success');
  };

  // Handlers for Galeri Kegiatan yang Terkumpul
  const handleOpenAddGallery = () => {
    setSelectedGalleryItem(null);
    setGalleryForm({
      title: '',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      unitName: 'PAC IPNU IPPNU DUKUN',
      category: 'Kaderisasi',
      date: new Date().toISOString().split('T')[0],
      isFeatured: true,
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (item: ActivityGalleryItem) => {
    setSelectedGalleryItem(item);
    setGalleryForm({
      title: item.title,
      imageUrl: item.imageUrl,
      unitName: item.unitName,
      category: item.category || 'Kaderisasi',
      date: item.date || new Date().toISOString().split('T')[0],
      isFeatured: !!item.isFeatured,
    });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: ActivityGalleryItem[];
    if (selectedGalleryItem) {
      updated = galleryList.map((g) =>
        g.id === selectedGalleryItem.id ? { ...g, ...galleryForm } : g
      );
    } else {
      updated = [
        ...galleryList,
        {
          id: 'ag-' + Date.now(),
          ...galleryForm,
        },
      ];
    }
    setGalleryList(updated);
    updateSettings({ activityGallery: updated });
    setIsGalleryModalOpen(false);
    showToast('Galeri kegiatan terkumpul berhasil diperbarui', 'success');
  };

  const handleDeleteGalleryItem = (id: string) => {
    const updated = galleryList.filter((g) => g.id !== id);
    setGalleryList(updated);
    updateSettings({ activityGallery: updated });
    showToast('Foto kegiatan dihapus dari galeri', 'info');
  };

  // Handlers for Social Links
  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      socialLinks: { ...socialForm },
      instagram: socialForm.instagram,
      facebook: socialForm.facebook,
      tiktok: socialForm.tiktok,
      youtube: socialForm.youtube,
      whatsapp: socialForm.whatsapp,
    });
    showToast('Tautan media sosial & WhatsApp berhasil disimpan', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pengaturan Konten & Tampilan Website (CMS)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola konten utama, hero slider, slider foto pengurus PAC, footer, catatan kaki, dan galeri kegiatan
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'content'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Edit Konten Utama</span>
        </button>

        <button
          onClick={() => setActiveTab('logo')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'logo'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Logo & Navigasi</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'slides'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Slide Bar (Hero)</span>
        </button>

        <button
          onClick={() => setActiveTab('pac_slider')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'pac_slider'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Slider Foto Pengurus PAC ({pacSliderList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'footer'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span>Footer & Navigasi Catatan Kaki</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Galeri Kegiatan Terkumpul ({galleryList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'social'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Media Sosial & WA</span>
        </button>

        <button
          onClick={() => setActiveTab('danger')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ml-auto ${
            activeTab === 'danger'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Database</span>
        </button>
      </div>

      {/* Tab: Content */}
      {activeTab === 'content' && (
        <form onSubmit={handleSaveContent} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Situs *</label>
              <input
                type="text"
                required
                value={contentForm.siteName}
                onChange={(e) => setContentForm({ ...contentForm, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Organisasi *</label>
              <input
                type="text"
                required
                value={contentForm.organization}
                onChange={(e) => setContentForm({ ...contentForm, organization: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline Organisasi *</label>
              <input
                type="text"
                required
                value={contentForm.tagline}
                onChange={(e) => setContentForm({ ...contentForm, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wilayah Kerja</label>
              <input
                type="text"
                value={contentForm.workArea}
                onChange={(e) => setContentForm({ ...contentForm, workArea: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sejarah Singkat & Identitas PAC</label>
              <textarea
                rows={4}
                value={contentForm.historyText}
                onChange={(e) => setContentForm({ ...contentForm, historyText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Visi Organisasi</label>
              <textarea
                rows={2}
                value={contentForm.vision}
                onChange={(e) => setContentForm({ ...contentForm, vision: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Pilar Misi Strategis Organisasi ({contentForm.missions.length})
              </label>
              <button
                type="button"
                onClick={handleAddMission}
                className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Misi</span>
              </button>
            </div>

            <div className="space-y-2">
              {contentForm.missions.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={m}
                    onChange={(e) => {
                      const updated = [...contentForm.missions];
                      updated[idx] = e.target.value;
                      setContentForm({ ...contentForm, missions: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMission(idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Konten</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Pengaturan Logo & Branding Navigasi */}
      {activeTab === 'logo' && (
        <form onSubmit={handleSaveLogoSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pengaturan Logo & Branding Bilah Navigasi Utama
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sesuaikan logo organisasi dan teks identitas yang muncul di bilah navigasi header website
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <label className="block text-xs font-bold text-slate-800">
              Logo Bilah Navigasi (Header)
            </label>

            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-emerald-400 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {logoForm.navbarLogoUrl ? (
                  <img
                    src={logoForm.navbarLogoUrl}
                    alt="Logo Navigasi"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white font-bold text-lg text-amber-300">
                    NU
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={navLogoInputRef}
                  accept="image/*"
                  onChange={handleNavLogoUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navLogoInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Baru</span>
                  </button>

                  {logoForm.navbarLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoForm({ ...logoForm, navbarLogoUrl: '' })}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kembalikan ke Badge Default</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500">
                  Format gambar PNG transparan atau JPG persegi disarankan (Maksimal 2MB).
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Atau Tautan URL Logo Eksternal:
              </label>
              <input
                type="url"
                value={logoForm.navbarLogoUrl}
                onChange={(e) => setLogoForm({ ...logoForm, navbarLogoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Utama Navigasi *
              </label>
              <input
                type="text"
                required
                value={logoForm.navbarBrandTitle}
                onChange={(e) => setLogoForm({ ...logoForm, navbarBrandTitle: e.target.value })}
                placeholder="PELAJAR NU DUKUN"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subjudul Organisasi *
              </label>
              <input
                type="text"
                required
                value={logoForm.navbarBrandSubtitle}
                onChange={(e) => setLogoForm({ ...logoForm, navbarBrandSubtitle: e.target.value })}
                placeholder="PAC IPNU IPPNU DUKUN"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Live Preview Header Card */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Pratinjau Langsung Tampilan Navbar Header:
            </span>
            <div className="p-3 bg-white rounded-xl shadow-xs border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {logoForm.navbarLogoUrl ? (
                  <img
                    src={logoForm.navbarLogoUrl}
                    alt="Logo"
                    className="w-9 h-9 rounded-xl object-contain shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white font-bold text-sm text-amber-300">
                    NU
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {logoForm.navbarBrandTitle}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                    {logoForm.navbarBrandSubtitle}
                  </span>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Aktif
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Logo & Navigasi</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Slide Bar (Hero Slider) */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Banner geser interaktif pada bagian paling atas landing page utama
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slides.map((s, idx) => (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="aspect-video relative bg-slate-100 overflow-hidden">
                    <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white">
                      Slide {idx + 1}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{s.title}</h4>
                    <p className="text-[11px] text-emerald-700 font-semibold">{s.tagline}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{s.description}</p>
                  </div>
                </div>
                <div className="p-4 pt-0 space-y-2">
                  <div className="text-[11px] text-slate-400">
                    Tombol: <span className="font-semibold text-slate-700">{s.buttonText}</span> ({s.buttonLink})
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSlideUp(idx)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                        title="Geser Urutan ke Atas"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === slides.length - 1}
                        onClick={() => handleMoveSlideDown(idx)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                        title="Geser Urutan ke Bawah"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Posisi Urutan #{idx + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Slider Bar Foto Pengurus PAC */}
      {activeTab === 'pac_slider' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Slider Bar Foto Pengurus PAC IPNU IPPNU Dukun
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Foto-foto pimpinan harian PAC yang ditampilkan dalam carousel interaktif di halaman utama
              </p>
            </div>
            <button
              onClick={handleOpenAddPacSlide}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Foto Pengurus ke Slider</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pacSliderList.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-300 bg-slate-200">
                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                        item.organization === 'IPNU'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.organization}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-emerald-700 font-semibold line-clamp-1">{item.position}</p>
                    {item.quote && (
                      <p className="text-[11px] text-slate-600 italic mt-1 line-clamp-2">"{item.quote}"</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMovePacSlideUp(idx)}
                      className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                      title="Geser Urutan ke Depan / Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === pacSliderList.length - 1}
                      onClick={() => handleMovePacSlideDown(idx)}
                      className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                      title="Geser Urutan ke Belakang / Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-slate-400 ml-1">#{idx + 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditPacSlide(item)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                      title="Edit Slide Pengurus"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePacSlide(item.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Hapus Slide Pengurus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Footer & Navigasi Catatan Kaki */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSaveFooter} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Pengaturan Teks & Kontak Footer
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Singkat Footer
                </label>
                <textarea
                  rows={2}
                  value={footerForm.footerText}
                  onChange={(e) => setFooterForm({ ...footerForm, footerText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Sekretariat</label>
                <input
                  type="text"
                  value={footerForm.footerAddress}
                  onChange={(e) => setFooterForm({ ...footerForm, footerAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={footerForm.footerEmail}
                  onChange={(e) => setFooterForm({ ...footerForm, footerEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                <input
                  type="text"
                  value={footerForm.footerPhone}
                  onChange={(e) => setFooterForm({ ...footerForm, footerPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Hak Cipta (Copyright)</label>
                <input
                  type="text"
                  value={footerForm.footerCopyright}
                  onChange={(e) => setFooterForm({ ...footerForm, footerCopyright: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Navigasi Catatan Kaki (Footer Links Management) */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Kelola Daftar Navigasi Catatan Kaki
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tambahkan link halaman, jangkar seksi, atau tautan eksternal pada footer
              </p>
            </div>

            <div className="space-y-2">
              {footerForm.footerNavLinks.map((link, idx) => (
                <div key={link.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveNavLinkUp(idx)}
                      className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                      title="Geser Tautan ke Atas"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === footerForm.footerNavLinks.length - 1}
                      onClick={() => handleMoveNavLinkDown(idx)}
                      className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                      title="Geser Tautan ke Bawah"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-slate-400 ml-0.5">#{idx + 1}</span>
                  </div>
                  <div className="flex-1 font-bold text-slate-800">{link.label}</div>
                  <div className="font-mono text-emerald-700 text-[11px] truncate max-w-[200px]">{link.url}</div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFooterNavLink(link.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Hapus Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Form Add New Link */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Nama Label (Contoh: Portal Makesta)"
                value={newNavLink.label}
                onChange={(e) => setNewNavLink({ ...newNavLink, label: e.target.value })}
                className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                placeholder="URL Target (Contoh: #kegiatan atau https://...)"
                value={newNavLink.url}
                onChange={(e) => setNewNavLink({ ...newNavLink, url: e.target.value })}
                className="w-full sm:w-1/2 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddFooterNavLink}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                + Tambah Link
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Footer & Navigasi</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Galeri Kegiatan yang Terkumpul */}
      {activeTab === 'gallery' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pusat Koleksi Galeri Kegiatan Terkumpul
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Koleksi terpusat dokumentasi foto dari seluruh pimpinan ranting, PK, dan PAC Dukun
              </p>
            </div>
            <button
              onClick={handleOpenAddGallery}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Foto ke Galeri Terkumpul</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryList.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="aspect-video relative bg-slate-200 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white">
                      {item.category || 'Kaderisasi'}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-emerald-700 font-semibold">{item.unitName}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{item.date}</p>
                  </div>
                </div>

                <div className="p-2 border-t border-slate-200 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEditGallery(item)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                    title="Edit Foto"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGalleryItem(item.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Social Links */}
      {activeTab === 'social' && (
        <form onSubmit={handleSaveSocial} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Saluran Media Sosial & Kontak WhatsApp Resmi
          </h3>

          <div className="space-y-3 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Akun Instagram</label>
              <input
                type="text"
                value={socialForm.instagram}
                onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Akun Facebook</label>
              <input
                type="text"
                value={socialForm.facebook}
                onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Akun TikTok</label>
              <input
                type="text"
                value={socialForm.tiktok}
                onChange={(e) => setSocialForm({ ...socialForm, tiktok: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Channel YouTube</label>
              <input
                type="text"
                value={socialForm.youtube}
                onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Link WhatsApp Center</label>
              <input
                type="text"
                value={socialForm.whatsapp}
                onChange={(e) => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Media Sosial</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Danger Zone */}
      {activeTab === 'danger' && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <RotateCcw className="w-5 h-5 text-red-600" />
            <span>Pemulihan Data (Reset Default Data Awal)</span>
          </div>
          <p className="text-xs text-red-800 leading-relaxed max-w-xl">
            Tindakan ini akan mengembalikan seluruh database organisasi, daftar anggota, pengurus, surat pengesahan (SP), dan pengaturan website ke kondisi seed data awal PAC Dukun.
          </p>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            Reset Database Sekarang
          </button>
        </div>
      )}

      {/* Modal: Slider Foto Pengurus PAC */}
      <Modal
        isOpen={isPacSlideModalOpen}
        onClose={() => setIsPacSlideModalOpen(false)}
        title={selectedPacSlide ? 'Edit Foto Pengurus di Slider' : 'Tambah Foto Pengurus ke Slider'}
        subtitle="Upload pas foto resmi, tentukan jabatan, dan masukkan kutipan motivasi"
        maxWidth="lg"
      >
        <form onSubmit={handleSavePacSlide} className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            {pacSlideForm.photo ? (
              <div className="relative group w-16 h-20 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0">
                <img src={pacSlideForm.photo} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPacSlideForm({ ...pacSlideForm, photo: '' })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-20 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[9px] shrink-0 bg-white">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Pas Foto</span>
              </div>
            )}

            <div className="space-y-1 flex-1">
              <input
                type="file"
                ref={pacPhotoInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPacSlideForm((prev) => ({ ...prev, photo: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => pacPhotoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto Pengurus</span>
              </button>
              <input
                type="url"
                value={pacSlideForm.photo}
                onChange={(e) => setPacSlideForm({ ...pacSlideForm, photo: e.target.value })}
                placeholder="Atau tempel URL foto..."
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={pacSlideForm.name}
              onChange={(e) => setPacSlideForm({ ...pacSlideForm, name: e.target.value })}
              placeholder="Contoh: M. Ainun Najib, S.Pd"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan di PAC *</label>
              <input
                type="text"
                required
                value={pacSlideForm.position}
                onChange={(e) => setPacSlideForm({ ...pacSlideForm, position: e.target.value })}
                placeholder="Ketua / Sekretaris / Bendahara"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organisasi *</label>
              <select
                value={pacSlideForm.organization}
                onChange={(e) => setPacSlideForm({ ...pacSlideForm, organization: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="IPNU">IPNU (Putra)</option>
                <option value="IPPNU">IPPNU (Putri)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kutipan / Quote Inspiratif</label>
            <textarea
              rows={2}
              value={pacSlideForm.quote}
              onChange={(e) => setPacSlideForm({ ...pacSlideForm, quote: e.target.value })}
              placeholder="Pesan motivasi atau motto perjuangan pengurus..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPacSlideModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {selectedPacSlide ? 'Simpan Perubahan' : 'Tambah ke Slider'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Galeri Kegiatan Terkumpul */}
      <Modal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        title={selectedGalleryItem ? 'Edit Dokumentasi Galeri' : 'Tambah Foto ke Galeri Terkumpul'}
        subtitle="Upload foto kegiatan dan tentukan pangkalan penyelenggara"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveGalleryItem} className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            {galleryForm.imageUrl ? (
              <div className="relative group w-24 h-16 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0">
                <img src={galleryForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setGalleryForm({ ...galleryForm, imageUrl: '' })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-16 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[9px] shrink-0 bg-white">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Foto Kegiatan</span>
              </div>
            )}

            <div className="space-y-1 flex-1">
              <input
                type="file"
                ref={galleryPhotoInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setGalleryForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryPhotoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto Kegiatan</span>
              </button>
              <input
                type="url"
                value={galleryForm.imageUrl}
                onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                placeholder="Atau tempel URL foto..."
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul / Nama Kegiatan *</label>
            <input
              type="text"
              required
              value={galleryForm.title}
              onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
              placeholder="Contoh: MAKESTA Raya Zona 1"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Penyelenggara / Pangkalan *</label>
              <input
                type="text"
                required
                value={galleryForm.unitName}
                onChange={(e) => setGalleryForm({ ...galleryForm, unitName: e.target.value })}
                placeholder="PR Sumber / PK MA Ma'arif"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Kegiatan</label>
              <input
                type="text"
                value={galleryForm.category}
                onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                placeholder="Kaderisasi / Sosial / Olahraga"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kegiatan</label>
            <input
              type="text"
              value={galleryForm.date}
              onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
              placeholder="Contoh: 18 Oktober 2026"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsGalleryModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {selectedGalleryItem ? 'Simpan Perubahan' : 'Tambah ke Galeri'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Reset Database Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetDatabase();
          setIsResetConfirmOpen(false);
        }}
        title="Konfirmasi Reset Total Database"
        message="PERINGATAN: Seluruh data ranting, anggota, pengurus, surat pengesahan (SP), dan konfigurasi CMS akan dikembalikan ke data awal PAC IPNU IPPNU Dukun. Lanjutkan?"
        confirmText="Ya, Reset Total"
        type="danger"
      />
    </div>
  );
};
