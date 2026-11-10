import React, { useState, useRef, useEffect } from 'react';
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
  Database,
  Download,
  FileCode,
} from 'lucide-react';
import { generateMySqlDump } from '../../utils/phpMysqlExport';

export const WebsiteSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    slides,
    addSlide,
    updateSlide,
    deleteSlide,
    officers,
    units,
    members,
    spDocuments,
    activities,
    supervisors,
    alumni,
    resetDatabase,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'content' | 'logo' | 'slides' | 'pac_slider' | 'footer' | 'gallery' | 'social' | 'php_mysql' | 'danger'
  >('content');

  // Logo, Navigasi, Breadcrumb & Nama Menu Manajemen Form
  const [logoForm, setLogoForm] = useState({
    navbarLogoUrl: settings.navbarLogoUrl || settings.logoUrl || '',
    navbarBrandTitle: settings.navbarBrandTitle || settings.siteName || 'PELAJAR NU DUKUN',
    navbarBrandSubtitle: settings.navbarBrandSubtitle || settings.organization || 'PAC IPNU IPPNU DUKUN',
    navMenuLabels: {
      beranda: settings.navMenuLabels?.beranda || 'Beranda',
      profil: settings.navMenuLabels?.profil || 'Profil PAC',
      profilSubSejarah: settings.navMenuLabels?.profilSubSejarah || 'Profil & Sejarah PAC',
      profilSubPelindungPembina:
        settings.navMenuLabels?.profilSubPelindungPembina || 'Dewan Pelindung & Pembina',
      pengurus: settings.navMenuLabels?.pengurus || 'Kepengurusan',
      rantingPk: settings.navMenuLabels?.rantingPk || 'Ranting & PK',
      kegiatan: settings.navMenuLabels?.kegiatan || 'Berita & Kegiatan',
      galeri: settings.navMenuLabels?.galeri || 'Galeri',
      kontak: settings.navMenuLabels?.kontak || 'Kontak',
      loginBtn: settings.navMenuLabels?.loginBtn || 'Login Pengurus',
      openDashboardBtn: settings.navMenuLabels?.openDashboardBtn || 'Buka Dashboard',
    },
    dashboardMenuLabels: {
      menuUtamaBtn: settings.dashboardMenuLabels?.menuUtamaBtn || 'MENU UTAMA',
      overview: settings.dashboardMenuLabels?.overview || 'Dashboard Utama',
      pacOfficers: settings.dashboardMenuLabels?.pacOfficers || 'Database Pengurus PAC',
      branches: settings.dashboardMenuLabels?.branches || 'Database Ranting & PK',
      members: settings.dashboardMenuLabels?.members || 'Database Anggota',
      supervisors: settings.dashboardMenuLabels?.supervisors || 'Pelindung & Pembina',
      spDocuments: settings.dashboardMenuLabels?.spDocuments || 'Database & Upload SP',
      activities: settings.dashboardMenuLabels?.activities || 'Berita & Kegiatan',
      scoring: settings.dashboardMenuLabels?.scoring || 'Statistik & Penilaian',
      users: settings.dashboardMenuLabels?.users || 'Manajemen User',
      websiteSettings: settings.dashboardMenuLabels?.websiteSettings || 'Pengaturan Website',
      logs: settings.dashboardMenuLabels?.logs || 'Log Aktivitas',
    },
    breadcrumbConfig: {
      showBreadcrumb: settings.breadcrumbConfig?.showBreadcrumb !== false,
      homeLabel: settings.breadcrumbConfig?.homeLabel || 'Menu Utama',
      separator: settings.breadcrumbConfig?.separator || '/',
    },
  });
  const navLogoInputRef = useRef<HTMLInputElement>(null);
  const customFontInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [contentForm, setContentForm] = useState({
    siteName: settings.siteName || settings.siteTitle || 'PELAJAR NU DUKUN',
    organization: settings.organization || settings.organizationName || 'PAC IPNU IPPNU DUKUN',
    period: settings.period || 'Masa Khidmat 2024 - 2026',
    tagline: settings.tagline || '',
    historyText: settings.historyText || settings.history || '',
    workArea: settings.workArea || '',
    vision: settings.vision || '',
    missions: [...settings.missions],
    sectionTitles: {
      profilTitle:
        settings.sectionTitles?.profilTitle ||
        'Bergerak, Berilmu, dan Berkhidmat Demi Kemaslahatan Pelajar Nahdliyin',
      profilSubtitle:
        settings.sectionTitles?.profilSubtitle ||
        'Sejarah perjuangan, visi misi strategis, serta data ketua IPNU IPPNU Kecamatan Dukun, Kabupaten Gresik.',
      ketuaTitle: settings.sectionTitles?.ketuaTitle || 'Foto dan Data Ketua IPNU IPPNU',
      ketuaSubtitle:
        settings.sectionTitles?.ketuaSubtitle ||
        'Estafet kepemimpinan dan khidmat para Ketua PAC IPNU & IPPNU Kecamatan Dukun',
      pelindungTitle: settings.sectionTitles?.pelindungTitle || 'Dewan Pelindung PAC IPNU IPPNU Dukun',
      pelindungSubtitle:
        settings.sectionTitles?.pelindungSubtitle ||
        'Para masyayikh, pimpinan MWC NU, dan sesepuh pelindung pelajar Nahdliyin',
      pembinaTitle: settings.sectionTitles?.pembinaTitle || 'Dewan Pembina (Majelis Alumni) PAC Dukun',
      pembinaSubtitle:
        settings.sectionTitles?.pembinaSubtitle ||
        'Majelis alumni dan dewan pembina lintas generasi penggerak kaderisasi',
      pengurusTitle: settings.sectionTitles?.pengurusTitle || 'Pimpinan Harian PAC IPNU IPPNU DUKUN',
      pengurusSubtitle:
        settings.sectionTitles?.pengurusSubtitle ||
        'Berikhtiar mengayomi dan menggerakkan pelajar Nahdliyin dengan kepemimpinan yang amanah, cerdas, dan transformatif.',
      rantingPkTitle:
        settings.sectionTitles?.rantingPkTitle || 'Pimpinan Ranting Desa & Pimpinan Komisariat',
      rantingPkSubtitle:
        settings.sectionTitles?.rantingPkSubtitle ||
        'Pemantauan langsung kelengkapan database administrasi, status surat pengesahan (SP), dan profil pimpinan di 18 Ranting dan 6 Komisariat se-Kecamatan Dukun.',
      kegiatanTitle: settings.sectionTitles?.kegiatanTitle || 'Berita & Dokumentasi Kegiatan',
      kegiatanSubtitle:
        settings.sectionTitles?.kegiatanSubtitle ||
        'Rekam jejak perkhidmatan, dinamika kaderisasi, dan ragam kegiatan positif pelajar Nahdlatul Ulama se-Kecamatan Dukun.',
      galeriTitle: settings.sectionTitles?.galeriTitle || 'Galeri Kegiatan Pelajar NU Dukun',
      galeriSubtitle:
        settings.sectionTitles?.galeriSubtitle ||
        'Sorotan potret kebersamaan, semangat belajar, perjuangan, dan khidmat para kader santri se-Kecamatan Dukun.',
      kontakTitle: settings.sectionTitles?.kontakTitle || 'Pusat Layanan & Pengaduan Administrasi',
      kontakSubtitle:
        settings.sectionTitles?.kontakSubtitle ||
        'Hubungi sekretariat PAC atau kirim pesan terkait kendala database dan pengajuan SP.',
    },
    typographyConfig: {
      fontFamily: settings.typographyConfig?.fontFamily || 'Inter, system-ui, sans-serif',
      customFontName: settings.typographyConfig?.customFontName || '',
      customFontDataUrl: settings.typographyConfig?.customFontDataUrl || '',
      bodyFontSize: settings.typographyConfig?.bodyFontSize || '14px',
      lineHeight: settings.typographyConfig?.lineHeight || '1.6',
      paragraphAlign: settings.typographyConfig?.paragraphAlign || ('left' as 'left' | 'justify' | 'center'),
    },
    customCss: settings.customCss || '',
  });

  // Hero & CTA Config State
  const [heroCtaForm, setHeroCtaForm] = useState({
    badgeText: settings.heroCtaConfig?.badgeText || '',
    primaryBtnText: settings.heroCtaConfig?.primaryBtnText || 'Kenali Organisasi',
    primaryBtnLink: settings.heroCtaConfig?.primaryBtnLink || '#profil',
    secondaryBtnText: settings.heroCtaConfig?.secondaryBtnText || 'Login Pengurus',
    tertiaryBtnText: settings.heroCtaConfig?.tertiaryBtnText || 'Akses Database Ranting',
    tertiaryBtnLink: settings.heroCtaConfig?.tertiaryBtnLink || '#ranting-pk',
    highlight1: settings.heroCtaConfig?.highlight1 || '18 Ranting Desa Terdata',
    highlight2: settings.heroCtaConfig?.highlight2 || '6 Komisariat Lembaga',
    highlight3: settings.heroCtaConfig?.highlight3 || 'Pengesahan Dokumen SP Terintegrasi',
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

  useEffect(() => {
    if (settings.pacOfficersSlider) {
      setPacSliderList([...settings.pacOfficersSlider]);
    }
  }, [settings.pacOfficersSlider]);

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
      period: contentForm.period,
      tagline: contentForm.tagline,
      historyText: contentForm.historyText,
      history: contentForm.historyText,
      workArea: contentForm.workArea,
      vision: contentForm.vision,
      missions: contentForm.missions,
      sectionTitles: contentForm.sectionTitles,
      typographyConfig: contentForm.typographyConfig,
      customCss: contentForm.customCss,
    });
    showToast('Konten utama, judul halaman, font, paragraf & CSS berhasil disimpan', 'success');
  };

  const handleCustomFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran file font maksimal 5MB', 'warning');
      return;
    }
    const cleanFontName = file.name.replace(/\.(ttf|otf|woff2|woff)$/i, '').replace(/[^a-zA-Z0-9_-]/g, '');
    const reader = new FileReader();
    reader.onloadend = () => {
      setContentForm((prev) => ({
        ...prev,
        typographyConfig: {
          ...prev.typographyConfig,
          customFontName: cleanFontName || 'CustomUploadedFont',
          customFontDataUrl: reader.result as string,
        },
      }));
      showToast(`Font "${cleanFontName}" berhasil diunggah! Klik Simpan untuk menerapkan.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHeroCta = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      heroCtaConfig: heroCtaForm,
    });
    showToast('Pengaturan Header Hero Section & CTA berhasil disimpan', 'success');
  };

  const handleOpenAddHeroSlide = () => {
    setSelectedSlide(null);
    setSlideForm({
      title: 'Kaderisasi Pelajar Berkemajuan',
      tagline: 'PAC IPNU IPPNU Kecamatan Dukun',
      description: 'Membangun generasi pelajar santri yang unggul dalam ilmu pengetahuan, teknologi, dan akhlakul karimah.',
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1400&q=80',
      buttonText: 'Kenali Organisasi',
      buttonLink: '#profil',
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditHeroSlide = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setSlideForm({
      title: slide.title,
      tagline: slide.tagline || slide.subtitle || '',
      description: slide.description,
      imageUrl: slide.imageUrl,
      buttonText: slide.buttonText || 'Kenali Organisasi',
      buttonLink: slide.buttonLink || '#profil',
    });
    setIsSlideModalOpen(true);
  };

  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlide) {
      updateSlide(selectedSlide.id, {
        title: slideForm.title,
        tagline: slideForm.tagline,
        description: slideForm.description,
        imageUrl: slideForm.imageUrl,
        buttonText: slideForm.buttonText,
        buttonLink: slideForm.buttonLink,
      });
    } else {
      addSlide({
        title: slideForm.title,
        tagline: slideForm.tagline,
        description: slideForm.description,
        imageUrl: slideForm.imageUrl,
        buttonText: slideForm.buttonText,
        buttonLink: slideForm.buttonLink,
        isActive: true,
        orderIndex: slides.length + 1,
      });
    }
    setIsSlideModalOpen(false);
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
      logoUrl: logoForm.navbarLogoUrl,
      navbarBrandTitle: logoForm.navbarBrandTitle,
      navbarBrandSubtitle: logoForm.navbarBrandSubtitle,
      siteName: logoForm.navbarBrandTitle,
      siteTitle: logoForm.navbarBrandTitle,
      organization: logoForm.navbarBrandSubtitle,
      organizationName: logoForm.navbarBrandSubtitle,
      navMenuLabels: logoForm.navMenuLabels,
      dashboardMenuLabels: logoForm.dashboardMenuLabels,
      breadcrumbConfig: logoForm.breadcrumbConfig,
    });
    showToast('Logo, navigasi, breadcrumb & nama menu manajemen berhasil disimpan', 'success');
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
          onClick={() => setActiveTab('php_mysql')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'php_mysql'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PHP & Database MySQL</span>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Masa Khidmat PAC IPNU IPPNU *
              </label>
              <input
                type="text"
                required
                value={contentForm.period}
                onChange={(e) => setContentForm({ ...contentForm, period: e.target.value })}
                placeholder="Contoh: Masa Khidmat 2024 – 2026 atau 2024 - 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Akan otomatis diperbarui pada badge hero, header pengurus harian PAC, dan profil kepemimpinan
              </p>
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

          {/* Editor Judul Setiap Halaman & Header Body Konten Utama */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Edit Tulisan Judul Setiap Halaman & Header Body Konten Utama
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sesuaikan judul utama dan subjudul pada setiap seksi halaman depan (Profil, Ketua, Pelindung & Pembina, Pengurus, Ranting/PK, Berita, Galeri, & Kontak)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Halaman Profil PAC
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.profilTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, profilTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Subjudul Halaman Profil PAC
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.profilSubtitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, profilSubtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Bagian Foto & Data Ketua IPNU IPPNU
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.ketuaTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, ketuaTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Subjudul Bagian Ketua IPNU IPPNU
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.ketuaSubtitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, ketuaSubtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Kategori Dewan Pelindung
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.pelindungTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, pelindungTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Kategori Dewan Pembina (Majelis Alumni)
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.pembinaTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, pembinaTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Halaman Kepengurusan PAC
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.pengurusTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, pengurusTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Subjudul Halaman Kepengurusan PAC
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.pengurusSubtitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, pengurusSubtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Halaman Direktori Ranting & PK
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.rantingPkTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, rantingPkTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Subjudul Direktori Ranting & PK
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.rantingPkSubtitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: {
                        ...contentForm.sectionTitles,
                        rantingPkSubtitle: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Halaman Berita & Kegiatan
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.kegiatanTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, kegiatanTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Halaman Galeri Dokumentasi
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.galeriTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, galeriTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Judul Halaman Kontak & Layanan
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.kontakTitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, kontakTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Subjudul Halaman Kontak & Layanan
                </label>
                <input
                  type="text"
                  value={contentForm.sectionTitles.kontakSubtitle}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      sectionTitles: { ...contentForm.sectionTitles, kontakSubtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Editor Tipografi: Font, Upload Font, Paragraf & Custom CSS */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pengaturan Font, Paragraf, Upload Font Kustom & Custom CSS
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih jenis huruf standar, unggah file font sendiri (.ttf/.otf/.woff), atur spasi paragraf, atau tambahkan CSS kustom
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pilihan Font Utama
                </label>
                <select
                  value={contentForm.typographyConfig.fontFamily}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      typographyConfig: {
                        ...contentForm.typographyConfig,
                        fontFamily: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="Inter, system-ui, sans-serif">Inter (Modern Default)</option>
                  <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                  <option value="'Poppins', sans-serif">Poppins</option>
                  <option value="Georgia, serif">Georgia (Klasik Serif)</option>
                  <option value="'Merriweather', serif">Merriweather (Editorial)</option>
                  <option value="system-ui, -apple-system, sans-serif">System Sans</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Ukuran Teks Konten
                </label>
                <select
                  value={contentForm.typographyConfig.bodyFontSize}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      typographyConfig: {
                        ...contentForm.typographyConfig,
                        bodyFontSize: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="13px">Kecil / Minimalis (13px)</option>
                  <option value="14px">Standar (14px)</option>
                  <option value="15px">Sedang (15px)</option>
                  <option value="16px">Besar (16px)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jarak Antar Baris (Line Height)
                </label>
                <select
                  value={contentForm.typographyConfig.lineHeight}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      typographyConfig: {
                        ...contentForm.typographyConfig,
                        lineHeight: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="1.4">Rapat (1.4)</option>
                  <option value="1.6">Normal (1.6)</option>
                  <option value="1.75">Lega (1.75)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Perataan Paragraf (Align)
                </label>
                <select
                  value={contentForm.typographyConfig.paragraphAlign}
                  onChange={(e) =>
                    setContentForm({
                      ...contentForm,
                      typographyConfig: {
                        ...contentForm.typographyConfig,
                        paragraphAlign: e.target.value as 'left' | 'justify' | 'center',
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="left">Rata Kiri (Left)</option>
                  <option value="justify">Rata Kanan-Kiri (Justify)</option>
                  <option value="center">Rata Tengah (Center)</option>
                </select>
              </div>

              {/* Upload Custom Font File */}
              <div className="sm:col-span-2 lg:col-span-4 pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Upload File Font Kustom (.ttf, .otf, .woff, .woff2)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {contentForm.typographyConfig.customFontName
                      ? `Font Kustom Aktif: ${contentForm.typographyConfig.customFontName}`
                      : 'Belum ada file font kustom diunggah (menggunakan pilihan font di atas)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={customFontInputRef}
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={handleCustomFontUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => customFontInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File Font</span>
                  </button>
                  {contentForm.typographyConfig.customFontDataUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setContentForm({
                          ...contentForm,
                          typographyConfig: {
                            ...contentForm.typographyConfig,
                            customFontName: '',
                            customFontDataUrl: '',
                          },
                        })
                      }
                      className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-xs font-semibold cursor-pointer"
                    >
                      Hapus Font Kustom
                    </button>
                  )}
                </div>
              </div>

              {/* Custom CSS Editor */}
              <div className="sm:col-span-2 lg:col-span-4 pt-2 border-t border-slate-200/80">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Custom CSS Tambahan (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={contentForm.customCss}
                  onChange={(e) => setContentForm({ ...contentForm, customCss: e.target.value })}
                  placeholder="/* Contoh: h1, h2 { letter-spacing: -0.02em; } */"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-slate-900 text-emerald-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Konten, Font, Paragraf & CSS</span>
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

          {/* Editor Tulisan Menu Header / Navigasi */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Edit Tulisan Menu Header / Bilah Navigasi Atas
              </h4>
              <p className="text-[11px] text-slate-500">
                Ubah teks tombol menu yang tampil di bagian atas halaman website
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Menu 1 (Beranda)</label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.beranda}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: { ...logoForm.navMenuLabels, beranda: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Menu 2 (Profil PAC)</label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.profil}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: { ...logoForm.navMenuLabels, profil: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Menu 3 (Kepengurusan)</label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.pengurus}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: { ...logoForm.navMenuLabels, pengurus: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Menu 4 (Ranting & PK)</label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.rantingPk}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: { ...logoForm.navMenuLabels, rantingPk: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Menu 5 (Berita)</label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.kegiatan}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: { ...logoForm.navMenuLabels, kegiatan: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Menu 6 (Galeri)</label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.galeri}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: { ...logoForm.navMenuLabels, galeri: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Menu 7 (Kontak)</label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.kontak}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: { ...logoForm.navMenuLabels, kontak: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Tombol Login</label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.loginBtn}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: { ...logoForm.navMenuLabels, loginBtn: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Sub-Menu: Profil & Sejarah PAC
                </label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.profilSubSejarah}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: {
                        ...logoForm.navMenuLabels,
                        profilSubSejarah: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Sub-Menu: Dewan Pelindung & Pembina
                </label>
                <input
                  type="text"
                  value={logoForm.navMenuLabels.profilSubPelindungPembina}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      navMenuLabels: {
                        ...logoForm.navMenuLabels,
                        profilSubPelindungPembina: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Pengaturan Nama Menu Manajemen (Sidebar Dashboard Admin & Tombol MENU UTAMA) */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Pengaturan Nama Menu Manajemen (Sidebar Dashboard Admin & Tombol MENU UTAMA)
              </h4>
              <p className="text-[11px] text-slate-500">
                Ubah nama menu navigasi di sidebar kiri Dashboard Admin serta teks tombol MENU UTAMA
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-emerald-800 mb-1">
                  Tombol Kembali ke Web (MENU UTAMA)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.menuUtamaBtn}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        menuUtamaBtn: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 1 (Dashboard Utama)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.overview}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        overview: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 2 (Database Pengurus PAC)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.pacOfficers}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        pacOfficers: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 3 (Database Ranting & PK)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.branches}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        branches: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 4 (Database Anggota)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.members}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        members: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 5 (Pelindung & Pembina)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.supervisors}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        supervisors: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 6 (Database & Upload SP)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.spDocuments}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        spDocuments: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 7 (Berita & Kegiatan)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.activities}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        activities: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 8 (Statistik & Penilaian)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.scoring}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        scoring: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 9 (Manajemen User)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.users}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        users: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 10 (Pengaturan Website)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.websiteSettings}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        websiteSettings: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Menu 11 (Log Aktivitas)
                </label>
                <input
                  type="text"
                  value={logoForm.dashboardMenuLabels.logs}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      dashboardMenuLabels: {
                        ...logoForm.dashboardMenuLabels,
                        logs: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Pengaturan Breadcrumb Halaman */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Pengaturan Breadcrumb Navigasi Halaman
              </h4>
              <p className="text-[11px] text-slate-500">
                Konfigurasi jejak navigasi (Breadcrumb) pada halaman khusus Profil PAC dan Dewan Pelindung & Pembina
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={logoForm.breadcrumbConfig.showBreadcrumb}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      breadcrumbConfig: {
                        ...logoForm.breadcrumbConfig,
                        showBreadcrumb: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tampilkan Breadcrumb di Header Halaman</span>
              </label>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Teks Beranda Breadcrumb
                </label>
                <input
                  type="text"
                  value={logoForm.breadcrumbConfig.homeLabel}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      breadcrumbConfig: {
                        ...logoForm.breadcrumbConfig,
                        homeLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                  Simbol Pemisah (Separator)
                </label>
                <input
                  type="text"
                  value={logoForm.breadcrumbConfig.separator}
                  onChange={(e) =>
                    setLogoForm({
                      ...logoForm,
                      breadcrumbConfig: {
                        ...logoForm.breadcrumbConfig,
                        separator: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Logo, Navigasi, Breadcrumb & Menu Manajemen</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Slide Bar (Hero Section, CTA & Slides) */}
      {activeTab === 'slides' && (
        <div className="space-y-6">
          {/* Form Pengaturan Header / Hero Section & Tombol CTA */}
          <form
            onSubmit={handleSaveHeroCta}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pengaturan Header / Hero Section & Tombol Call-To-Action (CTA)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sesuaikan teks badge atas, label tombol CTA utama di Hero Section, dan poin sorotan bawah
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Badge Atas Hero (Kosongkan untuk otomatis Nama Organisasi + Masa Khidmat)
                </label>
                <input
                  type="text"
                  value={heroCtaForm.badgeText}
                  onChange={(e) => setHeroCtaForm({ ...heroCtaForm, badgeText: e.target.value })}
                  placeholder="Contoh: PAC IPNU IPPNU DUKUN • Masa Khidmat 2024 – 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Tombol CTA Utama (Hijau)
                </label>
                <input
                  type="text"
                  value={heroCtaForm.primaryBtnText}
                  onChange={(e) =>
                    setHeroCtaForm({ ...heroCtaForm, primaryBtnText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tautan Tombol CTA Utama
                </label>
                <input
                  type="text"
                  value={heroCtaForm.primaryBtnLink}
                  onChange={(e) =>
                    setHeroCtaForm({ ...heroCtaForm, primaryBtnLink: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Tombol CTA Kedua (Login)
                </label>
                <input
                  type="text"
                  value={heroCtaForm.secondaryBtnText}
                  onChange={(e) =>
                    setHeroCtaForm({ ...heroCtaForm, secondaryBtnText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Tombol CTA Ketiga (Link Database)
                </label>
                <input
                  type="text"
                  value={heroCtaForm.tertiaryBtnText}
                  onChange={(e) =>
                    setHeroCtaForm({ ...heroCtaForm, tertiaryBtnText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sorotan Hero 1
                </label>
                <input
                  type="text"
                  value={heroCtaForm.highlight1}
                  onChange={(e) => setHeroCtaForm({ ...heroCtaForm, highlight1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sorotan Hero 2 & 3
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={heroCtaForm.highlight2}
                    onChange={(e) => setHeroCtaForm({ ...heroCtaForm, highlight2: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <input
                    type="text"
                    value={heroCtaForm.highlight3}
                    onChange={(e) => setHeroCtaForm({ ...heroCtaForm, highlight3: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Konfigurasi Hero & CTA</span>
              </button>
            </div>
          </form>

          {/* Daftar Slide Banner Hero */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Slide Banner Hero Section ({slides.length} Slide)
              </h3>
              <p className="text-xs text-slate-500">
                Tambah, edit judul/deskripsi/gambar latar, atau atur urutan slide banner utama
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddHeroSlide}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Slide Hero Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
              >
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
                    Tombol: <span className="font-semibold text-slate-700">{s.buttonText}</span> (
                    {s.buttonLink})
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
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditHeroSlide(s)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        title="Edit Slide Hero"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {slides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteSlide(s.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Hapus Slide Hero"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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

      {/* Tab: PHP & Database MySQL */}
      {activeTab === 'php_mysql' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Paket Integrasi PHP & Database MySQL</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unduh file dump database MySQL (.sql) yang tersinkronisasi real-time beserta skrip koneksi PHP PDO (`config.php` & `api.php`)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const sqlContent = generateMySqlDump({
                    settings,
                    officers,
                    units,
                    members,
                    spDocuments,
                    activities,
                    supervisors,
                    alumni,
                  });
                  const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `db_pelajar_nu_dukun_${new Date().toISOString().slice(0, 10)}.sql`;
                  a.click();
                  URL.revokeObjectURL(url);
                  showToast('File Database MySQL (.sql) berhasil diunduh', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Database MySQL (.sql)</span>
              </button>

              <a
                href="/php-mysql/config.php"
                download="config.php"
                className="px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <FileCode className="w-4 h-4" />
                <span>Unduh config.php</span>
              </a>

              <a
                href="/php-mysql/api.php"
                download="api.php"
                className="px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <FileCode className="w-4 h-4" />
                <span>Unduh api.php</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block">Tabel Pengurus PAC & Unit (`pac_officers`)</span>
              <strong className="text-lg font-black text-slate-900">{officers.length} Baris Data</strong>
              <p className="text-[11px] text-slate-500">Termasuk seluruh Pengurus Harian PAC & Pengurus Ranting/PK</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block">Tabel Ranting & Komisariat (`units`)</span>
              <strong className="text-lg font-black text-slate-900">{units.length} Pangkalan</strong>
              <p className="text-[11px] text-slate-500">18 Ranting Desa & 6 Komisariat beserta skor kelengkapan</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold block">Tabel Anggota Kader (`members`)</span>
              <strong className="text-lg font-black text-slate-900">{members.length} Kader Terdaftar</strong>
              <p className="text-[11px] text-slate-500">Siap diimpor langsung ke phpMyAdmin / MySQL Server</p>
            </div>
          </div>
        </div>
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

      {/* Modal: Add/Edit Hero Slide */}
      <Modal
        isOpen={isSlideModalOpen}
        onClose={() => setIsSlideModalOpen(false)}
        title={selectedSlide ? 'Edit Slide Hero Section' : 'Tambah Slide Hero Baru'}
        subtitle="Atur judul utama, subjudul, deskripsi, tombol CTA, dan gambar latar Hero"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveHeroSlide} className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            {slideForm.imageUrl && (
              <img
                src={slideForm.imageUrl}
                alt="Preview Hero"
                className="w-24 h-16 rounded-lg object-cover border border-slate-300 shrink-0"
              />
            )}
            <div className="space-y-1.5 flex-1">
              <input
                type="file"
                ref={heroSlidePhotoInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSlideForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => heroSlidePhotoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Gambar Latar</span>
              </button>
              <input
                type="url"
                value={slideForm.imageUrl}
                onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                placeholder="Atau tempel URL gambar..."
                className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subjudul / Tagline Atas (Warna Hijau) *
            </label>
            <input
              type="text"
              required
              value={slideForm.tagline}
              onChange={(e) => setSlideForm({ ...slideForm, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Utama Hero (Headline Besar) *
            </label>
            <input
              type="text"
              required
              value={slideForm.title}
              onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Paragraf Hero *
            </label>
            <textarea
              rows={3}
              required
              value={slideForm.description}
              onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teks Tombol Slide
              </label>
              <input
                type="text"
                value={slideForm.buttonText}
                onChange={(e) => setSlideForm({ ...slideForm, buttonText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Tautan Tombol
              </label>
              <input
                type="text"
                value={slideForm.buttonLink}
                onChange={(e) => setSlideForm({ ...slideForm, buttonLink: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSlideModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
            >
              Simpan Slide Hero
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
