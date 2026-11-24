import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { CommunityNeed, Urgency } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Filter, Compass, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

const AnyMapContainer = MapContainer as any;
const AnyTileLayer = TileLayer as any;
const AnyMarker = Marker as any;
const AnyPopup = Popup as any;

// Vibrant, light-mode friendly custom pin markers
function createCustomMarkerIcon(urgency: Urgency) {
  const colorMap: Record<Urgency, { main: string; ring: string }> = {
    CRITICAL: { main: "#EF4444", ring: "rgba(239, 68, 68, 0.25)" },
    HIGH: { main: "#F97316", ring: "rgba(249, 115, 22, 0.25)" },
    MEDIUM: { main: "#0D9488", ring: "rgba(13, 148, 136, 0.25)" },
    LOW: { main: "#3B82F6", ring: "rgba(59, 130, 246, 0.25)" }
  };
  const { main, ring } = colorMap[urgency] || colorMap.MEDIUM;

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background-color: ${ring}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${main}; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.25);"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
}

function MapViewController({ targetCoords }: { targetCoords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 14, { duration: 1.2 });
    }
  }, [targetCoords, map]);
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const timers = [
      setTimeout(() => map.invalidateSize(), 50),
      setTimeout(() => map.invalidateSize(), 250),
      setTimeout(() => map.invalidateSize(), 750),
    ];
    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);
  return null;
}

