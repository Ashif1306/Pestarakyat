'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Printer, Trophy, MoveHorizontal, Info, X, Calendar } from 'lucide-react';
import { getMatchesBySport, getStandings, fetchServerMatches, getStandingsWithMatches } from '@/lib/data';
import type { Match, Standing, Team } from '@/types';

interface BracketViewerProps {
  sportId?: string;
  sportName: string;
  teams: Team[];
}

export default function BracketViewer({ sportId = 'volly-putra', sportName }: BracketViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [showNotice, setShowNotice] = useState(false);

  // 1. Live state for matches & standings (fetches directly from server DB)
  const [matches, setMatches] = useState<Match[]>(getMatchesBySport(sportId));
  const [standings, setStandings] = useState<Record<string, Standing[]>>(getStandings(sportId));

  useEffect(() => {
    fetchServerMatches().then((fresh) => {
      if (fresh && Array.isArray(fresh) && fresh.length > 0) {
        const filtered = fresh.filter((m) => m.sport === sportId);
        setMatches(filtered);
        setStandings(getStandingsWithMatches(fresh, sportId));
      }
    });
  }, [sportId]);

  // 2. Determine Leaders & Runners-up from Group Stage
  const groupA = standings['A'] || [];
  const groupB = standings['B'] || [];
  const groupC = standings['C'] || [];
  const groupD = standings['D'] || [];

  const leaderA = groupA[0]?.name || 'Juara Full A';
  const runnerA = groupA[1]?.name || 'Runner Up A';
  const leaderB = groupB[0]?.name || 'Juara Full B';
  const runnerB = groupB[1]?.name || 'Runner Up B';
  const leaderC = groupC[0]?.name || 'Juara Full C';
  const runnerC = groupC[1]?.name || 'Runner Up C';
  const leaderD = groupD[0]?.name || 'Juara Full D';
  const runnerD = groupD[1]?.name || 'Runner Up D';

  const isMiniFootball = sportId === 'sepak-bola-mini';

  // 3. Find Knockout Matches from database
  const qfMatches = matches.filter((m) => m.phase === 'knockout' && m.round.toLowerCase().includes('perempat'));
  const sfMatches = matches.filter((m) => m.phase === 'knockout' && m.round.toLowerCase().includes('semi'));
  const finalMatch = matches.find((m) => m.phase === 'knockout' && m.round.toLowerCase().includes('final'));

  // Helper: Check if team name is a real team name or placeholder
  const isRealTeam = (name?: string | null) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    if (
      lower.includes('juara') ||
      lower.includes('runner') ||
      lower.includes('pemenang') ||
      lower.includes('tim...') ||
      lower === 'tbd'
    ) {
      return false;
    }
    return true;
  };

  // Helper: Get QF team (prioritize admin DB override, then standings position, then default placeholder)
  const getQFTeam = (qfIndex: number, isTeamA: boolean, defaultPlaceholder: string, standingsTeam?: string) => {
    const m = qfMatches[qfIndex];
    if (m) {
      const val = isTeamA ? m.teamA : m.teamB;
      if (isRealTeam(val)) {
        return val;
      }
    }
    return standingsTeam || defaultPlaceholder;
  };

  // QF Pairings (Exact diagram match for Volly)
  const qfPairs: [string, string][] = [
    [getQFTeam(0, true, 'Juara Full A', leaderA), getQFTeam(0, false, 'Runner Up B', runnerB)],
    [getQFTeam(1, true, 'Juara Full C', leaderC), getQFTeam(1, false, 'Runner Up D', runnerD)],
    [getQFTeam(2, true, 'Juara Full B', leaderB), getQFTeam(2, false, 'Runner Up C', runnerC)],
    [getQFTeam(3, true, 'Juara Full D', leaderD), getQFTeam(3, false, 'Runner Up A', runnerA)],
  ];

  // Check QF Winners
  const qfWinners = qfPairs.map((pair, idx) => {
    const m = qfMatches[idx];
    if (m?.status === 'finished' && m.winner) return m.winner;
    return null;
  });

  // SF Pairings
  let sfPairs: [string, string][] = [];
  if (isMiniFootball) {
    sfPairs = [
      [getQFTeam(0, true, 'Juara Full A', leaderA), getQFTeam(0, false, 'Runner Up B', runnerB)],
      [getQFTeam(1, true, 'Juara Full B', leaderB), getQFTeam(1, false, 'Runner Up A', runnerA)],
    ];
  } else {
    const sf1A = isRealTeam(sfMatches[0]?.teamA) ? sfMatches[0].teamA : (qfWinners[0] || 'TBD');
    const sf1B = isRealTeam(sfMatches[0]?.teamB) ? sfMatches[0].teamB : (qfWinners[1] || 'TBD');
    const sf2A = isRealTeam(sfMatches[1]?.teamA) ? sfMatches[1].teamA : (qfWinners[2] || 'TBD');
    const sf2B = isRealTeam(sfMatches[1]?.teamB) ? sfMatches[1].teamB : (qfWinners[3] || 'TBD');

    sfPairs = [
      [sf1A, sf1B],
      [sf2A, sf2B],
    ];
  }

  // Check SF Winners
  const sfWinners = sfPairs.map((pair, idx) => {
    const m = sfMatches[idx];
    if (m?.status === 'finished' && m.winner) return m.winner;
    return null;
  });

  // Final Pair
  const finalA = finalMatch?.teamA && isRealTeam(finalMatch.teamA) ? finalMatch.teamA : (sfWinners[0] || 'TBD');
  const finalB = finalMatch?.teamB && isRealTeam(finalMatch.teamB) ? finalMatch.teamB : (sfWinners[1] || 'TBD');

  const finalPair: [string, string] = [finalA, finalB];

  // Tournament Winner
  const tournamentWinner = finalMatch?.status === 'finished' ? finalMatch.winner : null;

  // SVG Connector Lines
  const drawLines = () => {
    if (!containerRef.current || !svgRef.current) return;
    const container = containerRef.current;
    const svg = svgRef.current;
    svg.innerHTML = '';
    const containerRect = container.getBoundingClientRect();

    const drawConnectorPair = (
      card1Id: string,
      card2Id: string,
      targetCardId: string
    ) => {
      const el1 = document.getElementById(card1Id);
      const el2 = document.getElementById(card2Id);
      const targetEl = document.getElementById(targetCardId);

      if (!el1 || !el2 || !targetEl) return;

      const r1 = el1.getBoundingClientRect();
      const r2 = el2.getBoundingClientRect();
      const rt = targetEl.getBoundingClientRect();

      const y1 = r1.top + r1.height / 2 - containerRect.top;
      const x1 = r1.right - containerRect.left;
      const y2 = r2.top + r2.height / 2 - containerRect.top;
      const x2 = r2.right - containerRect.left;
      const ty = rt.top + rt.height / 2 - containerRect.top;
      const tx = rt.left - containerRect.left;

      const mx = (Math.max(x1, x2) + tx) / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        `M ${x1} ${y1} H ${mx} ` +
        `M ${x2} ${y2} H ${mx} ` +
        `M ${mx} ${y1} V ${y2} ` +
        `M ${mx} ${ty} H ${tx}`
      );
      path.setAttribute('stroke', '#94a3b8');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('fill', 'none');
      svg.appendChild(path);
    };

    if (!isMiniFootball) {
      drawConnectorPair('qf-0', 'qf-1', 'sf-0');
      drawConnectorPair('qf-2', 'qf-3', 'sf-1');
    }
    drawConnectorPair('sf-0', 'sf-1', 'final-0');
  };

  useEffect(() => {
    drawLines();
    window.addEventListener('resize', drawLines);
    return () => window.removeEventListener('resize', drawLines);
  }, [matches, standings, isMiniFootball]);

  const handlePrintClick = () => {
    setShowNotice(true);
  };

  return (
    <div className="bg-[#0f1d32] rounded-2xl border border-white/[0.06] p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6">
      {/* Title & Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-white/[0.06] no-print">
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wider">
              BAGAN SISTEM GUGUR
            </h2>
            {!isMiniFootball && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wide">
                ⚡ Babak Knockout Best of 5 Sets (5 Set)
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            PERTANDINGAN {sportName.toUpperCase()}
          </p>
        </div>

        <button
          onClick={handlePrintClick}
          className="px-4 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:scale-105 border border-white/10"
        >
          <Printer className="w-3.5 h-3.5 text-amber-400" /> Cetak Bagan
        </button>
      </div>

      {/* Feature Disabled Notice Banner */}
      {showNotice && (
        <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-4 flex items-start justify-between gap-3 text-amber-300 animate-fadeIn no-print">
          <div className="flex items-start gap-2.5">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-extrabold uppercase tracking-wide text-amber-400">
                Informasi Cetak Bagan
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Fitur cetak bagan saat ini sedang dinonaktifkan sementara dan akan segera kembali. Terima kasih atas kesabarannya! 🙏
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="text-amber-400 hover:text-white p-1 rounded-lg hover:bg-amber-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Scroll Hint Badge */}
      <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-cyan-400 bg-cyan-500/10 py-1.5 px-3.5 rounded-full border border-cyan-500/20 sm:hidden w-fit mx-auto">
        <MoveHorizontal className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
        <span>Geser ke samping untuk melihat seluruh bagan</span>
      </div>

      {/* Scrollable Bracket Area */}
      <div className="overflow-x-auto custom-scrollbar pb-4 pt-1">
        <div
          ref={containerRef}
          className={`relative min-h-[560px] flex items-center justify-between gap-8 sm:gap-12 px-4 py-4 ${
            isMiniFootball ? 'min-w-[500px]' : 'min-w-[760px]'
          }`}
        >
          <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

          {/* Round 1: PEREMPAT FINAL (Volly Putra & Putri) */}
          {!isMiniFootball && (
            <div className="relative z-10 flex flex-col justify-around space-y-8 w-56 sm:w-64 flex-shrink-0">
              <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest text-center mb-1">
                PEREMPAT FINAL (5 SET)
              </h3>

              {qfPairs.map((pair, idx) => {
                const m = qfMatches[idx];
                const scoreAStr = m?.scoreA !== null && m?.scoreA !== undefined ? String(m.scoreA) : '-';
                const scoreBStr = m?.scoreB !== null && m?.scoreB !== undefined ? String(m.scoreB) : '-';
                const winner = m?.winner;

                return (
                  <div
                    key={idx}
                    id={`qf-${idx}`}
                    className="bg-[#1a2942] border border-slate-700/60 rounded-xl overflow-hidden shadow-md p-1.5 space-y-1"
                  >
                    {/* Match Date & Time */}
                    {m?.date && (
                      <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 px-2.5 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          {m.date}
                        </span>
                        {m.time && <span className="font-mono text-slate-300">{m.time} WITA</span>}
                      </div>
                    )}

                    {/* Team A */}
                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        winner === pair[0] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
                      }`}
                    >
                      <span className="text-xs font-semibold truncate max-w-[130px]">{pair[0]}</span>
                      <span className="w-6 h-6 rounded border border-slate-600/80 bg-[#1e2d45] text-slate-300 font-bold text-xs flex items-center justify-center ml-2 flex-shrink-0">
                        {scoreAStr}
                      </span>
                    </div>

                    {/* Team B */}
                    <div
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        winner === pair[1] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
                      }`}
                    >
                      <span className="text-xs font-semibold truncate max-w-[130px]">{pair[1]}</span>
                      <span className="w-6 h-6 rounded border border-slate-600/80 bg-[#1e2d45] text-slate-300 font-bold text-xs flex items-center justify-center ml-2 flex-shrink-0">
                        {scoreBStr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Round 2: SEMI FINAL */}
          <div className="relative z-10 flex flex-col justify-around space-y-24 w-56 sm:w-64 flex-shrink-0">
            <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest text-center mb-1">
              SEMI FINAL {!isMiniFootball ? '(5 SET)' : ''}
            </h3>

            {sfPairs.map((pair, idx) => {
              const m = sfMatches[idx];
              const scoreAStr = m?.scoreA !== null && m?.scoreA !== undefined ? String(m.scoreA) : '-';
              const scoreBStr = m?.scoreB !== null && m?.scoreB !== undefined ? String(m.scoreB) : '-';
              const winner = m?.winner;
              const isTbdA = pair[0] === 'TBD';
              const isTbdB = pair[1] === 'TBD';

              return (
                <div
                  key={idx}
                  id={`sf-${idx}`}
                  className="bg-[#1a2942] border border-slate-700/60 rounded-xl overflow-hidden shadow-md p-1.5 space-y-1"
                >
                  {/* Match Date & Time */}
                  {m?.date && (
                    <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 px-2.5 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        {m.date}
                      </span>
                      {m.time && <span className="font-mono text-slate-300">{m.time} WITA</span>}
                    </div>
                  )}

                  {/* Team A */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      winner === pair[0] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
                    }`}
                  >
                    <span className={`text-xs font-semibold truncate max-w-[130px] ${isTbdA ? 'italic text-slate-400 font-bold' : ''}`}>
                      {pair[0]}
                    </span>
                    <span className="w-6 h-6 rounded border border-slate-600/80 bg-[#1e2d45] text-slate-300 font-bold text-xs flex items-center justify-center ml-2 flex-shrink-0">
                      {scoreAStr}
                    </span>
                  </div>

                  {/* Team B */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      winner === pair[1] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
                    }`}
                  >
                    <span className={`text-xs font-semibold truncate max-w-[130px] ${isTbdB ? 'italic text-slate-400 font-bold' : ''}`}>
                      {pair[1]}
                    </span>
                    <span className="w-6 h-6 rounded border border-slate-600/80 bg-[#1e2d45] text-slate-300 font-bold text-xs flex items-center justify-center ml-2 flex-shrink-0">
                      {scoreBStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Round 3: FINAL */}
          <div className="relative z-10 flex flex-col justify-center space-y-4 w-56 sm:w-64 flex-shrink-0">
            <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest text-center mb-1">
              FINAL {!isMiniFootball ? '(5 SET)' : ''}
            </h3>

            <div
              id="final-0"
              className="bg-[#1a2942] border-2 border-red-500/40 rounded-xl overflow-hidden shadow-xl p-1.5 space-y-1"
            >
              {/* Match Date & Time */}
              {finalMatch?.date && (
                <div className="flex items-center justify-between text-[10px] font-bold text-red-400 px-2.5 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-red-400" />
                    {finalMatch.date}
                  </span>
                  {finalMatch.time && <span className="font-mono text-slate-300">{finalMatch.time} WITA</span>}
                </div>
              )}

              {/* Team A */}
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  tournamentWinner === finalPair[0] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
                }`}
              >
                <span className={`text-xs font-semibold truncate max-w-[130px] ${finalPair[0] === 'TBD' ? 'italic text-slate-400 font-bold' : ''}`}>
                  {finalPair[0]}
                </span>
                <span className="w-6 h-6 rounded border border-slate-600/80 bg-[#1e2d45] text-slate-300 font-bold text-xs flex items-center justify-center ml-2 flex-shrink-0">
                  {finalMatch?.scoreA !== null && finalMatch?.scoreA !== undefined ? finalMatch.scoreA : '-'}
                </span>
              </div>

              {/* Team B */}
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  tournamentWinner === finalPair[1] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
                }`}
              >
                <span className={`text-xs font-semibold truncate max-w-[130px] ${finalPair[1] === 'TBD' ? 'italic text-slate-400 font-bold' : ''}`}>
                  {finalPair[1]}
                </span>
                <span className="w-6 h-6 rounded border border-slate-600/80 bg-[#1e2d45] text-slate-300 font-bold text-xs flex items-center justify-center ml-2 flex-shrink-0">
                  {finalMatch?.scoreB !== null && finalMatch?.scoreB !== undefined ? finalMatch.scoreB : '-'}
                </span>
              </div>
            </div>

            {/* Winner Banner */}
            {tournamentWinner && (
              <div className="mt-4 text-center p-3 bg-gradient-to-r from-red-600/20 via-amber-500/20 to-red-600/20 border border-amber-500/40 rounded-xl shadow-lg animate-bounce">
                <div className="text-[10px] uppercase font-extrabold text-amber-400 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> JUARA 1
                </div>
                <div className="text-sm font-extrabold text-white mt-0.5">{tournamentWinner}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
