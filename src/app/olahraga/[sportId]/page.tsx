import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react';
import SportDetailTabs from '@/components/SportDetailTabs';
import {
  getEvent,
  getMatchesBySport,
  getFinishedMatchesBySport,
  getStandings,
  getTeams,
  getGroupMatches,
  getKnockoutMatches,
} from '@/lib/data';

interface PageProps {
  params: Promise<{ sportId: string }>;
}

export default async function SportDetailPage({ params }: PageProps) {
  const { sportId } = await params;
  const event = getEvent();
  const sport = event.sports.find((s) => s.id === sportId);

  if (!sport) {
    notFound();
  }

  const allMatches = getMatchesBySport(sportId);
  const groupMatches = getGroupMatches(sportId);
  const knockoutMatches = getKnockoutMatches(sportId);
  const finishedMatches = getFinishedMatchesBySport(sportId);
  const standings = getStandings(sportId);
  const teams = getTeams(sportId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>

      {/* Header */}
      <div className="relative bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-8 overflow-hidden">
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(to right, ${sport.color}, transparent)` }}
        />

        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none"
          style={{ backgroundColor: sport.color }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{sport.icon}</span>
            <div>
              <div
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white mb-2"
                style={{ backgroundColor: sport.color }}
              >
                Cabang Olahraga
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                {sport.name}
              </h1>
            </div>
          </div>

          <div className="sm:ml-auto flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 bg-[#0a1628] px-3 py-2 rounded-lg border border-white/[0.06]">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              {teams.length} Tim
            </span>
            <span className="flex items-center gap-1.5 bg-[#0a1628] px-3 py-2 rounded-lg border border-white/[0.06]">
              <Calendar className="w-3.5 h-3.5 text-red-400" />
              {allMatches.length} Pertandingan
            </span>
            <span className="flex items-center gap-1.5 bg-[#0a1628] px-3 py-2 rounded-lg border border-white/[0.06]">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Bala Batu, Enrekang
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <SportDetailTabs
        sportId={sportId}
        sportName={sport.name}
        allMatches={allMatches}
        groupMatches={groupMatches}
        knockoutMatches={knockoutMatches}
        finishedMatches={finishedMatches}
        standings={standings}
        teams={teams}
      />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { sportId: 'volly-putra' },
    { sportId: 'volly-putri' },
    { sportId: 'sepak-bola-mini' },
  ];
}
