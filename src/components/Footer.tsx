import Link from 'next/link';
import { Flame, MapPin, Calendar, AtSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#060e1c] border-t border-white/[0.06] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/20">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-white text-lg">Pesta Rakyat</div>
                <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider">KKN IAIN Parepare</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Turnamen olahraga antar dusun & pemuda dalam rangka Pesta Rakyat oleh KKN IAIN Parepare Posko 03 Angkatan 37 × Pemuda Balabatu.
            </p>
            <p className="text-sm font-bold italic">
              <span className="text-cyan-400">Berkarya</span>
              <span className="text-slate-500">, </span>
              <span className="text-red-400">Berbagi</span>
              <span className="text-slate-500">, </span>
              <span className="text-amber-400">Menginspirasi</span>
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/jadwal', label: 'Jadwal Pertandingan' },
                { href: '/hasil', label: 'Hasil Pertandingan' },
                { href: '/bagan', label: 'Bagan Turnamen' },
                { href: '/tentang', label: 'Tentang Kegiatan' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-red-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Informasi</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span>Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                14 – 25 Agustus 2026
              </li>
              <li className="flex items-start gap-2.5">
                <AtSign className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                @kkniain_parepare
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-10 pt-6 text-center text-slate-500 text-xs">
          © 2026 Pesta Rakyat. Dibuat oleh Muh Ashif
        </div>
      </div>
    </footer>
  );
}
