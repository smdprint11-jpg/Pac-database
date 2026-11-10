import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  CheckCircle2,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    unitOrSchool: '',
    phone: '',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      showToast('Harap lengkapi nama dan pesan Anda', 'error');
      return;
    }
    setIsSent(true);
    showToast('Pesan pengaduan berhasil dikirim ke Sekretariat PAC', 'success');
    setFormData({ name: '', unitOrSchool: '', phone: '', message: '' });
    setTimeout(() => setIsSent(false), 4000);
  };

  const title = settings.sectionTitles?.kontakTitle || 'Pusat Layanan & Pengaduan Administrasi';
  const subtitle = settings.sectionTitles?.kontakSubtitle || 'Layanan konsultasi SP, delegasi pemateri kaderisasi, dan aspirasi ranting/komisariat';

  const waNumber = settings.whatsapp || settings.phone || '6281234567890';
  const cleanWa = waNumber.replace(/[^0-9]/g, '');

  return (
    <section id="kontak" className="py-12 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Phone className="w-3 h-3" />
              <span>Sekretariat PAC Dukun</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanWa}?text=Halo%20Sekretariat%20PAC%20IPNU%20IPPNU%20Dukun,%20saya%20ingin%20berkonsultasi`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp Sekretariat</span>
          </a>
        </div>

        {/* Minimalist 2-Column Grid (Space-Saving) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Compact Info Card & Social */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Informasi Kontak Resmi
              </h3>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Sekretariat</span>
                    <span className="font-medium text-slate-800 line-clamp-2">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Email Resmi</span>
                    <span className="font-mono text-slate-800 text-[11px] truncate block">{settings.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Telepon / WhatsApp</span>
                    <span className="font-mono text-slate-800 text-[11px] truncate block">{settings.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links pills */}
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Media Sosial:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 transition text-[11px] font-semibold"
                  >
                    <Instagram className="w-3 h-3" />
                    <span>Instagram</span>
                  </a>
                )}
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition text-[11px] font-semibold"
                  >
                    <Facebook className="w-3 h-3" />
                    <span>Facebook</span>
                  </a>
                )}
                {settings.tiktok && (
                  <a
                    href={settings.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 transition text-[11px] font-semibold"
                  >
                    <span className="font-bold text-[10px]">TT</span>
                    <span>TikTok</span>
                  </a>
                )}
                {settings.youtube && (
                  <a
                    href={settings.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition text-[11px] font-semibold"
                  >
                    <Youtube className="w-3 h-3" />
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Minimalist Form */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Form Pengaduan & Permohonan Administrasi
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Respons Cepat 1x24 Jam</span>
              </div>

              {isSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1.5 animate-in fade-in duration-200 my-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                  <h4 className="text-xs font-bold text-emerald-950">Pesan Pengaduan Berhasil Dikirimkan</h4>
                  <p className="text-[11px] text-emerald-700">
                    Terima kasih, tim sekretariat PAC Dukun akan segera menindaklanjuti.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Pengirim *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nama lengkap..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Pangkalan Ranting / PK
                      </label>
                      <input
                        type="text"
                        value={formData.unitOrSchool}
                        onChange={(e) => setFormData({ ...formData, unitOrSchool: e.target.value })}
                        placeholder="Contoh: PR Sumber..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        No. WhatsApp Aktif
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 081234567890..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Pesan / Pengaduan Administrasi *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Sampaikan kendala pengajuan SP, pendampingan kaderisasi, atau aspirasi organisasi..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white resize-none"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pesan Pengaduan</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
