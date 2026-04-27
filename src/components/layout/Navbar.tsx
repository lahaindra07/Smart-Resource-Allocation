import { Link } from "react-router-dom";
import { HandHeart, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-[#14B8A6]/10 rounded-lg group-hover:bg-[#14B8A6]/20 transition-all border border-[#14B8A6]/20 group-hover:border-[#14B8A6]/40">
                <HandHeart className="h-6 w-6 text-[#14B8A6] glow-teal" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-[#14B8A6] transition-colors">
                Resource<span className="text-[#14B8A6]">Map</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/needs" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-sans">Find Needs</Link>
            <Link to="/about" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-sans">About</Link>
            <Link to="/auth/signin" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-sans">Sign In</Link>
            <Link to="/auth/signup" className={cn(buttonVariants({ variant: "default" }), "bg-[#14B8A6] hover:bg-teal-600 text-slate-900 font-black shadow-lg shadow-teal-500/10 rounded-xl px-6 transition-all active:scale-95")}>
              GET STARTED
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800/50 rounded-lg border border-slate-700/50"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden bg-[#0F172A] border-b border-white/5 overflow-hidden shadow-2xl"
          >
            <div className="px-6 pt-4 pb-8 space-y-4">
              <Link to="/needs" onClick={() => setIsOpen(false)} className="block text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest py-2">Find Needs</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest py-2">About</Link>
              <Link to="/auth/signin" onClick={() => setIsOpen(false)} className="block text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest py-2">Sign In</Link>
              <Link to="/auth/signup" onClick={() => setIsOpen(false)} className={cn(buttonVariants({ variant: "default" }), "w-full bg-[#14B8A6] hover:bg-teal-600 text-slate-900 font-black shadow-lg shadow-teal-500/10 rounded-xl py-6")}>
                GET STARTED
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
