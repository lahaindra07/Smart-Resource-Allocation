import { useState } from "react";
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Check, 
  X, 
  UserCog,
  Shield,
  Activity
} from "lucide-react";
import { 
  XAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
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
import { toast } from "sonner";

const PLATFORM_DATA = [
  { day: 'Mon', active: 120 },
  { day: 'Tue', active: 150 },
  { day: 'Wed', active: 200 },
  { day: 'Thu', active: 180 },
  { day: 'Fri', active: 250 },
  { day: 'Sat', active: 300 },
  { day: 'Sun', active: 280 },
];

const INITIAL_USERS = [
  { id: "u1", name: "Alex Rivera", email: "alex@relief.ngo", role: "NGO_MANAGER", active: true },
  { id: "u2", name: "Jordan Smith", email: "jsmith@gmail.com", role: "VOLUNTEER", active: true },
  { id: "u3", name: "Taylor Reed", email: "treed@resourcemap.org", role: "ADMIN", active: true },
  { id: "u4", name: "Casey Moore", email: "cmoore@other.com", role: "PUBLIC", active: false },
  { id: "u5", name: "Dr. Aris Thorne", email: "athorne@healthcorps.org", role: "NGO_MANAGER", active: true },
];

const INITIAL_VERIFICATIONS = [
  { id: "v1", name: "SEEDS India Disaster Response", docs: "NGO Darpan ID, FCRA, NDMA Liaison" },
  { id: "v2", name: "Goonj Humanitarian Aid Network", docs: "Darpan Portal Registration, 80G Certificate" },
  { id: "v3", name: "Akshaya Patra Relief Logistics", docs: "FSSAI Relief License, State Disaster MoU" },
  { id: "v4", name: "Ramakrishna Mission Relief Wing", docs: "Charitable Societies Registration, West Bengal" },
];

export function AdminDashboard() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifications, setVerifications] = useState(INITIAL_VERIFICATIONS);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserAccess = (id: string, name: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextState = !u.active;
        toast.info(`Access for ${name} set to ${nextState ? "AUTHORIZED" : "LOCKED"}`);
        return { ...u, active: nextState };
      }
      return u;
    }));
  };

  const handleApprove = (id: string, name: string) => {
    setVerifications(prev => prev.filter(v => v.id !== id));
    toast.success(`Organization "${name}" verified and approved for network dispatch!`);
  };

  const handleReject = (id: string, name: string) => {
    setVerifications(prev => prev.filter(v => v.id !== id));
    toast.error(`Verification rejected for "${name}". Notification dispatched.`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-[calc(100vh-64px)] text-slate-800">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">
            Network <span className="text-teal-600">Control Center</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Global governance, compliance audits, and security telemetry.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 font-mono">
              All Systems Operational
            </span>
          </div>
        </div>
      </header>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Registered Identities
            </span>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display mt-2">15,248</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200/60 rounded text-[10px] font-bold">Live</span>
              <span className="text-xs text-slate-500">+124 since midnight</span>
            </div>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-teal-700">
              Verified Organizations
            </span>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display mt-2">482</p>
            <div className="mt-2 text-xs font-medium text-slate-500">
              88% Network Compliance Rate
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-700">
              Pending Audit Queue
            </span>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display mt-2">
              {verifications.length}
            </p>
            <div className="mt-2 text-xs font-medium text-slate-500">
              {verifications.length > 0 ? "Requires review" : "Queue cleared"}
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Shield className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* User Management Panel */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 h-full space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">User Directory</h3>
                <p className="text-xs text-slate-500 mt-0.5">Filter by identity, email, or security tier</p>
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input 
                  placeholder="Filter users..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-9 pl-9 text-xs rounded-xl text-slate-900" 
                />
              </div>
            </div>

            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="text-slate-600 font-bold text-xs py-3">Identity</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs">Role</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs">State</TableHead>
                    <TableHead className="text-right text-slate-600 font-bold text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/70 transition-all">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-semibold bg-slate-50 border-slate-200 text-slate-700">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className={`text-xs font-bold ${user.active ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {user.active ? 'ACTIVE' : 'LOCKED'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => toggleUserAccess(user.id, user.name)}
                          className="h-8 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Technical Insights Section */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
                Traffic & Dispatch Telemetry
              </h3>
              <Activity className="h-4 w-4 text-teal-600" />
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PLATFORM_DATA}>
                  <defs>
                    <linearGradient id="colorActiveLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="active" stroke="#0D9488" fillOpacity={1} fill="url(#colorActiveLight)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display flex items-center justify-between">
              NGO Verification Pipeline
              <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px]">
                {verifications.length} Pending Audit
              </span>
            </h4>
            <div className="space-y-3">
              {verifications.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No pending organization verifications.</p>
              ) : (
                verifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.docs}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleApprove(item.id, item.name)}
                        className="h-7 w-7 rounded-lg bg-white border-emerald-300 text-emerald-600 hover:bg-emerald-50 shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => handleReject(item.id, item.name)}
                        className="h-7 w-7 rounded-lg bg-white border-rose-300 text-rose-600 hover:bg-rose-50 shadow-xs"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
