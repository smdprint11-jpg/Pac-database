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
  const subtitle =
    settings.sectionTitles?.kontakSubtitle ||
    'Konsultasi cepat pengajuan SP, delegasi kaderisasi, & layanan administrasi PAC Dukun';

  const waNumber = settings.whatsapp || settings.phone || '6281234567890';
  const cleanWa = waNumber.replace(/[^0-9]/g, '');

  return (
    <section id="kontak" className="py-3.5 sm:py-8 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5">
          {/* Ultra-Compact Header Row */}
          <div className="flex flex-row items-center justify-between gap-2 pb-2.5 mb-2.5 sm:pb-3 sm:mb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-base font-extrabold text-slate-900 leading-tight truncate">
                  {title}
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1">{subtitle}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWa}?text=Halo%20Sekretariat%20PAC%20IPNU%20IPPNU%20Dukun,%20saya%20ingin%20berkonsultasi`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-[11px] font-bold transition shadow-2xs shrink-0"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>WA Sekretariat</span>
            </a>
          </div>

          {/* Ultra-Minimalist 2-Column Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5 items-center">
            {/* Left: Compact Info Pills */}
            <div className="lg:col-span-5 space-y-1.5 sm:space-y-2 text-[10px] sm:text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate font-medium text-slate-700">{settings.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-mono text-[9px] sm:text-[10px] text-slate-700">
                    {settings.email}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-mono text-[9px] sm:text-[10px] text-slate-700">
                    {settings.phone}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-semibold"
                  >
                    <Instagram className="w-2.5 h-2.5" /> IG
                  </a>
                )}
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold"
                  >
                    <Facebook className="w-2.5 h-2.5" /> FB
                  </a>
                )}
                {settings.youtube && (
                  <a
                    href={settings.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold"
                  >
                    <Youtube className="w-2.5 h-2.5" /> YT
                  </a>
                )}
              </div>
            </div>

            {/* Right: Minimalist Inline Form */}
            <div className="lg:col-span-7">
              {isSent ? (
                <div className="p-2.5 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>Pesan pengaduan telah diterima Sekretariat PAC Dukun.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2">
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama *"
                      className="w-full px-2 py-1.5 sm:px-2.5 rounded-lg border border-slate-200 text-[10px] sm:text-[11px] focus:outline-none focus:border-emerald-500 bg-slate-50/60"
                    />
                    <input
                      type="text"
                      value={formData.unitOrSchool}
                      onChange={(e) => setFormData({ ...formData, unitOrSchool: e.target.value })}
                      placeholder="Ranting / PK"
                      className="w-full px-2 py-1.5 sm:px-2.5 rounded-lg border border-slate-200 text-[10px] sm:text-[11px] focus:outline-none focus:border-emerald-500 bg-slate-50/60"
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="No. WA"
                      className="w-full px-2 py-1.5 sm:px-2.5 rounded-lg border border-slate-200 text-[10px] sm:text-[11px] focus:outline-none focus:border-emerald-500 bg-slate-50/60"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <input
                      type="text"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tulis pesan / kendala pengajuan SP / aspirasi administrasi *"
                      className="flex-1 px-2 py-1.5 sm:px-2.5 rounded-lg border border-slate-200 text-[10px] sm:text-[11px] focus:outline-none focus:border-emerald-500 bg-slate-50/60"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 sm:px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] sm:text-[11px] transition flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim</span>
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
