import { Link } from 'react-router';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  hint?: string;
  action?: { to: string; label: string };
  icon?: ReactNode;
}

export default function EmptyState({ title, hint, action, icon }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
      {icon ?? (
        <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-2xl">
          🎮
        </div>
      )}
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
      {action && (
        <Link to={action.to} className="btn-primary mt-1">
          {action.label}
        </Link>
      )}
    </div>
  );
}
