import { Link, useLocation } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { PLATFORM_NAME } from '../config';

export default function Header() {
  const { lang, toggle, t } = useLanguage();
  const location = useLocation();
  const onProfile = location.pathname === '/profile';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          aria-label={t('app.home')}
          className="flex items-center gap-2.5 text-slate-900"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            P
          </span>
          <span className="text-base font-bold sm:text-lg">{PLATFORM_NAME}</span>
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-1.5">
          <Link
            to="/profile"
            aria-current={onProfile ? 'page' : undefined}
            className={
              'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ' +
              (onProfile
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
            }
          >
            {t('app.profile')}
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="btn-ghost-sm"
            aria-label="Toggle language"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </nav>
      </div>
    </header>
  );
}
