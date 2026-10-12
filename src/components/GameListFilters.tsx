import { useLanguage } from '../contexts/LanguageContext';

export interface GameListFiltersProps {
  topics: string[];
  forms: string[];
  topic: string;
  form: string;
  onTopicChange: (v: string) => void;
  onFormChange: (v: string) => void;
  onClear: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function GameListFilters({
  topics,
  forms,
  topic,
  form,
  onTopicChange,
  onFormChange,
  onClear,
  filteredCount,
  totalCount,
}: GameListFiltersProps) {
  const { t } = useLanguage();
  const dirty = topic !== 'all' || form !== 'all';

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">{t('subject.topic')}</label>
        <select
          className="input min-w-[10rem]"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        >
          <option value="all">{t('filter.allTopics')}</option>
          {topics.map((tp) => (
            <option key={tp} value={tp}>
              {tp}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">{t('subject.form')}</label>
        <select
          className="input min-w-[10rem]"
          value={form}
          onChange={(e) => onFormChange(e.target.value)}
        >
          <option value="all">{t('filter.allForms')}</option>
          {forms.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={onClear}
        disabled={!dirty}
        className="btn-ghost-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t('subject.clearFilters')}
      </button>
      <div className="ml-auto text-xs text-slate-500">
        {t('subject.showing', filteredCount, totalCount)}
      </div>
    </div>
  );
}
