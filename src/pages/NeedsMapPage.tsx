import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { CommunityNeed, Urgency } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Filter } from "lucide-react";
import L from "leaflet";

// Fix leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AnyMapContainer = MapContainer as any;
const AnyTileLayer = TileLayer as any;
const AnyPopup = Popup as any;
const AnyMarker = Marker as any;

const MOCK_NEEDS: CommunityNeed[] = [
  {
    id: "1",
    title: "Emergency Food Supply",
    description: "Urgent need for non-perishable food items for 50 families displaced by recent floods.",
    urgencyLevel: "CRITICAL",
    category: "FOOD",
    location: "Coastal Region, Sector 7",
    latitude: 51.505,
    longitude: -0.09,
    status: "OPEN",
    reportedBy: "user1",
    organizationId: "org1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Primary School Textbooks",
    description: "The local community school needs grade 1-5 textbooks for 100 students.",
    urgencyLevel: "MEDIUM",
    category: "EDUCATION",
    location: "Central Hills",
    latitude: 51.51,
    longitude: -0.1,
    status: "OPEN",
    reportedBy: "user2",
    organizationId: "org2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Mobile Clinic Support",
    description: "Volunteer nurses needed for a weekend mobile health camp.",
    urgencyLevel: "HIGH",
    category: "HEALTH",
    location: "South Slums",
    latitude: 51.49,
    longitude: -0.08,
    status: "OPEN",
    reportedBy: "user3",
    organizationId: "org1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const urgencyColors: Record<Urgency, string> = {
  LOW: "bg-blue-500",
  MEDIUM: "bg-amber-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-500"
};

export function NeedsMapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");

  const filteredNeeds = MOCK_NEEDS.filter(need => {
    const matchesSearch = need.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         need.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || need.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-[#0F172A]">
      {/* Sidebar */}
      <div className="w-full md:w-96 flex flex-col border-r border-white/5 bg-[#0F172A]/50 backdrop-blur-xl shrink-0 z-20">
        <div className="p-8 space-y-6 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-black font-display text-white tracking-tight leading-none mb-2">Needs <span className="text-[#14B8A6]">Explorer</span></h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Scanning global resource gaps</p>
          </div>
          <div className="space-y-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-hover:text-[#14B8A6] transition-colors" />
              <Input 
                placeholder="Search global directory..." 
                className="pl-10 bg-slate-900/50 border-slate-700/50 text-xs h-10 focus:border-[#14B8A6] transition-all rounded-xl placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
               <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full bg-slate-900/50 border-slate-700/50 text-xs h-10 rounded-xl focus:ring-[#14B8A6]/20">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3 text-slate-500" />
                      <SelectValue placeholder="Category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="FOOD">Food Hubs</SelectItem>
                    <SelectItem value="HEALTH">Medical Nodes</SelectItem>
                    <SelectItem value="EDUCATION">Education Units</SelectItem>
                    <SelectItem value="SHELTER">Housing Shelters</SelectItem>
                    <SelectItem value="ENVIRONMENT">Eco Projects</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-black/20">
          {filteredNeeds.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
                <Search className="h-5 w-5 text-slate-600" />
              </div>
              <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">No active nodes found</p>
            </div>
          ) : (
            filteredNeeds.map(need => (
              <div 
                key={need.id} 
                className="bento-panel p-5 bg-slate-900/40 border-slate-800/50 hover:border-[#14B8A6]/30 hover:bg-slate-800/60 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                    need.urgencyLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 
                    need.urgencyLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 
                    need.urgencyLevel === 'MEDIUM' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                    'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}>
                    {need.urgencyLevel}
                  </span>
                  <span className="text-[8px] font-black text-[#14B8A6] uppercase tracking-[0.2em]">{need.category}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors mb-2 leading-tight">{need.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-sans leading-relaxed">{need.description}</p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                  <MapPin className="h-3 w-3 text-rose-500 group-hover:animate-bounce" />
                  {need.location}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Section with Bento Wrapper */}
      <div className="flex-grow relative bg-slate-950">
        <div className="absolute inset-x-8 top-8 z-10 pointer-events-none">
           <div className="bento-panel p-4 bg-slate-900/60 w-fit backdrop-blur-xl border-white/5 flex items-center gap-4 pointer-events-auto">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 glow-teal" />
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{filteredNeeds.length} Nodes Active</span>
              </div>
              <div className="w-[1px] h-4 bg-slate-700/50" />
              <span className="text-[10px] font-bold text-slate-500 italic">Central Sector Optimization Active</span>
           </div>
        </div>
        
        <div className="h-full w-full grayscale contrast-125 opacity-90">
          <AnyMapContainer 
            center={[51.505, -0.09]} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", filter: "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
          >
            <AnyTileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredNeeds.map(need => (
              <AnyMarker key={need.id} position={[need.latitude, need.longitude]}>
                <AnyPopup>
                  <div className="p-3 min-w-[200px] bg-[#0F172A] text-slate-200 border-none shadow-none">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase mb-2 inline-block ${
                      need.urgencyLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' : 'bg-teal-500/10 text-teal-400'
                    }`}>
                      {need.urgencyLevel}
                    </span>
                    <h3 className="font-bold text-white text-sm mb-1 leading-tight tracking-tight">{need.title}</h3>
                    <p className="text-[10px] text-slate-500 mb-4 leading-relaxed font-sans">{need.description}</p>
                    <Button size="sm" className="w-full bg-[#14B8A6] hover:bg-teal-600 h-8 text-[10px] font-black text-slate-900 rounded-lg transition-all active:scale-95 uppercase tracking-widest">
                      INITIATE MATCH →
                    </Button>
                  </div>
                </AnyPopup>
              </AnyMarker>
            ))}
          </AnyMapContainer>
        </div>
      </div>
    </div>
  );
}
