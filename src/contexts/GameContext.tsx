import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CATALOG, findGame, gamesForSubject } from '../data/catalog';
import { getSubject, SUBJECTS } from '../data/subjects';
import { writeScore, readScores } from '../lib/scores';
import type { Game, ScoreRecord, Subject, SubjectId } from '../types';

interface GameContextValue {
  subjects: readonly Subject[];
  getSubject: (id: string) => Subject | undefined;
  getSubjectName: (id: string, lang: 'en' | 'zh') => string;
  gamesForSubject: (subject: string) => Game[];
  findGame: (subject: string, gameId: string) => Game | undefined;
  /**
   * Submit a score from an iframe message. Validates that the message
   * comes from the registered iframe contentWindow and the route matches
   * the iframe src. Higher-score-wins per dedup key (see lib/scores).
   * Returns the stored record, or undefined when rejected.
   */
  submitScore: (input: {
    source: Window | null;
    expected: { subject: SubjectId; gameId: string };
    message: unknown;
  }) => ScoreRecord | undefined;
  /** Force a refresh of the score list. Used by the leaderboard to live-update. */
  scoreVersion: number;
  bumpScores: () => void;
  scores: () => ScoreRecord[];
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [scoreVersion, setScoreVersion] = useState(0);
  const bumpScores = useCallback(() => setScoreVersion((n) => n + 1), []);

  const submitScore = useCallback<GameContextValue['submitScore']>(({ source, expected, message }) => {
    if (!source) return undefined;
    if (!isScoreMessage(message)) return undefined;
    if (message.subject !== expected.subject) return undefined;
    if (message.gameId !== expected.gameId) return undefined;
    const record = writeScore({
      subject: message.subject,
      gameId: message.gameId,
      score: message.score,
      metadata: message.metadata ?? {},
    });
    if (record) bumpScores();
    return record;
  }, [bumpScores]);

  const value = useMemo<GameContextValue>(() => ({
    subjects: SUBJECTS,
    getSubject: (id: string) => getSubject(id),
    getSubjectName: (id: string, lang: 'en' | 'zh') => {
      const s = getSubject(id);
      if (!s) return id;
      return lang === 'zh' ? s.nameZh : s.name;
    },
    gamesForSubject: (subject: string) => gamesForSubject(subject),
    findGame: (subject: string, gameId: string) => findGame(subject, gameId),
    submitScore,
    scoreVersion,
    bumpScores,
    scores: () => readScores(),
  }), [submitScore, scoreVersion, bumpScores]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGames(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGames must be used inside <GameProvider>');
  return ctx;
}

function isScoreMessage(value: unknown): value is {
  type: 'playlab:score';
  subject: string;
  gameId: string;
  score: number;
  metadata?: Record<string, string | number | boolean>;
} {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.type !== 'playlab:score') return false;
  if (typeof v.subject !== 'string') return false;
  if (typeof v.gameId !== 'string') return false;
  if (typeof v.score !== 'number' || !Number.isFinite(v.score)) return false;
  if (v.metadata !== undefined) {
    if (typeof v.metadata !== 'object' || v.metadata === null) return false;
    for (const k of Object.keys(v.metadata as Record<string, unknown>)) {
      const t = typeof (v.metadata as Record<string, unknown>)[k];
      if (t !== 'string' && t !== 'number' && t !== 'boolean') return false;
    }
  }
  return true;
}

// Re-export the static catalog for components that only need read access.
export { CATALOG };
