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
    <div className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Statistik Real-Time Organisasi
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Data terintegrasi langsung dengan database ranting dan komisariat se-Kecamatan Dukun
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terverifikasi PAC IPNU IPPNU Dukun</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statItems.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${item.bg} flex flex-col justify-between transition hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700 leading-tight">{item.label}</span>
                <div className="p-1.5 rounded-lg bg-white shadow-xs">{item.icon}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {item.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 truncate">{item.sublabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
