import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn, ChevronRight, ChevronDown, BookOpen, ShieldCheck, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onGoToDashboard?: () => void;
  activePublicPage?: 'home' | 'profil-pac' | 'pelindung-pembina';
  onChangePublicPage?: (page: 'home' | 'profil-pac' | 'pelindung-pembina', href?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onGoToDashboard,
  activePublicPage = 'home',
  onChangePublicPage,
}) => {
  const { settings, currentUser } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scroll handler with sticky header offset & dedicated page switch support
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
    targetPage?: 'home' | 'profil-pac' | 'pelindung-pembina'
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);

    if (targetPage && targetPage !== 'home') {
      if (onChangePublicPage) {
        onChangePublicPage(targetPage);
      }
      return;
    }

    if (activePublicPage !== 'home' && onChangePublicPage) {
      onChangePublicPage('home', href);
      return;
    }

    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navHeight = 72;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const appLogo = settings.navbarLogoUrl || settings.logoUrl;
  const navLabels = settings.navMenuLabels || {};

  const navLinks = [
    { name: navLabels.beranda || 'Beranda', href: '#beranda', page: 'home' as const },
    {
      name: navLabels.profil || 'Profil PAC',
      href: '#profil',
      hasDropdown: true,
      subItems: [
        {
          label: navLabels.profilSubSejarah || 'Profil & Sejarah PAC',
          subDesc: 'Sejarah, Visi-Misi, Data Ketua & Pengurus Harian',
          href: '#profil-pac',
          page: 'profil-pac' as const,
          icon: <BookOpen className="w-3.5 h-3.5 text-emerald-600" />,
        },
        {
          label: navLabels.profilSubPelindungPembina || 'Dewan Pelindung & Pembina',
          subDesc: 'Database Dewan Pelindung & Majelis Alumni',
          href: '#pelindung-pembina',
          page: 'pelindung-pembina' as const,
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />,
        },
      ],
    },
    { name: navLabels.pengurus || 'Kepengurusan', href: '#pengurus', page: 'home' as const },
    { name: navLabels.rantingPk || 'Ranting & PK', href: '#ranting-pk', page: 'home' as const },
    { name: navLabels.kegiatan || 'Berita & Kegiatan', href: '#kegiatan', page: 'home' as const },
    { name: navLabels.galeri || 'Galeri', href: '#galeri', page: 'home' as const },
    { name: navLabels.kontak || 'Kontak', href: '#kontak', page: 'home' as const },
  ];

  const brandTitle = settings.navbarBrandTitle || settings.siteName || 'PELAJAR NU DUKUN';
  const brandSubtitle = settings.navbarBrandSubtitle || settings.organization || 'PAC IPNU IPPNU DUKUN';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100 py-2'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <a
            href="#beranda"
            onClick={(e) => handleNavClick(e, '#beranda', 'home')}
            className="flex items-center space-x-2.5 sm:space-x-3 group cursor-pointer"
          >
            {appLogo ? (
              <img
                src={appLogo}
                alt={brandTitle}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <span className="font-bold text-sm sm:text-base tracking-wider text-amber-300">NU</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                {brandTitle}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 tracking-wider uppercase">
                {brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((item) => {
              if (item.hasDropdown) {
                const isProfileActive =
                  activePublicPage === 'profil-pac' || activePublicPage === 'pelindung-pembina';
                return (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                        isProfileActive
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          profileDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Profile Dropdown Menu (Clean 2 Items: Profil & Sejarah PAC + Dewan Pelindung & Pembina) */}
                    {profileDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-emerald-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {item.subItems?.map((sub) => (
                          <button
                            key={sub.label}
                            type="button"
                            onClick={(e) => handleNavClick(e, sub.href, sub.page)}
                            className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl transition cursor-pointer ${
                              activePublicPage === sub.page
                                ? 'bg-emerald-50 text-emerald-900'
                                : 'hover:bg-emerald-50/80 text-slate-700 hover:text-emerald-800'
                            }`}
                          >
                            <span className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                              {sub.icon}
                            </span>
                            <div>
                              <span className="block text-xs font-bold leading-snug">
                                {sub.label}
                              </span>
                              <span className="block text-[10px] text-slate-500 mt-0.5 leading-tight">
                                {sub.subDesc}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.page)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {activePublicPage !== 'home' && (
              <button
                type="button"
                onClick={(e) => handleNavClick(e, '#beranda', 'home')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{settings.dashboardMenuLabels?.menuUtamaBtn || 'MENU UTAMA'}</span>
              </button>
            )}
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  if (onGoToDashboard) onGoToDashboard();
                  else window.location.hash = '#dashboard';
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition-all cursor-pointer"
              >
                <span>{navLabels.openDashboardBtn || 'Buka Dashboard'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-700/20 hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{navLabels.loginBtn || 'Login Pengurus'}</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden space-x-1.5">
            <button
              type="button"
              onClick={onOpenLogin}
              className="sm:hidden inline-flex items-center p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Login Pengurus"
            >
              <LogIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 shadow-lg px-3 pt-2.5 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="space-y-1 bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                    <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                      {item.name}
                    </div>
                    {item.subItems?.map((sub) => (
                      <button
                        key={sub.label}
                        type="button"
                        onClick={(e) => handleNavClick(e, sub.href, sub.page)}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        {sub.icon}
                        <div>
                          <span className="block">{sub.label}</span>
                          <span className="block text-[10px] font-normal text-slate-500">{sub.subDesc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              }

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.page)}
                  className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  {item.name}
                </a>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-slate-100">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onGoToDashboard) onGoToDashboard();
                  else window.location.hash = '#dashboard';
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <span>{navLabels.openDashboardBtn || 'Buka Dashboard'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{navLabels.loginBtn || 'Login Pengurus'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
