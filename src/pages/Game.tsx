import { Link, useParams } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useGames } from '../contexts/GameContext';
import IframeGame from '../components/IframeGame';
import Leaderboard from '../components/Leaderboard';
import EmptyState from '../components/EmptyState';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Game() {
  const { subject: subjectId = '', gameId = '' } = useParams();
  const { t, lang } = useLanguage();
  const { getSubject, getSubjectName, findGame } = useGames();

  const subject = getSubject(subjectId);
  const game = findGame(subjectId, gameId);

  if (!game) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <Breadcrumbs
          crumbs={
            subject
              ? [
                  {
                    label: lang === 'zh' ? subject.nameZh : subject.name,
                    to: `/subject/${subjectId}`,
                  },
                  { label: gameId },
                ]
              : [{ label: subjectId }, { label: gameId }]
          }
        />
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">
          {t('game.notFound')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t('game.notFoundHint')}</p>
        <div className="mt-6">
          <EmptyState
            title={t('game.notFound')}
            hint={t('game.notFoundHint')}
            action={
              subject
                ? {
                    to: `/subject/${subjectId}`,
                    label: t('game.backTo', lang === 'zh' ? subject.nameZh : subject.name),
                  }
                : { to: '/', label: t('app.home') }
            }
          />
        </div>
      </div>
    );
  }

  const subjectLabel = getSubjectName(subjectId, lang === 'zh' ? 'zh' : 'en');
  const title = (lang === 'zh' && game.titleZh) || game.title;
  const desc = (lang === 'zh' && game.descriptionZh) || game.description;
  const isExternal = !!game.externalUrl;
  const iframeSrc = `/games/${game.subject}/${game.id}/index.html`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <Breadcrumbs
        crumbs={[
          { label: subjectLabel, to: `/subject/${subjectId}` },
          { label: title },
        ]}
      />

      <header className="mt-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{desc}</p>
        </div>
        {game.leaderboard && (
          <span className="tag bg-amber-100 text-amber-700" title={t('subject.trophy')}>
            🏆
          </span>
        )}
        {isExternal && (
          <span className="tag bg-amber-100 text-amber-700">{t('subject.external')}</span>
        )}
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-white p-3 text-xs ring-1 ring-slate-200 sm:grid-cols-4">
        <Field label={t('game.subject')} value={subjectLabel} />
        <Field label={t('game.difficulty')} value={game.difficulty} />
        <Field label={t('game.estimatedTime')} value={game.estimatedTime} />
        {game.author && <Field label={t('game.author')} value={game.author} />}
      </dl>

      <div className="mt-5">
        {isExternal ? (
          <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">{t('game.externalNote')}</p>
            <a
              href={game.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4"
            >
              {t('game.openGame')} ↗
            </a>
          </div>
        ) : (
          <IframeGame game={game} src={iframeSrc} />
        )}
      </div>

      {game.leaderboard && (
        <div className="mt-6">
          <Leaderboard game={game} />
        </div>
      )}

      <div className="mt-8">
        <Link to={`/subject/${subjectId}`} className="btn-ghost-sm">
          ← {t('game.backTo', subjectLabel)}
        </Link>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-0.5 truncate text-slate-900">{value}</dd>
    </div>
  );
}
