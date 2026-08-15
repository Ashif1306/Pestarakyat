export interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalTeams?: number;
  totalGroups?: number;
}

export interface EventData {
  name: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  sports: Sport[];
}

export interface Team {
  id: string;
  name: string;
  group?: string;
}

export interface Match {
  id: string;
  sport: string;
  phase: 'group' | 'knockout';
  group?: string;
  round: string;
  teamA: string;
  teamB: string;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'live' | 'finished';
  scoreA: number | null;
  scoreB: number | null;
  winner: string | null;
}

export interface Standing {
  name: string;
  played: number;
  won: number;
  lost: number;
  draw?: number;
  setsFor?: number;
  setsAgainst?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  points: number;
}

export type StandingsData = Record<string, Record<string, Standing[]>>;
