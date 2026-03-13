import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScheduleDetail, getSchedules, updateSchedule, updateScheduleInfo, deleteSchedule } from '../../api/availabilityApi';
import WeeklySchedule from '../../components/availability/WeeklySchedule';
import TimezoneSelector from '../../components/availability/TimezoneSelector';
import DateOverrides from '../../components/availability/DateOverrides';
import DateOverrideModal from '../../components/availability/DateOverrideModal';
import Button from '../../components/ui/Button';
import { useToastStore } from '../../store/toastStore';
import { ArrowLeft, Trash2, Edit2, Check, X, Globe, AlertCircle } from 'lucide-react';
import BulkUpdateModal from '../../components/availability/BulkUpdateModal';

function AvailabilityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [rules, setRules] = useState([]);
  const [overrides, setOverrides] = useState([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const pushToast = useToastStore((s) => s.pushToast);
  
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const getSummary = () => {
    if (!rules || rules.length === 0) return 'No rules set';
    const enabled = rules.filter(r => !!r.is_enabled);
    if (enabled.length === 0) return 'Unavailable';
    
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sorted = [...enabled].sort((a,b) => a.day_of_week - b.day_of_week);
    const startDay = daysMap[sorted[0].day_of_week];
    const endDay = daysMap[sorted[sorted.length-1].day_of_week];
    
    const startTime = formatTime(sorted[0].start_time);
    const endTime = formatTime(sorted[0].end_time);
    
    return `${startDay} - ${endDay}, ${startTime} - ${endTime}`;
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getScheduleDetail(id);
        setSchedule(res.data.schedule);
        setRules(res.data.rules);
        setOverrides(res.data.overrides);
        setEditedName(res.data.schedule.name);
      } catch (err) {
        pushToast({ type: 'error', title: 'Failed to load schedule detail' });
        navigate('/admin/availability');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, pushToast, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update rules and overrides
      await updateSchedule(id, {
        timezone: schedule.timezone,
        rules: rules.map(r => ({
          dayOfWeek: r.day_of_week,
          isEnabled: !!r.is_enabled,
          startTime: (r.start_time?.substring(0, 5) || '09:00') + ':00',
          endTime: (r.end_time?.substring(0, 5) || '17:00') + ':00'
        })),
        overrides: overrides.map(o => {
          const isBlocked = !!o.is_blocked || !!o.isBlocked;
          const sTime = o.start_time || o.startTime;
          const eTime = o.end_time || o.endTime;
          
          return {
            date: o.date,
            isBlocked: isBlocked,
            startTime: isBlocked ? null : (sTime?.substring(0, 5) || '09:00') + ':00',
            endTime: isBlocked ? null : (eTime?.substring(0, 5) || '17:00') + ':00'
          };
        })
      });

      // 2. Update schedule info (name, etc.)
      await updateScheduleInfo(id, {
        name: editedName,
        timezone: schedule.timezone,
        is_default: schedule.is_default,
        is_active: true
      });

      pushToast({ type: 'success', title: 'Changes saved' });
      // Update local state if needed
      setSchedule(prev => ({ ...prev, is_active: true }));
    } catch (err) {
      pushToast({ type: 'error', title: 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      // If this is the default schedule, set another one as default first
      if (schedule.is_default) {
        const res = await getSchedules();
        const others = (res.data || []).filter(s => String(s.id) !== String(id));
        if (others.length > 0) {
          await updateScheduleInfo(others[0].id, { ...others[0], is_default: true });
        }
      }
      await deleteSchedule(id);
      pushToast({ type: 'success', title: 'Schedule deleted' });
      navigate('/admin/availability');
    } catch (err) {
      pushToast({ type: 'error', title: 'Failed to delete schedule' });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleDefault = async () => {
    try {
      const newDefaultValue = !schedule.is_default;
      if (!newDefaultValue) return; 

      await updateScheduleInfo(id, {
        ...schedule,
        name: editedName,
        is_default: true
      });
      setSchedule(prev => ({ ...prev, is_default: true }));
      pushToast({ type: 'success', title: 'Set as default' });
      // Open bulk update modal when set to default
      setIsBulkUpdateModalOpen(true);
    } catch (err) {
      pushToast({ type: 'error', title: 'Failed to update default status' });
    }
  };

  const renameSchedule = async () => {
     try {
        await updateScheduleInfo(id, {
           ...schedule,
           name: editedName
        });
        setSchedule(prev => ({ ...prev, name: editedName }));
        setIsEditingName(false);
     } catch (err) {
        pushToast({ type: 'error', title: 'Failed to rename' });
     }
  };

  const handleAddOverrides = (newOverrides) => {
    // Merge new overrides, replacing existing ones for same date
    const updated = [...overrides];
    newOverrides.forEach(newItem => {
      const index = updated.findIndex(o => o.date === newItem.date);
      if (index >= 0) {
        updated[index] = newItem;
      } else {
        updated.push(newItem);
      }
    });
    setOverrides(updated);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-64 rounded bg-zinc-800" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-96 rounded-xl bg-zinc-900/50" />
           <div className="h-64 rounded-xl bg-zinc-900/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full pb-10 animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/availability')}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all active:scale-90"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
               <div className="flex items-center gap-1.5 group">
                  {isEditingName ? (
                     <div className="flex items-center gap-1.5 animate-in slide-in-from-left-1">
                        <input 
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="bg-[#0A0A0A] border border-zinc-700 rounded-lg px-3 py-1 text-base font-bold text-white focus:outline-none focus:border-white transition-all w-32 sm:w-auto"
                          autoFocus
                        />
                        <button onClick={renameSchedule} className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"><Check size={16}/></button>
                        <button onClick={() => { setIsEditingName(false); setEditedName(schedule.name); }} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><X size={16}/></button>
                     </div>
                  ) : (
                     <>
                        <h1 className="text-xl font-bold text-white tracking-tight leading-none truncate max-w-[150px] sm:max-w-none">{schedule.name}</h1>
                        <button 
                          onClick={() => setIsEditingName(true)}
                          className="p-1 text-zinc-600 hover:text-white transition-all rounded-md"
                          title="Rename"
                        >
                           <Edit2 size={14} />
                        </button>
                     </>
                  )}
               </div>
                <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-zinc-500 font-bold mt-1">
                   <span className="opacity-70 uppercase tracking-wider">{getSummary()}</span>
                </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
           <div className="flex items-center gap-3 px-2 py-1.5 transition-all whitespace-nowrap">
              <span className="text-[13px] font-semibold text-zinc-300">Set as default</span>
              <button 
                onClick={handleToggleDefault}
                className={`h-5 w-10 shrink-0 rounded-full transition-all duration-300 relative ${schedule.is_default ? 'bg-white' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              >
                <div className={`absolute top-1 h-3 w-3 rounded-full transition-all duration-300 ${schedule.is_default ? 'left-6 bg-black' : 'left-1 bg-zinc-400'}`} />
              </button>
           </div>
           
           <div className="h-5 w-[1px] bg-zinc-800/50 mx-1 sm:mx-2" />

           <button 
             onClick={handleDelete}
             className="flex items-center justify-center h-8 w-8 text-zinc-500 border border-zinc-800 bg-transparent hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 rounded-lg transition-all translate-y-[1px]"
             title="Delete schedule"
           >
              <Trash2 size={16} />
           </button>
           
           <div className="h-5 w-[1px] bg-zinc-800/50 mx-1 sm:mx-2" />

           <button 
             onClick={handleSave}
             disabled={saving}
             className="bg-white text-black font-bold px-5 sm:px-6 py-1.5 rounded-lg text-[13px] hover:bg-zinc-100 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100 ml-auto sm:ml-0 translate-y-[1px]"
           >
              {saving ? '...' : 'Save'}
           </button>
        </div>
      </div>

      <BulkUpdateModal 
        isOpen={isBulkUpdateModalOpen}
        onClose={() => setIsBulkUpdateModalOpen(false)}
        scheduleId={id}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="rounded-[12px] border border-zinc-900 bg-[#0A0A0A] overflow-hidden shadow-sm">
              <WeeklySchedule 
                rules={rules} 
                onRuleChange={setRules} 
              />
           </div>

           <DateOverrides 
             overrides={overrides} 
             onOverrideChange={setOverrides}
             onAddClick={() => setIsOverrideModalOpen(true)}
           />
        </div>

        <div className="space-y-6">
           <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-zinc-900 bg-[#0A0A0A] p-6 space-y-5 shadow-sm">
                 <div className="flex items-center gap-2 text-white">
                    <Globe size={16} className="text-zinc-500" />
                    <h3 className="text-sm font-bold tracking-tight">Timezone</h3>
                 </div>
                 <TimezoneSelector 
                   value={schedule.timezone} 
                   onChange={(tz) => setSchedule(prev => ({ ...prev, timezone: tz }))} 
                 />
              </div>

              <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/10 p-6 space-y-5">
                 <h3 className="text-sm font-bold text-white tracking-tight leading-relaxed">Something doesn't look right?</h3>
                 <button className="w-full py-2.5 bg-transparent border border-zinc-800/80 rounded-xl text-[13px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all active:scale-[0.98]">
                    Launch troubleshooter
                 </button>
              </div>
            </div>
        </div>
      </div>
      <DateOverrideModal 
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        onSave={handleAddOverrides}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !deleting && setShowDeleteConfirm(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-[#111111] rounded-2xl border border-zinc-800 shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-[17px] font-black text-white tracking-tight">Delete schedule</h2>
                <p className="mt-1.5 text-[13px] font-medium text-zinc-400 leading-relaxed">
                  Deleting a schedule will remove it from all event types. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-5 py-2 rounded-lg text-[13px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-lg text-[13px] font-bold bg-white text-black hover:bg-zinc-200 transition-all disabled:opacity-50 active:scale-95"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailabilityDetailPage;
