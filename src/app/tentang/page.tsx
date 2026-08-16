import type { Metadata } from 'next';
import { Trophy, Users, HeartHandshake, Flame, MapPin, Calendar } from 'lucide-react';
import { getEvent } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Tentang Pesta Rakyat X KKN IAIN Parepare',
  description:
    'Informasi lengkap turnamen Pesta Rakyat X KKN IAIN Parepare 2026 di Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang. Penyelenggara Posko KKN IAIN Parepare.',
  openGraph: {
    title: 'Tentang Pesta Rakyat X KKN IAIN Parepare',
    description:
      'Informasi lengkap turnamen Pesta Rakyat X KKN IAIN Parepare di Dusun Bala Batu, Kab. Enrekang.',
    url: 'https://pestarakyat.vercel.app/tentang',
  },
};

export default function TentangPage() {
  const event = getEvent();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5" />
          Semarak Kemerdekaan
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white">Tentang Pesta Rakyat</h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {event.description}
        </p>
        <p className="text-sm font-bold italic tracking-wide">
          <span className="text-cyan-400">Berkarya</span>
          <span className="text-slate-400 mx-2">•</span>
          <span className="text-red-400">Berdaya</span>
          <span className="text-slate-400 mx-2">•</span>
          <span className="text-amber-400">Berbudaya</span>
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Turnamen Olahraga</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Menyelenggarakan 3 cabang olahraga unggulan: Volly Putra, Volly Putri, dan Sepak Bola Mini dengan total puluhan tim dari berbagai dusun.
          </p>
        </div>

        <div className="bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">KKN IAIN Parepare</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Diselenggarakan oleh mahasiswa KKN IAIN Parepare Angkatan X Posko Dusun Bala Batu sebagai sarana mempererat silaturahmi & kebersamaan warga.
          </p>
        </div>

        <div className="bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Semangat Sportivitas</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mengedepankan nilai-nilai kejujuran, kebersamaan, dan rasa persaudaraan antar warga masyarakat dan peserta turnamen.
          </p>
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-white/[0.06] pb-4">
          Detail Pelaksanaan Event
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Waktu Pelaksanaan</span>
              <span className="text-white font-medium">14 – 25 Agustus 2026</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Lokasi Utama</span>
              <span className="text-white font-medium">Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
