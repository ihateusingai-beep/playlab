/** Subject identifier. Matches the keys in src/data/subjects.ts. */
export type SubjectId = string;

/** Single game registered in the catalogue. */
export interface Game {
  id: string;
  title: string;
  titleZh?: string;
  description: string;
  descriptionZh?: string;
  subject: SubjectId;
  /** Free-form grade/form string (e.g. "S1", "P2", "S4 - S6"), not a difficulty. */
  difficulty: string;
  estimatedTime: string;
  author?: string;
  thumbnail?: string;
  topic?: string;
  /** If set, the game card opens this URL in a new tab; no iframe is rendered. */
  externalUrl?: string;
  leaderboard?: boolean;
  leaderboardMode?: 'default' | 'tracks';
  scoreLabel?: string;
  touchSafe?: boolean;
}

/** Subject metadata shown on the home page. */
export interface Subject {
  id: SubjectId;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
}

/** A score record stored in localStorage. Append-only. */
export interface ScoreRecord {
  id: string;
  subject: SubjectId;
  gameId: string;
  score: number;
  metadata: Record<string, string | number | boolean>;
  createdAt: number;
}

/** Window key used for the leaderboard period filter. */
export type LeaderboardPeriod = 'all' | 'year' | 'month';

/** Window key used for the leaderboard class filter. "all" is a sentinel. */
export type LeaderboardClassFilter = string;
