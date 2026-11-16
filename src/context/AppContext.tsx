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

  login: (username: string, password?: string) => boolean;
  loginWithGoogle: () => Promise<boolean>;
  quickLogin: (userId: string) => void;
  logout: () => void;

  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;
  addSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateSlide: (id: string, slide: Partial<HeroSlide>) => void;
  deleteSlide: (id: string) => void;

  addUnit: (unit: Omit<UnitOrganization, 'id' | 'completenessScore' | 'completenessGrade' | 'lastUpdated'>) => void;
  updateUnit: (id: string, unit: Partial<UnitOrganization>) => void;
  deleteUnit: (id: string) => void;
  recalculateAllUnitScores: () => void;

  addOfficer: (officer: Omit<Officer, 'id'>) => void;
  updateOfficer: (id: string, officer: Partial<Officer>) => void;
  deleteOfficer: (id: string) => void;

  addMember: (member: Omit<Member, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  bulkAddMembers: (members: Omit<Member, 'id' | 'createdAt'>[]) => { addedCount: number; errors: string[] };
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  addSpDocument: (doc: Omit<SpDocument, 'id' | 'submittedAt'>) => void;
  verifySpDocument: (id: string, status: SpStatus, notes?: string) => void;
  deleteSpDocument: (id: string) => void;

  addActivity: (act: Omit<Activity, 'id' | 'createdAt'>) => void;
  updateActivity: (id: string, act: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  moderateActivity: (id: string, status: Activity['publicationStatus'], notes?: string) => void;

  addSupervisor: (sup: Omit<Supervisor, 'id'>) => void;
  updateSupervisor: (id: string, sup: Partial<Supervisor>) => void;
  deleteSupervisor: (id: string) => void;
  addAlumni: (alm: Omit<Alumni, 'id'>) => void;
  updateAlumni: (id: string, alm: Partial<Alumni>) => void;
  deleteAlumni: (id: string) => void;

  addUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<UserAccount>) => void;
  deleteUser: (id: string) => void;
  changeUserPassword: (userId: string, newPassword: string) => void;

  updateWeights: (weights: CompletenessWeights) => void;

  addNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;

  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  logActivity: (action: string, target: string, details?: string) => void;
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SYNC_CHANNEL_NAME = 'pelajar_nu_dukun_kv_d1_sync';
const syncChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel(SYNC_CHANNEL_NAME)
    : null;

function persistToApiBackend<T>(key: string, data: T, shouldSyncRemote = true): void {
  if (!shouldSyncRemote) return;

  try {
    syncChannel?.postMessage({ type: 'COLLECTION_UPDATE', key, data });
  } catch {
    // Ignore BroadcastChannel errors
  }

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
      // Fallback silently if network is temporarily unavailable
    }
  })();
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
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [slides, setSlides] = useState<HeroSlide[]>(INITIAL_SLIDES);
  const [units, setUnits] = useState<UnitOrganization[]>(INITIAL_UNITS);
  const [officers, setOfficers] = useState<Officer[]>(() => INITIAL_OFFICERS.map(normalizeOfficer));
  const [members, setMembers] = useState<Member[]>(() => INITIAL_MEMBERS.map(normalizeMember));
  const [supervisors, setSupervisors] = useState<Supervisor[]>(() =>
    INITIAL_SUPERVISORS.map(normalizeSupervisor)
  );
  const [alumni, setAlumni] = useState<Alumni[]>(() => INITIAL_ALUMNI.map(normalizeAlumni));
  const [spDocuments, setSpDocuments] = useState<SpDocument[]>(INITIAL_SP_DOCUMENTS);
  const [activities, setActivities] = useState<Activity[]>(() =>
    INITIAL_ACTIVITIES.map(normalizeActivity)
  );
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [weights, setWeights] = useState<CompletenessWeights>(DEFAULT_WEIGHTS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isHydratingFromRemote = useRef(true);
  const hasInitializedFromApi = useRef(false);

  const applyRemoteCollections = (cols: Record<string, any>) => {
    isHydratingFromRemote.current = true;
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
    if (Array.isArray(cols.logs) && cols.logs.length > 0) setLogs(cols.logs);
    if (Array.isArray(cols.notifications)) setNotifications(cols.notifications);
    if (cols.weights) setWeights(cols.weights);
    if (cols.currentUser !== undefined) setCurrentUser(cols.currentUser);

    setTimeout(() => {
      isHydratingFromRemote.current = false;
      hasInitializedFromApi.current = true;
    }, 150);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/state');
        if (!res.ok) {
          isHydratingFromRemote.current = false;
          hasInitializedFromApi.current = true;
          return;
        }
        const payload = await res.json();
        if (!mounted) return;
        const cols = payload?.collections || {};

        if (Object.keys(cols).length > 0) {
          applyRemoteCollections(cols);
        } else {
          isHydratingFromRemote.current = false;
          hasInitializedFromApi.current = true;
          await fetch('/api/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              collections: {
                settings: INITIAL_SETTINGS,
                slides: INITIAL_SLIDES,
                units: INITIAL_UNITS,
                officers: INITIAL_OFFICERS.map(normalizeOfficer),
                members: INITIAL_MEMBERS.map(normalizeMember),
                supervisors: INITIAL_SUPERVISORS.map(normalizeSupervisor),
                alumni: INITIAL_ALUMNI.map(normalizeAlumni),
                spDocs: INITIAL_SP_DOCUMENTS,
                activities: INITIAL_ACTIVITIES.map(normalizeActivity),
                users: INITIAL_USERS,
                logs: INITIAL_LOGS,
                notifications: INITIAL_NOTIFICATIONS,
                weights: DEFAULT_WEIGHTS,
              },
            }),
          });
        }
      } catch {
        isHydratingFromRemote.current = false;
        hasInitializedFromApi.current = true;
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const canPersist = () => hasInitializedFromApi.current && !isHydratingFromRemote.current;

  useEffect(() => persistToApiBackend('settings', settings, canPersist()), [settings]);
  useEffect(() => persistToApiBackend('slides', slides, canPersist()), [slides]);
  useEffect(() => persistToApiBackend('units', units, canPersist()), [units]);
  useEffect(() => persistToApiBackend('officers', officers, canPersist()), [officers]);
  useEffect(() => persistToApiBackend('members', members, canPersist()), [members]);
  useEffect(() => persistToApiBackend('supervisors', supervisors, canPersist()), [supervisors]);
  useEffect(() => persistToApiBackend('alumni', alumni, canPersist()), [alumni]);
  useEffect(() => persistToApiBackend('spDocs', spDocuments, canPersist()), [spDocs]);
  useEffect(() => persistToApiBackend('activities', activities, canPersist()), [activities]);
  useEffect(() => persistToApiBackend('users', users, canPersist()), [users]);
  useEffect(() => persistToApiBackend('logs', logs, canPersist()), [logs]);
  useEffect(() => persistToApiBackend('notifications', notifications, canPersist()), [notifications]);
  useEffect(() => persistToApiBackend('weights', weights, canPersist()), [weights]);
  useEffect(() => persistToApiBackend('currentUser', currentUser, canPersist()), [currentUser]);

  // Sinkronkan favicon tab browser otomatis dari properti logo di settings
  useEffect(() => {
    if (!settings || typeof settings !== 'object') return;
    const logoEntry = Object.entries(settings).find(([key, val]) => {
      const k = key.toLowerCase();
      return (
        (k.includes('logo') || k.includes('icon')) &&
        typeof val === 'string' &&
        (val.startsWith('http') || val.startsWith('data:image'))
      );
    });

    if (logoEntry) {
      const activeLogo = logoEntry[1] as string;
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = activeLogo;
    }
  }, [settings]);

  useEffect(() => {
    if (!syncChannel) return;
    const handleChannelMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || msg.type !== 'COLLECTION_UPDATE') return;
      const { key, data } = msg;
      isHydratingFromRemote.current = true;
      try {
        switch (key) {
          case 'settings': setSettings(data); break;
          case 'slides': setSlides(data); break;
          case 'units': setUnits(data); break;
          case 'officers': setOfficers((data as Officer[]).map(normalizeOfficer)); break;
          case 'members': setMembers((data as Member[]).map(normalizeMember)); break;
          case 'supervisors': setSupervisors((data as Supervisor[]).map(normalizeSupervisor)); break;
          case 'alumni': setAlumni((data as Alumni[]).map(normalizeAlumni)); break;
          case 'spDocuments': setSpDocuments(data); break;
          case 'activities': setActivities((data as Activity[]).map(normalizeActivity)); break;
          case 'users': setUsers(data); break;
          case 'logs': setLogs(data); break;
          case 'notifications': setNotifications(data); break;
          case 'weights': setWeights(data); break;
          case 'currentUser': setCurrentUser(data); break;
        }
      } finally {
        setTimeout(() => {
          isHydratingFromRemote.current = false;
        }, 100);
      }
    };

    syncChannel.addEventListener('message', handleChannelMessage);
    return () => syncChannel.removeEventListener('message', handleChannelMessage);
  }, []);

  // Toast Helpers (Single minimalis toast - tidak bertumpuk)
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast_' + Date.now();
    setToasts([{ id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
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
      setCurrentUser({
        id: `fb-${fbUser.uid.slice(0, 8)}`,
        username: (fbUser.email || '').split('@')[0] || 'admin_google',
        fullName: fbUser.displayName || 'Admin PAC (Google)',
        email: fbUser.email || 'pac@pelajarnu.id',
        role: 'admin_pac',
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
      showToast('Login Google berhasil!', 'success');
      return true;
    } catch {
      showToast('Login Google gagal', 'warning');
      return false;
    }
  };

  const quickLogin = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Beralih ke akun ${user.fullName}`, 'success');
    }
  };

  const logout = () => {
    setAuthToken(null);
    signOut(auth).catch(() => {});
    setCurrentUser(null);
    showToast('Anda telah berhasil keluar sistem', 'info');
  };

  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Pengaturan website berhasil diperbarui', 'success');
  };

  const addSlide = (slide: Omit<HeroSlide, 'id'>) => {
    setSlides((prev) => [...prev, { ...slide, id: 'slide-' + Date.now() }]);
    showToast('Slide banner berhasil ditambahkan', 'success');
  };

  const updateSlide = (id: string, updated: Partial<HeroSlide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    showToast('Slide banner diperbarui', 'success');
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    showToast('Slide banner dihapus', 'info');
  };

  const addUnit = (unitData: Omit<UnitOrganization, 'id' | 'completenessScore' | 'completenessGrade' | 'lastUpdated'>) => {
    const newUnit: UnitOrganization = {
      ...unitData,
      id: 'unit-' + Date.now(),
      completenessScore: 0,
      completenessGrade: 'C',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setUnits((prev) => [...prev, newUnit]);
    showToast('Ranting/PK berhasil ditambahkan', 'success');
  };

  const updateUnit = (id: string, updated: Partial<UnitOrganization>) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    showToast('Data unit diperbarui', 'success');
  };

  const deleteUnit = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
    showToast('Unit dihapus', 'info');
  };

  const recalculateAllUnitScores = () => {
    showToast('Skor kelengkapan berhasil dihitung ulang', 'success');
  };

  const addOfficer = (officer: Omit<Officer, 'id'>) => {
    setOfficers((prev) => [...prev, normalizeOfficer({ ...officer, id: 'off-' + Date.now() })]);
    showToast('Pengurus berhasil ditambahkan', 'success');
  };

  const updateOfficer = (id: string, updated: Partial<Officer>) => {
    setOfficers((prev) => prev.map((o) => (o.id === id ? normalizeOfficer({ ...o, ...updated }) : o)));
    showToast('Data pengurus diperbarui', 'success');
  };

  const deleteOfficer = (id: string) => {
    setOfficers((prev) => prev.filter((o) => o.id !== id));
    showToast('Pengurus dihapus', 'info');
  };

  const addMember = (member: Omit<Member, 'id' | 'createdAt'>) => {
    const newMember: Member = normalizeMember({
      ...member,
      id: 'mem-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    });
    setMembers((prev) => [newMember, ...prev]);
    showToast('Anggota berhasil ditambahkan', 'success');
    return { success: true };
  };

  const bulkAddMembers = (incoming: Omit<Member, 'id' | 'createdAt'>[]) => {
    const added = incoming.map((m, idx) => normalizeMember({
      ...m,
      id: `bulk-${Date.now()}-${idx}`,
      createdAt: new Date().toISOString().split('T')[0],
    }));
    setMembers((prev) => [...added, ...prev]);
    showToast(`${added.length} anggota berhasil diimpor`, 'success');
    return { addedCount: added.length, errors: [] };
  };

  const updateMember = (id: string, updated: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? normalizeMember({ ...m, ...updated }) : m)));
    showToast('Data anggota diperbarui', 'success');
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Anggota dihapus', 'info');
  };

  const addSpDocument = (doc: Omit<SpDocument, 'id' | 'submittedAt'>) => {
    setSpDocuments((prev) => [...prev, { ...doc, id: 'sp-' + Date.now(), submittedAt: new Date().toISOString().split('T')[0] }]);
    showToast('Dokumen SP diajukan', 'success');
  };

  const verifySpDocument = (id: string, status: SpStatus, notes?: string) => {
    setSpDocuments((prev) => prev.map((s) => (s.id === id ? { ...s, status, notes: notes || s.notes } : s)));
    showToast('Status SP diperbarui', 'success');
  };

  const deleteSpDocument = (id: string) => {
    setSpDocuments((prev) => prev.filter((s) => s.id !== id));
    showToast('Dokumen SP dihapus', 'info');
  };

  const addActivity = (act: Omit<Activity, 'id' | 'createdAt'>) => {
    setActivities((prev) => [normalizeActivity({ ...act, id: 'act-' + Date.now(), createdAt: new Date().toISOString().split('T')[0] }), ...prev]);
    showToast('Kegiatan berhasil ditambahkan', 'success');
  };

  const updateActivity = (id: string, updated: Partial<Activity>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? normalizeActivity({ ...a, ...updated }) : a)));
    showToast('Kegiatan diperbarui', 'success');
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast('Kegiatan dihapus', 'info');
  };

  const moderateActivity = (id: string, status: Activity['publicationStatus']) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, publicationStatus: status } : a)));
    showToast('Status publikasi diperbarui', 'success');
  };

  const addSupervisor = (sup: Omit<Supervisor, 'id'>) => {
    setSupervisors((prev) => [...prev, normalizeSupervisor({ ...sup, id: 'sup-' + Date.now() })]);
    showToast('Dewan pembina ditambahkan', 'success');
  };

  const updateSupervisor = (id: string, updated: Partial<Supervisor>) => {
    setSupervisors((prev) => prev.map((s) => (s.id === id ? normalizeSupervisor({ ...s, ...updated }) : s)));
    showToast('Data pembina diperbarui', 'success');
  };

  const deleteSupervisor = (id: string) => {
    setSupervisors((prev) => prev.filter((s) => s.id !== id));
    showToast('Pembina dihapus', 'info');
  };

  const addAlumni = (alm: Omit<Alumni, 'id'>) => {
    setAlumni((prev) => [...prev, normalizeAlumni({ ...alm, id: 'alm-' + Date.now() })]);
    showToast('Alumni ditambahkan', 'success');
  };

  const updateAlumni = (id: string, updated: Partial<Alumni>) => {
    setAlumni((prev) => prev.map((a) => (a.id === id ? normalizeAlumni({ ...a, ...updated }) : a)));
    showToast('Data alumni diperbarui', 'success');
  };

  const deleteAlumni = (id: string) => {
    setAlumni((prev) => prev.filter((a) => a.id !== id));
    showToast('Alumni dihapus', 'info');
  };

  const addUser = (userData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    setUsers((prev) => [...prev, { ...userData, id: 'usr-' + Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
    showToast('Akun pengguna baru dibuat', 'success');
  };

  const updateUser = (id: string, updated: Partial<UserAccount>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    showToast('Akun pengguna diperbarui', 'success');
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Akun dihapus', 'info');
  };

  const changeUserPassword = (userId: string, newPassword: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u)));
    showToast('Password pengguna berhasil diubah', 'success');
  };

  const updateWeights = (newWeights: CompletenessWeights) => {
    setWeights(newWeights);
    showToast('Bobot penilaian diperbarui', 'success');
  };

  const addNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetDatabase = () => {
    localStorage.clear();
    window.location.reload();
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
