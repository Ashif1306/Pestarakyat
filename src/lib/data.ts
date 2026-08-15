import eventData from '../../data/event.json';
import matchesData from '../../data/matches.json';
import teamsData from '../../data/teams.json';
import type { EventData, Match, Team, Standing } from '@/types';

export function getEvent(): EventData {
  return eventData as EventData;
}

export function getMatches(): Match[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pr_matches');
    if (saved) {
      try {
        return JSON.parse(saved) as Match[];
      } catch {
        // Fall back to static JSON if parse fails
      }
    }
  }
  return (matchesData as { matches: Match[] }).matches;
}

export function saveMatches(matches: Match[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pr_matches', JSON.stringify(matches));
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
  // Default to 2026-08-15 if current date is not in tournament range
  const dateStr = targetDate || '2026-08-15';
  const matches = getMatches();
  const todayList = matches.filter((m) => m.date === dateStr);
  
  if (todayList.length === 0) {
    // Return live matches or next upcoming scheduled matches
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

  // Group teams by their group
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

  // Calculate stats from finished matches (or matches with score)
  matches.forEach((m) => {
    if (m.phase !== 'group') return;
    if (m.scoreA === null || m.scoreB === null) return;
    // Count matches that are finished or live with score
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
      // Volleyball (sets)
      teamA.setsFor = (teamA.setsFor || 0) + m.scoreA;
      teamA.setsAgainst = (teamA.setsAgainst || 0) + m.scoreB;
      teamB.setsFor = (teamB.setsFor || 0) + m.scoreB;
      teamB.setsAgainst = (teamB.setsAgainst || 0) + m.scoreA;

      if (m.scoreA > m.scoreB) {
        teamA.won += 1;
        teamA.points += 3; // 3 points per win
        teamB.lost += 1;
      } else if (m.scoreB > m.scoreA) {
        teamB.won += 1;
        teamB.points += 3;
        teamA.lost += 1;
      }
    }
  });

  // Convert to sorted arrays per group
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
