import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { getGradeBadgeColor, getActiveStatusBadge } from '../../utils/scoring';
import { UnitOrganization } from '../../types';
import {
  Search,
  Building2,
  School,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
  MapPin,
  Calendar,
  ExternalLink,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react';

export const DirectorySection: React.FC = () => {
  const { units } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'RANTING' | 'KOMISARIAT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AKTIF' | 'PERLU_PERHATIAN'>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<UnitOrganization | null>(null);

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.villageOrSchool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.leaderIpnu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.leaderIppnu.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || u.type === selectedType;
    const matchesStatus = statusFilter === 'ALL' || u.activeStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <section id="ranting-pk" className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Direktori Basis & Pangkalan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pimpinan Ranting Desa & Pimpinan Komisariat
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Pemantauan langsung kelengkapan database administrasi, status surat pengesahan (SP), dan profil pimpinan di 18 Ranting dan 6 Komisariat se-Kecamatan Dukun.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama ranting, sekolah, atau ketua..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          {/* Type & Status Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedType === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({units.length})
              </button>
              <button
                onClick={() => setSelectedType('RANTING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedType === 'RANTING'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ranting Desa ({units.filter((u) => u.type === 'RANTING').length})
              </button>
              <button
                onClick={() => setSelectedType('KOMISARIAT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedType === 'KOMISARIAT'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Komisariat ({units.filter((u) => u.type === 'KOMISARIAT').length})
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Status Keaktifan</option>
              <option value="AKTIF">Hanya Status Aktif</option>
              <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => {
            const gradeStyle = getGradeBadgeColor(unit.completenessGrade);
            const statusStyle = getActiveStatusBadge(unit.activeStatus);
            const isRanting = unit.type === 'RANTING';

            return (
              <div
                key={unit.id}
                onClick={() => setSelectedUnit(unit)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Top Bar with Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isRanting ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {isRanting ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <School className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {unit.type}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`} />
                      <span>{statusStyle.label}</span>
                    </div>
                  </div>

                  {/* Title & Village */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug mb-1">
                    {unit.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{unit.villageOrSchool}</span>
                  </div>

                  {/* Leaders */}
                  <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Ketua IPNU:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                        {unit.leaderIpnu || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Ketua IPPNU:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                        {unit.leaderIppnu || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Completeness Score Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-700">Kelengkapan Database:</span>
                      <span className="font-extrabold text-emerald-800">
                        {unit.completenessScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${gradeStyle.barColor}`}
                        style={{ width: `${unit.completenessScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}>
                        Kategori: {unit.completenessGrade}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Update: {unit.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Count stats */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <span title="Jumlah Anggota" className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-900">{unit.membersCount}</strong> kader
                    </span>
                    <span title="Dokumen SP" className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-900">
                        {unit.spIpnuStatus === 'AKTIF' ? 'SP Sah' : 'SP Menunggu'}
                      </strong>
                    </span>
                  </div>

                  <div className="text-emerald-700 font-semibold group-hover:translate-x-1 transition flex items-center gap-0.5">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUnits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">Tidak ada data ranting/PK yang cocok</h4>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter status.</p>
          </div>
        )}
      </div>

      {/* Unit Detail Modal */}
      {selectedUnit && (
        <Modal
          isOpen={!!selectedUnit}
          onClose={() => setSelectedUnit(null)}
          title={selectedUnit.name}
          subtitle={`Detail Informasi ${selectedUnit.type} • Wilayah ${selectedUnit.villageOrSchool}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Top Stat Ribbon */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                  Indeks Kelengkapan Administrasi
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-emerald-950">
                    {selectedUnit.completenessScore}%
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    ({selectedUnit.completenessGrade})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActiveStatusBadge(selectedUnit.activeStatus).bg} ${getActiveStatusBadge(selectedUnit.activeStatus).text}`}>
                  {getActiveStatusBadge(selectedUnit.activeStatus).label}
                </span>
              </div>
            </div>

            {/* Info details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium block">Pimpinan IPNU</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {selectedUnit.leaderIpnu || '-'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  SP IPNU: {selectedUnit.spIpnuStatus} ({selectedUnit.spIpnuNumber || 'Belum ada'})
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium block">Pimpinan IPPNU</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {selectedUnit.leaderIppnu || '-'}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  SP IPPNU: {selectedUnit.spIppnuStatus} ({selectedUnit.spIppnuNumber || 'Belum ada'})
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium block">Alamat Sekretariat</span>
                <span className="font-medium text-slate-800 block mt-0.5">
                  {selectedUnit.address || 'Belum diisi'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium block">Statistik Anggota & Agenda</span>
                <span className="font-medium text-slate-800 block mt-0.5">
                  {selectedUnit.membersCount} Anggota Terdata • {selectedUnit.activitiesCount} Kegiatan
                </span>
              </div>
            </div>

            {selectedUnit.statusNotes && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <span className="font-bold block mb-0.5">Catatan Evaluasi / Pendampingan PAC:</span>
                <p>{selectedUnit.statusNotes}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUnit(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
