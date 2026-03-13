import clsx from 'clsx';

function Input({ error, className, ...props }) {
  return (
    <input
      className={clsx(
        'w-full h-10 px-3 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition',
        error
          ? 'border-red-300 focus:ring-danger'
          : 'border-gray-200 focus:ring-brand',
        className
      )}
      {...props}
    />
  );
}

export default Input;

