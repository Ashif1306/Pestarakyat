import type { EventData, Match, Team, Standing } from '@/types';

// ─── Full Default Fallback Data (Ensures website is NEVER empty) ──────────────
export const DEFAULT_EVENT: EventData = {
  name: "Pesta Rakyat X KKN IAIN",
  tagline: "Berkarya, Berbagi, Menginspirasi",
  description: "Turnamen olahraga antar dusun & pemuda dalam rangka Pesta Rakyat yang diselenggarakan oleh mahasiswa KKN IAIN Parepare Posko 03 Angkatan 37 berkolaborasi dengan Pemuda Balabatu. Mempertemukan tim-tim terbaik dalam 3 cabang pertandingan seru.",
  startDate: "2026-08-10",
  endDate: "2026-08-25",
  location: "Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang",
  organizer: "KKN IAIN Parepare Posko 03 Angkatan 37 × Pemuda Balabatu",
  sports: [
    { id: "volly-putra", name: "Volly Putra", icon: "🏐", color: "#0ea5e9", totalTeams: 12, totalGroups: 4 },
    { id: "volly-putri", name: "Volly Putri", icon: "🏐", color: "#e11d48", totalTeams: 12, totalGroups: 4 },
    { id: "sepak-bola-mini", name: "Sepak Bola Mini", icon: "⚽", color: "#16a34a", totalTeams: 12, totalGroups: 2 }
  ]
};

export const DEFAULT_TEAMS: Record<string, Team[]> = {
  "volly-putra": [
    { id: "vp-1", name: "Pemula Squad", group: "A" },
    { id: "vp-2", name: "PBV Uluway", group: "A" },
    { id: "vp-3", name: "PBV Liba", group: "A" },
    { id: "vp-4", name: "PBV Siduruk", group: "B" },
    { id: "vp-5", name: "Le'To Bara", group: "B" },
    { id: "vp-6", name: "PBV Masbro", group: "B" },
    { id: "vp-7", name: "PBV Bunga Duri", group: "C" },
    { id: "vp-8", name: "PBV Lamba", group: "C" },
    { id: "vp-9", name: "PBV Bala Batu B", group: "C" },
    { id: "vp-10", name: "MVC Malannying", group: "D" },
    { id: "vp-11", name: "Solleakka Group", group: "D" },
    { id: "vp-12", name: "PBV Bala Batu A", group: "D" }
  ],
  "volly-putri": [
    { id: "vpi-1", name: "Alloan Squad", group: "A" },
    { id: "vpi-2", name: "PBV Bala Batu A", group: "A" },
    { id: "vpi-3", name: "Buntu Kalosi", group: "A" },
    { id: "vpi-4", name: "MTs", group: "B" },
    { id: "vpi-5", name: "Rante Limbong", group: "B" },
    { id: "vpi-6", name: "Siduruk Tim", group: "B" },
    { id: "vpi-7", name: "Buntu Ampalla", group: "C" },
    { id: "vpi-8", name: "PBV Maliba", group: "C" },
    { id: "vpi-9", name: "Garuda Muda", group: "C" },
    { id: "vpi-10", name: "Maliba Simpang", group: "D" },
    { id: "vpi-11", name: "SMPN 6 Alla", group: "D" },
    { id: "vpi-12", name: "PBV Bala Batu B", group: "D" }
  ],
  "sepak-bola-mini": [
    { id: "sbm-1", name: "BUNTU BARANA A", group: "A" },
    { id: "sbm-2", name: "SDN 130 RANTELIMBONG", group: "A" },
    { id: "sbm-3", name: "MIS MINANGA B", group: "A" },
    { id: "sbm-4", name: "SD ULUWAI JUNIOR", group: "A" },
    { id: "sbm-5", name: "MALIBA", group: "A" },
    { id: "sbm-6", name: "BALABATU A", group: "A" },
    { id: "sbm-7", name: "BUNTU BARANA B", group: "B" },
    { id: "sbm-8", name: "13 CURIO", group: "B" },
    { id: "sbm-9", name: "MIS MINANGA A", group: "B" },
    { id: "sbm-10", name: "MALANYING JUNIOR", group: "B" },
    { id: "sbm-11", name: "BALABATU B", group: "B" },
    { id: "sbm-12", name: "168 SUMBANG", group: "B" }
  ]
};

