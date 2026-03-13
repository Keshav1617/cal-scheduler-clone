import { MoreHorizontal, Video, RefreshCw, Send, MapPin, UserPlus, Info, EyeOff, Flag, XCircle } from 'lucide-react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { clsx } from 'clsx';

function BookingCard({ booking, onCancel, onViewDetails }) {
  const startDate = new Date(booking.start_time);
  const endDate = new Date(booking.end_time);

  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const timeStr = `${startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  }).toLowerCase()} - ${endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  }).toLowerCase()}`;

  const menuItems = [
    { section: 'Edit event', items: [
      { id: 'reschedule', label: 'Reschedule booking', icon: RefreshCw },
      { id: 'request-reschedule', label: 'Request reschedule', icon: Send },
      { id: 'edit-location', label: 'Edit location', icon: MapPin },
      { id: 'add-guests', label: 'Add guests', icon: UserPlus },
    ]},
    { section: 'After event', items: [
      { id: 'view-recordings', label: 'View recordings', icon: Video },
      { id: 'view-details', label: 'View session details', icon: Info, onClick: onViewDetails },
      { id: 'mark-no-show', label: 'Mark as no-show', icon: EyeOff },
    ]},
    { items: [
      { id: 'report', label: 'Report booking', icon: Flag },
      { id: 'cancel', label: 'Cancel event', icon: XCircle, danger: true, onClick: onCancel },
    ]},
  ];

  return (
    <div 
      className="group flex items-start justify-between p-6 hover:bg-zinc-900/40 transition-all duration-300 cursor-pointer"
      onClick={onViewDetails}
    >
      <div className="flex gap-12">
        {/* Date and Time Column */}
        <div className="w-32 flex flex-col gap-1">
          <p className="text-[14px] font-bold text-zinc-200">{dateStr}</p>
          <p className="text-[13px] font-medium text-zinc-500">{timeStr}</p>
          <div className="mt-2 flex items-center gap-1.5 text-blue-500 hover:text-blue-400 cursor-pointer transition-colors" onClick={e => e.stopPropagation()}>
            <Video size={14} />
            <span className="text-[13px] font-bold">Join Cal Video</span>
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-bold text-zinc-200 tracking-tight">
            {booking.event_title} between {booking.host_name || 'Host'} and {booking.booker_name}
          </h3>
          {booking.notes && (
            <p className="text-[13px] font-medium text-zinc-500 italic">
              "{booking.notes}"
            </p>
          )}
          <p className="text-[13px] font-medium text-zinc-500">
            You and {booking.host_name || 'Keshav'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
        <Menu as="div" className="relative">
          <Menu.Button className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all border border-zinc-800 bg-zinc-900/50">
            <MoreHorizontal size={18} />
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
            <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-[#0A0A0A] border border-zinc-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden divide-y divide-zinc-800/50 animate-in fade-in slide-in-from-top-1">
              {menuItems.map((section, sIdx) => (
                <div key={sIdx} className="py-1">
                  {section.section && (
                    <div className="px-4 py-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                      {section.section}
                    </div>
                  )}
                  {section.items.map((item) => (
                    <Menu.Item key={item.id}>
                      {({ active }) => (
                        <button
                          onClick={item.onClick}
                          className={clsx(
                            active 
                              ? (item.danger ? 'bg-red-500/10 text-red-500' : 'bg-zinc-900 text-white') 
                              : (item.danger ? 'text-zinc-500' : 'text-zinc-400'),
                            'group flex w-full items-center px-4 py-2 text-[13px] font-bold gap-3 transition-colors'
                          )}
                        >
                          <item.icon size={15} className={clsx(
                            item.danger ? 'text-red-500/70' : 'text-zinc-500',
                            active && 'scale-110 transition-transform'
                          )} />
                          {item.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

export default BookingCard;
