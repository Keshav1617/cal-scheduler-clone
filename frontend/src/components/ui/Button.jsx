import React from 'react';
import clsx from 'clsx';
import Spinner from './Spinner';

const baseClasses =
  'inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand disabled:opacity-60 disabled:cursor-not-allowed';

const variantClasses = {
  primary: 'bg-white text-black border-transparent hover:bg-zinc-200',
  secondary: 'bg-transparent text-white border-zinc-800 hover:bg-zinc-900',
  ghost: 'bg-transparent border-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white',
  danger: 'bg-red-600 text-white border-transparent hover:bg-red-700',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4',
  lg: 'h-11 px-6 text-base',
};

const Button = React.forwardRef(
  ({ variant = 'primary', size = 'md', isLoading = false, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

