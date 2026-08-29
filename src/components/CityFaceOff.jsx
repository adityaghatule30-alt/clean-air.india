import React, { useState, useEffect, useMemo } from 'react';
import { 
  Swords, X, Trophy, AlertTriangle, Wind, Zap, Thermometer, 
  Droplets, RefreshCw, ArrowLeftRight, Sparkles, Flame, ShieldAlert,
  HelpCircle, Compass, Smile, Frown, Plane
} from 'lucide-react';
import { POPULAR_INDIAN_CITIES } from '../utils/comicQuotes';
import { fetchAirQualityData } from '../api/aqiApi';
import { fetchWeatherData } from '../api/weatherApi';
import { getAQIDetails, interpretWeatherCode } from '../utils/aqiHelpers';
import { getRandomItem } from '../utils/personalityEngine';
import confetti from 'canvas-confetti';

// Dynamic City Persona Labels
const getCityPersona = (city) => {
  if (!city) return "Urban Challenger 🏙️";
  const name = (city.name || '').toLowerCase();
  const admin1 = (city.admin1 || '').toLowerCase();
  const combined = `${name} ${admin1}`;

  if (combined.includes('mumbai') || combined.includes('bombay')) return "Monsoon Mode 🌧️";
  if (combined.includes('delhi') || combined.includes('noida') || combined.includes('gurgaon')) return "Capital Energy 💀";
  if (combined.includes('bengaluru') || combined.includes('bangalore')) return "Tech & Filter Coffee ☕";
  if (combined.includes('hyderabad')) return "Biryani Energy 🔥";
  if (combined.includes('shimla') || combined.includes('manali') || combined.includes('dharamshala')) return "Mountain Mode ❄️";
  if (combined.includes('kolkata') || combined.includes('calcutta')) return "Adda Mode 🫖";
  if (combined.includes('chennai') || combined.includes('madras')) return "Filter Kaapi Mode ☕";
  if (combined.includes('pune')) return "Puneri Banter 😴";
  if (combined.includes('jaipur') || combined.includes('rajasthan')) return "Desert Power ☀️";
  if (combined.includes('patna') || combined.includes('bihar')) return "Litti Chokha Power 🌾";
  if (combined.includes('amritsar') || combined.includes('punjab')) return "Lassi Energy 🥛";
  if (combined.includes('kochi') || combined.includes('kerala')) return "Backwaters Zen 🌴";
  if (combined.includes('ahmedabad') || combined.includes('gujarat')) return "Fafda ROI Power 🪁";
  if (combined.includes('lucknow') || combined.includes('uttar pradesh')) return "Tehzeeb Force 🏛️";
  if (combined.includes('goa')) return "Susegad Beach Vibe 🏖️";
  if (combined.includes('london')) return "Tea & Rain 🫖";
  if (combined.includes('new york') || combined.includes('nyc')) return "Concrete Hustle 🗽";
  if (combined.includes('tokyo')) return "Neon Ramen 🍜";
  return "Local Challenger 🥊";
};

