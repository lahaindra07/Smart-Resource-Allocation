/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { LandingPage } from "@/pages/LandingPage";
import { NeedsMapPage } from "@/pages/NeedsMapPage";
import { SignUpPage } from "@/pages/auth/SignUpPage";
import { SignInPage } from "@/pages/auth/SignInPage";
import { VolunteerDashboard } from "@/pages/dashboard/VolunteerDashboard";
import { NGODashboard } from "@/pages/dashboard/NGODashboard";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import { Toaster } from "@/components/ui/sonner";

/**
 * Global Styles and Theme variables are in index.css
 */

export default function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Auth Routes */}
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            {/* Needs Map */}
            <Route path="/needs" element={<NeedsMapPage />} />
            {/* Dashboards (Role protected later) */}
            <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
            <Route path="/dashboard/ngo" element={<NGODashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <span className="text-2xl font-bold font-display tracking-tight">
                  Resource<span className="text-teal-400">Map</span>
                </span>
                <p className="mt-4 text-slate-400 max-w-sm">
                  Empowering social impact through data-driven coordination. We connect resources with needs and people with purpose.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Platform</h4>
                <ul className="space-y-2 text-slate-400">
                  <li className="hover:text-teal-400 transition-colors"><Link to="/needs">Needs Map</Link></li>
                  <li className="hover:text-teal-400 transition-colors"><Link to="/volunteer">Volunteer Info</Link></li>
                  <li className="hover:text-teal-400 transition-colors"><Link to="/dashboard">NGO Portal</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-slate-400">
                  <li className="hover:text-teal-400 transition-colors"><Link to="/about">About Us</Link></li>
                  <li className="hover:text-teal-400 transition-colors"><Link to="/contact">Contact</Link></li>
                  <li className="hover:text-teal-400 transition-colors"><Link to="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-800 text-slate-500 text-sm text-center">
              © {new Date().getFullYear()} ResourceMap. All rights reserved.
            </div>
          </div>
        </footer>
        <Toaster position="top-right" />
      </div>
    </Router>
  </AuthProvider>
);
}

