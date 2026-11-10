import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { Member } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  CreditCard,
  Edit,
  Trash2,
  Phone,
  Camera,
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  FileText,
} from 'lucide-react';
import { exportMembersToPdf } from '../../utils/pdfExport';

export const MembersView: React.FC = () => {
  const {
    members,
    units,
    currentUser,
    addMember,
    updateMember,
    deleteMember,
    bulkAddMembers,
    showToast,
    settings,
  } = useApp();
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const isBranchUser = currentUser?.role === 'user_ranting' || currentUser?.role === 'user_pk';
  const targetUnitId = currentUser?.targetUnitId;
  const targetUnitName = currentUser?.targetUnitName;

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState<string>(isBranchUser && targetUnitId ? targetUnitId : 'ALL');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'L' | 'P'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | string>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isKtaModalOpen, setIsKtaModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    nia: '',
    nik: '',
    gender: 'L' as 'L' | 'P',
    birthPlace: 'Gresik',
    birthDate: '2006-01-01',
    address: '',
    phone: '',
    schoolOrOccupation: '',
    unitId: isBranchUser && targetUnitId ? targetUnitId : units[0]?.id || '',
    membershipStatus: 'Aktif',
    position: 'Anggota',
    joinYear: 2024,
    avatar: '',
  });

  // Bulk import state
  const [bulkCsvText, setBulkCsvText] = useState('');

  // Scoped members: if branch user, strictly lock to own unit
  const availableMembers = isBranchUser && targetUnitId
    ? members.filter((m) => m.unitId === targetUnitId)
    : members;

  const filteredMembers = availableMembers.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.occupation && m.occupation.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesUnit = unitFilter === 'ALL' || m.unitId === unitFilter;
    const matchesGender = genderFilter === 'ALL' || m.gender === genderFilter;
    const matchesStatus = statusFilter === 'ALL';

    return matchesSearch && matchesUnit && matchesGender && matchesStatus;
  });

  // Handle image upload from computer / phone
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran foto terlalu besar, maksimal 2 MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        showToast('Pas foto berhasil diunggah', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Open add modal
  const handleOpenAdd = () => {
    setSelectedMember(null);
    setFormData({
      fullName: '',
      nia: `35.25.04.${Math.floor(1000 + Math.random() * 9000)}`,
      nik: '',
      gender: 'L',
      birthPlace: 'Gresik',
      birthDate: '2006-05-10',
      address: '',
      phone: '',
      schoolOrOccupation: '',
      unitId: isBranchUser && targetUnitId ? targetUnitId : units[0]?.id || '',
      membershipStatus: 'Aktif',
      position: 'Anggota',
      joinYear: 2024,
      avatar: '',
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (m: Member) => {
    // Branch user can only edit their own members
    if (isBranchUser && m.unitId !== targetUnitId) {
      showToast('Anda hanya memiliki izin mengedit data anggota pangkalan sendiri', 'error');
      return;
    }
    setSelectedMember(m);
    setFormData({
      fullName: m.fullName,
      nia: m.nia,
      nik: m.nik || '',
      gender: m.gender,
      birthPlace: m.birthPlace,
      birthDate: m.birthDate,
      address: m.address,
      phone: m.phone || '',
      schoolOrOccupation: m.occupation || '',
      unitId: m.unitId,
      membershipStatus: 'Aktif',
      position: 'Anggota',
      joinYear: Number(m.kaderisasiYear) || 2024,
      avatar: m.avatar || '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUnitId = isBranchUser && targetUnitId ? targetUnitId : formData.unitId;
    const assignedUnit = units.find((u) => u.id === assignedUnitId) || units[0];

    if (selectedMember) {
      updateMember(selectedMember.id, {
        fullName: formData.fullName,
        nia: formData.nia,
        nik: formData.nik,
        gender: formData.gender,
        birthPlace: formData.birthPlace,
        birthDate: formData.birthDate,
        address: formData.address,
        phone: formData.phone,
        unitId: assignedUnit.id,
        unitName: assignedUnit.name,
        occupation: formData.schoolOrOccupation,
        avatar: formData.avatar,
      });
      showToast('Data anggota berhasil diperbarui', 'success');
    } else {
      const res = addMember({
        fullName: formData.fullName,
        nia: formData.nia,
        nik: formData.nik,
        gender: formData.gender,
        birthPlace: formData.birthPlace,
        birthDate: formData.birthDate,
        address: formData.address,
        phone: formData.phone,
        unitId: assignedUnit.id,
        unitName: assignedUnit.name,
        occupation: formData.schoolOrOccupation,
        lastKaderisasi: 'MAKESTA',
        kaderisasiYear: String(formData.joinYear),
        avatar: formData.avatar,
      });
      if (!res.success) return;
    }
    setIsAddModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Nama Lengkap',
      'NIA',
      'Gender',
      'Pangkalan',
      'Tempat Lahir',
      'Tgl Lahir',
      'No HP/WA',
      'Alamat',
      'Pekerjaan/Sekolah',
    ];
    const rows = filteredMembers.map((m) => [
      m.id,
      `"${m.fullName}"`,
      `"${m.nia}"`,
      m.gender === 'L' ? 'IPNU' : 'IPPNU',
      `"${m.unitName}"`,
      `"${m.birthPlace}"`,
      m.birthDate,
      `"${m.phone || ''}"`,
      `"${m.address.replace(/"/g, '""')}"`,
      `"${m.occupation || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `database_anggota_${isBranchUser ? targetUnitName || 'ranting' : 'pac_dukun'}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data anggota berhasil diekspor ke CSV', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Database Kader Santri & Pelajar NU
            </h2>
            {isBranchUser && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Lock className="w-3 h-3 text-emerald-700" />
                <span>Data Khusus {targetUnitName || 'Ranting Anda'}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBranchUser
              ? `Manajemen data keanggotaan dan pencetakan KTA resmi pangkalan ${targetUnitName}`
              : 'Pusat data kader IPNU & IPPNU dari seluruh ranting desa dan komisariat se-Kecamatan Dukun'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isExportingPdf || filteredMembers.length === 0}
            onClick={async () => {
              try {
                setIsExportingPdf(true);
                showToast('Menyiapkan dokumen PDF beserta pas foto anggota...', 'info');
                const scopeLabel = isBranchUser
                  ? targetUnitName || 'Pangkalan Ranting/PK'
                  : unitFilter !== 'ALL'
                  ? units.find((u) => u.id === unitFilter)?.name || 'Unit Terpilih'
                  : 'Seluruh Pangkalan PAC & Ranting/PK';
                await exportMembersToPdf(filteredMembers, settings, scopeLabel);
                showToast('PDF Data Real & Foto Anggota berhasil diunduh', 'success');
              } catch {
                showToast('Gagal mengekspor PDF', 'error');
              } finally {
                setIsExportingPdf(false);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{isExportingPdf ? 'Memproses PDF...' : 'Export PDF (Data & Foto)'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Impor Data CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Input Anggota Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama anggota, NIA, alamat, atau sekolah..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {!isBranchUser && (
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">Semua Ranting & PK ({units.length})</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Gender</option>
            <option value="L">Laki-laki (IPNU)</option>
            <option value="P">Perempuan (IPPNU)</option>
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-auto">
            Total: <strong>{filteredMembers.length}</strong> Kader Terdaftar
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Pas Foto & Nama</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Pangkalan / Ranting</th>
                <th className="py-3 px-4">Sekolah / Profesi</th>
                <th className="py-3 px-4">WhatsApp / HP</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data anggota yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => {
                  const isIpnu = member.gender === 'L';
                  const canEdit = !isBranchUser || member.unitId === targetUnitId;
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                              {member.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{member.fullName}</div>
                            <div className="text-[11px] font-mono text-emerald-700">{member.nia}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                            isIpnu ? 'bg-emerald-100 text-emerald-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isIpnu ? 'IPNU' : 'IPPNU'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {member.unitName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{member.occupation || '-'}</div>
                        <div className="text-[11px] text-slate-400">Asal: {member.birthPlace}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {member.phone ? (
                          <a
                            href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 hover:underline"
                            title="Chat via WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{member.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setIsKtaModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                            title="Cetak Kartu Tanda Anggota (KTA)"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(member)}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                title="Edit Data Anggota"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(member.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                                title="Hapus Anggota"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={selectedMember ? 'Edit Data Anggota' : 'Input Anggota Baru'}
        subtitle="Lengkapi data kader santri dan unggah pas foto resmi"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveMember} className="space-y-4">
          {/* Pas Foto Upload Area */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Pas Foto Resmi Anggota (Ukuran 3x4 / 4x6)
            </label>
            <div className="flex items-center gap-4">
              {formData.avatar ? (
                <div className="relative group w-20 h-24 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-slate-100">
                  <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: '' })}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                    title="Hapus Foto"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[10px] shrink-0 bg-white">
                  <Camera className="w-6 h-6 mb-1 text-slate-400" />
                  <span>Pas Foto</span>
                </div>
              )}

              <div className="space-y-2 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload dari Perangkat</span>
                  </button>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: '' })}
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Atau masukkan URL:</span>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://contoh.com/foto.jpg"
                    className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Anggota *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Contoh: Muhammad Fatih"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Induk Anggota (NIA) *
              </label>
              <input
                type="text"
                required
                value={formData.nia}
                onChange={(e) => setFormData({ ...formData, nia: e.target.value })}
                placeholder="35.25.04.XX.XXXX"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organisasi / Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="L">Laki-laki (IPNU)</option>
                <option value="P">Perempuan (IPPNU)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pangkalan Ranting / PK *
              </label>
              <select
                disabled={isBranchUser}
                value={isBranchUser && targetUnitId ? targetUnitId : formData.unitId}
                onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp Aktif
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="081234567890"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Asal Sekolah / Pekerjaan
              </label>
              <input
                type="text"
                value={formData.schoolOrOccupation}
                onChange={(e) => setFormData({ ...formData, schoolOrOccupation: e.target.value })}
                placeholder="Contoh: MA Ma'arif Dukun"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap Domisili
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Jalan, RT/RW, Dusun, Desa"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {selectedMember ? 'Simpan Perubahan' : 'Tambah Anggota'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Digital KTA Modal */}
      {selectedMember && (
        <Modal
          isOpen={isKtaModalOpen}
          onClose={() => setIsKtaModalOpen(false)}
          title="Pratinjau Kartu Tanda Anggota (KTA)"
          subtitle="KTA Digital Resmi PAC IPNU IPPNU Kecamatan Dukun"
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-600 bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 text-white p-5 flex flex-col justify-between">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/20">
                <div className="flex items-center gap-2.5">
                  {settings.navbarLogoUrl || settings.logoUrl ? (
                    <img
                      src={settings.navbarLogoUrl || settings.logoUrl}
                      alt="Logo"
                      className="w-10 h-10 rounded-xl bg-white object-contain p-1 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 font-bold flex items-center justify-center font-serif text-base shadow-sm">
                      NU
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] font-bold tracking-wider uppercase text-amber-300">
                      KARTU TANDA ANGGOTA
                    </div>
                    <div className="text-sm font-extrabold tracking-tight">
                      {selectedMember.gender === 'L' ? 'IPNU' : 'IPPNU'} KECAMATAN DUKUN
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-400/40 text-emerald-200">
                    RESMI & TERVERIFIKASI
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex items-center gap-4 py-2">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-white/10 border border-white/30 shrink-0 shadow-inner flex items-center justify-center">
                  {selectedMember.avatar ? (
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white/60 font-bold text-2xl">
                      {selectedMember.fullName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs leading-tight">
                  <div className="text-base font-black text-white">{selectedMember.fullName}</div>
                  <div className="text-amber-300 font-mono text-[11px] font-bold">
                    NIA: {selectedMember.nia}
                  </div>
                  <div className="text-emerald-100 text-[11px]">{selectedMember.unitName}</div>
                  <div className="text-white/80 text-[10px] pt-1">
                    TTL: {selectedMember.birthPlace}, {selectedMember.birthDate}
                  </div>
                  {selectedMember.phone && (
                    <div className="text-white/70 text-[10px]">WA: {selectedMember.phone}</div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[9px] text-emerald-200">
                <div>PAC IPNU IPPNU DUKUN • KABUPATEN GRESIK</div>
                <div className="font-mono">BERLAKU: SEUMUR HIDUP</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Kartu (Print)</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Bulk Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Upload & Import Massal Data Anggota"
        subtitle="Salin dan tempel data CSV atau isi sesuai template"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
            <span className="font-bold block mb-1">Format Kolom CSV:</span>
            <code className="text-[11px] block font-mono bg-white p-2 rounded-lg border border-emerald-200 overflow-x-auto">
              NIA, Nama Lengkap, Gender(L/P), Tempat Lahir, Tgl Lahir(YYYY-MM-DD), Alamat, No HP, Asal Sekolah
            </code>
          </div>

          <textarea
            rows={6}
            value={bulkCsvText}
            onChange={(e) => setBulkCsvText(e.target.value)}
            placeholder="35.25.04.1001, Ahmad Fauzi, L, Gresik, 2006-03-12, Desa Dukun RT 01, 08123456789, MA Ma'arif Dukun"
            className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                if (!bulkCsvText.trim()) {
                  showToast('Masukkan teks CSV terlebih dahulu', 'error');
                  return;
                }
                const lines = bulkCsvText.trim().split('\n');
                const defaultUnit = units.find((u) => u.id === (isBranchUser && targetUnitId ? targetUnitId : units[0]?.id)) || units[0];
                const newItems = lines.map((line, idx) => {
                  const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
                  return {
                    nia: cols[0] || `35.25.04.${Math.floor(1000 + Math.random() * 9000)}`,
                    fullName: cols[1] || `Kader Baru ${idx + 1}`,
                    gender: (cols[2]?.toUpperCase() === 'P' ? 'P' : 'L') as 'L' | 'P',
                    birthPlace: cols[3] || 'Gresik',
                    birthDate: cols[4] || '2006-01-01',
                    address: cols[5] || 'Kecamatan Dukun',
                    phone: cols[6] || '',
                    occupation: cols[7] || '',
                    unitId: defaultUnit.id,
                    unitName: defaultUnit.name,
                    lastKaderisasi: 'MAKESTA' as const,
                  };
                });
                const res = bulkAddMembers(newItems);
                showToast(`Berhasil mengimpor ${res.addedCount} anggota`, 'success');
                setIsImportModalOpen(false);
                setBulkCsvText('');
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Proses Impor
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMember(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Hapus Data Anggota"
        message="Apakah Anda yakin ingin menghapus data anggota ini dari database? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Sekarang"
        type="danger"
      />
    </div>
  );
};
