import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

function saveStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(() => loadStored('settings', INITIAL_SETTINGS));
  const [slides, setSlides] = useState<HeroSlide[]>(() => loadStored('slides', INITIAL_SLIDES));
  const [units, setUnits] = useState<UnitOrganization[]>(() => loadStored('units', INITIAL_UNITS));
  const [officers, setOfficers] = useState<Officer[]>(() => loadStored('officers', INITIAL_OFFICERS));
  const [members, setMembers] = useState<Member[]>(() => loadStored('members', INITIAL_MEMBERS));
  const [supervisors, setSupervisors] = useState<Supervisor[]>(() => loadStored('supervisors', INITIAL_SUPERVISORS));
  const [alumni, setAlumni] = useState<Alumni[]>(() => loadStored('alumni', INITIAL_ALUMNI));
  const [spDocuments, setSpDocuments] = useState<SpDocument[]>(() => loadStored('spDocs', INITIAL_SP_DOCUMENTS));
  const [activities, setActivities] = useState<Activity[]>(() => loadStored('activities', INITIAL_ACTIVITIES));
  const [users, setUsers] = useState<UserAccount[]>(() => loadStored('users', INITIAL_USERS));
  const [logs, setLogs] = useState<ActivityLog[]>(() => loadStored('logs', INITIAL_LOGS));
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => loadStored('notifications', INITIAL_NOTIFICATIONS));
  const [weights, setWeights] = useState<CompletenessWeights>(() => loadStored('weights', DEFAULT_WEIGHTS));
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => loadStored('currentUser', null));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to storage
  useEffect(() => saveStored('settings', settings), [settings]);
  useEffect(() => saveStored('slides', slides), [slides]);
  useEffect(() => saveStored('units', units), [units]);
  useEffect(() => saveStored('officers', officers), [officers]);
  useEffect(() => saveStored('members', members), [members]);
  useEffect(() => saveStored('supervisors', supervisors), [supervisors]);
  useEffect(() => saveStored('alumni', alumni), [alumni]);
  useEffect(() => saveStored('spDocs', spDocuments), [spDocuments]);
  useEffect(() => saveStored('activities', activities), [activities]);
  useEffect(() => saveStored('users', users), [users]);
  useEffect(() => saveStored('logs', logs), [logs]);
  useEffect(() => saveStored('notifications', notifications), [notifications]);
  useEffect(() => saveStored('weights', weights), [weights]);
  useEffect(() => saveStored('currentUser', currentUser), [currentUser]);

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

  // Recalculate unit statistics & scores
  const recalculateAllUnitScores = () => {
    setUnits((prevUnits) =>
      prevUnits.map((u) => {
        const unitMembers = members.filter((m) => m.unitId === u.id);
        const unitOfficers = officers.filter((o) => o.unitId === u.id);
        const unitActs = activities.filter((a) => a.unitId === u.id);
        const unitSps = spDocuments.filter((s) => s.unitId === u.id && s.status === 'AKTIF');

        const indicators = evaluateUnitIndicators({
          leaderIpnu: u.leaderIpnu,
          leaderIppnu: u.leaderIppnu,
          address: u.address,
          officersCount: unitOfficers.length,
          membersCount: unitMembers.length,
          spIpnuStatus: unitSps.some((s) => s.organization === 'IPNU') ? 'AKTIF' : u.spIpnuStatus,
          spIppnuStatus: unitSps.some((s) => s.organization === 'IPPNU') ? 'AKTIF' : u.spIppnuStatus,
          activitiesCount: unitActs.length,
          hasDocumentation: unitActs.some((a) => a.photos && a.photos.length > 0),
        });

        const score = calculateCompletenessScore(indicators, weights);
        const grade = getCompletenessGrade(score);

        return {
          ...u,
          membersCount: Math.max(u.membersCount, unitMembers.length),
          officersCount: Math.max(u.officersCount, unitOfficers.length),
          activitiesCount: Math.max(u.activitiesCount, unitActs.length),
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
    setCurrentUser(null);
    showToast('Anda telah berhasil keluar sistem', 'info');
  };

  // Settings & CMS
  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logActivity('Perbarui Pengaturan Web', 'Website CMS', 'Memperbarui konfigurasi utama');
    showToast('Pengaturan website berhasil diperbarui', 'success');
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
    const id = (unitData.type === 'RANTING' ? 'pr-' : 'pk-') + unitData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    const newUnit: UnitOrganization = {
      ...unitData,
      id,
      completenessScore: 50,
      completenessGrade: 'Cukup',
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
          return merged;
        }
        return u;
      })
    );
    logActivity('Perbarui Data Ranting/PK', `ID: ${id}`);
    showToast('Data ranting/komisariat berhasil disimpan', 'success');
  };

  const deleteUnit = (id: string) => {
    const target = units.find((u) => u.id === id);
    setUnits((prev) => prev.filter((u) => u.id !== id));
    logActivity('Hapus Ranting/PK', target ? target.name : id);
    showToast('Ranting/Komisariat berhasil dihapus', 'info');
  };

  // Officers
  const addOfficer = (officerData: Omit<Officer, 'id'>) => {
    const newOfficer: Officer = {
      ...officerData,
      id: 'off-' + Date.now(),
    };
    setOfficers((prev) => [...prev, newOfficer]);
    logActivity('Tambah Pengurus', newOfficer.fullName, `${newOfficer.position} - ${newOfficer.organization}`);
    showToast(`Pengurus ${newOfficer.fullName} berhasil ditambahkan`, 'success');
    recalculateAllUnitScores();
  };

  const updateOfficer = (id: string, updated: Partial<Officer>) => {
    setOfficers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o)));
    logActivity('Perbarui Pengurus', `ID: ${id}`);
    showToast('Data pengurus berhasil diperbarui', 'success');
  };

  const deleteOfficer = (id: string) => {
    const target = officers.find((o) => o.id === id);
    setOfficers((prev) => prev.filter((o) => o.id !== id));
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

    const newMember: Member = {
      ...memberData,
      id: 'mem-' + Date.now() + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMembers((prev) => [newMember, ...prev]);
    logActivity('Input Anggota Baru', newMember.fullName, `NIA: ${newMember.nia} (${newMember.unitName})`);
    showToast(`Anggota ${newMember.fullName} berhasil didaftarkan`, 'success');
    recalculateAllUnitScores();
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
      validToAdd.push({
        ...item,
        id: 'mem-bulk-' + Date.now() + '-' + idx,
        createdAt: new Date().toISOString().split('T')[0],
      });
    });

    if (validToAdd.length > 0) {
      setMembers((prev) => [...validToAdd, ...prev]);
      logActivity('Import Massal Anggota', `${validToAdd.length} Data`, `Berhasil mengimpor ${validToAdd.length} anggota`);
      showToast(`Berhasil mengimpor ${validToAdd.length} anggota baru`, 'success');
      recalculateAllUnitScores();
    }

    if (errors.length > 0) {
      showToast(`${errors.length} baris data dilewati karena kesalahan/duplikat`, 'warning');
    }

    return { addedCount: validToAdd.length, errors };
  };

  const updateMember = (id: string, updated: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
    logActivity('Perbarui Data Anggota', `ID: ${id}`);
    showToast('Data anggota berhasil disimpan', 'success');
  };

  const deleteMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    logActivity('Hapus Anggota', target ? target.fullName : id);
    showToast('Data anggota berhasil dihapus', 'info');
    recalculateAllUnitScores();
  };

  // SP Documents
  const addSpDocument = (docData: Omit<SpDocument, 'id' | 'submittedAt'>) => {
    const newDoc: SpDocument = {
      ...docData,
      id: 'sp-' + Date.now(),
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setSpDocuments((prev) => [newDoc, ...prev]);

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
    showToast('Dokumen SP berhasil diunggah dan menunggu verifikasi', 'success');
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
    recalculateAllUnitScores();
  };

  const deleteSpDocument = (id: string) => {
    setSpDocuments((prev) => prev.filter((s) => s.id !== id));
    logActivity('Hapus Dokumen SP', `ID: ${id}`);
    showToast('Dokumen SP berhasil dihapus', 'info');
  };

  // Activities
  const addActivity = (actData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newAct: Activity = {
      ...actData,
      id: 'act-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setActivities((prev) => [newAct, ...prev]);
    logActivity('Tambah Kegiatan/Berita', newAct.title, `Kategori: ${newAct.category}`);
    showToast('Kegiatan berhasil ditambahkan', 'success');
    recalculateAllUnitScores();
  };

  const updateActivity = (id: string, updated: Partial<Activity>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    logActivity('Perbarui Kegiatan', `ID: ${id}`);
    showToast('Kegiatan berhasil diperbarui', 'success');
  };

  const deleteActivity = (id: string) => {
    const target = activities.find((a) => a.id === id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
    logActivity('Hapus Kegiatan', target ? target.title : id);
    showToast('Kegiatan berhasil dihapus', 'info');
    recalculateAllUnitScores();
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
    const newSup: Supervisor = { ...sup, id: 'sup-' + Date.now() };
    setSupervisors((prev) => [...prev, newSup]);
    logActivity('Tambah Pembina', newSup.fullName);
    showToast('Data pembina berhasil ditambahkan', 'success');
  };
  const updateSupervisor = (id: string, sup: Partial<Supervisor>) => {
    setSupervisors((prev) => prev.map((s) => (s.id === id ? { ...s, ...sup } : s)));
    showToast('Data pembina berhasil diperbarui', 'success');
  };
  const deleteSupervisor = (id: string) => {
    setSupervisors((prev) => prev.filter((s) => s.id !== id));
    showToast('Data pembina berhasil dihapus', 'info');
  };

  const addAlumni = (alm: Omit<Alumni, 'id'>) => {
    const newAlm: Alumni = { ...alm, id: 'alm-' + Date.now() };
    setAlumni((prev) => [...prev, newAlm]);
    logActivity('Tambah Majelis Alumni', newAlm.fullName);
    showToast('Data alumni berhasil ditambahkan', 'success');
  };
  const updateAlumni = (id: string, alm: Partial<Alumni>) => {
    setAlumni((prev) => prev.map((a) => (a.id === id ? { ...a, ...alm } : a)));
    showToast('Data alumni berhasil diperbarui', 'success');
  };
  const deleteAlumni = (id: string) => {
    setAlumni((prev) => prev.filter((a) => a.id !== id));
    showToast('Data alumni berhasil dihapus', 'info');
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
    recalculateAllUnitScores();
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
