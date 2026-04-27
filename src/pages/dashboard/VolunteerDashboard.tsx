import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Trophy,
  Calendar,
  Settings,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export function VolunteerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [needs, setNeeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNeeds() {
      try {
        const q = query(collection(db, "needs"), limit(5));
        const querySnapshot = await getDocs(q);
        const fetchedNeeds = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNeeds(fetchedNeeds);
      } catch (error) {
        console.error("Error fetching needs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNeeds();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#0F172A] min-h-screen text-slate-200">
      {/* Header Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white animate-in fade-in slide-in-from-left duration-700">
            Welcome back, <span className="text-[#14B8A6]">{user?.name || "Volunteer"}</span>!
          </h1>
          <p className="text-slate-400 font-medium font-sans">Ready to make an impact today?</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Impact Ranking: #12</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="relative border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            </Button>
            <Button className="bg-[#14B8A6] hover:bg-teal-600 text-slate-900 font-bold shadow-lg shadow-teal-500/20">Setup Availability</Button>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-4">
        {/* Left Section: Stats & Analytics */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <StatCard icon={<Clock className="text-blue-400" />} label="Hours Logged" value="42" color="blue" />
            </div>
            <div className="col-span-12 md:col-span-3">
              <StatCard icon={<CheckCircle2 className="text-[#14B8A6]" />} label="Tasks Done" value="18" color="teal" />
            </div>
            <div className="col-span-12 md:col-span-3">
              <StatCard icon={<Trophy className="text-[#F59E0B]" />} label="Impact Score" value="850" color="amber" />
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="bento-panel flex items-center justify-between p-4 bg-[#14B8A6] text-slate-900 shadow-xl shadow-teal-900/40">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-800 opacity-80">Quick Action</p>
                  <p className="text-lg font-extrabold font-display">New Goal</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Trophy className="h-5 w-5 text-[#14B8A6]" />
                </div>
              </div>
            </div>

            {/* Smart Matches / Feed */}
            <div className="col-span-12">
              <div className="bento-panel p-6">
                <Tabs defaultValue="matches" className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
                      <TabsTrigger value="matches" className="rounded-lg px-6 data-[state=active]:bg-[#14B8A6] data-[state=active]:text-slate-900 text-slate-400">Smart Matches</TabsTrigger>
                      <TabsTrigger value="tasks" className="rounded-lg px-6 data-[state=active]:bg-[#14B8A6] data-[state=active]:text-slate-900 text-slate-400">My Tasks</TabsTrigger>
                    </TabsList>
                    <span className="hidden md:inline text-[10px] text-[#14B8A6] font-bold uppercase tracking-widest px-3 py-1 bg-teal-500/10 rounded-full">AI scoring active</span>
                  </div>
                  
                  <TabsContent value="matches" className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-24 bg-slate-800/40 animate-pulse rounded-2xl border border-slate-700/30" />
                        ))}
                      </div>
                    ) : needs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {needs.map(need => (
                          <MatchItem 
                            key={need.id}
                            title={need.title} 
                            org="Local Partner NGO"
                            score={Math.floor(Math.random() * 15) + 85}
                            distance={(Math.random() * 5).toFixed(1) + "km"}
                            skills={[need.category, "Teamwork"]}
                            urgency={need.urgencyLevel}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 border border-dashed border-slate-700 rounded-3xl">
                        <p className="text-slate-500 font-medium font-display text-xl mb-2">No active matches found.</p>
                        <p className="text-slate-600 text-sm">Follow more NGOs to see real-time needs.</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <TaskColumn status="TODO" count={3} />
                      <TaskColumn status="IN_PROGRESS" count={2} />
                      <TaskColumn status="DONE" count={12} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Profile & Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bento-panel group">
            <div className="h-24 bg-[#14B8A6] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-700 opacity-60"></div>
              <div className="absolute top-4 right-4 text-white/50 group-hover:text-white transition-colors cursor-pointer">
                <Settings className="h-5 w-5" />
              </div>
            </div>
            <div className="px-6 pb-6 text-center -mt-10">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-3xl bg-[#0F172A] border-4 border-[#0F172A] shadow-2xl mx-auto flex items-center justify-center overflow-hidden ring-4 ring-slate-800">
                  <div className="w-full h-full bg-gradient-to-br from-teal-500 to-amber-500 flex items-center justify-center text-white text-3xl font-black">
                    {user?.name?.[0] || "V"}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black text-white font-display mb-1">{user?.name || "Volunteer"}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6 flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3 text-[#14B8A6]" /> Remote Access Mode
              </p>
              
              <div className="bg-slate-900/50 rounded-2xl p-4 text-left mb-6 border border-slate-700/30">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Core Skillset</p>
                <div className="flex flex-wrap gap-2">
                  {["PM", "Design", "Code"].map(s => (
                    <Badge key={s} variant="secondary" className="bg-slate-800 border-slate-700 text-[#14B8A6] text-[9px] px-2 py-0">#{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  <span>Level 4 Impact</span>
                  <span className="text-[#14B8A6]">75% to Level 5</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#14B8A6] w-[75%] rounded-full shadow-[0_0_8px_rgba(20,184,166,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-panel p-5 overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Impact</h3>
                <Trophy className="h-4 w-4 text-amber-500" />
             </div>
             <div className="space-y-5">
                <ImpactActivity logo="E" name="Education" time="2d ago" action="Math" points="+20" />
                <ImpactActivity logo="F" name="Food" time="1w ago" action="Meals" points="+50" />
                <ImpactActivity logo="P" name="Planet" time="2w ago" action="Trees" points="+100" />
             </div>
             <button className="w-full mt-8 py-2 text-[10px] font-bold text-slate-500 hover:text-[#14B8A6] border-t border-slate-700/50 transition-colors uppercase tracking-widest">
               View Impact History →
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color?: string }) {
  const getGlowClass = () => {
    switch(color) {
      case 'amber': return 'glow-amber border-amber-500/20';
      case 'teal': return 'glow-teal border-teal-500/20';
      case 'blue': return 'shadow-[0_0_15px_rgba(59,130,246,0.2)] border-blue-500/20';
      default: return '';
    }
  };

  return (
    <div className={`bento-panel flex flex-col justify-between p-4 h-full ${getGlowClass()}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
      <div className="flex items-end justify-between mt-2">
        <span className="text-4xl font-extrabold text-white tracking-tighter leading-none">{value}</span>
        <div className="h-8 w-8 rounded-lg bg-slate-900/50 flex items-center justify-center border border-slate-700/50">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MatchItem({ title, org, score, distance, skills, urgency }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(20, 184, 166, 0.05)' }}
      className="bento-panel p-4 group cursor-pointer transition-all border-slate-700/30 hover:border-teal-500/50"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="bg-[#14B8A6]/10 text-[#14B8A6] text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest w-fit mb-1">
            {score}% Match
          </div>
          <h4 className="font-bold text-white group-hover:text-[#14B8A6] transition-colors line-clamp-1">{title}</h4>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{org}</p>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-[10px] ${
          urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 
          urgency === 'HIGH' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 
          'bg-slate-700 text-slate-300'
        }`}>
          {urgency?.[0]}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1.5 overflow-hidden">
          {skills.slice(0, 2).map((s: any) => (
            <span key={s} className="text-[8px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 uppercase font-black">{s}</span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold italic">
          <MapPin className="h-3 w-3" /> {distance}
        </div>
      </div>
      
      <Button className="w-full mt-4 bg-transparent border border-[#14B8A6]/30 text-[#14B8A6] hover:bg-[#14B8A6] hover:text-slate-900 group-hover:border-[#14B8A6] font-bold text-[10px] h-8 rounded-xl transition-all">
        ASSIGN TASK
      </Button>
    </motion.div>
  );
}

function ImpactActivity({ logo, name, time, action, points }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-[#14B8A6] flex items-center justify-center font-black text-[10px] border border-teal-500/20">
          {logo}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{action}</p>
          <p className="text-[9px] text-slate-500 italic">{name} • {time}</p>
        </div>
      </div>
      <span className="text-[10px] font-black text-[#14B8A6] bg-teal-500/5 px-2 py-0.5 rounded-full">{points}</span>
    </div>
  );
}

function TaskColumn({ status, count }: { status: string, count: number }) {
  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-4 px-1">
        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${
          status === 'TODO' ? 'text-slate-400' : 
          status === 'IN_PROGRESS' ? 'text-[#F59E0B]' : 'text-[#14B8A6]'
        }`}>{status}</h4>
        <span className="text-[9px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50">{count}</span>
      </div>
      <div className="flex-1 space-y-4 rounded-3xl border border-dotted border-slate-700/50 p-3 bg-slate-900/40">
        <div className="h-28 bg-slate-800/20 rounded-2xl border border-slate-700/30 flex items-center justify-center">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Awaiting Load</span>
        </div>
      </div>
    </div>
  );
}
