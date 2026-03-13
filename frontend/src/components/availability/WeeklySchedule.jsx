import { Plus, Copy, Trash2 } from 'lucide-react';
import TimeSelect from '../ui/TimeSelect';

function WeeklySchedule({ rules, onRuleChange }) {
  const days = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ];

  const handleToggle = (dayValue) => {
    const existingRule = rules.find(r => r.day_of_week === dayValue);
    if (existingRule) {
      // Toggle the is_enabled flag on all rules for this day
      const isCurrentlyEnabled = existingRule.is_enabled;
      onRuleChange(
        rules.map(r =>
          r.day_of_week === dayValue ? { ...r, is_enabled: isCurrentlyEnabled ? 0 : 1 } : r
        )
      );
    } else {
      // No rule exists yet — add one enabled
      onRuleChange([...rules, { day_of_week: dayValue, start_time: '09:00', end_time: '17:00', is_enabled: 1 }]);
    }
  };

  const updateRuleTime = (field, value, dayValue, index) => {
    const allOtherRules = rules.filter(r => r.day_of_week !== dayValue);
    const dayRules = rules
      .filter(r => r.day_of_week === dayValue && !!r.is_enabled)
      .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
    dayRules[index] = { ...dayRules[index], [field]: value };
    onRuleChange([...allOtherRules, ...dayRules]);
  };

  const handleAddSlot = (dayValue) => {
    const dayRules = rules.filter(r => r.day_of_week === dayValue && !!r.is_enabled);
    const lastRule = dayRules[dayRules.length - 1];
    let startTime = '17:00';
    let endTime = '18:00';
    if (lastRule) {
       const [h, m] = lastRule.end_time.split(':').map(Number);
       startTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
       endTime = `${String(Math.min(h + 1, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    onRuleChange([...rules, { day_of_week: dayValue, start_time: startTime, end_time: endTime, is_enabled: 1 }]);
  };

  const handleRemoveSlot = (dayValue, index) => {
    const allOtherRules = rules.filter(r => r.day_of_week !== dayValue);
    const dayRules = rules
      .filter(r => r.day_of_week === dayValue && !!r.is_enabled)
      .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
    dayRules.splice(index, 1);
    onRuleChange([...allOtherRules, ...dayRules]);
  };

  const handleCopyToAll = (dayValue) => {
    const sourceRules = rules.filter(r => r.day_of_week === dayValue && !!r.is_enabled);
    const activeDays = Array.from(new Set(
      rules.filter(r => !!r.is_enabled).map(r => r.day_of_week)
    ));
    let updatedRules = [...rules];
    activeDays.forEach(d => {
      if (d === dayValue) return;
      updatedRules = updatedRules.filter(r => r.day_of_week !== d);
      sourceRules.forEach(sr => {
        updatedRules.push({ ...sr, day_of_week: d, is_enabled: 1 });
      });
    });
    onRuleChange(updatedRules);
  };

  return (
    <div className="divide-y divide-zinc-900/40">
      {days.map((day) => {
        const allDayRules = rules.filter(r => r.day_of_week === day.value);
        const dayRules = allDayRules
          .filter(r => !!r.is_enabled)
          .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
        const isEnabled = dayRules.length > 0;

        return (
          <div key={day.value} className="flex items-start gap-8 py-4 px-6 group border-b border-zinc-900 last:border-0 hover:bg-zinc-900/5 transition-colors">
            <div className="flex items-center gap-4 w-32 shrink-0">
              <button
                type="button"
                onClick={() => handleToggle(day.value)}
                className={`h-[22px] w-[40px] shrink-0 rounded-full transition-all duration-300 relative ${isEnabled ? 'bg-white' : 'bg-zinc-800'}`}
              >
                <div className={`absolute top-1 h-[14px] w-[14px] rounded-full transition-all duration-300 ${isEnabled ? 'left-[22px] bg-black' : 'left-1 bg-zinc-500'}`} />
              </button>
              <span className={`text-[15px] font-bold transition-colors ${isEnabled ? 'text-white' : 'text-zinc-600'}`}>{day.label}</span>
            </div>

            <div className="flex-1 min-h-[36px] flex items-center">
              {isEnabled ? (
                <div className="flex flex-col gap-3 w-full">
                  {dayRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="flex items-center gap-2">
                        <TimeSelect 
                          className="w-[110px]"
                          value={rule.start_time?.substring(0, 5)} 
                          onChange={(val) => updateRuleTime('start_time', val, day.value, idx)}
                        />
                        <span className="text-zinc-600 font-medium text-[14px] px-0.5">–</span>
                        <TimeSelect 
                          className="w-[110px]"
                          value={rule.end_time?.substring(0, 5)} 
                          onChange={(val) => updateRuleTime('end_time', val, day.value, idx)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-3 ml-2">
                         <button 
                           type="button" 
                           onClick={() => handleAddSlot(day.value)}
                           className="p-1 px-1.5 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-md transition-all active:scale-90"
                         >
                          <Plus size={18} />
                        </button>
                        {idx === 0 ? (
                           <button 
                             type="button" 
                             onClick={() => handleCopyToAll(day.value)} 
                             className="p-1 px-1.5 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-md transition-all active:scale-90" 
                             title="Copy to all"
                           >
                            <Copy size={16} />
                          </button>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => handleRemoveSlot(day.value, idx)}
                            className="p-1 px-1.5 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-all active:scale-90"
                          >
                             <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-[14px] font-bold text-zinc-600 px-1">Unavailable</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WeeklySchedule;
