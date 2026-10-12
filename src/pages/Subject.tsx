import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useGames } from '../contexts/GameContext';
import GameCard from '../components/GameCard';
import GameListFilters from '../components/GameListFilters';
import EmptyState from '../components/EmptyState';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Subject() {
  const { subject: subjectId = '' } = useParams();
  const { t, lang } = useLanguage();
  const { getSubject, getSubjectName, gamesForSubject } = useGames();

  const subject = getSubject(subjectId);
  const games = useMemo(() => gamesForSubject(subjectId), [gamesForSubject, subjectId]);

  const [topic, setTopic] = useState<string>('all');
  const [form, setForm] = useState<string>('all');

  const topics = useMemo(() => {
    const set = new Set<string>();
    for (const g of games) if (g.topic) set.add(g.topic);
    return Array.from(set).sort();
  }, [games]);

  const forms = useMemo(() => {
    const set = new Set<string>();
    for (const g of games) if (g.difficulty) set.add(g.difficulty);
    return Array.from(set).sort();
  }, [games]);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (topic !== 'all' && g.topic !== topic) return false;
      if (form !== 'all' && g.difficulty !== form) return false;
      return true;
    });
  }, [games, topic, form]);

  if (!subject) {
    // Unknown subject — still render the page, with the empty state.
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Breadcrumbs crumbs={[{ label: subjectId }]} />
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">{subjectId}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {lang === 'zh' ? '這個科目不在目錄中。' : 'This subject is not in the catalogue.'}
        </p>
        <div className="mt-6">
          <EmptyState
            title={t('subject.noGamesYet')}
            hint={t('subject.noGamesHint')}
            action={{ to: '/', label: t('app.home') }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <Breadcrumbs
        crumbs={[
          { label: lang === 'zh' ? subject.nameZh : subject.name, to: `/subject/${subjectId}` },
        ]}
      />
      <header className="mt-3">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {t('subject.gamesFor', lang === 'zh' ? subject.nameZh : subject.name)}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t('subject.explore', lang === 'zh' ? subject.nameZh : subject.name)}
        </p>
      </header>

      <div className="mt-5">
        {games.length === 0 ? (
          <EmptyState
            title={t('subject.noGamesYet')}
            hint={t('subject.noGamesHint')}
            action={{ to: '/', label: t('app.home') }}
          />
        ) : (
          <>
            <GameListFilters
              topics={topics}
              forms={forms}
              topic={topic}
              form={form}
              onTopicChange={setTopic}
              onFormChange={setForm}
              onClear={() => {
                setTopic('all');
                setForm('all');
              }}
              filteredCount={filtered.length}
              totalCount={games.length}
            />

            {filtered.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title={t('subject.noMatch')}
                  hint={t('subject.noMatchHint')}
                  action={{ to: `/subject/${subjectId}`, label: t('subject.clearFilters') }}
                />
              </div>
            ) : (
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((g) => (
                  <li key={g.id}>
                    <GameCard
                      game={g}
                      subjectName={getSubjectName(subjectId, lang === 'zh' ? 'zh' : 'en')}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <div className="mt-8">
        <Link to="/" className="btn-ghost-sm">
          ← {t('app.home')}
        </Link>
      </div>
    </div>
  );
}
