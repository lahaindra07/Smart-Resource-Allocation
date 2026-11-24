import { Link, useNavigate, useLocation } from "react-router-dom";
import { HandHeart, LayoutDashboard, LogOut, Menu, X, ArrowRight, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    switch (role) {
      case "NGO_MANAGER":
        return "/dashboard/ngo";
      case "ADMIN":
        return "/dashboard/admin";
      case "VOLUNTEER":
      default:
        return "/dashboard/volunteer";
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-teal-50 border border-teal-200/70 rounded-xl group-hover:bg-teal-100 transition-colors shadow-xs">
                <HandHeart className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                Resource<span className="text-teal-600">Map</span>
              </span>
              <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs">
                <span>🇮🇳</span>
                <span>India Network</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-7">
            <Link 
              to="/needs" 
              className={`text-sm font-semibold transition-colors ${
                isActive("/needs") ? "text-teal-600 font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Interactive Map
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-semibold transition-colors ${
                isActive("/about") ? "text-teal-600 font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-semibold transition-colors ${
                isActive("/contact") ? "text-teal-600 font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Contact
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold py-2 px-3.5 rounded-xl transition-all shadow-xs"
                >
                  <LayoutDashboard className="h-4 w-4 text-teal-600" />
                  <span>Dashboard</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                    {role === "NGO_MANAGER" ? "NGO Manager" : role}
                  </span>
                </Link>
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[110px] truncate text-slate-700 font-medium text-xs hidden lg:inline">
                    {user.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <Link 
                  to="/auth/signin" 
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-slate-900 p-2 bg-slate-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 shadow-lg px-6 py-5 space-y-4"
          >
            <Link
              to="/needs"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-teal-600 py-1.5"
            >
              Interactive Map
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-teal-600 py-1.5"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-teal-600 py-1.5"
            >
              Contact
            </Link>

            {user ? (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 px-4 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl text-center font-bold text-xs"
                >
                  Open Dashboard ({role})
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="w-full border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <Link
                  to="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 text-center text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
