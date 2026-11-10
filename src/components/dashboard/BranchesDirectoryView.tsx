import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { UnitOrganization, UnitType, ActiveStatus } from '../../types';
import { getGradeBadgeColor, getActiveStatusBadge } from '../../utils/scoring';
import {
  Building2,
  School,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  FileText,
  Calendar,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  Camera,
  Activity as ActivityIcon,
  BarChart3,
  Layers,
  MessageCircle,
} from 'lucide-react';

export const BranchesDirectoryView: React.FC = () => {
  const {
    units,
    members,
    officers,
    spDocuments,
    activities,
    logs,
    addUnit,
    updateUnit,
    deleteUnit,
    currentUser,
    settings,
  } = useApp();

  const rawPacPhone = (settings.footerPhone || settings.phone || '6281234567890').replace(/[^0-9]/g, '');
  const pacWaNumber = rawPacPhone.startsWith('0') ? '62' + rawPacPhone.slice(1) : rawPacPhone;

  const buildWaConfirmationUrl = (unit: UnitOrganization) => {
    const unitMembersCount = members.filter((m) => m.unitId === unit.id).length || unit.membersCount;
    const unitOfficersCount = officers.filter((o) => o.unitId === unit.id).length || unit.officersCount;
    const text = encodeURIComponent(
      `Assalamu'alaikum Wr. Wb.\nKepada Yth. Admin Sekretariat *PAC IPNU IPPNU Kecamatan Dukun*,\n\nKami dari pimpinan pangkalan *${unit.name}* (${unit.villageOrSchool}) mengonfirmasi telah selesai mengisi dan memperbarui data di Sistem Database Organisasi:\n• Ketua IPNU: ${unit.leaderIpnu || '-'}\n• Ketua IPPNU: ${unit.leaderIppnu || '-'}\n• Total Anggota Terdata: ${unitMembersCount} Kader\n• Total Pengurus: ${unitOfficersCount} Orang\n• Status SP: ${unit.spIpnuStatus === 'AKTIF' ? 'SP Sah & Aktif' : unit.spIpnuStatus}\n• Indeks Kelengkapan: *${unit.completenessScore}% (${unit.completenessGrade})*\n\nMohon kiranya dilakukan pengecekan dan verifikasi. Terima kasih.\n*Belajar, Berjuang, Bertaqwa!*`
    );
    return `https://wa.me/${pacWaNumber}?text=${text}`;
  };

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_pac';
  const isBranchUser = currentUser?.role === 'user_ranting' || currentUser?.role === 'user_pk';
  const targetUnitId = currentUser?.targetUnitId;

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | UnitType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ActiveStatus>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitOrganization | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<
    'profil' | 'pengurus' | 'anggota' | 'sp' | 'kegiatan' | 'dokumentasi' | 'statistik' | 'riwayat'
  >('profil');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form state
  const [formUnit, setFormUnit] = useState({
    name: '',
    villageOrSchool: '',
    type: 'RANTING' as UnitType,
    leaderIpnu: '',
    leaderIppnu: '',
    phoneLeader: '',
    email: '',
    address: '',
    foundedYear: '2000',
    activeStatus: 'AKTIF' as ActiveStatus,
    statusNotes: '',
    spIpnuStatus: 'BELUM_TERSEDIA' as any,
    spIppnuStatus: 'BELUM_TERSEDIA' as any,
    membersCount: 20,
    officersCount: 12,
    activitiesCount: 3,
  });

  const availableUnits = isBranchUser && targetUnitId
    ? units.filter((u) => u.id === targetUnitId)
    : units;

  const filteredUnits = availableUnits.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.villageOrSchool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.leaderIpnu.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || u.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || u.activeStatus === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenAdd = () => {
    setSelectedUnit(null);
    setFormUnit({
      name: 'PR IPNU IPPNU Desa Baru',
      villageOrSchool: 'Desa Baru',
      type: 'RANTING',
      leaderIpnu: '',
      leaderIppnu: '',
      phoneLeader: '',
      email: '',
      address: '',
      foundedYear: '2024',
      activeStatus: 'AKTIF',
      statusNotes: 'Ranting baru dibentuk, dalam proses pelengkapan administrasi.',
      spIpnuStatus: 'BELUM_TERSEDIA',
      spIppnuStatus: 'BELUM_TERSEDIA',
      membersCount: 15,
      officersCount: 10,
      activitiesCount: 1,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (unit: UnitOrganization) => {
    setSelectedUnit(unit);
    setFormUnit({
      name: unit.name,
      villageOrSchool: unit.villageOrSchool,
      type: unit.type,
      leaderIpnu: unit.leaderIpnu,
      leaderIppnu: unit.leaderIppnu,
      phoneLeader: unit.phoneLeader || '',
      email: unit.email || '',
      address: unit.address || '',
      foundedYear: unit.foundedYear || '2000',
      activeStatus: unit.activeStatus,
      statusNotes: unit.statusNotes || '',
      spIpnuStatus: unit.spIpnuStatus,
      spIppnuStatus: unit.spIppnuStatus,
      membersCount: unit.membersCount,
      officersCount: unit.officersCount,
      activitiesCount: unit.activitiesCount,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUnit) {
      updateUnit(selectedUnit.id, formUnit);
    } else {
      addUnit(formUnit);
    }
    setIsAddModalOpen(false);
  };

  const handleOpenDetailModal = (unit: UnitOrganization) => {
    setSelectedUnit(unit);
    setActiveDetailTab('profil');
    setDetailModalOpen(true);
  };

  // Always resolve the live unit from units state so modal updates in real time
  const liveSelectedUnit = selectedUnit
    ? units.find((u) => u.id === selectedUnit.id) || selectedUnit
    : null;

  // Associated records for active detail unit
  const activeMembers = liveSelectedUnit ? members.filter((m) => m.unitId === liveSelectedUnit.id) : [];
  const activeOfficers = liveSelectedUnit ? officers.filter((o) => o.unitId === liveSelectedUnit.id) : [];
  const activeSps = liveSelectedUnit ? spDocuments.filter((s) => s.unitId === liveSelectedUnit.id) : [];
  const activeActs = liveSelectedUnit
    ? activities.filter(
        (a) =>
          a.unitId === liveSelectedUnit.id ||
          (a.organizer && a.organizer.toLowerCase() === liveSelectedUnit.name.toLowerCase())
      )
    : [];
  const activeLogs = liveSelectedUnit ? logs.filter((l) => l.target.includes(liveSelectedUnit.name) || l.target.includes(liveSelectedUnit.id)) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Database Pangkalan Ranting & Komisariat (PK)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil, pemantauan kelengkapan data, dan rekam jejak 18 Ranting dan 6 Komisariat se-Kecamatan Dukun
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pangkalan Baru</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Pangkalan ({availableUnits.length})</span>
          </button>
          <button
            onClick={() => setTypeFilter('RANTING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              typeFilter === 'RANTING'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Ranting Desa PR ({availableUnits.filter((u) => u.type === 'RANTING').length})</span>
          </button>
          <button
            onClick={() => setTypeFilter('KOMISARIAT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              typeFilter === 'KOMISARIAT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Komisariat Sekolah/Madrasah PK ({availableUnits.filter((u) => u.type === 'KOMISARIAT').length})</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ranting, sekolah, atau ketua..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Status Keaktifan</option>
            <option value="AKTIF">Aktif Beroperasi</option>
            <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
            <option value="TIDAK_AKTIF">Tidak Aktif</option>
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-auto">
            Total: <strong>{filteredUnits.length}</strong> Unit
          </span>
        </div>
      </div>
    </div>

    {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Ranting / PK</th>
                <th className="py-3 px-4">Pimpinan (Ketua IPNU & IPPNU)</th>
                <th className="py-3 px-4 text-center">Anggota</th>
                <th className="py-3 px-4 text-center">Kegiatan</th>
                <th className="py-3 px-4">Status SP</th>
                <th className="py-3 px-4">Status Keaktifan</th>
                <th className="py-3 px-4">Kelengkapan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.map((unit, idx) => {
                const gradeStyle = getGradeBadgeColor(unit.completenessGrade);
                const statusStyle = getActiveStatusBadge(unit.activeStatus);

                return (
                  <tr key={unit.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {unit.type === 'RANTING' ? (
                          <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <School className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        )}
                        <span>{unit.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{unit.villageOrSchool}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="truncate max-w-[170px]">
                        <span className="text-slate-400">IPNU:</span> {unit.leaderIpnu || '-'}
                      </div>
                      <div className="truncate max-w-[170px] text-[11px] text-slate-500">
                        <span className="text-slate-400">IPPNU:</span> {unit.leaderIppnu || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {unit.membersCount}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {unit.activitiesCount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                        {unit.spIpnuStatus === 'AKTIF' ? 'SP Sah' : 'Menunggu SP'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`} />
                        <span>{statusStyle.label}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${gradeStyle.barColor}`}
                            style={{ width: `${unit.completenessScore}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-[11px] text-slate-800">
                          {unit.completenessScore}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {unit.completenessGrade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <a
                          href={buildWaConfirmationUrl(unit)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold inline-flex items-center gap-1 transition shadow-2xs"
                          title="Konfirmasi Pengisian Data ke WhatsApp PAC"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden xl:inline">Konfirmasi WA</span>
                        </a>
                        <button
                          onClick={() => handleOpenDetailModal(unit)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                          title="Buka 8 Tab Detail Ranting"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(unit)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Edit Data Pangkalan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteTargetId(unit.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                            title="Hapus Pangkalan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8-Tab Deep Dive Detail Modal (Section 5) */}
      {liveSelectedUnit && detailModalOpen && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Pusat Informasi: ${liveSelectedUnit.name}`}
          subtitle={`Struktur lengkap, kepengurusan, berkas SP, dan histori audit`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* 8-Tab Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200">
              {[
                { id: 'profil', label: '1. Profil' },
                { id: 'pengurus', label: '2. Pengurus' },
                { id: 'anggota', label: '3. Anggota' },
                { id: 'sp', label: '4. SP' },
                { id: 'kegiatan', label: '5. Kegiatan' },
                { id: 'dokumentasi', label: '6. Dokumentasi' },
                { id: 'statistik', label: '7. Statistik' },
                { id: 'riwayat', label: '8. Riwayat Update' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    activeDetailTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Profil Ranting */}
            {activeDetailTab === 'profil' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Nama Resmi</span>
                    <strong className="text-slate-900 text-sm">{liveSelectedUnit.name}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Jenis Unit & Wilayah</span>
                    <strong className="text-slate-900 text-sm">
                      {liveSelectedUnit.type} • {liveSelectedUnit.villageOrSchool}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Ketua IPNU</span>
                    <strong className="text-slate-900">{liveSelectedUnit.leaderIpnu || '-'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Ketua IPPNU</span>
                    <strong className="text-slate-900">{liveSelectedUnit.leaderIppnu || '-'}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Alamat Sekretariat</span>
                    <span className="text-slate-800">{liveSelectedUnit.address || 'Belum diisi'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Nomor HP / WhatsApp</span>
                    <span className="text-slate-800">{liveSelectedUnit.phoneLeader || '-'}</span>
                  </div>
                </div>

                {liveSelectedUnit.historySummary && (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                    <strong className="block mb-1">Catatan Sejarah Singkat:</strong>
                    <p>{liveSelectedUnit.historySummary}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Data Pengurus */}
            {activeDetailTab === 'pengurus' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    Total Pengurus: <strong>{activeOfficers.length || liveSelectedUnit.officersCount}</strong>
                  </span>
                </div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <div className="p-3 bg-slate-50 font-bold text-slate-700 flex justify-between">
                    <span>Ketua IPNU: {liveSelectedUnit.leaderIpnu}</span>
                    <span className="text-emerald-700">Mandat Sah</span>
                  </div>
                  <div className="p-3 bg-slate-50 font-bold text-slate-700 flex justify-between">
                    <span>Ketua IPPNU: {liveSelectedUnit.leaderIppnu}</span>
                    <span className="text-emerald-700">Mandat Sah</span>
                  </div>
                  {activeOfficers.length > 0 ? (
                    activeOfficers.map((off) => (
                      <div key={off.id} className="p-2.5 flex items-center justify-between bg-white">
                        <div>
                          <span className="font-bold text-slate-900">{off.fullName}</span>
                          <span className="text-slate-500 ml-2">({off.position} - {off.organization})</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-700">{off.nia}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-slate-500 text-[11px] italic text-center">
                      Daftar lengkap anggota susunan pengurus sesuai SK/SP PC IPNU IPPNU Kabupaten Gresik.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Data Anggota */}
            {activeDetailTab === 'anggota' && (
              <div className="space-y-3 text-xs">
                <span className="font-semibold text-slate-700 block">
                  Anggota Terdaftar di Database ({activeMembers.length} Orang):
                </span>
                {activeMembers.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Nama</th>
                          <th className="p-2.5">NIA</th>
                          <th className="p-2.5">Sekolah / Pekerjaan</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeMembers.map((m) => (
                          <tr key={m.id}>
                            <td className="p-2.5 font-bold">{m.fullName}</td>
                            <td className="p-2.5 font-mono text-emerald-700">{m.nia}</td>
                            <td className="p-2.5">{m.schoolOrOccupation || m.occupation}</td>
                            <td className="p-2.5">{m.membershipStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500">
                    Belum ada anggota terdaftar untuk unit ini.
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Data SP */}
            {activeDetailTab === 'sp' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <strong className="block text-slate-900">SP IPNU: {liveSelectedUnit.spIpnuNumber || 'Belum Terbit'}</strong>
                    <span className="text-slate-500">Status: {liveSelectedUnit.spIpnuStatus}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    {liveSelectedUnit.spIpnuStatus}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <strong className="block text-slate-900">SP IPPNU: {liveSelectedUnit.spIppnuNumber || 'Belum Terbit'}</strong>
                    <span className="text-slate-500">Status: {liveSelectedUnit.spIppnuStatus}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    {liveSelectedUnit.spIppnuStatus}
                  </span>
                </div>
              </div>
            )}

            {/* Tab 5: Kegiatan */}
            {activeDetailTab === 'kegiatan' && (
              <div className="space-y-3 text-xs">
                {activeActs.length > 0 ? (
                  activeActs.map((act) => (
                    <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                      <div>
                        <strong className="block text-slate-900">{act.title}</strong>
                        <span className="text-slate-500">{act.date} • {act.location}</span>
                      </div>
                      <span className="text-emerald-700 font-bold">{act.category}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500">
                    Belum ada laporan kegiatan spesifik pangkalan ini.
                  </div>
                )}
              </div>
            )}

            {/* Tab 6: Dokumentasi */}
            {activeDetailTab === 'dokumentasi' && (
              <div className="text-xs">
                <div className="grid grid-cols-3 gap-3">
                  {activeActs.some((a) => a.imageUrl || a.coverImage) ? (
                    activeActs
                      .filter((a) => a.imageUrl || a.coverImage)
                      .map((act) => (
                        <div key={act.id} className="aspect-video bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative group">
                          <img src={act.imageUrl || act.coverImage} alt={act.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-1.5 text-[10px] font-medium truncate">
                            {act.title}
                          </div>
                        </div>
                      ))
                  ) : (
                    <>
                      <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&q=80" alt="Kegiatan" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80" alt="Kegiatan" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80" alt="Kegiatan" className="w-full h-full object-cover" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tab 7: Statistik */}
            {activeDetailTab === 'statistik' && (
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-emerald-700 block">Indeks Kelengkapan</span>
                  <strong className="text-2xl font-black text-emerald-950">{liveSelectedUnit.completenessScore}%</strong>
                </div>
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200">
                  <span className="text-teal-700 block">Total Anggota</span>
                  <strong className="text-2xl font-black text-teal-950">{liveSelectedUnit.membersCount}</strong>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <span className="text-blue-700 block">Agenda Terlaksana</span>
                  <strong className="text-2xl font-black text-blue-950">{liveSelectedUnit.activitiesCount}</strong>
                </div>
              </div>
            )}

            {/* Tab 8: Riwayat Update */}
            {activeDetailTab === 'riwayat' && (
              <div className="space-y-2 text-xs">
                {activeLogs.length > 0 ? (
                  activeLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between font-mono text-slate-400 text-[10px]">
                        <span>{log.timestamp}</span>
                        <span>{log.userName}</span>
                      </div>
                      <div className="font-semibold text-slate-800 mt-1">
                        {log.action}: {log.details || log.target}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between font-mono text-slate-400 text-[10px]">
                      <span>{liveSelectedUnit.lastUpdated}</span>
                      <span>Sistem PAC</span>
                    </div>
                    <div className="font-semibold text-slate-800 mt-1">
                      Sinkronisasi skor kelengkapan administrasi otomatis
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
              <a
                href={buildWaConfirmationUrl(liveSelectedUnit)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi Pengisian Data ke WhatsApp PAC</span>
              </a>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Unit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={selectedUnit ? 'Edit Data Pangkalan Ranting/PK' : 'Tambah Pangkalan Baru'}
        subtitle="Konfigurasi unit organisasi dan status legalitas"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveUnit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Unit *
              </label>
              <input
                type="text"
                required
                value={formUnit.name}
                onChange={(e) => setFormUnit({ ...formUnit, name: e.target.value })}
                placeholder="Contoh: PR IPNU IPPNU Sumber"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jenis Pangkalan *
              </label>
              <select
                value={formUnit.type}
                onChange={(e) => setFormUnit({ ...formUnit, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="RANTING">Pimpinan Ranting (Desa)</option>
                <option value="KOMISARIAT">Pimpinan Komisariat (Sekolah/Madrasah)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Desa / Asal Lembaga *
              </label>
              <input
                type="text"
                required
                value={formUnit.villageOrSchool}
                onChange={(e) => setFormUnit({ ...formUnit, villageOrSchool: e.target.value })}
                placeholder="Contoh: Desa Sumber atau MA Maarif"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Keaktifan Organisasi *
              </label>
              <select
                value={formUnit.activeStatus}
                onChange={(e) => setFormUnit({ ...formUnit, activeStatus: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
              >
                <option value="AKTIF">Aktif Beroperasi</option>
                <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
                <option value="TIDAK_AKTIF">Tidak Aktif</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Ketua IPNU
              </label>
              <input
                type="text"
                value={formUnit.leaderIpnu}
                onChange={(e) => setFormUnit({ ...formUnit, leaderIpnu: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Ketua IPPNU
              </label>
              <input
                type="text"
                value={formUnit.leaderIppnu}
                onChange={(e) => setFormUnit({ ...formUnit, leaderIppnu: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Pembinaan / Evaluasi PAC
            </label>
            <textarea
              rows={2}
              value={formUnit.statusNotes}
              onChange={(e) => setFormUnit({ ...formUnit, statusNotes: e.target.value })}
              placeholder="Catatan aktivitas, kepengurusan, atau koordinasi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              {selectedUnit ? 'Simpan Perubahan' : 'Buat Pangkalan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteUnit(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Hapus Data Pangkalan"
        message="Apakah Anda yakin ingin menghapus data ranting/komisariat ini? Seluruh data yang terkait akan terpengaruh."
        confirmLabel="Ya, Hapus Pangkalan"
        variant="danger"
      />
    </div>
  );
};
