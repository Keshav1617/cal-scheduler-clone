import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link2, Clock, BookOpen, Users, LayoutGrid, Route, Zap, BarChart3, Settings, ExternalLink, Gift, User, ChevronDown, Search } from 'lucide-react';
import { clsx } from 'clsx';

const mainNavItems = [
  { to: '/admin/event-types', label: 'Event types', icon: Link2 },
  { to: '/admin/bookings', label: 'Bookings', icon: BookOpen },
  { to: '/admin/availability', label: 'Availability', icon: Clock },
];

const disabledNavItems = [
  { label: 'Teams', icon: Users },
];

const appsNavItems = [
  { to: '#', label: 'App store' },
  { to: '#', label: 'Installed apps' },
];

const insightsNavItems = [
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '#', label: 'Routing' },
  { to: '#', label: 'Router position' },
  { to: '#', label: 'Call history' },
  { to: '#', label: 'Wrong routing' },
];

const bottomNavItems = [
  { to: '/u/keshav', label: 'View public page', icon: ExternalLink },
  { to: '#', label: 'Copy public page link', icon: Link2 },
  { to: '#', label: 'Refer and earn', icon: Gift },
  { to: '#', label: 'Settings', icon: Settings },
];

function Sidebar({ onClose }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-800 bg-black px-3 py-4 select-none">

      <div className="mb-6 px-3">
        <div className="flex items-center justify-between">
          <div className="relative">
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 hover:bg-zinc-800 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <div className="relative">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 overflow-hidden ring-1 ring-zinc-700">
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-black bg-green-500" />
              </div>
              <span className="text-sm font-semibold text-white">Keshav</span>
              <ChevronDown className={clsx("h-3 w-3 text-zinc-500 transition-transform", profileOpen && "rotate-180")} />
            </div>

            {profileOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-[#111111] shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-1 space-y-0.5">
                  {[
                    { label: 'My profile', icon: User },
                    { label: 'My settings', icon: Settings },
                    { label: 'Out of office', icon: Clock },
                    { label: 'Roadmap', icon: BookOpen },
                    { label: 'Help', icon: BarChart3 },
                    { label: 'Download app', icon: ChevronDown, isRight: true },
                  ].map(item => (
                    <button key={item.label} className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all group">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.isRight && <ChevronDown className="h-3 w-3 -rotate-90 group-hover:text-white" />}
                    </button>
                  ))}
                  <div className="h-[1px] bg-zinc-800 my-1 mx-2" />
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                    <ExternalLink className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto custom-scrollbar pr-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/admin/bookings'}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                )
              }
              onClick={onClose}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
        {disabledNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-all duration-200"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}

        {/* Apps Section */}
        <div className="pt-2">
          <button
            onClick={() => setAppsOpen(!appsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="h-4 w-4" />
              <span>Apps</span>
            </div>
            <ChevronDown className={clsx("h-3.5 w-3.5 text-zinc-600 transition-transform", appsOpen && "rotate-180")} />
          </button>
          {appsOpen && (
            <div className="ml-9 space-y-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
              {appsNavItems.map(item => (
                <NavLink key={item.label} to={item.to} className="block px-3 py-1.5 text-[13px] font-medium text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all">
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <NavLink to="#" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-zinc-900/50 hover:text-white">
          <Route className="h-4 w-4" />
          <span>Routing</span>
        </NavLink>

        <NavLink to="#" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-zinc-900/50 hover:text-white">
          <Zap className="h-4 w-4" />
          <span>Workflows</span>
        </NavLink>

        {/* Insights Section */}
        <div className="pt-2">
          <button
            onClick={() => setInsightsOpen(!insightsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="h-4 w-4" />
              <span>Insights</span>
            </div>
            <ChevronDown className={clsx("h-3.5 w-3.5 text-zinc-600 transition-transform", insightsOpen && "rotate-180")} />
          </button>
          {insightsOpen && (
            <div className="ml-9 space-y-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
              {insightsNavItems.map(item => (
                <NavLink key={item.label} to={item.to} className="block px-3 py-1.5 text-[13px] font-medium text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all">
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="mt-4 space-y-0.5 border-t border-zinc-900 pt-4">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-zinc-900 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;

