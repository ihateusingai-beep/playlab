import { useNavigate } from 'react-router';
import type { Game } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export interface GameCardProps {
  game: Game;
  subjectName: string;
}

export default function GameCard({ game, subjectName }: GameCardProps) {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const title = (lang === 'zh' && game.titleZh) || game.title;
  const desc = (lang === 'zh' && game.descriptionZh) || game.description;
  const isExternal = !!game.externalUrl;

  const onClick = () => {
    if (isExternal && game.externalUrl) {
      window.open(game.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(`/game/${game.subject}/${game.id}`);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="card card-hover group flex w-full flex-col gap-3 p-4 text-left"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-brand-50 text-xl text-brand-600">
          {game.thumbnail ? (
            <img
              src={game.thumbnail}
              alt=""
              className="h-full w-full rounded-xl object-cover"
              loading="lazy"
            />
          ) : (
            '🎯'
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-slate-900">{title}</h3>
            {game.leaderboard && (
              <span title={t('subject.trophy')} aria-label={t('subject.trophy')} className="text-sm">
                🏆
              </span>
            )}
            {isExternal && (
              <span className="tag bg-amber-100 text-amber-700">
                {t('subject.external')}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">{subjectName}</div>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-slate-600">{desc}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        {game.topic && <span className="tag">{game.topic}</span>}
        <span className="tag">{game.difficulty}</span>
        <span className="tag">{game.estimatedTime}</span>
        {game.author && <span className="tag">{game.author}</span>}
      </div>
      <div className="text-xs font-semibold text-brand-600 group-hover:text-brand-700">
        {isExternal ? t('subject.opensNewTab') : t('subject.clickToPlay')} →
      </div>
    </button>
  );
}
