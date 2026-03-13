import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import TimeSelect from '../ui/TimeSelect';

function DateOverrideModal({ isOpen, onClose, onSave }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [slots, setSlots] = useState([{ startTime: '09:00', endTime: '17:00' }]);

  const toggleDate = (day) => {
    const isSelected = selectedDates.some(d => isSameDay(d, day));
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, day)));
    } else {
      setSelectedDates([...selectedDates, day]);
    }
  };

  const handleAddSlot = () => {
    const lastSlot = slots[slots.length - 1];
    let newStart = '17:00';
    let newEnd = '18:00';
    if (lastSlot) {
      const [h, m] = lastSlot.endTime.split(':').map(Number);
      newStart = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      newEnd = `${String(Math.min(h + 1, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    setSlots([...slots, { startTime: newStart, endTime: newEnd }]);
  };

  const handleRemoveSlot = (index) => {
    if (slots.length === 1) return;
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const handleSave = () => {
    if (selectedDates.length === 0) return;
    
    const newOverrides = [];
    selectedDates.forEach(date => {
       if (isUnavailable) {
          newOverrides.push({
             date: format(date, 'yyyy-MM-dd'),
             isBlocked: true,
             startTime: null,
             endTime: null
          });
       } else {
          slots.forEach(slot => {
             newOverrides.push({
                date: format(date, 'yyyy-MM-dd'),
                isBlocked: false,
                startTime: slot.startTime,
                endTime: slot.endTime
             });
          });
       }
    });
    
    onSave(newOverrides);
    onClose();
    // Reset state
    setSelectedDates([]);
    setIsUnavailable(false);
    setSlots([{ startTime: '09:00', endTime: '17:00' }]);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-2 mb-6">
        <span className="text-base font-bold text-white tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map(day => (
          <div key={day} className="text-[11px] font-bold text-zinc-500 text-center py-2 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-2">
        {allDays.map((d, i) => {
          const isSelected = selectedDates.some(sd => isSameDay(sd, d));
          const isCurrentMonth = isSameMonth(d, monthStart);
          const isToday = isSameDay(d, new Date());

          return (
            <button
              key={i}
              type="button"
              onClick={() => toggleDate(d)}
              className={`
                aspect-square flex flex-col items-center justify-center text-[15px] font-bold rounded-xl transition-all relative
                ${!isCurrentMonth ? 'text-zinc-800' : isSelected ? 'bg-white text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}
                ${isToday && !isSelected ? 'border border-zinc-700' : ''}
              `}
            >
              {format(d, 'd')}
              {isToday && !isSelected && <div className="absolute bottom-2 w-1 h-1 bg-white rounded-full" />}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-4xl bg-[#0A0A0A] rounded-[24px] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px] animate-in zoom-in-95 duration-200">
        {/* Left Pane - Calendar */}
        <div className="flex-1 p-10 border-r border-zinc-800/50">
           <h2 className="text-2xl font-bold text-white mb-10 tracking-tight">Select the dates to override</h2>
           {renderHeader()}
           {renderDays()}
           {renderCells()}
        </div>

        {/* Right Pane - Settings */}
        <div className="w-full md:w-[380px] p-10 flex flex-col bg-[#111111]">
           <div className="flex-1 space-y-10">
              <div className="space-y-6">
                 <h3 className="text-base font-bold text-white tracking-tight">Which hours are you free?</h3>
                 
                 {!isUnavailable && (
                    <div className="space-y-3">
                       {slots.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-3 animate-in fade-in duration-200">
                             <div className="flex items-center gap-2 flex-1">
                                <TimeSelect 
                                  value={slot.startTime} 
                                  onChange={(val) => updateSlot(idx, 'startTime', val)}
                                  className="flex-1"
                                />
                                <span className="text-zinc-700 font-bold">–</span>
                                <TimeSelect 
                                  value={slot.endTime} 
                                  onChange={(val) => updateSlot(idx, 'endTime', val)}
                                  className="flex-1"
                                />
                             </div>
                             
                             {idx === 0 ? (
                                <button 
                                  type="button"
                                  onClick={handleAddSlot}
                                  className="p-3 bg-zinc-800/50 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800/50"
                                >
                                   <Plus size={20} />
                                </button>
                             ) : (
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveSlot(idx)}
                                  className="p-3 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-red-400/10 transition-all"
                                >
                                   <Trash2 size={20} />
                                </button>
                             )}
                          </div>
                       ))}
                    </div>
                 )}

                 <div className="flex items-center gap-4 py-4 px-1">
                    <button 
                       type="button"
                       onClick={() => setIsUnavailable(!isUnavailable)}
                       className={`h-6 w-11 shrink-0 rounded-full transition-all duration-300 ${isUnavailable ? 'bg-white' : 'bg-zinc-800'} relative shadow-inner`}
                    >
                       <div className={`absolute top-1 h-4 w-4 rounded-full bg-black transition-all duration-300 ${isUnavailable ? 'left-6' : 'left-1'}`} />
                    </button>
                    <span className="text-[15px] font-bold text-white tracking-tight">Mark unavailable (All day)</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-end gap-4 pt-8 border-t border-zinc-800/50 mt-auto">
              <button 
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-zinc-500 hover:text-white transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleSave}
                disabled={selectedDates.length === 0}
                className="bg-white text-black px-10 py-3 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                Save override
              </button>
           </div>
        </div>
      </div>
    </Modal>
  );
}

export default DateOverrideModal;
