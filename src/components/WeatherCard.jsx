import React, { useState } from 'react';
import { 
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, 
  CloudRain, Snowflake, CloudRainWind, CloudLightning, 
  SunMedium, Wind, Droplets, Thermometer,
  Sparkles, ArrowUp, ArrowDown, History, Compass, Eye, Glasses, Umbrella, Zap, MessageSquare
} from 'lucide-react';
import { interpretWeatherCode } from '../utils/aqiHelpers';
import { getWeatherRoast, getMicroSnippets, getClickRoast, getCityJudgment } from '../utils/personalityEngine';
import { getLocalBanter } from '../utils/localBanterEngine';

export default function WeatherCard({ weatherData, aqiData, currentCity, onMetricClick }) {
  const [iconGimmick, setIconGimmick] = useState(false);
  const [clickedToast, setClickedToast] = useState(null);

  const cityName = currentCity?.name;

  const current = weatherData?.current || {
    temperature: 28,
    apparentTemp: 31,
    humidity: 78,
    windSpeed: 12,
    weatherCode: 1,
    todayMax: 31,
    todayMin: 25,
    yesterdayMax: 30,
    yesterdayMin: 24,
    tempDiffFromYesterdayMax: 1
  };

  const weatherInfo = interpretWeatherCode(current.weatherCode);
  const roastInfo = getWeatherRoast(weatherData);
  const micro = getMicroSnippets(weatherData);
  const cityJudgment = getCityJudgment(cityName, weatherData, aqiData);
  const localWeatherBanter = getLocalBanter(currentCity, weatherData, aqiData, 'weather');

  const triggerMetricRoast = (type) => {
    const text = getClickRoast(type, weatherData, aqiData);
    setClickedToast({ type, text });
    setTimeout(() => setClickedToast(null), 2400);
    if (onMetricClick) onMetricClick(type);
  };

  const handleIconClick = () => {
    setIconGimmick(!iconGimmick);
    triggerMetricRoast('temp');
  };

  const renderInteractiveWeatherIcon = () => {
    const props = { className: `w-14 h-14 md:w-16 md:h-16 transition-all duration-300 ${iconGimmick ? 'scale-125 rotate-12' : 'hover:scale-110'}` };
    return (
      <div className="relative cursor-pointer select-none" onClick={handleIconClick} title="Tap icon for funny reaction!">
        {iconGimmick && (
          <div className="absolute -top-3 -right-2 bg-slate-900 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full z-10 animate-bounce shadow-soft-sm">
            😎 COOL!
          </div>
        )}
        {weatherInfo.icon === 'Sun' && <Sun {...props} className="w-14 h-14 md:w-16 md:h-16 text-amber-500 animate-spin-slow" />}
        {weatherInfo.icon === 'CloudSun' && <CloudSun {...props} className="w-14 h-14 md:w-16 md:h-16 text-amber-400" />}
        {weatherInfo.icon === 'Cloud' && <Cloud {...props} className="w-14 h-14 md:w-16 md:h-16 text-slate-500" />}
        {weatherInfo.icon === 'CloudFog' && <CloudFog {...props} className="w-14 h-14 md:w-16 md:h-16 text-slate-400" />}
        {weatherInfo.icon === 'CloudDrizzle' && <CloudDrizzle {...props} className="w-14 h-14 md:w-16 md:h-16 text-cyan-500" />}
        {weatherInfo.icon === 'CloudRain' && <CloudRain {...props} className="w-14 h-14 md:w-16 md:h-16 text-blue-500" />}
        {weatherInfo.icon === 'Snowflake' && <Snowflake {...props} className="w-14 h-14 md:w-16 md:h-16 text-sky-400" />}
        {weatherInfo.icon === 'CloudRainWind' && <CloudRainWind {...props} className="w-14 h-14 md:w-16 md:h-16 text-blue-600" />}
        {weatherInfo.icon === 'CloudLightning' && <CloudLightning {...props} className="w-14 h-14 md:w-16 md:h-16 text-purple-500" />}
        {!['Sun', 'CloudSun', 'Cloud', 'CloudFog', 'CloudDrizzle', 'CloudRain', 'Snowflake', 'CloudRainWind', 'CloudLightning'].includes(weatherInfo.icon) && (
          <SunMedium {...props} className="w-14 h-14 md:w-16 md:h-16 text-amber-500" />
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full glass-card rounded-3xl p-5 md:p-7 shadow-soft border border-white/80 overflow-hidden mb-6 transition-all duration-300">
      
      {/* City Judgment & Local Banter Bar */}
      <div className="mb-4 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-2xl">
            <Sun className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-black text-slate-900 tracking-tight">
              {cityJudgment}
            </h2>
            <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="text-amber-700">💬 "{localWeatherBanter.text}"</span>
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center text-xs font-black text-slate-700 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200">
          {roastInfo.vibeTag}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Main Weather Hero Spotlight */}
        <div className="lg:col-span-7 bg-gradient-to-br from-amber-400/15 via-orange-400/10 to-sky-400/10 rounded-3xl p-6 border border-amber-200/70 shadow-soft-sm flex flex-col justify-between relative overflow-hidden group card-hover">
          
          {/* Top Row: Condition & Feels Like */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-slate-800 shadow-soft-sm border border-slate-100">
              <span>{weatherInfo.emoji}</span>
              <span>{weatherInfo.label}</span>
            </span>

            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200/60 text-xs font-bold text-slate-600">
              <span>Feels like <strong className="text-slate-900">{current.apparentTemp}°C</strong></span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const whyText = current.humidity >= 70 
                    ? `High humidity (${current.humidity}%) slows sweat evaporation, making it feel warmer.` 
                    : current.windSpeed >= 20 
                    ? `Wind (${current.windSpeed} km/h) accelerates body heat loss.` 
                    : `Humidity (${current.humidity}%) and wind (${current.windSpeed} km/h) are balanced.`;
                  setClickedToast({ type: 'why', text: whyText });
                  setTimeout(() => setClickedToast(null), 3500);
                }}
                className="text-[10px] text-amber-700 bg-amber-100 hover:bg-amber-200 px-1.5 py-0.2 rounded font-black cursor-pointer transition-colors"
                title="Why is feels-like different?"
              >
                Why?
              </button>
            </div>
          </div>

          {/* Center: Big Clickable Temperature & Witty Roast */}
          <div className="flex items-center justify-between my-2">
            <div 
              onClick={() => triggerMetricRoast('temp')} 
              className="cursor-pointer group/temp select-none"
              title="Click to check if it's really that hot"
            >
              <div className="flex items-baseline gap-1 group-hover/temp:scale-105 transition-transform origin-left">
                <span className="text-6xl sm:text-7xl md:text-8xl font-display font-black text-slate-900 tracking-tight">
                  {current.temperature}°
                </span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-slate-400">C</span>
              </div>
              
              {/* Sarcastic Weather Roast */}
              <p className="text-base sm:text-lg font-display font-black text-slate-800 mt-1.5 italic leading-snug">
                "{roastInfo.roast}"
              </p>
              <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full inline-block mt-1">
                👉 {roastInfo.tempNote}
              </span>
            </div>

            {/* Weather Graphic with Clickable Easter Egg */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/95 backdrop-blur-md rounded-3xl shadow-soft flex items-center justify-center border border-white shrink-0">
              {renderInteractiveWeatherIcon()}
            </div>
          </div>

          {/* Bottom High/Low & Yesterday Compare */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-rose-600 bg-white/80 px-2 py-0.5 rounded-lg border border-rose-100">
                <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
                High: {current.todayMax}°C
              </span>
              <span className="flex items-center gap-1 text-sky-600 bg-white/80 px-2 py-0.5 rounded-lg border border-sky-100">
                <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
                Low: {current.todayMin}°C
              </span>
            </div>

            {current.yesterdayMax != null && (
              <span className="text-[11px] text-slate-600 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Yesterday: {current.yesterdayMax}° / {current.yesterdayMin}°
                {current.tempDiffFromYesterdayMax != null && (
                  <strong className={current.tempDiffFromYesterdayMax > 0 ? 'text-amber-600' : 'text-sky-600'}>
                    ({current.tempDiffFromYesterdayMax > 0 ? `+${current.tempDiffFromYesterdayMax}° hotter` : `${current.tempDiffFromYesterdayMax}° cooler`})
                  </strong>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Secondary Metric Cards Grid with Clickable Micro-Jokes */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          
          {/* Humidity Card (Clickable!) */}
          <div 
            onClick={() => triggerMetricRoast('humidity')}
            className="glass-card-subtle p-4 rounded-2xl border border-slate-200/70 shadow-soft-sm flex flex-col justify-between card-hover cursor-pointer select-none"
            title="Click for humidity commentary"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Humidity</span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-xl">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-display font-black text-slate-900">{current.humidity}</span>
              <span className="text-sm font-bold text-slate-400 ml-0.5">%</span>
            </div>
            <span className="text-xs font-bold text-slate-700 truncate">
              {micro.humidityNote}
            </span>
          </div>

          {/* Wind Speed Card (Clickable!) */}
          <div 
            onClick={() => triggerMetricRoast('wind')}
            className="glass-card-subtle p-4 rounded-2xl border border-slate-200/70 shadow-soft-sm flex flex-col justify-between card-hover cursor-pointer select-none"
            title="Click for wind commentary"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Wind</span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-xl">
                <Wind className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-display font-black text-slate-900">{current.windSpeed}</span>
              <span className="text-xs font-bold text-slate-400 ml-1">km/h</span>
            </div>
            <span className="text-xs font-bold text-slate-700 truncate">
              {micro.windNote}
            </span>
          </div>

          {/* Thermal Reality Roaster */}
          <div 
            onClick={() => triggerMetricRoast('temp')}
            className="col-span-2 bg-slate-900 text-white p-4 rounded-2xl shadow-soft-sm flex items-center justify-between cursor-pointer card-hover select-none"
            title="Click for thermal check"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Thermometer className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                  THERMAL REALITY CHECK (TAP TO ROAST)
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-200">
                  {clickedToast?.text || (current.temperature >= 32 ? "Yes, it's actually that hot outside." : current.temperature <= 18 ? "Cozy sweater temperature verified." : "Pleasant temperature outside.")}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold bg-amber-500 text-slate-900 px-2.5 py-1 rounded-xl shrink-0">
              Verified 🌡️
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
