import { useState } from "react";
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  AlertCircle,
  BarChart3,
  Search,
  Check,
  X,
  UserCog
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PLATFORM_DATA = [
  { day: 'Mon', active: 120 },
  { day: 'Tue', active: 150 },
  { day: 'Wed', active: 200 },
  { day: 'Thu', active: 180 },
  { day: 'Fri', active: 250 },
  { day: 'Sat', active: 300 },
  { day: 'Sun', active: 280 },
];

export function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#0F172A] min-h-screen text-slate-200">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-white">Platform <span className="text-[#14B8A6]">Control Center</span></h1>
          <p className="text-slate-400 font-medium font-sans">Global overview of ResourceMap network and security.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">System Nominal</span>
          </div>
        </div>
      </header>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-panel p-6 bg-[#14B8A6] text-slate-900 border-none shadow-xl shadow-teal-900/30">
           <div className="flex justify-between items-start mb-4">
             <span className="text-[10px] uppercase font-black tracking-widest opacity-80">Total Users Registered</span>
             <Users className="h-5 w-5 opacity-50" />
           </div>
           <p className="text-5xl font-black font-display tracking-tighter">15,248</p>
           <div className="mt-4 pt-4 border-t border-slate-900/10 flex items-center gap-2">
              <div className="px-2 py-0.5 bg-white/30 rounded text-[9px] font-black uppercase">Realtime</div>
              <span className="text-[9px] font-bold">+124 since midnight</span>
           </div>
        </div>

        <div className="bento-panel flex flex-col justify-between p-6 bg-slate-900 border-slate-700/80">
           <div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-[#14B8A6] block mb-4">Verified Organizations</span>
             <p className="text-5xl font-black font-display tracking-tighter text-white">482</p>
           </div>
           <div className="mt-6">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#14B8A6] w-[88%] glow-teal"></div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase mt-2 block tracking-widest">88% Network Compliance</span>
           </div>
        </div>

        <div className="bento-panel flex flex-col justify-between p-6 bg-slate-900 border-slate-700/80">
           <div>
             <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block mb-4">Pending Verifications</span>
             <p className="text-5xl font-black font-display tracking-tighter text-white">12</p>
           </div>
           <button className="w-full mt-6 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black text-[10px] rounded-xl hover:bg-amber-500/20 transition-all uppercase tracking-widest">
             Review Pending Queue →
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* User Management Panel */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bento-panel p-6 h-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-lg font-bold font-display">User Directory</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Reviewing 15,248 identities</p>
              </div>
              <div className="relative w-full md:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-hover:text-[#14B8A6] transition-colors" />
                <Input placeholder="Search global directory..." className="bg-slate-900 border-slate-700 h-10 pl-10 text-xs focus:border-[#14B8A6] transition-all rounded-xl" />
              </div>
            </div>
            <div className="overflow-hidden border border-slate-700/50 rounded-2xl">
              <Table>
                <TableHeader className="bg-slate-800/40">
                  <TableRow className="border-slate-700/50 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-bold text-[10px] uppercase tracking-widest py-4">Identity</TableHead>
                    <TableHead className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Defined Role</TableHead>
                    <TableHead className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Access State</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <UserRow name="Alex Rivera" email="alex@ngo.org" role="NGO_MANAGER" active={true} />
                  <UserRow name="Jordan Smith" email="jsmith@gmail.com" role="VOLUNTEER" active={true} />
                  <UserRow name="Taylor Reed" email="treed@resourcemap.com" role="ADMIN" active={true} />
                  <UserRow name="Casey Moore" email="cmoore@other.com" role="PUBLIC" active={false} />
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Technical Insights Section */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="bento-panel p-6 bg-slate-900 border-slate-700/80">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#14B8A6] mb-6">Traffic Analysis</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PLATFORM_DATA}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                  <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', color: '#fff', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="active" stroke="#14B8A6" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bento-panel p-6 border-slate-700/50">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center justify-between">
               Verification Pipeline
               <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">! Urgent</span>
             </h4>
             <div className="space-y-3">
               <VerificationItem name="GreenHands Brazil" docs="Tax-ID, Registration" />
               <VerificationItem name="EduAfrica" docs="MOU, NGO-Cert" />
             </div>
             <button className="w-full mt-6 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
               Access Full Verification Portal →
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserRow({ name, email, role, active }: any) {
  return (
    <TableRow className="border-slate-700/50 hover:bg-slate-800/20 transition-all group">
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-slate-500 group-hover:border-[#14B8A6]/50 transition-all">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{name}</p>
            <p className="text-[9px] text-slate-500 font-mono">{email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-[8px] font-black bg-slate-900 border-slate-700 text-slate-400 uppercase tracking-widest">{role}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#14B8A6] glow-teal' : 'bg-slate-700'}`} />
          <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? 'text-slate-200' : 'text-slate-600'}`}>
            {active ? 'AUTHORIZED' : 'LOCKED'}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <button className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-500 hover:text-[#14B8A6] hover:border-[#14B8A6]/50 transition-all">
          <UserCog className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  );
}

function VerificationItem({ name, docs }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-slate-800/50 hover:border-slate-700 transition-colors group">
      <div>
        <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{name}</p>
        <p className="text-[9px] text-slate-500 font-medium font-sans mt-0.5 italic">{docs}</p>
      </div>
      <div className="flex gap-2">
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-xl bg-slate-900 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 transition-all">
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-xl bg-slate-900 border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
