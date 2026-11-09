import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  School,
  Users,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { units, members, officers, spDocuments, activities, logs } = useApp();

  const rantingList = units.filter((u) => u.type === 'RANTING');
  const pkList = units.filter((u) => u.type === 'KOMISARIAT');
  const activeRanting = rantingList.filter((u) => u.activeStatus === 'AKTIF');
  const attentionRanting = rantingList.filter((u) => u.activeStatus !== 'AKTIF');
  const pendingSps = spDocuments.filter((s) => s.status === 'MENUNGGU_VERIFIKASI');

  // Chart 1: Members count per unit (Top 10)
  const memberData = [...units]
    .sort((a, b) => b.membersCount - a.membersCount)
    .slice(0, 8)
    .map((u) => ({
      name: u.name.replace('PR IPNU IPPNU ', 'PR ').replace("PK IPNU IPPNU MA Ma'arif Dukun", "PK MA Ma'arif"),
      anggota: u.membersCount,
      pengurus: u.officersCount,
    }));

  // Chart 2: Completeness distribution
  const completenessData = [...units]
    .sort((a, b) => b.completenessScore - a.completenessScore)
    .slice(0, 8)
    .map((u) => ({
      name: u.name.replace('PR IPNU IPPNU ', 'PR ').slice(0, 14),
      skor: u.completenessScore,
    }));

  // Chart 3: Active Status distribution
  const statusPieData = [
    { name: 'Aktif Beroperasi', value: units.filter((u) => u.activeStatus === 'AKTIF').length, color: '#16a34a' },
    { name: 'Perlu Perhatian', value: units.filter((u) => u.activeStatus === 'PERLU_PERHATIAN').length, color: '#eab308' },
    { name: 'Tidak Aktif', value: units.filter((u) => u.activeStatus === 'TIDAK_AKTIF').length, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  // Chart 4: Monthly activities mock trend
  const monthlyActivityData = [
    { bulan: 'Jul', kegiatan: 4 },
    { bulan: 'Ags', kegiatan: 6 },
    { bulan: 'Sep', kegiatan: 9 },
    { bulan: 'Okt', kegiatan: 12 },
    { bulan: 'Nov', kegiatan: activities.length + 3 },
  ];

  const statCards = [
    {
      title: 'Pimpinan Ranting',
      value: rantingList.length,
      detail: `${activeRanting.length} ranting berstatus aktif`,
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200/80',
      action: () => onNavigateTab('branches'),
    },
    {
      title: 'Pimpinan Komisariat',
      value: pkList.length,
      detail: 'Komisariat madrasah & sekolah',
      icon: <School className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50 border-teal-200/80',
      action: () => onNavigateTab('branches'),
    },
    {
      title: 'Total Anggota Tercatat',
      value: members.length,
      detail: 'Kader santri di database',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200/80',
      action: () => onNavigateTab('members'),
    },
    {
      title: 'Total Pengurus',
      value: officers.length,
      detail: 'Pengurus PAC & Pangkalan',
      icon: <UserCheck className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200/80',
      action: () => onNavigateTab('pac-officers'),
    },
    {
      title: 'SP Menunggu Verifikasi',
      value: pendingSps.length,
      detail: pendingSps.length > 0 ? 'Perlu tindakan admin' : 'Semua berkas tervalidasi',
      icon: <FileText className="w-5 h-5 text-amber-600" />,
      bg: pendingSps.length > 0 ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200',
      action: () => onNavigateTab('sp'),
    },
    {
      title: 'Total Kegiatan / Berita',
      value: activities.length,
      detail: 'Kaderisasi & syiar pelajar',
      icon: <Calendar className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200/80',
      action: () => onNavigateTab('activities'),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Alert if pending SP */}
      {pendingSps.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-300/80 rounded-2xl flex items-center justify-between gap-4 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-950">
                Ada {pendingSps.length} Dokumen SP Baru Menunggu Verifikasi
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Ranting telah mengunggah berkas permohonan pengesahan susunan pengurus baru.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('sp')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0"
          >
            Verifikasi Sekarang
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            onClick={card.action}
            className={`p-4 rounded-2xl border ${card.bg} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 leading-tight">
                {card.title}
              </span>
              <div className="p-1.5 rounded-lg bg-white shadow-xs group-hover:scale-110 transition">
                {card.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">{card.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Members per Ranting/PK */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Jumlah Anggota & Pengurus per Ranting/PK
              </h3>
              <p className="text-xs text-slate-500">Pangkalan dengan jumlah kader terbesar</p>
            </div>
            <button
              onClick={() => onNavigateTab('members')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Lihat Semua Anggota</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="anggota" name="Anggota" fill="#16a34a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pengurus" name="Pengurus" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Active Status Pie */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Distribusi Status Keaktifan</h3>
            <p className="text-xs text-slate-500">Kondisi operasional ranting dan komisariat</p>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {statusPieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-bold text-slate-900">{d.value} Unit</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Completeness Chart & Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Persentase Kelengkapan Data */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Peringkat Persentase Kelengkapan Database
              </h3>
              <p className="text-xs text-slate-500">Skor berdasarkan 6 indikator standar PAC</p>
            </div>
            <button
              onClick={() => onNavigateTab('scoring-config')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Atur Bobot Penilaian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={completenessData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Kelengkapan']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="skor" name="Kelengkapan" fill="#059669" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Audit Logs */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Riwayat Aktivitas Terkini</h3>
                <p className="text-xs text-slate-500">Audit trail pembaruan data pengguna</p>
              </div>
              <button
                onClick={() => onNavigateTab('logs')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Semua Log
              </button>
            </div>

            <div className="space-y-3">
              {logs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="font-semibold text-slate-800">{log.userName}</span>
                    <span className="font-mono text-[10px]">{log.timestamp}</span>
                  </div>
                  <div className="font-medium text-emerald-700">{log.action}</div>
                  <div className="text-slate-600 mt-0.5 truncate">{log.target}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('logs')}
            className="w-full mt-4 py-2 text-center text-xs font-bold text-slate-600 hover:text-emerald-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Lihat Rekam Jejak Lengkap
          </button>
        </div>
      </div>
    </div>
  );
};
