'use client';

import { useState } from 'react';
import MatchCard from '@/components/MatchCard';
import { getEvent, getFinishedMatches } from '@/lib/data';

export default function HasilPage() {
  const event = getEvent();
  const finishedMatches = getFinishedMatches();
  const [selectedSport, setSelectedSport] = useState<string>('all');

  const filteredMatches = selectedSport === 'all'
    ? finishedMatches
    : finishedMatches.filter((m) => m.sport === selectedSport);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          🏆 Match Results
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Hasil Pertandingan</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Hasil skor dan pemenang dari pertandingan yang telah selesai.
        </p>
      </div>

      {/* Filter Tabs */}
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

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-[#0f1d32] rounded-2xl border border-white/[0.06] space-y-2">
          <p className="text-slate-300 font-medium">Belum ada pertandingan yang selesai.</p>
          <p className="text-slate-500 text-xs">Hasil skor akan diperbarui otomatis oleh admin setelah pertandingan usai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
