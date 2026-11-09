import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ConfirmModal } from '../common/ConfirmModal';
import { SpDocument, SpStatus, OrganizationType } from '../../types';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  FileCheck,
  Building2,
  School,
  Download,
  ShieldCheck,
  Calendar,
  User,
} from 'lucide-react';

export const SpDocumentsView: React.FC = () => {
  const { spDocuments, units, currentUser, addSpDocument, verifySpDocument, deleteSpDocument, showToast } =
    useApp();

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin_pac';
  const isBranchUser = currentUser?.role === 'user_ranting' || currentUser?.role === 'user_pk';
  const targetUnitId = currentUser?.targetUnitId;

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SpStatus>('ALL');
  const [orgFilter, setOrgFilter] = useState<'ALL' | OrganizationType>('ALL');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedSp, setSelectedSp] = useState<SpDocument | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [verifyStatusAction, setVerifyStatusAction] = useState<SpStatus>('AKTIF');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    spNumber: `SP/${Math.floor(100 + Math.random() * 900)}/PC-IPNU/2026`,
    unitId: isBranchUser && targetUnitId ? targetUnitId : units[0]?.id || '',
    organization: 'IPNU' as OrganizationType,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '2028-12-31',
    legalizationDate: new Date().toISOString().split('T')[0],
    leaderName: '',
    secretaryName: '',
    fileName: 'SK_PENGESAHAN_PENGURUS.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  });

  const availableDocs = isBranchUser && targetUnitId
    ? spDocuments.filter((d) => d.unitId === targetUnitId)
    : spDocuments;

  const filteredDocs = availableDocs.filter((d) => {
    const matchesSearch =
      d.spNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.leaderName ? d.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) : false);

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesOrg = orgFilter === 'ALL' || d.organization === orgFilter;

    return matchesSearch && matchesStatus && matchesOrg;
  });

  const handleOpenUpload = () => {
    const currentUnit = units.find((u) => u.id === (isBranchUser && targetUnitId ? targetUnitId : units[0]?.id));
    setUploadForm({
      spNumber: `SP/${Math.floor(100 + Math.random() * 900)}/PC-IPNU/2026`,
      unitId: currentUnit?.id || '',
      organization: 'IPNU',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '2028-12-31',
      legalizationDate: new Date().toISOString().split('T')[0],
      leaderName: currentUnit?.leaderIpnu || '',
      secretaryName: '',
      fileName: `SP_${currentUnit?.name?.replace(/\s+/g, '_') || 'DOKUMEN'}.pdf`,
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    });
    setIsUploadModalOpen(true);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUnit = units.find((u) => u.id === uploadForm.unitId) || units[0];

    addSpDocument({
      spNumber: uploadForm.spNumber,
      unitId: assignedUnit.id,
      unitName: assignedUnit.name,
      unitType: assignedUnit.type,
      organization: uploadForm.organization,
      validFrom: uploadForm.validFrom,
      validUntil: uploadForm.validUntil,
      legalizationDate: uploadForm.legalizationDate,
      leaderName: uploadForm.leaderName,
      secretaryName: uploadForm.secretaryName,
      fileUrl: uploadForm.fileUrl,
      fileName: uploadForm.fileName,
      fileSize: '1.6 MB',
      status: isAdmin ? 'AKTIF' : 'MENUNGGU_VERIFIKASI',
    });

    setIsUploadModalOpen(false);
  };

  const handleConfirmVerify = () => {
    if (selectedSp) {
      verifySpDocument(selectedSp.id, verifyStatusAction, verifyNotes);
      setIsVerifyModalOpen(false);
      setSelectedSp(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pengelolaan Dokumen SP (Surat Pengesahan)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem verifikasi SK kepengurusan Ranting dan Komisariat oleh PAC IPNU IPPNU Dukun
          </p>
        </div>

        <button
          onClick={handleOpenUpload}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Pengajuan SP</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor SP, nama ranting/ketua..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Organisasi (IPNU & IPPNU)</option>
            <option value="IPNU">IPNU</option>
            <option value="IPPNU">IPPNU</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Semua Status SP</option>
            <option value="AKTIF">Aktif / Disetujui</option>
            <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
            <option value="TIDAK_AKTIF">Tidak Aktif / Ditolak</option>
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-auto">
            Total: <strong>{filteredDocs.length}</strong> Dokumen
          </span>
        </div>
      </div>

      {/* SP Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => {
          let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          let statusText = 'Sah & Aktif';

          if (doc.status === 'MENUNGGU_VERIFIKASI') {
            badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
            statusText = 'Menunggu Verifikasi';
          } else if (doc.status === 'DITOLAK' || (doc.status as any) === 'TIDAK_AKTIF') {
            badgeColor = 'bg-red-100 text-red-800 border-red-200';
            statusText = 'Tidak Aktif / Ditolak';
          }

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {doc.organization} • {doc.unitType}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                    {statusText}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                  {doc.unitName}
                </h3>
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-4">
                  {doc.spNumber}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ketua:</span>
                    <strong className="text-slate-800 truncate max-w-[170px]">{doc.leaderName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sekretaris:</span>
                    <span className="text-slate-700 truncate max-w-[170px]">{doc.secretaryName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masa Berlaku:</span>
                    <span className="font-mono text-slate-800">{doc.validUntil}</span>
                  </div>
                </div>

                {doc.verificationNotes && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mb-3">
                    <strong>Catatan PAC:</strong> {doc.verificationNotes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSp(doc)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lihat Berkas</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setSelectedSp(doc);
                      setVerifyStatusAction(doc.status === 'AKTIF' ? 'DITOLAK' : 'AKTIF');
                      setVerifyNotes(doc.verificationNotes || '');
                      setIsVerifyModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verifikasi</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada dokumen SP yang sesuai filter</p>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Unggah Pengajuan Surat Pengesahan (SP)"
        subtitle="Upload berkas PDF hasil konferensi/rapat anggota ranting/komisariat"
        maxWidth="xl"
      >
        <form onSubmit={handleSubmitUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pangkalan Ranting / PK *
              </label>
              <select
                disabled={isBranchUser}
                value={uploadForm.unitId}
                onChange={(e) => setUploadForm({ ...uploadForm, unitId: e.target.value })}
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
                Organisasi *
              </label>
              <select
                value={uploadForm.organization}
                onChange={(e) => setUploadForm({ ...uploadForm, organization: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="IPNU">IPNU</option>
                <option value="IPPNU">IPPNU</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Surat Pengesahan (SP) *
              </label>
              <input
                type="text"
                required
                value={uploadForm.spNumber}
                onChange={(e) => setUploadForm({ ...uploadForm, spNumber: e.target.value })}
                placeholder="SP/012/PC-IPNU/2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Masa Berlaku Hingga *
              </label>
              <input
                type="date"
                required
                value={uploadForm.validUntil}
                onChange={(e) => setUploadForm({ ...uploadForm, validUntil: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Ketua Terpilih *
              </label>
              <input
                type="text"
                required
                value={uploadForm.leaderName}
                onChange={(e) => setUploadForm({ ...uploadForm, leaderName: e.target.value })}
                placeholder="Nama Ketua"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Sekretaris
              </label>
              <input
                type="text"
                value={uploadForm.secretaryName}
                onChange={(e) => setUploadForm({ ...uploadForm, secretaryName: e.target.value })}
                placeholder="Nama Sekretaris"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              File Lampiran Dokumen (Format PDF/Scan Berita Acara)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 p-4 rounded-2xl text-center bg-slate-50/50 cursor-pointer transition">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-800">{uploadForm.fileName}</div>
              <span className="text-[11px] text-slate-500">
                Ukuran maksimal 5MB (Format .pdf atau .png/.jpg)
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              Simpan & Ajukan SP
            </button>
          </div>
        </form>
      </Modal>

      {/* View Document Modal */}
      {selectedSp && !isVerifyModalOpen && (
        <Modal
          isOpen={!!selectedSp}
          onClose={() => setSelectedSp(null)}
          title={`Dokumen ${selectedSp.organization} - ${selectedSp.unitName}`}
          subtitle={`Nomor: ${selectedSp.spNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Pangkalan:</span>
                <strong className="text-slate-900">{selectedSp.unitName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Masa Berlaku:</span>
                <span className="font-mono text-slate-900">
                  {selectedSp.validFrom} s/d {selectedSp.validUntil}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Validasi:</span>
                <strong className="text-emerald-700">{selectedSp.status}</strong>
              </div>
              {selectedSp.verifiedBy && (
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Diverifikasi oleh:</span>
                  <span className="text-slate-800">
                    {selectedSp.verifiedBy} ({selectedSp.verifiedAt})
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-center space-y-3">
              <FileText className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <strong className="block text-sm text-slate-900">{selectedSp.fileName}</strong>
                <span className="text-xs text-slate-500">{selectedSp.fileSize || '1.4 MB'} • Dokumen Terenkripsi</span>
              </div>
              <a
                href={selectedSp.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                <Download className="w-4 h-4" />
                <span>Unduh / Pratinjau PDF</span>
              </a>
            </div>

            <button
              onClick={() => setSelectedSp(null)}
              className="w-full py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100"
            >
              Tutup
            </button>
          </div>
        </Modal>
      )}

      {/* Verify / Moderation Modal (Admin Only) */}
      {selectedSp && isVerifyModalOpen && (
        <Modal
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          title="Verifikasi Dokumen Surat Pengesahan"
          subtitle={`${selectedSp.unitName} (${selectedSp.spNumber})`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Keputusan Status Verifikasi:
              </label>
              <select
                value={verifyStatusAction}
                onChange={(e) => setVerifyStatusAction(e.target.value as SpStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="AKTIF">Disetujui & Ditetapkan AKTIF</option>
                <option value="MENUNGGU_VERIFIKASI">Tetap Menunggu Verifikasi</option>
                <option value="TIDAK_AKTIF">Tolak / Perlu Revisi Berkas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Verifikasi / Alasan Penolakan:
              </label>
              <textarea
                rows={3}
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
                placeholder="Contoh: Berkas sah, lampiran SK PC IPNU lengkap..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmVerify}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                Simpan Verifikasi
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
