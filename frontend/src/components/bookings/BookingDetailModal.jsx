import { CheckCircle2, ExternalLink, X, Calendar, Clock, User, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;

  const startTime = parseISO(booking.start_time);
  const endTime = parseISO(booking.end_time);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[540px] bg-[#0A0A0A] rounded-[24px] border border-zinc-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center px-8 pt-10 pb-6 text-center border-b border-zinc-900/50">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
            <CheckCircle2 size={30} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white mb-1">
            This meeting is scheduled
          </h2>
          <p className="text-zinc-500 text-sm font-medium max-w-[300px] leading-relaxed">
            We sent an email with a calendar invitation with the details to everyone.
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Details */}
        <div className="px-8 py-6 space-y-5">
          {/* What */}
          <div className="flex gap-8">
            <span className="w-28 text-[11px] font-black uppercase tracking-widest text-zinc-600 pt-0.5">What</span>
            <span className="flex-1 text-[14px] font-bold text-zinc-300 leading-snug">
              {booking.event_title} between {booking.host_name} and {booking.booker_name}
            </span>
          </div>

          {/* When */}
          <div className="flex gap-8">
            <span className="w-28 text-[11px] font-black uppercase tracking-widest text-zinc-600 pt-0.5">When</span>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-[14px] font-bold text-zinc-300">
                {format(startTime, 'EEEE, MMMM d, yyyy')}
              </span>
              <span className="text-[14px] font-bold text-zinc-500">
                {format(startTime, 'h:mm a')} – {format(endTime, 'h:mm a')} ({tz.replace('_', ' ')})
              </span>
            </div>
          </div>

          {/* Who */}
          <div className="flex gap-8">
            <span className="w-28 text-[11px] font-black uppercase tracking-widest text-zinc-600 pt-0.5">Who</span>
            <div className="flex-1 space-y-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-zinc-300">{booking.host_name}</span>
                  <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-1.5 py-0.5 rounded uppercase border border-indigo-500/20">Host</span>
                </div>
                <span className="text-[12px] font-bold text-zinc-600">{booking.host_email}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-zinc-300">{booking.booker_name}</span>
                <span className="text-[12px] font-bold text-zinc-600">{booking.booker_email}</span>
              </div>
            </div>
          </div>

          {/* Where */}
          <div className="flex gap-8">
            <span className="w-28 text-[11px] font-black uppercase tracking-widest text-zinc-600 pt-0.5">Where</span>
            <div className="flex-1 flex items-center gap-1.5 group cursor-pointer">
              <span className="text-[14px] font-bold text-zinc-300">Cal Video</span>
              <ExternalLink size={13} className="text-zinc-600 group-hover:text-white transition-colors" />
            </div>
          </div>

          {/* Additional Notes */}
          {booking.notes && (
            <div className="flex gap-8">
              <span className="w-28 text-[11px] font-black uppercase tracking-widest text-zinc-600 pt-0.5">Additional notes</span>
              <span className="flex-1 text-[14px] font-bold text-zinc-500 leading-relaxed italic">
                {booking.notes}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-2 border-t border-zinc-900/50">
          <p className="text-center text-[13px] font-bold text-zinc-500">
            Need to make a change?{' '}
            <span className="text-zinc-400 underline cursor-pointer hover:text-white">Reschedule</span>
            {' '}or{' '}
            <span className="text-zinc-400 underline cursor-pointer hover:text-white">Cancel</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;
