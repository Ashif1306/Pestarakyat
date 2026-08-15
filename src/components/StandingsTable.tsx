import type { Standing } from '@/types';

interface StandingsTableProps {
  groupName: string;
  standings: Standing[];
  isBallSport?: boolean;
}

export default function StandingsTable({ groupName, standings, isBallSport = false }: StandingsTableProps) {
  const forLabel = isBallSport ? 'GM' : 'SM';
  const againstLabel = isBallSport ? 'GK' : 'SK';

  return (
    <div className="bg-[#0f1d32] border border-white/[0.06] rounded-xl overflow-hidden shadow-lg">
      {/* Group Header */}
      <div className="px-5 py-3 bg-gradient-to-r from-cyan-600/15 via-red-600/10 to-transparent border-b border-white/[0.06] flex items-center justify-between">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          Grup {groupName}
        </h4>
        <span className="text-xs font-semibold text-slate-400">
          {standings.length} Tim
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/[0.04] bg-[#0a1628]/40">
              <th className="text-left py-3 px-4 w-10">#</th>
              <th className="text-left py-3 px-2">Tim</th>
              <th className="text-center py-3 px-2 w-10">M</th>
              <th className="text-center py-3 px-2 w-10">
                <span className="text-emerald-400">W</span>
              </th>
              {isBallSport && (
                <th className="text-center py-3 px-2 w-10">
                  <span className="text-amber-400">D</span>
                </th>
              )}
              <th className="text-center py-3 px-2 w-10">
                <span className="text-red-400">L</span>
              </th>
              <th className="text-center py-3 px-2 w-10">{forLabel}</th>
              <th className="text-center py-3 px-2 w-10">{againstLabel}</th>
              <th className="text-center py-3 px-2 w-10">SG</th>
              <th className="text-center py-3 px-3 w-14">
                <span className="text-amber-400 font-bold">Poin</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, idx) => {
              const forVal = team.goalsFor ?? team.setsFor ?? 0;
              const againstVal = team.goalsAgainst ?? team.setsAgainst ?? 0;
              const diff = forVal - againstVal;
              const isQualified = idx < 2; // Top 2 teams qualify for knockout

              return (
                <tr
                  key={team.name}
                  className={`border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] ${
                    isQualified ? 'bg-emerald-500/[0.04]' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : idx === 1
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                        : 'bg-slate-800 text-slate-400 border border-white/[0.06]'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`font-semibold ${isQualified ? 'text-white' : 'text-slate-300'}`}>
                      {team.name}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2 text-slate-300 font-medium">{team.played}</td>
                  <td className="text-center py-3 px-2 text-emerald-400 font-bold">{team.won}</td>
                  {isBallSport && (
                    <td className="text-center py-3 px-2 text-amber-400 font-medium">{team.draw || 0}</td>
                  )}
                  <td className="text-center py-3 px-2 text-red-400 font-medium">{team.lost}</td>
                  <td className="text-center py-3 px-2 text-slate-300">{forVal}</td>
                  <td className="text-center py-3 px-2 text-slate-300">{againstVal}</td>
                  <td className="text-center py-3 px-2">
                    <span className={`font-medium ${
                      diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className="font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {team.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-5 py-2.5 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-400 bg-[#0a1628]/30">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Peringkat 1 & 2 lolos ke babak berikutnya
        </span>
        <span>M: Main • W: Menang {isBallSport ? '• D: Seri ' : ''}• L: Kalah • {forLabel}: {isBallSport ? 'Gol Masuk' : 'Set Menang'} • {againstLabel}: {isBallSport ? 'Gol Kemasukan' : 'Set Kalah'} • SG: Selisih</span>
      </div>
    </div>
  );
}
