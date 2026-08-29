import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  MessageCircle, Flame, Snowflake, Wind, Leaf, Skull, 
  Shuffle, ChevronRight, Sparkles, RefreshCw, ExternalLink,
  Droplets, Brain, Trophy, Frown, Clock, ThumbsUp, Heart,
  Zap, AlertCircle, Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { POPULAR_INDIAN_CITIES } from '../utils/comicQuotes';
import { antiRepetition } from '../utils/antiRepetitionEngine';
import { HUMOR_DATABASE } from '../utils/humorDatabase';

/* ─── City Avatars & Personas ─── */
const CITY_PROFILES = {
  Delhi: { avatar: '🌫️', persona: 'Dramatic Capital', tag: 'Smog Veteran 💀' },
  Mumbai: { avatar: '🏙️', persona: 'Rain & Humidity Pro', tag: 'Marine Salt 🏖️' },
  Bengaluru: { avatar: '☕', persona: 'Calm Tech Flex', tag: '23°C Luxury 💻' },
  Chennai: { avatar: '🌶️', persona: 'Marina Sun Veteran', tag: 'Filter Kaapi ☕' },
  Kolkata: { avatar: '🍬', persona: 'Adda & Chai Thinker', tag: 'Mishti Doi 🫖' },
  Hyderabad: { avatar: '🍲', persona: 'Biryani Powered', tag: 'Biryani Heat 🔥' },
  Pune: { avatar: '🛵', persona: 'Quiet Chill Flex', tag: 'Bakery Breeze 🌿' },
  Shimla: { avatar: '🏔️', persona: 'Mountain Show-Off', tag: 'Alpine Chill ❄️' },
  Jaipur: { avatar: '🏰', persona: 'Desert Sun Champion', tag: 'Pink City Sun ☀️' },
  Lucknow: { avatar: '👑', persona: 'Nawabi Poise', tag: 'Tehzeeb Force 🏛️' },
  Patna: { avatar: '🌾', persona: 'Ground Reality', tag: 'Sattu Energy 🌾' },
  'Navi Mumbai': { avatar: '🌊', persona: 'Coastal Breeze', tag: 'Creek Wind 🌊' }
};

const getCityProfile = (name) => CITY_PROFILES[name] || { avatar: '📍', persona: 'Urban Challenger', tag: 'Discovered 🗺️' };

const RAIN_CODES = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];

