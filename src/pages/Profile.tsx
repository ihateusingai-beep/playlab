import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useGames } from '../contexts/GameContext';
import EmptyState from '../components/EmptyState';
import Breadcrumbs from '../components/Breadcrumbs';
import { PROFILE_PAGE_SIZE } from '../config';
import { readScores } from '../lib/scores';

export default function Profile() {
  const { t, lang } = useLanguage();
  const { getSubjectName, scoreVersion } = useGames();
  const [page, setPage] = useState(0);

  // scoreVersion triggers a recompute; the closure already reads fresh data.
  const records = useMemo(() => {
    void scoreVersion;
    return readScores()
      .filter((r) => r.score > 0)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [scoreVersion]);

  const totalPages = Math.max(1, Math.ceil(records.length / PROFILE_PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = records.slice(
    safePage * PROFILE_PAGE_SIZE,
    safePage * PROFILE_PAGE_SIZE + PROFILE_PAGE_SIZE,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Breadcrumbs crumbs={[{ label: t('app.profile') }]} />
      <header className="mt-3">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {t('profile.title')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t('profile.deviceOnly')}</p>
      </header>

      <section className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:p-5">
        <h2 className="text-sm font-bold text-slate-900">{t('profile.recent')}</h2>
        {records.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={t('profile.empty')}
              hint={t('profile.emptyHint')}
              action={{ to: '/', label: t('profile.browse') }}
            />
          </div>
        ) : (
          <>
            <ol className="mt-3 divide-y divide-slate-100">
              {visible.map((r) => {
                const subjectLabel = getSubjectName(r.subject, lang === 'zh' ? 'zh' : 'en');
                return (
                  <li key={r.id} className="flex items-center gap-3 py-3 text-sm">
                    <span className="flex-1 min-w-0">
                      <Link
                        to={`/game/${r.subject}/${r.gameId}`}
                        className="font-semibold text-slate-900 hover:text-brand-700 hover:underline"
                      >
                        {r.gameId}
                      </Link>
                      <span className="ml-2 text-xs text-slate-500">
                        {subjectLabel}
                      </span>
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatLocalDateTime(r.createdAt, lang)}
                    </span>
                    <span className="font-mono font-semibold text-slate-900">
                      {r.score}
                    </span>
                  </li>
                );
              })}
            </ol>
            {totalPages > 1 && (
              <div className="mt-3 flex items-center justify-between text-xs">
                <button
                  type="button"
                  className="btn-ghost-sm disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                >
                  ←
                </button>
                <span className="text-slate-500">
                  {safePage + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="btn-ghost-sm disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={safePage >= totalPages - 1}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function formatLocalDateTime(ms: number, lang: 'en' | 'zh'): string {
  const d = new Date(ms);
  // Local calendar date + local time HH:MM.
  const date = d.toLocaleDateString(lang === 'zh' ? 'zh-Hant' : 'en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = d.toLocaleTimeString(lang === 'zh' ? 'zh-Hant' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${date} ${time}`;
}
