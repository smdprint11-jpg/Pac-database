import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginModal } from './components/auth/LoginModal';
import { Navbar } from './components/landing/Navbar';
import { HeroCarousel } from './components/landing/HeroCarousel';
import { QuickStats } from './components/landing/QuickStats';
import { AboutSection } from './components/landing/AboutSection';
import { LeadershipSection } from './components/landing/LeadershipSection';
import { DirectorySection } from './components/landing/DirectorySection';
import { NewsSection } from './components/landing/NewsSection';
import { GallerySection } from './components/landing/GallerySection';
import { ContactSection } from './components/landing/ContactSection';
import { Footer } from './components/landing/Footer';
import {
  ProfilPacDedicatedPage,
  PelindungPembinaDedicatedPage,
} from './components/landing/DedicatedPages';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { CheckCircle2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentUser, settings } = useApp();
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [publicPage, setPublicPage] = useState<'home' | 'profil-pac' | 'pelindung-pembina'>('home');
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoginTransitioning, setIsLoginTransitioning] = useState(false);

  const handleSmoothPageChange = (
    targetPage: 'home' | 'profil-pac' | 'pelindung-pembina',
    scrollSelector?: string
  ) => {
    if (targetPage === publicPage && !scrollSelector) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsPageTransitioning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setPublicPage(targetPage);
      setTimeout(() => {
        setIsPageTransitioning(false);
        if (scrollSelector && scrollSelector.startsWith('#')) {
          const targetId = scrollSelector.replace('#', '');
          const el = document.getElementById(targetId);
          if (el) {
            const offset = el.getBoundingClientRect().top + window.pageYOffset - 72;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }
      }, 60);
    }, 220);
  };

  // If URL has ?view=dashboard or hash #dashboard / #login / #profil-pac / #pelindung-pembina
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setIsLoginModalOpen(true);
      } else if (hash === '#dashboard' && currentUser) {
        setViewMode('dashboard');
      } else if (hash === '#profil-pac') {
        setViewMode('landing');
        handleSmoothPageChange('profil-pac');
      } else if (hash === '#pelindung-pembina') {
        setViewMode('landing');
        handleSmoothPageChange('pelindung-pembina');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentUser]);

  // If user logs out, go back to landing
  useEffect(() => {
    if (!currentUser && viewMode === 'dashboard') {
      setViewMode('landing');
    }
  }, [currentUser, viewMode]);

  const handleSmoothLoginSuccess = () => {
    setIsLoginTransitioning(true);
    setTimeout(() => {
      setViewMode('dashboard');
      setTimeout(() => {
        setIsLoginTransitioning(false);
      }, 280);
    }, 450);
  };

  // Global Typography, Uploaded Font & Custom CSS injection
  const typo = settings.typographyConfig || {};
  const activeFontFamily =
    typo.customFontDataUrl && typo.customFontName
      ? `'${typo.customFontName}', sans-serif`
      : typo.fontFamily || 'Inter, system-ui, sans-serif';

  const dynamicStyleContent = `
    ${
      typo.customFontDataUrl && typo.customFontName
        ? `@font-face {
            font-family: '${typo.customFontName}';
            src: url('${typo.customFontDataUrl}');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }`
        : ''
    }
    body, .app-typography-root {
      font-family: ${activeFontFamily};
      ${typo.bodyFontSize ? `font-size: ${typo.bodyFontSize};` : ''}
      ${typo.lineHeight ? `line-height: ${typo.lineHeight};` : ''}
    }
    ${
      typo.paragraphAlign
        ? `.app-typography-root p.cms-paragraph, .app-typography-root main p { text-align: ${typo.paragraphAlign}; }`
        : ''
    }
    ${settings.customCss || ''}
  `;

  return (
    <div className="app-typography-root min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      <style>{dynamicStyleContent}</style>

      {/* Smooth Login Welcome Overlay */}
      {isLoginTransitioning && (
        <div className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Otentikasi Berhasil</h3>
            <p className="text-xs text-slate-500 mt-1">
              Menyiapkan ruang kerja manajemen <span className="font-bold text-emerald-700">{currentUser?.fullName}</span>...
            </p>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full w-full animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}

      {viewMode === 'dashboard' && currentUser ? (
        <DashboardLayout
          onBackToLanding={() => {
            setViewMode('landing');
            handleSmoothPageChange('home');
          }}
        />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onGoToDashboard={() => setViewMode('dashboard')}
            activePublicPage={publicPage}
            onChangePublicPage={(page, href) => handleSmoothPageChange(page, href)}
          />
          <main
            className={`flex-1 transition-all duration-300 ease-out ${
              isPageTransitioning
                ? 'opacity-0 translate-y-2 scale-[0.995]'
                : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            {publicPage === 'profil-pac' ? (
              <ProfilPacDedicatedPage
                onBackHome={() => handleSmoothPageChange('home')}
                onSwitchPage={(page) => handleSmoothPageChange(page)}
              />
            ) : publicPage === 'pelindung-pembina' ? (
              <PelindungPembinaDedicatedPage
                onBackHome={() => handleSmoothPageChange('home')}
                onSwitchPage={(page) => handleSmoothPageChange(page)}
              />
            ) : (
              <>
                <HeroCarousel onOpenLogin={() => setIsLoginModalOpen(true)} />
                <QuickStats />
                <AboutSection
                  onOpenDedicatedPage={(page) => handleSmoothPageChange(page)}
                />
                <LeadershipSection />
                <DirectorySection />
                <NewsSection />
                <GallerySection />
                <ContactSection />
              </>
            )}
          </main>
          <Footer />
        </div>
      )}

      {/* Global Modals & Toasts */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleSmoothLoginSuccess}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
