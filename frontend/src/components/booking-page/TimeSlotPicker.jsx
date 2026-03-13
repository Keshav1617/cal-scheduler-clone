import { Check, Lock } from 'lucide-react';
import Button from '../ui/Button';

function TimeSlotPicker({ slots, bookedSlots = [], selectedTime, onTimeSelect, onConfirm, loading }) {
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'am' : 'am'; // Note: slots already normalized to am/pm in displayed text if we want, but HH:mm is base
    // Actually our displayTime in the API for now is HH:mm
    const h12 = h % 12 || 12;
    const actualAmPm = h >= 12 ? 'pm' : 'am';
    return `${h12}:${minutes}${actualAmPm}`;
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-zinc-900" />
        ))}
      </div>
    );
  }

  if (slots.length === 0 && bookedSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 text-center">
        <p className="text-sm text-zinc-500 font-medium">No slots available for this date.</p>
      </div>
    );
  }

  // Combine all slots in order: available + booked, displayed together
  const allSlots = [
    ...slots.map(t => ({ time: t, isBooked: false })),
    ...bookedSlots.map(t => ({ time: t, isBooked: true })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {allSlots.map(({ time, isBooked }) => {
        const isSelected = selectedTime === time;
        return (
          <div key={time} className="flex gap-2">
            <button
              onClick={() => !isBooked && onTimeSelect(time)}
              disabled={isBooked}
              className={`
                flex-1 flex items-center justify-center py-3.5 rounded-lg text-sm font-bold transition-all border
                ${isBooked
                  ? 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed opacity-60'
                  : isSelected 
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-400' 
                    : 'bg-black border-zinc-800/80 text-white hover:border-zinc-500 hover:bg-zinc-900/50'
                }
              `}
            >
              <div className="flex items-center gap-2">
                {isBooked ? (
                  <>
                    <Lock size={12} className="text-zinc-700" />
                    <span className="line-through">{formatTime(time)}</span>
                  </>
                ) : (
                  <>
                    <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-zinc-500' : 'bg-[#29cc16]'}`} />
                    <span>{formatTime(time)}</span>
                  </>
                )}
              </div>
            </button>
            {isSelected && !isBooked && (
              <Button
                size="sm"
                onClick={onConfirm}
                className="bg-white text-black hover:bg-zinc-200 min-w-[100px] font-bold h-auto py-3.5 rounded-lg transition-all"
              >
                Confirm
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TimeSlotPicker;
