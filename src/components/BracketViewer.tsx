'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, Trophy, MoveHorizontal, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';
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
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  // SVG Connector Lines (Calculated relative to SVG element rect)
  const drawLines = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    svg.innerHTML = '';
    const svgRect = svg.getBoundingClientRect();

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

      const y1 = r1.top + r1.height / 2 - svgRect.top;
      const x1 = r1.right - svgRect.left;
      const y2 = r2.top + r2.height / 2 - svgRect.top;
      const x2 = r2.right - svgRect.left;
      const ty = rt.top + rt.height / 2 - svgRect.top;
      const tx = rt.left - svgRect.left;

      const mx = (Math.max(x1, x2) + tx) / 2;
      const midY = (y1 + y2) / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute(
        'd',
        `M ${x1} ${y1} H ${mx} ` +
        `M ${x2} ${y2} H ${mx} ` +
        `M ${mx} ${y1} V ${y2} ` +
        `M ${mx} ${midY} H ${tx}`
      );
      path.setAttribute('stroke', '#38bdf8'); // Bright cyan accent
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
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
    const timer = setTimeout(drawLines, 100);
    window.addEventListener('resize', drawLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', drawLines);
    };
  }, [matches, standings, isMiniFootball]);

  // Image Download Handler (High Contrast in both Dark and Light mode)
  const handleDownloadImage = async () => {
    if (!containerRef.current) return;
    const isLightMode = document.documentElement.classList.contains('light');

    try {
      setDownloading(true);
      setDownloadSuccess(false);

      // Temporarily remove light mode class during PNG capture to prevent black text overrides on dark canvas
      if (isLightMode) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }

      // Redraw lines to ensure crisp positioning
      drawLines();

      const dataUrl = await toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: '#0f1d32',
        pixelRatio: 2, // High resolution HD PNG export
      });

      const cleanSportName = sportName.replace(/\s+/g, '-');
      const link = document.createElement('a');
      link.download = `Bagan-Sistem-Gugur-${cleanSportName}-Pesta-Rakyat.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error downloading bracket image:', err);
      alert('Gagal mengunduh gambar bagan. Silakan coba beberapa saat lagi!');
    } finally {
      // Restore original theme class
      if (isLightMode) {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      setDownloading(false);
    }
  };

  return (
    <div className="bg-[#0f1d32] rounded-2xl border border-white/[0.06] p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6">
      {/* Title & Toolbar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-white/[0.06] no-print">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wider">
            BAGAN SISTEM GUGUR
          </h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            PERTANDINGAN {sportName.toUpperCase()}
          </p>
        </div>

        {/* Download Image Button */}
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg border hover:scale-105 ${
            downloadSuccess
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 shadow-emerald-600/20'
          }`}
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Mengunduh Gambar...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Berhasil Diunduh!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-white" />
              <span>Download Gambar Bagan (PNG)</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Scroll Hint Badge */}
      <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-cyan-400 bg-cyan-500/10 py-1.5 px-3.5 rounded-full border border-cyan-500/20 sm:hidden w-fit mx-auto">
        <MoveHorizontal className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
        <span>Geser ke samping untuk melihat seluruh bagan</span>
      </div>

      {/* Scrollable Bracket Area */}
      <div className="overflow-x-auto custom-scrollbar pb-6 pt-2">
        <div
          ref={containerRef}
          className={`bracket-canvas relative flex flex-col items-center justify-center gap-6 px-6 py-6 rounded-2xl border border-white/10 ${
            isMiniFootball ? 'min-w-[560px]' : 'min-w-[860px]'
          }`}
        >
          {/* Official Image Header Title (Included in Downloaded PNG Image) */}
          <div className="w-full text-center pb-4 border-b border-white/10 space-y-2 z-10">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
              BAGAN SISTEM GUGUR - PERTANDINGAN {sportName.toUpperCase()}
            </h2>
            <p className="text-[10px] font-semibold tracking-wide max-w-2xl mx-auto uppercase">
              PANITIA PELAKSANA PESTA RAKYAT KKN IAIN PAREPARE POSKO 03 ANGKATAN 37 DESA BUNTU BARANA KOLABORASI PEMUDA BALABATU
            </p>
          </div>

          {/* SVG Connector Lines Container */}
          <div className="relative w-full flex items-center justify-center gap-10 sm:gap-14 pt-2">
            <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

            {/* Symmetrical 2-Branch Layout Container */}
            <div className="relative z-10 flex flex-col justify-center gap-12 sm:gap-16">
              {/* TOP BRANCH: QF 0 & QF 1 -> SF 0 */}
              <div className="flex items-center gap-10 sm:gap-14">
                {/* QF Group 1 */}
                {!isMiniFootball && (
                  <div className="flex flex-col gap-6 w-56 sm:w-64 flex-shrink-0">
                    <div className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest text-center">
                      PEREMPAT FINAL (5 SET)
                    </div>

                    {/* QF 0 */}
                    {renderMatchCard(qfMatches[0], qfPairs[0], 'qf-0')}
                    {/* QF 1 */}
                    {renderMatchCard(qfMatches[1], qfPairs[1], 'qf-1')}
                  </div>
                )}

                {/* SF 0 */}
                <div className="flex flex-col justify-center w-56 sm:w-64 flex-shrink-0">
                  <div className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-widest text-center mb-2">
                    SEMI FINAL {!isMiniFootball ? '(5 SET)' : ''}
                  </div>
                  {renderMatchCard(sfMatches[0], sfPairs[0], 'sf-0', sfPairs[0][0] === 'TBD', sfPairs[0][1] === 'TBD')}
                </div>
              </div>

              {/* BOTTOM BRANCH: QF 2 & QF 3 -> SF 1 */}
              <div className="flex items-center gap-10 sm:gap-14">
                {/* QF Group 2 */}
                {!isMiniFootball && (
                  <div className="flex flex-col gap-6 w-56 sm:w-64 flex-shrink-0">
                    {/* QF 2 */}
                    {renderMatchCard(qfMatches[2], qfPairs[2], 'qf-2')}
                    {/* QF 3 */}
                    {renderMatchCard(qfMatches[3], qfPairs[3], 'qf-3')}
                  </div>
                )}

                {/* SF 1 */}
                <div className="flex flex-col justify-center w-56 sm:w-64 flex-shrink-0">
                  {renderMatchCard(sfMatches[1], sfPairs[1], 'sf-1', sfPairs[1][0] === 'TBD', sfPairs[1][1] === 'TBD')}
                </div>
              </div>
            </div>

            {/* FINAL ROUND (Centered Right) */}
            <div className="relative z-10 flex flex-col justify-center w-56 sm:w-64 flex-shrink-0 self-center space-y-4">
              <div className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest text-center mb-2">
                FINAL {!isMiniFootball ? '(5 SET)' : ''}
              </div>

              <div
                id="final-0"
                className="bg-[#1a2942] border-2 border-amber-500/50 rounded-2xl overflow-hidden shadow-2xl p-2 space-y-1.5"
              >
                {/* Match Date & Time */}
                {finalMatch?.date && (
                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
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
    </div>
  );
}

// Helper Card Renderer Component
function renderMatchCard(
  m: Match | undefined,
  pair: [string, string],
  cardId: string,
  isTbdA: boolean = false,
  isTbdB: boolean = false
) {
  const scoreAStr = m?.scoreA !== null && m?.scoreA !== undefined ? String(m.scoreA) : '-';
  const scoreBStr = m?.scoreB !== null && m?.scoreB !== undefined ? String(m.scoreB) : '-';
  const winner = m?.winner;

  return (
    <div
      id={cardId}
      className="bg-[#1a2942] border border-slate-700/70 rounded-2xl overflow-hidden shadow-lg p-2 space-y-1.5 transition-all hover:border-cyan-500/40"
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
}
