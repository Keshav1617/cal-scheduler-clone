import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  getSchedules, 
  createSchedule, 
  deleteSchedule, 
  updateScheduleInfo,
  getScheduleDetail,
  updateSchedule 
} from '../../api/availabilityApi';
import { useToastStore } from '../../store/toastStore';
import Button from '../../components/ui/Button';
import { 
  MoreHorizontal, 
  Globe, 
  Plus, 
  Users, 
  User, 
  Trash2, 
  Copy, 
  Star,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';
import NewScheduleModal from '../../components/availability/NewScheduleModal';

function AvailabilityPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'team'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pushToast = useToastStore((s) => s.pushToast);

  const fetchSchedules = async () => {
    try {
      const res = await getSchedules();
      setSchedules(res.data);
    } catch (err) {
      pushToast({ type: 'error', title: 'Failed to load schedules' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [pushToast]);

  const handleCreate = async (name) => {
    try {
      const res = await createSchedule({ name, timezone: 'Asia/Kolkata' });
      pushToast({ type: 'success', title: 'Schedule created' });
      navigate(`/admin/availability/${res.data.id}`);
    } catch (err) {
      pushToast({ type: 'error', title: 'Failed to create schedule' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);
      setSchedules(schedules.filter(s => s.id !== id));
      pushToast({ type: 'success', title: 'Schedule deleted' });
    } catch (err) {
      pushToast({ type: 'error', title: 'Failed to delete schedule' });
    }
  };

  const handleSetDefault = async (schedule) => {
    if (schedule.is_default) return;
    try {
       await updateScheduleInfo(schedule.id, {
          name: schedule.name,
          timezone: schedule.timezone,
          is_default: true
       });
       pushToast({ type: 'success', title: 'Default schedule updated' });
       fetchSchedules();
    } catch (err) {
       pushToast({ type: 'error', title: 'Failed to set default' });
    }
  };

  const handleDuplicate = async (schedule) => {
     try {
        const detailRes = await getScheduleDetail(schedule.id);
        const { rules, overrides } = detailRes.data;

        const newRes = await createSchedule({
           name: `${schedule.name} (Copy)`,
           timezone: schedule.timezone,
           is_default: false
        });

        const newId = newRes.data.id;
        
        await updateSchedule(newId, {
           rules: (rules || []).map(r => ({
              dayOfWeek: r.day_of_week,
              isEnabled: !!r.is_enabled,
              startTime: r.start_time?.substring(0, 5),
              endTime: r.end_time?.substring(0, 5)
           })),
           overrides: (overrides || []).map(o => ({
              date: o.date,
              isBlocked: !!o.is_blocked,
              startTime: o.start_time?.substring(0, 5),
              endTime: o.end_time?.substring(0, 5)
           }))
        });

        pushToast({ type: 'success', title: 'Schedule duplicated' });
        fetchSchedules();
     } catch (err) {
        pushToast({ type: 'error', title: 'Failed to duplicate schedule' });
     }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-zinc-800" />
        <div className="h-64 rounded-xl bg-zinc-900/50" />
      </div>
    );
  }

  return (
    <div className="max-w-full pb-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-white tracking-tight">Availability</h1>
          <p className="mt-1 text-sm text-zinc-500 font-medium font-serif italic">
            Configure times when you are available for bookings.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
           <div className="flex p-1 bg-zinc-900/50 rounded-lg border border-zinc-800/80">
              <button 
                onClick={() => setActiveTab('my')}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-[13px] font-bold rounded-md transition-all ${activeTab === 'my' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
              >
                My availability
              </button>
              <button 
                onClick={() => setActiveTab('team')}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-[13px] font-bold rounded-md transition-all ${activeTab === 'team' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
              >
                Team availability
              </button>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center justify-center gap-2 bg-white text-black px-4 py-1.5 rounded-[8px] text-[13px] font-bold hover:bg-zinc-200 transition-colors shadow-sm"
           >
              <Plus size={16} /> New
           </button>
        </div>
      </div>

      {activeTab === 'my' ? (
        <div className="space-y-4">
          <div className="rounded-[12px] border border-zinc-900 bg-[#0A0A0A] divide-y divide-zinc-900/50">
            {schedules.map((s) => (
              <div 
                key={s.id} 
                className="group flex items-center justify-between p-6 hover:bg-zinc-900/20 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/availability/${s.id}`)}
              >
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                       <span className="text-[14px] font-bold text-white">{s.name}</span>
                       {s.is_default && <span className="px-2 py-0.5 bg-zinc-800/80 text-zinc-400 text-[11px] font-bold rounded-lg border border-zinc-700/30">Default</span>}
                    </div>
                   <div className="flex flex-col text-[13px] text-zinc-500 font-medium">
                      <span>Mon - Fri, 9:00 AM - 5:00 PM</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                         <Globe size={13} className="text-zinc-600" />
                         <span>{s.timezone}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                   <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center justify-center h-9 w-9 text-zinc-400 hover:text-white border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl transition-all">
                         <MoreHorizontal size={18} />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-zinc-800/50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleSetDefault(s)}
                                  className={clsx(
                                    active ? 'bg-zinc-800 text-white' : 'text-zinc-400',
                                    'group flex w-full items-center px-4 py-2.5 text-sm font-bold gap-3 transition-colors'
                                  )}
                                >
                                  <Star size={16} className={s.is_default ? 'text-white' : 'text-zinc-500'} />
                                  Set as default
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleDuplicate(s)}
                                  className={clsx(
                                    active ? 'bg-zinc-800 text-white' : 'text-zinc-400',
                                    'group flex w-full items-center px-4 py-2.5 text-sm font-bold gap-3 transition-colors'
                                  )}
                                >
                                  <Copy size={16} className="text-zinc-500" />
                                  Duplicate
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleDelete(s.id)}
                                  disabled={s.is_default}
                                  className={clsx(
                                    active ? 'bg-red-500/10 text-red-500' : 'text-zinc-500',
                                    'group flex w-full items-center px-4 py-2.5 text-sm font-bold gap-3 transition-colors disabled:opacity-30'
                                  )}
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                   </Menu>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[13px] text-zinc-500 font-medium text-center py-4">
            Temporarily out-of-office? <span className="text-zinc-300 hover:underline cursor-pointer">Add a redirect</span>
          </p>
        </div>
      ) : (
        <div className="relative rounded-[24px] border border-zinc-800 bg-[#0A0A0A] p-0 overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row items-stretch">
               <div className="flex-1 p-8 sm:p-14 space-y-6">
                 <h2 className="text-4xl font-extrabold text-white tracking-tight">Cal.com is better with teams</h2>
                 <p className="text-lg text-zinc-400 font-medium leading-[1.6]">
                    Add your team members to your event types. Use collective scheduling to include everyone or find the most suitable person with round robin scheduling.
                 </p>
                 <div className="flex items-center gap-4 pt-4">
                    <button className="bg-white text-black px-6 py-2.5 rounded-[12px] text-sm font-bold hover:bg-zinc-200 transition-all shadow-lg active:scale-95">
                       Create team
                    </button>
                    <button className="text-zinc-400 hover:text-white px-2 py-2.5 text-sm font-bold transition-colors">
                       Learn more
                    </button>
                 </div>
              </div>
              <div className="hidden lg:block w-full lg:w-[45%] border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900/10">
                 {/* Mock image content matching image 2 */}
                 <div className="h-full bg-gradient-to-br from-zinc-800/20 to-black p-8">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-6 shadow-2xl rotate-2">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-8 h-8 rounded-full bg-zinc-700"></div>
                           <span className="text-sm font-bold text-white">Acme Inc.</span>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-200 mb-2">Sales demo</h3>
                        <div className="space-y-2 mb-6">
                           <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                              <User size={12}/> Friday, August 30, 2024
                           </div>
                           <div className="text-[12px] text-zinc-400 font-bold">9:00 am - 10:00 am</div>
                        </div>
                        <div className="text-[11px] text-zinc-500 leading-relaxed italic">
                           "Book a call with a member of our sales team."
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <NewScheduleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleCreate} 
      />
    </div>
  );
}

export default AvailabilityPage;

