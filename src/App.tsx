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
import { DashboardLayout } from './components/dashboard/DashboardLayout';

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // If URL has ?view=dashboard or hash #dashboard / #login
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setIsLoginModalOpen(true);
      } else if (hash === '#dashboard' && currentUser) {
        setViewMode('dashboard');
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {viewMode === 'dashboard' && currentUser ? (
        <DashboardLayout onBackToLanding={() => setViewMode('landing')} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onGoToDashboard={() => setViewMode('dashboard')}
          />
          <main className="flex-1">
            <HeroCarousel onOpenLogin={() => setIsLoginModalOpen(true)} />
            <QuickStats />
            <AboutSection />
            <LeadershipSection />
            <DirectorySection />
            <NewsSection />
            <GallerySection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      )}

      {/* Global Modals & Toasts */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setViewMode('dashboard')}
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
