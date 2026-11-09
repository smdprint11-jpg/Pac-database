import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { Officer, OrganizationType } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  CheckCircle2,
  Award,
  User,
} from 'lucide-react';

export const PacOfficersView: React.FC = () => {
  const { officers, addOfficer, updateOfficer, deleteOfficer, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [orgFilter, setOrgFilter] = useState<'ALL' | OrganizationType>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    nia: '',
    gender: 'L' as 'L' | 'P',
    position: '',
    department: 'Badan Pengurus Harian',
    organization: 'IPNU' as OrganizationType,
    phone: '',
    email: '',
    photoUrl: '',
    period: '2024 - 2026',
    status: 'Aktif' as 'Aktif' | 'Demisioner' | 'Nonaktif',
    bio: '',
    orderIndex: 1,
  });

  const pacOfficers = officers.filter((o) => !o.unitId);

  const filteredOfficers = pacOfficers.filter((o) => {
    const matchesSearch =
      o.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.nia ? o.nia.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      o.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.department ? o.department.toLowerCase().includes(searchQuery.toLowerCase()) : false);

    const matchesOrg = orgFilter === 'ALL' || o.organization === orgFilter;
    return matchesSearch && matchesOrg;
  });

  const handleOpenAdd = () => {
    setSelectedOfficer(null);
    setFormData({
      fullName: '',
      nia: `35.25.04.2024.${Math.floor(10 + Math.random() * 90)}`,
      gender: 'L',
      position: 'Koordinator Departemen',
      department: 'Departemen Kaderisasi',
      organization: 'IPNU',
      phone: '081234567890',
      email: '',
      photoUrl: '',
      period: '2024 - 2026',
      status: 'Aktif',
      bio: '',
      orderIndex: pacOfficers.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (officer: Officer) => {
    setSelectedOfficer(officer);
    setFormData({
      fullName: officer.fullName,
      nia: officer.nia || '',
      gender: officer.gender || 'L',
      position: officer.position,
      department: officer.department || '',
      organization: (officer.organization === 'IPPNU' ? 'IPPNU' : 'IPNU') as any,
      phone: officer.phone || '',
      email: officer.email || '',
      photoUrl: officer.photoUrl || officer.avatar || '',
      period: officer.period,
      status: (officer.status as any) || 'Aktif',
      bio: officer.bio || officer.description || '',
      orderIndex: officer.orderIndex || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOfficer) {
      updateOfficer(selectedOfficer.id, formData as any);
    } else {
      addOfficer(formData as any);
    }
    setIsModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['No', 'Nama Lengkap', 'NIA', 'Gender', 'Jabatan', 'Departemen', 'Organisasi', 'No HP', 'Periode', 'Status'];
    const rows = filteredOfficers.map((o, idx) => [
      idx + 1,
      `"${o.fullName}"`,
      `"${o.nia}"`,
      o.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      `"${o.position}"`,
      `"${o.department}"`,
      o.organization,
      `"${o.phone}"`,
      `"${o.period}"`,
      o.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pengurus_PAC_IPNU_IPPNU_DUKUN_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV berhasil diunduh', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Database Pengurus PAC IPNU IPPNU Dukun
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar jajaran Pimpinan Harian, Departemen, dan Lembaga PAC Dukun Masa Khidmat 2024 - 2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Pengurus</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIA, atau jabatan..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Organisasi ({pacOfficers.length})</option>
            <option value="IPNU">IPNU</option>
            <option value="IPPNU">IPPNU</option>
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-auto">
            Total: <strong>{filteredOfficers.length}</strong> Pengurus
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
                <th className="py-3 px-4">Nama Lengkap & NIA</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Departemen</th>
                <th className="py-3 px-4">Organisasi</th>
                <th className="py-3 px-4">Kontak WhatsApp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((officer, idx) => {
                const isIpnu = officer.organization === 'IPNU';
                return (
                  <tr key={officer.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {officer.photoUrl ? (
                          <img src={officer.photoUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                            {officer.fullName.charAt(0)}
                          </div>
                        )}
                        <span>{officer.fullName}</span>
                      </div>
                      <div className="text-[11px] font-mono text-emerald-700 mt-0.5">{officer.nia}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{officer.position}</td>
                    <td className="py-3 px-4 text-slate-600">{officer.department}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isIpnu ? 'bg-emerald-100 text-emerald-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {officer.organization}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{officer.phone}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {officer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(officer)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(officer.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedOfficer ? 'Edit Data Pengurus PAC' : 'Tambah Pengurus PAC Baru'}
        subtitle="Masa Khidmat 2024 - 2026"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Induk Anggota (NIA) *</label>
              <input
                type="text"
                required
                value={formData.nia}
                onChange={(e) => setFormData({ ...formData, nia: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Contoh: Ketua, Sekretaris, Koordinator..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Departemen / Lembaga *</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organisasi *</label>
              <select
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor HP / WhatsApp *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL Foto Profil</label>
            <input
              type="url"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Biografi Singkat</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              Simpan Data Pengurus
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteOfficer(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        title="Hapus Data Pengurus"
        message="Apakah Anda yakin ingin menghapus pengurus ini dari susunan kepengurusan PAC?"
        confirmLabel="Ya, Hapus"
        variant="danger"
      />
    </div>
  );
};
