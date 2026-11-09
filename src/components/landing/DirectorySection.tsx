import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  Play,
  Pause,
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

  // 4 items visible per slide, rest accessible via slideshow
  const ITEMS_PER_SLIDE = 4;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_SLIDE) || 1;

  // Reset slide index when filters change
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [searchQuery, selectedType, statusFilter]);

  // Automatic slideshow
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % totalPages);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, totalPages]);

  const displayedUnits = filteredUnits.slice(
    currentSlideIndex * ITEMS_PER_SLIDE,
    (currentSlideIndex + 1) * ITEMS_PER_SLIDE
  );

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

        {/* Slideshow Bar & Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-200/80">
          <div>
            <span className="text-xs font-bold text-slate-800">
              Menampilkan 4 Pangkalan per Slide
            </span>
            <span className="text-xs text-slate-500 ml-2">
              (Halaman {currentSlideIndex + 1} dari {totalPages} • Total {filteredUnits.length} Ranting & PK)
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition cursor-pointer"
                title={isPaused ? 'Putar Slideshow Otomatis' : 'Jeda Slideshow'}
              >
                {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-slate-600" />}
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + totalPages) % totalPages)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition cursor-pointer"
                title="Slide Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % totalPages)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition cursor-pointer"
                title="Slide Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Directory Grid: 4 items per slide */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {displayedUnits.map((unit) => {
            const gradeStyle = getGradeBadgeColor(unit.completenessGrade);
            const statusStyle = getActiveStatusBadge(unit.activeStatus);
            const isRanting = unit.type === 'RANTING';

            return (
              <div
                key={unit.id}
                onClick={() => setSelectedUnit(unit)}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
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
                          <Building2 className="w-3.5 h-3.5" />
                        ) : (
                          <School className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {unit.type}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`} />
                      <span>{statusStyle.label}</span>
                    </div>
                  </div>

                  {/* Title & Village */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug mb-1 line-clamp-1">
                    {unit.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-3">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{unit.villageOrSchool}</span>
                  </div>

                  {/* Leaders */}
                  <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl mb-3 border border-slate-100">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-medium">IPNU:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[130px]">
                        {unit.leaderIpnu || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-medium">IPPNU:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[130px]">
                        {unit.leaderIppnu || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Completeness Score Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-700">Database:</span>
                      <span className="font-extrabold text-emerald-800">
                        {unit.completenessScore}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${gradeStyle.barColor}`}
                        style={{ width: `${unit.completenessScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}>
                        Grade {unit.completenessGrade}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {unit.lastUpdated}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Count stats */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <span title="Jumlah Anggota" className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <strong className="text-slate-900">{unit.membersCount}</strong>
                    </span>
                    <span>•</span>
                    <span title="Dokumen SP">
                      <strong className={unit.spIpnuStatus === 'AKTIF' ? 'text-emerald-700' : 'text-amber-700'}>
                        {unit.spIpnuStatus === 'AKTIF' ? 'SP Sah' : 'Proses'}
                      </strong>
                    </span>
                  </div>

                  <div className="text-emerald-700 font-semibold group-hover:translate-x-1 transition flex items-center gap-0.5 text-xs">
                    <span>Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-6">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentSlideIndex ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Pindah ke slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

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
