import React from 'react';
import { AlertCircle, RefreshCw, MapPin, ShieldX } from 'lucide-react';
import { POPULAR_INDIAN_CITIES } from '../utils/comicQuotes';

export default function ErrorScreen({ errorType = 'general', errorMessage, onRetry, onSelectCity }) {
  const isGeoDenied = errorType === 'geo_denied';

  return (
    <div className="w-full max-w-3xl mx-auto my-12 glass-card rounded-3xl p-8 md:p-10 text-center shadow-soft border border-white/80 animate-fadeIn">
      
      <div className="max-w-lg mx-auto space-y-5">
        
        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-700 rounded-3xl flex items-center justify-center shadow-soft-sm animate-bounce">
          {isGeoDenied ? (
            <ShieldX className="w-8 h-8" />
          ) : (
            <AlertCircle className="w-8 h-8" />
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            {isGeoDenied ? "You blocked location access! 🕵️" : "The weather refuses to cooperate right now! 🌧️"}
          </h2>
          
          <p className="text-sm font-semibold text-slate-600 mt-2">
            {isGeoDenied 
              ? "We'll just assume you live in a secret superhero bunker (or Atlantis). Pick a city manually below, mysterious hero!"
              : errorMessage || "The weather pigeon stopped for snacks or the smog monster chewed the antenna. Give it another shot!"}
          </p>
        </div>

        {/* Retry button */}
        {!isGeoDenied && (
          <div>
            <button
              onClick={onRetry}
              className="btn-press bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-2.5 rounded-2xl shadow-soft flex items-center gap-2 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Send Another Weather Pigeon (Retry)</span>
            </button>
          </div>
        )}

        {/* Quick picks */}
        <div className="pt-5 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-3">
            Or teleport to a popular Indian hotspot:
          </span>
          
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_INDIAN_CITIES.slice(0, 6).map(city => (
              <button
                key={city.name}
                onClick={() => onSelectCity(city)}
                className="btn-press bg-white hover:bg-amber-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-2xl border border-slate-200 shadow-soft-sm flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
