import { ACADEMIC_YEAR_TIMEZONE } from '../config';
import { readScores } from './scores';

/** Leadboard period windowing. */
export type LeaderboardWindow = 'all' | 'year' | 'month';

/** Academic year start: 1 September. End: 31 August of the next calendar year. */
const ACADEMIC_YEAR_START_MONTH = 8; // 0-indexed: September
const ACADEMIC_YEAR_START_DAY = 1;

/** Returns the start (inclusive) of the academic year that contains `date`. */
export function academicYearStart(date: Date): Date {
  // Compute the HK year boundary at midnight HK time.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ACADEMIC_YEAR_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const year = Number(parts.find((p) => p.type === 'year')?.value ?? '0');
  const month = Number(parts.find((p) => p.type === 'month')?.value ?? '1');
  const day = Number(parts.find((p) => p.type === 'day')?.value ?? '1');

  // Academic year N starts on 1 Sep of calendar year N.
  let startYear = year;
  if (month < ACADEMIC_YEAR_START_MONTH + 1 || (month === ACADEMIC_YEAR_START_MONTH + 1 && day < ACADEMIC_YEAR_START_DAY)) {
    // Still in the prior academic year — start year is the prior calendar year.
    startYear = year - 1;
  }

  // Build a UTC instant that represents 1 Sep 00:00:00 HK time of startYear.
  // HK is UTC+8 year-round (no DST), so 00:00 HK = 16:00 UTC of the prior day.
  return new Date(Date.UTC(startYear, ACADEMIC_YEAR_START_MONTH, ACADEMIC_YEAR_START_DAY - 1, 16, 0, 0, 0));
}

/** Returns the end (exclusive) of the academic year that contains `date`. */
export function academicYearEnd(date: Date): Date {
  const start = academicYearStart(date);
  return new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
}

/** Local-month window. */
function localMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}
function localMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0);
}

/** True if `date` is within the given leaderboard window. */
export function inWindow(
  date: number,
  window: LeaderboardWindow,
  now: Date = new Date(),
): boolean {
  if (window === 'all') return true;
  const d = new Date(date);
  if (window === 'year') {
    return d >= academicYearStart(now) && d < academicYearEnd(now);
  }
  if (window === 'month') {
    return d >= localMonthStart(now) && d < localMonthEnd(now);
  }
  return true;
}

/**
 * Extract a class code from a display name. Returns undefined if no match.
 * Looks for a 1-digit digit followed by an uppercase letter, e.g. "5E", "1A".
 */
export function extractClass(displayName: string): string | undefined {
  if (!displayName) return undefined;
  const m = displayName.match(/\b([1-6][A-Z])\b/);
  return m?.[1];
}

/** A row in the leaderboard display. */
export interface LeaderboardRow {
  score: number;
  classCode: string | undefined;
  displayName: string;
  createdAt: number;
  isPersonalBest: boolean;
}

/**
 * Build the leaderboard for a single (subject, gameId).
 * Sorted by score desc, then createdAt asc (earlier wins on tie).
 * Class filter: when not 'all', only rows with the matching class.
 * Personal best: the row whose score equals the all-time best for this
 * (subject, gameId, dedupKey='__default__'). The same row appears in the
 * list (if it qualifies) and is also returned separately for the
 * "your best" footer.
 */
export function buildLeaderboard(input: {
  subject: string;
  gameId: string;
  window: LeaderboardWindow;
  classFilter: string;
  displayNameByClass: Map<string, string>;
  now?: Date;
}): { rows: LeaderboardRow[]; personalBest: LeaderboardRow | null } {
  const now = input.now ?? new Date();
  const records = readScores().filter((r) => {
    if (r.subject !== input.subject) return false;
    if (r.gameId !== input.gameId) return false;
    return inWindow(r.createdAt, input.window, now);
  });

  const rows: LeaderboardRow[] = records.map((r) => {
    const classCode = extractClass(r.metadata.displayName as string | undefined ?? '');
    return {
      score: r.score,
      classCode,
      displayName:
        (r.metadata.displayName as string | undefined) ??
        input.displayNameByClass.get(classCode ?? '') ??
        (classCode ? `${classCode}班` : 'Anonymous'),
      createdAt: r.createdAt,
      isPersonalBest: false,
    };
  });

  // Apply class filter.
  const filtered =
    input.classFilter === 'all'
      ? rows
      : rows.filter((r) => r.classCode === input.classFilter);

  // Sort: score desc, createdAt asc.
  filtered.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.createdAt - b.createdAt;
  });

  // Personal best: highest score overall (not windowed).
  const allRecords = readScores().filter(
    (r) => r.subject === input.subject && r.gameId === input.gameId,
  );
  let personalBest: LeaderboardRow | null = null;
  if (allRecords.length > 0) {
    const top = [...allRecords].sort((a, b) => b.score - a.score)[0]!;
    const classCode = extractClass(
      (top.metadata.displayName as string | undefined) ?? '',
    );
    personalBest = {
      score: top.score,
      classCode,
      displayName:
        (top.metadata.displayName as string | undefined) ??
        input.displayNameByClass.get(classCode ?? '') ??
        (classCode ? `${classCode}班` : 'Anonymous'),
      createdAt: top.createdAt,
      isPersonalBest: true,
    };
  }

  // Mark which row in the filtered list is the personal best (rare but
  // possible when the best is in the visible window).
  if (personalBest) {
    for (const r of filtered) {
      if (r.score === personalBest.score && r.createdAt === personalBest.createdAt) {
        r.isPersonalBest = true;
        break;
      }
    }
  }

  return { rows: filtered, personalBest };
}
