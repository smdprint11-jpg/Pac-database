export type UserRole = 'super_admin' | 'admin_pac' | 'user_ranting' | 'user_pk';

export type OrganizationType = 'IPNU' | 'IPPNU' | 'KEDUANYA';

export type UnitType = 'RANTING' | 'KOMISARIAT';

export type ActiveStatus = 'AKTIF' | 'TIDAK_AKTIF' | 'PERLU_PERHATIAN';

export type SpStatus =
  | 'AKTIF'
  | 'MENUNGGU_VERIFIKASI'
  | 'KEDALUWARSA'
  | 'DITOLAK'
  | 'BELUM_PENGAJUAN'
  | 'BELUM_TERSEDIA';

export type ActivityCategory =
  | 'Kaderisasi'
  | 'Keagamaan'
  | 'Organisasi'
  | 'Sosial'
  | 'Pendidikan'
  | 'Pelatihan'
  | 'Kegiatan Ranting'
  | 'Kegiatan PK'
  | 'Kegiatan PAC';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  targetUnitId?: string; // ID of the branch or PK this user manages
  targetUnitName?: string;
  targetUnitType?: UnitType;
  email?: string;
  phone?: string;
  avatar?: string;
  password?: string; // Encrypted or plain stored password for simulation
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface CompletenessIndicators {
  profile: boolean;      // 10%
  officers: boolean;     // 20%
  members: boolean;      // 25%
  sp: boolean;           // 20%
  activities: boolean;   // 15%
  documentation: boolean;// 10%
}

export interface CompletenessWeights {
  profile: number;
  officers: number;
  members: number;
  sp: number;
  activities: number;
  documentation: number;
}

export interface UnitOrganization {
  id: string;
  name: string; // e.g., "PR IPNU IPPNU Dukun" or "PK IPNU IPPNU MA Ma'arif Dukun"
  villageOrSchool: string; // "Desa Dukun" or "MA Ma'arif Dukun"
  type: UnitType;
  leaderIpnu: string;
  leaderIppnu: string;
  phoneLeader?: string;
  email?: string;
  address?: string;
  foundedYear?: string;
  logo?: string;
  activeStatus: ActiveStatus;
  statusNotes?: string;
  completenessScore: number; // 0 - 100
  completenessGrade: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan' | 'Belum Terdata';
  spIpnuStatus: SpStatus;
  spIppnuStatus: SpStatus;
  spIpnuNumber?: string;
  spIppnuNumber?: string;
  spValidUntil?: string;
  lastUpdated: string;
  membersCount: number;
  officersCount: number;
  activitiesCount: number;
  historySummary?: string;
}

export interface Member {
  id: string;
  fullName: string;
  nia: string; // Nomor Induk Anggota (Format: XX.XX.XX.YYYY.XXXX)
  nik?: string; // Protected
  gender: 'L' | 'P'; // L: IPNU, P: IPPNU
  birthPlace: string;
  birthDate: string;
  address: string;
  phone?: string; // WhatsApp number
  email?: string;
  unitId: string; // ID Ranting or PK
  unitName: string;
  lastKaderisasi?: 'MAKESTA' | 'LAKMUD' | 'LAKUT' | 'BELUM';
  kaderisasiYear?: string;
  occupation?: string;
  schoolOrOccupation?: string;
  position?: string;
  membershipStatus?: string;
  joinYear?: number;
  avatar?: string; // Pas foto URL / base64
  unitType?: UnitType;
  createdAt?: string;
}

export interface Officer {
  id: string;
  fullName: string;
  position: string; // e.g., "Ketua", "Sekretaris", "Bendahara", "Departemen Kaderisasi"
  organization: OrganizationType;
  level?: 'PAC' | 'RANTING' | 'KOMISARIAT';
  gender?: 'L' | 'P';
  unitId?: string; // empty if PAC
  unitName?: string;
  phone?: string;
  email?: string;
  period: string; // e.g., "2024 - 2026"
  avatar?: string;
  photoUrl?: string;
  nia?: string;
  displayOrder?: number;
  orderIndex?: number;
  description?: string;
  bio?: string;
  department?: string;
  status?: 'Aktif' | 'Demisioner' | 'Nonaktif' | string;
}

