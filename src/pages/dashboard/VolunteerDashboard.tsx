import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Trophy, 
  Settings, 
  Bell, 
  Sparkles,
  Calendar,
  Check,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { calculateMatchScore } from "@/services/api";
import { VolunteerProfile, CommunityNeed } from "@/types";
import { SEED_NEEDS } from "@/lib/seed";

export function VolunteerDashboard() {
  const { user } = useAuth();
  const [needs, setNeeds] = useState<CommunityNeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assignedTaskIds, setAssignedTaskIds] = useState<string[]>([]);
  const [tasks, setTasks] = useState([
    { id: "t1", title: "Organize Weekend Food Distribution", status: "TODO", category: "FOOD", due: "In 2 days" },
    { id: "t2", title: "Verify Textbooks Inventory", status: "IN_PROGRESS", category: "EDUCATION", due: "Tomorrow" },
    { id: "t3", title: "Emergency Water Filtration Support", status: "DONE", category: "HEALTH", due: "Completed" }
  ]);

  const currentVolunteer: VolunteerProfile = {
    id: "vol-current",
    userId: user?.id || "user-1",
    skills: ["First Aid", "Disaster Logistics", "Water Purification", "Teamwork", "Relief Dispatch"],
    availability: "Weekends & Evenings",
    hoursPerWeek: 14,
    location: "Delhi NCR / Sundarbans Relief Outpost, India",
    latitude: 28.6280,
    longitude: 77.2789,
    bio: "Certified humanitarian volunteer and disaster first responder in India.",
    verified: true,
    impactScore: 92,
  };

  useEffect(() => {
    async function fetchNeeds() {
      try {
        const q = query(collection(db, "needs"), limit(8));
        const querySnapshot = await getDocs(q);
        const fetchedNeeds = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityNeed));
        if (fetchedNeeds.length > 0) {
          setNeeds(fetchedNeeds);
        } else {
          setNeeds(SEED_NEEDS);
        }
      } catch (error) {
        setNeeds(SEED_NEEDS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNeeds();
  }, []);

  const handleAssignTask = (need: CommunityNeed) => {
    if (assignedTaskIds.includes(need.id)) {
      toast.info(`Task "${need.title}" is already assigned to you.`);
      return;
    }
    setAssignedTaskIds([...assignedTaskIds, need.id]);
    setTasks(prev => [
      { id: `task-${Date.now()}`, title: need.title, status: "TODO", category: need.category, due: "In 3 days" },
      ...prev
    ]);
    toast.success(`Task accepted! Added to your queue.`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-[calc(100vh-64px)] text-slate-800">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">
            Welcome back, <span className="text-teal-600">{user?.name || "Volunteer"}</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            AI-ranked tasks matching your skills & geolocation proximity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">Rank: #12 Impact Leader</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toast.info("No unread alerts.")}
            className="border-slate-200 bg-white text-slate-600 hover:text-slate-900 h-9 w-9 shadow-xs"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => toast.success("Availability confirmed: 12 hrs/week!")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs h-9 shadow-xs"
          >
            Update Availability
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-12 gap-6">
        {/* Left Section: Stats & Matching Feed */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hours Logged</p>
                <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">48 hrs</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks Done</p>
                <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">
                  {18 + assignedTaskIds.length}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Impact Score</p>
                <p className="text-2xl font-extrabold text-teal-600 font-display mt-1">
                  {880 + assignedTaskIds.length * 25}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Trophy className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Smart Matches Feed & Task Queue Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <Tabs defaultValue="matches" className="w-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <TabsTrigger
                    value="matches"
                    className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-xs text-xs font-semibold"
                  >
                    Smart Matches ({needs.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-xs text-xs font-semibold"
                  >
                    My Tasks ({tasks.length})
                  </TabsTrigger>
                </TabsList>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-teal-700 font-bold px-3 py-1 bg-teal-50 border border-teal-200/60 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Algorithm Active
                </span>
              </div>

              <TabsContent value="matches" className="space-y-4">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : needs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {needs.map(need => {
                      const score = calculateMatchScore(currentVolunteer, need);
                      const isAssigned = assignedTaskIds.includes(need.id);

                      return (
                        <div
                          key={need.id}
                          className="p-5 rounded-xl border border-slate-200 hover:border-teal-500/80 hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-teal-50 text-teal-700 border border-teal-200">
                                {score}% Match Fit
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                                {need.urgencyLevel}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              {need.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {need.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 space-y-3">
                            <div className="flex justify-between items-center text-xs text-slate-500">
                              <span className="font-semibold text-teal-700 text-[11px]">{need.category}</span>
                              <span className="flex items-center gap-1 text-[11px]">
                                <MapPin className="h-3 w-3 text-rose-500" />
                                {need.location}
                              </span>
                            </div>
                            <Button
                              onClick={() => handleAssignTask(need)}
                              disabled={isAssigned}
                              className={`w-full text-xs font-semibold h-8.5 rounded-lg transition-all ${
                                isAssigned
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                  : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                              }`}
                            >
                              {isAssigned ? (
                                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Assigned to You</span>
                              ) : (
                                "Accept & Assign Task"
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-8 text-center">No active community needs right now.</p>
                )}
              </TabsContent>

              <TabsContent value="tasks" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["TODO", "IN_PROGRESS", "DONE"].map(colStatus => (
                    <div key={colStatus} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">{colStatus}</span>
                        <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                          {tasks.filter(t => t.status === colStatus).length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {tasks.filter(t => t.status === colStatus).map(t => (
                          <div key={t.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs space-y-1">
                            <span className="text-[9px] font-bold text-teal-700 uppercase">{t.category}</span>
                            <p className="text-xs font-bold text-slate-900">{t.title}</p>
                            <p className="text-[10px] text-slate-400">{t.due}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Section: Profile & Impact Log */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Volunteer Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                {user?.name?.[0]?.toUpperCase() || "S"}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">{user?.name || "Sarah Chen"}</h3>
                <p className="text-xs text-slate-500">{user?.email || "volunteer@resourcemap.org"}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Verified Volunteer
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Impact Level 4</span>
                <span className="text-teal-600 font-bold">88% to Level 5</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full w-[88%]" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">Verified Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {currentVolunteer.skills.map(skill => (
                  <span key={skill} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                    #{skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Impact Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">Recent Impact Log</h4>
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">50 Rations Packed</p>
                  <p className="text-[10px] text-slate-400">Food Relief • 2 days ago</p>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">+40 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Triage Clinic Setup</p>
                  <p className="text-[10px] text-slate-400">Health Outpost • 5 days ago</p>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">+60 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">STEM Coding Workshop</p>
                  <p className="text-[10px] text-slate-400">Education Hub • 1 week ago</p>
                </div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">+35 pts</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
