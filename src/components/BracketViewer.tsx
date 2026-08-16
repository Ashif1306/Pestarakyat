'use client';

import React, { useEffect, useRef } from 'react';
import { Printer, Trophy, CheckCircle2 } from 'lucide-react';
import { getMatchesBySport, getStandings } from '@/lib/data';
import type { Team } from '@/types';

interface BracketViewerProps {
  sportId?: string;
  sportName: string;
  teams: Team[];
}

export default function BracketViewer({ sportId = 'volly-putra', sportName }: BracketViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 1. Fetch current matches and standings real-time
  const matches = getMatchesBySport(sportId);
  const standings = getStandings(sportId);

  // 2. Determine Leaders & Runners-up from Group Stage
  const groupA = standings['A'] || [];
  const groupB = standings['B'] || [];
  const groupC = standings['C'] || [];
  const groupD = standings['D'] || [];

  const leaderA = groupA[0]?.played > 0 ? groupA[0].name : 'Juara Full A';
  const runnerA = groupA[1]?.played > 0 ? groupA[1].name : 'Runner Up A';
  const leaderB = groupB[0]?.played > 0 ? groupB[0].name : 'Juara Full B';
  const runnerB = groupB[1]?.played > 0 ? groupB[1].name : 'Runner Up B';
  const leaderC = groupC[0]?.played > 0 ? groupC[0].name : 'Juara Full C';
  const runnerC = groupC[1]?.played > 0 ? groupC[1].name : 'Runner Up C';
  const leaderD = groupD[0]?.played > 0 ? groupD[0].name : 'Juara Full D';
  const runnerD = groupD[1]?.played > 0 ? groupD[1].name : 'Runner Up D';

  const isMiniFootball = sportId === 'sepak-bola-mini';

  // 3. Find Knockout Matches from database
  const qfMatches = matches.filter((m) => m.phase === 'knockout' && m.round.toLowerCase().includes('perempat'));
  const sfMatches = matches.filter((m) => m.phase === 'knockout' && m.round.toLowerCase().includes('semi'));
  const finalMatch = matches.find((m) => m.phase === 'knockout' && m.round.toLowerCase().includes('final'));

  // QF Pairings (Exact diagram match for Volly)
  // QF 1: Juara Full A vs Runner Up B
  // QF 2: Juara Full C vs Runner Up D
  // QF 3: Juara Full B vs Runner Up C
  // QF 4: Juara Full D vs Runner Up A
  const qfPairs: [string, string][] = [
    [leaderA, runnerB],
    [leaderC, runnerD],
    [leaderB, runnerC],
    [leaderD, runnerA],
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
      [leaderA, runnerB],
      [leaderB, runnerA],
    ];
  } else {
    sfPairs = [
      [qfWinners[0] || 'Tim...', qfWinners[1] || 'Tim...'],
      [qfWinners[2] || 'Tim...', qfWinners[3] || 'Tim...'],
    ];
  }

  // Check SF Winners
  const sfWinners = sfPairs.map((pair, idx) => {
    const m = sfMatches[idx];
    if (m?.status === 'finished' && m.winner) return m.winner;
    return null;
  });

  // Final Pair
  const finalPair: [string, string] = [
    sfWinners[0] || 'Tim...',
    sfWinners[1] || 'Tim...',
  ];

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

  return (
    <div className="bg-[#0f1d32] rounded-2xl border border-white/[0.06] p-6 shadow-2xl space-y-6">
      {/* Title & Toolbar */}
      <div className="text-center space-y-1 pb-4 border-b border-white/[0.06] relative">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">
          BAGAN SISTEM GUGUR
        </h2>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          PERTANDINGAN {sportName.toUpperCase()}
        </p>

        <button
          onClick={() => window.print()}
          className="absolute right-0 top-0 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg no-print"
        >
          <Printer className="w-3.5 h-3.5" /> Cetak
        </button>
      </div>

      {/* Bracket Area */}
      <div ref={containerRef} className="relative min-h-[500px] flex items-center justify-around px-2 sm:px-6 py-4">
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Round 1: PEREMPAT FINAL (Volly Putra & Putri) */}
        {!isMiniFootball && (
          <div className="relative z-10 flex flex-col justify-around space-y-8 w-52 sm:w-60">
            <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest text-center mb-1">
              PEREMPAT FINAL
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
                  className="bg-[#1a2942] border border-slate-700/60 rounded-xl overflow-hidden shadow-md space-y-0.5 p-1"
                >
                  {/* Team A */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      winner === pair[0] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
                    }`}
                  >
                    <span className="text-xs font-semibold truncate max-w-[140px]">{pair[0]}</span>
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
                    <span className="text-xs font-semibold truncate max-w-[140px]">{pair[1]}</span>
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
        <div className="relative z-10 flex flex-col justify-around space-y-24 w-52 sm:w-60">
          <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest text-center mb-1">
            SEMI FINAL
          </h3>

          {sfPairs.map((pair, idx) => {
            const m = sfMatches[idx];
            const scoreAStr = m?.scoreA !== null && m?.scoreA !== undefined ? String(m.scoreA) : '-';
            const scoreBStr = m?.scoreB !== null && m?.scoreB !== undefined ? String(m.scoreB) : '-';
            const winner = m?.winner;

            return (
              <div
                key={idx}
                id={`sf-${idx}`}
                className="bg-[#1a2942] border border-slate-700/60 rounded-xl overflow-hidden shadow-md space-y-0.5 p-1"
              >
                {/* Team A */}
                <div
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    winner === pair[0] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
                  }`}
                >
                  <span className={`text-xs font-semibold truncate max-w-[140px] ${pair[0] === 'Tim...' ? 'italic text-slate-400' : ''}`}>
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
                  <span className={`text-xs font-semibold truncate max-w-[140px] ${pair[1] === 'Tim...' ? 'italic text-slate-400' : ''}`}>
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
        <div className="relative z-10 flex flex-col justify-center space-y-4 w-52 sm:w-60">
          <h3 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest text-center mb-1">
            FINAL
          </h3>

          <div
            id="final-0"
            className="bg-[#1a2942] border-2 border-red-500/40 rounded-xl overflow-hidden shadow-xl space-y-0.5 p-1"
          >
            {/* Team A */}
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                tournamentWinner === finalPair[0] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200 bg-[#0f1d32]'
              }`}
            >
              <span className={`text-xs font-semibold truncate max-w-[140px] ${finalPair[0] === 'Tim...' ? 'italic text-slate-400' : ''}`}>
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
              <span className={`text-xs font-semibold truncate max-w-[140px] ${finalPair[1] === 'Tim...' ? 'italic text-slate-400' : ''}`}>
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
  );
}
