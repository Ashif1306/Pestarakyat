import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight, Flame, Sparkles, Radio, Coffee } from 'lucide-react';
import SportCards from '@/components/SportCards';
import MatchCard from '@/components/MatchCard';
import KlasemenModalButton from '@/components/KlasemenModalButton';
import WitaLiveClock from '@/components/WitaLiveClock';
import { getEvent, getTodayMatches, getMatches } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const event = getEvent();
  const allMatches = getMatches();
  
  // 1. Live Matches (Any match currently marked LIVE)
  const liveMatches = allMatches.filter((m) => m.status === 'live');

  // 2. Today's Matches (Dynamic based on WITA date)
  const todayMatches = getTodayMatches();
  const todayScheduled = todayMatches.filter((m) => m.status === 'scheduled');
  const todayFinished = todayMatches.filter((m) => m.status === 'finished');

  // Group today's scheduled matches by sport
  const scheduledBySport = event.sports.map((sport) => {
    const matches = todayScheduled.filter((m) => m.sport === sport.id);
    return { sport, matches };
  });

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-white/[0.06] bg-[#0a1628] px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-600/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-red-500/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Red-White stripe header accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-amber-400 opacity-80" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10 py-16">
          {/* Live WITA Clock */}
          <div className="flex justify-center">
            <WitaLiveClock />
          </div>

          {/* Live Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-500/10 animate-glow-pulse">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            Turnamen Sedang Berlangsung
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            PESTA RAKYAT
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-red-400 to-amber-400">
              TURNAMEN OLAHRAGA
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            {event.description}
          </p>

          {/* Location & Dates */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-2 bg-[#0f1d32] px-4 py-2.5 rounded-xl border border-white/[0.06] shadow-sm">
              <Calendar className="w-4 h-4 text-cyan-400" />
              10 – 25 Agustus 2026
            </div>
            <div className="flex items-center gap-2 bg-[#0f1d32] px-4 py-2.5 rounded-xl border border-white/[0.06] shadow-sm">
              <MapPin className="w-4 h-4 text-red-400" />
              Dusun Bala Batu, Kab. Enrekang
            </div>
            <div className="flex items-center gap-2 bg-[#0f1d32] px-4 py-2.5 rounded-xl border border-white/[0.06] shadow-sm">
              <Users className="w-4 h-4 text-amber-400" />
              3 Cabang Olahraga • 36 Tim
            </div>
          </div>

          {/* Tagline */}
          <p className="text-sm font-bold italic tracking-wide">
            <span className="text-cyan-400">Berkarya</span>
            <span className="text-slate-500">, </span>
            <span className="text-red-400">Berbagi</span>
            <span className="text-slate-500">, </span>
            <span className="text-amber-400">Menginspirasi</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/jadwal"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-600/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              Lihat Jadwal Lengkap
            </Link>

            {/* Klasemen Modal Pop Up Button */}
            <KlasemenModalButton sports={event.sports} />
          </div>
        </div>
      </section>

      {/* SECTION 1: PERTANDINGAN SEDANG LIVE (Jika Ada Match Status LIVE) */}
      {liveMatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-950/40 via-[#0f1d32] to-red-950/40 border border-red-500/40 rounded-2xl p-6 shadow-2xl shadow-red-500/10 space-y-6">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Radio className="w-4 h-4 animate-pulse" /> LIVE STREAMING / PERTANDINGAN AKTIF
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Sedang Berlangsung Saat Ini</h2>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/30">
                {liveMatches.length} Match Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: JADWAL HARI INI / REST DAY (LIBUR) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              WAKTU BALABATU (WITA)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Pertandingan Hari Ini</h2>
          </div>
          <Link
            href="/jadwal"
            className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 flex items-center gap-1.5 bg-cyan-500/15 dark:bg-cyan-500/10 px-3.5 py-2 rounded-lg border border-cyan-500/30 transition-all hover:scale-105 shadow-sm"
          >
            Lihat Semua Jadwal
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {todayScheduled.length === 0 ? (
          /* REST DAY (HARI INI LIBUR) CARD */
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#0f1d32] dark:via-[#0a1628] dark:to-[#0f1d32] rounded-3xl border border-amber-500/40 p-8 sm:p-12 text-center space-y-6 shadow-xl shadow-amber-500/10 relative overflow-hidden transition-colors">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/40 text-amber-800 dark:text-amber-400 text-xs font-extrabold uppercase tracking-widest shadow-md">
              <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" /> HARI INI LIBUR PERTANDINGAN
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Selamat Beristirahat! 🌴
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                Hari ini tidak ada jadwal pertandingan yang berlangsung. Seluruh atlet dan panitia sedang beristirahat untuk mempersiapkan babak seru berikutnya.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/jadwal"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                Lihat Jadwal Pertandingan Mendatang
              </Link>
              <Link
                href="/hasil"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 transition-all border border-slate-300 dark:border-white/10 hover:scale-105"
              >
                Lihat Hasil Pertandingan Kemarin
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {scheduledBySport.map(({ sport, matches }) => {
              if (matches.length === 0) return null;

              return (
                <div key={sport.id} className="space-y-4">
                  {/* Sport Subheader */}
                  <div className="flex items-center justify-between bg-[#0f1d32] border border-white/[0.06] rounded-xl px-5 py-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sport.icon}</span>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {sport.name}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          {matches.length} Pertandingan Hari Ini
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/olahraga/${sport.id}`}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                    >
                      Detail Cabang
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Matches Grid for this Sport */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {matches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 3: HASIL PERTANDINGAN HARI INI (Jika Ada) */}
      {todayFinished.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <h2 className="text-xl font-extrabold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Selesai Hari Ini ({todayFinished.length} Match)
            </h2>
            <Link href="/hasil" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              Lihat Semua Hasil <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {todayFinished.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Cabang Pertandingan Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-4">
            <Flame className="w-3 h-3" />
            Semarak Kemerdekaan
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            Cabang Olahraga
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Pilih cabang olahraga untuk melihat jadwal lengkap, klasemen grup otomatis, bagan knockout, dan hasil pertandingan.
          </p>
        </div>

        <SportCards sports={event.sports} />
      </section>
    </div>
  );
}
