import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog } from '../../types';
import { Clock, Search, ShieldCheck, User, Filter, Download } from 'lucide-react';

export const ActivityLogsView: React.FC = () => {
  const { logs, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExportLogs = () => {
    const headers = ['Waktu', 'Pengguna', 'Peran', 'Aksi', 'Target', 'Rincian'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      l.userRole,
      `"${l.action}"`,
      `"${l.target}"`,
      `"${l.details || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Log_Pelajar_NU_Dukun_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Log audit berhasil diunduh', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Log Aktivitas & Audit Trail Keamanan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekam jejak setiap perubahan data, input anggota, pengunggahan dokumen SP, dan sesi login
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Log CSV</span>
        </button>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari aksi, nama pengguna, atau nama target..."
          className="w-full text-xs outline-hidden bg-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-40">Waktu Kejadian</th>
                <th className="py-3 px-4">Pengguna & Peran</th>
                <th className="py-3 px-4">Tindakan / Aksi</th>
                <th className="py-3 px-4">Target Entitas</th>
                <th className="py-3 px-4">Rincian Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <span className="text-[10px] font-mono uppercase text-emerald-700">
                      {log.userRole.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-800">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada riwayat aktivitas yang cocok</p>
          </div>
        )}
      </div>
    </div>
  );
};
