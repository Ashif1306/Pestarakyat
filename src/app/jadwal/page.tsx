'use client';

import { useState } from 'react';
import MatchCard from '@/components/MatchCard';
import { getEvent, getMatches } from '@/lib/data';
import { Sparkles, CheckCircle2, Radio } from 'lucide-react';

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
  const allMatches = getMatches();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

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

      {/* Filter Tabs */}
      <div className="space-y-3 border-b border-white/[0.06] pb-4">
        {/* Sport filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
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

        {/* Phase filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'Semua Fase' },
            { id: 'group', label: 'Fase Grup' },
            { id: 'knockout', label: 'Fase Knockout' },
          ].map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedPhase === phase.id
                  ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Display */}
      <div className="space-y-10">
        {/* 1. LIVE MATCHES */}
        {liveMatches.length > 0 && (
          <div className="bg-gradient-to-r from-red-950/40 via-[#0f1d32] to-red-950/40 border border-red-500/40 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
              </span>
              <h3 className="text-sm font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" /> Sedang Berlangsung Saat Ini (LIVE)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        )}

        {/* 2. UPCOMING MATCHES GROUPED BY DATE */}
        {scheduledDatesList.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Jadwal Pertandingan Mendatang
              </h2>
              <span className="text-xs text-slate-400">Urut Berdasarkan Tanggal & Waktu</span>
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

        {filteredMatches.length === 0 && (
          <div className="text-center py-16 bg-[#0f1d32] rounded-2xl border border-white/[0.06]">
            <p className="text-slate-400 text-sm">Belum ada jadwal pertandingan untuk filter ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
