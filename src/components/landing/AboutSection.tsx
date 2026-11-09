import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Target, CheckCircle2, MapPin, Calendar, BookOpen, Quote } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings } = useApp();

  return (
    <section id="profil" className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mengenal PAC IPNU IPPNU Dukun</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bergerak, Berilmu, dan Berkhidmat Demi Kemaslahatan Pelajar Nahdliyin
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Meneguhkan nilai-nilai Islam Ahlussunnah wal Jamaah An-Nahdliyah di kalangan generasi muda santri dan pelajar di seluruh pelosok Kecamatan Dukun, Gresik.
          </p>
        </div>

        {/* 2-Column Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Sejarah & Wilayah */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm mb-4">
                <span className="w-8 h-1 bg-emerald-600 rounded-full" />
                <span>SEJARAH & IDENTITAS</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-snug">
                Pilar Pengkaderan Generasi Muda Nahdlatul Ulama di Wilayah Dukun
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
                {settings.history}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Periode Khidmat</div>
                    <div className="text-sm font-bold text-slate-900">{settings.period}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Wilayah Kerja</div>
                    <div className="text-sm font-bold text-slate-900 leading-tight">
                      Kecamatan Dukun, Kab. Gresik
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 text-xs flex items-center justify-between">
              <span className="font-semibold">Motto Perjuangan Pelajar NU:</span>
              <span className="font-serif italic text-emerald-800 text-sm font-bold">
                "Belajar, Berjuang, Bertaqwa"
              </span>
            </div>
          </div>

          {/* Visi Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 p-8 sm:p-10 rounded-2xl text-white shadow-xl shadow-emerald-950/20 flex flex-col justify-between relative overflow-hidden">
            {/* Islamic motif watermark */}
            <Quote className="absolute -bottom-6 -right-6 w-40 h-40 text-emerald-700/20 pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/50 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-600/40">
                <Compass className="w-3.5 h-3.5" />
                <span>Visi Organisasi</span>
              </div>
              <blockquote className="text-lg sm:text-xl font-medium leading-relaxed font-serif italic text-emerald-50 mb-8">
                "{settings.vision}"
              </blockquote>
            </div>

            <div className="relative z-10 pt-6 border-t border-emerald-700/40 text-xs text-emerald-200/80">
              Ditetapkan dalam Konferensi Anak Cabang (KONFERANCAB) PAC IPNU IPPNU DUKUN.
            </div>
          </div>
        </div>

        {/* Misi Section */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Misi Strategis PAC IPNU IPPNU DUKUN</h3>
              <p className="text-xs text-slate-500">
                Langkah konkret dan agenda prioritas kepengurusan dalam mewujudkan visi organisasi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.missions.map((misi, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 transition group flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                    0{idx + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium group-hover:text-slate-900 transition">
                    {misi}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold self-end pt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Program Prioritas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
