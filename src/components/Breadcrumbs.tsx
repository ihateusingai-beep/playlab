import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';

export interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const { t } = useLanguage();
  const normalized = crumbs.length > 0 && crumbs[0]?.label === t('app.home')
    ? crumbs
    : [{ label: t('app.home'), to: '/' }, ...crumbs];

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {normalized.map((c, i) => {
          const last = i === normalized.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.to && !last ? (
                <Link to={c.to} className="hover:text-slate-900 hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? 'font-semibold text-slate-900' : ''}>
                  {c.label}
                </span>
              )}
              {!last && <span aria-hidden="true" className="text-slate-300">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
