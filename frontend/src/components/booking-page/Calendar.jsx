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
  isBefore, 
  startOfDay 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Calendar({ selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <span className="text-base font-bold text-zinc-300">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return (
      <div className="grid grid-cols-7 mb-2 sm:mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] sm:text-[11px] font-bold text-zinc-600 tracking-widest">
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

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, startOfDay(new Date()));
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <div
            key={day.toString()}
            className="relative p-0.5 aspect-square"
          >
            <button
              disabled={isDisabled}
              onClick={() => onDateSelect(cloneDay)}
              className={`
                w-full h-full flex items-center justify-center rounded-lg text-[12px] sm:text-[13px] font-bold transition-all relative
                ${isSelected ? 'bg-white text-black shadow-lg shadow-white/10' : ''}
                ${!isSelected && !isDisabled ? 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white' : ''}
                ${isDisabled ? 'text-zinc-800 cursor-not-allowed font-medium' : ''}
                ${!isDisabled && !isSelected && isSameMonth(day, monthStart) ? 'bg-zinc-900/30' : ''}
              `}
            >
              <span className="relative z-10">{formattedDate}</span>
              {!isDisabled && !isSelected && isSameMonth(day, monthStart) && (
                 <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-400 rounded-full" />
              )}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="w-full max-w-full sm:max-w-sm select-none mx-auto">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

export default Calendar;
