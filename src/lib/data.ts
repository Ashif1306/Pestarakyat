import type { EventData, Match, Standing, Team } from '@/types';

export const DEFAULT_EVENT: EventData = {
  name: "Pesta Rakyat X KKN IAIN Parepare",
  tagline: "Turnamen Olahraga Antar Dusun & Desa Buntu Barana",
  startDate: "2026-08-14",
  endDate: "2026-08-25",
  location: "Dusun Bala Batu, Desa Buntu Barana, Kec. Curio, Kab. Enrekang",
  organizer: "KKN IAIN Parepare Posko 03 Angkatan 37 Dusun Bala Batu",
  description: "PANITIA PELAKSANA PESTA RAKYAT KKN IAIN PAREPARE POSKO 03 ANGKATAN 37 DESA BUNTU BARANA KOLABORASI PEMUDA BALABATU",
  sports: [
    { id: "volly-putra", name: "Volly Putra", icon: "🏐", color: "#0ea5e9", totalTeams: 12, totalGroups: 4 },
    { id: "volly-putri", name: "Volly Putri", icon: "🏐", color: "#e11d48", totalTeams: 12, totalGroups: 4 },
    { id: "sepak-bola-mini", name: "Sepak Bola Mini", icon: "⚽", color: "#16a34a", totalTeams: 12, totalGroups: 2 }
  ]
};

