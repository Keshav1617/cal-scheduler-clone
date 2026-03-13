import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { getPublicEventType, getAvailableSlots, createBooking } from '../../api/publicApi';
import Button from '../../components/ui/Button';
import Calendar from '../../components/booking-page/Calendar';
import TimeSlotPicker from '../../components/booking-page/TimeSlotPicker';
import { 
  Clock, Globe, ChevronLeft, Calendar as CalendarIcon, Video, 
  MapPin, Plus, X
} from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

// v1.0.1 - Force refresh and robust JSON parsing

function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pushToast = useToastStore((s) => s.pushToast);

  const [eventType, setEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', notes: '', customAnswers: {} });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getPublicEventType(slug);
        if (isMounted) {
          setEventType(res.data);
          setSelectedDuration(res.data.duration);
        }
      } catch (err) {
        pushToast({ type: 'error', title: 'Not found' });
      } finally {
        if (isMounted) setLoadingEvent(false);
      }
    })();
    return () => { isMounted = false; };
  }, [slug, pushToast]);

  useEffect(() => {
    if (!eventType) return;
    let isMounted = true;
    setLoadingSlots(true);
    (async () => {
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await getAvailableSlots(eventType.slug, dateStr, userTimezone);
        if (isMounted) {
          setAvailableSlots(res.data?.available || []);
          setBookedSlots(res.data?.booked || []);
        }
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    })();
    return () => { isMounted = false; };
  }, [eventType, selectedDate, userTimezone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventType || !selectedTime) return;
    setSubmitting(true);
    try {
      const finalNotes = form.guestEmail 
        ? `${form.notes ? form.notes + '\n\n' : ''}Guest: ${form.guestEmail}`
        : form.notes;

      const res = await createBooking({
        eventTypeId: eventType.id,
        bookerName: form.name,
        bookerEmail: form.email,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        notes: finalNotes,
        customAnswers: form.customAnswers,
        timezone: userTimezone,
        duration: selectedDuration,
        location: eventType.location
      });
      pushToast({ type: 'success', title: 'Confirmed' });
      navigate(`/confirm/${res.data.uid}`);
    } catch (err) {
      pushToast({ type: 'error', title: 'Booking failed', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedTime('');
  };

  if (loadingEvent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!eventType) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-white">404</h1>
          <p className="mt-2 text-zinc-500">This booking link no longer exists.</p>
        </div>
      </div>
    );
  }

  const getParsedArray = (value, defaultValue = []) => {
    try {
      if (!value) return defaultValue;
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const getParsedObject = (value, defaultValue = {}) => {
    try {
      if (!value) return defaultValue;
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const parsedDurations = getParsedArray(eventType.durations, [eventType.duration]);
  const parsedLocation = getParsedObject(eventType.location, { type: 'cal_video' });
  const customQuestions = getParsedArray(eventType.custom_questions, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans flex flex-col items-center justify-center p-4">
      
      <div className={`w-full max-w-5xl bg-[#0A0A0A] border border-zinc-900 rounded-[24px] overflow-hidden flex flex-col lg:flex-row shadow-[0_32px_128px_rgba(0,0,0,0.8)] ${step === 2 ? 'max-w-3xl' : ''}`}>
        
        {/* Left Section: Event Info */}
        <div className={`w-full lg:w-[320px] p-8 border-b lg:border-b-0 lg:border-r border-zinc-900 flex flex-col ${step === 2 ? 'sm:w-[280px]' : ''}`}>
           <div className="flex flex-col items-start gap-4 mb-10">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                 <span className="text-sm font-bold text-zinc-400">{userTimezone[0]}</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1">Keshav</span>
                 <h1 className="text-[22px] font-bold text-white leading-tight">{eventType.title}</h1>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-3 text-[14px] font-bold text-zinc-400">
                 <Clock size={16} className="text-zinc-600" />
                 <span>{selectedDuration}m</span>
              </div>
              <div className="flex items-center gap-3 text-[14px] font-bold text-zinc-400">
                 {parsedLocation.type === 'cal_video' ? <Video size={16} className="text-zinc-600" /> : <MapPin size={16} className="text-zinc-600" />}
                 <span>{parsedLocation.type === 'cal_video' ? 'Cal Video' : 'In Person'}</span>
              </div>
              <div className="flex items-center gap-3 text-[14px] font-bold text-zinc-400">
                 <Globe size={16} className="text-zinc-600" />
                 <span className="text-zinc-500">{userTimezone}</span>
              </div>

              {step === 2 && (
                 <div className="pt-4 mt-4 border-t border-zinc-900 flex items-center gap-3 text-[14px] font-bold text-emerald-500">
                    <CalendarIcon size={16} />
                    <span>{selectedTime && format(parseISO(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`), 'h:mm a')}, {format(selectedDate, 'EEE, d MMM')}</span>
                 </div>
              )}
           </div>

           {eventType.description && (
              <div className="mt-8 pt-8 border-t border-zinc-900">
                 <p className="text-[13px] leading-relaxed text-zinc-500 font-medium">{eventType.description}</p>
              </div>
           )}

           <div className="mt-auto pt-10">
              <div className="flex items-center gap-2 text-zinc-800">
                 <span className="text-[9px] font-black tracking-[0.2em] uppercase">Powered by</span>
                 <span className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-600">Cal.com</span>
              </div>
           </div>
        </div>

        {/* Right Section: Interactive Content */}
        <div className="flex-1 bg-black flex flex-col">
           {step === 1 ? (
              <div className="flex flex-col md:flex-row h-full">
                 {/* Middle: Calendar */}
                 <div className="flex-1 p-8 sm:p-10">
                    <Calendar 
                       selectedDate={selectedDate}
                       onDateSelect={(d) => {
                          setSelectedDate(d);
                          setSelectedTime('');
                       }}
                    />
                 </div>
                 {/* Right: Slots */}
                 <div className="w-full md:w-[320px] border-t md:border-t-0 md:border-l border-zinc-900 p-8 flex flex-col bg-[#050505]">
                    <div className="mb-6 flex items-center justify-between">
                       <h3 className="text-[14px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="text-zinc-600">{format(selectedDate, 'EEEE').toUpperCase()}</span>
                          <span className="text-white">{format(selectedDate, 'd')}</span>
                       </h3>
                    </div>
                    <div className="flex-1 min-h-[400px]">
                       <TimeSlotPicker 
                          slots={availableSlots}
                          bookedSlots={bookedSlots}
                          selectedTime={selectedTime}
                          onTimeSelect={setSelectedTime}
                          onConfirm={() => setStep(2)}
                          loading={loadingSlots}
                       />
                    </div>
                 </div>
              </div>
           ) : (
              <div className="h-full p-8 sm:p-12 overflow-y-auto max-w-2xl mx-auto w-full bg-black">
                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[11px] font-black tracking-widest uppercase text-zinc-500 ml-1">Your Name *</label>
                          <input
                             type="text"
                             required
                             className="w-full h-11 rounded-xl border border-zinc-800 bg-[#0A0A0A] px-4 text-[14px] font-medium text-white placeholder-zinc-700 transition-all focus:border-white focus:outline-none focus:ring-0"
                             value={form.name}
                             onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[11px] font-black tracking-widest uppercase text-zinc-500 ml-1">Email address *</label>
                          <input
                             type="email"
                             required
                             className="w-full h-11 rounded-xl border border-zinc-800 bg-[#0A0A0A] px-4 text-[14px] font-medium text-white placeholder-zinc-700 transition-all focus:border-white focus:outline-none focus:ring-0"
                             value={form.email}
                             onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          />
                       </div>

                       {customQuestions.map((q, idx) => (
                          <div key={idx} className="space-y-2">
                             <label className="text-[11px] font-black tracking-widest uppercase text-zinc-500 ml-1">
                                {q.label} {q.required && <span className="text-zinc-700">*</span>}
                             </label>
                             {q.type === 'textarea' ? (
                                <textarea
                                   rows={3}
                                   value={form.customAnswers?.[q.id] || ''}
                                   onChange={(e) => setForm(prev => ({
                                      ...prev,
                                      customAnswers: { ...prev.customAnswers, [q.id]: e.target.value }
                                   }))}
                                   required={q.required}
                                   className="w-full rounded-xl border border-zinc-800 bg-[#0A0A0A] p-4 text-[14px] font-medium text-white placeholder-zinc-700 transition-all focus:border-white focus:outline-none focus:ring-0 resize-none"
                                />
                             ) : (
                                <input
                                   type={q.type || 'text'}
                                   value={form.customAnswers?.[q.id] || ''}
                                   onChange={(e) => setForm(prev => ({
                                      ...prev,
                                      customAnswers: { ...prev.customAnswers, [q.id]: e.target.value }
                                   }))}
                                   required={q.required}
                                   className="w-full h-11 rounded-xl border border-zinc-800 bg-[#0A0A0A] px-4 text-[14px] font-medium text-white placeholder-zinc-700 transition-all focus:border-white focus:outline-none focus:ring-0"
                                />
                             )}
                          </div>
                       ))}

                       <div className="space-y-2">
                          <label className="text-[11px] font-black tracking-widest uppercase text-zinc-500 ml-1">Additional notes</label>
                          <textarea
                             rows={3}
                             value={form.notes}
                             onChange={(e) => setForm({ ...form, notes: e.target.value })}
                             className="w-full rounded-xl border border-zinc-800 bg-[#0A0A0A] p-4 text-[14px] font-medium text-white placeholder-zinc-700 transition-all focus:border-white focus:outline-none focus:ring-0 resize-none"
                             placeholder="Share anything that will help prepare for our meeting."
                          />
                       </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-900 flex items-center justify-between gap-4">
                       <button 
                          type="button"
                          onClick={handleBack}
                          className="text-sm font-bold text-zinc-500 hover:text-white transition-colors"
                       >
                          Cancel
                       </button>
                       <Button
                          type="submit"
                          variant="primary"
                          className="bg-white text-black px-8 h-11 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98]"
                          isLoading={submitting}
                       >
                          Confirm
                       </Button>
                    </div>
                 </form>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
