export function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mb-1">Privacy & Compliance</h1>
          <p className="text-slate-500 text-xs">Last updated: November 2026 • Platform Version 2.4</p>
        </div>

        <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">1. Information Collection</h2>
            <p>
              ResourceMap gathers data required for coordinating volunteer relief efforts, including contact details, stated volunteer skillsets, availability windows, and approximate geolocation coordinates for proximity matching.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">2. Use of Geolocation Data</h2>
            <p>
              Latitude and longitude coordinates are utilized strictly to calculate distance-weighted matching scores using the Haversine formula and to present community demand pins on the interactive Leaflet map.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">3. AI Processing with NVIDIA Nemotron</h2>
            <p>
              Survey reports uploaded by NGO managers are parsed via the NVIDIA Nemotron 3 Ultra LLM to extract community needs. Reports are processed ephemerally for data point extraction and are not repurposed for advertising.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-display">4. Security & Role-Based Access</h2>
            <p>
              Access control is governed by Firebase Authentication and Firestore security rules, ensuring only verified NGO managers and administrators may publish verified community demands.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
