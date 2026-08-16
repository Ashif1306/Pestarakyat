'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BracketViewer from '@/components/BracketViewer';
import { getEvent, getTeams, fetchServerMatches } from '@/lib/data';

function BaganContent() {
  const event = getEvent();
  const searchParams = useSearchParams();
  const initialSport = searchParams.get('sport') || 'volly-putra';
  const [selectedSport, setSelectedSport] = useState<string>(initialSport);

  useEffect(() => {
    // Fetch fresh database matches when opening /bagan page
    fetchServerMatches();
  }, [selectedSport]);

  const activeSportObj = event.sports.find((s) => s.id === selectedSport) || event.sports[0];
  const teams = getTeams(selectedSport);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
          🏆 Knockout Bracket
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Bagan Turnamen</h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Bagan sistem gugur otomatis per cabang pertandingan. Ter-update secara real-time dari hasil pertandingan.
        </p>
      </div>

      {/* Sport Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-b border-white/[0.06] pb-4">
        {event.sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => setSelectedSport(sport.id)}
            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedSport === sport.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-105'
                : 'bg-[#0f1d32] text-slate-300 hover:bg-[#162540] hover:text-white border border-white/[0.06]'
            }`}
          >
            <span className="text-lg">{sport.icon}</span>
            {sport.name}
          </button>
        ))}
      </div>

      {/* Automatic Bracket */}
      <BracketViewer
        key={selectedSport}
        sportId={selectedSport}
        sportName={activeSportObj.name}
        teams={teams}
      />
    </div>
  );
}

export default function BaganPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <div className="animate-pulse text-slate-400">Memuat bagan turnamen...</div>
      </div>
    }>
      <BaganContent />
    </Suspense>
  );
}