export const DEFAULT_MATCHES: Match[] = [
  { id: "sbm-1", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "BUNTU BARANA A", teamB: "SDN 130 RANTELIMBONG", date: "2026-08-10", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "BUNTU BARANA A" },
  { id: "sbm-2", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "BUNTU BARANA B", teamB: "13 CURIO", date: "2026-08-10", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 0, scoreB: 0, winner: null },
  { id: "sbm-3", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "BALABATU A", teamB: "SD ULUWAI JUNIOR", date: "2026-08-10", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 3, scoreB: 0, winner: "BALABATU A" },
  { id: "sbm-4", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "MIS MINANGA B", teamB: "MALIBA", date: "2026-08-11", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 1, scoreB: 2, winner: "MALIBA" },
  { id: "sbm-5", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "MIS MINANGA A", teamB: "MALANYING JUNIOR", date: "2026-08-11", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 2, scoreB: 2, winner: null },
  { id: "sbm-6", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "BALABATU B", teamB: "168 SUMBANG", date: "2026-08-11", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 1, scoreB: 0, winner: "BALABATU B" },
  { id: "sbm-7", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "BUNTU BARANA A", teamB: "MIS MINANGA B", date: "2026-08-12", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 4, scoreB: 1, winner: "BUNTU BARANA A" },
  { id: "sbm-8", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "BUNTU BARANA B", teamB: "MIS MINANGA A", date: "2026-08-12", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 1, scoreB: 3, winner: "MIS MINANGA A" },
  { id: "sbm-9", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "BALABATU A", teamB: "SDN 130 RANTELIMBONG", date: "2026-08-12", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 2, scoreB: 0, winner: "BALABATU A" },
  { id: "sbm-10", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "SD ULUWAI JUNIOR", teamB: "MALIBA", date: "2026-08-13", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 0, scoreB: 1, winner: "MALIBA" },
  { id: "sbm-11", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "BALABATU B", teamB: "13 CURIO", date: "2026-08-13", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "BALABATU B" },
  { id: "sbm-12", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "168 SUMBANG", teamB: "MALANYING JUNIOR", date: "2026-08-13", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 0, scoreB: 3, winner: "MALANYING JUNIOR" },
  { id: "sbm-13", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "SD ULUWAI JUNIOR", teamB: "BUNTU BARANA A", date: "2026-08-14", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 1, scoreB: 3, winner: "BUNTU BARANA A" },
  { id: "sbm-14", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "168 SUMBANG", teamB: "BUNTU BARANA B", date: "2026-08-14", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "168 SUMBANG" },
  { id: "sbm-15", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "BALABATU A", teamB: "MALIBA", date: "2026-08-14", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "finished", scoreA: 2, scoreB: 2, winner: null },
  { id: "sbm-16", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "SDN 130 RANTELIMBONG", teamB: "MIS MINANGA B", date: "2026-08-15", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-17", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "13 CURIO", teamB: "MIS MINANGA A", date: "2026-08-15", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-18", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "BALABATU B", teamB: "MALANYING JUNIOR", date: "2026-08-15", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-19", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "MALIBA", teamB: "BUNTU BARANA A", date: "2026-08-18", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-20", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "MALANYING JUNIOR", teamB: "BUNTU BARANA B", date: "2026-08-18", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-21", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "SDN 130 RANTELIMBONG", teamB: "SD ULUWAI JUNIOR", date: "2026-08-18", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-22", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "BALABATU A", teamB: "MIS MINANGA B", date: "2026-08-19", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-23", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "BALABATU B", teamB: "MIS MINANGA A", date: "2026-08-19", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-24", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "13 CURIO", teamB: "168 SUMBANG", date: "2026-08-19", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-25", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "BALABATU A", teamB: "BUNTU BARANA A", date: "2026-08-20", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-26", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "BALABATU B", teamB: "BUNTU BARANA B", date: "2026-08-20", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-27", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "MIS MINANGA B", teamB: "SD ULUWAI JUNIOR", date: "2026-08-20", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-28", sport: "sepak-bola-mini", phase: "group", group: "A", round: "Fase Grup A", teamA: "MALIBA", teamB: "SDN 130 RANTELIMBONG", date: "2026-08-21", time: "15:20", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-29", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "MALANYING JUNIOR", teamB: "13 CURIO", date: "2026-08-21", time: "15:45", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-30", sport: "sepak-bola-mini", phase: "group", group: "B", round: "Fase Grup B", teamA: "MIS MINANGA A", teamB: "168 SUMBANG", date: "2026-08-21", time: "16:10", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-sf1", sport: "sepak-bola-mini", phase: "knockout", round: "Semi Final", teamA: "Juara Grup A", teamB: "Runner-up Grup B", date: "2026-08-22", time: "15:30", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-sf2", sport: "sepak-bola-mini", phase: "knockout", round: "Semi Final", teamA: "Juara Grup B", teamB: "Runner-up Grup A", date: "2026-08-22", time: "16:15", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "sbm-f", sport: "sepak-bola-mini", phase: "knockout", round: "Final", teamA: "Pemenang SF 1", teamB: "Pemenang SF 2", date: "2026-08-24", time: "16:00", venue: "Lapangan Mini Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-1", sport: "volly-putra", phase: "group", group: "A", round: "Fase Grup A", teamA: "Pemula Squad", teamB: "PBV Uluway", date: "2026-08-10", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 0, winner: "Pemula Squad" },
  { id: "vp-2", sport: "volly-putra", phase: "group", group: "B", round: "Fase Grup B", teamA: "PBV Siduruk", teamB: "Le'To Bara", date: "2026-08-10", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 1, scoreB: 2, winner: "Le'To Bara" },
  { id: "vp-3", sport: "volly-putra", phase: "group", group: "C", round: "Fase Grup C", teamA: "PBV Bunga Duri", teamB: "PBV Lamba", date: "2026-08-11", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 0, winner: "PBV Bunga Duri" },
  { id: "vp-4", sport: "volly-putra", phase: "group", group: "D", round: "Fase Grup D", teamA: "MVC Malannying", teamB: "Solleakka Group", date: "2026-08-11", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "MVC Malannying" },
  { id: "vp-5", sport: "volly-putra", phase: "group", group: "B", round: "Fase Grup B", teamA: "Le'To Bara", teamB: "PBV Masbro", date: "2026-08-12", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "Le'To Bara" },
  { id: "vp-6", sport: "volly-putra", phase: "group", group: "D", round: "Fase Grup D", teamA: "Solleakka Group", teamB: "PBV Bala Batu A", date: "2026-08-12", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 1, scoreB: 2, winner: "PBV Bala Batu A" },
  { id: "vp-7", sport: "volly-putra", phase: "group", group: "C", round: "Fase Grup C", teamA: "PBV Lamba", teamB: "PBV Bala Batu B", date: "2026-08-13", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 0, scoreB: 2, winner: "PBV Bala Batu B" },
  { id: "vp-8", sport: "volly-putra", phase: "group", group: "A", round: "Fase Grup A", teamA: "PBV Liba", teamB: "PBV Uluway", date: "2026-08-13", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 0, winner: "PBV Liba" },
  { id: "vp-9", sport: "volly-putra", phase: "group", group: "A", round: "Fase Grup A", teamA: "Pemula Squad", teamB: "PBV Liba", date: "2026-08-14", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "Pemula Squad" },
  { id: "vp-10", sport: "volly-putra", phase: "group", group: "B", round: "Fase Grup B", teamA: "PBV Siduruk", teamB: "PBV Masbro", date: "2026-08-14", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 0, winner: "PBV Siduruk" },
  { id: "vp-11", sport: "volly-putra", phase: "group", group: "C", round: "Fase Grup C", teamA: "PBV Bunga Duri", teamB: "PBV Bala Batu B", date: "2026-08-15", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-12", sport: "volly-putra", phase: "group", group: "D", round: "Fase Grup D", teamA: "MVC Malannying", teamB: "PBV Bala Batu A", date: "2026-08-15", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-qf1", sport: "volly-putra", phase: "knockout", round: "Perempat Final", teamA: "Juara Grup A", teamB: "Runner-up Grup B", date: "2026-08-20", time: "15:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-qf2", sport: "volly-putra", phase: "knockout", round: "Perempat Final", teamA: "Juara Grup C", teamB: "Runner-up Grup D", date: "2026-08-20", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-qf3", sport: "volly-putra", phase: "knockout", round: "Perempat Final", teamA: "Juara Grup B", teamB: "Runner-up Grup C", date: "2026-08-21", time: "15:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-qf4", sport: "volly-putra", phase: "knockout", round: "Perempat Final", teamA: "Juara Grup D", teamB: "Runner-up Grup A", date: "2026-08-21", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-sf1", sport: "volly-putra", phase: "knockout", round: "Semi Final", teamA: "Pemenang QF 1", teamB: "Pemenang QF 2", date: "2026-08-23", time: "15:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-sf2", sport: "volly-putra", phase: "knockout", round: "Semi Final", teamA: "Pemenang QF 3", teamB: "Pemenang QF 4", date: "2026-08-23", time: "16:30", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vp-f", sport: "volly-putra", phase: "knockout", round: "Final", teamA: "Pemenang SF 1", teamB: "Pemenang SF 2", date: "2026-08-25", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-1", sport: "volly-putri", phase: "group", group: "A", round: "Fase Grup A", teamA: "Alloan Squad", teamB: "PBV Bala Batu A", date: "2026-08-10", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 1, scoreB: 2, winner: "PBV Bala Batu A" },
  { id: "vpi-2", sport: "volly-putri", phase: "group", group: "B", round: "Fase Grup B", teamA: "MTs", teamB: "Rante Limbong", date: "2026-08-10", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 0, winner: "MTs" },
  { id: "vpi-3", sport: "volly-putri", phase: "group", group: "B", round: "Fase Grup B", teamA: "Rante Limbong", teamB: "Siduruk Tim", date: "2026-08-11", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 1, scoreB: 2, winner: "Siduruk Tim" },
  { id: "vpi-4", sport: "volly-putri", phase: "group", group: "A", round: "Fase Grup A", teamA: "Buntu Kalosi", teamB: "PBV Bala Batu A", date: "2026-08-11", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 0, scoreB: 2, winner: "PBV Bala Batu A" },
  { id: "vpi-5", sport: "volly-putri", phase: "group", group: "A", round: "Fase Grup A", teamA: "Alloan Squad", teamB: "Buntu Kalosi", date: "2026-08-12", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "Alloan Squad" },
  { id: "vpi-6", sport: "volly-putri", phase: "group", group: "B", round: "Fase Grup B", teamA: "MTs", teamB: "Siduruk Tim", date: "2026-08-12", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "MTs" },
  { id: "vpi-7", sport: "volly-putri", phase: "group", group: "C", round: "Fase Grup C", teamA: "Buntu Ampalla", teamB: "PBV Maliba", date: "2026-08-13", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 0, scoreB: 2, winner: "PBV Maliba" },
  { id: "vpi-8", sport: "volly-putri", phase: "group", group: "D", round: "Fase Grup D", teamA: "Maliba Simpang", teamB: "SMPN 6 Alla", date: "2026-08-13", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 1, scoreB: 2, winner: "SMPN 6 Alla" },
  { id: "vpi-9", sport: "volly-putri", phase: "group", group: "D", round: "Fase Grup D", teamA: "SMPN 6 Alla", teamB: "PBV Bala Batu B", date: "2026-08-14", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "SMPN 6 Alla" },
  { id: "vpi-10", sport: "volly-putri", phase: "group", group: "C", round: "Fase Grup C", teamA: "Buntu Ampalla", teamB: "Garuda Muda", date: "2026-08-14", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "finished", scoreA: 2, scoreB: 1, winner: "Buntu Ampalla" },
  { id: "vpi-11", sport: "volly-putri", phase: "group", group: "C", round: "Fase Grup C", teamA: "Garuda Muda", teamB: "PBV Maliba", date: "2026-08-15", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-12", sport: "volly-putri", phase: "group", group: "D", round: "Fase Grup D", teamA: "PBV Bala Batu B", teamB: "Maliba Simpang", date: "2026-08-15", time: "17:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-qf1", sport: "volly-putri", phase: "knockout", round: "Perempat Final", teamA: "Juara Grup A", teamB: "Runner-up Grup B", date: "2026-08-20", time: "15:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-qf2", sport: "volly-putri", phase: "knockout", round: "Perempat Final", teamA: "Juara Grup C", teamB: "Runner-up Grup D", date: "2026-08-20", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-qf3", sport: "volly-putri", phase: "knockout", round: "Perempat Final", teamA: "Juara Grup B", teamB: "Runner-up Grup C", date: "2026-08-21", time: "15:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-qf4", sport: "volly-putri", phase: "knockout", round: "Perempat Final", teamA: "Juara Grup D", teamB: "Runner-up Grup A", date: "2026-08-21", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-sf1", sport: "volly-putri", phase: "knockout", round: "Semi Final", teamA: "Pemenang QF 1", teamB: "Pemenang QF 2", date: "2026-08-23", time: "15:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-sf2", sport: "volly-putri", phase: "knockout", round: "Semi Final", teamA: "Pemenang QF 3", teamB: "Pemenang QF 4", date: "2026-08-23", time: "16:30", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null },
  { id: "vpi-f", sport: "volly-putri", phase: "knockout", round: "Final", teamA: "Pemenang SF 1", teamB: "Pemenang SF 2", date: "2026-08-25", time: "16:00", venue: "Lapangan Utama Bala Batu", status: "scheduled", scoreA: null, scoreB: null, winner: null }
];

// ─── In-memory runtime cache ────────────────────────────────────────────────
let runtimeMatchesCache: Match[] | null = null;
let runtimeTeamsCache: Record<string, Team[]> | null = null;
let runtimeEventCache: EventData | null = null;

export function getEvent(): EventData {
  if (runtimeEventCache) return runtimeEventCache;
  return DEFAULT_EVENT;
}

export function setRuntimeEvent(ev: EventData) {
  runtimeEventCache = ev;
}

export function getMatches(): Match[] {
  if (runtimeMatchesCache && runtimeMatchesCache.length > 0) return runtimeMatchesCache;
  return DEFAULT_MATCHES;
}

export function setRuntimeMatches(matches: Match[]) {
  runtimeMatchesCache = matches;
}

export function getTeams(sport: string): Team[] {
  if (runtimeTeamsCache && runtimeTeamsCache[sport]) return runtimeTeamsCache[sport];
  return DEFAULT_TEAMS[sport] || [];
}

export function setRuntimeTeams(sport: string, teams: Team[]) {
  if (!runtimeTeamsCache) runtimeTeamsCache = {};
  runtimeTeamsCache[sport] = teams;
}

// ─── Async fetchers (API / Neon Postgres) ───────────────────────────────────

export async function fetchServerEvent(): Promise<EventData> {
  if (typeof window === 'undefined') return DEFAULT_EVENT;
  try {
    const res = await fetch('/api/event?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) {
        setRuntimeEvent(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('fetchServerEvent failed:', err);
  }
  return DEFAULT_EVENT;
}

export async function fetchServerMatches(): Promise<Match[]> {
  if (typeof window === 'undefined') return getMatches();
  try {
    const res = await fetch('/api/matches?t=' + Date.now(), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
        setRuntimeMatches(data.matches);
        return data.matches;
      }
    }
  } catch (err) {
    console.warn('fetchServerMatches failed:', err);
  }
  return getMatches();
}

export async function fetchServerTeams(sport: string): Promise<Team[]> {
  if (typeof window === 'undefined') return getTeams(sport);
  try {
    const res = await fetch(`/api/teams?sport=${sport}&t=` + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.teams && Array.isArray(data.teams) && data.teams.length > 0) {
        setRuntimeTeams(sport, data.teams);
        return data.teams;
      }
    }
  } catch (err) {
    console.warn('fetchServerTeams failed:', err);
  }
  return getTeams(sport);
}

export function saveMatches(matches: Match[]) {
  setRuntimeMatches(matches);
  if (typeof window !== 'undefined') {
    fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matches }),
    }).catch((err) => console.error('Save failed:', err));
  }
}

