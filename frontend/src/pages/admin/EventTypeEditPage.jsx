import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, AlignLeft, Settings, Copy, Code, Link2, Trash2, 
  LayoutGrid, Zap, Route, ExternalLink, Globe, Video, MoreHorizontal,
  ChevronRight, Laptop, MapPin, Monitor, MessageSquare, Plus, X,
  Check, ChevronLeft
} from 'lucide-react';
import { useEventTypes } from '../../hooks/useEventTypes';
import { useToastStore } from '../../store/toastStore';
import { getSchedules, getScheduleDetail } from '../../api/availabilityApi';
import Button from '../../components/ui/Button';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_SCHEDULE = {
  id: null,
  name: 'Working hours',
  rules: [
    { day: 'Monday', slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'Tuesday', slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'Wednesday', slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'Thursday', slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'Friday', slots: [{ start: '09:00', end: '17:00' }] },
  ]
};

function EventTypeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pushToast = useToastStore((s) => s.pushToast);
  const { eventTypes, createEventType, updateEventType, isLoading: isEventTypesLoading } = useEventTypes();
  
  const [eventType, setEventType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState('basics');
  const [previewScheduleDetail, setPreviewScheduleDetail] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    duration: 15,
    durations: [15], // Support for multiple durations
    is_active: true,
    availability_schedule_id: null,
    before_buffer: 0,
    after_buffer: 0,
    custom_questions: [],
    location: { type: 'cal_video', data: {} },
    allow_multiple_durations: false,
    hide_duration_selector: false
  });

  useEffect(() => {
    const fetchSchedules = async () => {
       try {
          const res = await getSchedules();
          setSchedules(res.data);
       } catch (err) {
          console.error('Failed to fetch schedules', err);
       }
    };
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (!isEventTypesLoading && eventTypes) {
      if (id === 'new') {
        const tempEvent = JSON.parse(localStorage.getItem('temp_event_type') || '{}');
        const duration = tempEvent.duration || 15;
        setFormData(prev => ({
          ...prev,
          title: tempEvent.title || '',
          slug: tempEvent.slug || '',
          description: tempEvent.description || '',
          duration: duration,
          durations: [duration]
        }));
        setEventType({ isNew: true });
      } else {
        const found = eventTypes.find(e => e.id === parseInt(id));
        if (found) {
          setEventType(found);
          setFormData({
            title: found.title,
            slug: found.slug,
            description: found.description || '',
            duration: found.duration || 15,
            durations: Array.isArray(found.durations) ? found.durations : (typeof found.durations === 'string' ? JSON.parse(found.durations || '[]') : [found.duration || 15]),
            is_active: found.is_active,
            availability_schedule_id: found.availability_schedule_id || null,
            before_buffer: found.before_buffer || 0,
            after_buffer: found.after_buffer || 0,
            custom_questions: found.custom_questions ? (typeof found.custom_questions === 'string' ? JSON.parse(found.custom_questions) : found.custom_questions) : [],
            location: found.location ? (typeof found.location === 'string' ? JSON.parse(found.location) : found.location) : { type: 'cal_video', data: {} },
            allow_multiple_durations: found.allow_multiple_durations || false,
            hide_duration_selector: found.hide_duration_selector || false
          });
        } else {
           navigate('/admin/event-types');
        }
      }
    }
  }, [id, eventTypes, isEventTypesLoading, navigate]);

  useEffect(() => {
    const fetchSelectedDetail = async () => {
      const scheduleId = formData.availability_schedule_id || (schedules.length > 0 ? schedules[0].id : null);
      if (!scheduleId) {
        setPreviewScheduleDetail(null);
        return;
      }

      setIsPreviewLoading(true);
      try {
        const res = await getScheduleDetail(scheduleId);
        
        // Transform backend rules to frontend preview format
        const transformedRules = DAYS.map(dayName => {
          const dayIndex = DAYS.indexOf(dayName);
          const backendRule = res.data.rules?.find(r => Number(r.day_of_week) === dayIndex);
          const isEnabled = backendRule && (backendRule.is_enabled === 1 || backendRule.is_enabled === true || backendRule.is_enabled === '1');
          
          return {
            day: dayName,
            slots: isEnabled ? [{ 
              start: backendRule.start_time?.substring(0, 5) || '09:00', 
              end: backendRule.end_time?.substring(0, 5) || '17:00' 
            }] : []
          };
        });

        setPreviewScheduleDetail({
          ...res.data,
          rules: transformedRules
        });
      } catch (err) {
        console.error('Failed to fetch schedule detail', err);
        setPreviewScheduleDetail(null);
      } finally {
        setIsPreviewLoading(false);
      }
    };

    if (schedules.length > 0) {
      fetchSelectedDetail();
    }
  }, [formData.availability_schedule_id, schedules]);

  const handleSave = async (silent = false) => {
     if (!silent) setIsSaving(true);
     try {
        if (eventType.isNew) {
           const res = await createEventType(formData);
           if (!silent) pushToast({ title: 'Created successfully', type: 'success' });
           navigate(`/admin/event-types/${res.id}`);
        } else {
           await updateEventType(eventType.id, formData);
           if (!silent) pushToast({ title: 'Saved successfully', type: 'success' });
        }
     } catch (err) {
        if (!silent) pushToast({ title: 'Failed to save', type: 'error' });
     } finally {
        if (!silent) setIsSaving(false);
     }
  };

  const handleToggleActive = async () => {
    const newActiveState = !formData.is_active;
    setFormData({ ...formData, is_active: newActiveState });
    // Trigger auto-save for the toggle
    try {
      if (!eventType.isNew) {
        await updateEventType(eventType.id, { ...formData, is_active: newActiveState });
        pushToast({ title: `Event type ${newActiveState ? 'activated' : 'hidden'}`, type: 'success' });
      }
    } catch (err) {
      pushToast({ title: 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event type?')) {
      try {
        await deleteEventType(eventType.id);
        pushToast({ title: 'Deleted successfully', type: 'success' });
        navigate('/admin/event-types');
      } catch (err) {
        pushToast({ title: 'Failed to delete', type: 'error' });
      }
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/book/${formData.slug}`;
    navigator.clipboard.writeText(url);
    pushToast({ title: 'Link copied to clipboard', type: 'success' });
  };

  const handleViewPublic = () => {
    window.open(`/book/${formData.slug}`, '_blank');
  };

  const handleToggleDuration = (d) => {
    let newDurations = Array.isArray(formData.durations) ? [...formData.durations] : [];
    if (newDurations.includes(d)) {
      if (newDurations.length > 1) {
        newDurations = newDurations.filter(x => x !== d);
      }
    } else {
      newDurations.push(d);
    }
    setFormData({ ...formData, durations: newDurations });
  };

  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'pm' : 'am';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes}${ampm}`;
  };

  const availableOptions = [10, 15, 30, 45, 60, 90, 120];

  if (!eventType) return <div className="flex items-center justify-center min-h-screen bg-black text-zinc-500">Loading...</div>;

  const sidebarItems = [
    { id: 'basics', label: 'Basics', icon: Link2, sub: `${formData.duration} mins` },
    { id: 'availability', label: 'Availability', icon: Clock, sub: 'Working hours' },
    { id: 'limits', label: 'Limits', icon: Clock, sub: 'How often you can be booked' },
    { id: 'advanced', label: 'Advanced', icon: LayoutGrid, sub: 'Calendar settings & more...' },
    { id: 'recurring', label: 'Recurring', icon: Zap, sub: 'Set up a repeating schedule' },
    { id: 'apps', label: 'Apps', icon: LayoutGrid, sub: '0 apps, 0 active' },
    { id: 'workflows', label: 'Workflows', icon: Zap, sub: '0 active' },
    { id: 'webhooks', label: 'Webhooks', icon: Route, sub: '0 active' },
  ];

  // Get current schedule header
  const selectedScheduleHeader = schedules.find(s => String(s.id) === String(formData.availability_schedule_id)) || schedules[0];
  
  // Use detailed rules if available, otherwise fallback to DEFAULT_SCHEDULE
  let selectedSchedule = previewScheduleDetail ? {
    ...previewScheduleDetail.schedule,
    rules: previewScheduleDetail.rules
  } : DEFAULT_SCHEDULE;

  return (
    <div className="flex bg-black min-h-screen -mx-4 sm:-mx-8 -my-6 sm:-my-6 overflow-hidden">
       
       {/* Left Sidebar Menu */}
        <div className="w-[280px] bg-black p-4 pt-8 flex flex-col hidden md:flex h-full">
           <button 
              onClick={() => navigate('/admin/event-types')}
              className="flex items-center gap-2 px-3 py-2 mb-4 text-zinc-500 hover:text-white transition-colors group"
           >
              <ChevronLeft size={20} className="stroke-[2.5]" />
              <span className="text-[15px] font-bold text-white tracking-tight group-hover:underline truncate">{formData.title || 'Event Type'}</span>
           </button>
           
           <div className="flex flex-col gap-1 overflow-y-auto pr-1">
             {sidebarItems.map((item) => (
                <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-all ${
                     activeTab === item.id 
                     ? 'bg-[#151515] text-white' 
                     : 'text-zinc-400 hover:bg-[#101010] hover:text-white'
                   }`}
                >
                   <div className="flex items-center gap-3">
                      <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'} />
                      <div className="flex flex-col items-start leading-tight">
                         <span>{item.label}</span>
                         <span className={`text-[11px] font-normal ${activeTab === item.id ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.sub}</span>
                      </div>
                   </div>
                   {activeTab === item.id && <ChevronRight size={14} className="text-zinc-600" />}
                </button>
             ))}
          </div>

       </div>

       {/* Main Content Area */}
       <div className="flex-1 bg-black flex flex-col h-screen overflow-hidden">
          {/* Top Bar */}
          <div className="flex h-[64px] items-center justify-between border-b border-zinc-900 bg-black px-6">
             <div className="flex items-center gap-3">
                {/* Left empty as title moved to sidebar */}
             </div>
             
             <div className="flex items-center gap-3">
                <div className="flex items-center pr-3 border-r border-zinc-900">
                   <button
                     onClick={handleToggleActive}
                     className={`flex h-[20px] w-[38px] shrink-0 items-center rounded-full border-2 border-transparent transition-all outline-none ${formData.is_active ? 'bg-zinc-100' : 'bg-zinc-800'}`}
                   >
                     <span className={`h-[16px] w-[16px] transform rounded-full shadow transition duration-200 ${formData.is_active ? 'translate-x-[18px] bg-black' : 'translate-x-0 bg-zinc-500'}`} />
                   </button>
                </div>

                <div className="flex items-center gap-0.5">
                   <button onClick={handleViewPublic} title="View public page" className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all"><ExternalLink size={18} className="stroke-[2]"/></button>
                   <button onClick={handleCopyLink} title="Copy link" className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all"><Link2 size={18} className="stroke-[2]"/></button>
                   <button title="Embed code" className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all"><Code size={18} className="stroke-[2]"/></button>
                   <button onClick={handleDelete} title="Delete" className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-zinc-900 rounded-lg transition-all"><Trash2 size={18} className="stroke-[2]"/></button>
                </div>

                <div className="w-px h-8 bg-zinc-900 mx-1"></div>

                <Button 
                   onClick={() => handleSave()} 
                   isLoading={isSaving}
                   variant="primary"
                   className="px-4 h-[36px] rounded-[8px] font-bold text-[13px] tracking-tight"
                >
                   Save
                </Button>
             </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto">
             <div className="w-full px-6 py-10 space-y-8 pb-32">
                
                {activeTab === 'basics' && (
                  <>
                    {/* Card: Title, Description & URL */}
                    <div className="rounded-[12px] border border-zinc-800 bg-[#0A0A0A] p-6 space-y-6">
                       {/* Title */}
                       <div className="space-y-2">
                          <label className="text-[13px] font-bold text-white">Title</label>
                          <input
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-black border border-zinc-800 rounded-[10px] px-4 py-2.5 text-[14px] font-medium text-white placeholder-zinc-700 outline-none focus:border-zinc-500 transition-all font-medium"
                            placeholder="e.g. 15-min Quick Chat"
                          />
                       </div>

                       {/* Description */}
                       <div className="space-y-2">
                          <label className="text-[13px] font-bold text-white">Description</label>
                          <div className="rounded-[10px] border border-zinc-800 bg-[#0A0A0A] overflow-hidden focus-within:border-zinc-500 transition-all">
                             <div className="flex items-center gap-1 border-b border-zinc-800 bg-[#101010] px-3 py-2">
                                <div className="flex items-center gap-1 text-[13px] text-zinc-400 font-medium px-1 cursor-pointer hover:text-white">
                                   <span>Normal</span>
                                   <ChevronRight size={12} className="rotate-90" />
                                </div>
                                <div className="w-px h-4 bg-zinc-800 mx-2"></div>
                                <button className="p-1 px-2 text-zinc-400 hover:text-white rounded transition-colors text-[14px] font-serif font-bold italic">B</button>
                                <button className="p-1 px-2 text-zinc-400 hover:text-white rounded transition-colors text-[14px] font-serif italic">I</button>
                                <button className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors"><Link2 size={13}/></button>
                             </div>
                             <textarea
                               value={formData.description}
                               onChange={(e) => setFormData({...formData, description: e.target.value})}
                               rows={3}
                               className="w-full resize-none bg-transparent px-4 py-4 text-[14px] text-zinc-200 placeholder-zinc-600 outline-none font-medium"
                               placeholder="e.g. A short intro or quick check-in."
                             />
                          </div>
                       </div>

                       {/* URL */}
                       <div className="space-y-2">
                          <label className="text-[13px] font-bold text-white">URL</label>
                          <div className="flex rounded-[10px] border border-zinc-800 bg-[#101010] overflow-hidden focus-within:border-zinc-500 transition-all">
                             <span className="flex items-center pl-4 pr-1 text-[13px] text-zinc-500 font-medium whitespace-nowrap">
                                cal.com/keshav-jha-kqpvdn/
                             </span>
                             <input
                               value={formData.slug}
                               onChange={(e) => setFormData({...formData, slug: e.target.value})}
                               className="w-full bg-transparent px-0 py-2.5 text-[14px] text-zinc-200 outline-none font-medium"
                             />
                          </div>
                       </div>
                    </div>

                    {/* Card: Durations */}
                     <div className="rounded-[12px] border border-zinc-800 bg-[#0A0A0A] p-6 space-y-6">
                        <div className="space-y-3">
                           <label className="text-[13px] font-bold text-white">Available durations</label>
                           <div className="relative">
                              <div 
                                 onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                 className="min-h-[42px] w-full bg-[#0A0A0A] border border-zinc-800 rounded-[10px] px-3 py-1.5 flex flex-wrap gap-2 items-center cursor-pointer hover:border-zinc-700 transition-all"
                              >
                                 {Array.isArray(formData.durations) && formData.durations.length > 0 ? (
                                    formData.durations.map(d => (
                                       <div key={d} className="flex items-center gap-1.5 bg-[#1C1C1C] border border-zinc-800 text-white px-2 py-1 rounded-[6px] text-[13px] font-medium group">
                                          <span>{d} mins</span>
                                          <button 
                                             onClick={(e) => { e.stopPropagation(); handleToggleDuration(d); }} 
                                             className="text-zinc-500 hover:text-white transition-colors"
                                          >
                                             <X size={14} />
                                          </button>
                                       </div>
                                    ))
                                 ) : (
                                    <span className="text-zinc-500 text-[14px] px-1">Select durations...</span>
                                 )}
                                 <div className="ml-auto flex items-center gap-2 pr-1">
                                    <X 
                                       size={14} 
                                       className="text-zinc-600 hover:text-white cursor-pointer" 
                                       onClick={(e) => { e.stopPropagation(); setFormData({...formData, durations: [formData.duration]}); }}
                                    />
                                    <ChevronRight size={16} className={`text-zinc-500 transition-transform ${isDurationDropdownOpen ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                                 </div>
                              </div>

                              {isDurationDropdownOpen && (
                                 <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDurationDropdownOpen(false)}></div>
                                    <div className="absolute top-full left-0 w-full mt-2 bg-[#101010] border border-zinc-800 rounded-[10px] shadow-xl z-20 overflow-hidden py-1">
                                       {availableOptions.map(option => (
                                          <div 
                                             key={option}
                                             onClick={() => { handleToggleDuration(option); }}
                                             className="flex items-center justify-between px-4 py-2.5 hover:bg-zinc-800 cursor-pointer transition-colors"
                                          >
                                             <span className="text-[14px] text-zinc-200 font-medium">{option} mins</span>
                                             {formData.durations.includes(option) && <Check size={16} className="text-zinc-200" />}
                                          </div>
                                       ))}
                                    </div>
                                 </>
                              )}
                           </div>
                        </div>

                       <div className="space-y-3">
                          <label className="text-[13px] font-bold text-white">Default duration</label>
                          <div className="relative group">
                             <select 
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                                className="w-full appearance-none bg-[#0A0A0A] border border-zinc-800 rounded-[10px] px-4 py-2.5 text-[14px] font-medium text-white outline-none focus:border-zinc-500 transition-all"
                             >
                                {[10, 15, 30, 45, 60].map(d => (
                                   <option key={d} value={d}>{d} mins</option>
                                ))}
                             </select>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                                <ChevronRight size={16} className="rotate-90" />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4 pt-2">
                          <label className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-all ${formData.hide_duration_selector ? 'bg-zinc-200 border-zinc-200' : 'bg-transparent border-zinc-800 group-hover:border-zinc-500'}`}>
                                {formData.hide_duration_selector && <Check size={12} className="text-black stroke-[3]" />}
                             </div>
                             <span className="text-[14px] text-zinc-400 font-medium">Hide duration selector</span>
                             <input type="checkbox" className="hidden" checked={formData.hide_duration_selector} onChange={() => setFormData({...formData, hide_duration_selector: !formData.hide_duration_selector})} />
                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">
                             <button
                               onClick={() => setFormData({...formData, allow_multiple_durations: !formData.allow_multiple_durations})}
                               className={`flex h-[20px] w-[36px] shrink-0 items-center rounded-full border-2 border-transparent transition-all outline-none ${formData.allow_multiple_durations ? 'bg-zinc-100' : 'bg-zinc-800'}`}
                             >
                               <span className={`h-[16px] w-[16px] transform rounded-full shadow transition duration-200 ${formData.allow_multiple_durations ? 'translate-x-[16px] bg-black' : 'translate-x-0 bg-zinc-500'}`} />
                             </button>
                             <span className="text-[14px] text-zinc-400 font-medium">Allow multiple durations</span>
                          </label>
                       </div>
                    </div>

                    {/* Card: Location */}
                    <div className="rounded-[12px] border border-zinc-800 bg-[#0A0A0A] p-6 space-y-6">
                       <div className="space-y-3">
                          <label className="text-[13px] font-bold text-white">Location</label>
                          <div className="relative group">
                             <div className="w-full flex items-center justify-between bg-[#0A0A0A] border border-zinc-800 rounded-[10px] px-4 py-2.5 cursor-pointer hover:border-zinc-700 transition-all">
                                <div className="flex items-center gap-3 text-white text-[14px] font-medium">
                                   <Video size={18} className="text-zinc-500" />
                                   <span>Cal Video (Default)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <ChevronRight size={16} className="rotate-90 text-zinc-500" />
                                   <X size={16} className="text-zinc-600 hover:text-white" />
                                </div>
                             </div>
                          </div>
                       </div>

                       <button className="flex items-center gap-2 text-[13px] font-bold text-zinc-400 hover:text-white transition-colors">
                          <Plus size={16} />
                          Add a location
                       </button>

                       <p className="text-[12px] text-zinc-500 font-medium">
                          Can't find the right conferencing app? Visit our <span className="text-blue-500 hover:underline cursor-pointer">App Store</span>.
                       </p>
                    </div>
                  </>
                )}

                {activeTab === 'availability' && (
                  <div className="space-y-6">
                    <div className="rounded-[12px] border border-zinc-800 bg-[#0A0A0A] p-6 space-y-6">
                       <div className="space-y-3">
                          <label className="text-[13px] font-bold text-white">Availability</label>
                          <div className="relative group">
                              <div 
                                onClick={() => setIsScheduleDropdownOpen(!isScheduleDropdownOpen)}
                                className="w-full flex items-center justify-between bg-[#0A0A0A] border border-zinc-800 rounded-[10px] px-4 py-2.5 cursor-pointer hover:border-zinc-700 transition-all"
                              >
                                 <div className="flex items-center gap-2 text-white text-[14px] font-medium">
                                    <span>{selectedScheduleHeader?.name || selectedSchedule?.name || 'working'}</span>
                                    {selectedScheduleHeader?.is_default && (
                                      <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded leading-none uppercase">Default</span>
                                    )}
                                 </div>
                                 <ChevronRight size={16} className={`transition-transform duration-200 text-zinc-500 ${isScheduleDropdownOpen ? '-rotate-90' : 'rotate-90'}`} />
                              </div>

                              {isScheduleDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#111111] border border-zinc-800 rounded-[12px] shadow-2xl py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                  {schedules.map((s) => (
                                    <button
                                      key={s.id}
                                      onClick={() => {
                                        setFormData({ ...formData, availability_schedule_id: s.id });
                                        setIsScheduleDropdownOpen(false);
                                      }}
                                      className={`w-full flex items-center justify-between px-4 py-2 text-[14px] transition-colors hover:bg-zinc-800/50 ${String(formData.availability_schedule_id) === String(s.id) ? 'bg-zinc-800/30' : ''}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`font-medium ${String(formData.availability_schedule_id) === String(s.id) ? 'text-white' : 'text-zinc-400'}`}>{s.name}</span>
                                        {s.is_default && (
                                          <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded leading-none uppercase">Default</span>
                                        )}
                                      </div>
                                      {String(formData.availability_schedule_id) === String(s.id) && <Check size={14} className="text-white" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                           </div>
                        </div>

                        <div className="w-full h-px bg-zinc-900 mx-1"></div>

                        <div className="space-y-4 pt-4">
                           {DAYS.map(day => {
                              const scheduleDay = selectedSchedule?.rules?.find(r => r.day === day);
                              const isAvailable = scheduleDay?.slots?.length > 0;
                              
                              return (
                                 <div key={day} className="flex items-center justify-between py-1 px-2 group">
                                    <span className="text-[14px] text-white font-medium w-24">{day}</span>
                                     <div className="flex-1 flex justify-start pl-8">
                                        {isAvailable ? (
                                           <div className="flex items-center gap-3 text-zinc-400 text-[14px]">
                                              <span>{formatTime(scheduleDay.slots[0].start)}</span>
                                              <span className="text-zinc-600">-</span>
                                              <span>{formatTime(scheduleDay.slots[0].end)}</span>
                                           </div>
                                        ) : (
                                          <span className="text-zinc-600 text-[14px]">Unavailable</span>
                                       )}
                                    </div>
                                 </div>
                              )
                           })}
                        </div>

                       <div className="pt-6 border-t border-zinc-900 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-zinc-500 text-[13px] font-medium">
                             <Globe size={14} />
                             <span>Asia/Calcutta</span>
                          </div>
                           <button 
                              onClick={() => {
                                 if (selectedSchedule?.id) {
                                    navigate(`/admin/availability/${selectedSchedule.id}`);
                                 } else {
                                    navigate('/admin/availability');
                                 }
                              }}
                              className="text-[13px] font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                           >
                              Edit availability
                              <ExternalLink size={14} />
                           </button>
                        </div>
                    </div>
                  </div>
                )}

             </div>
          </div>
       </div>

       {/* Float Action Button (Mockup for sidebar toggle on mobile) */}
       <div className="fixed bottom-6 right-6 md:hidden">
          <button className="h-12 w-12 rounded-full bg-white text-black shadow-xl flex items-center justify-center">
             <MessageSquare size={20} />
          </button>
       </div>
    </div>
  );
}

export default EventTypeEditPage;
