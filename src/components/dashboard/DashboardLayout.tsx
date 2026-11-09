import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminOverview } from './AdminOverview';
import { BranchOverview } from './BranchOverview';
import { PacOfficersView } from './PacOfficersView';
import { BranchesDirectoryView } from './BranchesDirectoryView';
import { MembersView } from './MembersView';
import { SpDocumentsView } from './SpDocumentsView';
import { ScoringConfigView } from './ScoringConfigView';
import { ActivitiesView } from './ActivitiesView';
import { SupervisorsView } from './SupervisorsView';
import { UserManagementView } from './UserManagementView';
import { WebsiteSettingsView } from './WebsiteSettingsView';
import { ActivityLogsView } from './ActivityLogsView';
import {
  LayoutDashboard,
  Users,
  Building2,
  School,
  UserCheck,
  Award,
  GraduationCap,
  FileText,
  Calendar,
  Camera,
  BarChart3,
  ShieldCheck,
  Bell,
  Settings,
  Clock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Globe,
  Sliders,
} from 'lucide-react';

interface DashboardLayoutProps {
  onBackToLanding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onBackToLanding }) => {
  const {
    currentUser,
    users,
    quickLogin,
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    settings,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [userSwitcherOpen, setUserSwitcherOpen] = useState(false);

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_pac';
  const isBranchUser = currentUser?.role === 'user_ranting' || currentUser?.role === 'user_pk';

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const navMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: <LayoutDashboard className="w-4 h-4" />,
      allowed: true,
    },
    {
      id: 'pac-officers',
      label: 'Database Pengurus PAC',
      icon: <UserCheck className="w-4 h-4" />,
      allowed: isAdmin,
    },
    {
      id: 'branches',
      label: isBranchUser ? 'Profil Organisasi' : 'Database Ranting & PK',
      icon: <Building2 className="w-4 h-4" />,
      allowed: true,
    },
    {
      id: 'members',
      label: 'Database Anggota',
      icon: <Users className="w-4 h-4" />,
      allowed: true,
    },
    {
      id: 'supervisors',
      label: 'Pembina & Majelis Alumni',
      icon: <Award className="w-4 h-4" />,
      allowed: isAdmin,
    },
    {
      id: 'sp',
      label: 'Database & Upload SP',
      icon: <FileText className="w-4 h-4" />,
      allowed: true,
    },
    {
      id: 'activities',
      label: 'Berita & Kegiatan',
      icon: <Calendar className="w-4 h-4" />,
      allowed: true,
    },
    {
      id: 'scoring-config',
      label: 'Statistik & Penilaian',
      icon: <BarChart3 className="w-4 h-4" />,
      allowed: true,
    },
    {
      id: 'user-management',
      label: 'Manajemen User',
      icon: <ShieldCheck className="w-4 h-4" />,
      allowed: isAdmin,
    },
    {
      id: 'settings',
      label: 'Pengaturan Website',
      icon: <Settings className="w-4 h-4" />,
      allowed: isAdmin,
    },
    {
      id: 'logs',
      label: 'Log Aktivitas',
      icon: <Clock className="w-4 h-4" />,
      allowed: isAdmin,
    },
  ].filter((item) => item.allowed);

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileSidebarOpen(false);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return isBranchUser ? (
          <BranchOverview onNavigateTab={handleSelectTab} />
        ) : (
          <AdminOverview onNavigateTab={handleSelectTab} />
        );
      case 'pac-officers':
        return <PacOfficersView />;
      case 'branches':
      case 'pk-units':
        return <BranchesDirectoryView />;
      case 'members':
        return <MembersView />;
      case 'sp':
        return <SpDocumentsView />;
      case 'activities':
        return <ActivitiesView />;
      case 'supervisors':
        return <SupervisorsView />;
      case 'scoring-config':
        return <ScoringConfigView />;
      case 'user-management':
        return <UserManagementView />;
      case 'settings':
        return <WebsiteSettingsView />;
      case 'logs':
        return <ActivityLogsView />;
      default:
        return <AdminOverview onNavigateTab={handleSelectTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            aria-label="Buka menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white font-bold text-sm shadow-xs font-serif">
              NU
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                {settings.siteTitle}
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold -mt-0.5">
                Dashboard Management System
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Account Switcher dropdown button */}
          <div className="relative">
            <button
              onClick={() => setUserSwitcherOpen(!userSwitcherOpen)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Ganti akun untuk melihat perspektif hak akses berbeda"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Akun:</span>
              <strong className="text-slate-900 truncate max-w-[120px]">
                {currentUser?.fullName.split(' ')[0]}
              </strong>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 uppercase font-mono">
                {currentUser?.role.replace('user_', '').replace('_', ' ')}
              </span>
            </button>

            {userSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700">Ganti Perspektif Pengguna:</span>
                  <button onClick={() => setUserSwitcherOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        quickLogin(u.id);
                        setUserSwitcherOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between ${
                        currentUser?.id === u.id ? 'bg-emerald-50 font-bold text-emerald-950' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="truncate">{u.fullName}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{u.role.replace('_', ' ')}</div>
                      </div>
                      {currentUser?.id === u.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition relative cursor-pointer"
              aria-label="Pusat notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {notificationDrawerOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Pusat Notifikasi</span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      Tandai Semua Dibaca
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.actionLink) handleSelectTab(notif.actionLink);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                        notif.isRead
                          ? 'bg-slate-50/50 border-slate-100 text-slate-600'
                          : 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <strong className="leading-snug">{notif.title}</strong>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {(notif.timestamp || notif.createdAt || '').slice(11, 16)}
                        </span>
                      </div>
                      <p className="text-[11px] mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      Belum ada notifikasi baru
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Back to landing page */}
          <button
            onClick={onBackToLanding}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Lihat</span> Landing Page
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              onBackToLanding();
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Keluar Akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 z-20 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* User profile card inside sidebar */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
                {currentUser?.fullName.charAt(0) || 'U'}
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.fullName}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium truncate capitalize">
                    {currentUser?.role.replace('_', ' ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navMenuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
                  title={item.label}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Collapse Toggle */}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
              aria-label="Perkecil sidebar"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {!sidebarCollapsed && <span className="text-[11px]">Sembunyikan Menu</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[85%] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs font-serif">
                    NU
                  </div>
                  <span className="font-bold text-xs text-slate-900">Menu Manajemen</span>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navMenuItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                        isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    onBackToLanding();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{renderActiveView()}</div>
        </main>
      </div>
    </div>
  );
};
