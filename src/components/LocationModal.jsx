import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Navigation, Star, Clock, Globe, X, 
  Trash2, ChevronRight, Sparkles, Check, Building2, Compass, AlertCircle, Loader2
} from 'lucide-react';
import { searchCities } from '../api/geocodingApi';
import { BROWSE_COUNTRIES } from '../utils/browseLocationsData';
import { 
  getRecentLocations, addRecentLocation, clearRecentLocations, 
  getFavoriteLocations, toggleFavoriteLocation, isFavoriteLocation 
} from '../utils/locationStorage';
import { getRandomItem } from '../utils/personalityEngine';

const PICKER_TAGLINES = [
  "Where are we judging the weather today? 🌎",
  "Pick your battlefield. ⚔️",
  "Okay, let's see what's happening over there.",
  "Choose a location. We promise not to judge (much).",
  "Teleport to any sky on Earth! 🚀"
];

export default function LocationModal({ isOpen, onClose, currentCity, onSelectLocation, onLocateMe, isLocating }) {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'favorites' | 'recents' | 'browse'
  const [tagline, setTagline] = useState(PICKER_TAGLINES[0]);
  
  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Storage states
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);

  // Browse state
  const [selectedCountry, setSelectedCountry] = useState(BROWSE_COUNTRIES[0]);
  const [selectedState, setSelectedState] = useState(BROWSE_COUNTRIES[0].states[0]);

  const searchInputRef = useRef(null);

  // Refresh lists when modal opens
  useEffect(() => {
    if (isOpen) {
      setTagline(getRandomItem(PICKER_TAGLINES));
      setFavorites(getFavoriteLocations());
      setRecents(getRecentLocations());
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const hits = await searchCities(query);
        if (hits.length === 0) {
          setSearchError(`No atmospheric coordinates found for "${query}". Try another city name.`);
        } else {
          setResults(hits);
        }
      } catch (err) {
        setSearchError("Failed to look up coordinates. Check your connection.");
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handlePickCity = (cityObj) => {
    addRecentLocation(cityObj);
    onSelectLocation(cityObj);
    onClose();
  };

  const handleToggleFav = (e, cityObj) => {
    e.stopPropagation();
    const updated = toggleFavoriteLocation(cityObj);
    setFavorites(updated);
  };

  const handleClearRecents = () => {
    clearRecentLocations();
    setRecents([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-soft-xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🌎</span>
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight">
                WHERE ARE WE CHECKING?
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-amber-300">
              "{tagline}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors cursor-pointer"
            title="Close location picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-100/80 border-b border-slate-200 overflow-x-auto shrink-0 no-scrollbar">
          <button
            onClick={() => setActiveTab('search')}
            className={`btn-press px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-slate-900 text-white shadow-soft-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Search Any Location</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`btn-press px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-slate-900 text-white shadow-soft-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>My Places ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recents')}
            className={`btn-press px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'recents'
                ? 'bg-slate-900 text-white shadow-soft-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-500" />
            <span>Recent ({recents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('browse')}
            className={`btn-press px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'browse'
                ? 'bg-slate-900 text-white shadow-soft-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>Browse Countries</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: SEARCH ANY LOCATION */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              
              {/* Search Bar & GPS Button */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <div className="flex items-center bg-slate-50 border-2 border-slate-200 rounded-2xl px-3.5 py-1.5 focus-within:border-amber-500 focus-within:bg-white transition-all shadow-inner">
                    <Search className="w-5 h-5 text-amber-500 mr-2 shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type any city, town, district, country (e.g. Tokyo, London, Shimla)..."
                      className="w-full py-2 text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                    />
                    {query && (
                      <button
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {isSearching && (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin ml-2 shrink-0" />
                    )}
                  </div>
                </div>

                <button
                  onClick={() => { onLocateMe(); onClose(); }}
                  disabled={isLocating}
                  className="btn-press bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-soft flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? "Scanning GPS..." : "📍 Use My GPS"}</span>
                </button>
              </div>

              {/* Search Results List */}
              {results.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block px-1">
                    Matching Locations Worldwide ({results.length})
                  </span>
                  
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-soft-sm bg-white">
                    {results.map((item, idx) => {
                      const isFav = isFavoriteLocation(item);

                      return (
                        <div
                          key={`${item.lat}-${item.lon}-${idx}`}
                          onClick={() => handlePickCity(item)}
                          className="p-3.5 hover:bg-amber-50/70 flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl group-hover:scale-110 transition-transform">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-amber-800">
                                {item.name}
                              </div>
                              <div className="text-xs text-slate-500 font-semibold">
                                {[item.admin1, item.country].filter(Boolean).join(', ')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleToggleFav(e, item)}
                              className={`p-2 rounded-xl border transition-colors ${
                                isFav ? 'bg-amber-100 text-amber-600 border-amber-300' : 'bg-slate-50 text-slate-400 hover:text-amber-500 border-slate-200'
                              }`}
                              title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                            >
                              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                            </button>

                            <span className="text-xs font-black bg-slate-900 text-white group-hover:bg-amber-500 group-hover:text-slate-950 px-3 py-1.5 rounded-xl transition-colors">
                              Teleport 🌤️
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : searchError ? (
                <div className="p-6 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 font-bold text-xs sm:text-sm">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-600" />
                  {searchError}
                </div>
              ) : (
                /* Quick Shortcuts when empty */
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
                    <span>Popular Atmospheric Metros</span>
                    <span>One-tap pick 👇</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { name: "Mumbai", admin1: "Maharashtra", country: "India", lat: 19.0760, lon: 72.8777, tag: "Bollywood City 🏖️" },
                      { name: "Delhi", admin1: "Delhi", country: "India", lat: 28.6139, lon: 77.2090, tag: "Smog Champion 🌫️" },
                      { name: "Bengaluru", admin1: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946, tag: "Silicon Valley 💻" },
                      { name: "London", admin1: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278, tag: "Big Ben & Rain 🫖" },
                      { name: "New York", admin1: "New York", country: "United States", lat: 40.7128, lon: -74.0060, tag: "The Big Apple 🍎" },
                      { name: "Tokyo", admin1: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, tag: "Neon Metropolis 🗼" },
                      { name: "Shimla", admin1: "Himachal Pradesh", country: "India", lat: 31.1048, lon: 77.1734, tag: "Mountain Fresh 🏔️" },
                      { name: "Pune", admin1: "Maharashtra", country: "India", lat: 18.5204, lon: 73.8567, tag: "Oxford of East 🛵" },
                      { name: "Dubai", admin1: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708, tag: "Desert Oasis 🏙️" }
                    ].map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handlePickCity(city)}
                        className="btn-press p-3 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all cursor-pointer group"
                      >
                        <div className="font-extrabold text-sm text-slate-800 group-hover:text-amber-800">
                          {city.name}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 truncate">
                          {city.tag}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: MY PLACES (FAVORITES) */}
          {activeTab === 'favorites' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
                <span>Pinned Favorite Places ({favorites.length})</span>
                <span className="text-[11px] text-amber-600 font-bold">Tap star to unpin</span>
              </div>

              {favorites.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
                  <Star className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-extrabold text-sm text-slate-700">No favorite places pinned yet!</p>
                  <p className="text-xs text-slate-500 font-semibold">
                    Search any city and click the star icon (⭐) to save it here for instant 1-tap switching.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favorites.map((fav, idx) => (
                    <div
                      key={`${fav.name}-${idx}`}
                      onClick={() => handlePickCity(fav)}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-amber-50/60 shadow-soft-sm flex items-center justify-between cursor-pointer group transition-all card-hover"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                          <Star className="w-4 h-4 fill-amber-400" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-sm group-hover:text-amber-800">
                            {fav.name}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold">
                            {[fav.admin1, fav.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleToggleFav(e, fav)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECENT ADVENTURES */}
          {activeTab === 'recents' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
                <span>Recent Location Teleports ({recents.length})</span>
                {recents.length > 0 && (
                  <button
                    onClick={handleClearRecents}
                    className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear History
                  </button>
                )}
              </div>

              {recents.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-extrabold text-sm text-slate-700">No recent locations found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recents.map((item, idx) => {
                    const isFav = isFavoriteLocation(item);
                    return (
                      <div
                        key={`${item.name}-${idx}`}
                        onClick={() => handlePickCity(item)}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 shadow-soft-sm flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-sm group-hover:text-sky-800">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-500 font-semibold truncate max-w-[150px]">
                              {[item.admin1, item.country].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleToggleFav(e, item)}
                          className={`p-1.5 rounded-xl border ${
                            isFav ? 'bg-amber-100 text-amber-600 border-amber-300' : 'bg-slate-50 text-slate-300 hover:text-amber-500 border-slate-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BROWSE HIERARCHY (Country -> State -> City) */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              
              {/* 1. Country Selector */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
                  1. Select Country:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {BROWSE_COUNTRIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCountry(c);
                        setSelectedState(c.states[0]);
                      }}
                      className={`btn-press px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap border transition-all cursor-pointer ${
                        selectedCountry.id === c.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-soft-sm'
                          : 'bg-slate-50 text-slate-700 hover:bg-white border-slate-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. State / Region Selector */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
                  2. Select State / Region:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {selectedCountry.states.map((st) => (
                    <button
                      key={st.name}
                      onClick={() => setSelectedState(st)}
                      className={`btn-press px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap border transition-all cursor-pointer ${
                        selectedState.name === st.name
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-soft-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      {st.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Cities in Selected State */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
                  3. Available Cities in {selectedState.name} ({selectedState.cities.length}):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedState.cities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handlePickCity({
                        ...city,
                        admin1: selectedState.name,
                        country: selectedCountry.name.replace(/[^a-zA-Z\s]/g, '').trim()
                      })}
                      className="btn-press p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-left transition-all cursor-pointer group shadow-soft-sm"
                    >
                      <div className="font-black text-sm text-slate-900 group-hover:text-amber-800">
                        {city.name}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 truncate">
                        {city.tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
