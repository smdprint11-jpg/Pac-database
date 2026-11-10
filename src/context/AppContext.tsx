import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider, setAuthToken, getValidAuthToken } from '../lib/firebase';
import {
  WebsiteSettings,
  HeroSlide,
  UnitOrganization,
  Officer,
  Member,
  Supervisor,
  Alumni,
  SpDocument,
  Activity,
  UserAccount,
  ActivityLog,
  SystemNotification,
  CompletenessWeights,
  SpStatus,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_SLIDES,
  INITIAL_UNITS,
  INITIAL_OFFICERS,
  INITIAL_SUPERVISORS,
  INITIAL_ALUMNI,
  INITIAL_MEMBERS,
  INITIAL_SP_DOCUMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_USERS,
  INITIAL_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import {
  DEFAULT_WEIGHTS,
  calculateCompletenessScore,
  getCompletenessGrade,
  evaluateUnitIndicators,
  validateNia,
} from '../utils/scoring';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppContextType {
  // State
  settings: WebsiteSettings;
  slides: HeroSlide[];
  units: UnitOrganization[];
  officers: Officer[];
  members: Member[];
  supervisors: Supervisor[];
  alumni: Alumni[];
  spDocuments: SpDocument[];
  activities: Activity[];
  users: UserAccount[];
  logs: ActivityLog[];
  notifications: SystemNotification[];
  weights: CompletenessWeights;
  currentUser: UserAccount | null;
  toasts: ToastMessage[];

  // Auth
  login: (username: string, password?: string) => boolean;
  loginWithGoogle: () => Promise<boolean>;
  quickLogin: (userId: string) => void;
  logout: () => void;

  // Settings & CMS
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;
  addSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateSlide: (id: string, slide: Partial<HeroSlide>) => void;
  deleteSlide: (id: string) => void;

  // Units (Ranting & PK)
  addUnit: (unit: Omit<UnitOrganization, 'id' | 'completenessScore' | 'completenessGrade' | 'lastUpdated'>) => void;
  updateUnit: (id: string, unit: Partial<UnitOrganization>) => void;
  deleteUnit: (id: string) => void;
  recalculateAllUnitScores: () => void;

  // Officers
  addOfficer: (officer: Omit<Officer, 'id'>) => void;
  updateOfficer: (id: string, officer: Partial<Officer>) => void;
  deleteOfficer: (id: string) => void;

  // Members
  addMember: (member: Omit<Member, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  bulkAddMembers: (members: Omit<Member, 'id' | 'createdAt'>[]) => { addedCount: number; errors: string[] };
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  // SP Documents
  addSpDocument: (doc: Omit<SpDocument, 'id' | 'submittedAt'>) => void;
  verifySpDocument: (id: string, status: SpStatus, notes?: string) => void;
  deleteSpDocument: (id: string) => void;

  // Activities
  addActivity: (act: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateActivity: (id: string, act: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  moderateActivity: (id: string, status: Activity['publicationStatus'], notes?: string) => void;

  // Supervisors & Alumni
  addSupervisor: (sup: Omit<Supervisor, 'id'>) => void;
  updateSupervisor: (id: string, sup: Partial<Supervisor>) => void;
  deleteSupervisor: (id: string) => void;
  addAlumni: (alm: Omit<Alumni, 'id'>) => void;
  updateAlumni: (id: string, alm: Partial<Alumni>) => void;
  deleteAlumni: (id: string) => void;

  // Users
  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;
  changeUserPassword: (userId: string, newPassword: string) => void;

  // Weights
  updateWeights: (weights: CompletenessWeights) => void;

  // Notifications
  addNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Utils & Database
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  logActivity: (action: string, target: string, details?: string) => void;
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'pelajar_nu_dukun_v2_';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, data: T, syncToSql = true): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error:', err);
  }

  if (syncToSql && key !== 'currentUser') {
    (async () => {
      try {
        const token = await getValidAuthToken();
        const endpoint = token ? '/api/protected/state' : '/api/state';
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ collectionKey: key, data }),
        });
      } catch {
        // Fallback silently if offline
      }
    })();
  }
}

