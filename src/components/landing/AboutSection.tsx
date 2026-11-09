import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Target, CheckCircle2, MapPin, Calendar, BookOpen, Quote, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings, supervisors, alumni } = useApp();

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

        {/* FOTO DAN DATA KETUA IPNU & IPPNU DARI MASA KE MASA */}
        <div id="ketua-ipnu-ippnu" className="pt-12 scroll-mt-24">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Rekam Jejak Kepemimpinan</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Foto dan Data Ketua IPNU IPPNU
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Estafet kepemimpinan dan khidmat para nahkoda Pelajar NU Kecamatan Dukun dari masa ke masa
                </p>
              </div>

              {/* Badges Info */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  IPNU: Rekan
                </span>
                <span className="px-3 py-1 rounded-xl bg-green-50 text-green-800 border border-green-200 text-xs font-bold">
                  IPPNU: Rekanita
                </span>
              </div>
            </div>

            {/* Leaders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(settings.historicalLeaders || []).map((leader) => {
                const isIpnu = leader.organization === 'IPNU';
                return (
                  <div
                    key={leader.id}
                    className={`rounded-2xl border p-5 bg-gradient-to-b from-white to-slate-50/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                      leader.status === 'Aktif'
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {leader.photo ? (
                            <img
                              src={leader.photo}
                              alt={leader.name}
                              className="w-16 h-20 rounded-xl object-cover border-2 border-emerald-400/40 shadow-xs"
                            />
                          ) : (
                            <div className="w-16 h-20 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xl flex items-center justify-center">
                              {leader.name.charAt(0)}
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                              isIpnu ? 'bg-emerald-600 text-white' : 'bg-green-700 text-white'
                            }`}
                          >
                            {leader.organization}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                              {leader.period}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                leader.status === 'Aktif'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {leader.status}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">
                            {leader.name}
                          </h4>
                          {leader.originUnit && (
                            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                              Asal: {leader.originUnit}
                            </div>
                          )}
                        </div>
                      </div>

                      {leader.visionOrQuote && (
                        <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                          "{leader.visionOrQuote}"
                        </p>
                      )}

                      {leader.achievements && leader.achievements.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Capaian & Warisan Khidmat:
                          </span>
                          <ul className="text-[11px] text-slate-700 space-y-1">
                            {leader.achievements.map((ach, aIdx) => (
                              <li key={aIdx} className="flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DEWAN PEMBINA */}
        <div id="pembina" className="pt-12 scroll-mt-24">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Keluarga Besar Nahdlatul Ulama Dukun</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Dewan Pembina PAC IPNU IPPNU Dukun
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Para masyayikh, sesepuh banom, dan pimpinan badan otonom pengayom kader pelajar santri
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supervisors.map((sup) => (
                <div
                  key={sup.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/40 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5">
                      {sup.photo ? (
                        <img
                          src={sup.photo}
                          alt={sup.fullName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-emerald-200 text-emerald-900 font-bold text-xl flex items-center justify-center">
                          {sup.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {sup.originOrganization || 'Pembina'}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{sup.fullName}</h4>
                        <p className="text-xs text-emerald-700 font-semibold">{sup.roleOrTitle}</p>
                      </div>
                    </div>

                    {sup.notes && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                        {sup.notes}
                      </p>
                    )}
                  </div>

                  {sup.phone && (
                    <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">{sup.phone}</span>
                      <a
                        href={`https://wa.me/${sup.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition shadow-xs"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAJELIS ALUMNI */}
        <div id="alumni" className="pt-12 scroll-mt-24">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Jaringan & Sinergi</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Majelis Alumni PAC IPNU IPPNU Dukun
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Kiprah pengabdian alumni lintas periode di bidang keagamaan, pendidikan, wirausaha, dan kemasyarakatan
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {alumni.map((alm) => (
                <div
                  key={alm.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/40 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5">
                      {alm.photo ? (
                        <img
                          src={alm.photo}
                          alt={alm.fullName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-emerald-200 text-emerald-900 font-bold text-xl flex items-center justify-center">
                          {alm.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                          {alm.period || 'Alumni'}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{alm.fullName}</h4>
                        <p className="text-xs text-emerald-700 font-semibold">{alm.pastPosition}</p>
                      </div>
                    </div>

                    {alm.currentActivity && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                        {alm.currentActivity}
                      </p>
                    )}
                  </div>

                  {alm.phone && (
                    <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">{alm.phone}</span>
                      <a
                        href={`https://wa.me/${alm.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 transition shadow-xs"
                      >
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
