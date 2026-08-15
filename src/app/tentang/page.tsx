import { Trophy, Users, HeartHandshake, Flame, MapPin, Calendar } from 'lucide-react';
import { getEvent } from '@/lib/data';

export default function TentangPage() {
  const event = getEvent();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3 h-3" />
          Semarak Kemerdekaan
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white">Tentang Pesta Rakyat</h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {event.description}
        </p>
        <p className="text-sm font-bold italic tracking-wide">
          <span className="text-cyan-400">Berkarya</span>
          <span className="text-slate-500">, </span>
          <span className="text-red-400">Berbagi</span>
          <span className="text-slate-500">, </span>
          <span className="text-amber-400">Menginspirasi</span>
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-6 space-y-3 hover:border-cyan-500/20 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">3 Cabang Olahraga</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Volly Putra, Volly Putri, dan Sepak Bola Mini. Fase grup + bagan knockout untuk memperebutkan piala dan hadiah.
          </p>
        </div>

        <div className="bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-6 space-y-3 hover:border-red-500/20 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Antar Dusun & Pemuda</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Diikuti oleh tim-tim perwakilan dusun dan pemuda Bala Batu serta sekitarnya untuk mempererat tali silaturahmi.
          </p>
        </div>

        <div className="bg-[#0f1d32] border border-white/[0.06] rounded-2xl p-6 space-y-3 hover:border-amber-500/20 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">KKN IAIN Parepare</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Diselenggarakan oleh mahasiswa KKN IAIN Parepare Posko 03 Angkatan 37 berkolaborasi dengan Pemuda Balabatu.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-[#0f1d32] via-[#0d1a2e] to-[#0f1d32] border border-red-500/20 rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-bold text-white">Detail Pelaksanaan</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="flex items-center gap-3 bg-[#0a1628] p-4 rounded-xl border border-white/[0.04]">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs text-slate-400">Waktu Pelaksanaan</div>
              <div className="font-bold text-white">14 – 25 Agustus 2026</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0a1628] p-4 rounded-xl border border-white/[0.04]">
            <MapPin className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-xs text-slate-400">Lokasi Pertandingan</div>
              <div className="font-bold text-white">Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