// Dynamic City Battle Banter
const getCityBattleBanter = (city, weather, aqi) => {
  const name = city?.name || 'This city';
  const temp = Math.round(weather?.current?.temperature ?? 26);
  const aqiVal = Math.round(aqi?.aqi ?? 50);
  const code = Number(weather?.current?.weatherCode ?? 0);
  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);

  const lines = [];
  const lowerName = name.toLowerCase();

  if (lowerName.includes('mumbai')) {
    lines.push(isRain ? "Rain has entered the chat. Boss fight active! 🌧️" : "Marine Drive humidity is on full throttle.");
  } else if (lowerName.includes('delhi')) {
    lines.push(aqiVal >= 150 ? "Delhi... we need to talk about the air. 💀" : "Parathe power fueling the battle today.");
  } else if (lowerName.includes('bengaluru')) {
    lines.push("Weather is 10/10. Traffic probably isn't. 🚗");
  } else if (lowerName.includes('hyderabad')) {
    lines.push("Hotter than the biryani today? 👀");
  } else if (lowerName.includes('shimla')) {
    lines.push("Bro brought the mountain DLC and clean air. 🏔️");
  } else if (lowerName.includes('kolkata')) {
    lines.push("Chai & adda energy powering today's numbers ☕");
  } else if (lowerName.includes('chennai')) {
    lines.push("Marina breeze trying its best against the heat.");
  } else if (lowerName.includes('jaipur')) {
    lines.push("Desert sun is ready for a showdown. ☀️");
  } else if (lowerName.includes('patna')) {
    lines.push("Bihar detected. Sattu power locked and loaded.");
  } else {
    if (aqiVal <= 50) lines.push("Lungs are winning today in this city! 🌿");
    else if (aqiVal >= 150) lines.push("The air has entered its villain arc. 😷");
    else if (temp >= 35) lines.push("Outside is currently preheated. 🔥");
    else if (isRain) lines.push("Cloud leaking detected. Umbrella mode! ☔");
    else lines.push("Atmospheric fighter ready for combat! 🥊");
  }

  return getRandomItem(lines);
};

// Extended City List for dropdowns
const BATTLE_CITIES = [
  ...POPULAR_INDIAN_CITIES,
  { name: "Hyderabad", admin1: "Telangana", country: "India", lat: 17.3850, lon: 78.4867, tag: "Biryani & Tech" },
  { name: "Shimla", admin1: "Himachal Pradesh", country: "India", lat: 31.1048, lon: 77.1734, tag: "Himalayan Chill" },
  { name: "Kochi", admin1: "Kerala", country: "India", lat: 9.9312, lon: 76.2673, tag: "Backwaters 🌴" },
  { name: "Jaipur", admin1: "Rajasthan", country: "India", lat: 26.9124, lon: 75.7873, tag: "Pink City ☀️" },
  { name: "Lucknow", admin1: "Uttar Pradesh", country: "India", lat: 26.8467, lon: 80.9462, tag: "Nawabi Heritage" },
  { name: "Patna", admin1: "Bihar", country: "India", lat: 25.5941, lon: 85.1376, tag: "Ancient Heart 🌾" },
  { name: "Panaji", admin1: "Goa", country: "India", lat: 15.4909, lon: 73.8278, tag: "Beach Vibes 🏖️" },
  { name: "London", admin1: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278, tag: "Tea & Rain 🫖" },
  { name: "New York", admin1: "New York", country: "United States", lat: 40.7128, lon: -74.0060, tag: "Big Apple 🗽" },
  { name: "Tokyo", admin1: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, tag: "Neon Capital 🗼" }
];

