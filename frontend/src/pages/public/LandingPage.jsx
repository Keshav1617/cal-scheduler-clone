import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, ChevronRight, Users, MapPin, Globe, Clock, Monitor, Video, 
  Smartphone, MoreHorizontal, Shield, Code, Layers, Zap, BookOpen, 
  MessageSquare, Repeat, CreditCard, ArrowRight, Star, Camera
} from 'lucide-react';

/* ─── Mega Menu Data ────────────────────────────────────────── */
const PLATFORM_MENU = [
  { icon: <Code size={16}/>, title: 'API', desc: 'Build your own integrations with our public API' },
  { icon: <Monitor size={16}/>, title: 'Embed', desc: 'Embed Cal.com into your website' },
  { icon: <BookOpen size={16}/>, title: 'Blog', desc: 'Stay up to date with the latest news and updates' },
  { icon: <Layers size={16}/>, title: 'App Store', desc: 'Integrate with your favorite apps' },
  { icon: <Zap size={16}/>, title: 'Out Of Office', desc: 'Schedule time off with ease' },
  { icon: <Zap size={16}/>, title: 'Instant Meetings', desc: 'Meet with clients in minutes' },
  { icon: <Users size={16}/>, title: 'Collective Events', desc: 'Schedule events with multiple participants' },
  { icon: <CreditCard size={16}/>, title: 'Payments', desc: 'Accept payments for bookings' },
  { icon: <Users size={16}/>, title: 'Dynamic Group Links', desc: 'Seamlessly book meetings with multiple people' },
  { icon: <MessageSquare size={16}/>, title: 'Help Docs', desc: 'Need to learn more about our system? Check the help docs' },
  { icon: <Repeat size={16}/>, title: 'Workflows', desc: 'Automate scheduling and reminders' },
  { icon: <Zap size={16}/>, title: 'Webhooks', desc: 'Get notified when something happens' },
];

