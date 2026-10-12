import { useMemo, useState } from 'react';
import type { Game, LeaderboardPeriod } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useGames } from '../contexts/GameContext';
import { buildLeaderboard, academicYearStart } from '../lib/leaderboard';
import { LEADERBOARD_TOP_N } from '../config';

export interface LeaderboardProps {
  game: Game;
}

const STORAGE_DISPLAY_NAME = 'playlab-display-name';
const STORAGE_CLASS_CODE = 'playlab-class-code';

function readDisplayName(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STORAGE_DISPLAY_NAME) ?? '';
}
function readClassCode(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STORAGE_CLASS_CODE) ?? '';
}

export default function Leaderboard({ game }: LeaderboardProps) {
  const { t, lang } = useLanguage();
  const { scoreVersion } = useGames();
  const [period, setPeriod] = useState<LeaderboardPeriod>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const { rows, personalBest, allClasses } = useMemo(() => {
    // scoreVersion is included so this re-runs when scores change.
    void scoreVersion;
    const map = new Map<string, string>();
    if (typeof window !== 'undefined') {
      const name = readDisplayName();
      const code = readClassCode();
      if (code) map.set(code, name);
    }
    const { rows, personalBest } = buildLeaderboard({
      subject: game.subject,
      gameId: game.id,
      window: period,
      classFilter,
      displayNameByClass: map,
    });
    // All classes present in current rows (for the class dropdown).
    const allClasses = Array.from(
      new Set(rows.map((r) => r.classCode).filter((c): c is string => !!c)),
    ).sort();
    return { rows, personalBest, allClasses };
  }, [game.subject, game.id, period, classFilter, scoreVersion]);

  const visible = showAll ? rows : rows.slice(0, LEADERBOARD_TOP_N);

  const academicYearLabel = (() => {
    const start = academicYearStart(new Date());
    const endYear = start.getUTCFullYear() + 1;
    return lang === 'zh'
      ? `${start.getUTCFullYear()}–${endYear}`
      : `${start.getUTCFullYear()}–${endYear}`;
  })();

  const emptyMessage = (() => {
    if (classFilter !== 'all') return t('leaderboard.emptyClass', classFilter);
    if (period === 'year') return t('leaderboard.emptyYear');
    if (period === 'month') return t('leaderboard.emptyMonth');
    return t('leaderboard.emptyAll');
  })();

  return (
    <section
      aria-label={t('leaderboard.title')}
      className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900">
          🏆 {t('leaderboard.title')}
        </h2>
        <p className="text-xs text-slate-500">{t('leaderboard.noteLocal')}</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <PeriodButton active={period === 'all'} onClick={() => setPeriod('all')}>
          {t('leaderboard.allTime')}
        </PeriodButton>
        <PeriodButton
          active={period === 'year'}
          onClick={() => setPeriod('year')}
          trailing={<span className="ml-1 text-slate-400">· {academicYearLabel}</span>}
        >
          {t('leaderboard.thisYear')}
        </PeriodButton>
        <PeriodButton active={period === 'month'} onClick={() => setPeriod('month')}>
          {t('leaderboard.monthly')}
        </PeriodButton>

        {allClasses.length > 0 && (
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-slate-500">{t('leaderboard.allClasses')}:</span>
            <select
              className="input py-1 text-xs"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="all">{t('leaderboard.allClasses')}</option>
              {allClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <>
          <ol className="divide-y divide-slate-100">
            {visible.map((row, i) => (
              <li
                key={`${row.createdAt}-${i}`}
                className={
                  'flex items-center gap-3 py-2.5 text-sm ' +
                  (row.isPersonalBest ? 'bg-amber-50 -mx-2 px-2 rounded-lg' : '')
                }
              >
                <span className="w-6 text-right font-mono text-slate-400">
                  {i + 1}
                </span>
                <span className="flex-1 truncate text-slate-700">
                  {row.displayName}
                </span>
                <span className="font-mono font-semibold text-slate-900">
                  {row.score}
                </span>
                {row.isPersonalBest && (
                  <span className="tag bg-amber-100 text-amber-700">
                    {t('leaderboard.yourBest')}
                  </span>
                )}
              </li>
            ))}
          </ol>
          {rows.length > LEADERBOARD_TOP_N && (
            <div className="mt-3 text-center">
              {showAll ? (
                <button
                  type="button"
                  className="btn-ghost-sm"
                  onClick={() => setShowAll(false)}
                >
                  {t('leaderboard.showTop10')}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-ghost-sm"
                  onClick={() => setShowAll(true)}
                >
                  {t('leaderboard.viewAll', rows.length)}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {personalBest && !rows.some((r) => r.isPersonalBest) && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-amber-50 px-3 py-2.5 text-sm">
          <span className="text-lg">⭐</span>
          <span className="flex-1 text-slate-700">
            {t('leaderboard.yourBest')} · {personalBest.displayName}
          </span>
          <span className="font-mono font-semibold text-slate-900">
            {personalBest.score}
          </span>
        </div>
      )}
    </section>
  );
}

function PeriodButton({
  active,
  onClick,
  children,
  trailing,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full px-3 py-1 text-xs font-semibold transition-colors ' +
        (active
          ? 'bg-brand-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
      }
    >
      {children}
      {trailing}
    </button>
  );
}
