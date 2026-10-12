import type { Game } from '../types';

/**
 * Game catalogue. Empty by default — the platform ships with no real games.
 * The only entry here is the score-check test page used to verify the
 * postMessage interface and the leaderboard. Do not add a second game.
 */
export const CATALOG: readonly Game[] = [
  {
    id: 'score-check',
    title: 'Score Check',
    titleZh: '分數測試',
    description:
      'Diagnostic page to verify the platform score interface. Not a learning game.',
    descriptionZh: '用於驗收分數接口的測試頁,並非學習遊戲。',
    subject: 'tools',
    difficulty: '—',
    estimatedTime: '1 min',
    author: 'PlayLab',
    leaderboard: true,
    leaderboardMode: 'default',
    scoreLabel: 'points',
  },
];

/** All games for one subject, in catalogue order. */
export function gamesForSubject(subject: string): Game[] {
  return CATALOG.filter((g) => g.subject === subject);
}

/** Find a single game. Returns undefined when the id is unknown. */
export function findGame(subject: string, gameId: string): Game | undefined {
  return CATALOG.find((g) => g.subject === subject && g.id === gameId);
}
