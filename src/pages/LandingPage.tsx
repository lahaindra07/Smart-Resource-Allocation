import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  MapPin, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Heart, 
  Zap, 
  Compass, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Activity,
  Layers,
  Globe2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SAMPLE_CRISES = [
  {
    id: "c1",
    title: "Emergency Flood Rations & Water Supply",
    category: "FOOD",
    urgency: "CRITICAL",
    location: "Sundarbans Delta, West Bengal",
    matchedVolunteer: "Aarav Sharma",
    role: "Disaster Logistics Specialist",
    score: 98,
    distance: "1.4 km",
    skills: ["Disaster Logistics", "Water Purification", "First Aid"]
  },
  {
    id: "c2",
    title: "Mobile Emergency Clinic & Triage Outpost",
    category: "HEALTH",
    urgency: "HIGH",
    location: "Wayanad Relief Base, Kerala",
    matchedVolunteer: "Dr. Priya Nair",
    role: "Emergency Triage Physician",
    score: 95,
    distance: "2.1 km",
    skills: ["Trauma Medicine", "Triage Care", "Pediatrics"]
  },
  {
    id: "c3",
    title: "Floodplain Displaced Children Learning Hub",
    category: "EDUCATION",
    urgency: "MEDIUM",
    location: "Morigaon District, Assam",
    matchedVolunteer: "Ananya Sen",
    role: "Community Education Mentor",
    score: 91,
    distance: "3.2 km",
    skills: ["Child Education", "Assamese & Bengali", "Mentoring"]
  }
];

export function LandingPage() {
  const [activeCrisisIndex, setActiveCrisisIndex] = useState(0);
  const activeCrisis = SAMPLE_CRISES[activeCrisisIndex];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-50">
        {/* Soft background glow circles */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <motion.div 
              className="lg:col-span-7 text-center lg:text-left space-y-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Live Status Pill */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/70 px-4 py-1.5 rounded-full shadow-xs"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  🇮🇳 India Relief Network v2.4
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-teal-700">1,420 Active Matches Today</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.08] tracking-tight font-display">
                Smart Resource <br />
                <span className="text-teal-600 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Allocation
                </span> for Social Impact.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                ResourceMap India connects humanitarian NGOs across Indian states with verified, skilled volunteers precisely where aid is needed most. Powered by sub-meter GIS routing, NVIDIA Nemotron 3 Ultra AI survey extraction, and algorithmic matching.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link
                  to="/needs"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all active:scale-95 group"
                >
                  <span>Explore Live Needs Map</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 shadow-xs transition-all active:scale-95"
                >
                  <span>Join as Volunteer or NGO</span>
                </Link>
              </div>

              {/* Micro-metrics */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>Real-Time Haversine Routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>Automated AI Survey Parsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>Verified NGO Directory</span>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Live Simulation Card */}
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 space-y-6 relative overflow-hidden">
                {/* Header of widget */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                      <Activity className="h-4 w-4 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 font-display">Live Matching Engine</p>
                      <p className="text-[10px] text-slate-500">Real-time candidate telemetry</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full border border-teal-200/60">
                    Active
                  </span>
                </div>

                {/* Sample ticket selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulate Incident Scenario:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SAMPLE_CRISES.map((c, i) => (
                      <button
                        key={c.id}
                        onClick={() => setActiveCrisisIndex(i)}
                        className={`py-1.5 px-2 text-[10px] font-bold rounded-lg transition-all text-center ${
                          activeCrisisIndex === i
                            ? "bg-teal-600 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        {c.category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Need Detail */}
                <motion.div 
                  key={activeCrisis.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-rose-50 text-rose-700 border border-rose-200">
                      {activeCrisis.urgency} Priority
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-rose-500" />
                      {activeCrisis.location}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {activeCrisis.title}
                  </h4>
                </motion.div>

                {/* Algorithmic Match Result */}
                <div className="p-4 bg-white rounded-xl border border-teal-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {activeCrisis.matchedVolunteer.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{activeCrisis.matchedVolunteer}</p>
                        <p className="text-[11px] text-slate-500">{activeCrisis.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold text-teal-600 font-display">
                        {activeCrisis.score}%
                      </span>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Match Score</p>
                    </div>
                  </div>

                  {/* Compatibility Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Proximity ({activeCrisis.distance})</span>
                      <span>Skill Overlap (100%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-teal-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeCrisis.score}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeCrisis.skills.map((s) => (
                      <span key={s} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/needs"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Launch Live Dispatch System</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Bento Grid */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full">
              Full-Stack Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
              Built for Speed, Accuracy, and Impact.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Every feature is engineered to replace bureaucratic friction with automated geospatial intelligence and verified action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center shadow-xs">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Sub-Meter GIS Mapping</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Powered by Leaflet, displaying live localized community tickets across Food, Health, Shelter, Education, and Environment. Instant filtering by radius and urgency.
              </p>
              <div className="pt-2">
                <Link to="/needs" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  Explore Map Features <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shadow-xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">NVIDIA Nemotron AI Ingestion</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload raw, unstructured field survey notes or disaster assessments. NVIDIA Nemotron 3 Ultra automatically structures, prioritizes, and geolocates each ticket in seconds.
              </p>
              <div className="pt-2">
                <Link to="/dashboard/ngo" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  Open NGO Ingestion Core <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shadow-xs">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Haversine Matching Algorithm</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Evaluates distance proximity (30 pts), skill keyword overlap (40 pts), weekly availability (20 pts), and historical impact ratings (10 pts) for transparent match scoring.
              </p>
              <div className="pt-2">
                <Link to="/dashboard/volunteer" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View Volunteer Feed <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Numerical Impact Metrics Bar */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-black text-slate-900 font-display tracking-tight">12.8k+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Active Volunteers</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-black text-slate-900 font-display tracking-tight">482+</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Verified Partner NGOs</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-black text-slate-900 font-display tracking-tight">89.4%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Resolution Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-black text-slate-900 font-display tracking-tight">1.2m</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Dispatch Latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Open & Free for Social Impact
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display tracking-tight">
            Ready to Bridge the Resource Gap?
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Register your NGO to publish critical community needs, or sign up as a skilled volunteer to make an immediate, targeted difference.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all active:scale-95"
            >
              Create Free Account
            </Link>
            <Link
              to="/needs"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-all border border-slate-200"
            >
              Explore Live Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
