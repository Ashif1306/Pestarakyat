import { Calendar, Clock, MapPin, CheckCircle2, Layers } from 'lucide-react';
import type { Match } from '@/types';

export default function MatchCard({ match }: { match: Match }) {
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';

  const sportInfo = match.sport === 'sepak-bola-mini'
    ? { name: 'Sepak Bola Mini', icon: '⚽', badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
    : match.sport === 'volly-putri'
    ? { name: 'Volly Putri', icon: '🏐', badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30' }
    : { name: 'Volly Putra', icon: '🏐', badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30' };

  return (
    <div className={`relative bg-[#0f1d32] border rounded-2xl p-4 sm:p-5 transition-all shadow-lg overflow-hidden ${
      isLive ? 'border-red-500/60 shadow-red-500/15' : 'border-white/[0.06] hover:border-cyan-500/30 hover:shadow-cyan-500/5'
    }`}>
      {/* Subtle top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${
        isLive ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-500' :
        isFinished ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
        'bg-gradient-to-r from-cyan-600 to-cyan-400'
      }`} />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sport Tag Badge */}
          <span className={`font-bold text-[11px] px-2.5 py-1 rounded-md border flex items-center gap-1.5 shadow-sm ${sportInfo.badgeClass}`}>
            <span>{sportInfo.icon}</span>
            <span>{sportInfo.name}</span>
          </span>

          {/* Phase/Round Badge */}
          <span className="font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
            {match.round}
          </span>

          {/* Group Badge */}
          {match.group && (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
              <Layers className="w-3 h-3" />
              Grup {match.group}
            </span>
          )}
        </div>
      </div>

      {/* Date & time row */}
      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          {match.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {match.time} WITA
        </span>
      </div>

      {/* Matchup Layout - Ultra Clean Horizontal Score & Mobile Optimized */}
      <div className="flex items-center justify-between gap-2 my-2 py-2 px-1 bg-[#0a1628]/60 rounded-xl border border-white/[0.04]">
        {/* Team A */}
        <div className="flex-1 text-right min-w-0 px-1">
          <span className={`block font-bold text-xs sm:text-sm md:text-base leading-tight truncate sm:whitespace-normal ${
            match.winner === match.teamA ? 'text-emerald-400 font-extrabold' : 'text-white'
          }`}>
            {match.teamA}
          </span>
        </div>

        {/* Horizontal Score / VS Pill */}
        <div className="flex-shrink-0 px-1">
          {isFinished ? (
            <div className="bg-[#0f1d32] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-extrabold text-white tracking-wider shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap">
              <span className={match.winner === match.teamA ? 'text-emerald-400 font-black text-sm sm:text-base' : 'text-slate-200'}>
                {match.scoreA}
              </span>
              <span className="text-slate-500 font-bold text-xs">-</span>
              <span className={match.winner === match.teamB ? 'text-emerald-400 font-black text-sm sm:text-base' : 'text-slate-200'}>
                {match.scoreB}
              </span>
            </div>
          ) : isLive ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/15 px-3 py-1.5 rounded-full border border-red-500/30 whitespace-nowrap">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-live-dot" />
              LIVE
            </span>
          ) : (
            <span className="text-xs font-extrabold text-slate-400 bg-[#0f1d32] px-2.5 py-1 rounded border border-white/5 whitespace-nowrap">
              VS
            </span>
          )}
        </div>

        {/* Team B */}
        <div className="flex-1 text-left min-w-0 px-1">
          <span className={`block font-bold text-xs sm:text-sm md:text-base leading-tight truncate sm:whitespace-normal ${
            match.winner === match.teamB ? 'text-emerald-400 font-extrabold' : 'text-white'
          }`}>
            {match.teamB}
          </span>
        </div>
      </div>

      {/* Footer Venue */}
      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-white/[0.04]">
        <span className="flex items-center gap-1.5 truncate max-w-[200px]">
          <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <span className="truncate">{match.venue}</span>
        </span>

        {isFinished && (
          <span className="flex items-center gap-1 text-emerald-400 font-medium flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai
          </span>
        )}
      </div>
    </div>
  );
}
