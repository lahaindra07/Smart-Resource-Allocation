import { useState } from "react";
import { 
  Plus, 
  Upload, 
  FileText, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Filter,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { parseSurveyReport } from "@/services/aiService";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

const NEEDS_DATA = [
  { name: 'Health', value: 35, color: '#14B8A6' },
  { name: 'Education', value: 25, color: '#F59E0B' },
  { name: 'Food', value: 20, color: '#0F172A' },
  { name: 'Shelter', value: 15, color: '#64748B' },
  { name: 'Other', value: 5, color: '#CBD5E1' },
];

const ACTIVITY_DATA = [
  { month: 'Jan', resolved: 40, reported: 45 },
  { month: 'Feb', resolved: 35, reported: 50 },
  { month: 'Mar', resolved: 55, reported: 60 },
  { month: 'Apr', resolved: 70, reported: 75 },
  { month: 'May', resolved: 85, reported: 90 },
];

export function NGODashboard() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        const extracted = await parseSurveyReport(content);
        toast.info(`Gemini found ${extracted.length} potential needs. Syncing...`);
        
        for (const item of extracted) {
          await addDoc(collection(db, "needs"), {
            ...item,
            status: "OPEN",
            reportedBy: user?.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        
        toast.success(`Success! ${extracted.length} needs added.`);
      } catch (error) {
        console.error("Sync error:", error);
        toast.error("Failed to parse report with AI.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#0F172A] min-h-screen text-slate-200">
      <input 
        type="file" 
        id="survey-upload" 
        className="hidden" 
        accept=".txt,.md,.pdf" 
        onChange={handleFileUpload}
      />
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white">NGO <span className="text-[#14B8A6]">Management Core</span></h1>
          <p className="text-slate-400 font-medium font-sans">Monitoring activities for {user?.name || "Global NGO"}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700" onClick={() => document.getElementById('survey-upload')?.click()} disabled={isUploading}>
            <Upload className="h-4 w-4" /> {isUploading ? "Scanning..." : "Sync Survey"}
          </Button>
          <Button className="bg-[#14B8A6] hover:bg-teal-600 text-slate-900 font-bold shadow-lg shadow-teal-500/20 gap-2">
            <Plus className="h-4 w-4" /> Post New Need
          </Button>
        </div>
      </header>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStat 
          label="Total Active Needs" 
          value="156" 
          change="+12%" 
          trend="up" 
          color="amber"
          icon={<AlertTriangle className="text-amber-500" />} 
        />
        <AnalyticsStat 
          label="Matched Volunteers" 
          value="1,240" 
          change="+18%" 
          trend="up" 
          color="teal"
          icon={<Users className="text-teal-500" />} 
        />
        <AnalyticsStat 
          label="Resolution Rate" 
          value="84.2%" 
          change="+5.4%" 
          trend="up" 
          color="blue"
          icon={<CheckCircle2 className="text-blue-500" />} 
        />
        <div className="bento-panel p-4 bg-[#14B8A6] flex flex-col justify-between shadow-xl shadow-teal-900/40">
           <span className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em] opacity-80">Sync Efficiency</span>
           <div className="flex items-end justify-between">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">92%</span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 text-[#14B8A6]" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Main Section */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
           {/* Chart Panel */}
           <div className="bento-panel p-6 bg-slate-900 border-slate-700/80">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold font-display">Need Category Distribution</h3>
                  <p className="text-xs text-slate-500 italic mt-1 tracking-wider uppercase">Visualizing sector demand trends</p>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white"><MoreVertical className="h-4 w-4" /></Button>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={NEEDS_DATA} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1E293B" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={80} tick={{ fill: '#94A3B8' }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(51, 65, 85, 0.2)' }}
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {NEEDS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Table Panel */}
           <div className="bento-panel p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Active Resource Management</h3>
              <div className="overflow-hidden border border-slate-700/50 rounded-xl">
                <Table>
                  <TableHeader className="bg-slate-800/40">
                    <TableRow className="border-slate-700/50 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Title</TableHead>
                      <TableHead className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Urgency</TableHead>
                      <TableHead className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                      <TableHead className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Candidates</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <ProjectRow title="Food Drive Sector 4" urgency="CRITICAL" status="OPEN" matches={12} />
                    <ProjectRow title="School Roof Repairs" urgency="HIGH" status="IN_PROGRESS" matches={5} />
                    <ProjectRow title="Vaccination Drive" urgency="MEDIUM" status="OPEN" matches={8} />
                    <ProjectRow title="Solar Lamp Distro" urgency="LOW" status="RESOLVED" matches={22} />
                  </TableBody>
                </Table>
              </div>
           </div>
        </div>

        {/* Sidebar Section */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
           {/* Activity Trend Panel */}
           <div className="bento-panel bg-slate-900 border-slate-700/30 overflow-hidden flex flex-col">
              <div className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Resolution Flow</h3>
                <p className="text-[10px] text-[#14B8A6] font-bold">Reported vs Resolved per month</p>
              </div>
              <div className="h-60 px-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ACTIVITY_DATA}>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', fontSize: '10px' }}
                    />
                    <Line type="monotone" dataKey="reported" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4, fill: '#14B8A6' }} />
                    <Line type="monotone" dataKey="resolved" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 p-4 bg-slate-800/40 border-t border-slate-700/50 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#14B8A6] glow-teal" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase">Input</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#F59E0B] glow-amber" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase">Output</span>
                 </div>
              </div>
           </div>

           {/* Matches Sidebar */}
           <div className="bento-panel h-fit overflow-hidden">
              <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Live Matches</h3>
                <Users className="h-4 w-4 text-[#14B8A6]" />
              </div>
              <div className="p-4 space-y-5">
                 <RecentMatch name="Alice Chen" match="98%" time="4m ago" need="Food Drive" />
                 <RecentMatch name="Bob Wilson" match="95%" time="12m ago" need="Solar Lamp" />
                 <RecentMatch name="David G" match="92%" time="1h ago" need="School Roof" />
              </div>
              <button className="w-full py-4 text-[10px] font-bold text-slate-500 hover:text-[#14B8A6] border-t border-slate-700/50 transition-colors uppercase tracking-widest">
                Access Matching Engine →
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsStat({ label, value, change, trend, icon, color }: any) {
  const getGlowClass = () => {
    switch(color) {
      case 'amber': return 'glow-amber border-amber-500/20';
      case 'teal': return 'glow-teal border-teal-500/20';
      case 'blue': return 'shadow-[0_0_15px_rgba(59,130,246,0.2)] border-blue-500/20';
      default: return '';
    }
  };

  return (
    <div className={`bento-panel flex flex-col justify-between p-4 ${getGlowClass()}`}>
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</span>
        <span className={`text-[9px] font-black flex items-center gap-0.5 ${trend === 'up' ? 'text-teal-400' : 'text-rose-400'}`}>
          {change} {trend === 'up' ? '↑' : '↓'}
        </span>
      </div>
      <div className="flex items-end justify-between mt-4">
        <span className="text-4xl font-extrabold text-white tracking-tighter leading-none font-display">{value}</span>
        <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-700/50">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ title, urgency, status, matches }: any) {
  return (
    <TableRow className="border-slate-700/50 hover:bg-slate-800/20 transition-colors">
      <TableCell className="font-bold text-slate-200 py-4">{title}</TableCell>
      <TableCell>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
          urgency === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 
          urgency === 'HIGH' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 
          urgency === 'MEDIUM' ? 'bg-teal-500/20 text-[#14B8A6] border border-teal-500/30' :
          'bg-slate-800 text-slate-400 border border-slate-700'
        }`}>
          {urgency}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'OPEN' ? 'bg-[#14B8A6]' : status === 'IN_PROGRESS' ? 'bg-[#F59E0B]' : 'bg-slate-500'}`} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{status}</span>
        </div>
      </TableCell>
      <TableCell className="font-bold text-slate-500 text-xs">{matches} Potential</TableCell>
      <TableCell className="text-right">
        <button className="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-[#14B8A6] hover:border-[#14B8A6]/50 transition-all">
          <ChevronRight className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  );
}

function RecentMatch({ name, match, time, need }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center font-black text-slate-400 group-hover:bg-[#14B8A6]/10 group-hover:text-[#14B8A6] group-hover:border-[#14B8A6]/30 transition-all text-xs">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{name}</p>
          <p className="text-[9px] text-slate-500 font-medium font-sans">Matched with <span className="text-slate-300 font-bold">{need}</span></p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-[#14B8A6]">{match}</p>
        <p className="text-[8px] text-slate-600 font-black uppercase tracking-tighter">{time}</p>
      </div>
    </div>
  );
}
