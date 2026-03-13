import clsx from 'clsx';

const variantClasses = {
  success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
  warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
  danger: 'bg-red-500/15 text-red-300 border border-red-500/40',
  info: 'bg-brand-light/20 text-brand border border-brand/40',
  neutral: 'bg-slate-700/60 text-slate-100 border border-slate-500/60',
};

function Badge({ variant = 'neutral', children, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;

