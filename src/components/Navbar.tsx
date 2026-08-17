'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Flame, Sun, Moon } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/jadwal', label: 'Jadwal' },
  { href: '/hasil', label: 'Hasil' },
  { href: '/bagan', label: 'Bagan' },
  { href: '/tentang', label: 'Tentang' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  const applyTheme = (t: 'dark' | 'light') => {
    setTheme(t);
    if (t === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  useEffect(() => {
    setMounted(true);
    // 1. Check if user manually saved a preference in localStorage
    const savedTheme = localStorage.getItem('pr_theme') as 'dark' | 'light' | null;

    let initialTheme: 'dark' | 'light' = 'dark';
    if (savedTheme === 'dark' || savedTheme === 'light') {
      initialTheme = savedTheme;
    } else {
      // 2. Otherwise automatically follow user's active device theme (prefers-color-scheme)
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }

    applyTheme(initialTheme);

    // 3. Listen to live system theme mode changes if user hasn't explicitly locked a preference
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleDeviceThemeChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('pr_theme')) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleDeviceThemeChange);
      return () => mediaQuery.removeEventListener('change', handleDeviceThemeChange);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('pr_theme', nextTheme);
    applyTheme(nextTheme);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 light:bg-white/95 backdrop-blur-xl border-b border-white/[0.06] light:border-slate-200 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <span className="font-extrabold text-white light:text-slate-900 text-lg leading-tight hidden sm:block">
              Pesta Rakyat
              <span className="block text-[10px] font-bold text-red-400 light:text-red-600 tracking-wider uppercase">
                KKN IAIN Parepare
              </span>
            </span>
          </Link>

          {/* Desktop Nav & Theme Toggle */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-red-600 !text-white shadow-lg shadow-red-600/25 font-bold'
                    : 'text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-950 hover:bg-white/[0.06] light:hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
                aria-label="Toggle Theme"
                className="ml-3 p-2.5 rounded-xl bg-[#0f1d32] light:bg-slate-100 border border-white/10 light:border-slate-300 hover:border-red-500/30 text-amber-400 transition-all hover:scale-105 flex items-center justify-center shadow-md"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme Mobile"
                className="p-2 rounded-lg bg-[#0f1d32] light:bg-slate-100 border border-white/10 light:border-slate-300 text-amber-400"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="p-2 rounded-lg text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-slate-100"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0a1628]/98 light:bg-white/98 backdrop-blur-xl border-t border-white/[0.06] light:border-slate-200 px-4 py-4 flex flex-col gap-1.5 shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive(item.href)
                  ? 'bg-red-600 !text-white shadow-md shadow-red-600/30 font-extrabold'
                  : 'text-slate-300 light:text-slate-800 hover:text-white light:hover:text-slate-950 hover:bg-white/10 light:hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
