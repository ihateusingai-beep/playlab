import { STORAGE_KEYS } from '../config';
import type { ScoreRecord } from '../types';

/** Read all scores from localStorage. Always returns an array, never throws. */
export function readScores(): ScoreRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.scores);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isScoreRecord);
  } catch {
    return [];
  }
}

function isScoreRecord(value: unknown): value is ScoreRecord {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.subject === 'string' &&
    typeof v.gameId === 'string' &&
    typeof v.score === 'number' &&
    Number.isFinite(v.score) &&
    typeof v.createdAt === 'number' &&
    typeof v.metadata === 'object' &&
    v.metadata !== null
  );
}

/**
 * Write a new score. Only this function should ever write to the score
 * store. Higher score wins for a given dedup key. Returns the new record
 * on success, or undefined when the score is not stored.
 *
 * Dedup key:
 *   - if metadata.trackId is set: `${trackId}::${difficulty}`
 *   - otherwise: `__default__`
 *
 * Rules from the spec:
 *   - score must be a finite number
 *   - score > 0 (0 or negative is dropped)
 *   - same key keeps the strictly higher score
 */
export function writeScore(input: {
  subject: string;
  gameId: string;
  score: number;
  metadata?: Record<string, string | number | boolean>;
}): ScoreRecord | undefined {
  if (!Number.isFinite(input.score)) return undefined;
  if (input.score <= 0) return undefined;

  const metadata = input.metadata ?? {};
  const existing = readScores();
  const trackId =
    typeof metadata.trackId === 'string' || typeof metadata.trackId === 'number'
      ? String(metadata.trackId)
      : null;
  const difficulty = typeof metadata.difficulty === 'string'
    ? metadata.difficulty
    : '';
  const dedupKey = trackId !== null ? `${trackId}::${difficulty}` : '__default__';

  // Look for an existing record on the same (subject, gameId, dedupKey).
  const prior = [...existing]
    .reverse()
    .find((r) => {
      if (r.subject !== input.subject) return false;
      if (r.gameId !== input.gameId) return false;
      const priorTrackId =
        typeof r.metadata.trackId === 'string' ||
        typeof r.metadata.trackId === 'number'
          ? String(r.metadata.trackId)
          : null;
      const priorDifficulty =
        typeof r.metadata.difficulty === 'string' ? r.metadata.difficulty : '';
      const priorKey =
        priorTrackId !== null ? `${priorTrackId}::${priorDifficulty}` : '__default__';
      return priorKey === dedupKey;
    });

  if (prior && prior.score >= input.score) {
    // Not strictly better; do not store.
    return undefined;
  }

  const record: ScoreRecord = {
    id: makeId(),
    subject: input.subject,
    gameId: input.gameId,
    score: input.score,
    metadata,
    createdAt: Date.now(),
  };

  existing.push(record);
  persist(existing);
  return record;
}

function persist(records: ScoreRecord[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(records));
  } catch {
    // Storage full or disabled — drop silently. The UI does not need to
    // surface this; the user is on a single device and can free space.
  }
}

function makeId(): string {
  // Stable enough for local-only dedup; no security claims.
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Best score for a (subject, gameId, dedupKey) tuple. Returns 0 when none. */
export function bestScore(
  subject: string,
  gameId: string,
  dedupKey = '__default__',
): number {
  const records = readScores();
  let best = 0;
  for (const r of records) {
    if (r.subject !== subject || r.gameId !== gameId) continue;
    const trackId =
      typeof r.metadata.trackId === 'string' ||
      typeof r.metadata.trackId === 'number'
        ? String(r.metadata.trackId)
        : null;
    const difficulty =
      typeof r.metadata.difficulty === 'string' ? r.metadata.difficulty : '';
    const k = trackId !== null ? `${trackId}::${difficulty}` : '__default__';
    if (k !== dedupKey) continue;
    if (r.score > best) best = r.score;
  }
  return best;
}
