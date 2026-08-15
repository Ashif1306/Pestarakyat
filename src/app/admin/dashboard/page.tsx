'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, LogOut, CheckCircle2, Trophy, Clock, Calendar, Layers, Edit3 } from 'lucide-react';
import { getMatches, saveMatches, getEvent } from '@/lib/data';
import type { Match } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const event = getEvent();
  const [matches, setMatchesList] = useState<Match[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('is_admin');
    if (!isAuth) {
      router.push('/admin');
      return;
    }
    setMatchesList(getMatches());
  }, [router]);

  const handleMatchChange = (id: string, field: keyof Match, val: any) => {
    setMatchesList((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, [field]: val };
        
        // Auto determine winner if scores are modified
        if (updated.scoreA !== null && updated.scoreB !== null) {
          if (updated.scoreA > updated.scoreB) updated.winner = updated.teamA;
          else if (updated.scoreB > updated.scoreA) updated.winner = updated.teamB;
          else updated.winner = null; // Draw
        } else {
          updated.winner = null;
        }
        return updated;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // 1. Save to LocalStorage (Instant client update)
    saveMatches(matches);

    // 2. Save to Server Disk (data/matches.json)
    try {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches }),
      });
    } catch (err) {
      console.error('Failed to sync to server JSON:', err);
    }

    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua data ke jadwal default awal?')) {
      localStorage.removeItem('pr_matches');
      window.location.reload();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('is_admin');
    router.push('/admin');
  };

  // Unique dates list
  const uniqueDates = Array.from(new Set(matches.map((m) => m.date))).sort();

  const filteredMatches = matches.filter((m) => {
    if (selectedSport !== 'all' && m.sport !== selectedSport) return false;
    if (selectedDate !== 'all' && m.date !== selectedDate) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f1d32] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" /> Admin Control Panel
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Kelola & Edit Pertandingan <Edit3 className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Boskuh dapat mengedit nama tim, tanggal, jam, lokasi, skor, dan status pertandingan. Klik simpan untuk menyimpan permanen ke file JSON server & browser!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 hover:scale-105"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan (JSON & Server)'}
          </button>
          <button
            onClick={handleResetToDefault}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-white/10"
          >
            Reset Default
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs flex items-center gap-2 transition-colors border border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-bold flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Perubahan berhasil disimpan! File matches.json di server & klasemen website otomatis ter-update.</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="space-y-3 bg-[#0f1d32] border border-white/10 rounded-xl p-4">
        {/* Sport Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2">Cabang:</span>
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSport === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Semua ({matches.length})
          </button>

          {event.sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedSport === sport.id
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{sport.icon}</span>
              {sport.name}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.04]">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Tanggal:
          </span>
          <button
            onClick={() => setSelectedDate('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              selectedDate === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Semua Tanggal
          </button>
          <button
            onClick={() => setSelectedDate('2026-08-15')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              selectedDate === '2026-08-15' ? 'bg-red-600 text-white font-bold' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            🔥 Hari Ini (15 Agt)
          </button>
          {uniqueDates.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedDate === d ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Matches List Table/Cards */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className={`bg-[#0f1d32] border rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-all ${
              match.status === 'live' ? 'border-red-500/60 shadow-lg shadow-red-500/10' : 'border-white/10'
            }`}
          >
            {/* Round & Group Header Info */}
            <div className="md:col-span-3 space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {match.round}
                </span>
                {match.group && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    <Layers className="w-3 h-3" /> Grup {match.group}
                  </span>
                )}
              </div>

              {/* Editable Date & Time */}
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="date"
                  value={match.date}
                  onChange={(e) => handleMatchChange(match.id, 'date', e.target.value)}
                  className="bg-[#0a1628] border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  value={match.time}
                  onChange={(e) => handleMatchChange(match.id, 'time', e.target.value)}
                  className="bg-[#0a1628] border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs w-16 outline-none focus:border-cyan-500 text-center font-mono"
                  placeholder="15:20"
                />
              </div>

              {/* Editable Venue */}
              <input
                type="text"
                value={match.venue}
                onChange={(e) => handleMatchChange(match.id, 'venue', e.target.value)}
                className="bg-[#0a1628] border border-slate-700/60 rounded px-2 py-1 text-slate-400 text-[11px] w-full outline-none focus:border-cyan-500"
                placeholder="Lokasi Pertandingan"
              />
            </div>

            {/* Editable Teams & Scores Input */}
            <div className="md:col-span-6 grid grid-cols-7 items-center gap-2 bg-[#0a1628] p-3 rounded-xl border border-white/5">
              {/* Editable Team A */}
              <div className="col-span-3 text-right">
                <input
                  type="text"
                  value={match.teamA}
                  onChange={(e) => handleMatchChange(match.id, 'teamA', e.target.value)}
                  className="bg-[#0f1d32] border border-slate-700 rounded px-2 py-1 text-white font-bold text-xs text-right w-full outline-none focus:border-red-500"
                />
              </div>

              {/* Editable Scores */}
              <div className="col-span-1 flex items-center justify-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={match.scoreA ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                    handleMatchChange(match.id, 'scoreA', val);
                  }}
                  placeholder="0"
                  className="w-10 text-center bg-slate-800 border border-slate-700 rounded text-white font-extrabold text-sm py-1 outline-none focus:border-red-500"
                />
                <span className="text-slate-500 text-xs font-bold">-</span>
                <input
                  type="number"
                  min="0"
                  value={match.scoreB ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
                    handleMatchChange(match.id, 'scoreB', val);
                  }}
                  placeholder="0"
                  className="w-10 text-center bg-slate-800 border border-slate-700 rounded text-white font-extrabold text-sm py-1 outline-none focus:border-red-500"
                />
              </div>

              {/* Editable Team B */}
              <div className="col-span-3 text-left">
                <input
                  type="text"
                  value={match.teamB}
                  onChange={(e) => handleMatchChange(match.id, 'teamB', e.target.value)}
                  className="bg-[#0f1d32] border border-slate-700 rounded px-2 py-1 text-white font-bold text-xs text-left w-full outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Status Selector */}
            <div className="md:col-span-3 flex flex-col items-end gap-2">
              <select
                value={match.status}
                onChange={(e) => handleMatchChange(match.id, 'status', e.target.value as any)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer ${
                  match.status === 'live'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : match.status === 'finished'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <option value="scheduled">Jadwal (Belum Main)</option>
                <option value="live">🔴 Sedang Main (LIVE)</option>
                <option value="finished">✅ Selesai (Finished)</option>
              </select>

              {match.winner && (
                <div className="text-[11px] font-semibold text-emerald-400 truncate max-w-full">
                  Pemenang: {match.winner}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
