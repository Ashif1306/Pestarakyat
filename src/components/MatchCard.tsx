import { Calendar, Clock, MapPin, CheckCircle2, Layers } from 'lucide-react';
import type { Match } from '@/types';

export default function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';

  return (
    <div className={`relative bg-[#0f1d32] border rounded-xl p-5 transition-all shadow-lg overflow-hidden ${
      isLive ? 'border-red-500/60 shadow-red-500/15' : 'border-white/[0.06] hover:border-cyan-500/30 hover:shadow-cyan-500/5'
    }`}>
      {/* Subtle top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${
        isLive ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-500' :
        isFinished ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
        'bg-gradient-to-r from-cyan-600 to-cyan-400'
      }`} />

      {/* Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
            {match.round}
          </span>
          {match.group && (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
              <Layers className="w-3 h-3" />
              Grup {match.group}
            </span>
          )}
        </div>
      </div>

      {/* Date & time row */}
      <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          {match.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {match.time} WITA
        </span>
      </div>

      {/* Matchup */}
      <div className="grid grid-cols-7 items-center gap-2 my-3">
        {/* Team A */}
        <div className="col-span-3 text-right">
          <span className={`block font-bold text-sm sm:text-base ${
            match.winner === match.teamA ? 'text-emerald-400 font-extrabold' : 'text-white'
          }`}>
            {match.teamA}
          </span>
        </div>

        {/* Score / VS */}
        <div className="col-span-1 text-center flex flex-col items-center justify-center">
          {isFinished ? (
            <div className="bg-[#0a1628] border border-slate-700 rounded-lg px-2.5 py-1 text-base font-extrabold text-white tracking-widest shadow-inner">
              {match.scoreA} - {match.scoreB}
            </div>
          ) : isLive ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/15 px-2.5 py-1 rounded-full border border-red-500/30">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-live-dot" />
              LIVE
            </span>
          ) : (
            <span className="text-xs font-extrabold text-slate-500 bg-[#0a1628] px-2.5 py-1 rounded">
              VS
            </span>
          )}
        </div>

        {/* Team B */}
        <div className="col-span-3 text-left">
          <span className={`block font-bold text-sm sm:text-base ${
            match.winner === match.teamB ? 'text-emerald-400 font-extrabold' : 'text-white'
          }`}>
            {match.teamB}
          </span>
        </div>
      </div>

      {/* Footer Venue */}
      <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-white/[0.04]">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          {match.venue}
        </span>

        {isFinished && (
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai
          </span>
        )}
      </div>
    </div>
  );
}
