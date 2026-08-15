import eventData from '../../data/event.json';
import matchesData from '../../data/matches.json';
import teamsData from '../../data/teams.json';
import type { EventData, Match, Team, Standing } from '@/types';

export function getEvent(): EventData {
  return eventData as EventData;
}

// In-memory runtime cache for client-side fetched matches
let runtimeMatchesCache: Match[] | null = null;

export function getMatches(): Match[] {
  if (runtimeMatchesCache && runtimeMatchesCache.length > 0) {
    return runtimeMatchesCache;
  }
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pr_matches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Match[];
        if (parsed && parsed.length > 0) {
          runtimeMatchesCache = parsed;
          return parsed;
        }
      } catch {
        // Fall back to static JSON
      }
    }
  }
  return (matchesData as { matches: Match[] }).matches;
}

export function setRuntimeMatches(matches: Match[]) {
  runtimeMatchesCache = matches;
  if (typeof window !== 'undefined') {
    localStorage.setItem('pr_matches', JSON.stringify(matches));
  }
}

export async function fetchServerMatches(): Promise<Match[]> {
  if (typeof window === 'undefined') {
    return getMatches();
  }
  try {
    const res = await fetch('/api/matches?t=' + Date.now(), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.matches && Array.isArray(data.matches)) {
        setRuntimeMatches(data.matches);
        return data.matches;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch matches from server API, using local fallback:', err);
  }
  return getMatches();
}

export function saveMatches(matches: Match[]) {
  setRuntimeMatches(matches);
  if (typeof window !== 'undefined') {
    fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matches }),
    }).catch((err) => console.error('Save to server failed:', err));
  }
}

export function getTeams(sport: string): Team[] {
  const all = teamsData as Record<string, Team[]>;
  return all[sport] || [];
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
    if (!standingsMap[groupName]) {
      standingsMap[groupName] = {};
    }
    standingsMap[groupName][t.name] = {
      name: t.name,
      played: 0,
      won: 0,
      lost: 0,
      draw: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      setsFor: 0,
      setsAgainst: 0,
      points: 0,
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

      if (m.scoreA > m.scoreB) {
        teamA.won += 1;
        teamA.points += 3;
        teamB.lost += 1;
      } else if (m.scoreB > m.scoreA) {
        teamB.won += 1;
        teamB.points += 3;
        teamA.lost += 1;
      } else {
        teamA.draw = (teamA.draw || 0) + 1;
        teamB.draw = (teamB.draw || 0) + 1;
        teamA.points += 1;
        teamB.points += 1;
      }
    } else {
      // Volleyball (sets - Best of 3)
      teamA.setsFor = (teamA.setsFor || 0) + m.scoreA;
      teamA.setsAgainst = (teamA.setsAgainst || 0) + m.scoreB;
      teamB.setsFor = (teamB.setsFor || 0) + m.scoreB;
      teamB.setsAgainst = (teamB.setsAgainst || 0) + m.scoreA;

      if (m.scoreA > m.scoreB) {
        teamA.won += 1;
        teamB.lost += 1;
        if (m.scoreB === 0) {
          teamA.points += 3;
        } else {
          teamA.points += 2;
        }
      } else if (m.scoreB > m.scoreA) {
        teamB.won += 1;
        teamA.lost += 1;
        if (m.scoreA === 0) {
          teamB.points += 3;
        } else {
          teamB.points += 2;
        }
      }
    }
  });

  const result: Record<string, Standing[]> = {};

  Object.keys(standingsMap).sort().forEach((groupName) => {
    const list = Object.values(standingsMap[groupName]);
    list.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = isBallSport
        ? (a.goalsFor || 0) - (a.goalsAgainst || 0)
        : (a.setsFor || 0) - (a.setsAgainst || 0);
      const diffB = isBallSport
        ? (b.goalsFor || 0) - (b.goalsAgainst || 0)
        : (b.setsFor || 0) - (b.setsAgainst || 0);
      if (diffB !== diffA) return diffB - diffA;
      return b.won - a.won;
    });
    result[groupName] = list;
  });

  return result;
}
