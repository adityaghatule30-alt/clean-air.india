import React, { useState, useEffect } from 'react';
import { CloudSun, Sparkles } from 'lucide-react';

export default function LoadingScreen() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const funnyLoadingQuotes = [
    "Asking the clouds nicely for data... ☁️",
    "Negotiating with the atmosphere...",
    "Interrogating the weather satellites...",
    "Bribing the local weather pigeon with breadcrumbs... 🐦",
    "Measuring atmospheric spicy-ness level...",
    "Consulting the rooftop astrologers...",
    "Checking if Mumbai is still swimming in humidity..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % funnyLoadingQuotes.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto my-12 glass-card rounded-3xl p-10 text-center shadow-soft border border-white/80 animate-fadeIn">
      
      {/* Animated Floating Cloud & Sun */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-300/40 rounded-full animate-ping opacity-30"></div>
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 via-orange-400 to-sky-400 rounded-3xl shadow-glow-amber flex items-center justify-center animate-float">
            <CloudSun className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Dynamic rotating funny quote */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="bg-amber-100/70 border border-amber-200/80 px-4 py-2.5 rounded-2xl shadow-soft-sm">
            <p className="text-base sm:text-lg font-display font-extrabold text-amber-950 tracking-tight">
              "{funnyLoadingQuotes[quoteIndex]}"
            </p>
          </div>
          <span className="text-xs text-slate-400 font-semibold mt-2 block">
            Fetching Open-Meteo live atmospheric telemetry
          </span>
        </div>

        {/* Subtle animated bar */}
        <div className="w-48 h-2 bg-slate-200 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 rounded-full animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        </div>
      </div>

    </div>
  );
}
