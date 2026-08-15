'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Printer, RotateCcw } from 'lucide-react';
import type { Team } from '@/types';

interface BracketViewerProps {
  sportName: string;
  teams: Team[];
}

export default function BracketViewer({ sportName, teams }: BracketViewerProps) {
  const defaultPairs = teams.length >= 8
    ? [
        [teams[0].name, teams[1].name],
        [teams[2].name, teams[3].name],
        [teams[4].name, teams[5].name],
        [teams[6].name, teams[7].name],
      ]
    : [
        ['Juara Grup A', 'Runner-up Grup B'],
        ['Juara Grup B', 'Runner-up Grup A'],
        ['Tim C1', 'Tim C2'],
        ['Tim D1', 'Tim D2'],
      ];

  const [qf, setQf] = useState(defaultPairs);
  const [sf, setSf] = useState([['', ''], ['', '']]);
  const [final, setFinal] = useState([['', '']]);
  const [winner, setWinner] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const advanceQf = (matchIdx: number, slotIdx: number) => {
    const winnerName = qf[matchIdx][slotIdx];
    if (!winnerName) return;

    const nextSfIdx = Math.floor(matchIdx / 2);
    const nextSlotIdx = matchIdx % 2;

    const newSf = [...sf];
    newSf[nextSfIdx] = [...newSf[nextSfIdx]];
    newSf[nextSfIdx][nextSlotIdx] = winnerName;
    setSf(newSf);
  };

  const advanceSf = (matchIdx: number, slotIdx: number) => {
    const winnerName = sf[matchIdx][slotIdx];
    if (!winnerName) return;

    const newFinal = [...final];
    newFinal[0] = [...newFinal[0]];
    newFinal[0][matchIdx] = winnerName;
    setFinal(newFinal);
  };

  const advanceFinal = (slotIdx: number) => {
    const winnerName = final[0][slotIdx];
    if (!winnerName) return;
    setWinner(winnerName);
  };

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
      path.setAttribute('stroke', '#1e3a5f');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      svg.appendChild(path);
    };

    drawConnectorPair('qf-0', 'qf-1', 'sf-0');
    drawConnectorPair('qf-2', 'qf-3', 'sf-1');
    drawConnectorPair('sf-0', 'sf-1', 'final-0');
  };

  useEffect(() => {
    drawLines();
    window.addEventListener('resize', drawLines);
    return () => window.removeEventListener('resize', drawLines);
  }, [qf, sf, final]);

  return (
    <div className="bg-[#0f1d32] rounded-2xl border border-white/[0.06] p-6 shadow-2xl">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06] no-print">
        <div>
          <h2 className="text-xl font-bold text-white">Bagan Turnamen – {sportName}</h2>
          <p className="text-xs text-slate-400">Klik ▶ untuk meloloskan tim ke babak berikutnya</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-red-600/20"
          >
            <Printer className="w-4 h-4" />
            Cetak A4
          </button>
          <button
            onClick={() => {
              setSf([['', ''], ['', '']]);
              setFinal([['', '']]);
              setWinner('');
            }}
            className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors border border-white/[0.06]"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Bracket Area */}
      <div ref={containerRef} className="relative min-h-[500px] flex items-center justify-between px-4">
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Round 1: Perempat Final */}
        <div className="relative z-10 flex flex-col justify-around h-full space-y-6 w-48">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
            Perempat Final
          </h3>
          {qf.map((pair, idx) => (
            <div key={idx} id={`qf-${idx}`} className="bg-[#0a1628] border border-white/[0.06] rounded-xl overflow-hidden shadow-lg">
              <div className="flex items-center justify-between p-2.5 border-b border-white/[0.04] bg-[#0a1628]">
                <input
                  type="text"
                  value={pair[0]}
                  onChange={(e) => {
                    const n = [...qf];
                    n[idx] = [...n[idx]];
                    n[idx][0] = e.target.value;
                    setQf(n);
                  }}
                  className="bg-transparent text-white font-bold text-xs outline-none w-full"
                />
                <button
                  onClick={() => advanceQf(idx, 0)}
                  className="ml-2 text-cyan-400 hover:text-cyan-300 font-extrabold text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20"
                >
                  ▶
                </button>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#081220]">
                <input
                  type="text"
                  value={pair[1]}
                  onChange={(e) => {
                    const n = [...qf];
                    n[idx] = [...n[idx]];
                    n[idx][1] = e.target.value;
                    setQf(n);
                  }}
                  className="bg-transparent text-white font-bold text-xs outline-none w-full"
                />
                <button
                  onClick={() => advanceQf(idx, 1)}
                  className="ml-2 text-cyan-400 hover:text-cyan-300 font-extrabold text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20"
                >
                  ▶
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Round 2: Semi Final */}
        <div className="relative z-10 flex flex-col justify-around h-full space-y-24 w-48">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
            Semi Final
          </h3>
          {sf.map((pair, idx) => (
            <div key={idx} id={`sf-${idx}`} className="bg-[#0a1628] border border-cyan-500/20 rounded-xl overflow-hidden shadow-lg">
              <div className="flex items-center justify-between p-2.5 border-b border-white/[0.04]">
                <span className="text-white font-bold text-xs truncate">{pair[0] || 'TBD'}</span>
                {pair[0] && (
                  <button
                    onClick={() => advanceSf(idx, 0)}
                    className="ml-2 text-cyan-400 hover:text-cyan-300 font-extrabold text-xs px-1.5 py-0.5 rounded bg-cyan-500/10"
                  >
                    ▶
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between p-2.5">
                <span className="text-white font-bold text-xs truncate">{pair[1] || 'TBD'}</span>
                {pair[1] && (
                  <button
                    onClick={() => advanceSf(idx, 1)}
                    className="ml-2 text-cyan-400 hover:text-cyan-300 font-extrabold text-xs px-1.5 py-0.5 rounded bg-cyan-500/10"
                  >
                    ▶
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Round 3: Final */}
        <div className="relative z-10 flex flex-col justify-center h-full w-48">
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider text-center mb-4">
            🏆 Final
          </h3>
          <div id="final-0" className="bg-gradient-to-br from-[#0f1d32] to-[#0a1628] border-2 border-red-500/40 rounded-xl overflow-hidden shadow-2xl shadow-red-500/10">
            <div className="flex items-center justify-between p-3 border-b border-white/[0.04]">
              <span className="text-white font-bold text-xs truncate">{final[0][0] || 'TBD'}</span>
              {final[0][0] && (
                <button
                  onClick={() => advanceFinal(0)}
                  className="ml-2 text-red-400 font-extrabold text-xs px-2 py-0.5 rounded bg-red-500/15"
                >
                  🏆
                </button>
              )}
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-white font-bold text-xs truncate">{final[0][1] || 'TBD'}</span>
              {final[0][1] && (
                <button
                  onClick={() => advanceFinal(1)}
                  className="ml-2 text-red-400 font-extrabold text-xs px-2 py-0.5 rounded bg-red-500/15"
                >
                  🏆
                </button>
              )}
            </div>
          </div>

          {winner && (
            <div className="mt-6 text-center p-3 bg-gradient-to-r from-red-500/15 to-amber-500/15 border border-red-500/30 rounded-xl animate-bounce">
              <div className="text-[10px] uppercase font-bold text-red-400">Juara 1</div>
              <div className="text-sm font-extrabold text-white">{winner}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
