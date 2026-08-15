import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Sport } from '@/types';

export default function SportCards({ sports }: { sports: Sport[] }) {
  const sportMeta: Record<string, { teams: number; groups: number; description: string }> = {
    'volly-putra': { teams: 12, groups: 4, description: 'Turnamen Volly Putra antar dusun & pemuda. 4 Grup (12 Tim) + Fase Knockout.' },
    'volly-putri': { teams: 12, groups: 4, description: 'Turnamen Volly Putri antar dusun & sekolah. 4 Grup (12 Tim) + Fase Knockout.' },
    'sepak-bola-mini': { teams: 12, groups: 2, description: 'Turnamen Sepak Bola Mini. 2 Grup masing-masing 6 Tim (12 Tim) + Knockout.' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sports.map((sport) => {
        const meta = sportMeta[sport.id] || { teams: 12, groups: 2, description: 'Pertandingan olahraga antar dusun.' };

        return (
          <Link
            key={sport.id}
            href={`/olahraga/${sport.id}`}
            className="group relative bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-7 hover:border-red-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-red-500/10 overflow-hidden block"
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(to right, ${sport.color}, transparent)` }}
            />

            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-10 pointer-events-none group-hover:opacity-25 transition-opacity duration-500"
              style={{ backgroundColor: sport.color }}
            />

            {/* Red-white flag element */}
            <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <div className="w-full h-1/2 bg-red-600" />
              <div className="w-full h-1/2 bg-white" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300 inline-block">{sport.icon}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg"
                    style={{ backgroundColor: sport.color, boxShadow: `0 4px 14px ${sport.color}30` }}
                  >
                    {meta.groups} Grup
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-800 border border-white/10">
                    {meta.teams} Tim
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                {sport.name}
              </h3>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {meta.description}
              </p>

              <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300 text-sm font-bold transition-colors">
                Lihat Jadwal & Klasemen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