// ─── Utility filters ─────────────────────────────────────────────────────────

export function getMatchesBySport(sport: string): Match[] {
  return getMatches().filter((m) => m.sport === sport);
}

export function getGroupMatches(sport: string): Match[] {
  return getMatches().filter((m) => m.sport === sport && m.phase === 'group');
}

export function getKnockoutMatches(sport: string): Match[] {
  return getMatches().filter((m) => m.sport === sport && m.phase === 'knockout');
}

export function getFinishedMatches(): Match[] {
  return getMatches().filter((m) => m.status === 'finished');
}

export function getFinishedMatchesBySport(sport: string): Match[] {
  return getMatches().filter((m) => m.sport === sport && m.status === 'finished');
}

export function getTodayMatches(targetDate?: string): Match[] {
  const dateStr = targetDate || '2026-08-15';
  const matches = getMatches();
  const todayList = matches.filter((m) => m.date === dateStr);
  if (todayList.length === 0) {
    const live = matches.filter((m) => m.status === 'live');
    if (live.length > 0) return live;
    return matches.filter((m) => m.status === 'scheduled').slice(0, 4);
  }
  return todayList;
}

export function getStandings(sport: string): Record<string, Standing[]> {
  const teams = getTeams(sport);
  const matches = getMatchesBySport(sport);
  const isBallSport = sport === 'sepak-bola-mini';

  const standingsMap: Record<string, Record<string, Standing>> = {};

  teams.forEach((t) => {
    const groupName = t.group || 'A';
    if (!standingsMap[groupName]) standingsMap[groupName] = {};
    standingsMap[groupName][t.name] = {
      name: t.name, played: 0, won: 0, lost: 0, draw: 0,
      goalsFor: 0, goalsAgainst: 0, setsFor: 0, setsAgainst: 0, points: 0,
    };
  });

  matches.forEach((m) => {
    if (m.phase !== 'group') return;
    if (m.scoreA === null || m.scoreB === null) return;
    if (m.status !== 'finished' && m.status !== 'live') return;

    const groupName = m.group || 'A';
    if (!standingsMap[groupName]) return;

    const teamA = standingsMap[groupName][m.teamA];
    const teamB = standingsMap[groupName][m.teamB];
    if (!teamA || !teamB) return;

    teamA.played += 1;
    teamB.played += 1;

    if (isBallSport) {
      teamA.goalsFor = (teamA.goalsFor || 0) + m.scoreA;
      teamA.goalsAgainst = (teamA.goalsAgainst || 0) + m.scoreB;
      teamB.goalsFor = (teamB.goalsFor || 0) + m.scoreB;
      teamB.goalsAgainst = (teamB.goalsAgainst || 0) + m.scoreA;
      if (m.scoreA > m.scoreB) { teamA.won += 1; teamA.points += 3; teamB.lost += 1; }
      else if (m.scoreB > m.scoreA) { teamB.won += 1; teamB.points += 3; teamA.lost += 1; }
      else { teamA.draw = (teamA.draw || 0) + 1; teamB.draw = (teamB.draw || 0) + 1; teamA.points += 1; teamB.points += 1; }
    } else {
      teamA.setsFor = (teamA.setsFor || 0) + m.scoreA;
      teamA.setsAgainst = (teamA.setsAgainst || 0) + m.scoreB;
      teamB.setsFor = (teamB.setsFor || 0) + m.scoreB;
      teamB.setsAgainst = (teamB.setsAgainst || 0) + m.scoreA;
      if (m.scoreA > m.scoreB) {
        teamA.won += 1; teamB.lost += 1;
        teamA.points += m.scoreB === 0 ? 3 : 2;
      } else if (m.scoreB > m.scoreA) {
        teamB.won += 1; teamA.lost += 1;
        teamB.points += m.scoreA === 0 ? 3 : 2;
      }
    }
  });

  const result: Record<string, Standing[]> = {};
  Object.keys(standingsMap).sort().forEach((groupName) => {
    const list = Object.values(standingsMap[groupName]);
    list.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = isBallSport ? (a.goalsFor || 0) - (a.goalsAgainst || 0) : (a.setsFor || 0) - (a.setsAgainst || 0);
      const diffB = isBallSport ? (b.goalsFor || 0) - (b.goalsAgainst || 0) : (b.setsFor || 0) - (b.setsAgainst || 0);
      if (diffB !== diffA) return diffB - diffA;
      return b.won - a.won;
    });
    result[groupName] = list;
  });

  return result;
}
