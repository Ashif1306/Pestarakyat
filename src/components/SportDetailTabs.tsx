'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, BarChart3, Trophy, ClipboardList, Sparkles, CheckCircle2, Radio } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import StandingsTable from '@/components/StandingsTable';
import BracketViewer from '@/components/BracketViewer';
import { getStandings, getMatchesBySport } from '@/lib/data';
import type { Match, Standing, Team } from '@/types';

interface SportDetailTabsProps {
  sportId: string;
  sportName: string;
  allMatches: Match[];
  groupMatches: Match[];
  knockoutMatches: Match[];
  finishedMatches: Match[];
  standings: Record<string, Standing[]>;
  teams: Team[];
}

const tabs = [
  { id: 'jadwal', label: 'Jadwal', icon: Calendar },
  { id: 'klasemen', label: 'Klasemen', icon: BarChart3 },
  { id: 'bagan', label: 'Bagan', icon: Trophy },
  { id: 'hasil', label: 'Hasil', icon: ClipboardList },
];

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

function SportDetailTabsContent({
  sportId,
  sportName,
  teams,
}: {
  sportId: string;
  sportName: string;
  teams: Team[];
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'jadwal';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Record<string, Standing[]>>({});

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['jadwal', 'klasemen', 'bagan', 'hasil'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const reloadData = () => {
    const list = getMatchesBySport(sportId);
    setMatches(list);
    setStandings(getStandings(sportId));
  };

  useEffect(() => {
    reloadData();
  }, [sportId]);

  const isBallSport = sportId === 'sepak-bola-mini';
  const todayStr = '2026-08-15'; // Current tournament date benchmark

  // 1. Live Matches
  const liveMatches = matches.filter((m) => m.status === 'live');

  // 2. Upcoming / Scheduled Matches (Sorted by Date ASC, Time ASC)
  const scheduledMatches = matches
    .filter((m) => m.status === 'scheduled')
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });

  // Group scheduled matches by Date
  const scheduledDatesMap: Record<string, Match[]> = {};
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

  // 3. Finished Matches (At the bottom, sorted by Date DESC, Time DESC)
  const finishedMatches = matches
    .filter((m) => m.status === 'finished')
    .sort((a, b) => {
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return b.time.localeCompare(a.time);
    });

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1.5 bg-[#0f1d32] border border-white/[0.06] rounded-2xl overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                reloadData();
              }}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Jadwal Tab */}
        {activeTab === 'jadwal' && (
          <div className="space-y-10">
            {/* 1. LIVE SECTION (Paling Atas jika ada) */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {/* 2. UPCOMING MATCHES SECTION (Tanggal Hari Ini & Mendatang) */}
            {scheduledDatesList.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Jadwal Pertandingan Mendatang
                  </h3>
                  <span className="text-xs text-slate-400">
                    Urut Berdasarkan Waktu
                  </span>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dateMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. FINISHED MATCHES SECTION (Paling Bawah) */}
            {finishedMatches.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Pertandingan yang Sudah Selesai ({finishedMatches.length})
                  </h3>
                  <span className="text-xs text-slate-500">Arsip Hasil</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-90">
                  {finishedMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {matches.length === 0 && (
              <div className="text-center py-16 bg-[#0f1d32] rounded-2xl border border-white/[0.06]">
                <p className="text-slate-400 text-sm">Belum ada jadwal pertandingan untuk cabang ini.</p>
              </div>
            )}
          </div>
        )}

        {/* Klasemen Tab */}
        {activeTab === 'klasemen' && (
          <div className="space-y-6">
            {Object.keys(standings).length > 0 ? (
              Object.entries(standings).map(([groupName, groupStandings]) => (
                <StandingsTable
                  key={groupName}
                  groupName={groupName}
                  standings={groupStandings}
                  isBallSport={isBallSport}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-[#0f1d32] rounded-2xl border border-white/[0.06]">
                <p className="text-slate-400 text-sm">Belum ada data klasemen untuk cabang ini.</p>
              </div>
            )}
          </div>
        )}

        {/* Bagan Tab */}
        {activeTab === 'bagan' && (
          <BracketViewer
            sportName={sportName}
            teams={teams}
          />
        )}

        {/* Hasil Tab */}
        {activeTab === 'hasil' && (
          <div>
            {finishedMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {finishedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0f1d32] rounded-2xl border border-white/[0.06] space-y-2">
                <p className="text-slate-300 font-medium">Belum ada pertandingan yang selesai.</p>
                <p className="text-slate-500 text-xs">Hasil skor akan muncul otomatis setelah pertandingan usai.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SportDetailTabs(props: SportDetailTabsProps) {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-slate-400">
        Memuat data pertandingan...
      </div>
    }>
      <SportDetailTabsContent
        sportId={props.sportId}
        sportName={props.sportName}
        teams={props.teams}
      />
    </Suspense>
  );
}
