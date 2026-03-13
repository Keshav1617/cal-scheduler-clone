import { Link2, MoreHorizontal, ExternalLink, Clock, Pencil, Trash2, ArrowUp, ArrowDown, Copy, Code } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function EventTypeCard({ eventType, onEdit, onDelete, onToggle, onMoveUp, onMoveDown, isFirst, isLast, className = '' }) {
  const pushToast = useToastStore((s) => s.pushToast);
  const publicUrl = `${window.location.origin}/book/${eventType.slug}`;
  const displaySlug = `keshav-jha-kqpvdn/${eventType.slug}`;

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(publicUrl);
      pushToast({ type: 'success', title: 'Link copied!' });
    } catch {
      pushToast({ type: 'error', title: 'Could not copy link' });
    }
  };

  return (
    <div 
      onClick={() => onEdit && onEdit(eventType)}
      className={`group relative flex items-center justify-between border-b border-zinc-800 last:border-0 bg-[#0A0A0A] px-6 py-5 transition-colors hover:bg-zinc-900/40 cursor-pointer ${className}`}
    >
      
      {/* Drag Handles (visible on hover) */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex z-10">
         <button 
           onClick={(e) => { e.stopPropagation(); onMoveUp && onMoveUp(eventType); }}
           disabled={isFirst}
           className="p-0.5 text-zinc-500 hover:text-white rounded-full hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500 disabled:hover:border-transparent disabled:cursor-not-allowed"
         >
            <ArrowUp size={12} />
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); onMoveDown && onMoveDown(eventType); }}
           disabled={isLast}
           className="p-0.5 text-zinc-500 hover:text-white rounded-full hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-500 disabled:hover:border-transparent disabled:cursor-not-allowed"
         >
            <ArrowDown size={12} />
         </button>
      </div>

      <div className="flex flex-1 items-center gap-4 min-w-0 sm:pl-4">
        <div className="flex flex-col min-w-0 gap-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-white truncate">
              {eventType.title}
            </h3>
            <span className="text-[14px] text-zinc-500 truncate lowercase">
              /{displaySlug}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium mt-0.5">
            <div className="flex items-center gap-1.5 rounded-md bg-[#1C1C1C] px-2 py-1 ring-1 ring-zinc-800">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-300">{eventType.duration}m</span>
            </div>
            {eventType.description && (
              <p className="truncate max-w-sm text-zinc-400 ml-1">{eventType.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-6 flex-1 max-w-[320px]">
        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          {!eventType.is_active && <span className="text-[14px] font-medium text-blue-400">Hidden</span>}
          <div className="group/toggle relative flex items-center">
            <button
              onClick={(e) => { e.stopPropagation(); onToggle && onToggle(eventType); }}
              className={`flex h-[22px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                eventType.is_active ? 'bg-zinc-200' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                  eventType.is_active ? 'translate-x-[20px] bg-[#0A0A0A]' : 'translate-x-0 bg-zinc-400'
                }`}
              />
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-xs font-bold rounded-md opacity-0 group-hover/toggle:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md hidden sm:block">
              {eventType.is_active ? 'Hide from Profile' : 'Show on Profile'}
            </div>
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center rounded-[8px] border border-zinc-800 bg-[#0A0A0A] shadow-sm" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => { e.stopPropagation(); window.open(publicUrl, '_blank'); }}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border-r border-zinc-800"
            title="Preview"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border-r border-zinc-800 focus:outline-none"
            title="Copy link"
          >
            <Link2 className="h-[18px] w-[18px]" />
          </button>
          
          <Menu as="div" className="relative">
             <Menu.Button className="p-2 w-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none rounded-r-[8px]">
                <MoreHorizontal className="h-[18px] w-[18px]" />
             </Menu.Button>
             <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-zinc-800 rounded-xl bg-[#1C1C1C] border border-zinc-800 shadow-xl focus:outline-none z-50 overflow-hidden">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(eventType); }}
                          className={`${
                            active ? 'bg-zinc-800 text-white' : 'text-zinc-300'
                          } group flex w-full items-center px-4 py-2.5 text-[14px] font-medium`}
                        >
                          <Pencil className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-white" />
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => e.stopPropagation()} // Mock duplicate
                          className={`${
                            active ? 'bg-zinc-800 text-white' : 'text-zinc-300'
                          } group flex w-full items-center px-4 py-2.5 text-[14px] font-medium`}
                        >
                          <Copy className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-white" />
                          Duplicate
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => e.stopPropagation()} // Mock embed
                          className={`${
                            active ? 'bg-zinc-800 text-white' : 'text-zinc-300'
                          } group flex w-full items-center px-4 py-2.5 text-[14px] font-medium`}
                        >
                          <Code className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-white" />
                          {'<>'} Embed
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(eventType); }}
                          className={`${
                            active ? 'bg-red-500/10 text-red-500' : 'text-red-400'
                          } group flex w-full items-center px-4 py-2.5 text-[14px] font-medium hover:text-red-500`}
                        >
                          <Trash2 className="mr-3 h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default EventTypeCard;
