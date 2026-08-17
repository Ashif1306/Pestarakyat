'use client';

import { useState, useEffect } from 'react';
import MatchCard from '@/components/MatchCard';
import { getEvent, getMatches, fetchServerMatches } from '@/lib/data';
import { Sparkles, CheckCircle2, Radio, Loader2 } from 'lucide-react';
import type { Match } from '@/types';

function formatIndonesianDate(dateStr: string): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return `${days[d.getDay()]}, ${day} ${months[month]} ${year}`;
  }
  return dateStr;
}

export default function JadwalPage() {
  const event = getEvent();
  const [allMatches, setAllMatches] = useState<Match[]>(getMatches());
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  useEffect(() => {
    fetchServerMatches().then((list) => {
      if (list && Array.isArray(list) && list.length > 0) {
        setAllMatches(list);
      }
      setLoading(false);
    });

    const interval = setInterval(() => {
      fetchServerMatches().then((list) => {
        if (list && Array.isArray(list) && list.length > 0) {
          setAllMatches(list);
        }
        setLoading(false);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const todayStr = '2026-08-15';

  const filteredMatches = allMatches.filter((m) => {
    if (selectedSport !== 'all' && m.sport !== selectedSport) return false;
    if (selectedPhase !== 'all' && m.phase !== selectedPhase) return false;
    return true;
  });

  // 1. Live Matches
  const liveMatches = filteredMatches.filter((m) => m.status === 'live');

  // 2. Scheduled Matches (Grouped by Date ASC)
  const scheduledMatches = filteredMatches
    .filter((m) => m.status === 'scheduled')
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

  const scheduledDatesMap: Record<string, typeof scheduledMatches> = {};
  scheduledMatches.forEach((m) => {
    if (!scheduledDatesMap[m.date]) {
      scheduledDatesMap[m.date] = [];
    }
    scheduledDatesMap[m.date].push(m);
  });

  const scheduledDatesList = Object.keys(scheduledDatesMap)
    .sort((a, b) => a.localeCompare(b))
    .map((date) => ({
      date,
      dateLabel: formatIndonesianDate(date),
      isToday: date === todayStr,
      matches: scheduledDatesMap[date],
    }));

  // 3. Finished Matches (At the bottom, DESC)
  const finishedMatches = filteredMatches
    .filter((m) => m.status === 'finished')
    .sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return b.time.localeCompare(a.time);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          📅 Timetable
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Jadwal Pertandingan</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Jadwal lengkap seluruh cabang pertandingan Pesta Rakyat X KKN IAIN.
        </p>
      </div>

      {/* Sport Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/[0.06] pb-4">
        <button
          onClick={() => setSelectedSport('all')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            selectedSport === 'all'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
              : 'bg-[#0f1d32] text-slate-300 hover:bg-[#162540] hover:text-white border border-white/[0.06]'
          }`}
        >
          Semua Cabang
        </button>

        {event.sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => setSelectedSport(sport.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedSport === sport.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                : 'bg-[#0f1d32] text-slate-300 hover:bg-[#162540] hover:text-white border border-white/[0.06]'
            }`}
          >
            <span>{sport.icon}</span>
            {sport.name}
          </button>
        ))}
      </div>

      {/* Phase Filter Pills */}
      <div className="flex items-center justify-center gap-2">
        {[
          { id: 'all', label: 'Semua Fase' },
          { id: 'group', label: 'Fase Grup' },
          { id: 'knockout', label: 'Fase Knockout' },
        ].map((phase) => (
          <button
            key={phase.id}
            onClick={() => setSelectedPhase(phase.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedPhase === phase.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {phase.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-10">
        {/* 1. LIVE MATCHES SECTION */}
        {liveMatches.length > 0 && (
          <div className="bg-gradient-to-r from-red-600/20 via-red-900/10 to-transparent border border-red-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" />
                Pertandingan Sedang Berlangsung ({liveMatches.length})
              </h2>
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/40">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                LIVE SEKARANG
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* 2. SCHEDULED MATCHES SECTION */}
        {scheduledDatesList.length > 0 && (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Jadwal Pertandingan Mendatang
              </h2>
              <span className="text-xs text-slate-400 font-medium">Urut Berdasarkan Tanggal & Waktu</span>
            </div>

            {scheduledDatesList.map(({ date, dateLabel, isToday, matches: dateMatches }) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    isToday
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-[#0f1d32] text-cyan-400 border border-cyan-500/30'
                  }`}>
                    <span>📅</span>
                    {dateLabel}
                  </span>
                  {isToday && (
                    <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase animate-pulse">
                      Hari Ini
                    </span>
                  )}
                  <span className="text-xs text-slate-500">({dateMatches.length} Pertandingan)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {dateMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. FINISHED MATCHES (AT BOTTOM) */}
        {finishedMatches.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Pertandingan yang Sudah Selesai ({finishedMatches.length})
              </h2>
              <span className="text-xs text-slate-500">Arsip Hasil</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-90">
              {finishedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* Loading / Empty States */}
        {loading ? (
          <div className="text-center py-16 bg-[#0f1d32] rounded-2xl border border-white/[0.06] space-y-4 shadow-xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-white font-extrabold text-base tracking-wide">Mohon Menunggu...</p>
              <p className="text-slate-400 text-xs">Sedang memuat data jadwal pertandingan terbaru dari server.</p>
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16 bg-[#0f1d32] rounded-2xl border border-white/[0.06] space-y-2">
            <p className="text-white font-bold text-base">Tidak ada jadwal pertandingan untuk filter ini.</p>
            <p className="text-slate-400 text-xs">Silakan pilih cabang olahraga atau fase pertandingan lain di atas.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
