import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useGames } from '../contexts/GameContext';
import { PLATFORM_NAME } from '../config';

export default function Home() {
  const { t, lang } = useLanguage();
  const { subjects } = useGames();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-card sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-100">
          {t('app.welcome')}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold sm:text-5xl">{PLATFORM_NAME}</h1>
        <p className="mt-3 max-w-2xl text-sm text-brand-50 sm:text-base">
          {t('app.subtitle')}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            {t('app.tagline')}
          </span>
        </div>
        <a
          href="#subjects"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow transition-colors hover:bg-brand-50"
        >
          {t('app.startPlaying')} →
        </a>
      </section>

      {/* Subject grid */}
      <section id="subjects" className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {lang === 'zh' ? '科目' : 'Subjects'}
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {subjects.map((s) => (
            <li key={s.id}>
              <Link
                to={`/subject/${s.id}`}
                className="card card-hover group flex h-full flex-col gap-1.5 p-4"
              >
                <span className="text-base font-bold text-slate-900">
                  {lang === 'zh' ? s.nameZh : s.name}
                </span>
                <span className="text-xs text-slate-500 line-clamp-2">
                  {lang === 'zh' ? s.descriptionZh : s.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Step n={1} title={t('app.step1Title')} desc={t('app.step1Desc')} />
        <Step n={2} title={t('app.step2Title')} desc={t('app.step2Desc')} />
        <Step n={3} title={t('app.step3Title')} desc={t('app.step3Desc')} />
      </section>

      <p className="mt-8 text-center text-xs text-slate-400">
        {t('app.trophyHint')}
      </p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="mb-1 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {n}
        </span>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}
