import React, { useState, useEffect } from 'react';
import { Flame, Snowflake, Sparkles, Skull, Wind, CloudRain, ExternalLink, RefreshCw, Trophy, MapPin } from 'lucide-react';
import { POPULAR_INDIAN_CITIES } from '../utils/comicQuotes';

const MAJOR_MONITORED_CITIES = [
  { name: 'Delhi', admin1: 'NCT', country: 'India', lat: 28.6139, lon: 77.2090, tag: 'Capital Smog Arena 🌫️', avatar: '🌫️' },
  { name: 'Mumbai', admin1: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777, tag: 'Maximum Moisture 🌊', avatar: '🏙️' },
  { name: 'Bengaluru', admin1: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946, tag: 'Garden & Traffic ☕', avatar: '☕' },
  { name: 'Kolkata', admin1: 'West Bengal', country: 'India', lat: 22.5726, lon: 88.3639, tag: 'Sweet & Humid 🍵', avatar: '🚖' },
  { name: 'Chennai', admin1: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707, tag: 'Coastal Breeze ☀️', avatar: '🏖️' },
  { name: 'Jaipur', admin1: 'Rajasthan', country: 'India', lat: 26.9124, lon: 75.7873, tag: 'Pink City Solar Flare 🏰', avatar: '🏰' },
  { name: 'Shimla', admin1: 'Himachal Pradesh', country: 'India', lat: 31.1048, lon: 77.1734, tag: 'Mountain Sanctuary 🏔️', avatar: '🏔️' },
  { name: 'Srinagar', admin1: 'Jammu & Kashmir', country: 'India', lat: 34.0837, lon: 74.7973, tag: 'Dal Lake Frost ❄️', avatar: '❄️' },
  { name: 'Pune', admin1: 'Maharashtra', country: 'India', lat: 18.5204, lon: 73.8567, tag: 'Student Valley 🛵', avatar: '🛵' },
  { name: 'Hyderabad', admin1: 'Telangana', country: 'India', lat: 17.3850, lon: 78.4867, tag: 'Biryani Heat 🍛', avatar: '🍛' },
  { name: 'Lucknow', admin1: 'Uttar Pradesh', country: 'India', lat: 26.8467, lon: 80.9462, tag: 'Tehzeeb & Haze 📜', avatar: '📜' },
  { name: 'Nagpur', admin1: 'Maharashtra', country: 'India', lat: 21.1458, lon: 79.0882, tag: 'Orange City Oven 🍊', avatar: '🍊' },
  { name: 'Ahmedabad', admin1: 'Gujarat', country: 'India', lat: 23.0225, lon: 72.5714, tag: 'Sabarmati Sun 🏭', avatar: '🪁' },
  { name: 'Patna', admin1: 'Bihar', country: 'India', lat: 25.5941, lon: 85.1376, tag: 'Gangetic Smog 🛶', avatar: '🛶' },
  { name: 'Kochi', admin1: 'Kerala', country: 'India', lat: 9.9312, lon: 76.2673, tag: 'Monsoon Coastline 🌴', avatar: '🌴' }
];