export default function CityGroupChat({ onSelectCity }) {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataStatus, setDataStatus] = useState('live'); // 'live' | 'stale' | 'error'
  const [activeTab, setActiveTab] = useState('chat'); // chat | hot | cold | clean | dirty | wind
  const [surpriseCity, setSurpriseCity] = useState(null);
  const [factIndex, setFactIndex] = useState(0);

  // Chat conversational state
  const [chatArcIndex, setChatArcIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingCity, setTypingCity] = useState(null);
  const [reactions, setReactions] = useState({}); // { [msgId]: { emoji: count } }

  const refreshIntervalRef = useRef(null);

  /* ─── Batch Fetch All Cities (2 requests total) ─── */
  const loadAllCities = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);

    try {
      const lats = POPULAR_INDIAN_CITIES.map(c => c.lat).join(',');
      const lons = POPULAR_INDIAN_CITIES.map(c => c.lon).join(',');

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=us_aqi,pm2_5,pm10&timezone=auto`;

      const [wRes, aRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqiUrl)
      ]);

      if (!wRes.ok || !aRes.ok) {
        throw new Error("API request failed");
      }

      const [wDataList, aDataList] = await Promise.all([
        wRes.json(),
        aRes.json()
      ]);

      const wArray = Array.isArray(wDataList) ? wDataList : [wDataList];
      const aArray = Array.isArray(aDataList) ? aDataList : [aDataList];

      const valid = POPULAR_INDIAN_CITIES.map((city, idx) => {
        const wCur = wArray[idx]?.current || {};
        const aCur = aArray[idx]?.current || {};
        const profile = getCityProfile(city.name);

        return {
          name: city.name,
          lat: city.lat,
          lon: city.lon,
          state: city.state,
          country: 'India',
          avatar: profile.avatar,
          persona: profile.persona,
          tag: profile.tag,
          temp: Math.round(wCur.temperature_2m ?? 28),
          apparentTemp: Math.round(wCur.apparent_temperature ?? wCur.temperature_2m ?? 28),
          aqi: Math.round(aCur.us_aqi ?? 55),
          pm25: Math.round(aCur.pm2_5 ?? 15),
          pm10: Math.round(aCur.pm10 ?? 30),
          wind: Math.round(wCur.wind_speed_10m ?? 10),
          humidity: Math.round(wCur.relative_humidity_2m ?? 50),
          weatherCode: wCur.weather_code ?? 0,
          isRain: RAIN_CODES.includes(wCur.weather_code ?? 0)
        };
      });

      setCityData(valid);
      setLastUpdated(new Date());
      setDataStatus('live');
      setFactIndex(Math.floor(Math.random() * HUMOR_DATABASE.facts.length));
    } catch (err) {
      console.warn("City data fetch error, using safe cached baseline:", err);
      setDataStatus('error');
      if (cityData.length === 0) {
        const fallback = POPULAR_INDIAN_CITIES.map(c => {
          const profile = getCityProfile(c.name);
          return {
            name: c.name,
            lat: c.lat,
            lon: c.lon,
            state: c.state,
            country: 'India',
            avatar: profile.avatar,
            persona: profile.persona,
            tag: profile.tag,
            temp: 29,
            apparentTemp: 31,
            aqi: 65,
            pm25: 18,
            pm10: 45,
            wind: 12,
            humidity: 60,
            weatherCode: 1,
            isRain: false
          };
        });
        setCityData(fallback);
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [cityData.length]);

  // Initial load & 10-minute auto refresh interval
  useEffect(() => {
    loadAllCities();
    refreshIntervalRef.current = setInterval(() => {
      loadAllCities(false);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshIntervalRef.current);
  }, []);

  /* ─── Derived Sortings & Metrics from Real Data ─── */
  const sortedByHot = useMemo(() => [...cityData].sort((a, b) => b.temp - a.temp), [cityData]);
  const sortedByCold = useMemo(() => [...cityData].sort((a, b) => a.temp - b.temp), [cityData]);
  const sortedByClean = useMemo(() => [...cityData].sort((a, b) => a.aqi - b.aqi), [cityData]);
  const sortedByDirty = useMemo(() => [...cityData].sort((a, b) => b.aqi - a.aqi), [cityData]);
  const sortedByWind = useMemo(() => [...cityData].sort((a, b) => b.wind - a.wind), [cityData]);
  const sortedByHumidity = useMemo(() => [...cityData].sort((a, b) => b.humidity - a.humidity), [cityData]);
  const rainyCities = useMemo(() => cityData.filter(c => c.isRain), [cityData]);

  /* ─── Vibe Winner / Loser Calculation ─── */
  const vibeVerdict = useMemo(() => {
    if (!cityData || cityData.length === 0) return null;
    const scored = cityData.map(c => {
      let score = 0;
      // Temperature comfort curve (peak at 23°C)
      score += Math.max(0, 50 - Math.abs(c.temp - 23) * 3.5);
      // Clean air score (lower AQI = higher points)
      score += Math.max(0, 50 - c.aqi * 0.35);
      return { ...c, vibeScore: Math.round(score) };
    });
    const sorted = scored.sort((a, b) => b.vibeScore - a.vibeScore);
    return {
      winner: sorted[0],
      loser: sorted[sorted.length - 1]
    };
  }, [cityData]);

  /* ─── Dynamic Story Arc Generator ─── */
  const chatMessages = useMemo(() => {
    if (!cityData || cityData.length === 0) return [];

    const hottest = sortedByHot[0];
    const secondHottest = sortedByHot[1];
    const coldest = sortedByCold[0];
    const cleanest = sortedByClean[0];
    const dirtiest = sortedByDirty[0];
    const windiest = sortedByWind[0];
    const humidest = sortedByHumidity[0];

    const arcs = [];

    // ARC 0: The Thermal Clash (Hot vs Cold vs Humidity)
    arcs.push([
      {
        id: `arc0_1_${hottest.name}`,
        city: hottest.name,
        avatar: hottest.avatar,
        text: hottest.temp >= 38
          ? `${hottest.temp}°C today. I am officially running on low battery. 🫠`
          : `${hottest.temp}°C here. The sun has chosen me as the primary target. 🔥`,
        time: 'now',
        isMain: true
      },
      {
        id: `arc0_2_${coldest.name}`,
        city: coldest.name,
        avatar: coldest.avatar,
        text: coldest.temp <= 18
          ? `${coldest.temp}°C here btw. Stay hydrated down there, everyone. 😌`
          : `${coldest.temp}°C. We're chilling quite comfortably.`,
        time: 'now',
        isMain: false
      },
      {
        id: `arc0_3_${hottest.name}`,
        city: hottest.name,
        avatar: hottest.avatar,
        text: "Nobody asked for mountain commentary.",
        time: 'now',
        isMain: true
      },
      {
        id: `arc0_4_${humidest.name}`,
        city: humidest.name,
        avatar: humidest.avatar,
        text: `Try ${humidest.temp}°C with ${humidest.humidity}% humidity. The atmosphere is literally soup. 🥟`,
        time: 'now',
        isMain: false
      }
    ]);

    // ARC 1: The AQI Showdown & Alveoli Drama
    arcs.push([
      {
        id: `arc1_1_${dirtiest.name}`,
        city: dirtiest.name,
        avatar: dirtiest.avatar,
        text: dirtiest.aqi >= 150
          ? `AQI ${dirtiest.aqi}. I would like to formally unsubscribe from air today. 💀`
          : `AQI ${dirtiest.aqi}. Air is slightly textured, proceeding with caution.`,
        time: 'now',
        isMain: true
      },
      {
        id: `arc1_2_${cleanest.name}`,
        city: cleanest.name,
        avatar: cleanest.avatar,
        text: `AQI ${cleanest.aqi}. Breathing with absolute luxury today. 🌿`,
        time: 'now',
        isMain: false
      },
      {
        id: `arc1_3_${dirtiest.name}`,
        city: dirtiest.name,
        avatar: dirtiest.avatar,
        text: `${cleanest.name}... character development was not on my forecast.`,
        time: 'now',
        isMain: true
      },
      {
        id: `arc1_4_${secondHottest.name}`,
        city: secondHottest.name,
        avatar: secondHottest.avatar,
        text: `Meanwhile I'm over here with ${secondHottest.temp}°C heat. Nobody has it easy. 😅`,
        time: 'now',
        isMain: false
      }
    ]);

    // ARC 2: Weather Chaos & Rain/Wind Drama
    if (rainyCities.length > 0) {
      const rainCity = rainyCities[0];
      arcs.push([
        {
          id: `arc2_1_${rainCity.name}`,
          city: rainCity.name,
          avatar: rainCity.avatar,
          text: `Raining active! Umbrella lifespan currently estimated at 3 minutes. ☔`,
          time: 'now',
          isMain: true
        },
        {
          id: `arc2_2_${hottest.name}`,
          city: hottest.name,
          avatar: hottest.avatar,
          text: `Please send some clouds over here, we are baking at ${hottest.temp}°C! 🍳`,
          time: 'now',
          isMain: false
        },
        {
          id: `arc2_3_${windiest.name}`,
          city: windiest.name,
          avatar: windiest.avatar,
          text: `Wind is at ${windiest.wind} km/h! My cap just achieved orbital escape velocity. 💨`,
          time: 'now',
          isMain: false
        },
        {
          id: `arc2_4_${cleanest.name}`,
          city: cleanest.name,
          avatar: cleanest.avatar,
          text: `Rain washes the dust down. Clean air win for everyone! ✨`,
          time: 'now',
          isMain: true
        }
      ]);
    } else {
      // Dry weather flex
      arcs.push([
        {
          id: `arc2_1_${hottest.name}`,
          city: hottest.name,
          avatar: hottest.avatar,
          text: `Current update: ${hottest.name} claims #1 hottest spot at ${hottest.temp}°C! 🔥`,
          time: 'now',
          isMain: true
        },
        {
          id: `arc2_2_${secondHottest.name}`,
          city: secondHottest.name,
          avatar: secondHottest.avatar,
          text: `Relax, ${secondHottest.temp}°C here. It's only a 2 degree difference.`,
          time: 'now',
          isMain: false
        },
        {
          id: `arc2_3_${coldest.name}`,
          city: coldest.name,
          avatar: coldest.avatar,
          text: `${coldest.temp}°C here. You guys are sweating? Couldn't be me. ☕`,
          time: 'now',
          isMain: false
        },
        {
          id: `arc2_4_${cleanest.name}`,
          city: cleanest.name,
          avatar: cleanest.avatar,
          text: `AQI ${cleanest.aqi} says hello to all contenders. 🏆`,
          time: 'now',
          isMain: true
        }
      ]);
    }

    return arcs[chatArcIndex % arcs.length];
  }, [cityData, sortedByHot, sortedByCold, sortedByClean, sortedByDirty, sortedByWind, sortedByHumidity, rainyCities, chatArcIndex]);

  /* ─── "💬 NEW GOSSIP" Trigger ─── */
  const handleNewGossip = () => {
    if (cityData.length === 0) return;
    const typingCandidates = [sortedByHot[0]?.name, sortedByCold[0]?.name, sortedByClean[0]?.name, sortedByDirty[0]?.name].filter(Boolean);
    const chosenTyping = typingCandidates[Math.floor(Math.random() * typingCandidates.length)];

    setIsTyping(true);
    setTypingCity(chosenTyping);

    setTimeout(() => {
      setChatArcIndex(prev => prev + 1);
      setIsTyping(false);
      setTypingCity(null);
    }, 650);
  };

  /* ─── Handle Emoji Reactions on Chat Bubbles ─── */
  const handleAddReaction = (msgId, emoji) => {
    setReactions(prev => {
      const currentMsg = prev[msgId] || {};
      const currentCount = currentMsg[emoji] || 0;
      return {
        ...prev,
        [msgId]: {
          ...currentMsg,
          [emoji]: currentCount + 1
        }
      };
    });

    try {
      confetti({ particleCount: 15, spread: 45, origin: { y: 0.7 } });
    } catch (e) {}
  };

  /* ─── Click City Navigation ─── */
  const handleCityClick = (city) => {
    if (onSelectCity) {
      onSelectCity({
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        admin1: city.state || '',
        country: city.country || 'India',
        tag: city.tag || 'Discovered Spot 🗺️'
      });
    }
  };

  const handleSurpriseMe = () => {
    if (cityData.length === 0) return;
    const pick = cityData[Math.floor(Math.random() * cityData.length)];
    setSurpriseCity(pick);
    setTimeout(() => setSurpriseCity(null), 6000);
  };

  // Format relative freshness time
  const getFreshnessLabel = () => {
    if (!lastUpdated) return "Fetching live data...";
    const diffSec = Math.round((new Date() - lastUpdated) / 1000);
    if (diffSec < 60) return "Updated just now";
    const diffMin = Math.round(diffSec / 60);
    return `Updated ${diffMin}m ago`;
  };

  const TABS = [
    { id: 'chat', label: '💬 Live Chat', icon: MessageCircle },
    { id: 'hot', label: '🔥 Hottest', icon: Flame },
    { id: 'cold', label: '🥶 Coldest', icon: Snowflake },
    { id: 'clean', label: '🌿 Clean Air', icon: Leaf },
    { id: 'dirty', label: '💀 Worst Air', icon: Skull }
  ];

  const EMOJI_REACTIONS = ['😂', '💀', '🔥', '😭', '🌿', '☔'];

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="glass-card rounded-3xl p-5 md:p-6 shadow-soft border border-white/80 transition-all duration-300 overflow-hidden">
        
        {/* Section Header with Freshness Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-100 rounded-2xl border border-indigo-200 shadow-soft-sm">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-black text-slate-900 tracking-tight">
                  💬 CITY GROUP CHAT
                </h2>
                {/* Real-time Data Freshness Badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  dataStatus === 'live'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : dataStatus === 'stale'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dataStatus === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {dataStatus === 'live' ? 'LIVE DATA' : 'CACHED'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{getFreshnessLabel()} • Telemetry from Open-Meteo</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* 1. "NEW GOSSIP" Button */}
            <button
              onClick={handleNewGossip}
              disabled={loading || isTyping}
              className="btn-press bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-glow-amber flex items-center gap-1.5 cursor-pointer transition-all"
              title="Generate fresh conversation arc from current data"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>💬 New Gossip</span>
            </button>

            {/* 2. Surprise Me */}
            <button
              onClick={handleSurpriseMe}
              disabled={loading}
              className="btn-press bg-white hover:bg-slate-50 text-slate-700 font-black text-xs px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer transition-all shadow-soft-sm"
              title="Pick a random city"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>

            {/* 3. Real Refresh */}
            <button
              onClick={() => loadAllCities(true)}
              disabled={isRefreshing}
              className="btn-press bg-white hover:bg-slate-50 text-slate-700 font-black text-xs p-2 rounded-xl border border-slate-200 cursor-pointer transition-all shadow-soft-sm"
              title="Fetch fresh numbers from API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'bg-slate-900 text-amber-300 shadow-soft-sm border border-slate-700 scale-105'
                  : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center space-y-3 animate-pulse">
            <div className="text-4xl animate-bounce">📡</div>
            <p className="text-sm font-bold text-slate-500">
              Gathering genuine telemetry from {POPULAR_INDIAN_CITIES.length} cities...
            </p>
          </div>
        )}

        {/* Surprise City Spotlight Popover */}
        {surpriseCity && (
          <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 via-emerald-50 to-indigo-50 rounded-2xl border border-amber-200 animate-fadeIn shadow-soft-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                  🎲 SURPRISE CITY SPOTLIGHT
                </span>
                <h4 className="text-lg font-display font-black text-slate-900 flex items-center gap-1.5">
                  <span>{surpriseCity.avatar}</span>
                  <span>{surpriseCity.name}</span>
                  <span className="text-xs text-slate-500 font-bold">({surpriseCity.persona})</span>
                </h4>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  🌡️ {surpriseCity.temp}°C • 🫁 AQI {surpriseCity.aqi} • 💨 {surpriseCity.wind} km/h wind
                </p>
                <p className="text-xs font-bold text-amber-800 mt-1 italic">
                  "{surpriseCity.aqi <= 40 ? 'Clean air paradise detected. Showing off authorized. 🌿' : surpriseCity.temp >= 35 ? 'The sun has personal beef with this zip code. 🔥' : surpriseCity.isRain ? 'Umbrella mode active across the district. ☔' : 'Atmospheric conditions: stable and verified. ✨'}"
                </p>
              </div>

              <button
                onClick={() => handleCityClick(surpriseCity)}
                className="btn-press bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs px-3.5 py-2 rounded-xl cursor-pointer transition-colors shrink-0 shadow-soft-sm"
              >
                Inspect 📍
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MAIN BODY CONTENT */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {!loading && cityData.length > 0 && (
          <div className="space-y-4">

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 1: LIVE GROUP CHAT */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'chat' && (
              <div className="space-y-3 animate-fadeIn">
                
                {/* Chat Stream */}
                <div className="space-y-3 bg-slate-50/70 p-4 rounded-3xl border border-slate-200/80 shadow-inner min-h-[220px]">
                  {chatMessages.map((msg, i) => {
                    const isLeft = i % 2 === 0;
                    const msgReactions = reactions[msg.id] || {};

                    return (
                      <div 
                        key={msg.id || i}
                        className={`flex ${isLeft ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className={`max-w-[88%] sm:max-w-[78%] ${isLeft ? '' : 'text-right'}`}>
                          
                          {/* City Name Header & Avatar (Clickable!) */}
                          <button
                            onClick={() => {
                              const c = cityData.find(x => x.name === msg.city);
                              if (c) handleCityClick(c);
                            }}
                            className={`text-[11px] font-black text-slate-600 mb-1 flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors ${isLeft ? '' : 'justify-end'}`}
                            title={`Switch dashboard to ${msg.city}`}
                          >
                            <span>{msg.avatar}</span>
                            <span>{msg.city}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-40 hover:opacity-100" />
                          </button>

                          {/* Chat Message Bubble */}
                          <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm font-semibold leading-relaxed shadow-soft-sm transition-all ${
                            isLeft
                              ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-sm'
                              : 'bg-slate-900 text-white border border-slate-800 rounded-tr-sm'
                          }`}>
                            {msg.text}
                          </div>

                          {/* Reaction Pills & Emoji Bar */}
                          <div className={`flex flex-wrap items-center gap-1.5 mt-1 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                            {/* Existing Reaction Chips */}
                            {Object.entries(msgReactions).map(([em, cnt]) => cnt > 0 && (
                              <span 
                                key={em}
                                className="inline-flex items-center gap-1 bg-white text-[11px] font-black px-2 py-0.5 rounded-full border border-slate-200 shadow-soft-sm animate-bounce"
                              >
                                <span>{em}</span>
                                <span className="text-slate-600 text-[10px]">{cnt}</span>
                              </span>
                            ))}

                            {/* Quick Add Emoji Bar */}
                            <div className="inline-flex items-center gap-0.5 bg-white/80 p-0.5 rounded-full border border-slate-200/80 opacity-60 hover:opacity-100 transition-opacity">
                              {EMOJI_REACTIONS.map(em => (
                                <button
                                  key={em}
                                  onClick={() => handleAddReaction(msg.id, em)}
                                  className="w-5 h-5 flex items-center justify-center text-xs hover:scale-125 transition-transform cursor-pointer"
                                  title={`React with ${em}`}
                                >
                                  {em}
                                </button>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}

                  {/* Dynamic Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start animate-fadeIn">
                      <div className="bg-white px-4 py-2.5 rounded-2xl rounded-tl-sm border border-slate-200 shadow-soft-sm flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">
                          {typingCity || 'A city'} is typing...
                        </span>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* 🏆 Today's Real Vibe Winner Debrief */}
                {vibeVerdict && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 via-amber-50 to-indigo-50 rounded-3xl border border-emerald-200/80 space-y-2 shadow-soft-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">
                          TODAY'S ATMOSPHERE VIBE WINNER 🏆
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        Score: {vibeVerdict.winner.vibeScore}/100
                      </span>
                    </div>

                    <p className="text-sm font-black text-slate-900">
                      {vibeVerdict.winner.avatar} {vibeVerdict.winner.name} takes the crown today!
                      <span className="text-slate-600 font-bold ml-1">
                        ({vibeVerdict.winner.temp}°C comfort + clean AQI {vibeVerdict.winner.aqi})
                      </span>
                    </p>

                    <p className="text-xs font-bold text-slate-600 italic">
                      "{vibeVerdict.winner.name}: 'We call this atmospheric luxury.' 😌"
                    </p>

                    {vibeVerdict.loser.name !== vibeVerdict.winner.name && (
                      <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>
                          💀 {vibeVerdict.loser.name}: "{vibeVerdict.loser.name} is in struggle mode today ({vibeVerdict.loser.temp}°C, AQI {vibeVerdict.loser.aqi})."
                        </span>
                        <button
                          onClick={() => handleCityClick(vibeVerdict.winner)}
                          className="text-indigo-600 font-black hover:underline cursor-pointer"
                        >
                          View Winner 📍
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 2: HOTTEST RANKINGS */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'hot' && (
              <div className="space-y-2.5 animate-fadeIn">
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs font-bold text-rose-800 flex items-center justify-between">
                  <span>🔥 TOP 5 HOTTEST LOCATIONS TODAY</span>
                  <span className="text-[11px] text-rose-600 font-black">Click city to inspect 👇</span>
                </div>

                {sortedByHot.slice(0, 5).map((city, i) => (
                  <button
                    key={city.name}
                    onClick={() => handleCityClick(city)}
                    className="w-full flex items-center gap-3 bg-white hover:bg-rose-50 p-3.5 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all cursor-pointer text-left group card-hover shadow-soft-sm"
                  >
                    <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-rose-200">
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{city.avatar}</span>
                          <span className="font-black text-slate-900 text-sm truncate">{city.name}</span>
                          <span className="text-[11px] text-slate-400 font-semibold truncate hidden sm:inline">({city.persona})</span>
                        </div>
                        <span className="text-amber-600 font-display font-black text-lg">{city.temp}°C</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                        Feels like {city.apparentTemp}°C • Humidity {city.humidity}% • AQI {city.aqi}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 3: COLDEST RANKINGS */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'cold' && (
              <div className="space-y-2.5 animate-fadeIn">
                <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs font-bold text-sky-800 flex items-center justify-between">
                  <span>🥶 TOP 5 COLDEST / CRISPEST LOCATIONS TODAY</span>
                  <span className="text-[11px] text-sky-600 font-black">Click city to inspect 👇</span>
                </div>

                {sortedByCold.slice(0, 5).map((city, i) => (
                  <button
                    key={city.name}
                    onClick={() => handleCityClick(city)}
                    className="w-full flex items-center gap-3 bg-white hover:bg-sky-50 p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all cursor-pointer text-left group card-hover shadow-soft-sm"
                  >
                    <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-sky-200">
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{city.avatar}</span>
                          <span className="font-black text-slate-900 text-sm truncate">{city.name}</span>
                          <span className="text-[11px] text-slate-400 font-semibold truncate hidden sm:inline">({city.persona})</span>
                        </div>
                        <span className="text-sky-600 font-display font-black text-lg">{city.temp}°C</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                        Feels like {city.apparentTemp}°C • Humidity {city.humidity}% • AQI {city.aqi}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 4: CLEANEST AIR RANKINGS */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'clean' && (
              <div className="space-y-2.5 animate-fadeIn">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between">
                  <span>🌿 TOP 5 CLEANEST AIR QUALITY TODAY</span>
                  <span className="text-[11px] text-emerald-600 font-black">US EPA Standard AQI 👇</span>
                </div>

                {sortedByClean.slice(0, 5).map((city, i) => (
                  <button
                    key={city.name}
                    onClick={() => handleCityClick(city)}
                    className="w-full flex items-center gap-3 bg-white hover:bg-emerald-50 p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer text-left group card-hover shadow-soft-sm"
                  >
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-emerald-200">
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{city.avatar}</span>
                          <span className="font-black text-slate-900 text-sm truncate">{city.name}</span>
                          <span className="text-[11px] text-slate-400 font-semibold truncate hidden sm:inline">({city.persona})</span>
                        </div>
                        <span className="text-emerald-600 font-display font-black text-lg">AQI {city.aqi}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                        PM2.5: {city.pm25} µg/m³ • PM10: {city.pm10} µg/m³ • Temp {city.temp}°C
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 5: WORST AIR RANKINGS */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'dirty' && (
              <div className="space-y-2.5 animate-fadeIn">
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs font-bold text-rose-800 flex items-center justify-between">
                  <span>💀 HIGHEST POLLUTION / SPICY AIR TODAY</span>
                  <span className="text-[11px] text-rose-600 font-black">Bunker mode list 👇</span>
                </div>

                {sortedByDirty.slice(0, 5).map((city, i) => (
                  <button
                    key={city.name}
                    onClick={() => handleCityClick(city)}
                    className="w-full flex items-center gap-3 bg-white hover:bg-rose-50 p-3.5 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all cursor-pointer text-left group card-hover shadow-soft-sm"
                  >
                    <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 font-black text-sm flex items-center justify-center shrink-0 group-hover:bg-rose-200">
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{city.avatar}</span>
                          <span className="font-black text-slate-900 text-sm truncate">{city.name}</span>
                          <span className="text-[11px] text-slate-400 font-semibold truncate hidden sm:inline">({city.persona})</span>
                        </div>
                        <span className="text-rose-600 font-display font-black text-lg">AQI {city.aqi}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">
                        PM2.5: {city.pm25} µg/m³ • PM10: {city.pm10} µg/m³ • Temp {city.temp}°C
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* ─── Scientific Weather Fact Capsule ─── */}
            <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 flex items-start gap-2.5 shadow-soft-sm">
              <Brain className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block">
                  🧠 SCIENTIFIC ATMOSPHERE FACT
                </span>
                <p className="text-xs font-bold text-indigo-950 leading-relaxed mt-0.5">
                  {HUMOR_DATABASE.facts[factIndex % HUMOR_DATABASE.facts.length]}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
