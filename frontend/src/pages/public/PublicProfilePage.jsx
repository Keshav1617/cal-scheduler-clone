import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile, getPublicEventTypes } from '../../api/publicApi';
import { Clock, User as UserIcon } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

function PublicProfilePage() {
  const { username } = useParams();
  const pushToast = useToastStore((s) => s.pushToast);
  const [user, setUser] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const userRes = await getPublicProfile(username);
        if (!isMounted) return;
        setUser(userRes.data);
        
        const eventsRes = await getPublicEventTypes(userRes.data.id);
        if (!isMounted) return;
        setEventTypes(eventsRes.data);
      } catch (err) {
        pushToast({ type: 'error', title: 'User not found' });
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [username, pushToast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-center">
        <div>
          <h1 className="text-2xl font-bold text-white">404</h1>
          <p className="mt-2 text-zinc-500">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans flex flex-col items-center justify-start pt-20 px-4">
      <div className="w-full max-w-[480px] space-y-4">
        {/* Host Card */}
        <div className="rounded-[20px] border border-zinc-900 bg-[#0A0A0A] p-8 flex flex-col items-center gap-4">
           <div className="h-16 w-16 overflow-hidden rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <span className="text-xl font-bold text-zinc-400">{user.name?.[0]?.toUpperCase() || 'U'}</span>
           </div>
           <h1 className="text-[20px] font-bold tracking-tight text-white">{user.name}</h1>
        </div>

        {/* Event Types Card */}
        <div className="rounded-[20px] border border-zinc-900 bg-[#0A0A0A] overflow-hidden divide-y divide-zinc-900">
          {eventTypes.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 font-medium">
              No public event types available.
            </div>
          ) : (
            eventTypes.map((et) => (
              <Link 
                key={et.id} 
                to={`/book/${et.slug}`}
                className="group flex flex-col gap-2 p-6 hover:bg-zinc-900/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {et.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md">
                      <Clock size={12} className="text-zinc-500" />
                      <span className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-300">{et.duration}m</span>
                   </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
         <div className="h-5 w-5 bg-white text-black text-[8px] font-black rounded flex items-center justify-center translate-y-[2px]">cal</div>
         <span className="text-[10px] font-black tracking-widest uppercase">Cal.com</span>
      </div>
    </div>
  );
}

export default PublicProfilePage;
