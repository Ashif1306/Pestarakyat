'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, X, ArrowRight, Trophy } from 'lucide-react';
import type { Sport } from '@/types';

interface KlasemenModalButtonProps {
  sports: Sport[];
}

export default function KlasemenModalButton({ sports }: KlasemenModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sportInfo: Record<string, { teams: number; groups: number; desc: string }> = {
    'volly-putra': { teams: 12, groups: 4, desc: '4 Grup • Turnamen Putra' },
    'volly-putri': { teams: 12, groups: 4, desc: '4 Grup • Turnamen Putri' },
    'sepak-bola-mini': { teams: 12, groups: 2, desc: '2 Grup • Turnamen Sepak Bola Mini' },
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-3.5 rounded-xl bg-[#0f1d32] hover:bg-[#162540] text-slate-200 font-bold text-sm border border-white/[0.08] flex items-center gap-2 transition-all hover:scale-105 shadow-xl cursor-pointer"
      >
        <BarChart3 className="w-4 h-4 text-cyan-400" />
        Klasemen Grup
      </button>

      {/* Pop Up Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          {/* Modal Card */}
          <div className="relative w-full max-w-lg bg-[#0f1d32] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" /> Pilih Cabang Olahraga
              </div>
              <h3 className="text-2xl font-extrabold text-white">Lihat Klasemen Grup</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Pilih salah satu dari 3 cabang olahraga di bawah untuk langsung membuka tabel klasemen & poin grup:
              </p>
            </div>

            {/* 3 Sports Options */}
            <div className="space-y-3">
              {sports.map((sport) => {
                const info = sportInfo[sport.id] || { teams: 12, groups: 2, desc: 'Klasemen grup' };

                return (
                  <Link
                    key={sport.id}
                    href={`/olahraga/${sport.id}?tab=klasemen`}
                    onClick={() => setIsOpen(false)}
                    className="group relative flex items-center justify-between p-4 rounded-xl bg-[#0a1628] border border-white/[0.06] hover:border-red-500/40 hover:bg-[#12223b] transition-all hover:scale-[1.02] shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{sport.icon}</span>
                      <div>
                        <div className="font-bold text-white text-base group-hover:text-red-400 transition-colors flex items-center gap-2">
                          {sport.name}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {info.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white shadow-md"
                        style={{ backgroundColor: sport.color }}
                      >
                        {info.groups} Grup
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="text-center pt-2 border-t border-white/[0.04] text-[11px] text-slate-500">
              Klasemen dihitung secara otomatis berdasarkan hasil pertandingan.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
