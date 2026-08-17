'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save, LogOut, CheckCircle2, Trophy, Calendar, Layers, Edit3,
  Users, Plus, Trash2, Pencil, X, ChevronDown, Info, AlertCircle, RefreshCw,
} from 'lucide-react';
import type { Match, EventData } from '@/types';
import { getResolvedMatchesForList } from '@/lib/data';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Team { id: string; name: string; sport_id: string; group: string; }

type Tab = 'matches' | 'teams' | 'event';

const SPORTS = [
  { id: 'volly-putra', name: 'Volly Putra', icon: '🏐', groups: ['A', 'B', 'C', 'D'] },
  { id: 'volly-putri', name: 'Volly Putri', icon: '🏐', groups: ['A', 'B', 'C', 'D'] },
  { id: 'sepak-bola-mini', name: 'Sepak Bola Mini', icon: '⚽', groups: ['A', 'B'] },
];

// ─── Toast helper ────────────────────────────────────────────────────────────
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-2xl animate-bounce ${ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
      {ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {msg}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('matches');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Matches state
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [saving, setSaving] = useState(false);

  // Teams state
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSport, setTeamSport] = useState('volly-putra');
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamGroup, setNewTeamGroup] = useState('A');
  const [loadingTeams, setLoadingTeams] = useState(false);

  // New match state
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    sport: 'volly-putra', phase: 'group', group: 'A', round: 'Fase Grup A',
    teamA: '', teamB: '', date: '', time: '', venue: '', status: 'scheduled',
    scoreA: null, scoreB: null, winner: null,
  });

  // Event state
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Auth check
  useEffect(() => {
    const isAuth = sessionStorage.getItem('is_admin');
    if (!isAuth) { router.push('/admin'); return; }
    loadMatches();
    loadEvent();
  }, [router]);

  useEffect(() => {
    if (activeTab === 'teams') loadTeams(teamSport);
  }, [activeTab, teamSport]);

  async function loadMatches() {
    const res = await fetch('/api/matches?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const d = await res.json();
      const resolved = getResolvedMatchesForList(d.matches || []);
      setMatches(resolved);
    }
  }

  const handleSyncTeamsFromStandings = async () => {
    setSaving(true);
    const resolved = getResolvedMatchesForList(matches, true);
    setMatches(resolved);

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches: resolved }),
      });
      if (res.ok) {
        showToast('🔄 Tim Perempat Final/Semi Final berhasil disinkronkan dari klasemen & disimpan ke Database!');
      } else {
        showToast('Gagal menyimpan sinkronisasi ke database!', false);
      }
    } catch {
      showToast('Error koneksi saat sinkronisasi!', false);
    } finally {
      setSaving(false);
    }
  };

  async function loadTeams(sport: string) {
    setLoadingTeams(true);
    const res = await fetch(`/api/teams?sport=${sport}&t=` + Date.now(), { cache: 'no-store' });
    if (res.ok) { const d = await res.json(); setTeams(d.teams || []); }
    setLoadingTeams(false);
  }

  async function loadEvent() {
    const res = await fetch('/api/event?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) { const d = await res.json(); setEventData(d); }
  }

  // ── MATCHES handlers ───────────────────────────────────────────────────────
  const handleMatchChange = (id: string, field: keyof Match, val: any) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== id) return m;
      const updated = { ...m, [field]: val };
      if (updated.scoreA !== null && updated.scoreB !== null) {
        if (updated.scoreA > updated.scoreB) updated.winner = updated.teamA;
        else if (updated.scoreB > updated.scoreA) updated.winner = updated.teamB;
        else updated.winner = null;
      } else { updated.winner = null; }
      return updated;
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches }),
      });
      if (res.ok) showToast('✅ Semua pertandingan berhasil disimpan ke Neon Postgres!');
      else showToast('Gagal menyimpan!', false);
    } catch { showToast('Error koneksi!', false); }
    setSaving(false);
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('Hapus pertandingan ini?')) return;
    const res = await fetch(`/api/matches?id=${id}`, { method: 'DELETE' });
    if (res.ok) { setMatches(prev => prev.filter(m => m.id !== id)); showToast('Pertandingan dihapus!'); }
    else showToast('Gagal menghapus!', false);
  };

  const handleAddMatch = async () => {
    if (!newMatch.teamA || !newMatch.teamB || !newMatch.date) {
      showToast('Isi Tim A, Tim B, dan Tanggal dulu!', false); return;
    }
    const matchToAdd = { ...newMatch, id: `match-${Date.now()}` } as Match;
    const res = await fetch('/api/matches', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match: matchToAdd }),
    });
    if (res.ok) {
      setMatches(prev => [...prev, matchToAdd]);
      setShowAddMatch(false);
      setNewMatch({ sport: 'volly-putra', phase: 'group', group: 'A', round: 'Fase Grup A', teamA: '', teamB: '', date: '', time: '', venue: '', status: 'scheduled', scoreA: null, scoreB: null, winner: null });
      showToast('Pertandingan berhasil ditambahkan!');
    } else showToast('Gagal menambahkan pertandingan!', false);
  };

  // ── TEAMS handlers ─────────────────────────────────────────────────────────
  const handleAddTeam = async () => {
    if (!newTeamName.trim()) { showToast('Isi nama tim dulu!', false); return; }
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTeamName.trim(), sport_id: teamSport, group_name: newTeamGroup }),
    });
    if (res.ok) {
      setNewTeamName('');
      loadTeams(teamSport);
      showToast(`Tim "${newTeamName}" berhasil ditambahkan ke Grup ${newTeamGroup}!`);
    } else showToast('Gagal menambahkan tim!', false);
  };

  const handleEditTeam = async () => {
    if (!editTeam || !editTeam.name.trim()) return;
    const res = await fetch('/api/teams', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editTeam.id, name: editTeam.name, group_name: editTeam.group }),
    });
    if (res.ok) { setEditTeam(null); loadTeams(teamSport); showToast('Tim berhasil diperbarui!'); }
    else showToast('Gagal memperbarui tim!', false);
  };

  const handleDeleteTeam = async (id: string, name: string) => {
    if (!confirm(`Hapus tim "${name}"?`)) return;
    const res = await fetch(`/api/teams?id=${id}`, { method: 'DELETE' });
    if (res.ok) { setTeams(prev => prev.filter(t => t.id !== id)); showToast(`Tim "${name}" dihapus!`); }
    else showToast('Gagal menghapus tim!', false);
  };

  // ── EVENT handlers ─────────────────────────────────────────────────────────
  const handleSaveEvent = async () => {
    if (!eventData) return;
    setSavingEvent(true);
    const res = await fetch('/api/event', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (res.ok) showToast('Info event berhasil diperbarui!');
    else showToast('Gagal menyimpan event!', false);
    setSavingEvent(false);
  };

  // ── Filtered matches ───────────────────────────────────────────────────────
  const uniqueDates = Array.from(new Set(matches.map(m => m.date))).sort();
  const filteredMatches = matches.filter(m => {
    if (selectedSport !== 'all' && m.sport !== selectedSport) return false;
    if (selectedDate !== 'all' && m.date !== selectedDate) return false;
    return true;
  });

  const currentSportGroups = SPORTS.find(s => s.id === teamSport)?.groups || ['A', 'B'];
  const teamsByGroup = currentSportGroups.reduce((acc, g) => {
    acc[g] = teams.filter(t => t.group === g);
    return acc;
  }, {} as Record<string, Team[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f1d32] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" /> Admin Control Panel
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Kelola Data Turnamen <Edit3 className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">Database: Neon Serverless Postgres — data tersimpan permanen & real-time!</p>
        </div>
        <button onClick={() => { sessionStorage.removeItem('is_admin'); router.push('/admin'); }}
          className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs flex items-center gap-2 transition-colors border border-red-500/30">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#0a1628] rounded-xl p-1.5 border border-white/10">
        {[
          { id: 'matches', label: 'Pertandingan', icon: <Calendar className="w-4 h-4" /> },
          { id: 'teams', label: 'Tim & Grup', icon: <Users className="w-4 h-4" /> },
          { id: 'event', label: 'Info Event', icon: <Info className="w-4 h-4" /> },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: MATCHES ────────────────────────────────────────────────────── */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          {/* Filters + Actions */}
          <div className="space-y-3 bg-[#0f1d32] border border-white/10 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-2">Cabang:</span>
              <button onClick={() => setSelectedSport('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedSport === 'all' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                Semua ({matches.length})
              </button>
              {SPORTS.map(s => (
                <button key={s.id} onClick={() => setSelectedSport(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${selectedSport === s.id ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.04]">
              <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> Tanggal:</span>
              <button onClick={() => setSelectedDate('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedDate === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                Semua
              </button>
              {uniqueDates.map(d => (
                <button key={d} onClick={() => setSelectedDate(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedDate === d ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleSaveAll} disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:scale-105">
              <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Semua ke Database'}
            </button>
            <button onClick={handleSyncTeamsFromStandings}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:scale-105" title="Tarik nama tim Juara & Runner-Up dari klasemen secara otomatis">
              <RefreshCw className="w-4 h-4" /> Sinkronkan Tim Lolos dari Klasemen
            </button>
            <button onClick={() => setShowAddMatch(v => !v)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Tambah Pertandingan
            </button>
          </div>

          {/* Add Match Form */}
          {showAddMatch && (
            <div className="bg-[#0f1d32] border border-blue-500/30 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm"><Plus className="w-4 h-4 text-blue-400" /> Tambah Jadwal Pertandingan Baru</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Cabang Olahraga</label>
                  <select value={newMatch.sport} onChange={e => setNewMatch(p => ({ ...p, sport: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500">
                    {SPORTS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Fase</label>
                  <select value={newMatch.phase} onChange={e => setNewMatch(p => ({ ...p, phase: e.target.value as any }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500">
                    <option value="group">Fase Grup</option>
                    <option value="knockout">Knockout</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Grup</label>
                  <input value={newMatch.group || ''} onChange={e => setNewMatch(p => ({ ...p, group: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500" placeholder="A" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Round/Label</label>
                  <input value={newMatch.round || ''} onChange={e => setNewMatch(p => ({ ...p, round: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500" placeholder="Fase Grup A" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tim A *</label>
                  <input value={newMatch.teamA || ''} onChange={e => setNewMatch(p => ({ ...p, teamA: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500" placeholder="Nama Tim A" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tim B *</label>
                  <input value={newMatch.teamB || ''} onChange={e => setNewMatch(p => ({ ...p, teamB: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500" placeholder="Nama Tim B" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tanggal *</label>
                  <input type="date" value={newMatch.date || ''} onChange={e => setNewMatch(p => ({ ...p, date: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Jam</label>
                  <input value={newMatch.time || ''} onChange={e => setNewMatch(p => ({ ...p, time: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500" placeholder="15:30" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Lokasi/Venue</label>
                  <input value={newMatch.venue || ''} onChange={e => setNewMatch(p => ({ ...p, venue: e.target.value }))}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-blue-500" placeholder="Lapangan Utama Bala Batu" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleAddMatch} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Pertandingan
                </button>
                <button onClick={() => setShowAddMatch(false)} className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2">
                  <X className="w-4 h-4" /> Batal
                </button>
              </div>
            </div>
          )}

          {/* Matches List */}
          <div className="space-y-3">
            {filteredMatches.map(match => (
              <div key={match.id}
                className={`bg-[#0f1d32] border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center transition-all ${match.status === 'live' ? 'border-red-500/60 shadow-lg shadow-red-500/10' : 'border-white/10'}`}>
                {/* Round info */}
                <div className="md:col-span-3 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">{match.round}</span>
                    {match.group && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center gap-1"><Layers className="w-3 h-3" /> Grup {match.group}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="date" value={match.date} onChange={e => handleMatchChange(match.id, 'date', e.target.value)}
                      className="bg-[#0a1628] border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs outline-none focus:border-cyan-500" />
                    <input type="text" value={match.time} onChange={e => handleMatchChange(match.id, 'time', e.target.value)}
                      className="bg-[#0a1628] border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs w-16 outline-none focus:border-cyan-500 text-center font-mono" placeholder="15:20" />
                  </div>
                  <input type="text" value={match.venue} onChange={e => handleMatchChange(match.id, 'venue', e.target.value)}
                    className="bg-[#0a1628] border border-slate-700/60 rounded px-2 py-1 text-slate-400 text-[11px] w-full outline-none focus:border-cyan-500" placeholder="Lokasi" />
                </div>

                {/* Teams + Scores (Mobile Friendly & Non-Overlapping Layout) */}
                <div className="md:col-span-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-[#0a1628] p-3 rounded-xl border border-white/5">
                  {/* Team A */}
                  <div className="w-full sm:flex-1">
                    <label className="text-[10px] text-slate-400 font-bold block sm:hidden mb-1 text-left">Tim A</label>
                    <input type="text" value={match.teamA} onChange={e => handleMatchChange(match.id, 'teamA', e.target.value)}
                      className="bg-[#0f1d32] border border-slate-700 rounded px-2.5 py-1.5 text-white font-bold text-xs text-left sm:text-right w-full outline-none focus:border-red-500 transition-colors" placeholder="Nama Tim A" />
                  </div>

                  {/* Score A & B Pill (Centered, Dedicated Box, Zero Overlap) */}
                  <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-[#0f1d32] border border-slate-700/80 rounded-xl flex-shrink-0 w-full sm:w-auto shadow-inner">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase sm:hidden">Skor A:</span>
                      <input type="number" min="0" value={match.scoreA ?? ''} onChange={e => handleMatchChange(match.id, 'scoreA', e.target.value === '' ? null : parseInt(e.target.value))}
                        className="w-10 text-center bg-slate-800 border border-slate-700 rounded text-white font-black text-sm py-1 outline-none focus:border-red-500" placeholder="0" />
                    </div>
                    <span className="text-slate-500 font-black text-sm text-center px-1">-</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase sm:hidden">Skor B:</span>
                      <input type="number" min="0" value={match.scoreB ?? ''} onChange={e => handleMatchChange(match.id, 'scoreB', e.target.value === '' ? null : parseInt(e.target.value))}
                        className="w-10 text-center bg-slate-800 border border-slate-700 rounded text-white font-black text-sm py-1 outline-none focus:border-red-500" placeholder="0" />
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="w-full sm:flex-1">
                    <label className="text-[10px] text-slate-400 font-bold block sm:hidden mb-1 text-left">Tim B</label>
                    <input type="text" value={match.teamB} onChange={e => handleMatchChange(match.id, 'teamB', e.target.value)}
                      className="bg-[#0f1d32] border border-slate-700 rounded px-2.5 py-1.5 text-white font-bold text-xs text-left w-full outline-none focus:border-red-500 transition-colors" placeholder="Nama Tim B" />
                  </div>
                </div>

                {/* Status + Delete */}
                <div className="md:col-span-3 flex flex-col items-end gap-2">
                  <select value={match.status} onChange={e => handleMatchChange(match.id, 'status', e.target.value as any)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer ${match.status === 'live' ? 'bg-red-500/20 text-red-400 border-red-500/40' : match.status === 'finished' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                    <option value="scheduled">Jadwal (Belum Main)</option>
                    <option value="live">🔴 Sedang Main (LIVE)</option>
                    <option value="finished">✅ Selesai (Finished)</option>
                  </select>
                  {match.winner && <div className="text-[11px] font-semibold text-emerald-400 truncate max-w-full">🏆 {match.winner}</div>}
                  <button onClick={() => handleDeleteMatch(match.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-lg hover:bg-red-500/10 self-end" title="Hapus pertandingan">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Save */}
          {filteredMatches.length > 3 && (
            <button onClick={handleSaveAll} disabled={saving}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg">
              <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan ke Database'}
            </button>
          )}
        </div>
      )}

      {/* ── TAB: TEAMS ──────────────────────────────────────────────────────── */}
      {activeTab === 'teams' && (
        <div className="space-y-5">
          {/* Sport selector */}
          <div className="flex flex-wrap gap-2 bg-[#0f1d32] border border-white/10 rounded-xl p-4">
            <span className="text-xs font-bold text-slate-400 mr-2 self-center">Cabang:</span>
            {SPORTS.map(s => (
              <button key={s.id} onClick={() => setTeamSport(s.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${teamSport === s.id ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {/* Add Team Form */}
          <div className="bg-[#0f1d32] border border-blue-500/30 rounded-2xl p-5 flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nama Tim Baru</label>
              <input value={newTeamName} onChange={e => setNewTeamName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTeam()}
                className="bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500 w-64"
                placeholder="Masukkan nama tim..." />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Grup</label>
              <select value={newTeamGroup} onChange={e => setNewTeamGroup(e.target.value)}
                className="bg-[#0a1628] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-500">
                {currentSportGroups.map(g => <option key={g} value={g}>Grup {g}</option>)}
              </select>
            </div>
            <button onClick={handleAddTeam}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Tambah Tim
            </button>
          </div>

          {/* Teams by Group */}
          {loadingTeams ? (
            <div className="text-center text-slate-400 py-10">Memuat data tim...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSportGroups.map(group => (
                <div key={group} className="bg-[#0f1d32] border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold text-sm flex items-center justify-center border border-amber-500/30">
                      {group}
                    </span>
                    <h3 className="font-bold text-white text-sm">Grup {group}</h3>
                    <span className="ml-auto text-xs text-slate-500">{teamsByGroup[group]?.length || 0} tim</span>
                  </div>
                  <div className="space-y-2">
                    {(teamsByGroup[group] || []).length === 0 && (
                      <p className="text-xs text-slate-600 text-center py-4">Belum ada tim di grup ini</p>
                    )}
                    {(teamsByGroup[group] || []).map(team => (
                      <div key={team.id} className="flex items-center gap-2 bg-[#0a1628] rounded-xl px-3 py-2 border border-white/5 group">
                        {editTeam?.id === team.id ? (
                          <>
                            <input value={editTeam.name} onChange={e => setEditTeam({ ...editTeam, name: e.target.value })}
                              className="flex-1 bg-[#0f1d32] border border-blue-500 rounded px-2 py-1 text-white text-sm outline-none"
                              onKeyDown={e => e.key === 'Enter' && handleEditTeam()} autoFocus />
                            <select value={editTeam.group} onChange={e => setEditTeam({ ...editTeam, group: e.target.value })}
                              className="bg-[#0f1d32] border border-slate-600 rounded px-2 py-1 text-white text-xs outline-none">
                              {currentSportGroups.map(g => <option key={g} value={g}>Grup {g}</option>)}
                            </select>
                            <button onClick={handleEditTeam} className="text-emerald-400 hover:text-emerald-300 p-1 rounded"><CheckCircle2 className="w-4 h-4" /></button>
                            <button onClick={() => setEditTeam(null)} className="text-slate-400 hover:text-white p-1 rounded"><X className="w-4 h-4" /></button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm font-semibold text-white">{team.name}</span>
                            <button onClick={() => setEditTeam(team)} className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 p-1 rounded transition-all" title="Edit tim">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteTeam(team.id, team.name)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 rounded transition-all" title="Hapus tim">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: EVENT INFO ──────────────────────────────────────────────────── */}
      {activeTab === 'event' && eventData && (
        <div className="space-y-4">
          <div className="bg-[#0f1d32] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2"><Info className="w-5 h-5 text-cyan-400" /> Info Event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Nama Event', field: 'name' as keyof EventData },
                { label: 'Tagline', field: 'tagline' as keyof EventData },
                { label: 'Tanggal Mulai', field: 'startDate' as keyof EventData, type: 'date' },
                { label: 'Tanggal Selesai', field: 'endDate' as keyof EventData, type: 'date' },
                { label: 'Lokasi', field: 'location' as keyof EventData },
                { label: 'Penyelenggara', field: 'organizer' as keyof EventData },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                  <input type={type || 'text'} value={(eventData as any)[field] || ''}
                    onChange={e => setEventData({ ...eventData, [field]: e.target.value })}
                    className="w-full bg-[#0a1628] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-500 transition-colors" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Deskripsi</label>
                <textarea value={eventData.description || ''} onChange={e => setEventData({ ...eventData, description: e.target.value })}
                  rows={4}
                  className="w-full bg-[#0a1628] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-500 transition-colors resize-none" />
              </div>
            </div>
            <button onClick={handleSaveEvent} disabled={savingEvent}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg hover:scale-105">
              <Save className="w-4 h-4" /> {savingEvent ? 'Menyimpan...' : 'Simpan Info Event ke Database'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
