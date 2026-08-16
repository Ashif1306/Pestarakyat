'use client';

import { useEffect, useState } from 'react';
import { Sparkles, X, ArrowDown } from 'lucide-react';

export default function WelcomeToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 1. Show toast after 3 seconds delay
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    // 2. Hide toast when user scrolls down (e.g. scrollY > 40px)
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setVisible(false);
      }
    };

    // 3. Auto dismiss toast after 8 seconds of showing (11 seconds total)
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 11000);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md animate-bounce-short no-print transition-all">
      <div className="bg-white/95 dark:bg-[#0f1d32]/95 backdrop-blur-xl border-2 border-cyan-500/60 dark:border-cyan-500/50 rounded-2xl p-4 shadow-2xl shadow-cyan-500/20 text-slate-900 dark:text-white flex items-start gap-3 relative overflow-hidden transition-colors">
        {/* Top glowing accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-amber-400 to-red-500" />

        {/* Animated Icon */}
        <div className="w-9 h-9 rounded-xl bg-cyan-500/15 dark:bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1 pr-6 space-y-1">
          <div className="text-xs font-extrabold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <span>Petunjuk Akses Info</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-bounce" />
          </div>

          {/* Desktop Text */}
          <p className="hidden sm:block text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            Silakan <strong className="text-amber-700 dark:text-amber-400 font-extrabold">scroll ke bawah 📜</strong> untuk mengakses informasi jadwal, hasil pertandingan & klasemen.
          </p>

          {/* Mobile Text */}
          <p className="block sm:hidden text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            Silakan <strong className="text-amber-700 dark:text-amber-400 font-extrabold">scroll ke bawah 📜</strong> atau tap <strong className="text-cyan-700 dark:text-cyan-400 font-extrabold">menu ☰ (garis tiga)</strong> navigasi di atas untuk mengakses informasi.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors absolute top-3 right-3"
          title="Tutup pemberitahuan"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