export interface Supervisor {
  id: string;
  fullName: string;
  title?: string;
  roleOrTitle?: string;
  role?: string;
  gender?: 'L' | 'P';
  originOrganization?: string;
  period?: string;
  address?: string;
  notes?: string;
  photo?: string; // Pas foto URL / base64
  phone?: string; // WhatsApp number
}

export interface Alumni {
  id: string;
  fullName: string;
  formerPosition?: string;
  pastPosition?: string;
  gender?: 'L' | 'P';
  period?: string;
  currentProfession?: string;
  currentActivity?: string;
  address?: string;
  phone?: string; // WhatsApp number
  photo?: string; // Pas foto URL / base64
  city?: string;
  notes?: string;
}

export interface SpDocument {
  id: string;
  unitId: string;
  unitName: string;
  unitType: UnitType;
  organization: OrganizationType;
  spNumber: string;
  issueDate?: string;
  expiryDate?: string;
  validFrom?: string;
  validUntil?: string;
  legalizationDate?: string;
  leaderName?: string;
  secretaryName?: string;
  status: SpStatus;
  fileUrl?: string; // Link or simulated PDF
  fileName?: string;
  fileSize?: string;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  submittedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  date: string;
  location: string;
  organizer: string;
  unitId?: string; // ID Ranting / PK / PAC
  unitName?: string;
  summary?: string;
  content?: string;
  description?: string;
  participantCount?: number;
  imageUrl?: string;
  coverImage?: string;
  photos?: string[]; // Multiple documentation photos
  fontFamily?: string; // Selected font
  paragraphStyle?: string; // Paragraph formatting
  isFeatured?: boolean;
  publicationStatus: 'PUBLISHED' | 'DRAFT' | 'PENDING_MODERATION' | 'Dipublikasikan' | 'Menunggu Moderasi';
  createdAt?: string;
}

export interface ActivityGalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  unitName: string;
  category?: string;
  date?: string;
  isFeatured?: boolean;
}

export interface PacOfficerSlide {
  id: string;
  name: string;
  position: string;
  photo: string;
  organization: 'IPNU' | 'IPPNU';
  quote?: string;
}

export interface FooterNavLink {
  id: string;
  label: string;
  url: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface HistoricalLeader {
  id: string;
  name: string;
  period: string; // e.g. "2024 - 2026"
  organization: 'IPNU' | 'IPPNU';
  photo?: string;
  visionOrQuote?: string;
  achievements?: string[];
  status: 'Aktif' | 'Demisioner';
  originUnit?: string;
}

export interface WebsiteSettings {
  siteTitle?: string;
  siteName: string;
  subtitle?: string;
  tagline: string;
  organizationName?: string;
  organization: string;
  logoUrl?: string;
  navbarLogoUrl?: string;
  navbarBrandTitle?: string;
  navbarBrandSubtitle?: string;
  faviconUrl?: string;
  themeColor?: string;
  shortDescription?: string;
  period?: string;
  history?: string;
  historyText?: string;
  workArea?: string;
  vision: string;
  missions: string[];
  bannerImage?: string;
  address?: string;
  contactAddress: string;
  email?: string;
  contactEmail: string;
  phone?: string;
  contactPhone: string; // WA Center
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    whatsapp: string;
  };
  heroSlides?: HeroSlide[];
  footerText?: string;
  footerDescription?: string;
  footerAddress?: string;
  footerEmail?: string;
  footerPhone?: string;
  footerCopyright?: string;
  footerNavLinks: FooterNavLink[];
  pacOfficersSlider: PacOfficerSlide[];
  activityGallery: ActivityGalleryItem[];
  historicalLeaders?: HistoricalLeader[];
  sectionOrder?: string[];
}

export interface ActivityLog {
  id: string;
  userId?: string;
  userName: string;
  userRole: UserRole;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  targetUserId?: string; // empty means broadcast to all
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'URGENT' | 'warning' | 'success' | 'info' | 'error';
  createdAt?: string;
  timestamp?: string;
  isRead: boolean;
  link?: string;
  actionLink?: string;
  targetUnitId?: string;
}

export type SystemNotification = NotificationItem;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
