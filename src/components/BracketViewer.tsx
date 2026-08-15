'use client';

import React, { useEffect, useRef } from 'react';
import { Printer, Trophy, CheckCircle2, Award } from 'lucide-react';
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

  // QF Pairings (for Volly Putra & Volly Putri)
  const qfPairs: [string, string][] = [
    [leaderA, runnerB], // QF 1: Juara Full A vs Runner Up B
    [leaderC, runnerD], // QF 2: Juara Full C vs Runner Up D
    [leaderB, runnerC], // QF 3: Juara Full B vs Runner Up C
    [leaderD, runnerA], // QF 4: Juara Full D vs Runner Up A
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
      path.setAttribute('stroke', 'rgba(14, 165, 233, 0.35)');
      path.setAttribute('stroke-width', '2');
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
    <div className="bg-[#0f1d32] rounded-2xl border border-white/[0.06] p-6 shadow-2xl space-y-8">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.06] no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" /> Bagan Sistem Gugur Real-Time
          </div>
          <h2 className="text-xl font-extrabold text-white">Bagan Turnamen – {sportName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isMiniFootball
              ? 'Sepak Bola Mini dimulai dari Babak Semi Final (4 Besar).'
              : 'Volly Putra & Putri dimulai dari Babak 8 Besar (Perempat Final).'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 hover:scale-105"
        >
          <Printer className="w-4 h-4" />
          Cetak Bagan A4
        </button>
      </div>

      {/* Bracket Area */}
      <div ref={containerRef} className="relative min-h-[460px] flex items-center justify-around px-2 sm:px-8 py-4">
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Round 1: Perempat Final (Only for Volly Putra & Putri) */}
        {!isMiniFootball && (
          <div className="relative z-10 flex flex-col justify-around space-y-6 w-48 sm:w-56">
            <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider text-center flex items-center justify-center gap-1.5 mb-2">
              <Award className="w-4 h-4" /> Perempat Final (8 Besar)
            </h3>

            {qfPairs.map((pair, idx) => {
              const m = qfMatches[idx];
              const isFinished = m?.status === 'finished';
              const winner = m?.winner;

              return (
                <div
                  key={idx}
                  id={`qf-${idx}`}
                  className="bg-[#0a1628] border border-white/[0.08] rounded-xl overflow-hidden shadow-lg"
                >
                  <div className="px-3 py-1 bg-cyan-500/10 border-b border-white/[0.04] flex items-center justify-between text-[10px] text-cyan-400 font-bold">
                    <span>QF {idx + 1}</span>
                    {isFinished ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Selesai
                      </span>
                    ) : (
                      <span className="text-slate-400">{m?.time || 'TBD'}</span>
                    )}
                  </div>

                  <div className={`p-2.5 flex items-center justify-between border-b border-white/[0.04] ${
                    winner === pair[0] ? 'bg-emerald-500/15 text-emerald-400 font-extrabold' : 'text-slate-200'
                  }`}>
                    <span className="text-xs font-semibold truncate">{pair[0]}</span>
                    {winner === pair[0] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </div>

                  <div className={`p-2.5 flex items-center justify-between ${
                    winner === pair[1] ? 'bg-emerald-500/15 text-emerald-400 font-extrabold' : 'text-slate-200'
                  }`}>
                    <span className="text-xs font-semibold truncate">{pair[1]}</span>
                    {winner === pair[1] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Round 2: Semi Final */}
        <div className="relative z-10 flex flex-col justify-around space-y-16 w-48 sm:w-56">
          <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider text-center flex items-center justify-center gap-1.5 mb-2">
            <Award className="w-4 h-4" /> Semi Final
          </h3>

          {sfPairs.map((pair, idx) => {
            const m = sfMatches[idx];
            const isFinished = m?.status === 'finished';
            const winner = m?.winner;

            return (
              <div
                key={idx}
                id={`sf-${idx}`}
                className="bg-[#0a1628] border border-cyan-500/30 rounded-xl overflow-hidden shadow-xl"
              >
                <div className="px-3 py-1 bg-cyan-500/15 border-b border-white/[0.04] flex items-center justify-between text-[10px] text-cyan-400 font-bold">
                  <span>SF {idx + 1}</span>
                  {isFinished ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selesai
                    </span>
                  ) : (
                    <span className="text-slate-400">{m?.time || 'TBD'}</span>
                  )}
                </div>

                <div className={`p-2.5 flex items-center justify-between border-b border-white/[0.04] ${
                  winner === pair[0] ? 'bg-emerald-500/15 text-emerald-400 font-extrabold' : 'text-slate-200'
                }`}>
                  <span className="text-xs font-semibold truncate">{pair[0]}</span>
                  {winner === pair[0] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                </div>

                <div className={`p-2.5 flex items-center justify-between ${
                  winner === pair[1] ? 'bg-emerald-500/15 text-emerald-400 font-extrabold' : 'text-slate-200'
                }`}>
                  <span className="text-xs font-semibold truncate">{pair[1]}</span>
                  {winner === pair[1] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Round 3: Final */}
        <div className="relative z-10 flex flex-col justify-center space-y-4 w-48 sm:w-56">
          <h3 className="text-xs font-extrabold text-red-400 uppercase tracking-wider text-center flex items-center justify-center gap-1.5 mb-2">
            🏆 Grand Final
          </h3>

          <div
            id="final-0"
            className="bg-gradient-to-br from-[#0f1d32] to-[#0a1628] border-2 border-red-500/40 rounded-xl overflow-hidden shadow-2xl shadow-red-500/15"
          >
            <div className="px-3 py-1.5 bg-red-500/15 border-b border-white/[0.04] flex items-center justify-between text-[10px] text-red-400 font-bold">
              <span>Final</span>
              {finalMatch?.status === 'finished' && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Selesai
                </span>
              )}
            </div>

            <div className={`p-3 flex items-center justify-between border-b border-white/[0.04] ${
              tournamentWinner === finalPair[0] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200'
            }`}>
              <span className="text-xs font-semibold truncate">{finalPair[0]}</span>
              {tournamentWinner === finalPair[0] && <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            </div>

            <div className={`p-3 flex items-center justify-between ${
              tournamentWinner === finalPair[1] ? 'bg-emerald-500/20 text-emerald-400 font-extrabold' : 'text-slate-200'
            }`}>
              <span className="text-xs font-semibold truncate">{finalPair[1]}</span>
              {tournamentWinner === finalPair[1] && <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            </div>
          </div>

          {/* Winner Banner */}
          {tournamentWinner && (
            <div className="mt-4 text-center p-4 bg-gradient-to-r from-red-600/20 via-amber-500/20 to-red-600/20 border border-amber-500/40 rounded-xl shadow-lg animate-bounce">
              <div className="text-[10px] uppercase font-extrabold text-amber-400 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> JUARA 1 TURNAMEN
              </div>
              <div className="text-base font-extrabold text-white mt-1">{tournamentWinner}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