export default function CityFaceOff({ isOpen, onClose }) {
  const [city1, setCity1] = useState(BATTLE_CITIES.find(c => c.name === "Hyderabad") || BATTLE_CITIES[0]);
  const [city2, setCity2] = useState(BATTLE_CITIES.find(c => c.name === "Shimla") || BATTLE_CITIES[1]);
  
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [activeMetricModal, setActiveMetricModal] = useState(null);
  const [rematchSeed, setRematchSeed] = useState(0);
  const [vsBounce, setVsBounce] = useState(false);

  // Load Battle Telemetry
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const loadBattleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [aqi1, weather1, aqi2, weather2] = await Promise.all([
          fetchAirQualityData(city1.lat, city1.lon),
          fetchWeatherData(city1.lat, city1.lon),
          fetchAirQualityData(city2.lat, city2.lon),
          fetchWeatherData(city2.lat, city2.lon),
        ]);

        if (isMounted) {
          setData1({ aqi: aqi1, weather: weather1 });
          setData2({ aqi: aqi2, weather: weather2 });
        }
      } catch (err) {
        console.error("Comparison fetch error:", err);
        if (isMounted) setError("One fighter didn't show up. Nature is not cooperating. 😭");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBattleData();
    return () => { isMounted = false; };
  }, [city1, city2, isOpen, rematchSeed]);

  // Trigger celebration on load
  useEffect(() => {
    if (data1 && data2 && !loading) {
      setVsBounce(true);
      const timer = setTimeout(() => setVsBounce(false), 800);
      try {
        confetti({ particleCount: 30, spread: 65, origin: { y: 0.5 } });
      } catch (e) {}
      return () => clearTimeout(timer);
    }
  }, [data1, data2, loading, rematchSeed]);

  // Flip / Swap Cities
  const handleFlipCities = () => {
    const temp = city1;
    setCity1(city2);
    setCity2(temp);
    setVsBounce(true);
    setTimeout(() => setVsBounce(false), 600);
  };

  // Rematch
  const handleRematch = () => {
    setRematchSeed(prev => prev + 1);
    try {
      confetti({ particleCount: 40, spread: 80, origin: { y: 0.4 } });
    } catch (e) {}
  };

  // Battle Calculation & Scoring
  const battleResult = useMemo(() => {
    if (!data1 || !data2) return null;

    const isSameCity = city1.name === city2.name;
    const aqiVal1 = Math.round(data1?.aqi?.aqi ?? 50);
    const aqiVal2 = Math.round(data2?.aqi?.aqi ?? 50);
    const temp1 = Math.round(data1?.weather?.current?.temperature ?? 26);
    const temp2 = Math.round(data2?.weather?.current?.temperature ?? 26);
    const wind1 = Math.round(data1?.weather?.current?.windSpeed ?? 10);
    const wind2 = Math.round(data2?.weather?.current?.windSpeed ?? 10);

    // 1. Air Quality Sub-Score (Lower AQI = better)
    const aqiDiff = Math.abs(aqiVal1 - aqiVal2);
    const aqiWinner = aqiVal1 < aqiVal2 ? 'city1' : aqiVal1 > aqiVal2 ? 'city2' : 'tie';

    // 2. Temperature Comfort Sub-Score (Optimal range: 21 - 26°C)
    const comfortDist1 = Math.abs(temp1 - 24);
    const comfortDist2 = Math.abs(temp2 - 24);
    const comfortWinner = comfortDist1 < comfortDist2 ? 'city1' : comfortDist1 > comfortDist2 ? 'city2' : 'tie';

    // 3. Wind Comfort (Moderate wind 5-18 km/h is best)
    const windDist1 = Math.abs(wind1 - 12);
    const windDist2 = Math.abs(wind2 - 12);
    const windWinner = windDist1 < windDist2 ? 'city1' : windDist1 > windDist2 ? 'city2' : 'tie';

    // Overall Battle Points (Max 100)
    let score1 = 50;
    let score2 = 50;

    if (aqiVal1 < aqiVal2) score1 += Math.min(30, aqiDiff * 0.4);
    else if (aqiVal2 < aqiVal1) score2 += Math.min(30, aqiDiff * 0.4);

    if (comfortDist1 < comfortDist2) score1 += 15;
    else if (comfortDist2 < comfortDist1) score2 += 15;

    if (windDist1 < windDist2) score1 += 5;
    else if (windDist2 < windDist1) score2 += 5;

    score1 = Math.min(100, Math.max(10, Math.round(score1)));
    score2 = Math.min(100, Math.max(10, Math.round(score2)));

    let winnerKey = score1 > score2 ? 'city1' : score2 > score1 ? 'city2' : 'tie';
    if (isSameCity) winnerKey = 'same';

    // Headline generator
    let headline = "";
    let trashTalk = "";
    let travelVerdict = "";

    const winnerName = winnerKey === 'city1' ? city1.name : city2.name;
    const loserName = winnerKey === 'city1' ? city2.name : city1.name;

    if (isSameCity) {
      headline = "BRO REALLY CHALLENGED ITSELF 😭";
      trashTalk = "Fighting your own shadow? Deep philosophical moment.";
      travelVerdict = "You are already here. Relax.";
    } else if (Math.abs(score1 - score2) <= 3) {
      headline = "THEY'RE BASICALLY TWINS! 👯";
      trashTalk = "THIS IS TOO CLOSE. REMATCH RECOMMENDED.";
      travelVerdict = "Honestly? Flip a coin. Both have identical atmospheric vibes.";
    } else if (aqiVal1 >= 180 && aqiVal2 >= 180) {
      headline = "NOBODY WINS. YOU BOTH NEED HELP 💀";
      trashTalk = "Double villain arc in progress. Mask up everywhere.";
      travelVerdict = "Neither. Stay in a sealed room with an air purifier.";
    } else if (aqiVal1 <= 50 && aqiVal2 <= 50) {
      headline = "RARE DOUBLE W! CLEAN AIR CELEBRATION 🎉";
      trashTalk = "Both cities passed the vibe check with flying colors.";
      travelVerdict = `Both are pristine! Visit ${winnerName} for extra points.`;
    } else {
      if (aqiDiff >= 80) {
        headline = `${winnerName.toUpperCase()} WINS BY ${aqiDiff} AQI POINTS! 😭`;
      } else if (score1 >= 75 || score2 >= 75) {
        headline = `${winnerName.toUpperCase()} JUST COOKED ${loserName.toUpperCase()}! 🔥`;
      } else {
        headline = `${winnerName.toUpperCase()} TAKES THIS ROUND! 🏆`;
      }

      trashTalk = `${loserName}: "At least I have personality. 😭" • ${winnerName}: "Cleaner air takes the crown."`;
      travelVerdict = `Today? ${winnerName}. Better air and atmospheric balance = easy win.`;
    }

    return {
      winnerKey,
      winnerName,
      loserName,
      headline,
      trashTalk,
      travelVerdict,
      score1,
      score2,
      aqiWinner,
      comfortWinner,
      windWinner,
      aqiDiff,
      tempDiff: Math.abs(temp1 - temp2),
      windDiff: Math.abs(wind1 - wind2)
    };
  }, [data1, data2, city1, city2]);

  if (!isOpen) return null;

  const aqiInfo1 = getAQIDetails(data1?.aqi?.aqi ?? 50);
  const aqiInfo2 = getAQIDetails(data2?.aqi?.aqi ?? 50);
  const weather1 = data1?.weather?.current;
  const weather2 = data2?.weather?.current;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-soft-xl overflow-hidden max-h-[94vh] flex flex-col border border-slate-100">
        
        {/* Battle Arena Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-glow-amber font-black text-lg">
              🥊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">
                  🌍 CITY BATTLE
                </h2>
                <span className="text-[10px] bg-rose-500 text-white font-black px-2 py-0.5 rounded-full animate-pulse">
                  LIVE CLASH
                </span>
              </div>
              <p className="text-xs text-amber-300 font-bold">
                Let's see which city is winning today 👀
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Flip & Rematch & Fighter Selectors */}
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200/80 shrink-0 space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Fighter 1 Select */}
            <div className="sm:col-span-5 bg-white p-3 rounded-2xl border-2 border-slate-200 focus-within:border-amber-500 shadow-soft-sm">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>🥊 FIGHTER 1 (RED CORNER)</span>
                <span className="text-amber-600 font-bold">{getCityPersona(city1)}</span>
              </label>
              <select
                value={city1.name}
                onChange={(e) => setCity1(BATTLE_CITIES.find(c => c.name === e.target.value) || BATTLE_CITIES[0])}
                className="w-full font-black text-sm text-slate-900 focus:outline-none bg-transparent cursor-pointer"
              >
                {BATTLE_CITIES.map(c => (
                  <option key={`c1-${c.name}`} value={c.name}>{c.name} — {c.tag || c.admin1}</option>
                ))}
              </select>
            </div>

            {/* Middle Action: Flip Button */}
            <div className="sm:col-span-2 flex justify-center">
              <button
                onClick={handleFlipCities}
                className="btn-press bg-slate-900 hover:bg-slate-800 text-amber-300 p-3 rounded-2xl shadow-soft flex items-center justify-center gap-1 text-xs font-black w-full sm:w-auto cursor-pointer"
                title="Swap Fighter 1 & Fighter 2"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span className="sm:hidden">Swap Positions</span>
              </button>
            </div>

            {/* Fighter 2 Select */}
            <div className="sm:col-span-5 bg-white p-3 rounded-2xl border-2 border-slate-200 focus-within:border-amber-500 shadow-soft-sm">
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>🥊 FIGHTER 2 (BLUE CORNER)</span>
                <span className="text-indigo-600 font-bold">{getCityPersona(city2)}</span>
              </label>
              <select
                value={city2.name}
                onChange={(e) => setCity2(BATTLE_CITIES.find(c => c.name === e.target.value) || BATTLE_CITIES[1])}
                className="w-full font-black text-sm text-slate-900 focus:outline-none bg-transparent cursor-pointer"
              >
                {BATTLE_CITIES.map(c => (
                  <option key={`c2-${c.name}`} value={c.name}>{c.name} — {c.tag || c.admin1}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Battle Arena Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 mx-auto border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-base font-black text-slate-800">
                Getting the cities ready for battle... 🥊
              </p>
              <p className="text-xs text-slate-500 font-semibold">
                Comparing atmospheric drama & real-time telemetry...
              </p>
            </div>
          ) : error ? (
            <div className="py-12 text-center p-6 bg-rose-50 rounded-3xl border border-rose-200 space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="text-base font-black text-rose-900">{error}</h3>
              <button
                onClick={handleRematch}
                className="btn-press bg-rose-600 text-white font-black text-xs px-4 py-2 rounded-xl"
              >
                Retry Battle 🔄
              </button>
            </div>
          ) : battleResult ? (
            <>
              {/* Winner Celebration Headline Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 rounded-3xl shadow-glow-amber text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950 text-amber-300 px-3 py-0.5 rounded-full inline-block">
                  🏆 BATTLE VERDICT
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-black tracking-tight leading-tight">
                  {battleResult.headline}
                </h3>
                <p className="text-xs font-extrabold text-slate-900 opacity-90">
                  {battleResult.trashTalk}
                </p>
              </div>

              {/* Two Fighting City Cards with Big VS Centerpiece */}
              <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center relative">
                
                {/* City 1 Card (Red Corner) */}
                <div className={`lg:col-span-5 p-5 rounded-3xl border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                  battleResult.winnerKey === 'city1'
                    ? 'bg-emerald-50/70 border-emerald-400 shadow-glow-emerald ring-2 ring-emerald-400'
                    : battleResult.winnerKey === 'city2'
                    ? 'bg-slate-50 border-slate-200 opacity-90'
                    : 'bg-white border-slate-200 shadow-soft-sm'
                }`}>
                  
                  {/* Winner / Loser Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {getCityPersona(city1)}
                    </span>
                    {battleResult.winnerKey === 'city1' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-soft-sm">
                        <Trophy className="w-3.5 h-3.5" /> ROUND WINNER 🎉
                      </span>
                    ) : battleResult.winnerKey === 'city2' ? (
                      <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                        Defeated 😭
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h4 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
                      {city1.name}
                    </h4>
                    <p className="text-xs font-bold text-slate-600 mt-1 italic">
                      "{getCityBattleBanter(city1, data1?.weather, data1?.aqi)}"
                    </p>
                  </div>

                  {/* Metrics Stack */}
                  <div className="mt-4 space-y-2.5">
                    {/* AQI Metric (Clickable) */}
                    <div 
                      onClick={() => setActiveMetricModal({ type: 'aqi', title: 'Air Quality Duel', text: `${city1.name} AQI is ${aqiInfo1.value} vs ${city2.name} AQI ${aqiInfo2.value}. ${battleResult.aqiWinner === 'city1' ? city1.name + ' is ' + battleResult.aqiDiff + ' points cleaner! 🌿' : city2.name + ' is ' + battleResult.aqiDiff + ' points cleaner! 🌿'}` })}
                      className="p-3 bg-white rounded-2xl border border-slate-100 shadow-soft-sm hover:border-amber-300 transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                        <span>Air Quality</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${aqiInfo1.badgeClass}`}>
                          {aqiInfo1.label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-3xl font-display font-black text-slate-900">{aqiInfo1.value}</span>
                        <span className="text-xs font-bold text-slate-400">AQI</span>
                      </div>
                    </div>

                    {/* Temp & Wind (Clickable) */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <div 
                        onClick={() => setActiveMetricModal({ type: 'temp', title: 'Temperature Face-Off', text: `${city1.name} is ${weather1?.temperature ?? '--'}°C vs ${city2.name} at ${weather2?.temperature ?? '--'}°C. (${battleResult.tempDiff}°C difference)` })}
                        className="p-2.5 bg-white rounded-xl border border-slate-100 flex items-center justify-between hover:border-amber-300 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <Thermometer className="w-4 h-4 text-amber-500" />
                          <span>{weather1?.temperature ?? '--'}°C</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{interpretWeatherCode(weather1?.weatherCode ?? 0).label}</span>
                      </div>

                      <div 
                        onClick={() => setActiveMetricModal({ type: 'wind', title: 'Wind Speed Duel', text: `${city1.name} wind speed is ${weather1?.windSpeed ?? '--'} km/h vs ${city2.name} at ${weather2?.windSpeed ?? '--'} km/h.` })}
                        className="p-2.5 bg-white rounded-xl border border-slate-100 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <Wind className="w-4 h-4 text-blue-500" />
                          <span>{weather1?.windSpeed ?? '--'} km/h</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{weather1?.humidity ?? 50}% hum</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Big Animated "VS" Centerpiece */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center my-2 lg:my-0">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-900 to-indigo-950 text-amber-400 border-4 border-white shadow-soft-xl flex items-center justify-center font-display font-black text-xl sm:text-2xl select-none z-10 transition-transform duration-300 ${vsBounce ? 'scale-130 rotate-12' : 'hover:scale-110'}`}>
                    VS
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">
                    CLASH
                  </span>
                </div>

                {/* City 2 Card (Blue Corner) */}
                <div className={`lg:col-span-5 p-5 rounded-3xl border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                  battleResult.winnerKey === 'city2'
                    ? 'bg-emerald-50/70 border-emerald-400 shadow-glow-emerald ring-2 ring-emerald-400'
                    : battleResult.winnerKey === 'city1'
                    ? 'bg-slate-50 border-slate-200 opacity-90'
                    : 'bg-white border-slate-200 shadow-soft-sm'
                }`}>
                  
                  {/* Winner / Loser Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      {getCityPersona(city2)}
                    </span>
                    {battleResult.winnerKey === 'city2' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-soft-sm">
                        <Trophy className="w-3.5 h-3.5" /> ROUND WINNER 🎉
                      </span>
                    ) : battleResult.winnerKey === 'city1' ? (
                      <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                        Defeated 😭
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h4 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
                      {city2.name}
                    </h4>
                    <p className="text-xs font-bold text-slate-600 mt-1 italic">
                      "{getCityBattleBanter(city2, data2?.weather, data2?.aqi)}"
                    </p>
                  </div>

                  {/* Metrics Stack */}
                  <div className="mt-4 space-y-2.5">
                    {/* AQI Metric (Clickable) */}
                    <div 
                      onClick={() => setActiveMetricModal({ type: 'aqi', title: 'Air Quality Duel', text: `${city2.name} AQI is ${aqiInfo2.value} vs ${city1.name} AQI ${aqiInfo1.value}. ${battleResult.aqiWinner === 'city2' ? city2.name + ' is ' + battleResult.aqiDiff + ' points cleaner! 🌿' : city1.name + ' is ' + battleResult.aqiDiff + ' points cleaner! 🌿'}` })}
                      className="p-3 bg-white rounded-2xl border border-slate-100 shadow-soft-sm hover:border-amber-300 transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                        <span>Air Quality</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${aqiInfo2.badgeClass}`}>
                          {aqiInfo2.label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-3xl font-display font-black text-slate-900">{aqiInfo2.value}</span>
                        <span className="text-xs font-bold text-slate-400">AQI</span>
                      </div>
                    </div>

                    {/* Temp & Wind (Clickable) */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <div 
                        onClick={() => setActiveMetricModal({ type: 'temp', title: 'Temperature Face-Off', text: `${city2.name} is ${weather2?.temperature ?? '--'}°C vs ${city1.name} at ${weather1?.temperature ?? '--'}°C. (${battleResult.tempDiff}°C difference)` })}
                        className="p-2.5 bg-white rounded-xl border border-slate-100 flex items-center justify-between hover:border-amber-300 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <Thermometer className="w-4 h-4 text-amber-500" />
                          <span>{weather2?.temperature ?? '--'}°C</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{interpretWeatherCode(weather2?.weatherCode ?? 0).label}</span>
                      </div>

                      <div 
                        onClick={() => setActiveMetricModal({ type: 'wind', title: 'Wind Speed Duel', text: `${city2.name} wind speed is ${weather2?.windSpeed ?? '--'} km/h vs ${city1.name} at ${weather1?.windSpeed ?? '--'} km/h.` })}
                        className="p-2.5 bg-white rounded-xl border border-slate-100 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <Wind className="w-4 h-4 text-blue-500" />
                          <span>{weather2?.windSpeed ?? '--'} km/h</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{weather2?.humidity ?? 50}% hum</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Sub-Category Tally & Travel Verdict Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Category Tally */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                    CATEGORY SCORECARD (CLICK FOR BREAKDOWN)
                  </span>

                  <div className="space-y-1.5 text-xs font-bold">
                    <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-600">🌿 Cleaner Air</span>
                      <span className="font-black text-emerald-700">
                        {battleResult.aqiWinner === 'city1' ? city1.name : battleResult.aqiWinner === 'city2' ? city2.name : 'Tied'} 🏆
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-600">🌡️ Temperature Comfort</span>
                      <span className="font-black text-amber-700">
                        {battleResult.comfortWinner === 'city1' ? city1.name : battleResult.comfortWinner === 'city2' ? city2.name : 'Tied'} 🏆
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-600">💨 Balanced Breeze</span>
                      <span className="font-black text-blue-700">
                        {battleResult.windWinner === 'city1' ? city1.name : battleResult.windWinner === 'city2' ? city2.name : 'Tied'} 🏆
                      </span>
                    </div>
                  </div>
                </div>

                {/* "Where Would I Rather Be?" Travel Verdict */}
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-amber-50/60 rounded-2xl border border-indigo-200/70 flex flex-col justify-between space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase text-indigo-900 tracking-wider">
                    <Plane className="w-3.5 h-3.5 text-indigo-600" />
                    <span>✈️ "WHERE WOULD I RATHER BE TODAY?"</span>
                  </div>

                  <p className="text-sm font-display font-black text-slate-900 leading-snug">
                    "{battleResult.travelVerdict}"
                  </p>

                  <span className="text-[10px] text-slate-400 font-semibold">
                    *For entertainment purposes based on genuine live telemetry.
                  </span>
                </div>

              </div>
            </>
          ) : null}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFlipCities}
              className="btn-press bg-white hover:bg-slate-100 text-slate-800 font-black text-xs px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-soft-sm"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Flip Cities 🔄</span>
            </button>

            <button
              onClick={handleRematch}
              className="btn-press bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-glow-amber flex items-center gap-1.5 cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5 text-slate-950" />
              <span>Rematch Clash ⚔️</span>
            </button>
          </div>

          <span className="text-[11px] font-bold text-slate-400">
            Powered by live Open-Meteo Weather & AQI telemetry
          </span>
        </div>

        {/* Clickable Metric Breakdown Popover */}
        {activeMetricModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 shadow-soft-xl max-w-sm w-full border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                  {activeMetricModal.title}
                </span>
                <button 
                  onClick={() => setActiveMetricModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm font-extrabold text-slate-800 leading-relaxed">
                {activeMetricModal.text}
              </p>

              <button
                onClick={() => setActiveMetricModal(null)}
                className="btn-press w-full bg-slate-900 text-white font-black text-xs py-2 rounded-xl"
              >
                Got It 👍
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
