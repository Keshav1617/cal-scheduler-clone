import { CalendarX2 } from 'lucide-react';
import Button from './Button';

function EmptyState({ icon: Icon = CalendarX2, title, subtitle, ctaLabel, onCtaClick }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-brand">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      {ctaLabel && onCtaClick && (
        <Button variant="primary" size="md" className="mt-4" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

