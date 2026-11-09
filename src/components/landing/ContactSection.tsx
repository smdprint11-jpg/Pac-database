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
      showToast('Harap lengkapi nama dan pesan', 'error');
      return;
    }
    setIsSent(true);
    showToast('Pesan Anda berhasil dikirimkan ke Sekretariat PAC', 'success');
    setFormData({ name: '', unitOrSchool: '', phone: '', message: '' });
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <section id="kontak" className="py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Info & Social Links */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Phone className="w-3.5 h-3.5" />
              <span>Pusat Layanan Organisasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hubungi Sekretariat PAC IPNU IPPNU DUKUN
            </h2>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              Membutuhkan informasi seputar administrasi SP, permohonan delegasi pemateri kaderisasi, atau kemitraan kegiatan pelajar? Tim sekretariat kami siap membantu.
            </p>

            {/* Direct Contact Cards */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Alamat Sekretariat
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5 leading-snug">
                    {settings.address}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Surat Elektronik (Email)
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5 font-mono">
                    {settings.email}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    WhatsApp Center
                  </div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">
                    {settings.phone}
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=Halo%20Sekretariat%20PAC%20IPNU%20IPPNU%20Dukun,%20saya%20ingin%20bertanya`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <span>Kirim Pesan WhatsApp Langsung</span>
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Links (3.I) */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                Saluran Media Sosial Resmi:
              </span>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 transition text-xs font-semibold"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition text-xs font-semibold"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 transition text-xs font-semibold"
                >
                  <span className="font-bold text-xs">TT</span>
                  <span>TikTok</span>
                </a>
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition text-xs font-semibold"
                >
                  <Youtube className="w-4 h-4" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Kirim Pesan / Pengaduan Administrasi
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Pengurus ranting, komisariat, atau masyarakat umum dapat menyampaikan saran atau kendala.
            </p>

            {isSent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">Pesan Berhasil Terkirim!</h4>
                <p className="text-xs text-emerald-700">
                  Terima kasih, tim sekretariat PAC Dukun akan segera merespons pesan Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Muhammad Yusuf"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Asal Ranting / Sekolah / Lembaga
                    </label>
                    <input
                      type="text"
                      value={formData.unitOrSchool}
                      onChange={(e) => setFormData({ ...formData, unitOrSchool: e.target.value })}
                      placeholder="Contoh: PR IPNU Sumber"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Isi Pesan / Keterangan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pesan, pertanyaan berkas SP, atau koordinasi kegiatan..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan ke PAC</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
