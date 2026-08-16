'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function WitaLiveClock() {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    function updateClock() {
      const now = new Date();

      // Format WITA time (UTC+8 / Asia/Makassar)
      const optionsTime: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };

      const optionsDate: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Makassar',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };

      const timeFormatted = new Intl.DateTimeFormat('id-ID', optionsTime).format(now);
      const dateFormatted = new Intl.DateTimeFormat('id-ID', optionsDate).format(now);

      setTimeStr(timeFormatted.replace(/\./g, ':'));
      setDateStr(dateFormatted);
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeStr) return null;

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#0f1d32]/95 border border-cyan-500/40 dark:border-cyan-500/30 shadow-xl shadow-cyan-500/10 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
        <Clock className="w-4 h-4 animate-spin-slow" />
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          WAKTU BALABATU
        </span>
      </div>

      <div className="h-4 w-px bg-slate-300 dark:bg-white/10 hidden sm:block" />

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{dateStr}</span>
        <span className="text-sm font-extrabold text-cyan-700 dark:text-cyan-400 tracking-wider font-mono bg-cyan-500/15 dark:bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/30 dark:border-cyan-500/20 shadow-sm">
          {timeStr} <span className="text-[10px] text-cyan-800 dark:text-cyan-300 font-sans font-bold">WITA</span>
        </span>
      </div>
    </div>
  );
}