/* ─── Generic Nav Dropdown ──────────────────────────────────── */
function NavDropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-0.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg"
      >
        {label}
        <ChevronDown size={13} className={`mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white border border-gray-200 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 w-[90vw] max-w-[880px]">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mini Calendar Widget ──────────────────────────────────── */
function MiniCalendar() {
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const allDays = Array.from({ length: 35 }, (_, i) => {
    const d = i - 3;
    return d >= 1 && d <= 31 ? d : null;
  });
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) weeks.push(allDays.slice(i, i + 7));
  const dotDays = [15];
  const selected = 21;

  return (
    <div className="flex-1 p-8 bg-white">
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-bold text-gray-900">May <span className="text-gray-400 font-medium">2025</span></span>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-full transition-all">&lt;</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-full transition-all">&gt;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-4">
        {days.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-300 pb-2">{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-y-1">
          {week.map((day, di) => {
            if (!day) return <div key={di} />;
            const isSel = day === selected;
            const dot = dotDays.includes(day);
            return (
              <div key={di} className="relative flex flex-col items-center py-1.5">
                <button className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all
                  ${isSel ? 'bg-[#292929] text-white shadow-lg' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {day}
                </button>
                {dot && <span className="w-1 h-1 rounded-full bg-gray-900 absolute bottom-1" />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-gray-900 selection:text-white pb-32">

      {/* ═══ NAVBAR ═══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-4 mt-4">
          <nav className="bg-white border border-gray-200 shadow-sm flex items-center justify-between h-[64px] px-4 sm:px-8 rounded-2xl">
            <div className="flex items-center gap-10">
              <Link to="/" className="text-gray-900 font-bold text-2xl tracking-tighter">Cal.com</Link>
              <div className="hidden lg:flex items-center gap-1">
                <NavDropdown label="Solutions">
                   <div className="grid grid-cols-3 gap-y-8 gap-x-12">
                      {PLATFORM_MENU.map((item, i) => (
                        <a key={i} href="#" className="flex gap-4 group">
                           <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm">
                              {item.icon}
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 mb-0.5">{item.title}</p>
                              <p className="text-[11px] text-gray-400 leading-normal font-medium">{item.desc}</p>
                           </div>
                        </a>
                      ))}
                   </div>
                </NavDropdown>
                <a href="#" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg">Enterprise</a>
                <a href="#" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg">Cal.ai</a>
                <NavDropdown label="Developer">
                   <div className="grid grid-cols-2 gap-8">
                      {PLATFORM_MENU.slice(0, 4).map((item, i) => (
                        <a key={i} href="#" className="flex gap-4 group">
                           <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
                              {item.icon}
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 mb-0.5">{item.title}</p>
                              <p className="text-[11px] text-gray-400 leading-normal font-medium">{item.desc}</p>
                           </div>
                        </a>
                      ))}
                   </div>
                </NavDropdown>
                <NavDropdown label="Resources">
                   <div className="grid grid-cols-3 gap-8">
                      {PLATFORM_MENU.slice(0, 9).map((item, i) => (
                        <a key={i} href="#" className="flex gap-4 group">
                           <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm">
                              {item.icon}
                           </div>
                           <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 mb-0.5">{item.title}</p>
                              <p className="text-[11px] text-gray-400 leading-normal font-medium">{item.desc}</p>
                           </div>
                        </a>
                      ))}
                   </div>
                </NavDropdown>
                <a href="#" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg">Pricing</a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
              <Link
                to="/admin"
                className="bg-gray-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-black transition-all shadow-md"
              >
                Get started <ChevronRight size={14} className="inline ml-1 opacity-50"/>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ═══ CENTERED CONTENT CARD ═══════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 mt-8">
        <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-200/50 overflow-hidden relative">
          
          {/* ─── Hero Section ──────────────────────────────────── */}
          <div className="p-8 sm:p-16 md:p-24 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-20 items-center">
            {/* Left */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-full px-4 py-1.5 mb-10 text-[11px] font-bold text-gray-500 cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-all">
                Cal.com launches v6.2 <ChevronRight size={14} className="text-gray-300" />
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[88px] font-extrabold tracking-[-0.05em] leading-[0.9] text-gray-900 mb-10">
                The better way to schedule your meetings
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-[480px] font-medium">
                A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.
              </p>

              <div className="flex flex-col gap-4 mb-12 max-w-[400px]">
                <Link
                  to="/admin"
                  className="flex items-center justify-center gap-3 bg-gray-900 text-white text-base font-bold px-8 py-5 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98]"
                >
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5">
                    <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  </div>
                  Sign up with Google
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 text-base font-bold px-8 py-5 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all active:scale-[0.98]"
                >
                  Sign up with email <ChevronRight size={18} className="text-gray-300" />
                </Link>
              </div>
              <p className="text-[11px] text-gray-300 font-bold uppercase tracking-widest">No credit card required</p>
            </div>

            {/* Right – Widget (Matching Denise Wilson / Property Viewing) */}
            <div className="hidden md:flex flex-col rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.08)] h-[560px] bg-white relative">
              <div className="flex flex-1">
                {/* Profile Panel */}
                <div className="w-[280px] border-r border-gray-100 p-10 flex flex-col bg-white">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-8 ring-4 ring-gray-50 shadow-sm">
                    <img src="https://i.pravatar.cc/150?u=denise" className="w-full h-full object-cover" alt="Denise Wilson" />
                  </div>
                  <p className="text-[11px] text-gray-400 font-bold mb-1">Denise Wilson</p>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Property Viewing</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed mb-10 font-medium">Tour your potential dream home with our experienced real estate professionals.</p>
                  
                  <div className="flex items-center gap-2 mb-8">
                     <Clock size={16} className="text-gray-300"/>
                     <div className="flex gap-2">
                        {['15m','30m','45m','1h'].map(t => (
                          <span key={t} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${t === '45m' ? 'bg-white border-gray-200 shadow-sm text-gray-900' : 'bg-gray-50 border-transparent text-gray-400'}`}>{t}</span>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                      <MapPin size={16} className="text-red-400"/>
                      <span>Pine Realty Office</span>
                    </div>
                     <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                      <Globe size={16} className="text-gray-400"/>
                      <span className="flex items-center gap-1">Australia/Sydney <ChevronDown size={12}/></span>
                    </div>
                  </div>
                </div>
                {/* Calendar Panel */}
                <MiniCalendar />
              </div>

               {/* Bottom Badges */}
              <div className="p-8 border-t border-gray-50 flex justify-between bg-white relative z-10">
                 <div className="flex flex-col items-center gap-1">
                    <div className="flex text-green-500 text-[10px] font-black">★★★★★</div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Trustpilot</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                    <div className="flex text-orange-500 text-[10px] font-black">★★★★★</div>
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-[9px] font-black">P</div>
                 </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex text-red-500 text-[10px] font-black">★★★★★</div>
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-black">G</div>
                 </div>
              </div>
            </div>
          </div>

          {/* ─── Logo Strip (Positioned BELOW hero) ──────────────── */}
          <div className="px-8 sm:px-16 py-8 sm:py-12 border-t border-gray-100 flex flex-nowrap items-center justify-between bg-white/50 grayscale opacity-40 overflow-x-auto">
             <div className="flex flex-col gap-1 max-w-[150px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-tight">Trusted by fast-growing companies</p>
             </div>
             <div className="flex items-center gap-16">
                <span className="font-extrabold text-2xl text-gray-900 tracking-tighter">PlanetScale</span>
                <span className="font-extrabold text-2xl text-gray-900 tracking-tighter">coinbase</span>
                <span className="font-extrabold text-2xl text-gray-900 tracking-tighter">storyblok</span>
                <span className="font-extrabold text-2xl text-gray-900 tracking-tighter">AngelList</span>
                <span className="font-extrabold text-2xl text-gray-900 tracking-tighter">Raycast</span>
                <span className="font-extrabold text-2xl text-gray-900 tracking-tighter">Vercel</span>
             </div>
          </div>

          {/* ─── How it works ──────────────────────────────────── */}
          <div className="p-8 sm:p-20 bg-gray-50/10 border-t border-gray-100">
            <div className="text-center mb-24">
               <div className="inline-flex items-center gap-2 border border-gray-100 bg-white shadow-sm rounded-full px-4 py-2 mb-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
                 How it works
              </div>
              <h2 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-[-0.05em] mb-10">With us, appointment <br/> scheduling is easy</h2>
              <p className="text-gray-400 max-w-xl mx-auto text-xl font-medium leading-relaxed">
                Effortless scheduling for business and individuals, powerful solutions for fast-growing modern companies.
              </p>
              <div className="mt-12 flex justify-center gap-4">
                 <Link to="/admin" className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-base font-black shadow-lg hover:bg-black transition-all flex items-center gap-2">Get started <ChevronRight size={18}/></Link>
                 <Link to="/admin" className="bg-white text-gray-700 px-8 py-4 rounded-2xl text-base font-black border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2">Book a demo <ChevronRight size={18} className="text-gray-300"/></Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
               {[
                 { step: '01', title: 'Connect your calendar', desc: "We'll handle all the cross-referencing, so you don't have to worry about double bookings." },
                 { step: '02', title: 'Set your availability', desc: "Want to block off weekends? Set up any buffers? We make that easy." },
                 { step: '03', title: 'Choose how to meet', desc: "It could be a video chat, phone call, or a walk in the park!" }
               ].map((item, idx) => (
                 <div key={idx} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-10 shadow-sm transition-all duration-500 group">
                    <div className="text-[12px] font-black text-gray-300 mb-8 bg-gray-50 w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100">{item.step}</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-base text-gray-400 font-medium leading-relaxed mb-12">{item.desc}</p>
                    
                    <div className="h-[240px] bg-white rounded-[2rem] border border-gray-100 flex items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                       {/* High-fidelity mockups */}
                       {idx === 0 && (
                         <div className="relative">
                            <div className="w-32 h-32 border-[3px] border-dashed border-gray-100 rounded-full flex items-center justify-center animate-spin duration-[30s]">
                               <div className="absolute -top-4 bg-white p-2 rounded-xl shadow-lg border border-gray-100 scale-75 grayscale opacity-50"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-6 h-6" alt="GCal"/></div>
                               <div className="absolute -bottom-4 bg-white p-2 rounded-xl shadow-lg border border-gray-100 scale-75 grayscale opacity-50"><img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" className="w-6 h-6" alt="Outlook"/></div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-5 py-4 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center font-black text-[10px] text-gray-900 z-10">CAL.COM</div>
                         </div>
                       )}
                       {idx === 1 && (
                         <div className="w-full space-y-4">
                            {[1,2,3].map(i => (
                              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between" style={{opacity: 1-i*0.2}}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-4 rounded-full p-1 transition-colors ${i < 3 ? 'bg-emerald-400' : 'bg-gray-200'}`}>
                                    <div className={`w-2 h-2 rounded-full bg-white transition-transform ${i < 3 ? 'translate-x-4' : ''}`}/>
                                  </div>
                                  <div className="w-12 h-2 bg-gray-100 rounded-full"/>
                                </div>
                                <div className="flex gap-2">
                                  <div className="w-10 h-4 bg-gray-50 rounded-lg"/>
                                  {i < 3 && <div className="w-10 h-4 bg-gray-50 rounded-lg"/>}
                                </div>
                              </div>
                            ))}
                         </div>
                       )}
                       {idx === 2 && (
                         <div className="w-full flex flex-col items-center">
                            <div className="flex -space-x-4 mb-8">
                               {[1,2].map(i => <div key={i} className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 shadow-xl overflow-hidden grayscale"><img src={`https://i.pravatar.cc/100?u=${i*10}`} alt="User"/></div>)}
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xl flex gap-3">
                               <div className="p-2.5 bg-gray-50 rounded-xl text-gray-300"><Camera size={18}/></div>
                               <div className="p-2.5 bg-[#292929] rounded-xl text-white shadow-lg"><Video size={18}/></div>
                               <div className="p-2.5 bg-gray-50 rounded-xl text-gray-300"><Monitor size={18}/></div>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* ─── Footer CTA Pixel Perfect ───────────────────────── */}
          <div className="px-6 sm:px-20 py-20 sm:py-32 text-center border-t border-gray-100 bg-white">
             <h2 className="text-4xl sm:text-6xl lg:text-[100px] font-extrabold text-gray-900 tracking-[-0.06em] mb-12 leading-[0.85]">Smarter, simpler <br/> scheduling</h2>
             
             <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
                <Link to="/admin" className="bg-gray-900 text-white px-14 py-6 rounded-2xl text-xl font-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:bg-black transition-all active:scale-[0.98]">Get started free</Link>
                <Link to="/admin" className="bg-white text-gray-700 px-14 py-6 rounded-2xl text-xl font-black border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-3 active:scale-[0.98]">Talk to sales <ChevronRight size={22} className="text-gray-300"/></Link>
             </div>

             <div className="flex flex-wrap justify-center gap-20 grayscale opacity-40">
                {[
                  { label: "Product of the day", rank: "1st" },
                  { label: "Product of the week", rank: "1st" },
                  { label: "Product of the month", rank: "1st" }
                ].map((award, i) => (
                  <div key={i} className="flex flex-col items-center">
                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5">{award.label}</p>
                     <p className="text-[42px] font-extrabold text-gray-900 leading-none">{award.rank}</p>
                     <div className="flex text-orange-400 gap-0.5 mt-4">
                        <Star size={12} fill="currentColor"/>
                        <Star size={12} fill="currentColor"/>
                        <Star size={12} fill="currentColor"/>
                        <Star size={12} fill="currentColor"/>
                        <Star size={12} fill="currentColor"/>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-12 gap-y-20">
          <div className="col-span-2">
            <Link to="/" className="text-3xl font-black text-gray-900 mb-8 inline-block tracking-tighter">Cal.com</Link>
            <p className="text-base text-gray-400 leading-relaxed max-w-xs mb-10 font-medium tracking-tight">
              Cal.com® is a registered trademark. Connecting a billion people by 2031 through open source scheduling infrastructure.
            </p>
            <div className="flex items-center gap-2 bg-emerald-50 w-fit px-4 py-2 rounded-2xl ring-1 ring-emerald-100 shadow-sm shadow-emerald-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">All Systems Operational</span>
            </div>
          </div>
          {[
            { heading: 'Product', links: ['Pricing','Security','Changelog','Enterprise','Round Robin','Automation'] },
            { heading: 'Developer', links: ['API','Docs','OAuth','Atoms','GitHub','Selfhost'] },
            { heading: 'Company', links: ['About','Blog','Jobs','Press','Brand'] },
            { heading: 'Legal', links: ['Privacy','Terms','Cookies','DPA','GDPR'] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.25em] mb-8">{col.heading}</h4>
              <ul className="space-y-4">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors font-bold uppercase tracking-widest">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-32 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black text-gray-300 uppercase tracking-[0.1em]">
          <p>© 2025 Cal.com, Inc. All rights reserved.</p>
          <div className="flex gap-10">
             <Link to="/admin" className="hover:text-gray-900 transition-all">Admin Dashboard</Link>
             <Link to="/admin/availability" className="hover:text-gray-900 transition-all">Availability</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
