'use client';

import { useEffect, useState } from 'react';
import MatchCard from '@/components/MatchCard';
import { getEvent, getFinishedMatches, fetchServerMatches } from '@/lib/data';
import type { Match } from '@/types';
import { Search, ArrowUpDown, Calendar, Filter, X, RotateCcw } from 'lucide-react';

export default function HasilPage() {
  const event = getEvent();

  // State
  const [matches, setMatches] = useState<Match[]>(getFinishedMatches());
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // default: Terbaru (Newest date first)

  // Fetch live finished matches on mount
  useEffect(() => {
    fetchServerMatches().then((fresh) => {
      if (fresh && Array.isArray(fresh) && fresh.length > 0) {
        const finished = fresh.filter((m) => m.status === 'finished');
        setMatches(finished);
      }
    });
  }, []);

  // Unique dates from finished matches for date filter dropdown
  const uniqueDates = Array.from(new Set(matches.map((m) => m.date))).sort((a, b) => b.localeCompare(a));

  // Filter & Sort Logic
  const filteredMatches = matches
    .filter((m) => {
      // Filter by Sport
      if (selectedSport !== 'all' && m.sport !== selectedSport) return false;
      // Filter by Phase
      if (selectedPhase !== 'all' && m.phase !== selectedPhase) return false;
      // Filter by Date
      if (selectedDate !== 'all' && m.date !== selectedDate) return false;
      // Search by Team Name or Winner
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTeamA = m.teamA.toLowerCase().includes(q);
        const matchTeamB = m.teamB.toLowerCase().includes(q);
        const matchWinner = m.winner ? m.winner.toLowerCase().includes(q) : false;
        const matchRound = m.round.toLowerCase().includes(q);
        if (!matchTeamA && !matchTeamB && !matchWinner && !matchRound) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = `${a.date} ${a.time}`;
      const dateB = `${b.date} ${b.time}`;
      if (sortOrder === 'desc') {
        return dateB.localeCompare(dateA); // Terbaru ke Terlama
      } else {
        return dateA.localeCompare(dateB); // Terlama ke Terbaru
      }
    });

  const resetFilters = () => {
    setSelectedSport('all');
    setSelectedPhase('all');
    setSelectedDate('all');
    setSearchQuery('');
    setSortOrder('desc');
  };

  const hasActiveFilters = selectedSport !== 'all' || selectedPhase !== 'all' || selectedDate !== 'all' || searchQuery !== '' || sortOrder !== 'desc';

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

      {/* Sport Tabs */}
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

      {/* Interactive Controls Bar: Search, Date Filter, Phase Filter & Sort Toggle */}
      <div className="bg-[#0f1d32] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Bar Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tim (contoh: Buntu Barana)..."
              className="w-full bg-[#0a1628] border border-slate-700/80 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-700/50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Filter Dropdown */}
          <div className="md:col-span-3 relative">
            <div className="flex items-center gap-2 bg-[#0a1628] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white text-xs outline-none w-full cursor-pointer"
              >
                <option value="all" className="bg-[#0a1628] text-white">Semua Tanggal</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d} className="bg-[#0a1628] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phase Filter Dropdown */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 bg-[#0a1628] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300">
              <Filter className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="bg-transparent text-white text-xs outline-none w-full cursor-pointer"
              >
                <option value="all" className="bg-[#0a1628] text-white">Semua Fase</option>
                <option value="group" className="bg-[#0a1628] text-white">Fase Grup</option>
                <option value="knockout" className="bg-[#0a1628] text-white">Knockout</option>
              </select>
            </div>
          </div>

          {/* Sort Order Toggle Button */}
          <div className="md:col-span-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="w-full bg-[#0a1628] hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              title="Klik untuk mengubah urutan tanggal"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>{sortOrder === 'desc' ? '📅 Terbaru First' : '📅 Terlama First'}</span>
            </button>
          </div>
        </div>

        {/* Counter & Reset Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.04] text-xs text-slate-400">
          <div>
            Menampilkan <span className="font-extrabold text-emerald-400">{filteredMatches.length}</span> dari <span className="font-bold text-white">{matches.length}</span> hasil pertandingan
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 transition-all hover:bg-red-500/20"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 bg-[#0f1d32] rounded-2xl border border-white/[0.06] space-y-3">
          <p className="text-slate-200 font-bold text-base">Tidak ada pertandingan yang cocok dengan filter.</p>
          <p className="text-slate-400 text-xs">Coba ubah pencarian nama tim, filter tanggal, atau klik tombol Reset Filter di atas.</p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Semua Filter
            </button>
          )}
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
