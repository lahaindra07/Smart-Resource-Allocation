/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { LandingPage } from "@/pages/LandingPage";
import { NeedsMapPage } from "@/pages/NeedsMapPage";
import { SignUpPage } from "@/pages/auth/SignUpPage";
import { SignInPage } from "@/pages/auth/SignInPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { VolunteerDashboard } from "@/pages/dashboard/VolunteerDashboard";
import { NGODashboard } from "@/pages/dashboard/NGODashboard";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { AiChatbot } from "@/components/layout/AiChatbot";
import { Toaster } from "@/components/ui/sonner";
import { Heart, Globe2, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth Routes */}
              <Route path="/auth/signin" element={<SignInPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Needs Map */}
              <Route path="/needs" element={<NeedsMapPage />} />
              
              {/* Info Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              
              {/* Dashboards & Redirects */}
              <Route path="/volunteer" element={<Navigate to="/dashboard/volunteer" replace />} />
              <Route path="/dashboard" element={<Navigate to="/dashboard/ngo" replace />} />
              <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
              <Route path="/dashboard/ngo" element={<NGODashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Professional Modern Footer */}
          <footer className="bg-white border-t border-slate-200/80 text-slate-600 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-teal-50 border border-teal-200/60 rounded-xl text-teal-600">
                      <Heart className="h-5 w-5 fill-teal-600/10 text-teal-600" />
                    </div>
                    <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                      Resource<span className="text-teal-600">Map</span>
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                    A modern, data-driven volunteer allocation and crisis response ecosystem. Connecting localized community needs with verified skills and resources.
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-[11px]">
                      <Globe2 className="h-3 w-3 text-teal-600" /> Global Dispatch Network
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-medium text-[11px] border border-teal-200/50">
                      <ShieldCheck className="h-3 w-3" /> Security Audited
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-4 font-display">
                    Platform
                  </h4>
                  <ul className="space-y-2.5 text-sm">
                    <li>
                      <Link to="/needs" className="hover:text-teal-600 transition-colors flex items-center gap-1 group">
                        Interactive Map
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-600" />
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/volunteer" className="hover:text-teal-600 transition-colors">
                        Volunteer Portal
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/ngo" className="hover:text-teal-600 transition-colors">
                        NGO Operations Core
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/admin" className="hover:text-teal-600 transition-colors">
                        Network Governance
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-4 font-display">
                    Company & Docs
                  </h4>
                  <ul className="space-y-2.5 text-sm">
                    <li>
                      <Link to="/about" className="hover:text-teal-600 transition-colors">
                        About ResourceMap
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="hover:text-teal-600 transition-colors">
                        Contact Operations
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="hover:text-teal-600 transition-colors">
                        Privacy & Compliance
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-900 mb-4 font-display">
                    Quick Authentication
                  </h4>
                  <div className="space-y-2.5">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Instant access with email, Google, or our automated demo personas.
                    </p>
                    <div className="pt-2 flex flex-col gap-2">
                      <Link
                        to="/auth/signin"
                        className="text-center py-2 px-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-slate-700 text-xs font-semibold transition-all"
                      >
                        Sign In to Account
                      </Link>
                      <Link
                        to="/auth/signup"
                        className="text-center py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        Create New Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-slate-100 text-slate-400 text-xs flex flex-col sm:flex-row justify-between items-center gap-3">
                <p>© {new Date().getFullYear()} ResourceMap Open Platform. Built for Social Impact.</p>
                <div className="flex items-center gap-4 text-slate-400">
                  <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
                  <span>•</span>
                  <Link to="/contact" className="hover:text-slate-600 transition-colors">Help Center</Link>
                  <span>•</span>
                  <span className="text-teal-600 font-medium">Status: All Systems Operational</span>
                </div>
              </div>
            </div>
          </footer>
          <AiChatbot />
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}
