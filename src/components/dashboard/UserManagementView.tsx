import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { UserAccount, UserRole } from '../../types';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Building2,
  School,
  Lock,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Key,
  Calendar,
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, units, addUser, updateUser, deleteUser, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'user_ranting' as UserRole,
    targetUnitId: units[0]?.id || '',
    email: '',
    phone: '',
    isActive: true,
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.targetUnitName && u.targetUnitName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      fullName: '',
      role: 'user_ranting',
      targetUnitId: units[0]?.id || '',
      email: '',
      phone: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      targetUnitId: user.targetUnitId || units[0]?.id || '',
      email: user.email || '',
      phone: user.phone || '',
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUnit = units.find((u) => u.id === formData.targetUnitId);

    if (selectedUser) {
      updateUser(selectedUser.id, {
        ...formData,
        targetUnitName: assignedUnit?.name,
        targetUnitType: assignedUnit?.type,
      });
    } else {
      addUser({
        ...formData,
        targetUnitName: assignedUnit?.name,
        targetUnitType: assignedUnit?.type,
      });
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (user: UserAccount) => {
    updateUser(user.id, { isActive: !user.isActive });
    showToast(`Status akun ${user.username} diubah`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Manajemen Pengguna & Hak Akses (RBAC)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat akun login, atur peran operator Ranting/PK, dan kelola kata sandi sistem
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Buat Akun Pengguna</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari username atau nama lengkap..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Hak Akses (Role)</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin_pac">Admin PAC</option>
            <option value="user_ranting">User Ranting</option>
            <option value="user_pk">User PK (Komisariat)</option>
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-auto">
            Total: <strong>{filteredUsers.length}</strong> Akun
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
                <th className="py-3 px-4">Nama Akun & Username</th>
                <th className="py-3 px-4">Hak Akses (Role)</th>
                <th className="py-3 px-4">Unit Penugasan</th>
                <th className="py-3 px-4">Login Terakhir</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user, idx) => {
                let roleColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                if (user.role === 'user_ranting') {
                  roleColor = 'bg-teal-100 text-teal-800 border-teal-200';
                } else if (user.role === 'user_pk') {
                  roleColor = 'bg-blue-100 text-blue-800 border-blue-200';
                }

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-500">@{user.username}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${roleColor}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {user.targetUnitName || <span className="text-slate-400 italic">Akses Global PAC</span>}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {user.lastLogin || 'Belum pernah login'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                          user.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aktif
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-red-600" /> Dinonaktifkan
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteUserId(user.id)}
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

      {/* Modal Add / Edit User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Edit Akun Pengguna' : 'Buat Akun Pengguna Baru'}
        subtitle="Kelola kredensial login pimpinan ranting dan komisariat"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Pengguna / Operator *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Contoh: Operator PR Sumber"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username Unik *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="contoh: pr_sumber"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tingkat Hak Akses (Role) *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="user_ranting">User Ranting (Hanya Kelola Ranting Sendiri)</option>
              <option value="user_pk">User PK (Hanya Kelola Komisariat Sendiri)</option>
              <option value="admin_pac">Admin PAC (Hak Kelola Operasional)</option>
              <option value="super_admin">Super Admin (Akses Penuh Seluruh Sistem)</option>
            </select>
          </div>

          {(formData.role === 'user_ranting' || formData.role === 'user_pk') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tautkan ke Pangkalan Ranting / PK *
              </label>
              <select
                value={formData.targetUnitId}
                onChange={(e) => setFormData({ ...formData, targetUnitId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@pelajarnu.id"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
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
              Simpan Akun
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={() => {
          if (deleteUserId) deleteUser(deleteUserId);
        }}
        title="Hapus Akun Pengguna"
        message="Yakin ingin menghapus akun pengguna ini? Pengguna tidak akan dapat login kembali."
        confirmLabel="Ya, Hapus"
        variant="danger"
      />
    </div>
  );
};
