import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  ArrowUp,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = settings.footerNavLinks && settings.footerNavLinks.length > 0
    ? settings.footerNavLinks
    : [
        { id: 'fn-1', label: 'Beranda Utama', url: '#beranda' },
        { id: 'fn-2', label: 'Profil & Sejarah PAC', url: '#profil' },
        { id: 'fn-3', label: 'Struktur Kepengurusan', url: '#pengurus' },
        { id: 'fn-4', label: 'Direktori Ranting & Komisariat', url: '#ranting-pk' },
        { id: 'fn-5', label: 'Berita & Agenda Kegiatan', url: '#kegiatan' },
        { id: 'fn-6', label: 'Galeri Dokumentasi', url: '#galeri' },
        { id: 'fn-7', label: 'Pusat Kontak Sekretariat', url: '#kontak' },
      ];

  const address = settings.footerAddress || settings.address || settings.contactAddress;
  const email = settings.footerEmail || settings.email || settings.contactEmail;
  const phone = settings.footerPhone || settings.phone || settings.contactPhone;
  const footerDescription = settings.footerDescription || settings.footerText;
  const copyright = settings.footerCopyright || '© 2026 PAC IPNU IPPNU DUKUN. Hak Cipta Dilindungi.';

  const appLogo = settings.navbarLogoUrl || settings.logoUrl;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-6 sm:pt-16 pb-5 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-10 pb-5 sm:pb-12 border-b border-slate-800/80">
          {/* Identity */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {appLogo ? (
                <img
                  src={appLogo}
                  alt={settings.siteName || 'Logo Organisasi'}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain bg-white p-1 shadow-lg shadow-emerald-900/40 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg shadow-emerald-900/40 font-serif shrink-0">
                  NU
                </div>
              )}
              <div>
                <span className="text-sm sm:text-lg font-black text-white tracking-tight block leading-tight">
                  {settings.navbarBrandTitle || settings.siteName || settings.siteTitle || 'PELAJAR NU DUKUN'}
                </span>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold block">
                  {settings.navbarBrandSubtitle || settings.organization || settings.organizationName || 'PAC IPNU IPPNU DUKUN'}
                </span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-sm line-clamp-2 sm:line-clamp-none">
              {footerDescription}
            </p>

            <div className="pt-1 text-[11px] sm:text-xs text-slate-400 space-y-1 sm:space-y-1.5">
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1 sm:line-clamp-none">{address}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-mono">{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Nav Links (Catatan Kaki Dinamis yang dapat diedit Admin PAC) */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-3">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Halaman
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-1.5 sm:space-y-2 text-[11px] sm:text-xs">
              {navLinks.map((item) => (
                <li key={item.id} className="truncate">
                  <a href={item.url} className="hover:text-emerald-400 transition">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Media Sosial & Informasi Banom */}
          <div className="lg:col-span-4 space-y-2.5 sm:space-y-4">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
              Saluran Informasi Resmi
            </h4>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              Ikuti kabar terbaru seputar kaderisasi, beasiswa pelajar, dan agenda keagamaan melalui media sosial kami.
            </p>

            <div className="flex items-center gap-2">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-red-600 hover:border-red-600 transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}
              {settings.socialLinks?.whatsapp && (
                <a
                  href={settings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}
            </div>

            <div className="p-2.5 sm:p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/60 text-[10px] sm:text-[11px] text-emerald-300">
              <strong className="block text-white mb-0.5">Satu Komando, Satu Barisan:</strong>
              Membina pelajar cerdas, berkarakter santri, dan setia pada NKRI.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 sm:pt-8 flex flex-row flex-wrap items-center justify-between text-[10px] sm:text-xs text-slate-400 gap-2 sm:gap-4">
          <div className="truncate">{copyright}</div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 font-semibold text-[11px] bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dikelola oleh PAC IPNU IPPNU DUKUN</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 hover:text-white hover:bg-slate-900 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-transparent hover:border-slate-800 transition cursor-pointer"
          >
            <span>Ke Atas</span>
            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
