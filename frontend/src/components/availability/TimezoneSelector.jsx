const TIMEZONES = Intl.supportedValuesOf('timeZone');

function TimezoneSelector({ value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white shadow-sm transition-all focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 pointer-events-auto"
      >
        {TIMEZONES.map((tz) => (
          <option key={tz} value={tz} className="bg-zinc-900">
            {tz.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}

export default TimezoneSelector;
