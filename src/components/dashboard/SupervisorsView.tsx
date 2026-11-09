import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { Supervisor, Alumni } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Award,
  GraduationCap,
  Upload,
  Camera,
  X,
  MessageCircle,
} from 'lucide-react';

export const SupervisorsView: React.FC = () => {
  const {
    supervisors,
    alumni,
    addSupervisor,
    updateSupervisor,
    deleteSupervisor,
    addAlumni,
    updateAlumni,
    deleteAlumni,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'supervisors' | 'alumni'>('supervisors');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isSupModalOpen, setIsSupModalOpen] = useState(false);
  const [selectedSup, setSelectedSup] = useState<Supervisor | null>(null);
  const [deleteSupId, setDeleteSupId] = useState<string | null>(null);

  const [isAlmModalOpen, setIsAlmModalOpen] = useState(false);
  const [selectedAlm, setSelectedAlm] = useState<Alumni | null>(null);
  const [deleteAlmId, setDeleteAlmId] = useState<string | null>(null);

  const supPhotoInputRef = useRef<HTMLInputElement>(null);
  const almPhotoInputRef = useRef<HTMLInputElement>(null);

  // Supervisor Form
  const [supForm, setSupForm] = useState({
    fullName: '',
    gender: 'L' as 'L' | 'P',
    roleOrTitle: '',
    originOrganization: 'MWC NU Dukun',
    phone: '',
    address: '',
    notes: '',
    photo: '',
  });

  // Alumni Form
  const [almForm, setAlmForm] = useState({
    fullName: '',
    gender: 'L' as 'L' | 'P',
    pastPosition: '',
    period: '2018 - 2020',
    phone: '',
    address: '',
    currentActivity: '',
    notes: '',
    photo: '',
  });

  // File Upload Handlers
  const handleSupPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran foto terlalu besar, maksimal 2 MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSupForm((prev) => ({ ...prev, photo: reader.result as string }));
        showToast('Pas foto Pembina berhasil diunggah', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlmPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Ukuran foto terlalu besar, maksimal 2 MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAlmForm((prev) => ({ ...prev, photo: reader.result as string }));
        showToast('Pas foto Majelis Alumni berhasil diunggah', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredSupervisors = supervisors.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.roleOrTitle && s.roleOrTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.originOrganization && s.originOrganization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAlumni = alumni.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.pastPosition && a.pastPosition.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.currentActivity && a.currentActivity.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAddSup = () => {
    setSelectedSup(null);
    setSupForm({
      fullName: '',
      gender: 'L',
      roleOrTitle: 'Pembina PAC IPNU Dukun',
      originOrganization: 'MWC NU Dukun',
      phone: '',
      address: '',
      notes: '',
      photo: '',
    });
    setIsSupModalOpen(true);
  };

  const handleOpenEditSup = (s: Supervisor) => {
    setSelectedSup(s);
    setSupForm({
      fullName: s.fullName,
      gender: s.gender || 'L',
      roleOrTitle: s.roleOrTitle || s.title || '',
      originOrganization: s.originOrganization || 'MWC NU Dukun',
      phone: s.phone || '',
      address: s.address || '',
      notes: s.notes || '',
      photo: s.photo || '',
    });
    setIsSupModalOpen(true);
  };

  const handleSaveSup = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSup) {
      updateSupervisor(selectedSup.id, supForm);
      showToast('Data Pembina berhasil diperbarui', 'success');
    } else {
      addSupervisor(supForm);
      showToast('Pembina baru berhasil ditambahkan', 'success');
    }
    setIsSupModalOpen(false);
  };

  const handleOpenAddAlm = () => {
    setSelectedAlm(null);
    setAlmForm({
      fullName: '',
      gender: 'L',
      pastPosition: 'Ketua PAC IPNU Dukun',
      period: '2020 - 2022',
      phone: '',
      address: '',
      currentActivity: 'Wirausaha / Praktisi Pendidikan',
      notes: '',
      photo: '',
    });
    setIsAlmModalOpen(true);
  };

  const handleOpenEditAlm = (a: Alumni) => {
    setSelectedAlm(a);
    setAlmForm({
      fullName: a.fullName,
      gender: a.gender || 'L',
      pastPosition: a.pastPosition || a.formerPosition || '',
      period: a.period || '',
      phone: a.phone || '',
      address: a.address || '',
      currentActivity: a.currentActivity || a.currentProfession || '',
      notes: a.notes || '',
      photo: a.photo || '',
    });
    setIsAlmModalOpen(true);
  };

  const handleSaveAlm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlm) {
      updateAlumni(selectedAlm.id, almForm);
      showToast('Data Majelis Alumni berhasil diperbarui', 'success');
    } else {
      addAlumni(almForm);
      showToast('Alumni baru berhasil dicatat', 'success');
    }
    setIsAlmModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Dewan Pembina & Majelis Alumni PAC Dukun
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Database para kiai, tokoh NU, sesepuh, serta purna pengurus lintas generasi di Kecamatan Dukun
          </p>
        </div>

        <button
          onClick={activeTab === 'supervisors' ? handleOpenAddSup : handleOpenAddAlm}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>{activeTab === 'supervisors' ? 'Tambah Pembina' : 'Tambah Alumni'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('supervisors')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'supervisors'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Dewan Pembina ({supervisors.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('alumni')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'alumni'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Majelis Alumni ({alumni.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'supervisors'
                ? 'Cari nama pembina, jabatan kehormatan, atau lembaga...'
                : 'Cari nama alumni, masa khidmat terdahulu, atau aktivitas sekarang...'
            }
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Supervisors Content */}
      {activeTab === 'supervisors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupervisors.map((sup) => (
            <div
              key={sup.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {sup.photo ? (
                    <img
                      src={sup.photo}
                      alt={sup.fullName}
                      className="w-12 h-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-sm shrink-0">
                      {sup.fullName.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{sup.fullName}</h3>
                    <p className="text-xs text-emerald-700 font-semibold line-clamp-1">
                      {sup.roleOrTitle || sup.title}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                      {sup.originOrganization || 'MWC NU Dukun'}
                    </span>
                  </div>
                </div>

                {sup.notes && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{sup.notes}"
                  </p>
                )}

                <div className="space-y-1 text-xs text-slate-500 pt-1">
                  {sup.phone && (
                    <a
                      href={`https://wa.me/${sup.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono">{sup.phone} (WhatsApp)</span>
                    </a>
                  )}
                  {sup.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{sup.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditSup(sup)}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                  title="Edit Data Pembina"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteSupId(sup.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                  title="Hapus Pembina"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alumni Content */}
      {activeTab === 'alumni' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alm) => (
            <div
              key={alm.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {alm.photo ? (
                    <img
                      src={alm.photo}
                      alt={alm.fullName}
                      className="w-12 h-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-sm shrink-0">
                      {alm.fullName.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{alm.fullName}</h3>
                    <p className="text-xs text-blue-700 font-semibold line-clamp-1">
                      {alm.pastPosition || alm.formerPosition}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600">
                      Periode: {alm.period}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold block text-[11px] text-slate-500">Aktivitas Sekarang:</span>
                  <span>{alm.currentActivity || alm.currentProfession || '-'}</span>
                </div>

                <div className="space-y-1 text-xs text-slate-500 pt-1">
                  {alm.phone && (
                    <a
                      href={`https://wa.me/${alm.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono">{alm.phone} (WhatsApp)</span>
                    </a>
                  )}
                  {alm.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{alm.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditAlm(alm)}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                  title="Edit Data Alumni"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteAlmId(alm.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                  title="Hapus Alumni"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Supervisor Modal */}
      <Modal
        isOpen={isSupModalOpen}
        onClose={() => setIsSupModalOpen(false)}
        title={selectedSup ? 'Edit Data Pembina' : 'Tambah Pembina PAC'}
        subtitle="Masukkan profil kehormatan, pas foto, dan nomor WhatsApp resmi"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveSup} className="space-y-4">
          {/* Pas Foto Upload */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            {supForm.photo ? (
              <div className="relative group w-14 h-18 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0">
                <img src={supForm.photo} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setSupForm({ ...supForm, photo: '' })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ) : (
              <div className="w-14 h-18 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[9px] shrink-0 bg-white">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Pas Foto</span>
              </div>
            )}
            <div className="space-y-1 flex-1">
              <input
                type="file"
                ref={supPhotoInputRef}
                accept="image/*"
                onChange={handleSupPhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => supPhotoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Pas Foto Pembina</span>
              </button>
              <input
                type="url"
                value={supForm.photo}
                onChange={(e) => setSupForm({ ...supForm, photo: e.target.value })}
                placeholder="Atau tempel URL foto..."
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                required
                value={supForm.fullName}
                onChange={(e) => setSupForm({ ...supForm, fullName: e.target.value })}
                placeholder="Contoh: K.H. Moh. Sholeh, M.Pd.I"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Kehormatan / Peran *</label>
              <input
                type="text"
                required
                value={supForm.roleOrTitle}
                onChange={(e) => setSupForm({ ...supForm, roleOrTitle: e.target.value })}
                placeholder="Contoh: Ketua Tanfidziyah MWC NU"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Asal Lembaga / Banom *</label>
              <input
                type="text"
                required
                value={supForm.originOrganization}
                onChange={(e) => setSupForm({ ...supForm, originOrganization: e.target.value })}
                placeholder="Contoh: MWC NU Dukun"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
              <input
                type="tel"
                value={supForm.phone}
                onChange={(e) => setSupForm({ ...supForm, phone: e.target.value })}
                placeholder="081234567890"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Domisili / Alamat</label>
              <input
                type="text"
                value={supForm.address}
                onChange={(e) => setSupForm({ ...supForm, address: e.target.value })}
                placeholder="Desa Dukun / Gresik"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pesan Arahan / Catatan</label>
            <textarea
              rows={2}
              value={supForm.notes}
              onChange={(e) => setSupForm({ ...supForm, notes: e.target.value })}
              placeholder="Pesan nasihat atau bidang pengawalan organisasi..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSupModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {selectedSup ? 'Simpan Perubahan' : 'Tambah Pembina'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Alumni Modal */}
      <Modal
        isOpen={isAlmModalOpen}
        onClose={() => setIsAlmModalOpen(false)}
        title={selectedAlm ? 'Edit Data Alumni' : 'Tambah Majelis Alumni'}
        subtitle="Masukkan rekam jejak kepengurusan, pas foto, dan nomor WhatsApp alumni"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveAlm} className="space-y-4">
          {/* Pas Foto Upload */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            {almForm.photo ? (
              <div className="relative group w-14 h-18 rounded-lg overflow-hidden border border-slate-300 bg-white shrink-0">
                <img src={almForm.photo} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setAlmForm({ ...almForm, photo: '' })}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ) : (
              <div className="w-14 h-18 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[9px] shrink-0 bg-white">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Pas Foto</span>
              </div>
            )}
            <div className="space-y-1 flex-1">
              <input
                type="file"
                ref={almPhotoInputRef}
                accept="image/*"
                onChange={handleAlmPhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => almPhotoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Pas Foto Alumni</span>
              </button>
              <input
                type="url"
                value={almForm.photo}
                onChange={(e) => setAlmForm({ ...almForm, photo: e.target.value })}
                placeholder="Atau tempel URL foto..."
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                required
                value={almForm.fullName}
                onChange={(e) => setAlmForm({ ...almForm, fullName: e.target.value })}
                placeholder="Contoh: H. Mukhlis Ridwan, M.Si"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan Masa Khidmat Dahulu *</label>
              <input
                type="text"
                required
                value={almForm.pastPosition}
                onChange={(e) => setAlmForm({ ...almForm, pastPosition: e.target.value })}
                placeholder="Contoh: Ketua PAC IPNU Dukun"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Periode Masa Bakti *</label>
              <input
                type="text"
                required
                value={almForm.period}
                onChange={(e) => setAlmForm({ ...almForm, period: e.target.value })}
                placeholder="Contoh: 2012 - 2014"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
              <input
                type="tel"
                value={almForm.phone}
                onChange={(e) => setAlmForm({ ...almForm, phone: e.target.value })}
                placeholder="081234567890"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aktivitas / Profesi Sekarang</label>
              <input
                type="text"
                value={almForm.currentActivity}
                onChange={(e) => setAlmForm({ ...almForm, currentActivity: e.target.value })}
                placeholder="Contoh: Dosen / Pengusaha / Tokoh Masyarakat"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAlmModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {selectedAlm ? 'Simpan Perubahan' : 'Tambah Alumni'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modals */}
      <ConfirmModal
        isOpen={!!deleteSupId}
        onClose={() => setDeleteSupId(null)}
        onConfirm={() => {
          if (deleteSupId) {
            deleteSupervisor(deleteSupId);
            setDeleteSupId(null);
          }
        }}
        title="Hapus Data Pembina"
        message="Apakah Anda yakin ingin menghapus data Pembina ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Sekarang"
        type="danger"
      />

      <ConfirmModal
        isOpen={!!deleteAlmId}
        onClose={() => setDeleteAlmId(null)}
        onConfirm={() => {
          if (deleteAlmId) {
            deleteAlumni(deleteAlmId);
            setDeleteAlmId(null);
          }
        }}
        title="Hapus Data Alumni"
        message="Apakah Anda yakin ingin menghapus data Alumni ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Sekarang"
        type="danger"
      />
    </div>
  );
};
