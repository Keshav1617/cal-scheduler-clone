import { Calendar, Trash2, Plus, Info } from 'lucide-react';
import TimeSelect from '../ui/TimeSelect';
import { format, parseISO } from 'date-fns';
import { clsx } from 'clsx';

function DateOverrides({ overrides, onOverrideChange, onAddClick }) {
  const handleRemoveOverride = (idx) => {
    const updated = [...overrides];
    updated.splice(idx, 1);
    onOverrideChange(updated);
  };

  const handleUpdateOverride = (idx, field, value) => {
    const updated = [...overrides];
    updated[idx] = { ...updated[idx], [field]: value };
    onOverrideChange(updated);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes}${ampm}`;
  };

  const formatDateLabel = (dateStr) => {
     try {
        if (!dateStr) return 'Invalid date';
        const date = parseISO(dateStr);
        return format(date, 'MMM d, yyyy');
     } catch (e) {
        return dateStr;
     }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-900 bg-[#0A0A0A] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
             <h2 className="text-sm font-bold text-white tracking-tight">Date overrides</h2>
             <Info size={15} className="text-zinc-600 hover:text-white transition-colors cursor-help" />
          </div>
        </div>

        <p className="text-[13px] text-zinc-500 font-medium mb-6">
          Add dates when your availability changes from your daily hours.
        </p>

        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 text-[13px] font-bold text-white hover:bg-zinc-900 transition-all bg-transparent"
        >
          <Plus size={16} /> Add an override
        </button>
      </div>

      {overrides.length > 0 && (
        <div className="divide-y divide-zinc-900 rounded-2xl border border-zinc-900 bg-[#0A0A0A] overflow-hidden shadow-sm">
          {overrides.map((override, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-900/40 transition-colors group">
              <div className="flex flex-col gap-0.5">
                 <span className="text-[14px] font-bold text-white uppercase tracking-tight">{formatDateLabel(override.date)}</span>
                  <span className="text-[12px] text-zinc-500 font-medium">{override.isBlocked ? 'Unavailable' : `${formatTime(override.startTime || override.start_time)} - ${formatTime(override.endTime || override.end_time)}`}</span>
              </div>

              <div className="flex items-center gap-4">
                 <button
                    type="button"
                    onClick={() => handleRemoveOverride(idx)}
                    className="p-2 text-zinc-600 hover:text-rose-400 transition-all rounded-lg hover:bg-rose-400/5 opacity-0 group-hover:opacity-100"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DateOverrides;
