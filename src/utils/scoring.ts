import { CompletenessIndicators, CompletenessWeights, ActiveStatus, UnitOrganization } from '../types';

export const DEFAULT_WEIGHTS: CompletenessWeights = {
  profile: 10,
  officers: 20,
  members: 25,
  sp: 20,
  activities: 15,
  documentation: 10,
};

export function calculateCompletenessScore(
  indicators: CompletenessIndicators,
  weights: CompletenessWeights = DEFAULT_WEIGHTS
): number {
  let score = 0;
  if (indicators.profile) score += weights.profile;
  if (indicators.officers) score += weights.officers;
  if (indicators.members) score += weights.members;
  if (indicators.sp) score += weights.sp;
  if (indicators.activities) score += weights.activities;
  if (indicators.documentation) score += weights.documentation;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export type CompletenessGrade = 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan' | 'Belum Terdata';

export function getCompletenessGrade(score: number): CompletenessGrade {
  if (score >= 90) return 'Sangat Baik';
  if (score >= 75) return 'Baik';
  if (score >= 50) return 'Cukup';
  if (score >= 1) return 'Perlu Pembinaan';
  return 'Belum Terdata';
}

export function getGradeBadgeColor(grade: CompletenessGrade): {
  bg: string;
  text: string;
  border: string;
  barColor: string;
} {
  switch (grade) {
    case 'Sangat Baik':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        barColor: 'bg-emerald-600',
      };
    case 'Baik':
      return {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        barColor: 'bg-teal-600',
      };
    case 'Cukup':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        barColor: 'bg-amber-500',
      };
    case 'Perlu Pembinaan':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        barColor: 'bg-orange-500',
      };
    case 'Belum Terdata':
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        border: 'border-gray-200',
        barColor: 'bg-gray-400',
      };
  }
}

export function getActiveStatusBadge(status: ActiveStatus): {
  label: string;
  bg: string;
  text: string;
  dotColor: string;
} {
  switch (status) {
    case 'AKTIF':
      return {
        label: 'Aktif Beroperasi',
        bg: 'bg-green-100',
        text: 'text-green-800',
        dotColor: 'bg-green-500',
      };
    case 'PERLU_PERHATIAN':
      return {
        label: 'Perlu Perhatian',
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        dotColor: 'bg-yellow-500',
      };
    case 'TIDAK_AKTIF':
    default:
      return {
        label: 'Tidak Aktif',
        bg: 'bg-red-100',
        text: 'text-red-800',
        dotColor: 'bg-red-500',
      };
  }
}

/**
 * Validates NIA formatting and duplicate checking
 */
export function validateNia(nia: string, existingNias: string[], currentId?: string): {
  isValid: boolean;
  message?: string;
} {
  const cleanNia = nia.trim();
  if (!cleanNia) {
    return { isValid: false, message: 'NIA tidak boleh kosong' };
  }
  if (cleanNia.length < 5) {
    return { isValid: false, message: 'NIA minimal 5 karakter' };
  }
  const isDuplicate = existingNias.some((n) => n.toLowerCase() === cleanNia.toLowerCase());
  if (isDuplicate) {
    return { isValid: false, message: `NIA ${cleanNia} sudah terdaftar dalam sistem (tidak boleh ganda)` };
  }
  return { isValid: true };
}

/**
 * Computes unit indicators based on actual counts and records
 */
export function evaluateUnitIndicators(unit: {
  leaderIpnu?: string;
  leaderIppnu?: string;
  address?: string;
  officersCount: number;
  membersCount: number;
  spIpnuStatus: string;
  spIppnuStatus: string;
  activitiesCount: number;
  hasDocumentation?: boolean;
}): CompletenessIndicators {
  return {
    profile: Boolean(unit.leaderIpnu && unit.leaderIppnu && unit.address),
    officers: unit.officersCount >= 3,
    members: unit.membersCount >= 5,
    sp: unit.spIpnuStatus === 'AKTIF' || unit.spIppnuStatus === 'AKTIF',
    activities: unit.activitiesCount >= 1,
    documentation: Boolean(unit.hasDocumentation || unit.activitiesCount >= 1),
  };
}

/**
 * Filter and search helper for members
 */
export function filterMembers<T extends { fullName: string; nia: string; address: string; position: string; schoolOrOccupation: string }>(
  items: T[],
  query: string
): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase().trim();
  return items.filter(
    (item) =>
      item.fullName.toLowerCase().includes(q) ||
      item.nia.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.position.toLowerCase().includes(q) ||
      item.schoolOrOccupation.toLowerCase().includes(q)
  );
}