export default function IndiaLeaderboard({ onSelectCity }) {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNationalData = async () => {
    setLoading(true);
    try {
      const lats = MAJOR_MONITORED_CITIES.map(c => c.lat).join(',');
      const lons = MAJOR_MONITORED_CITIES.map(c => c.lon).join(',');

      // Batch 2 parallel HTTP calls for all 15 cities
      const [wRes, aRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&timezone=auto`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=us_aqi,pm2_5,pm10&timezone=auto`)
      ]);

      if (!wRes.ok || !aRes.ok) throw new Error("Leaderboard batch fetch failed");

      const wJson = await wRes.json();
      const aJson = await aRes.json();

      const weatherArray = Array.isArray(wJson) ? wJson : [wJson];
      const aqiArray = Array.isArray(aJson) ? aJson : [aJson];

      const merged = MAJOR_MONITORED_CITIES.map((city, idx) => {
        const wCur = weatherArray[idx]?.current || {};
        const aCur = aqiArray[idx]?.current || {};

        return {
          ...city,
          temp: Math.round(wCur.temperature_2m ?? 28),
          humidity: Math.round(wCur.relative_humidity_2m ?? 60),
          wind: Math.round(wCur.wind_speed_10m ?? 10),
          precipitation: Number(wCur.precipitation ?? 0),
          weatherCode: Number(wCur.weather_code ?? 0),
          aqi: Math.round(aCur.us_aqi ?? 60),
          pm25: aCur.pm2_5 != null ? Number(aCur.pm2_5.toFixed(1)) : 15.0
        };
      });

      setCityData(merged);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    } catch (e) {
      console.error("India Leaderboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNationalData();
    const interval = setInterval(fetchNationalData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && cityData.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-5 md:p-6 shadow-soft border border-white/80 mb-6 text-center text-xs font-bold text-slate-500 animate-pulse">
        Fetching real-time atmospheric leaderboards across Indian cities... 🛰️
      </div>
    );
  }

  // Compute Winners from Real Data
  const sortedHot = [...cityData].sort((a, b) => b.temp - a.temp);
  const sortedCold = [...cityData].sort((a, b) => a.temp - b.temp);
  const sortedClean = [...cityData].sort((a, b) => a.aqi - b.aqi);
  const sortedWorst = [...cityData].sort((a, b) => b.aqi - a.aqi);
  const sortedWind = [...cityData].sort((a, b) => b.wind - a.wind);
  const sortedRain = [...cityData].sort((a, b) => b.precipitation - a.precipitation);

  const hottest = sortedHot[0];
  const coldest = sortedCold[0];
  const cleanest = sortedClean[0];
  const worst = sortedWorst[0];
  const windiest = sortedWind[0];
  const rainiest = sortedRain[0]?.precipitation > 0 ? sortedRain[0] : null;

  const CATEGORIES = [
    {
      id: 'hottest',
      title: 'HOTTEST CITY',
      icon: Flame,
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      city: hottest,
      valueText: `${hottest?.temp}°C`,
      roast: "The sun has clearly picked its primary victim today. 🔥",
      accent: 'from-orange-500/10 to-amber-500/10'
    },
    {
      id: 'coldest',
      title: 'COLDEST CITY',
      icon: Snowflake,
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      city: coldest,
      valueText: `${coldest?.temp}°C`,
      roast: "Blanket employment: formally activated. 🧥",
      accent: 'from-cyan-500/10 to-sky-500/10'
    },
    {
      id: 'cleanest',
      title: 'CLEANEST AIR',
      icon: Sparkles,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      city: cleanest,
      valueText: `AQI ${cleanest?.aqi}`,
      roast: "Breathing with suspicious atmospheric privilege. 🌿",
      accent: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      id: 'worst',
      title: 'WORST AIR',
      icon: Skull,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      city: worst,
      valueText: `AQI ${worst?.aqi}`,
      roast: `${worst?.name} has officially entered the boss fight. 💀`,
      accent: 'from-rose-500/10 to-purple-500/10'
    },
    {
      id: 'windiest',
      title: 'WINDIEST SPOT',
      icon: Wind,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      city: windiest,
      valueText: `${windiest?.wind} km/h`,
      roast: "The wind is actively testing umbrella engineering. 💨",
      accent: 'from-indigo-500/10 to-blue-500/10'
    }
  ];

  if (rainiest) {
    CATEGORIES.push({
      id: 'rainiest',
      title: 'RAINIEST CITY',
      icon: CloudRain,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      city: rainiest,
      valueText: `${rainiest.precipitation} mm`,
      roast: "Monsoon DLC fully downloaded and running. 🌧️",
      accent: 'from-blue-500/10 to-cyan-500/10'
    });
  }

  return (
    <section className="relative w-full glass-card rounded-3xl p-5 md:p-6 shadow-soft border border-white/80 overflow-hidden mb-6 transition-all duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-2xl">
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>🇮🇳 India Atmospheric Leaderboard</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-semibold">
              Live extremes calculated from monitored locations across India • Tap any city to inspect
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-black border border-slate-200">
            Based on available telemetry
          </span>
          <button
            onClick={fetchNationalData}
            disabled={loading}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Refresh national rankings"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Responsive Leaderboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const city = cat.city;
          if (!city) return null;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCity && onSelectCity(city)}
              className={`p-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br ${cat.accent} hover:scale-[1.02] transition-all duration-200 shadow-soft-sm cursor-pointer select-none card-hover flex flex-col justify-between`}
              title={`Click to view live weather for ${city.name}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.badgeColor} flex items-center gap-1`}>
                    <Icon className="w-3 h-3" />
                    <span>{cat.title}</span>
                  </span>
                  <span className="text-xs font-black text-slate-900 bg-white/90 px-2 py-0.5 rounded-full shadow-soft-sm border border-slate-200">
                    {cat.valueText}
                  </span>
                </div>

                <div className="flex items-center gap-2 my-1">
                  <span className="text-xl">{city.avatar}</span>
                  <div>
                    <h4 className="font-display font-black text-base text-slate-900 leading-tight">
                      {city.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500">{city.admin1}</span>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-700 italic mt-2 leading-snug">
                  "{cat.roast}"
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-black text-indigo-700">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Inspect {city.name}</span>
                </span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
