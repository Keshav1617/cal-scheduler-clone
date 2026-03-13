import { useState, Fragment } from 'react';
import { useBookings } from '../../hooks/useBookings';
import BookingCard from '../../components/bookings/BookingCard';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import BookingDetailModal from '../../components/bookings/BookingDetailModal';
import { Calendar, Filter, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { clsx } from 'clsx';

function BookingsPage() {
  const [tab, setTab] = useState('upcoming');
  const [confirmUid, setConfirmUid] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [page, setPage] = useState(1);
  const [limitNum, setLimitNum] = useState(10);
  const { data, isLoading, cancelBooking } = useBookings(tab, page, limitNum);
  const bookings = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, range: { start: 0, end: 0 }, total: 0 };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'unconfirmed', label: 'Unconfirmed' },
    { id: 'recurring', label: 'Recurring' },
    { id: 'past', label: 'Past' },
    { id: 'cancelled', label: 'Canceled' },
  ];

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    setLimitNum(newLimit);
    setPage(1);
  };

  const openConfirm = (uid) => setConfirmUid(uid);
  const closeConfirm = () => setConfirmUid(null);

  const handleConfirmCancel = async () => {
    if (!confirmUid) return;
    setConfirmLoading(true);
    try {
      await cancelBooking(confirmUid);
      closeConfirm();
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="max-w-full pb-10 space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="hidden sm:block">
          <h1 className="text-[22px] font-bold text-white tracking-tight">Bookings</h1>
          <p className="mt-1.5 text-[14px] font-medium text-zinc-400">
            See upcoming and past events booked through your event type links.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={clsx(
                "px-3 py-1.5 text-[14px] font-bold rounded-lg transition-all whitespace-nowrap",
                tab === t.id 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-500 hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[14px] font-bold text-zinc-500 hover:text-white transition-all bg-zinc-900 border border-zinc-800">
            <Filter size={14} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[14px] font-bold text-zinc-500 hover:text-white transition-all bg-zinc-900 border border-zinc-800">
             Saved filters
             <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-visible">
        <div className="bg-zinc-900/50 px-6 py-4 border-b border-zinc-800 rounded-t-2xl">
          <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest">Today</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
               <Calendar size={24} className="text-zinc-600" />
            </div>
            <h2 className="text-[16px] font-bold text-white mb-1">No {tab} bookings</h2>
            <p className="text-[13px] text-zinc-500 font-medium">
              You have no {tab} bookings.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={() => openConfirm(b.uid)}
                onViewDetails={() => setSelectedBooking(b)}
              />
            ))}
          </div>
        )}

        <div className="px-4 py-4 border-t border-zinc-800 flex items-center justify-between rounded-b-2xl">
          <div className="flex items-center gap-2">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[13px] font-bold text-zinc-200 hover:bg-zinc-800 transition-all">
                {limitNum}
                <ChevronDown size={14} className="text-zinc-500" />
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
                <Menu.Items className="absolute left-0 bottom-full mb-2 w-20 origin-bottom-left rounded-lg bg-[#0A0A0A] border border-zinc-800 shadow-2xl focus:outline-none overflow-hidden py-1">
                  {[10, 25, 50, 100].map((val) => (
                    <Menu.Item key={val}>
                      {({ active }) => (
                        <button
                          onClick={() => handleLimitChange(val)}
                          className={clsx(
                            active ? 'bg-zinc-900 text-white' : 'text-zinc-400',
                            'flex w-full items-center px-4 py-1.5 text-[13px] font-bold transition-colors'
                          )}
                        >
                          {val}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
            <span className="text-[13px] font-bold text-zinc-500 ml-1">rows per page</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[13px] font-bold text-zinc-500">
              {meta.range?.start || (bookings.length > 0 ? 1 : 0)}-{meta.range?.end || bookings.length} of {meta.total || bookings.length}
            </span>
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 disabled={meta.page <= 1}
                 className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-all bg-zinc-900"
               >
                  <ChevronLeft size={18} />
               </button>
               <button 
                 onClick={() => setPage(p => p + 1)}
                 disabled={meta.page >= (meta.totalPages || 1)}
                 className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-all bg-zinc-900"
               >
                  <ChevronRight size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmUid}
        title="Cancel this booking?"
        description="This action cannot be undone. An email will be sent to the booker to notify them of the cancellation."
        confirmLabel="Cancel Booking"
        onCancel={closeConfirm}
        onConfirm={handleConfirmCancel}
        loading={confirmLoading}
      />

      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}

export default BookingsPage;