export const DEFAULT_TEAMS: Record<string, Team[]> = {
  "volly-putra": [
    { id: "vp-t1", name: "Pemula Squad", group: "A" },
    { id: "vp-t2", name: "PBV Uluway", group: "A" },
    { id: "vp-t3", name: "PBV Liba", group: "A" },
    { id: "vp-t4", name: "PBV Siduruk", group: "B" },
    { id: "vp-t5", name: "Le'To Bara", group: "B" },
    { id: "vp-t6", name: "PBV Masbro", group: "B" },
    { id: "vp-t7", name: "MVC Malannying", group: "C" },
    { id: "vp-t8", name: "PBV Bala Batu A", group: "C" },
    { id: "vp-t9", name: "Solleakka Group", group: "C" },
    { id: "vp-t10", name: "PBV Bala Batu B", group: "D" },
    { id: "vp-t11", name: "PBV Bunga Duri", group: "D" },
    { id: "vp-t12", name: "PBV Lamba", group: "D" }
  ],
  "volly-putri": [
    { id: "vpi-t1", name: "MTs", group: "A" },
    { id: "vpi-t2", name: "Rante Limbong", group: "A" },
    { id: "vpi-t3", name: "Siduruk Tim", group: "A" },
    { id: "vpi-t4", name: "SMPN 6 Alla", group: "B" },
    { id: "vpi-t5", name: "Maliba Simpang", group: "B" },
    { id: "vpi-t6", name: "PBV Bala Batu B", group: "B" },
    { id: "vpi-t7", name: "Alloan Squad", group: "C" },
    { id: "vpi-t8", name: "Buntu Kalosi", group: "C" },
    { id: "vpi-t9", name: "PBV Bala Batu A", group: "C" },
    { id: "vpi-t10", name: "Buntu Ampalla", group: "D" },
    { id: "vpi-t11", name: "Garuda Muda", group: "D" },
    { id: "vpi-t12", name: "PBV Maliba", group: "D" }
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
  {
    "id": "sbm-1",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "BUNTU BARANA A",
    "teamB": "SDN 130 RANTELIMBONG",
    "date": "2026-08-10",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 1,
    "winner": "BUNTU BARANA A"
  },
  {
    "id": "sbm-10",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "SD ULUWAI JUNIOR",
    "teamB": "MALIBA",
    "date": "2026-08-13",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 3,
    "scoreB": 0,
    "winner": "SD ULUWAI JUNIOR"
  },
  {
    "id": "sbm-11",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "BALABATU B",
    "teamB": "13 CURIO",
    "date": "2026-08-13",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 7,
    "winner": "13 CURIO"
  },
  {
    "id": "sbm-12",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "168 SUMBANG",
    "teamB": "MALANYING JUNIOR",
    "date": "2026-08-13",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 3,
    "scoreB": 0,
    "winner": "168 SUMBANG"
  },
  {
    "id": "sbm-13",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "SD ULUWAI JUNIOR",
    "teamB": "BUNTU BARANA A",
    "date": "2026-08-15",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 3,
    "winner": "BUNTU BARANA A"
  },
  {
    "id": "sbm-14",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "168 SUMBANG",
    "teamB": "BUNTU BARANA B",
    "date": "2026-08-14",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 0,
    "winner": "168 SUMBANG"
  },
  {
    "id": "sbm-15",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "BALABATU A",
    "teamB": "MALIBA",
    "date": "2026-08-14",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 1,
    "winner": null
  },
  {
    "id": "sbm-16",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "SDN 130 RANTELIMBONG",
    "teamB": "MIS MINANGA B",
    "date": "2026-08-15",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 1,
    "winner": null
  },
  {
    "id": "sbm-17",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "13 CURIO",
    "teamB": "MIS MINANGA A",
    "date": "2026-08-15",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 0,
    "winner": "13 CURIO"
  },
  {
    "id": "sbm-18",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "BALABATU B",
    "teamB": "MALANYING JUNIOR",
    "date": "2026-08-14",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 0,
    "winner": null
  },
  {
    "id": "sbm-19",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "MALIBA",
    "teamB": "BUNTU BARANA A",
    "date": "2026-08-18",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-2",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "BUNTU BARANA B",
    "teamB": "13 CURIO",
    "date": "2026-08-10",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 0,
    "winner": null
  },
  {
    "id": "sbm-20",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "MALANYING JUNIOR",
    "teamB": "BUNTU BARANA B",
    "date": "2026-08-18",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-21",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "SDN 130 RANTELIMBONG",
    "teamB": "SD ULUWAI JUNIOR",
    "date": "2026-08-18",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-22",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "BALABATU A",
    "teamB": "MIS MINANGA B",
    "date": "2026-08-19",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-23",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "BALABATU B",
    "teamB": "MIS MINANGA A",
    "date": "2026-08-19",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-24",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "13 CURIO",
    "teamB": "168 SUMBANG",
    "date": "2026-08-19",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-25",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "BALABATU A",
    "teamB": "BUNTU BARANA A",
    "date": "2026-08-20",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-26",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "BALABATU B",
    "teamB": "BUNTU BARANA B",
    "date": "2026-08-20",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-27",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "MIS MINANGA B",
    "teamB": "SD ULUWAI JUNIOR",
    "date": "2026-08-20",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-28",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "MALIBA",
    "teamB": "SDN 130 RANTELIMBONG",
    "date": "2026-08-21",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-29",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "MALANYING JUNIOR",
    "teamB": "13 CURIO",
    "date": "2026-08-21",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-3",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "BALABATU A",
    "teamB": "SD ULUWAI JUNIOR",
    "date": "2026-08-10",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 0,
    "winner": "BALABATU A"
  },
  {
    "id": "sbm-30",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "MIS MINANGA A",
    "teamB": "168 SUMBANG",
    "date": "2026-08-21",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-4",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "MIS MINANGA B",
    "teamB": "MALIBA",
    "date": "2026-08-11",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "MIS MINANGA B"
  },
  {
    "id": "sbm-5",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "MIS MINANGA A",
    "teamB": "MALANYING JUNIOR",
    "date": "2026-08-11",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 0,
    "winner": null
  },
  {
    "id": "sbm-6",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "BALABATU B",
    "teamB": "168 SUMBANG",
    "date": "2026-08-11",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 5,
    "winner": "168 SUMBANG"
  },
  {
    "id": "sbm-7",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "BUNTU BARANA A",
    "teamB": "MIS MINANGA B",
    "date": "2026-08-12",
    "time": "15:20",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 0,
    "winner": "BUNTU BARANA A"
  },
  {
    "id": "sbm-8",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "BUNTU BARANA B",
    "teamB": "MIS MINANGA A",
    "date": "2026-08-12",
    "time": "15:45",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 2,
    "winner": "MIS MINANGA A"
  },
  {
    "id": "sbm-9",
    "sport": "sepak-bola-mini",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "BALABATU A",
    "teamB": "SDN 130 RANTELIMBONG",
    "date": "2026-08-12",
    "time": "16:10",
    "venue": "Lapangan Mini Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 0,
    "winner": null
  },
  {
    "id": "sbm-f",
    "sport": "sepak-bola-mini",
    "phase": "knockout",
    "round": "Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-24",
    "time": "16:00",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-sf1",
    "sport": "sepak-bola-mini",
    "phase": "knockout",
    "round": "Semi Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-22",
    "time": "15:30",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "sbm-sf2",
    "sport": "sepak-bola-mini",
    "phase": "knockout",
    "round": "Semi Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-22",
    "time": "16:15",
    "venue": "Lapangan Mini Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vp-1",
    "sport": "volly-putra",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "Pemula Squad",
    "teamB": "PBV Uluway",
    "date": "2026-08-10",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 2,
    "winner": "PBV Uluway"
  },
  {
    "id": "vp-10",
    "sport": "volly-putra",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "PBV Siduruk",
    "teamB": "PBV Masbro",
    "date": "2026-08-14",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 2,
    "winner": "PBV Masbro"
  },
  {
    "id": "vp-11",
    "sport": "volly-putra",
    "phase": "group",
    "group": "D",
    "round": "Fase Grup D",
    "teamA": "PBV Bunga Duri",
    "teamB": "PBV Bala Batu B",
    "date": "2026-08-15",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "PBV Bunga Duri"
  },
  {
    "id": "vp-12",
    "sport": "volly-putra",
    "phase": "group",
    "group": "C",
    "round": "Fase Grup C",
    "teamA": "MVC Malannying",
    "teamB": "PBV Bala Batu A",
    "date": "2026-08-15",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "MVC Malannying"
  },
  {
    "id": "vp-2",
    "sport": "volly-putra",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "PBV Siduruk",
    "teamB": "Le'To Bara",
    "date": "2026-08-10",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "PBV Siduruk"
  },
  {
    "id": "vp-3",
    "sport": "volly-putra",
    "phase": "group",
    "group": "D",
    "round": "Fase Grup D",
    "teamA": "PBV Bunga Duri",
    "teamB": "PBV Lamba",
    "date": "2026-08-11",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 2,
    "winner": "PBV Lamba"
  },
  {
    "id": "vp-4",
    "sport": "volly-putra",
    "phase": "group",
    "group": "C",
    "round": "Fase Grup C",
    "teamA": "MVC Malannying",
    "teamB": "Solleakka Group",
    "date": "2026-08-11",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "MVC Malannying"
  },
  {
    "id": "vp-5",
    "sport": "volly-putra",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "Le'To Bara",
    "teamB": "PBV Masbro",
    "date": "2026-08-12",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 2,
    "winner": "PBV Masbro"
  },
  {
    "id": "vp-6",
    "sport": "volly-putra",
    "phase": "group",
    "group": "C",
    "round": "Fase Grup C",
    "teamA": "Solleakka Group",
    "teamB": "PBV Bala Batu A",
    "date": "2026-08-12",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 2,
    "winner": "PBV Bala Batu A"
  },
  {
    "id": "vp-7",
    "sport": "volly-putra",
    "phase": "group",
    "group": "D",
    "round": "Fase Grup D",
    "teamA": "PBV Lamba",
    "teamB": "PBV Bala Batu B",
    "date": "2026-08-13",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "PBV Lamba"
  },
  {
    "id": "vp-8",
    "sport": "volly-putra",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "PBV Liba",
    "teamB": "PBV Uluway",
    "date": "2026-08-13",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "PBV Liba"
  },
  {
    "id": "vp-9",
    "sport": "volly-putra",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "Pemula Squad",
    "teamB": "PBV Liba",
    "date": "2026-08-14",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 2,
    "winner": "PBV Liba"
  },
  {
    "id": "vp-f",
    "sport": "volly-putra",
    "phase": "knockout",
    "round": "Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-25",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vp-qf1",
    "sport": "volly-putra",
    "phase": "knockout",
    "round": "Perempat Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-20",
    "time": "15:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vp-qf2",
    "sport": "volly-putra",
    "phase": "knockout",
    "round": "Perempat Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-20",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vp-qf3",
    "sport": "volly-putra",
    "phase": "knockout",
    "round": "Perempat Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-21",
    "time": "15:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vp-qf4",
    "sport": "volly-putra",
    "phase": "knockout",
    "round": "Perempat Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-21",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vp-sf1",
    "sport": "volly-putra",
    "phase": "knockout",
    "round": "Semi Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-23",
    "time": "15:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vp-sf2",
    "sport": "volly-putra",
    "phase": "knockout",
    "round": "Semi Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-23",
    "time": "16:30",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vpi-1",
    "sport": "volly-putri",
    "phase": "group",
    "group": "C",
    "round": "Fase Grup C",
    "teamA": "Alloan Squad",
    "teamB": "PBV Bala Batu A",
    "date": "2026-08-10",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 1,
    "winner": "Alloan Squad"
  },
  {
    "id": "vpi-10",
    "sport": "volly-putri",
    "phase": "group",
    "group": "D",
    "round": "Fase Grup D",
    "teamA": "Buntu Ampalla",
    "teamB": "Garuda Muda",
    "date": "2026-08-14",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 2,
    "winner": "Garuda Muda"
  },
  {
    "id": "vpi-11",
    "sport": "volly-putri",
    "phase": "group",
    "group": "D",
    "round": "Fase Grup D",
    "teamA": "Garuda Muda",
    "teamB": "PBV Maliba",
    "date": "2026-08-15",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 2,
    "winner": "PBV Maliba"
  },
  {
    "id": "vpi-12",
    "sport": "volly-putri",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "PBV Bala Batu B",
    "teamB": "Maliba Simpang",
    "date": "2026-08-15",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "PBV Bala Batu B"
  },
  {
    "id": "vpi-2",
    "sport": "volly-putri",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "MTs",
    "teamB": "Rante Limbong",
    "date": "2026-08-10",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 2,
    "winner": "Rante Limbong"
  },
  {
    "id": "vpi-3",
    "sport": "volly-putri",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "Rante Limbong",
    "teamB": "Siduruk Tim",
    "date": "2026-08-11",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 2,
    "winner": "Siduruk Tim"
  },
  {
    "id": "vpi-4",
    "sport": "volly-putri",
    "phase": "group",
    "group": "C",
    "round": "Fase Grup C",
    "teamA": "Buntu Kalosi",
    "teamB": "PBV Bala Batu A",
    "date": "2026-08-11",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 1,
    "winner": "Buntu Kalosi"
  },
  {
    "id": "vpi-5",
    "sport": "volly-putri",
    "phase": "group",
    "group": "C",
    "round": "Fase Grup C",
    "teamA": "Alloan Squad",
    "teamB": "Buntu Kalosi",
    "date": "2026-08-12",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 1,
    "scoreB": 2,
    "winner": "Buntu Kalosi"
  },
  {
    "id": "vpi-6",
    "sport": "volly-putri",
    "phase": "group",
    "group": "A",
    "round": "Fase Grup A",
    "teamA": "MTs",
    "teamB": "Siduruk Tim",
    "date": "2026-08-12",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 2,
    "winner": "Siduruk Tim"
  },
  {
    "id": "vpi-7",
    "sport": "volly-putri",
    "phase": "group",
    "group": "D",
    "round": "Fase Grup D",
    "teamA": "Buntu Ampalla",
    "teamB": "PBV Maliba",
    "date": "2026-08-13",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 2,
    "winner": "PBV Maliba"
  },
  {
    "id": "vpi-8",
    "sport": "volly-putri",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "Maliba Simpang",
    "teamB": "SMPN 6 Alla",
    "date": "2026-08-13",
    "time": "17:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 2,
    "scoreB": 0,
    "winner": "Maliba Simpang"
  },
  {
    "id": "vpi-9",
    "sport": "volly-putri",
    "phase": "group",
    "group": "B",
    "round": "Fase Grup B",
    "teamA": "SMPN 6 Alla",
    "teamB": "PBV Bala Batu B",
    "date": "2026-08-14",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "finished",
    "scoreA": 0,
    "scoreB": 2,
    "winner": "PBV Bala Batu B"
  },
  {
    "id": "vpi-f",
    "sport": "volly-putri",
    "phase": "knockout",
    "round": "Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-25",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vpi-qf1",
    "sport": "volly-putri",
    "phase": "knockout",
    "round": "Perempat Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-20",
    "time": "15:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vpi-qf2",
    "sport": "volly-putri",
    "phase": "knockout",
    "round": "Perempat Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-20",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vpi-qf3",
    "sport": "volly-putri",
    "phase": "knockout",
    "round": "Perempat Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-21",
    "time": "15:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vpi-qf4",
    "sport": "volly-putri",
    "phase": "knockout",
    "round": "Perempat Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-21",
    "time": "16:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vpi-sf1",
    "sport": "volly-putri",
    "phase": "knockout",
    "round": "Semi Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-23",
    "time": "15:00",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  },
  {
    "id": "vpi-sf2",
    "sport": "volly-putri",
    "phase": "knockout",
    "round": "Semi Final",
    "teamA": "TBD",
    "teamB": "TBD",
    "date": "2026-08-23",
    "time": "16:30",
    "venue": "Lapangan Utama Bala Batu",
    "status": "scheduled",
    "scoreA": null,
    "scoreB": null,
    "winner": null
  }
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
  const raw = (runtimeMatchesCache && runtimeMatchesCache.length > 0) ? runtimeMatchesCache : DEFAULT_MATCHES;
  return getResolvedMatchesForList(raw);
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
        const resolved = getResolvedMatchesForList(data.matches);
        setRuntimeMatches(resolved);
        return resolved;
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

// ─── Dynamic Knockout Team Resolver ──────────────────────────────────────────

export function getResolvedMatchesForList(matches: Match[], forceSync: boolean = false): Match[] {
  const sportsToResolve = ['volly-putra', 'volly-putri', 'sepak-bola-mini'];
  const standingsMap: Record<string, Record<string, Standing[]>> = {};

  sportsToResolve.forEach((s) => {
    standingsMap[s] = getStandingsWithMatches(matches, s);
  });

  const isRealTeam = (name?: string | null) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    return !lower.includes('juara') && !lower.includes('runner') && !lower.includes('pemenang') && !lower.includes('tim...') && lower !== 'tbd';
  };

  const getWinnerOfMatch = (m?: Match) => {
    if (!m) return null;
    if (m.winner && m.winner.trim()) return m.winner.trim();
    if (m.scoreA !== null && m.scoreB !== null && m.scoreA !== undefined && m.scoreB !== undefined) {
      const sa = Number(m.scoreA);
      const sb = Number(m.scoreB);
      if (sa > sb && m.teamA) return m.teamA.trim();
      if (sb > sa && m.teamB) return m.teamB.trim();
    }
    return null;
  };

  // Pre-calculate winners per sport for SF & Final resolution
  const qfWinnersMap: Record<string, Record<string, string | null>> = {};
  const sfWinnersMap: Record<string, Record<string, string | null>> = {};

  sportsToResolve.forEach((s) => {
    const sportMatches = matches.filter(x => x.sport === s);
    const qfMatches = sportMatches.filter(x => x.phase === 'knockout' && x.round.toLowerCase().includes('perempat'));
    const sfMatches = sportMatches.filter(x => x.phase === 'knockout' && x.round.toLowerCase().includes('semi'));

    qfWinnersMap[s] = {
      qf1: getWinnerOfMatch(qfMatches.find(x => x.id.endsWith('qf1'))),
      qf2: getWinnerOfMatch(qfMatches.find(x => x.id.endsWith('qf2'))),
      qf3: getWinnerOfMatch(qfMatches.find(x => x.id.endsWith('qf3'))),
      qf4: getWinnerOfMatch(qfMatches.find(x => x.id.endsWith('qf4'))),
    };

    sfWinnersMap[s] = {
      sf1: getWinnerOfMatch(sfMatches.find(x => x.id.endsWith('sf1'))),
      sf2: getWinnerOfMatch(sfMatches.find(x => x.id.endsWith('sf2'))),
    };
  });

  return matches.map((m) => {
    if (m.phase !== 'knockout') return m;

    const s = m.sport;
    const currentStandings = standingsMap[s] || getStandingsWithMatches(matches, s);
    const groupA = currentStandings['A'] || [];
    const groupB = currentStandings['B'] || [];
    const groupC = currentStandings['C'] || [];
    const groupD = currentStandings['D'] || [];

    const leaderA = groupA[0]?.name || 'Juara Full A';
    const runnerA = groupA[1]?.name || 'Runner Up A';
    const leaderB = groupB[0]?.name || 'Juara Full B';
    const runnerB = groupB[1]?.name || 'Runner Up B';
    const leaderC = groupC[0]?.name || 'Juara Full C';
    const runnerC = groupC[1]?.name || 'Runner Up C';
    const leaderD = groupD[0]?.name || 'Juara Full D';
    const runnerD = groupD[1]?.name || 'Runner Up D';

    const qfW = qfWinnersMap[s] || {};
    const sfW = sfWinnersMap[s] || {};

    let teamA = m.teamA;
    let teamB = m.teamB;

    const roundLower = m.round.toLowerCase();

    if (roundLower.includes('perempat') || m.id.includes('-qf')) {
      if (m.id.endsWith('qf1')) {
        teamA = forceSync || !isRealTeam(m.teamA) ? leaderA : m.teamA;
        teamB = forceSync || !isRealTeam(m.teamB) ? runnerB : m.teamB;
      } else if (m.id.endsWith('qf2')) {
        teamA = forceSync || !isRealTeam(m.teamA) ? leaderC : m.teamA;
        teamB = forceSync || !isRealTeam(m.teamB) ? runnerD : m.teamB;
      } else if (m.id.endsWith('qf3')) {
        teamA = forceSync || !isRealTeam(m.teamA) ? leaderB : m.teamA;
        teamB = forceSync || !isRealTeam(m.teamB) ? runnerC : m.teamB;
      } else if (m.id.endsWith('qf4')) {
        teamA = forceSync || !isRealTeam(m.teamA) ? leaderD : m.teamA;
        teamB = forceSync || !isRealTeam(m.teamB) ? runnerA : m.teamB;
      }
    } else if (roundLower.includes('semi') || m.id.includes('-sf')) {
      if (s === 'sepak-bola-mini') {
        if (m.id.endsWith('sf1')) {
          teamA = forceSync || !isRealTeam(m.teamA) ? leaderA : m.teamA;
          teamB = forceSync || !isRealTeam(m.teamB) ? runnerB : m.teamB;
        } else if (m.id.endsWith('sf2')) {
          teamA = forceSync || !isRealTeam(m.teamA) ? leaderB : m.teamA;
          teamB = forceSync || !isRealTeam(m.teamB) ? runnerA : m.teamB;
        }
      } else {
        if (m.id.endsWith('sf1')) {
          teamA = qfW.qf1 || (forceSync || !isRealTeam(m.teamA) ? 'Pemenang QF 1' : m.teamA);
          teamB = qfW.qf2 || (forceSync || !isRealTeam(m.teamB) ? 'Pemenang QF 2' : m.teamB);
        } else if (m.id.endsWith('sf2')) {
          teamA = qfW.qf3 || (forceSync || !isRealTeam(m.teamA) ? 'Pemenang QF 3' : m.teamA);
          teamB = qfW.qf4 || (forceSync || !isRealTeam(m.teamB) ? 'Pemenang QF 4' : m.teamB);
        }
      }
    } else if (roundLower.includes('final') || m.id.includes('-f')) {
      teamA = sfW.sf1 || (forceSync || !isRealTeam(m.teamA) ? 'Pemenang SF 1' : m.teamA);
      teamB = sfW.sf2 || (forceSync || !isRealTeam(m.teamB) ? 'Pemenang SF 2' : m.teamB);
    }

    return {
      ...m,
      teamA,
      teamB,
    };
  });
}

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
  let dateStr = targetDate;
  if (!dateStr) {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar' });
      dateStr = formatter.format(now);
    } catch {
      dateStr = '2026-08-16';
    }
  }

  const matches = getMatches();
  const live = matches.filter((m) => m.status === 'live');
  if (live.length > 0) return live;

  return matches.filter((m) => m.date === dateStr);
}

