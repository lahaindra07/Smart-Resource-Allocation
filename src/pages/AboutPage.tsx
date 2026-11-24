import { HandHeart, Target, Users, Zap, Shield, Globe2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/80 px-4 py-1.5 rounded-full shadow-xs">
            <HandHeart className="h-4 w-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
            About <span className="text-teal-600">ResourceMap</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            ResourceMap India is an open humanitarian data and volunteer coordination platform. We combine sub-meter GIS mapping across Indian states, NVIDIA Nemotron 3 Ultra LLM survey processing, and mathematical matching algorithms to bridge the gap between crisis demands and skilled responders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Multi-Factor Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates compatibility between volunteer skill vectors and crisis needs using the Haversine distance formula, availability windows, and historical ratings.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Globe2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Sub-Meter GIS Mapping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive Leaflet mapping displays real-time community tickets across Food, Health, Shelter, Education, and Environmental relief.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">NVIDIA Nemotron 3 Ultra AI Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingests raw, unstructured field notes and damage assessments using NVIDIA Nemotron 3 Ultra, extracting categorized and prioritized relief tickets with zero manual paperwork.
            </p>
          </div>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 font-display">Join the Coordination Network</h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Whether you are an individual with skills to offer or an NGO responding to crises, ResourceMap is free and open for social impact.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link to="/auth/signup" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5">
              <span>Sign Up Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/needs" className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all border border-slate-200">
              Explore Live Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
