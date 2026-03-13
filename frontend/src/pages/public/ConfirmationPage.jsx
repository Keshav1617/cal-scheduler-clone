import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConfirmation } from '../../api/publicApi';
import { CheckCircle2, ChevronLeft, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';

function ConfirmationPage() {
  const { uid } = useParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getConfirmation(uid);
        if (isMounted) setBooking(res.data);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [uid]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-white">404</h1>
          <p className="mt-2 text-zinc-500">Booking not found.</p>
        </div>
      </div>
    );
  }

  const startTime = parseISO(booking.start_time);
  const endTime = parseISO(booking.end_time);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <div className="mx-auto flex min-h-screen flex-col items-start justify-center p-6 sm:p-10">
        
        <Link 
           to="/admin/bookings" 
           className="mb-8 flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
        >
           <ChevronLeft size={16} />
           Back to bookings
        </Link>

        <div className="mx-auto w-full max-w-[540px] animate-in fade-in slide-in-from-bottom-6 duration-700">
           <div className="overflow-hidden rounded-[24px] border border-zinc-900 bg-[#0A0A0A] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
              <div className="flex flex-col items-center p-6 sm:p-12 text-center">
                 <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
                   <CheckCircle2 size={32} />
                 </div>
                 
                 <h1 className="text-2xl font-black tracking-tight text-white mb-3">
                   This meeting is scheduled
                 </h1>
                 <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[340px]">
                   We sent an email with a calendar invitation with the details to everyone.
                 </p>

                  <div className="mt-8 sm:mt-12 w-full border-t border-zinc-900/50 pt-8 sm:pt-10 space-y-6 sm:space-y-8 text-left">
                     <div className="flex flex-col sm:flex-row gap-4 sm:gap-10">
                        <span className="w-full sm:w-24 text-[11px] sm:text-[13px] font-black uppercase tracking-widest text-zinc-600">
What</span>
                       <span className="flex-1 text-[15px] font-bold text-zinc-300 leading-snug">
                          {booking.event_title} between {booking.host_name} and {booking.booker_name}
                       </span>
                    </div>

                    <div className="flex gap-10">
                       <span className="w-24 text-[13px] font-black uppercase tracking-widest text-zinc-600">When</span>
                       <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[15px] font-bold text-zinc-300">
                             {format(startTime, 'EEEE, MMMM d, yyyy')}
                          </span>
                          <span className="text-[15px] font-bold text-zinc-500">
                             {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')} ({Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ')})
                          </span>
                       </div>
                    </div>

                    <div className="flex gap-10">
                       <span className="w-24 text-[13px] font-black uppercase tracking-widest text-zinc-600">Who</span>
                       <div className="flex-1 space-y-4">
                          <div className="flex flex-col">
                             <div className="flex items-center gap-2">
                                <span className="text-[15px] font-bold text-zinc-300">{booking.host_name}</span>
                                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-1.5 py-0.5 rounded uppercase border border-indigo-500/20">Host</span>
                             </div>
                             <span className="text-[13px] font-bold text-zinc-500">{booking.host_email}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[15px] font-bold text-zinc-300">{booking.booker_name}</span>
                             <span className="text-[13px] font-bold text-zinc-500">{booking.booker_email}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-10">
                       <span className="w-24 text-[13px] font-black uppercase tracking-widest text-zinc-600">Where</span>
                       <div className="flex-1 flex items-center gap-2 group cursor-pointer">
                          <span className="text-[15px] font-bold text-zinc-300">Cal Video</span>
                          <ExternalLink size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                       </div>
                    </div>

                    {booking.notes && (
                       <div className="flex gap-10">
                          <span className="w-24 text-[13px] font-black uppercase tracking-widest text-zinc-600">Additional notes</span>
                          <span className="flex-1 text-[15px] font-bold text-zinc-500 leading-relaxed italic">
                             {booking.notes}
                          </span>
                       </div>
                    )}
                 </div>

                 <div className="mt-12 w-full border-t border-zinc-900/50 pt-8">
                    <p className="text-[13px] font-bold text-zinc-500">
                       Need to make a change? <span className="text-zinc-400 underline cursor-pointer hover:text-white">Reschedule</span> or <span className="text-zinc-400 underline cursor-pointer hover:text-white">Cancel</span>
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
