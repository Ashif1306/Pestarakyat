import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ sportId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sportId } = await params;
  const event = getEvent();
  const sport = event.sports.find((s) => s.id === sportId);

  if (!sport) {
    return {
      title: 'Cabang Olahraga Tidak Ditemukan',
    };
  }

  return {
    title: `Turnamen ${sport.name} — Pesta Rakyat X KKN IAIN`,
    description: `Jadwal pertandingan, klasemen grup, bagan sistem gugur, dan hasil skor live cabang ${sport.name} Pesta Rakyat X KKN IAIN Parepare di Dusun Bala Batu, Kab. Enrekang.`,
    openGraph: {
      title: `Turnamen ${sport.name} — Pesta Rakyat X KKN IAIN Parepare`,
      description: `Lihat jadwal live, klasemen grup, dan bagan knockout cabang ${sport.name} di Dusun Bala Batu, Enrekang.`,
      url: `https://pestarakyat.vercel.app/olahraga/${sportId}`,
    },
  };
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

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{sport.icon}</span>
              <div>
                <h1 className="text-3xl font-extrabold text-white">{sport.name}</h1>
                <p className="text-sm text-slate-400">Pesta Rakyat X KKN IAIN Parepare</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-2 rounded-xl border border-white/[0.06]">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{teams.length} Tim Berpartisipasi</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-2 rounded-xl border border-white/[0.06]">
              <Calendar className="w-4 h-4 text-red-400" />
              <span>{allMatches.length} Total Pertandingan</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/[0.04] px-3.5 py-2 rounded-xl border border-white/[0.06]">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Dusun Bala Batu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
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
