import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn, ChevronRight, ChevronDown, Award, Users, BookOpen, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onGoToDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onGoToDashboard }) => {
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

  // Smooth scroll handler with sticky header offset
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navHeight = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    {
      name: 'Profil PAC',
      href: '#profil',
      hasDropdown: true,
      subItems: [
        { label: 'Profil & Sejarah PAC', href: '#profil', icon: <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> },
        { label: 'Database Ketua IPNU & IPPNU', href: '#ketua-ipnu-ippnu', icon: <Award className="w-3.5 h-3.5 text-amber-600" /> },
        { label: 'Database Dewan Pembina', href: '#pembina', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> },
        { label: 'Database Majelis Alumni', href: '#alumni', icon: <Users className="w-3.5 h-3.5 text-blue-600" /> },
      ],
    },
    { name: 'Kepengurusan', href: '#pengurus' },
    { name: 'Ranting & PK', href: '#ranting-pk' },
    { name: 'Berita & Kegiatan', href: '#kegiatan' },
    { name: 'Galeri', href: '#galeri' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const brandTitle = settings.navbarBrandTitle || settings.siteName || 'PELAJAR NU DUKUN';
  const brandSubtitle = settings.navbarBrandSubtitle || settings.organization || 'PAC IPNU IPPNU DUKUN';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100 py-2.5'
          : 'bg-white/85 backdrop-blur-sm border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <a
            href="#beranda"
            onClick={(e) => handleNavClick(e, '#beranda')}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            {settings.navbarLogoUrl ? (
              <img
                src={settings.navbarLogoUrl}
                alt={brandTitle}
                className="w-10 h-10 rounded-xl object-contain shadow-md group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <span className="font-bold text-base tracking-wider text-amber-300">NU</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                {brandTitle}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase">
                {brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          profileDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-emerald-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {item.subItems?.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href}
                            onClick={(e) => handleNavClick(e, sub.href)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                          >
                            <span className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                              {sub.icon}
                            </span>
                            <span>{sub.label}</span>
                          </a>
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
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  if (onGoToDashboard) onGoToDashboard();
                  else window.location.hash = '#dashboard';
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition-all cursor-pointer"
              >
                <span>Buka Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-700/20 hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Pengurus</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="sm:hidden inline-flex items-center p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Login Pengurus"
            >
              <LogIn className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 shadow-lg px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                      {item.name}
                    </div>
                    {item.subItems?.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        onClick={(e) => handleNavClick(e, sub.href)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      >
                        {sub.icon}
                        <span>{sub.label}</span>
                      </a>
                    ))}
                  </div>
                );
              }

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
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
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <span>Buka Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Pengurus</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
