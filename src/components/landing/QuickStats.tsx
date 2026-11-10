import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, School, Users, UserCheck, CheckCircle2, AlertCircle, CalendarCheck, FileCheck } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const { units, members, officers, activities, spDocuments } = useApp();

  const rantingUnits = units.filter((u) => u.type === 'RANTING');
  const pkUnits = units.filter((u) => u.type === 'KOMISARIAT');
  const activeRanting = rantingUnits.filter((u) => u.activeStatus === 'AKTIF');
  const attentionRanting = rantingUnits.filter((u) => u.activeStatus !== 'AKTIF');
  const activeSps = spDocuments.filter((s) => s.status === 'AKTIF');

  const statItems = [
    {
      label: 'Pimpinan Ranting',
      value: rantingUnits.length,
      sublabel: `${activeRanting.length} ranting aktif beroperasi`,
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200/80',
    },
    {
      label: 'Pimpinan Komisariat',
      value: pkUnits.length,
      sublabel: 'SLTP & SLTA se-Kecamatan',
      icon: <School className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50 border-teal-200/80',
    },
    {
      label: 'Database Anggota',
      value: members.length,
      sublabel: 'Kader santri & pelajar tercatat',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200/80',
    },
    {
      label: 'Pengurus Terdaftar',
      value: officers.length,
      sublabel: 'PAC, Ranting & Komisariat',
      icon: <UserCheck className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200/80',
    },
    {
      label: 'Dokumen SP Sah',
      value: activeSps.length,
      sublabel: `${spDocuments.length} total pengajuan persuratan`,
      icon: <FileCheck className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200/80',
    },
    {
      label: 'Agenda & Kegiatan',
      value: activities.length,
      sublabel: 'Kaderisasi, sosial & keagamaan',
      icon: <CalendarCheck className="w-5 h-5 text-emerald-700" />,
      bg: 'bg-emerald-50 border-emerald-300',
    },
  ];

  return (
    <div className="relative -mt-4 sm:-mt-10 z-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-3 sm:p-8">
        <div className="flex flex-row items-center justify-between pb-2.5 mb-2.5 sm:pb-6 sm:mb-6 border-b border-slate-100 gap-2">
          <div className="min-w-0">
            <h2 className="text-xs sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="truncate">Statistik Real-Time Organisasi</span>
            </h2>
            <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
              Data terintegrasi langsung dengan database ranting dan komisariat se-Kecamatan Dukun
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden xs:inline sm:inline">Terverifikasi PAC</span>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-4">
          {statItems.map((item, i) => (
            <div
              key={i}
              className={`p-2 sm:p-4 rounded-xl border ${item.bg} flex flex-col justify-between transition hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between gap-1 mb-1 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-700 leading-tight line-clamp-1">
                  {item.label}
                </span>
                <div className="p-1 sm:p-1.5 rounded-lg bg-white shadow-xs shrink-0 scale-75 sm:scale-100 origin-right">
                  {item.icon}
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {item.value}
                </div>
                <div className="hidden sm:block text-[11px] text-slate-500 mt-1 truncate">
                  {item.sublabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
