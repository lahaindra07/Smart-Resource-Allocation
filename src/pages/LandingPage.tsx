import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, BarChart3, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0F172A] text-slate-200">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Nodes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.05),transparent_50%)]" />
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M10,10 L30,40 L70,20 L90,80 L50,60 L10,10"
              fill="none"
              stroke="#14B8A6"
              strokeWidth="0.1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center lg:text-left">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/20 px-4 py-1.5 rounded-full mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse glow-teal" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#14B8A6]">Global Impact Network v2.0</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] font-display mb-8 tracking-tighter">
                Bridge the Gap in <span className="text-[#14B8A6]">Social Impact.</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 font-medium font-sans leading-relaxed">
                ResourceMap uses technical intelligence to connect NGOs with skilled volunteers, precisely where they're needed most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/auth/signup" 
                  className={cn(buttonVariants({ size: "lg" }), "bg-[#14B8A6] hover:bg-teal-600 text-slate-900 font-extrabold h-16 px-10 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-teal-500/10")}
                >
                  START BUILDING <ArrowRight className="h-5 w-5" />
                </Link>
                <Link 
                  to="/needs" 
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }), "text-white border-slate-700 bg-slate-800/40 hover:bg-slate-800 h-16 px-10 rounded-2xl transition-all active:scale-95")}
                >
                  EXPLORE THE MAP
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="bento-panel relative p-10 bg-slate-900/60 w-full max-w-md shadow-2xl shadow-black/50 border-slate-700/50">
                   <div className="space-y-8">
                      <div className="flex items-center gap-5 group cursor-default">
                        <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20 group-hover:border-teal-500/40 transition-all">
                          <Users className="h-8 w-8 text-teal-400 glow-teal" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">New Identity Verified</p>
                          <p className="text-lg font-bold text-white tracking-tight leading-none">Sarah Chen <span className="text-teal-400 font-mono text-sm ml-2">98% Fit</span></p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="bento-panel p-4 bg-slate-800/40 border-slate-700/30">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Location</p>
                            <div className="flex items-center gap-2">
                               <MapPin className="h-3 w-3 text-rose-500" />
                               <span className="text-xs font-bold text-slate-200">Berlin, DE</span>
                            </div>
                         </div>
                         <div className="bento-panel p-4 bg-slate-800/40 border-slate-700/30">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Role</p>
                            <div className="flex items-center gap-2">
                               <ShieldCheck className="h-3 w-3 text-amber-500" />
                               <span className="text-xs font-bold text-slate-200">Lead Spec</span>
                            </div>
                         </div>
                      </div>

                      <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800/50 shadow-inner">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RELATIONAL SYNC</span>
                          <span className="text-[10px] font-mono text-[#14B8A6] font-bold">1.2s LATENCY</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-teal-500 to-[#14B8A6] glow-teal" 
                            initial={{ width: 0 }}
                            animate={{ width: "88%" }}
                            transition={{ duration: 2, delay: 1 }}
                          />
                        </div>
                        <div className="flex justify-between mt-3">
                           <span className="text-[8px] font-bold text-slate-600 uppercase">Input Node: VOL_A</span>
                           <span className="text-[8px] font-bold text-slate-600 uppercase">Target: NGO_B</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-4">
             {/* Large Display Feature */}
             <div className="col-span-12 lg:col-span-8 bento-panel p-12 bg-slate-900 overflow-hidden relative group">
                <div className="relative z-10">
                   <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20 inline-block mb-10">
                      <MapPin className="h-10 w-10 text-teal-400 glow-teal" />
                   </div>
                   <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter mb-8 font-display">
                      Precision <span className="text-[#14B8A6] italic uppercase">Grounding</span>
                   </h2>
                   <p className="text-xl text-slate-400 max-w-xl font-medium leading-relaxed mb-10">
                      Our live coordination engine maps unmet needs with sub-meter precision, ensuring resources bypass bureaucracy and reach the target instantly.
                   </p>
                   <Button variant="link" className="p-0 text-[#14B8A6] font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all flex items-center gap-2">
                      Access System Map <ArrowRight className="h-4 w-4" />
                   </Button>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(20,184,166,0.1),transparent_70%)] pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#14B8A6]/5 rounded-full blur-[100px] group-hover:bg-[#14B8A6]/10 transition-all duration-700" />
             </div>

             {/* Side Stats Bento */}
             <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="bento-panel p-8 bg-[#F59E0B] text-slate-950 flex flex-col justify-between h-[280px] shadow-xl shadow-amber-900/20 border-none">
                   <div>
                      <ShieldCheck className="h-10 w-10 text-slate-950/40 mb-6" />
                      <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Security Verified</h3>
                   </div>
                   <div>
                      <p className="text-5xl font-black font-display tracking-tighter">482+</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Partner NGOs Online</p>
                   </div>
                </div>

                <div className="bento-panel p-8 bg-slate-800 text-white flex flex-col justify-between h-[280px]">
                   <Users className="h-10 w-10 text-teal-400 glow-teal opacity-50 mb-6" />
                   <div>
                      <p className="text-5xl font-black font-display tracking-tighter">12.8k</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#14B8A6]">Global Active Force</p>
                   </div>
                </div>
             </div>

             {/* Bottom Trio Bento */}
             <div className="col-span-12 lg:col-span-4 bento-panel p-10 bg-slate-900 flex flex-col justify-between h-[420px]">
                <div>
                   <div className="p-4 bg-slate-800 rounded-2xl inline-block mb-8">
                      <BarChart3 className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="text-2xl font-black text-white tracking-tight mb-4">Neural Matching</h3>
                   <p className="text-slate-500 font-medium leading-relaxed">
                      AI engines suggest optimal volunteer deployment based on 12 distinct skill vectors and real-time transit data.
                   </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Model: BENTO_CORE v4</span>
                   <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-[#14B8A6]" />
                      <div className="w-1 h-1 rounded-full bg-[#14B8A6]" />
                      <div className="w-1 h-1 rounded-full bg-slate-800" />
                   </div>
                </div>
             </div>

             <div className="col-span-12 lg:col-span-8 bento-panel p-10 bg-slate-950 border-white/5 flex items-center overflow-hidden relative h-[420px]">
                <div className="relative z-10 lg:w-1/2">
                   <h3 className="text-3xl font-black text-white tracking-tight mb-6 leading-none">Global <span className="text-rose-500 glow-rose">Emergency</span> Node</h3>
                   <p className="text-slate-400 font-medium leading-relaxed mb-8">
                      Instantly pivot platform focus during natural disasters. The emergency node overrides local priorities to focus all resources on crisis resolution.
                   </p>
                   <Button className="bg-[#14B8A6] hover:bg-teal-600 text-slate-900 font-black rounded-xl px-8 shadow-xl shadow-teal-500/10">
                      DEPLOY RESPONSE
                   </Button>
                </div>
                {/* Decorative visual */}
                <div className="absolute right-0 top-0 w-1/2 h-full bg-slate-900/40 p-8 hidden lg:flex flex-col gap-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className={`h-12 w-full rounded-xl bg-slate-800/20 border border-slate-700/30 flex items-center px-4 gap-3 animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }}>
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <div className="h-2 w-24 bg-slate-800 rounded-full" />
                        <div className="ml-auto h-2 w-12 bg-slate-800 rounded-full" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Final Action Hub Section */}
      <section className="py-40 relative overflow-hidden">
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
               <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
                  Ready to optimize <br/><span className="text-[#14B8A6] uppercase italic">humanity?</span>
               </h2>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link 
                    to="/auth/signup" 
                    className="w-full sm:w-auto px-12 py-6 bg-[#14B8A6] text-slate-950 font-black text-xl rounded-2xl hover:bg-teal-400 transition-all shadow-[0_0_50px_rgba(20,184,166,0.15)] active:scale-95"
                  >
                    JOIN THE NETWORK
                  </Link>
                  <Link 
                    to="/contact" 
                    className="w-full sm:w-auto px-12 py-6 bg-slate-900 text-white font-black text-xl rounded-2xl hover:bg-slate-800 transition-all border border-slate-800 active:scale-95"
                  >
                    TALK TO OPS
                  </Link>
               </div>
            </motion.div>
         </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
    >
      <div className={`p-4 rounded-2xl ${color} inline-block mb-6 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4 font-display">{title}</h3>
      <p className="text-slate-600 leading-relaxed font-normal">
        {description}
      </p>
    </motion.div>
  );
}