const INITIAL_NEEDS: CommunityNeed[] = [
  {
    id: "need-1",
    title: "Emergency Food Rations & Potable Water",
    description: "Tidal river breach inundated 3 villages. Critical need for non-perishable food parcels (rice, chira, dal) and portable drinking water purification kits for 180 families.",
    urgencyLevel: "CRITICAL",
    category: "FOOD",
    location: "Gosaba, Sundarbans Delta, West Bengal",
    latitude: 22.1652,
    longitude: 88.8072,
    status: "OPEN",
    reportedBy: "org1",
    organizationId: "org1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "need-2",
    title: "Primary School Textbooks & Activity Kits",
    description: "Inundated village school needs grade 1-8 syllabus books, notebooks, and learning activity kits for 160 displaced students.",
    urgencyLevel: "MEDIUM",
    category: "EDUCATION",
    location: "Morigaon District Floodplain, Assam",
    latitude: 26.2503,
    longitude: 92.3421,
    status: "OPEN",
    reportedBy: "org2",
    organizationId: "org2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "need-3",
    title: "Mobile Emergency Clinic & First Aid Camp",
    description: "Monsoon landslide evacuees require mobile medical personnel, wound dressing, anti-venom, and oral rehydration therapy (ORS).",
    urgencyLevel: "HIGH",
    category: "HEALTH",
    location: "Meppadi Relief Base, Wayanad, Kerala",
    latitude: 11.5534,
    longitude: 76.1287,
    status: "OPEN",
    reportedBy: "org3",
    organizationId: "org3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "need-4",
    title: "Cyclone Resistant Shelters & Tarpaulins",
    description: "Severe coastal gale damaged 80 thatched huts. Heavy-duty waterproof tarpaulins, bamboo framing anchors, and thermal ground sheets needed.",
    urgencyLevel: "CRITICAL",
    category: "SHELTER",
    location: "Puri Coastal Corridor, Odisha",
    latitude: 19.8135,
    longitude: 85.8312,
    status: "OPEN",
    reportedBy: "org4",
    organizationId: "org4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "need-5",
    title: "Potable Water Tankers & Deep Well Filtration",
    description: "Drought-affected rural sector needs emergency solar-powered water filtration units and ground water tanker distribution.",
    urgencyLevel: "HIGH",
    category: "ENVIRONMENT",
    location: "Jhansi & Mahoba Outpost, Uttar Pradesh",
    latitude: 25.4484,
    longitude: 78.5685,
    status: "OPEN",
    reportedBy: "org5",
    organizationId: "org5",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "need-6",
    title: "Urban Slum Waterlogging Medical Triage",
    description: "Severe monsoon waterlogging requires preventative leptospirosis medicine, rapid outpatient triage, and pediatric rehydration camps.",
    urgencyLevel: "HIGH",
    category: "HEALTH",
    location: "Kurla Mithi Basin, Mumbai, Maharashtra",
    latitude: 19.0728,
    longitude: 72.8797,
    status: "OPEN",
    reportedBy: "org3",
    organizationId: "org3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "need-7",
    title: "Community Kitchen & Dry Rations Drive",
    description: "Yamuna floodplain evacuation center requires community kitchen volunteers and daily cooked meals for 300 displaced laborers.",
    urgencyLevel: "HIGH",
    category: "FOOD",
    location: "Yamuna Khadar, East Delhi, Delhi NCR",
    latitude: 28.6280,
    longitude: 77.2789,
    status: "OPEN",
    reportedBy: "org1",
    organizationId: "org1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function NeedsMapPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterUrgency, setFilterUrgency] = useState("ALL");
  const [selectedCoord, setSelectedCoord] = useState<[number, number] | null>(null);
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>("need-1");

  const filteredNeeds = INITIAL_NEEDS.filter(need => {
    const matchesSearch =
      need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || need.category === filterCategory;
    const matchesUrgency = filterUrgency === "ALL" || need.urgencyLevel === filterUrgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const handleSelectNeed = (need: CommunityNeed) => {
    setSelectedNeedId(need.id);
    setSelectedCoord([need.latitude, need.longitude]);
  };

  const handleInitiateMatch = (need: CommunityNeed) => {
    toast.success(`Match candidate registered for "${need.title}"! Redirecting to Volunteer Portal...`);
    setTimeout(() => {
      navigate("/dashboard/volunteer");
    }, 700);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-slate-50">
      {/* Sidebar Navigation Panel */}
      <div className="w-full md:w-[420px] flex flex-col border-r border-slate-200 bg-white shadow-sm shrink-0 z-20">
        <div className="p-5 space-y-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
                Needs <span className="text-teal-600">Explorer</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Live geospatial community tickets & relief demands
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              {filteredNeeds.length} Active
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by keywords, location, sector..."
                className="pl-9 bg-slate-50 border-slate-200 text-xs h-9.5 rounded-xl text-slate-900 focus:bg-white transition-all shadow-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-xs h-9 rounded-xl text-slate-700">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-800">
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="FOOD">Food & Water</SelectItem>
                  <SelectItem value="HEALTH">Health & Medical</SelectItem>
                  <SelectItem value="EDUCATION">Education</SelectItem>
                  <SelectItem value="SHELTER">Housing & Shelter</SelectItem>
                  <SelectItem value="ENVIRONMENT">Environment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 text-xs h-9 rounded-xl text-slate-700">
                  <SelectValue placeholder="All Urgencies" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-800">
                  <SelectItem value="ALL">All Urgencies</SelectItem>
                  <SelectItem value="CRITICAL">Critical Priority</SelectItem>
                  <SelectItem value="HIGH">High Priority</SelectItem>
                  <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                  <SelectItem value="LOW">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Needs List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {filteredNeeds.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-200 shadow-xs text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-slate-800">No matching community needs</p>
              <p className="text-xs text-slate-500 mt-1">Try broadening your search term or filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("ALL");
                  setFilterUrgency("ALL");
                }}
                className="mt-4 text-xs border-slate-300 text-slate-700"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredNeeds.map((need) => {
              const isSelected = selectedNeedId === need.id;
              return (
                <div
                  key={need.id}
                  onClick={() => handleSelectNeed(need)}
                  className={`p-4 bg-white border transition-all cursor-pointer rounded-xl ${
                    isSelected
                      ? "border-teal-500 shadow-md ring-2 ring-teal-500/10"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        need.urgencyLevel === "CRITICAL"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : need.urgencyLevel === "HIGH"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : need.urgencyLevel === "MEDIUM"
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {need.urgencyLevel}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {need.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {need.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {need.description}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100 text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{need.location}</span>
                    </div>
                    <span className="text-teal-600 font-semibold text-xs flex items-center gap-0.5">
                      View <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Map Interactive Section */}
      <div className="flex-1 relative bg-slate-100 min-h-[450px] md:min-h-0 h-full w-full overflow-hidden">
        {/* Floating status badge */}
        <div className="absolute left-6 top-6 z-[1000] pointer-events-none">
          <div className="p-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">
                {filteredNeeds.length} India Relief Nodes
              </span>
            </div>
            <div className="w-px h-3.5 bg-slate-200" />
            <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" /> Sub-Meter GIS India
            </span>
          </div>
        </div>

        {/* Regional Quick Jumps */}
        <div className="absolute right-6 top-6 z-[1000] hidden sm:flex flex-wrap gap-1.5 max-w-[480px] justify-end">
          {[
            { label: "🇮🇳 All India", coords: [22.5937, 78.9629] as [number, number] },
            { label: "Sundarbans (WB)", coords: [22.1652, 88.8072] as [number, number] },
            { label: "Wayanad (KL)", coords: [11.5534, 76.1287] as [number, number] },
            { label: "Assam", coords: [26.2503, 92.3421] as [number, number] },
            { label: "Puri (OD)", coords: [19.8135, 85.8312] as [number, number] },
            { label: "Delhi NCR", coords: [28.6280, 77.2789] as [number, number] },
            { label: "Mumbai", coords: [19.0728, 72.8797] as [number, number] },
          ].map(r => (
            <button
              key={r.label}
              onClick={() => setSelectedCoord(r.coords)}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/95 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Map Container inside absolute inset-0 */}
        <div className="absolute inset-0 w-full h-full">
          <AnyMapContainer
            center={[22.5937, 78.9629]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", minHeight: "450px" }}
          >
            <AnyTileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapResizer />
            <MapViewController targetCoords={selectedCoord} />

            {filteredNeeds.map((need) => (
              <AnyMarker
                key={need.id}
                position={[need.latitude, need.longitude]}
                icon={createCustomMarkerIcon(need.urgencyLevel)}
              >
                <AnyPopup>
                  <div className="p-4 min-w-[240px] max-w-[280px]">
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          need.urgencyLevel === "CRITICAL"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : need.urgencyLevel === "HIGH"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "bg-teal-50 text-teal-700 border border-teal-200"
                        }`}
                      >
                        {need.urgencyLevel}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{need.category}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">
                      {need.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {need.description}
                    </p>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {need.location}
                    </p>

                    <Button
                      size="sm"
                      onClick={() => handleInitiateMatch(need)}
                      className="w-full bg-teal-600 hover:bg-teal-700 h-8 text-xs font-semibold text-white rounded-lg shadow-xs transition-all"
                    >
                      Initiate Match →
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
