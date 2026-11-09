import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onGoToDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onGoToDashboard }) => {
  const { settings, currentUser } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Profil PAC', href: '#profil' },
    { name: 'Kepengurusan', href: '#pengurus' },
    { name: 'Ranting & PK', href: '#ranting-pk' },
    { name: 'Berita & Kegiatan', href: '#kegiatan' },
    { name: 'Galeri', href: '#galeri' },
    { name: 'Kontak', href: '#kontak' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-100 py-2.5'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="#beranda" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <span className="font-bold text-base tracking-wider text-amber-300">NU</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-tight group-hover:text-emerald-700 transition-colors">
                {settings.siteName}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase">
                {settings.organization}
              </span>
            </div>
          </a>

          {/* Desktop Navigation (Tanpa link 'Database' sesuai permintaan) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            {currentUser ? (
              <a
                href="#dashboard-top"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = '#dashboard';
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition-all"
              >
                <span>Buka Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-700/20 hover:shadow-md transition-all active:scale-95"
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
              className="sm:hidden inline-flex items-center p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              title="Login Pengurus"
            >
              <LogIn className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
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
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-100">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.hash = '#dashboard';
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
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
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
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
