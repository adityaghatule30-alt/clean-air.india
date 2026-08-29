import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Loader2, Sparkles, Globe, Star } from 'lucide-react';
import { POPULAR_INDIAN_CITIES } from '../utils/comicQuotes';
import { searchCities } from '../api/geocodingApi';
import { addRecentLocation, isFavoriteLocation } from '../utils/locationStorage';

export default function SearchBar({ currentCity, onSelectCity, onLocateMe, isLocating, onOpenBrowseModal }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const hits = await searchCities(query);
        setResults(hits);
        setIsOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cityObj) => {
    addRecentLocation(cityObj);
    onSelectCity(cityObj);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-6 space-y-3" ref={dropdownRef}>
      {/* Search Input & Geolocation & Browse */}
      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* Main Search Input */}
        <div className="relative flex-1">
          <div className="relative flex items-center bg-white border-2 border-slate-200/90 rounded-2xl shadow-soft focus-within:shadow-soft-lg focus-within:border-amber-500 transition-all overflow-hidden px-3.5 py-1">
            <div className="text-slate-400 mr-2 shrink-0">
              <Search className="w-5 h-5 text-amber-500" />
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true);
              }}
              placeholder="Search any city, district, country worldwide (e.g. London, Tokyo, Pune, New York)..."
              className="w-full py-2.5 pr-8 text-sm sm:text-base font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />

            {/* Clear Button */}
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Loader */}
            {isSearching && (
              <div className="pr-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              </div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl shadow-soft-xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-100 animate-fadeIn">
              <div className="bg-slate-50/90 px-4 py-2.5 text-xs font-black text-slate-500 uppercase tracking-wider flex justify-between items-center">
                <span>Worldwide Matching Locations</span>
                <span>Select to Teleport 🔍</span>
              </div>
              {results.map((item, idx) => (
                <button
                  key={`${item.lat}-${item.lon}-${idx}`}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-3 hover:bg-amber-50/70 flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-xl group-hover:scale-110 transition-transform">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 group-hover:text-amber-800">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        {[item.admin1, item.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-slate-900 text-white group-hover:bg-amber-500 group-hover:text-slate-950 px-3 py-1.5 rounded-xl transition-colors">
                    Check Weather 🌤️
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons: "Use My Location" & "Browse Hub" */}
        <div className="flex items-center gap-2">
          {/* GPS Button */}
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className={`btn-press bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-soft hover:shadow-glow-emerald flex items-center justify-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              isLocating ? 'animate-pulse bg-emerald-700' : ''
            }`}
            title="Use GPS Geolocation"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? "Scanning GPS..." : "📍 Use My Location"}</span>
          </button>

          {/* Browse / My Places Modal Trigger */}
          <button
            onClick={onOpenBrowseModal}
            className="btn-press bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-soft flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer"
            title="Browse all countries, states & saved places"
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Browse / Saved</span>
          </button>
        </div>
      </div>

      {/* Quick Location Chips with Global Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
        <div className="flex items-center gap-1 text-slate-400 font-black text-xs uppercase tracking-wider shrink-0 px-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Hotspots:</span>
        </div>

        {[
          ...POPULAR_INDIAN_CITIES,
          { name: "London", admin1: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278, tag: "🫖 London" },
          { name: "New York", admin1: "New York", country: "United States", lat: 40.7128, lon: -74.0060, tag: "🍎 NYC" },
          { name: "Tokyo", admin1: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, tag: "🗼 Tokyo" }
        ].map((city) => {
          const isSelected = currentCity?.name?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              onClick={() => handleSelect(city)}
              className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected 
                  ? 'bg-amber-500 text-slate-950 shadow-glow-amber scale-105 font-black' 
                  : 'bg-white/90 hover:bg-white text-slate-700 border border-slate-200 shadow-soft-sm hover:border-amber-300'
              }`}
            >
              <span>{city.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-amber-600 text-amber-100 font-extrabold' : 'bg-slate-100 text-slate-600'
              }`}>
                {city.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
