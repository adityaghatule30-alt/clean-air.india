import React, { useState } from 'react';
import { 
  X, ShieldCheck, FileText, Info, Mail, Database, 
  Sparkles, ExternalLink, CheckCircle2, AlertTriangle, Send, Lock
} from 'lucide-react';

export default function InfoModal({ isOpen, onClose, initialTab = 'about' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', subject: 'Feedback' });

  if (!isOpen) return null;

  const TABS = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Disclaimer', icon: FileText },
    { id: 'data-sources', label: 'Data Sources', icon: Database },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '', subject: 'Feedback' });
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-soft-xl border border-slate-200 flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-2xl">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 tracking-tight">
                CleanAir India — Information & Transparency Hub
              </h2>
              <p className="text-xs font-bold text-slate-500">
                Verified telemetry, data ethics, standards & honest privacy policy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1.5 px-5 pt-3 overflow-x-auto no-scrollbar border-b border-slate-100 bg-white">
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border-b-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
          
          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 1: ABOUT */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'about' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 mb-2">
                  What is CleanAir India? 🌤️
                </h3>
                <p>
                  <strong>CleanAir India</strong> is an interactive, real-time atmospheric intelligence platform created to make weather and air quality monitoring both scientifically precise and culturally engaging.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <h4 className="font-black text-amber-900 mb-1 flex items-center gap-1.5">
                    <span>🔬 Precise Scientific Telemetry</span>
                  </h4>
                  <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                    Live temperature, apparent feels-like, 24-hour micro-forecasts, humidity, wind velocity, precipitation, and full particulate breakdowns (PM2.5, PM10, NO₂, SO₂, O₃, CO) sourced directly from Open-Meteo meteorological models.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <h4 className="font-black text-indigo-900 mb-1 flex items-center gap-1.5">
                    <span>😂 Contextual Personality & Satire</span>
                  </h4>
                  <p className="text-xs text-indigo-950 font-semibold leading-relaxed">
                    CleanAir India features context-aware banter, national extremes leaderboards, today-vs-yesterday 24h comparisons, dynamic city chat simulations, and the fast-paced "Hotter or Not?" climate mini-game.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                  DATA TRANSPARENCY NOTICE: REAL DATA VS FICTIONAL ENTERTAINMENT
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  All atmospheric values (temperatures, AQI levels, wind speeds, humidity percentages, and pollutant measurements) reflect genuine meteorological API data. 
                  Simulated city chat dialogues, regional banter lines, and game commentary are created as creative satire for entertainment and educational purposes.
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 2: PRIVACY POLICY */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 mb-1">
                  Privacy Policy & Data Ethics 🔒
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Effective Date: August 30, 2026 • Verified Technical Policy
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700 font-semibold">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-black text-slate-900 mb-1">1. User Search & Location Privacy</h4>
                  <p>
                    CleanAir India currently does <strong>NOT</strong> intentionally store, record, or track your searched locations, and does <strong>NOT</strong> create a personal location history on any server.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-black text-slate-900 mb-1">2. Browser Geolocation</h4>
                  <p>
                    If and only if you explicitly click <strong>"Where Am I?" / "Use My Location"</strong>, your browser provides your latitude and longitude to the application client. These coordinates are used temporarily in browser memory solely to request the local weather from Open-Meteo and reverse-geocode your nearest city. <strong>Your GPS coordinates are NEVER saved on any remote database, logged to a server, or sold.</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-black text-slate-900 mb-1">3. Local Device Storage (<code className="bg-slate-200 px-1 rounded text-slate-900">localStorage</code>)</h4>
                  <p>
                    The application saves the following preferences purely on your local device:
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                    <li>Pinned favorite locations (My Places)</li>
                    <li>Recent location history (for rapid switching)</li>
                    <li>Achievement unlocks and XP level stamps</li>
                    <li>Sound effects and humor intensity mode preferences</li>
                    <li>Anti-repetition joke buffer (to prevent showing the same joke repeatedly)</li>
                  </ul>
                  <p className="mt-1 text-slate-500">
                    You can clear this anytime by clearing your browser cache or site data.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-black text-slate-900 mb-1">4. External Data Providers & APIs</h4>
                  <p>
                    Atmospheric data is retrieved directly from <strong>Open-Meteo</strong> (free, open-source meteorological API) and reverse geocoding services. We do not control external providers' upstream data processing or network logging.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-black text-slate-900 mb-1">5. No Tracking Cookies & Monetization Transparency</h4>
                  <p>
                    CleanAir India does not currently use Google Analytics, invasive fingerprinting, or commercial ad networks. If non-personalized advertising or affiliate product links are added in the future, they will be explicitly disclosed without deceptive links or invasive tracking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 3: TERMS & DISCLAIMER */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 mb-1">
                  Terms of Service & Atmospheric Disclaimer 📜
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Important notice regarding environmental telemetry and health.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700 font-semibold">
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-rose-900 block font-black mb-0.5">Not Medical or Emergency Advice:</strong>
                    The air quality index (AQI) and pollutant concentrations displayed are estimates calculated using standard US EPA formulas based on public meteorological feeds. They should NOT be treated as clinical health advice or used during active medical emergencies. Always consult healthcare professionals or official government disaster authorities (e.g., IMD / CPCB) for emergency decisions.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block font-black mb-1">Data Availability & Latency:</strong>
                  Atmospheric measurements are provided "as-is" without warranty of any kind. Sensor updates, network conditions, or upstream provider maintenance may introduce temporary reporting delays.
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900 block font-black mb-1">Fictional Satire & Humor:</strong>
                  City conversation dialogues, regional jokes, and competitive roasts are artistic fiction designed to celebrate local cultural flavor and make climate data engaging. They do not represent official statements of any municipal corporation or community.
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 4: DATA SOURCES */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'data-sources' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 mb-1">
                  Verified Data Architecture & Sources 📡
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  All external APIs and standards currently utilized by CleanAir India:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-sm flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      <span>🌤️ Weather Telemetry</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      Provided by <strong>Open-Meteo Weather Forecast API</strong>. Supplies real-time 2m temperature, apparent feels-like, relative humidity, wind speed, precipitation sums, UV index, and historical past-day metrics.
                    </p>
                    <span className="inline-block mt-2 text-[11px] text-indigo-600 font-bold">
                      Format: WMO Standard Codes • Update Frequency: Hourly model runs
                    </span>
                  </div>
                  <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-600">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-sm flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      <span>🫁 Air Quality Telemetry</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      Provided by <strong>Open-Meteo Air Quality API</strong>. Supplies particulate concentrations for PM2.5, PM10, Nitrogen Dioxide (NO₂), Sulphur Dioxide (SO₂), Carbon Monoxide (CO), and Ground-Level Ozone (O₃).
                    </p>
                    <span className="inline-block mt-2 text-[11px] text-emerald-600 font-bold">
                      Standard: US EPA Air Quality Index Standard (0 to 500 Scale)
                    </span>
                  </div>
                  <a href="https://open-meteo.com/en/docs/air-quality-api" target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-emerald-600">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-sm flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                      <span>📍 Location & Geocoding</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      Provided by <strong>Open-Meteo Geocoding API</strong> and <strong>BigDataCloud Reverse Geocoding Client</strong> for coordinate lookups and reverse GPS city detection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 5: CONTACT */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h3 className="text-lg font-display font-black text-slate-900 mb-1">
                  Get in Touch & Feedback 💬
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  Have a suggestion, spot a bug, or want to contribute local city banter? Send a message!
                </p>
              </div>

              {contactSubmitted ? (
                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                    ✔
                  </div>
                  <h4 className="text-base font-black text-emerald-900">Message Received! 🎉</h4>
                  <p className="text-xs text-emerald-800 font-semibold">
                    Thank you for supporting CleanAir India. We review all community feedback and local banter suggestions!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs font-bold">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-black">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Aditya"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1 font-black">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="aditya@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-black">Topic</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-xs font-semibold"
                    >
                      <option value="Feedback">General Feedback</option>
                      <option value="City Joke Suggestion">Suggest a Local City Joke / Banter</option>
                      <option value="Bug Report">Report Data / Display Bug</option>
                      <option value="Partnership">Collaboration & Transparency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-black">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us what you love, what needs fixing, or suggest a new Indian city for the leaderboard!"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-xs font-semibold resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-press w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-5 py-3 rounded-xl shadow-soft-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>CleanAir India • Telemetry & Satire Engine</span>
          <button
            onClick={onClose}
            className="text-slate-800 hover:text-slate-950 font-black cursor-pointer"
          >
            Close ✖
          </button>
        </div>

      </div>
    </div>
  );
}
