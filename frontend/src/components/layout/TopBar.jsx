import { Search, Plus, Menu } from 'lucide-react';
import { useMatches } from 'react-router-dom';

function TopBar({ onMenuClick }) {
  const matches = useMatches();
  const active = [...matches].reverse().find((m) => m.handle && m.handle.title);
  const title = active?.handle?.title || 'Event types';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800 bg-black px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-1 text-zinc-400 hover:bg-zinc-900 hover:text-white md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Actions are handled within pages for better context */}
      </div>
    </header>
  );
}

export default TopBar;