export function getStandings(sport: string): Record<string, Standing[]> {
  const rawMatches = (runtimeMatchesCache && runtimeMatchesCache.length > 0) ? runtimeMatchesCache : DEFAULT_MATCHES;
  return getStandingsWithMatches(rawMatches, sport);
}

export function getStandingsWithMatches(allMatches: Match[], sport: string): Record<string, Standing[]> {
  const teams = getTeams(sport);
  const matches = allMatches.filter((m) => m.sport === sport);
  const isBallSport = sport === 'sepak-bola-mini';

  const standingsMap: Record<string, Record<string, Standing>> = {};
  const teamGroupMap: Record<string, string> = {};

  teams.forEach((t) => {
    const groupName = t.group || 'A';
    teamGroupMap[t.name] = groupName;
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

    const teamA = m.teamA;
    const teamB = m.teamB;

    const groupA = teamGroupMap[teamA] || m.group || 'A';
    const groupB = teamGroupMap[teamB] || m.group || 'A';

    if (!standingsMap[groupA]) standingsMap[groupA] = {};
    if (!standingsMap[groupA][teamA]) {
      standingsMap[groupA][teamA] = {
        name: teamA, played: 0, won: 0, lost: 0, draw: 0,
        goalsFor: 0, goalsAgainst: 0, setsFor: 0, setsAgainst: 0, points: 0,
      };
    }
    if (!standingsMap[groupB]) standingsMap[groupB] = {};
    if (!standingsMap[groupB][teamB]) {
      standingsMap[groupB][teamB] = {
        name: teamB, played: 0, won: 0, lost: 0, draw: 0,
        goalsFor: 0, goalsAgainst: 0, setsFor: 0, setsAgainst: 0, points: 0,
      };
    }

    const stA = standingsMap[groupA][teamA];
    const stB = standingsMap[groupB][teamB];

    stA.played += 1;
    stB.played += 1;

    if (isBallSport) {
      stA.goalsFor = (stA.goalsFor || 0) + m.scoreA;
      stA.goalsAgainst = (stA.goalsAgainst || 0) + m.scoreB;
      stB.goalsFor = (stB.goalsFor || 0) + m.scoreB;
      stB.goalsAgainst = (stB.goalsAgainst || 0) + m.scoreA;

      if (m.scoreA > m.scoreB) {
        stA.won += 1;
        stA.points += 3;
        stB.lost += 1;
      } else if (m.scoreB > m.scoreA) {
        stB.won += 1;
        stB.points += 3;
        stA.lost += 1;
      } else {
        stA.draw = (stA.draw || 0) + 1;
        stA.points += 1;
        stB.draw = (stB.draw || 0) + 1;
        stB.points += 1;
      }
    } else {
      stA.setsFor = (stA.setsFor || 0) + m.scoreA;
      stA.setsAgainst = (stA.setsAgainst || 0) + m.scoreB;
      stB.setsFor = (stB.setsFor || 0) + m.scoreB;
      stB.setsAgainst = (stB.setsAgainst || 0) + m.scoreA;

      if (m.scoreA > m.scoreB) {
        stA.won += 1;
        stA.points += m.scoreA === 2 && m.scoreB === 0 ? 3 : 2;
        stB.lost += 1;
      } else if (m.scoreB > m.scoreA) {
        stB.won += 1;
        stB.points += m.scoreB === 2 && m.scoreA === 0 ? 3 : 2;
        stA.lost += 1;
      }
    }
  });

  const result: Record<string, Standing[]> = {};
  Object.keys(standingsMap).forEach((groupName) => {
    const list = Object.values(standingsMap[groupName]);

    list.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (isBallSport) {
        const diffA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
        const diffB = (b.goalsFor || 0) - (b.goalsAgainst || 0);
        if (diffB !== diffA) return diffB - diffA;
        return (b.goalsFor || 0) - (a.goalsFor || 0);
      } else {
        const diffA = (a.setsFor || 0) - (a.setsAgainst || 0);
        const diffB = (b.setsFor || 0) - (b.setsAgainst || 0);
        if (diffB !== diffA) return diffB - diffA;
        return (b.setsFor || 0) - (a.setsFor || 0);
      }
    });

    result[groupName] = list;
  });

  return result;
}