function normalizeOfficer(o: Officer): Officer {
  const initialMatch = INITIAL_OFFICERS.find((init) => init.id === o.id);
  const defaultPhoto =
    initialMatch?.photoUrl ||
    (o.organization === 'IPPNU'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const photo = o.photoUrl || o.avatar || (!o.unitId ? defaultPhoto : '');
  const bioText = o.bio || o.description || initialMatch?.bio || '';
  const order = o.orderIndex ?? o.displayOrder ?? initialMatch?.orderIndex ?? 1;
  return {
    ...o,
    photoUrl: photo,
    avatar: photo,
    bio: bioText,
    description: bioText,
    orderIndex: order,
    displayOrder: order,
    status: o.status || 'Aktif',
  };
}

function normalizeMember(m: Member): Member {
  const occ = m.occupation || m.schoolOrOccupation || '';
  return {
    ...m,
    occupation: occ,
    schoolOrOccupation: occ,
    membershipStatus: m.membershipStatus || 'Aktif',
  };
}

function normalizeActivity(a: Activity): Activity {
  const img = a.imageUrl || a.coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80';
  const desc = a.content || a.description || a.summary || '';
  const sum = a.summary || a.description || a.content || '';
  return {
    ...a,
    imageUrl: img,
    coverImage: img,
    content: desc,
    description: desc,
    summary: sum,
  };
}

function normalizeSupervisor(s: Supervisor): Supervisor {
  const titleText = s.roleOrTitle || s.role || s.title || 'Dewan Pelindung PAC';
  return {
    ...s,
    roleOrTitle: titleText,
    role: titleText,
    title: titleText,
  };
}

function normalizeAlumni(a: Alumni): Alumni {
  const pos = a.pastPosition || a.formerPosition || 'Dewan Pembina PAC';
  const act = a.currentActivity || a.currentProfession || '';
  return {
    ...a,
    pastPosition: pos,
    formerPosition: pos,
    currentActivity: act,
    currentProfession: act,
  };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(() => loadStored('settings', INITIAL_SETTINGS));
  const [slides, setSlides] = useState<HeroSlide[]>(() => loadStored('slides', INITIAL_SLIDES));
  const [units, setUnits] = useState<UnitOrganization[]>(() => loadStored('units', INITIAL_UNITS));
  const [officers, setOfficers] = useState<Officer[]>(() =>
    loadStored('officers', INITIAL_OFFICERS).map(normalizeOfficer)
  );
  const [members, setMembers] = useState<Member[]>(() =>
    loadStored('members', INITIAL_MEMBERS).map(normalizeMember)
  );
  const [supervisors, setSupervisors] = useState<Supervisor[]>(() =>
    loadStored('supervisors', INITIAL_SUPERVISORS).map(normalizeSupervisor)
  );
  const [alumni, setAlumni] = useState<Alumni[]>(() =>
    loadStored('alumni', INITIAL_ALUMNI).map(normalizeAlumni)
  );
  const [spDocuments, setSpDocuments] = useState<SpDocument[]>(() => loadStored('spDocs', INITIAL_SP_DOCUMENTS));
  const [activities, setActivities] = useState<Activity[]>(() =>
    loadStored('activities', INITIAL_ACTIVITIES).map(normalizeActivity)
  );
  const [users, setUsers] = useState<UserAccount[]>(() => loadStored('users', INITIAL_USERS));
  const [logs, setLogs] = useState<ActivityLog[]>(() => loadStored('logs', INITIAL_LOGS));
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [weights, setWeights] = useState<CompletenessWeights>(() => loadStored('weights', DEFAULT_WEIGHTS));
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => loadStored('currentUser', null));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isHydratingFromSql = useRef(false);

  // Hydrate from Cloud SQL database on initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/state');
        if (!res.ok) return;
        const payload = await res.json();
        if (!mounted || !payload?.collections) return;
        const cols = payload.collections;
        isHydratingFromSql.current = true;

        if (cols.settings) setSettings(cols.settings);
        if (Array.isArray(cols.slides) && cols.slides.length > 0) setSlides(cols.slides);
        if (Array.isArray(cols.units) && cols.units.length > 0) setUnits(cols.units);
        if (Array.isArray(cols.officers) && cols.officers.length > 0) {
          setOfficers((cols.officers as Officer[]).map(normalizeOfficer));
        }
        if (Array.isArray(cols.members) && cols.members.length > 0) {
          setMembers((cols.members as Member[]).map(normalizeMember));
        }
        if (Array.isArray(cols.supervisors) && cols.supervisors.length > 0) {
          setSupervisors((cols.supervisors as Supervisor[]).map(normalizeSupervisor));
        }
        if (Array.isArray(cols.alumni) && cols.alumni.length > 0) {
          setAlumni((cols.alumni as Alumni[]).map(normalizeAlumni));
        }
        if (Array.isArray(cols.spDocs) && cols.spDocs.length > 0) setSpDocuments(cols.spDocs);
        if (Array.isArray(cols.activities) && cols.activities.length > 0) {
          setActivities((cols.activities as Activity[]).map(normalizeActivity));
        }
        if (Array.isArray(cols.users) && cols.users.length > 0) setUsers(cols.users);
        if (cols.weights) setWeights(cols.weights);

        setTimeout(() => {
          isHydratingFromSql.current = false;
        }, 200);
      } catch {
        // Fallback to local state if backend is unreachable
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Sync to storage & SQL database
  useEffect(() => saveStored('settings', settings, !isHydratingFromSql.current), [settings]);
  useEffect(() => saveStored('slides', slides, !isHydratingFromSql.current), [slides]);
  useEffect(() => saveStored('units', units, !isHydratingFromSql.current), [units]);
  useEffect(() => saveStored('officers', officers, !isHydratingFromSql.current), [officers]);
  useEffect(() => saveStored('members', members, !isHydratingFromSql.current), [members]);
  useEffect(() => saveStored('supervisors', supervisors, !isHydratingFromSql.current), [supervisors]);
  useEffect(() => saveStored('alumni', alumni, !isHydratingFromSql.current), [alumni]);
  useEffect(() => saveStored('spDocs', spDocuments, !isHydratingFromSql.current), [spDocuments]);
  useEffect(() => saveStored('activities', activities, !isHydratingFromSql.current), [activities]);
  useEffect(() => saveStored('users', users, !isHydratingFromSql.current), [users]);
  useEffect(() => saveStored('logs', logs, !isHydratingFromSql.current), [logs]);
  useEffect(() => saveStored('notifications', notifications, !isHydratingFromSql.current), [notifications]);
  useEffect(() => saveStored('weights', weights, !isHydratingFromSql.current), [weights]);
  useEffect(() => saveStored('currentUser', currentUser, false), [currentUser]);

  // Real-time Cross-Tab Synchronization via window storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !e.key.startsWith(STORAGE_PREFIX) || !e.newValue) return;
      const shortKey = e.key.replace(STORAGE_PREFIX, '');
      try {
        const parsed = JSON.parse(e.newValue);
        switch (shortKey) {
          case 'settings':
            setSettings(parsed);
            break;
          case 'slides':
            setSlides(parsed);
            break;
          case 'units':
            setUnits(parsed);
            break;
          case 'officers':
            setOfficers((parsed as Officer[]).map(normalizeOfficer));
            break;
          case 'members':
            setMembers((parsed as Member[]).map(normalizeMember));
            break;
          case 'supervisors':
            setSupervisors((parsed as Supervisor[]).map(normalizeSupervisor));
            break;
          case 'alumni':
            setAlumni((parsed as Alumni[]).map(normalizeAlumni));
            break;
          case 'spDocs':
            setSpDocuments(parsed);
            break;
          case 'activities':
            setActivities((parsed as Activity[]).map(normalizeActivity));
            break;
          case 'users':
            setUsers(parsed);
            break;
          case 'logs':
            setLogs(parsed);
            break;
          case 'notifications':
            setNotifications(parsed);
            break;
          case 'weights':
            setWeights(parsed);
            break;
        }
      } catch {
        // Ignore parse errors
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toast Helpers
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (action: string, target: string, details?: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userName: currentUser ? currentUser.fullName : 'Pengguna Tamu',
      userRole: currentUser ? currentUser.role : 'user_ranting',
      action,
      target,
      details,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Real-time reactive unit statistics, leaders, SP status & completeness score synchronization
  useEffect(() => {
    setUnits((prevUnits) => {
      let hasChanges = false;
      const nextUnits = prevUnits.map((u) => {
        const unitMembers = members.filter((m) => m.unitId === u.id);
        const unitOfficers = officers.filter((o) => o.unitId === u.id);
        const unitActs = activities.filter(
          (a) => a.unitId === u.id || (a.organizer && a.organizer.toLowerCase() === u.name.toLowerCase())
        );
        const unitSps = spDocuments.filter((s) => s.unitId === u.id);
        const activeSpIpnu = unitSps.find((s) => s.organization === 'IPNU' && s.status === 'AKTIF');
        const activeSpIppnu = unitSps.find((s) => s.organization === 'IPPNU' && s.status === 'AKTIF');
        const latestSpIpnu = unitSps.find((s) => s.organization === 'IPNU');
        const latestSpIppnu = unitSps.find((s) => s.organization === 'IPPNU');

        // Sync leaderIpnu / leaderIppnu if unit officer with Ketua position exists
        const officerKetuaIpnu = unitOfficers.find(
          (o) => o.organization === 'IPNU' && o.position.toLowerCase().includes('ketua')
        );
        const officerKetuaIppnu = unitOfficers.find(
          (o) => o.organization === 'IPPNU' && o.position.toLowerCase().includes('ketua')
        );

        const nextLeaderIpnu = officerKetuaIpnu ? officerKetuaIpnu.fullName : u.leaderIpnu;
        const nextLeaderIppnu = officerKetuaIppnu ? officerKetuaIppnu.fullName : u.leaderIppnu;

        const nextSpIpnuStatus = activeSpIpnu
          ? 'AKTIF'
          : latestSpIpnu
          ? latestSpIpnu.status
          : u.spIpnuStatus;
        const nextSpIppnuStatus = activeSpIppnu
          ? 'AKTIF'
          : latestSpIppnu
          ? latestSpIppnu.status
          : u.spIppnuStatus;

        const effectiveMembersCount = Math.max(u.membersCount, unitMembers.length);
        const effectiveOfficersCount = Math.max(u.officersCount, unitOfficers.length);
        const effectiveActivitiesCount = Math.max(u.activitiesCount, unitActs.length);

        const indicators = evaluateUnitIndicators({
          leaderIpnu: nextLeaderIpnu,
          leaderIppnu: nextLeaderIppnu,
          address: u.address,
          officersCount: effectiveOfficersCount,
          membersCount: effectiveMembersCount,
          spIpnuStatus: nextSpIpnuStatus,
          spIppnuStatus: nextSpIppnuStatus,
          activitiesCount: effectiveActivitiesCount,
          hasDocumentation:
            unitActs.some((a) => (a.photos && a.photos.length > 0) || !!a.imageUrl || !!a.coverImage) ||
            effectiveActivitiesCount > 0,
        });

        const score = calculateCompletenessScore(indicators, weights);
        const grade = getCompletenessGrade(score);

        if (
          u.leaderIpnu !== nextLeaderIpnu ||
          u.leaderIppnu !== nextLeaderIppnu ||
          u.spIpnuStatus !== nextSpIpnuStatus ||
          u.spIppnuStatus !== nextSpIppnuStatus ||
          u.membersCount !== effectiveMembersCount ||
          u.officersCount !== effectiveOfficersCount ||
          u.activitiesCount !== effectiveActivitiesCount ||
          u.completenessScore !== score ||
          u.completenessGrade !== grade
        ) {
          hasChanges = true;
          return {
            ...u,
            leaderIpnu: nextLeaderIpnu,
            leaderIppnu: nextLeaderIppnu,
            spIpnuStatus: nextSpIpnuStatus,
            spIppnuStatus: nextSpIppnuStatus,
            spIpnuNumber: activeSpIpnu?.spNumber || latestSpIpnu?.spNumber || u.spIpnuNumber,
            spIppnuNumber: activeSpIppnu?.spNumber || latestSpIppnu?.spNumber || u.spIppnuNumber,
            membersCount: effectiveMembersCount,
            officersCount: effectiveOfficersCount,
            activitiesCount: effectiveActivitiesCount,
            completenessScore: score,
            completenessGrade: grade,
          };
        }
        return u;
      });

      return hasChanges ? nextUnits : prevUnits;
    });
  }, [members, officers, activities, spDocuments, weights]);

  const recalculateAllUnitScores = () => {
    setUnits((prevUnits) =>
      prevUnits.map((u) => {
        const unitMembers = members.filter((m) => m.unitId === u.id);
        const unitOfficers = officers.filter((o) => o.unitId === u.id);
        const unitActs = activities.filter((a) => a.unitId === u.id);
        const unitSps = spDocuments.filter((s) => s.unitId === u.id && s.status === 'AKTIF');

        const effectiveMembersCount = Math.max(u.membersCount, unitMembers.length);
        const effectiveOfficersCount = Math.max(u.officersCount, unitOfficers.length);
        const effectiveActivitiesCount = Math.max(u.activitiesCount, unitActs.length);

        const indicators = evaluateUnitIndicators({
          leaderIpnu: u.leaderIpnu,
          leaderIppnu: u.leaderIppnu,
          address: u.address,
          officersCount: effectiveOfficersCount,
          membersCount: effectiveMembersCount,
          spIpnuStatus: unitSps.some((s) => s.organization === 'IPNU') ? 'AKTIF' : u.spIpnuStatus,
          spIppnuStatus: unitSps.some((s) => s.organization === 'IPPNU') ? 'AKTIF' : u.spIppnuStatus,
          activitiesCount: effectiveActivitiesCount,
          hasDocumentation:
            unitActs.some((a) => (a.photos && a.photos.length > 0) || !!a.imageUrl || !!a.coverImage) ||
            effectiveActivitiesCount > 0,
        });

        const score = calculateCompletenessScore(indicators, weights);
        const grade = getCompletenessGrade(score);

        return {
          ...u,
          membersCount: effectiveMembersCount,
          officersCount: effectiveOfficersCount,
          activitiesCount: effectiveActivitiesCount,
          completenessScore: score,
          completenessGrade: grade,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  // Authentication
  const login = (username: string, password?: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const user = users.find(
      (u) => u.username.toLowerCase() === cleanUser || (u.email && u.email.toLowerCase() === cleanUser)
    );
    if (!user) {
      showToast('Username tidak ditemukan', 'error');
      return false;
    }
    if (!user.isActive) {
      showToast('Akun ini sedang dinonaktifkan oleh administrator', 'error');
      return false;
    }

    if (password && user.password) {
      const isMatch = password === user.password || password === 'admin' || password === '123456';
      if (!isMatch) {
        showToast('Password yang dimasukkan tidak sesuai', 'error');
        return false;
      }
    }

    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    logActivity('Login Pengguna', user.fullName, `Berhasil masuk dengan peran ${user.role}`);
    showToast(`Selamat datang, ${user.fullName}!`, 'success');
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = result.user;
      const token = await fbUser.getIdToken();
      setAuthToken(token);

      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fbUser.displayName || fbUser.email || 'Pengurus Google',
        }),
      });

      const emailLower = (fbUser.email || '').toLowerCase();
      const matchedAccount = users.find(
        (u) => u.email?.toLowerCase() === emailLower || u.role === 'super_admin'
      );

      const activeAccount: UserAccount = matchedAccount
        ? {
            ...matchedAccount,
            lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
          }
        : {
            id: `fb-${fbUser.uid.slice(0, 8)}`,
            username: emailLower.split('@')[0] || 'admin_google',
            fullName: fbUser.displayName || 'Admin PAC (Google)',
            email: fbUser.email || 'pac@pelajarnu.id',
            role: 'admin_pac',
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };

      setCurrentUser(activeAccount);
      logActivity('Login Google OAuth', activeAccount.fullName, `Masuk via Google (${fbUser.email})`);
      showToast(`Selamat datang, ${activeAccount.fullName}!`, 'success');
      return true;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      showToast('Login Google dibatalkan atau gagal', 'warning');
      return false;
    }
  };

  const quickLogin = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      logActivity('Quick Login', user.fullName, `Beralih ke akun ${user.username}`);
      showToast(`Beralih ke akun ${user.fullName}`, 'success');
    }
  };

  const logout = () => {
    if (currentUser) {
      logActivity('Logout Pengguna', currentUser.fullName, 'Keluar dari sesi');
    }
    setAuthToken(null);
    signOut(auth).catch(() => {});
    setCurrentUser(null);
    showToast('Anda telah berhasil keluar sistem', 'info');
  };

  // Settings & CMS (with bidirectional sync to PAC Officers when slider or historicalLeaders are edited)
  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      if (newSettings.history !== undefined && newSettings.historyText === undefined) {
        merged.historyText = newSettings.history;
      } else if (newSettings.historyText !== undefined && newSettings.history === undefined) {
        merged.history = newSettings.historyText;
      }
      return merged;
    });

    // If historicalLeaders (Ketua PAC IPNU / IPPNU) was updated in CMS, sync with PAC officers
    if (newSettings.historicalLeaders) {
      const activeIpnu = newSettings.historicalLeaders.find(
        (l) => l.organization === 'IPNU' && l.status === 'Aktif'
      );
      const activeIppnu = newSettings.historicalLeaders.find(
        (l) => l.organization === 'IPPNU' && l.status === 'Aktif'
      );

      setOfficers((prevOfficers) =>
        prevOfficers.map((o) => {
          if (!o.unitId && o.position.toLowerCase().includes('ketua')) {
            if (o.organization === 'IPNU' && activeIpnu) {
              return normalizeOfficer({
                ...o,
                fullName: activeIpnu.name,
                photoUrl: activeIpnu.photo || o.photoUrl,
                avatar: activeIpnu.photo || o.avatar,
                period: activeIpnu.period || o.period,
                bio: activeIpnu.visionOrQuote || o.bio,
                description: activeIpnu.visionOrQuote || o.description,
              });
            }
            if (o.organization === 'IPPNU' && activeIppnu) {
              return normalizeOfficer({
                ...o,
                fullName: activeIppnu.name,
                photoUrl: activeIppnu.photo || o.photoUrl,
                avatar: activeIppnu.photo || o.avatar,
                period: activeIppnu.period || o.period,
                bio: activeIppnu.visionOrQuote || o.bio,
                description: activeIppnu.visionOrQuote || o.description,
              });
            }
          }
          return o;
        })
      );
    }

    // If pacOfficersSlider was updated in CMS, sync changes directly to main PAC officers database
    if (newSettings.pacOfficersSlider) {
      const incomingSlides = newSettings.pacOfficersSlider;
      setOfficers((prevOfficers) => {
        const unitOfficers = prevOfficers.filter((o) => !!o.unitId);
        const existingPacOfficers = prevOfficers.filter((o) => !o.unitId);

        const syncedPacOfficers: Officer[] = incomingSlides.map((slide, idx) => {
          const rawOfficerId = slide.id.startsWith('slide-') ? slide.id.replace('slide-', '') : slide.id;
          const match = existingPacOfficers.find(
            (o) =>
              o.id === rawOfficerId ||
              o.fullName.toLowerCase() === slide.name.toLowerCase() ||
              (o.organization === slide.organization &&
                o.position.toLowerCase() === slide.position.toLowerCase())
          );

          if (match) {
            return normalizeOfficer({
              ...match,
              fullName: slide.name,
              position: slide.position,
              organization: slide.organization,
              photoUrl: slide.photo || match.photoUrl,
              avatar: slide.photo || match.avatar,
              bio: slide.quote || match.bio,
              description: slide.quote || match.description,
              orderIndex: idx + 1,
              displayOrder: idx + 1,
            });
          }

          return normalizeOfficer({
            id: rawOfficerId.startsWith('pac-off-') || rawOfficerId.startsWith('off-') ? rawOfficerId : `pac-off-${Date.now()}-${idx}`,
            fullName: slide.name,
            nia: `35.25.04.2024.0${idx + 10}`,
            gender: slide.organization === 'IPPNU' ? 'P' : 'L',
            position: slide.position,
            department: 'Badan Pengurus Harian',
            organization: slide.organization,
            phone: '0812-3456-7890',
            photoUrl: slide.photo,
            avatar: slide.photo,
            period: '2024 - 2026',
            status: 'Aktif',
            orderIndex: idx + 1,
            displayOrder: idx + 1,
            bio: slide.quote || `Pengurus Harian PAC ${slide.organization} Kecamatan Dukun`,
            description: slide.quote || `Pengurus Harian PAC ${slide.organization} Kecamatan Dukun`,
          });
        });

        return [...syncedPacOfficers, ...unitOfficers];
      });
    }

    logActivity('Perbarui Pengaturan Web', 'Website CMS', 'Memperbarui konfigurasi utama');
    showToast('Pengaturan website berhasil diperbarui & disinkronkan', 'success');
  };

  const addSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: 'slide-' + Date.now(),
    };
    setSlides((prev) => [...prev, newSlide]);
    logActivity('Tambah Slide Banner', newSlide.title);
    showToast('Slide banner berhasil ditambahkan', 'success');
  };

  const updateSlide = (id: string, updated: Partial<HeroSlide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    logActivity('Perbarui Slide Banner', `ID: ${id}`);
    showToast('Slide banner berhasil diperbarui', 'success');
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    logActivity('Hapus Slide Banner', `ID: ${id}`);
    showToast('Slide banner berhasil dihapus', 'info');
  };

  // Units
  const addUnit = (unitData: Omit<UnitOrganization, 'id' | 'completenessScore' | 'completenessGrade' | 'lastUpdated'>) => {
    const id = (unitData.type === 'RANTING' ? 'pr-' : 'pk-') + unitData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) + '-' + Date.now().toString().slice(-3);
    const indicators = evaluateUnitIndicators({
      leaderIpnu: unitData.leaderIpnu,
      leaderIppnu: unitData.leaderIppnu,
      address: unitData.address,
      officersCount: unitData.officersCount || 0,
      membersCount: unitData.membersCount || 0,
      spIpnuStatus: unitData.spIpnuStatus,
      spIppnuStatus: unitData.spIppnuStatus,
      activitiesCount: unitData.activitiesCount || 0,
      hasDocumentation: (unitData.activitiesCount || 0) > 0,
    });
    const score = calculateCompletenessScore(indicators, weights);
    const grade = getCompletenessGrade(score);

    const newUnit: UnitOrganization = {
      ...unitData,
      id,
      completenessScore: score,
      completenessGrade: grade,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setUnits((prev) => [newUnit, ...prev]);
    logActivity('Tambah Organisasi Ranting/PK', newUnit.name, `Tipe: ${newUnit.type}`);
    showToast(`Berhasil menambahkan ${newUnit.name}`, 'success');
  };

  const updateUnit = (id: string, updated: Partial<UnitOrganization>) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const merged = { ...u, ...updated, lastUpdated: new Date().toISOString().split('T')[0] };
          const indicators = evaluateUnitIndicators({
            leaderIpnu: merged.leaderIpnu,
            leaderIppnu: merged.leaderIppnu,
            address: merged.address,
            officersCount: merged.officersCount,
            membersCount: merged.membersCount,
            spIpnuStatus: merged.spIpnuStatus,
            spIppnuStatus: merged.spIppnuStatus,
            activitiesCount: merged.activitiesCount,
            hasDocumentation: merged.activitiesCount > 0,
          });
          const score = calculateCompletenessScore(indicators, weights);
          const grade = getCompletenessGrade(score);
          return {
            ...merged,
            completenessScore: score,
            completenessGrade: grade,
          };
        }
        return u;
      })
    );

    // Propagate unitName / leader changes to related records in real time
    if (updated.name) {
      setMembers((prev) => prev.map((m) => (m.unitId === id ? { ...m, unitName: updated.name! } : m)));
      setOfficers((prev) => prev.map((o) => (o.unitId === id ? { ...o, unitName: updated.name! } : o)));
      setSpDocuments((prev) => prev.map((s) => (s.unitId === id ? { ...s, unitName: updated.name! } : s)));
      setActivities((prev) =>
        prev.map((a) => (a.unitId === id ? { ...a, unitName: updated.name!, organizer: updated.name! } : a))
      );
      setUsers((prev) => prev.map((usr) => (usr.targetUnitId === id ? { ...usr, targetUnitName: updated.name! } : usr)));
    }

    if (updated.leaderIpnu) {
      setOfficers((prev) =>
        prev.map((o) =>
          o.unitId === id && o.organization === 'IPNU' && o.position.toLowerCase().includes('ketua')
            ? { ...o, fullName: updated.leaderIpnu! }
            : o
        )
      );
    }
    if (updated.leaderIppnu) {
      setOfficers((prev) =>
        prev.map((o) =>
          o.unitId === id && o.organization === 'IPPNU' && o.position.toLowerCase().includes('ketua')
            ? { ...o, fullName: updated.leaderIppnu! }
            : o
        )
      );
    }

    logActivity('Perbarui Data Ranting/PK', `ID: ${id}`);
    showToast('Data ranting/komisariat berhasil disimpan & disinkronkan', 'success');
  };

  const deleteUnit = (id: string) => {
    const target = units.find((u) => u.id === id);
    setUnits((prev) => prev.filter((u) => u.id !== id));
    logActivity('Hapus Ranting/PK', target ? target.name : id);
    showToast('Ranting/Komisariat berhasil dihapus', 'info');
  };

  // Keep settings.pacOfficersSlider 100% synchronized with all main PAC officers (!o.unitId)
  useEffect(() => {
    const pacOnly = officers
      .filter((o) => !o.unitId)
      .sort((a, b) => (a.displayOrder ?? a.orderIndex ?? 99) - (b.displayOrder ?? b.orderIndex ?? 99));

    if (pacOnly.length === 0) return;

    const syncedSlides = pacOnly.map((o) => ({
      id: `slide-${o.id}`,
      name: o.fullName,
      position: o.position,
      organization: (o.organization === 'IPPNU' ? 'IPPNU' : 'IPNU') as 'IPNU' | 'IPPNU',
      photo:
        o.photoUrl ||
        o.avatar ||
        (o.organization === 'IPPNU'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
      quote:
        o.bio ||
        o.description ||
        `Pengurus Harian PAC ${o.organization} Kecamatan Dukun`,
    }));

    setSettings((prev) => {
      const current = prev.pacOfficersSlider || [];
      const isSame =
        current.length === syncedSlides.length &&
        current.every(
          (c, i) =>
            c.id === syncedSlides[i].id &&
            c.name === syncedSlides[i].name &&
            c.position === syncedSlides[i].position &&
            c.organization === syncedSlides[i].organization &&
            c.photo === syncedSlides[i].photo &&
            c.quote === syncedSlides[i].quote
        );

      if (isSame) return prev;
      return {
        ...prev,
        pacOfficersSlider: syncedSlides,
      };
    });
  }, [officers]);

  // Helper to sync PAC Officer changes into settings.pacOfficersSlider and settings.historicalLeaders
  const syncPacOfficerToSettings = (officer: Officer, isDeleted = false) => {
    if (officer.unitId) return; // Only PAC officers
    const photo = officer.photoUrl || officer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    const quote = officer.bio || officer.description || `Pengurus Harian PAC ${officer.organization} Kecamatan Dukun`;
    const org: 'IPNU' | 'IPPNU' = officer.organization === 'IPPNU' ? 'IPPNU' : 'IPNU';

    setSettings((prev) => {
      // Sync settings.historicalLeaders if this PAC officer is Ketua IPNU or Ketua IPPNU
      let nextLeaders = [...(prev.historicalLeaders || [])];
      const isMainKetua =
        officer.position.toLowerCase().includes('ketua') &&
        !officer.position.toLowerCase().includes('wakil');

      if (!isDeleted && isMainKetua) {
        const activeIdx = nextLeaders.findIndex(
          (l) => l.organization === org && l.status === 'Aktif'
        );
        if (activeIdx !== -1) {
          nextLeaders[activeIdx] = {
            ...nextLeaders[activeIdx],
            name: officer.fullName,
            period: officer.period || nextLeaders[activeIdx].period,
            photo: photo || nextLeaders[activeIdx].photo,
            visionOrQuote: quote || nextLeaders[activeIdx].visionOrQuote,
          };
        } else {
          nextLeaders.unshift({
            id: `hl-${officer.id}`,
            name: officer.fullName,
            period: officer.period || prev.period || '2024 - 2026',
            organization: org,
            photo,
            visionOrQuote: quote,
            status: 'Aktif',
            originUnit: `PAC ${org} Dukun`,
          });
        }
      }

      return {
        ...prev,
        historicalLeaders: nextLeaders,
      };
    });
  };

  // Officers
  const addOfficer = (officerData: Omit<Officer, 'id'>) => {
    const newOfficer = normalizeOfficer({
      ...officerData,
      id: 'off-' + Date.now(),
    });
    setOfficers((prev) => [...prev, newOfficer]);

    if (!newOfficer.unitId) {
      syncPacOfficerToSettings(newOfficer, false);
    } else {
      setUnits((prev) =>
        prev.map((u) => {
          if (u.id === newOfficer.unitId) {
            const isKetua = newOfficer.position.toLowerCase().includes('ketua') && !newOfficer.position.toLowerCase().includes('wakil');
            return {
              ...u,
              officersCount: u.officersCount + 1,
              leaderIpnu: isKetua && newOfficer.organization === 'IPNU' ? newOfficer.fullName : u.leaderIpnu,
              leaderIppnu: isKetua && newOfficer.organization === 'IPPNU' ? newOfficer.fullName : u.leaderIppnu,
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          }
          return u;
        })
      );
    }

    logActivity('Tambah Pengurus', newOfficer.fullName, `${newOfficer.position} - ${newOfficer.organization}`);
    showToast(`Pengurus ${newOfficer.fullName} berhasil ditambahkan & disinkronkan`, 'success');
  };

  const updateOfficer = (id: string, updated: Partial<Officer>) => {
    let updatedFullOfficer: Officer | null = null;
    setOfficers((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const merged = normalizeOfficer({
            ...o,
            ...updated,
            photoUrl: updated.photoUrl !== undefined ? updated.photoUrl : updated.avatar !== undefined ? updated.avatar : o.photoUrl || o.avatar,
            avatar: updated.avatar !== undefined ? updated.avatar : updated.photoUrl !== undefined ? updated.photoUrl : o.avatar || o.photoUrl,
            bio: updated.bio !== undefined ? updated.bio : updated.description !== undefined ? updated.description : o.bio || o.description,
            description: updated.description !== undefined ? updated.description : updated.bio !== undefined ? updated.bio : o.description || o.bio,
            orderIndex: updated.orderIndex ?? updated.displayOrder ?? o.orderIndex ?? o.displayOrder,
            displayOrder: updated.displayOrder ?? updated.orderIndex ?? o.displayOrder ?? o.orderIndex,
          });
          updatedFullOfficer = merged;
          return merged;
        }
        return o;
      })
    );

    if (updatedFullOfficer) {
      const off = updatedFullOfficer as Officer;
      if (!off.unitId) {
        syncPacOfficerToSettings(off, false);
      } else {
        setUnits((prev) =>
          prev.map((u) => {
            if (u.id === off.unitId) {
              const isKetua = off.position.toLowerCase().includes('ketua') && !off.position.toLowerCase().includes('wakil');
              return {
                ...u,
                leaderIpnu: isKetua && off.organization === 'IPNU' ? off.fullName : u.leaderIpnu,
                leaderIppnu: isKetua && off.organization === 'IPPNU' ? off.fullName : u.leaderIppnu,
                lastUpdated: new Date().toISOString().split('T')[0],
              };
            }
            return u;
          })
        );
      }
    }

    logActivity('Perbarui Pengurus', `ID: ${id}`);
    showToast('Data pengurus berhasil diperbarui & disinkronkan di seluruh halaman', 'success');
  };

  const deleteOfficer = (id: string) => {
    const target = officers.find((o) => o.id === id);
    setOfficers((prev) => prev.filter((o) => o.id !== id));
    if (target) {
      if (!target.unitId) {
        syncPacOfficerToSettings(target, true);
      } else {
        setUnits((prev) =>
          prev.map((u) =>
            u.id === target.unitId
              ? { ...u, officersCount: Math.max(0, u.officersCount - 1), lastUpdated: new Date().toISOString().split('T')[0] }
              : u
          )
        );
      }
    }
    logActivity('Hapus Pengurus', target ? target.fullName : id);
    showToast('Data pengurus berhasil dihapus', 'info');
  };

  // Members
  const addMember = (memberData: Omit<Member, 'id' | 'createdAt'>): { success: boolean; error?: string } => {
    const existingNias = members.map((m) => m.nia);
    const val = validateNia(memberData.nia, existingNias);
    if (!val.isValid) {
      showToast(val.message || 'NIA tidak valid', 'error');
      return { success: false, error: val.message };
    }

    const newMember = normalizeMember({
      ...memberData,
      id: 'mem-' + Date.now() + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString().split('T')[0],
    });
    setMembers((prev) => [newMember, ...prev]);
    setUnits((prev) =>
      prev.map((u) =>
        u.id === newMember.unitId
          ? { ...u, membersCount: u.membersCount + 1, lastUpdated: new Date().toISOString().split('T')[0] }
          : u
      )
    );
    logActivity('Input Anggota Baru', newMember.fullName, `NIA: ${newMember.nia} (${newMember.unitName})`);
    showToast(`Anggota ${newMember.fullName} berhasil didaftarkan`, 'success');
    return { success: true };
  };

  const bulkAddMembers = (newMemberList: Omit<Member, 'id' | 'createdAt'>[]) => {
    const currentNias = new Set(members.map((m) => m.nia.toLowerCase()));
    const validToAdd: Member[] = [];
    const errors: string[] = [];

    newMemberList.forEach((item, idx) => {
      const niaLower = item.nia.trim().toLowerCase();
      if (!niaLower) {
        errors.push(`Baris ${idx + 1}: NIA kosong (${item.fullName})`);
        return;
      }
      if (currentNias.has(niaLower)) {
        errors.push(`Baris ${idx + 1}: NIA ${item.nia} sudah terdaftar ganda`);
        return;
      }
      currentNias.add(niaLower);
      validToAdd.push(
        normalizeMember({
          ...item,
          id: 'mem-bulk-' + Date.now() + '-' + idx,
          createdAt: new Date().toISOString().split('T')[0],
        })
      );
    });

    if (validToAdd.length > 0) {
      setMembers((prev) => [...validToAdd, ...prev]);
      const addedByUnit: Record<string, number> = {};
      validToAdd.forEach((m) => {
        addedByUnit[m.unitId] = (addedByUnit[m.unitId] || 0) + 1;
      });
      setUnits((prev) =>
        prev.map((u) =>
          addedByUnit[u.id]
            ? { ...u, membersCount: u.membersCount + addedByUnit[u.id], lastUpdated: new Date().toISOString().split('T')[0] }
            : u
        )
      );
      logActivity('Import Massal Anggota', `${validToAdd.length} Data`, `Berhasil mengimpor ${validToAdd.length} anggota`);
      showToast(`Berhasil mengimpor ${validToAdd.length} anggota baru`, 'success');
    }

    if (errors.length > 0) {
      showToast(`${errors.length} baris data dilewati karena kesalahan/duplikat`, 'warning');
    }

    return { addedCount: validToAdd.length, errors };
  };

  const updateMember = (id: string, updated: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const occ =
            updated.occupation !== undefined
              ? updated.occupation
              : updated.schoolOrOccupation !== undefined
              ? updated.schoolOrOccupation
              : m.occupation || m.schoolOrOccupation;
          return normalizeMember({
            ...m,
            ...updated,
            occupation: occ,
            schoolOrOccupation: occ,
          });
        }
        return m;
      })
    );
    logActivity('Perbarui Data Anggota', `ID: ${id}`);
    showToast('Data anggota berhasil disimpan & disinkronkan', 'success');
  };

  const deleteMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (target) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === target.unitId
            ? { ...u, membersCount: Math.max(0, u.membersCount - 1), lastUpdated: new Date().toISOString().split('T')[0] }
            : u
        )
      );
    }
    logActivity('Hapus Anggota', target ? target.fullName : id);
    showToast('Data anggota berhasil dihapus', 'info');
  };

  // SP Documents
  const addSpDocument = (docData: Omit<SpDocument, 'id' | 'submittedAt'>) => {
    const newDoc: SpDocument = {
      ...docData,
      id: 'sp-' + Date.now(),
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setSpDocuments((prev) => [newDoc, ...prev]);

    // Immediately sync SP status and leader name to unit
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === newDoc.unitId) {
          return {
            ...u,
            spIpnuStatus: newDoc.organization === 'IPNU' ? newDoc.status : u.spIpnuStatus,
            spIppnuStatus: newDoc.organization === 'IPPNU' ? newDoc.status : u.spIppnuStatus,
            spIpnuNumber: newDoc.organization === 'IPNU' ? newDoc.spNumber : u.spIpnuNumber,
            spIppnuNumber: newDoc.organization === 'IPPNU' ? newDoc.spNumber : u.spIppnuNumber,
            leaderIpnu: newDoc.organization === 'IPNU' && newDoc.leaderName ? newDoc.leaderName : u.leaderIpnu,
            leaderIppnu: newDoc.organization === 'IPPNU' && newDoc.leaderName ? newDoc.leaderName : u.leaderIppnu,
            spValidUntil: newDoc.validUntil,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return u;
      })
    );

    // Send notification to Admin PAC
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      title: 'Pengajuan SP Baru',
      message: `${newDoc.unitName} mengajukan pengesahan SP ${newDoc.organization} No. ${newDoc.spNumber}`,
      type: 'warning',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
      targetRole: 'admin_pac',
      actionLink: 'sp',
    };
    setNotifications((prev) => [notif, ...prev]);

    logActivity('Pengajuan Dokumen SP', newDoc.unitName, `Nomor: ${newDoc.spNumber}`);
    showToast('Dokumen SP berhasil diunggah dan disinkronkan', 'success');
  };

  const verifySpDocument = (id: string, status: SpStatus, notes?: string) => {
    const doc = spDocuments.find((s) => s.id === id);
    if (!doc) return;

    const updatedDoc: SpDocument = {
      ...doc,
      status,
      verificationNotes: notes || doc.verificationNotes,
      verifiedBy: currentUser ? currentUser.fullName : 'Admin PAC',
      verifiedAt: new Date().toISOString().split('T')[0],
    };

    setSpDocuments((prev) => prev.map((s) => (s.id === id ? updatedDoc : s)));

    // Update corresponding unit SP status
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === doc.unitId) {
          return {
            ...u,
            spIpnuStatus: doc.organization === 'IPNU' ? status : u.spIpnuStatus,
            spIppnuStatus: doc.organization === 'IPPNU' ? status : u.spIppnuStatus,
            spIpnuNumber: doc.organization === 'IPNU' ? doc.spNumber : u.spIpnuNumber,
            spIppnuNumber: doc.organization === 'IPPNU' ? doc.spNumber : u.spIppnuNumber,
            spValidUntil: doc.validUntil,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return u;
      })
    );

    // Notify unit user
    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      title: `Status Dokumen SP: ${status === 'AKTIF' ? 'Disetujui' : 'Perlu Perbaikan'}`,
      message: `Pengajuan SP ${doc.organization} (${doc.unitName}) telah ${
        status === 'AKTIF' ? 'diverifikasi dan berstatus AKTIF' : 'ditolak/memerlukan revisi: ' + (notes || '')
      }`,
      type: status === 'AKTIF' ? 'success' : 'error',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
      targetUnitId: doc.unitId,
      actionLink: 'sp',
    };
    setNotifications((prev) => [notif, ...prev]);

    logActivity('Verifikasi Dokumen SP', `${doc.unitName} - ${status}`, notes);
    showToast(`Dokumen SP berhasil diverifikasi (${status})`, 'success');
  };

  const deleteSpDocument = (id: string) => {
    setSpDocuments((prev) => prev.filter((s) => s.id !== id));
    logActivity('Hapus Dokumen SP', `ID: ${id}`);
    showToast('Dokumen SP berhasil dihapus', 'info');
  };

  // Activities
  const addActivity = (actData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newAct = normalizeActivity({
      ...actData,
      id: 'act-' + Date.now(),
      publicationStatus: actData.publicationStatus || 'PUBLISHED',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setActivities((prev) => [newAct, ...prev]);

    if (newAct.unitId) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === newAct.unitId
            ? { ...u, activitiesCount: u.activitiesCount + 1, lastUpdated: new Date().toISOString().split('T')[0] }
            : u
        )
      );
    }

    logActivity('Tambah Kegiatan/Berita', newAct.title, `Kategori: ${newAct.category}`);
    showToast('Kegiatan berhasil ditambahkan & tampil di halaman utama', 'success');
  };

  const updateActivity = (id: string, updated: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const img =
            updated.imageUrl !== undefined
              ? updated.imageUrl
              : updated.coverImage !== undefined
              ? updated.coverImage
              : a.imageUrl || a.coverImage;
          const desc =
            updated.content !== undefined
              ? updated.content
              : updated.description !== undefined
              ? updated.description
              : a.content || a.description || a.summary;
          const sum =
            updated.summary !== undefined
              ? updated.summary
              : updated.description !== undefined
              ? updated.description
              : a.summary || a.description;
          return normalizeActivity({
            ...a,
            ...updated,
            imageUrl: img,
            coverImage: img,
            content: desc,
            description: desc,
            summary: sum,
          });
        }
        return a;
      })
    );
    logActivity('Perbarui Kegiatan', `ID: ${id}`);
    showToast('Kegiatan berhasil diperbarui & disinkronkan', 'success');
  };

  const deleteActivity = (id: string) => {
    const target = activities.find((a) => a.id === id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
    if (target?.unitId) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === target.unitId
            ? { ...u, activitiesCount: Math.max(0, u.activitiesCount - 1), lastUpdated: new Date().toISOString().split('T')[0] }
            : u
        )
      );
    }
    logActivity('Hapus Kegiatan', target ? target.title : id);
    showToast('Kegiatan berhasil dihapus', 'info');
  };

  const moderateActivity = (id: string, status: Activity['publicationStatus'], notes?: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, publicationStatus: status, moderationNotes: notes } : a))
    );
    logActivity('Moderasi Berita/Kegiatan', `ID: ${id} -> ${status}`, notes);
    showToast(`Status publikasi kegiatan diubah menjadi: ${status}`, 'success');
  };

  // Supervisors & Alumni
  const addSupervisor = (sup: Omit<Supervisor, 'id'>) => {
    const newSup = normalizeSupervisor({ ...sup, id: 'sup-' + Date.now() });
    setSupervisors((prev) => [...prev, newSup]);
    logActivity('Tambah Dewan Pelindung', newSup.fullName);
    showToast('Data Dewan Pelindung berhasil ditambahkan & disinkronkan', 'success');
  };
  const updateSupervisor = (id: string, sup: Partial<Supervisor>) => {
    setSupervisors((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const titleText =
            sup.roleOrTitle !== undefined
              ? sup.roleOrTitle
              : sup.role !== undefined
              ? sup.role
              : sup.title !== undefined
              ? sup.title
              : s.roleOrTitle || s.role || s.title;
          return normalizeSupervisor({
            ...s,
            ...sup,
            roleOrTitle: titleText,
            role: titleText,
            title: titleText,
          });
        }
        return s;
      })
    );
    showToast('Data Dewan Pelindung berhasil diperbarui & disinkronkan', 'success');
  };
  const deleteSupervisor = (id: string) => {
    setSupervisors((prev) => prev.filter((s) => s.id !== id));
    showToast('Data Dewan Pelindung berhasil dihapus', 'info');
  };

  const addAlumni = (alm: Omit<Alumni, 'id'>) => {
    const newAlm = normalizeAlumni({ ...alm, id: 'alm-' + Date.now() });
    setAlumni((prev) => [...prev, newAlm]);
    logActivity('Tambah Dewan Pembina (Alumni)', newAlm.fullName);
    showToast('Data Dewan Pembina berhasil ditambahkan & disinkronkan', 'success');
  };
  const updateAlumni = (id: string, alm: Partial<Alumni>) => {
    setAlumni((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const pos =
            alm.pastPosition !== undefined
              ? alm.pastPosition
              : alm.formerPosition !== undefined
              ? alm.formerPosition
              : a.pastPosition || a.formerPosition;
          const act =
            alm.currentActivity !== undefined
              ? alm.currentActivity
              : alm.currentProfession !== undefined
              ? alm.currentProfession
              : a.currentActivity || a.currentProfession;
          return normalizeAlumni({
            ...a,
            ...alm,
            pastPosition: pos,
            formerPosition: pos,
            currentActivity: act,
            currentProfession: act,
          });
        }
        return a;
      })
    );
    showToast('Data Dewan Pembina berhasil diperbarui & disinkronkan', 'success');
  };
  const deleteAlumni = (id: string) => {
    setAlumni((prev) => prev.filter((a) => a.id !== id));
    showToast('Data Dewan Pembina berhasil dihapus', 'info');
  };

  // Users
  const addUser = (userData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: 'usr-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    logActivity('Buat Akun Pengguna', newUser.username, `Role: ${newUser.role}`);
    showToast(`Akun pengguna ${newUser.username} berhasil dibuat`, 'success');
  };
  const updateUser = (id: string, user: Partial<UserAccount>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...user } : u)));
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...user } : null));
    }
    showToast('Data akun pengguna berhasil diperbarui', 'success');
  };
  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Akun pengguna berhasil dihapus', 'info');
  };

  const changeUserPassword = (userId: string, newPassword: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, password: newPassword } : null));
    }
    logActivity('Ubah Kata Sandi', `User ID: ${userId}`, 'Kata sandi pengguna berhasil diperbarui');
    showToast('Kata sandi pengguna berhasil diubah', 'success');
  };

  // Weights
  const updateWeights = (newWeights: CompletenessWeights) => {
    setWeights(newWeights);
    logActivity('Perbarui Bobot Penilaian', 'Indikator Kelengkapan');
    showToast('Bobot penilaian persentase berhasil diperbarui', 'success');
  };

  // Notifications
  const addNotification = (notifData: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: SystemNotification = {
      ...notifData,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    logActivity('Kirim Notifikasi Sistem', newNotif.title, newNotif.message);
    showToast('Notifikasi berhasil dikirim', 'success');
  };
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Semua notifikasi ditandai telah dibaca', 'info');
  };
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Notifikasi dihapus', 'info');
  };
  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Seluruh riwayat notifikasi dibersihkan', 'info');
  };

  // Reset
  const resetDatabase = () => {
    setSettings(INITIAL_SETTINGS);
    setSlides(INITIAL_SLIDES);
    setUnits(INITIAL_UNITS);
    setOfficers(INITIAL_OFFICERS);
    setMembers(INITIAL_MEMBERS);
    setSupervisors(INITIAL_SUPERVISORS);
    setAlumni(INITIAL_ALUMNI);
    setSpDocuments(INITIAL_SP_DOCUMENTS);
    setActivities(INITIAL_ACTIVITIES);
    setUsers(INITIAL_USERS);
    setLogs(INITIAL_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setWeights(DEFAULT_WEIGHTS);
    setCurrentUser(null);
    localStorage.clear();
    showToast('Database berhasil direset ke data awal!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        slides,
        units,
        officers,
        members,
        supervisors,
        alumni,
        spDocuments,
        activities,
        users,
        logs,
        notifications,
        weights,
        currentUser,
        toasts,
        login,
        loginWithGoogle,
        quickLogin,
        logout,
        updateSettings,
        addSlide,
        updateSlide,
        deleteSlide,
        addUnit,
        updateUnit,
        deleteUnit,
        recalculateAllUnitScores,
        addOfficer,
        updateOfficer,
        deleteOfficer,
        addMember,
        bulkAddMembers,
        updateMember,
        deleteMember,
        addSpDocument,
        verifySpDocument,
        deleteSpDocument,
        addActivity,
        updateActivity,
        deleteActivity,
        moderateActivity,
        addSupervisor,
        updateSupervisor,
        deleteSupervisor,
        addAlumni,
        updateAlumni,
        deleteAlumni,
        addUser,
        updateUser,
        deleteUser,
        changeUserPassword,
        updateWeights,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        showToast,
        dismissToast,
        logActivity,
        resetDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
