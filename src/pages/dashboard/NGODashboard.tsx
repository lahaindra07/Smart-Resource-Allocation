import { useState } from "react";
import { 
  Plus, 
  Upload, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical, 
  ChevronRight,
  Sparkles,
  X,
  FileText,
  Bot,
  Loader2,
  Wand2,
  Cpu
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  LineChart, 
  Line 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { parseSurveyReport, getNemotronMatchRecommendation, ExtractedNeed } from "@/services/aiService";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { NeedCategory, Urgency } from "@/types";

interface NeedItem {
  id: string;
  title: string;
  urgency: Urgency;
  category: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  matches: number;
  aiModel?: string;
}

const INITIAL_PROJECTS: NeedItem[] = [
  { id: "1", title: "Emergency Flood Drive Sundarbans", urgency: "CRITICAL", category: "FOOD", status: "OPEN", matches: 16, aiModel: "NVIDIA Nemotron 3 Ultra" },
  { id: "2", title: "Assam Primary School Roof Repairs", urgency: "HIGH", category: "SHELTER", status: "IN_PROGRESS", matches: 10 },
  { id: "3", title: "Wayanad Landslide Medical Camp", urgency: "CRITICAL", category: "HEALTH", status: "OPEN", matches: 14, aiModel: "NVIDIA Nemotron 3 Ultra" },
  { id: "4", title: "Bundelkhand Solar Water Purification", urgency: "MEDIUM", category: "ENVIRONMENT", status: "RESOLVED", matches: 28 },
];

const ACTIVITY_DATA = [
  { month: 'Jan', resolved: 40, reported: 45 },
  { month: 'Feb', resolved: 35, reported: 50 },
  { month: 'Mar', resolved: 55, rounded: 60 },
  { month: 'Apr', resolved: 70, reported: 75 },
  { month: 'May', resolved: 85, reported: 90 },
];

const SAMPLE_SURVEY_TEXT = `RAPID FLOOD & CYCLONE ASSESSMENT - SUNDARBANS DELTA & ASSAM SECTOR
Coordinates: 22.1652, 88.8072
State Disaster Management Authority (SDMA / NDMA Liaison)

1. Potable Drinking Water & Ration Packs:
Severe tidal storm surge has breached the river embankment at Gosaba. Over 280 rural families are without potable drinking water and infant milk supplies. Immediate high-capacity water purification units and dry food ration parcels (rice, chira, dal) are urgently needed.

2. Outpatient Healthcare & Snakebite Triage:
Field sub-centers report a surge in acute waterborne illnesses and pediatric dehydration among 45 children. We require mobile doctors, triage nurses, and oral rehydration therapy (ORS) kits at the Community Relief Pavilion.

3. Emergency Shelter & Tarpaulins:
Gale winds tore roofs off 60 temporary bamboo shelters in the coastal sector. Evacuated families need heavy-duty tarpaulins, bamboo framing anchors, and thermal ground sheets before nightfall.`;

export function NGODashboard() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [projects, setProjects] = useState<NeedItem[]>(INITIAL_PROJECTS);
  const [showNewNeedModal, setShowNewNeedModal] = useState(false);
  
  // NVIDIA Nemotron AI Modal & State
  const [showAiModal, setShowAiModal] = useState(false);
  const [surveyInputText, setSurveyInputText] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [extractedNeeds, setExtractedNeeds] = useState<ExtractedNeed[]>([]);
  
  // Volunteer Match AI Briefs
  const [aiBriefs, setAiBriefs] = useState<Record<string, string>>({});
  const [loadingBriefFor, setLoadingBriefFor] = useState<string | null>(null);

  // New Need Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<NeedCategory>("FOOD");
  const [newUrgency, setNewUrgency] = useState<Urgency>("HIGH");
  const [newLocation, setNewLocation] = useState("");

  const needsData = [
    { name: 'Health', value: projects.filter(p => p.category === 'HEALTH').length * 15 + 20, color: '#0D9488' },
    { name: 'Food', value: projects.filter(p => p.category === 'FOOD').length * 15 + 25, color: '#F59E0B' },
    { name: 'Education', value: projects.filter(p => p.category === 'EDUCATION').length * 15 + 18, color: '#3B82F6' },
    { name: 'Shelter', value: projects.filter(p => p.category === 'SHELTER').length * 15 + 15, color: '#EC4899' },
    { name: 'Environment', value: projects.filter(p => p.category === 'ENVIRONMENT').length * 15 + 10, color: '#10B981' },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target?.result as string;
      try {
        const extracted = await parseSurveyReport(content);
        toast.info(`NVIDIA Nemotron 3 Ultra parsed survey: ${extracted.length} needs identified.`);

        const newNeeds: NeedItem[] = extracted.map((item, idx) => ({
          id: `survey-need-${Date.now()}-${idx}`,
          title: item.title,
          urgency: item.urgencyLevel,
          category: item.category,
          status: "OPEN",
          matches: Math.floor(Math.random() * 8) + 6,
          aiModel: "NVIDIA Nemotron 3 Ultra"
        }));

        setProjects(prev => [...newNeeds, ...prev]);

        try {
          for (const item of extracted) {
            await addDoc(collection(db, "needs"), {
              title: item.title,
              description: item.description,
              category: item.category,
              urgencyLevel: item.urgencyLevel,
              location: item.location || "Central Sector",
              status: "OPEN",
              reportedBy: user?.id || "demo-ngo-manager",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (dbErr) {
          console.warn("Local storage used for parsed survey:", dbErr);
        }

        toast.success(`NVIDIA Nemotron registered ${extracted.length} crisis needs!`);
      } catch (error) {
        console.error("Survey processing error:", error);
        toast.error("Failed to parse report file.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleRunAiParser = async () => {
    if (!surveyInputText.trim()) {
      toast.error("Please enter or paste survey report text to analyze.");
      return;
    }

    setIsAiProcessing(true);
    try {
      const extracted = await parseSurveyReport(surveyInputText);
      setExtractedNeeds(extracted);
      toast.success(`NVIDIA Nemotron 3 Ultra extracted ${extracted.length} crisis needs!`);
    } catch (err) {
      toast.error("Error analyzing survey text.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleCommitExtractedNeeds = async () => {
    if (extractedNeeds.length === 0) return;

    const newNeeds: NeedItem[] = extractedNeeds.map((item, idx) => ({
      id: `ai-need-${Date.now()}-${idx}`,
      title: item.title,
      urgency: item.urgencyLevel,
      category: item.category,
      status: "OPEN",
      matches: Math.floor(Math.random() * 8) + 6,
      aiModel: "NVIDIA Nemotron 3 Ultra"
    }));

    setProjects(prev => [...newNeeds, ...prev]);

    try {
      for (const item of extractedNeeds) {
        await addDoc(collection(db, "needs"), {
          title: item.title,
          description: item.description,
          category: item.category,
          urgencyLevel: item.urgencyLevel,
          location: item.location || "Sector Relief Hub",
          status: "OPEN",
          reportedBy: user?.id || "ngo-manager",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (dbErr) {
      console.warn("Database sync completed in local state:", dbErr);
    }

    setShowAiModal(false);
    setSurveyInputText("");
    setExtractedNeeds([]);
    toast.success(`Successfully dispatched ${newNeeds.length} tickets to field operations!`);
  };

  const handleFetchVolunteerBrief = async (volunteer: { name: string; skills: string[]; availability: string; hoursPerWeek: number }) => {
    const targetNeed = projects[0] || {
      title: "Emergency Potable Water & Rations Relief",
      category: "FOOD",
      urgencyLevel: "CRITICAL",
      location: "Coastal Sector 4"
    };

    setLoadingBriefFor(volunteer.name);
    try {
      const res = await getNemotronMatchRecommendation(targetNeed, volunteer);
      setAiBriefs(prev => ({ ...prev, [volunteer.name]: res.recommendation }));
    } catch (err) {
      toast.error("Could not fetch AI brief.");
    } finally {
      setLoadingBriefFor(null);
    }
  };

  const handleCreateNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a title for the need.");
      return;
    }

    const created: NeedItem = {
      id: `manual-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      urgency: newUrgency,
      status: "OPEN",
      matches: Math.floor(Math.random() * 10) + 5
    };

    setProjects([created, ...projects]);
    setShowNewNeedModal(false);
    setNewTitle("");
    setNewLocation("");
    toast.success(`Need "${newTitle}" posted! Matching engine triggered.`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-[calc(100vh-64px)] text-slate-800">
      <input 
        type="file" 
        id="survey-upload" 
        className="hidden" 
        accept=".txt,.md,.pdf,.csv" 
        onChange={handleFileUpload}
      />

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">
            NGO <span className="text-teal-600">Operations Core</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Overseeing community tickets and dispatch for {user?.name || "Global NGO Relief"}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Cpu className="h-3.5 w-3.5 text-emerald-600" />
            <span>NVIDIA Nemotron 3 Ultra</span>
          </div>

          <Button 
            variant="outline" 
            className="gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs h-9 text-xs font-semibold" 
            onClick={() => setShowAiModal(true)}
          >
            <Bot className="h-4 w-4 text-emerald-600" />
            <span>Nemotron AI Scanner</span>
          </Button>

          <Button 
            variant="outline" 
            className="gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs h-9 text-xs font-semibold" 
            onClick={() => document.getElementById('survey-upload')?.click()} 
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 text-teal-600" />
            {isUploading ? "Ingesting..." : "Upload File"}
          </Button>

          <Button 
            onClick={() => setShowNewNeedModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs gap-1.5 h-9 text-xs"
          >
            <Plus className="h-4 w-4" /> Post New Need
          </Button>
        </div>
      </header>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Needs</p>
            <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">
              {projects.filter(p => p.status === "OPEN").length}
            </p>
            <span className="text-[11px] font-bold text-teal-600">+15% this month</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Matched Volunteers</p>
            <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">1,420</p>
            <span className="text-[11px] font-bold text-teal-600">+18% active</span>
          </div>
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolution Rate</p>
            <p className="text-2xl font-extrabold text-slate-900 font-display mt-1">89.4%</p>
            <span className="text-[11px] font-bold text-teal-600">+4.2% verified</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 bg-teal-600 text-white rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-teal-100 uppercase tracking-wider">Dispatch Efficiency</p>
            <p className="text-2xl font-extrabold text-white font-display mt-1">94%</p>
            <span className="text-[11px] font-bold text-teal-200">1.2m latency</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/20 text-white">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Section */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Chart Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Need Category Distribution</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time sector demands across regional operations</p>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-700 h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={needsData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={80} tick={{ fill: '#64748B' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#0F172A', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {needsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">
                  Active Resource Needs
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Track and update field status</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200">
                {projects.length} Total Registered
              </span>
            </div>
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="text-slate-600 font-bold text-xs py-3">Title</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs">Urgency</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs">Sector</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs">Status</TableHead>
                    <TableHead className="text-slate-600 font-bold text-xs">Candidates</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <TableCell className="font-semibold text-slate-900 py-3 text-xs">{project.title}</TableCell>
                      <TableCell>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          project.urgency === "CRITICAL"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : project.urgency === "HIGH"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : project.urgency === "MEDIUM"
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {project.urgency}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-teal-700 font-semibold">{project.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${project.status === 'OPEN' ? 'bg-teal-600' : project.status === 'IN_PROGRESS' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                          <span className="text-xs font-medium text-slate-600">{project.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-600 text-xs">{project.matches} Matches</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Resolution Flow Line Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-display">Resolution Flow</h3>
              <p className="text-xs text-slate-500 mt-0.5">Reported demands vs resolved</p>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ACTIVITY_DATA}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A', fontSize: '11px', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="reported" stroke="#0D9488" strokeWidth={2.5} dot={{ r: 3.5, fill: '#0D9488' }} />
                  <Line type="monotone" dataKey="resolved" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3.5, fill: '#F59E0B' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-600" />
                <span className="font-medium text-slate-600">Reported</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-600">Resolved</span>
              </div>
            </div>
          </div>

          {/* Real-time Algorithmic Matches */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
                Candidate Matches
              </h3>
              <Users className="h-4 w-4 text-teal-600" />
            </div>
            <div className="space-y-3.5">
              {[
                { name: "Aarav Sharma", initial: "A", role: "Water & Food Logistics • 1.4km", fit: "98% Fit", skills: ["Food Distribution", "Water Purification", "First Aid"], availability: "Weekends", hoursPerWeek: 14 },
                { name: "Dr. Priya Nair", initial: "P", role: "Wayanad Medical Outpost • 2.1km", fit: "96% Fit", skills: ["Triage Nurse", "Pediatric Care", "Emergency Medicine"], availability: "Flexible", hoursPerWeek: 20 },
                { name: "Rajesh Mukherjee", initial: "R", role: "Civil & Shelter Repairs • 3.2km", fit: "92% Fit", skills: ["Carpentry", "NDRF Liaison", "Shelter Construction"], availability: "Weekdays", hoursPerWeek: 16 }
              ].map(vol => (
                <div key={vol.name} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 space-y-2 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-xs">
                        {vol.initial}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{vol.name}</p>
                        <p className="text-[10px] text-slate-500">{vol.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-600">{vol.fit}</span>
                      <button
                        onClick={() => handleFetchVolunteerBrief(vol)}
                        disabled={loadingBriefFor === vol.name}
                        className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Generate tactical dispatch assessment via NVIDIA Nemotron"
                      >
                        {loadingBriefFor === vol.name ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Bot className="h-3 w-3 text-emerald-600" />
                        )}
                        <span>AI Brief</span>
                      </button>
                    </div>
                  </div>

                  {aiBriefs[vol.name] && (
                    <div className="p-2.5 rounded-lg bg-white border border-emerald-200/80 text-[11px] text-slate-700 space-y-1 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase text-emerald-700 tracking-wider">
                        <Cpu className="h-3 w-3 text-emerald-600" />
                        <span>Nemotron Tactical Recommendation</span>
                      </div>
                      <p className="leading-relaxed text-slate-600">{aiBriefs[vol.name]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post New Need Modal */}
      {showNewNeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-display">Create Community Need</h3>
              <button onClick={() => setShowNewNeedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNeed} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Need Title</Label>
                <Input 
                  placeholder="e.g. Drinking Water Filtration Support" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  className="bg-white border-slate-200 text-xs h-9.5 text-slate-900" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Sector</Label>
                  <Select value={newCategory} onValueChange={v => setNewCategory(v as NeedCategory)}>
                    <SelectTrigger className="bg-white border-slate-200 text-xs h-9.5 text-slate-800">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-800">
                      <SelectItem value="FOOD">Food & Water</SelectItem>
                      <SelectItem value="HEALTH">Health & Medical</SelectItem>
                      <SelectItem value="EDUCATION">Education</SelectItem>
                      <SelectItem value="SHELTER">Shelter & Housing</SelectItem>
                      <SelectItem value="ENVIRONMENT">Environment</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Urgency</Label>
                  <Select value={newUrgency} onValueChange={v => setNewUrgency(v as Urgency)}>
                    <SelectTrigger className="bg-white border-slate-200 text-xs h-9.5 text-slate-800">
                      <SelectValue placeholder="Urgency" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-800">
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Location Description</Label>
                <Input 
                  placeholder="e.g. Sector 7 Community Hall" 
                  value={newLocation} 
                  onChange={e => setNewLocation(e.target.value)}
                  className="bg-white border-slate-200 text-xs h-9.5 text-slate-900" 
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNewNeedModal(false)} 
                  className="border-slate-200 text-slate-600 text-xs h-9"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs h-9"
                >
                  Publish Need
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NVIDIA Nemotron AI Survey Scanner Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                    NVIDIA Nemotron 3 Ultra AI Scanner
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ingest raw incident reports or field notes to auto-generate prioritized tickets.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-slate-700">Survey Field Notes / Disaster Report</Label>
                  <button
                    type="button"
                    onClick={() => setSurveyInputText(SAMPLE_SURVEY_TEXT)}
                    className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="h-3 w-3" />
                    Load Sample Flood Assessment
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={surveyInputText}
                  onChange={(e) => setSurveyInputText(e.target.value)}
                  placeholder="Paste unstructured damage assessments, field reports, or dispatch logs here..."
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => document.getElementById("survey-upload")?.click()}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Or upload file (.txt, .md, .csv)
                </button>

                <Button
                  onClick={handleRunAiParser}
                  disabled={isAiProcessing || !surveyInputText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 shadow-xs gap-2 cursor-pointer"
                >
                  {isAiProcessing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Parsing with Nemotron...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Extract Needs with Nemotron</span>
                    </>
                  )}
                </Button>
              </div>

              {extractedNeeds.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900 font-display">
                      Extracted Tickets ({extractedNeeds.length})
                    </p>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      Parsed by NVIDIA Nemotron 3 Ultra
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {extractedNeeds.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{item.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            item.urgencyLevel === "CRITICAL"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : item.urgencyLevel === "HIGH"
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : "bg-teal-50 text-teal-700 border border-teal-200"
                          }`}>
                            {item.urgencyLevel}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{item.description}</p>
                        <div className="flex gap-3 text-[10px] text-slate-500 pt-0.5">
                          <span>Sector: <strong className="text-slate-700">{item.category}</strong></span>
                          <span>•</span>
                          <span>Location: <strong className="text-slate-700">{item.location}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setShowAiModal(false)}
                className="border-slate-200 text-slate-600 text-xs h-9 cursor-pointer"
              >
                Close
              </Button>
              {extractedNeeds.length > 0 && (
                <Button 
                  onClick={handleCommitExtractedNeeds}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs h-9 gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Register All Extracted Needs ({extractedNeeds.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
