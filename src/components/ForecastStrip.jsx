import React, { useRef } from 'react';
import { 
  Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, 
  CloudRain, Snowflake, CloudRainWind, CloudLightning,
  ChevronLeft, ChevronRight, Clock, Droplets, Wind, Sparkles
} from 'lucide-react';
import { interpretWeatherCode } from '../utils/aqiHelpers';
import { HOURLY_COMIC_MICRO_STORIES } from '../utils/comicQuotes';

const getForecastIcon = (iconName) => {
  const props = { className: "w-7 h-7" };
  switch (iconName) {
    case 'Sun': return <Sun {...props} className="w-7 h-7 text-amber-500" />;
    case 'CloudSun': return <CloudSun {...props} className="w-7 h-7 text-amber-400" />;
    case 'Cloud': return <Cloud {...props} className="w-7 h-7 text-slate-500" />;
    case 'CloudFog': return <CloudFog {...props} className="w-7 h-7 text-slate-400" />;
    case 'CloudDrizzle': return <CloudDrizzle {...props} className="w-7 h-7 text-cyan-500" />;
    case 'CloudRain': return <CloudRain {...props} className="w-7 h-7 text-blue-500" />;
    case 'Snowflake': return <Snowflake {...props} className="w-7 h-7 text-sky-400" />;
    case 'CloudRainWind': return <CloudRainWind {...props} className="w-7 h-7 text-blue-600" />;
    case 'CloudLightning': return <CloudLightning {...props} className="w-7 h-7 text-purple-500" />;
    default: return <Sun {...props} className="w-7 h-7 text-amber-500" />;
  }
};

export default function ForecastStrip({ forecastHours = [] }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full glass-card rounded-3xl p-5 md:p-7 shadow-soft border border-white/80 overflow-hidden mb-6 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-sky-100 text-sky-700 rounded-2xl">
            <Clock className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-display font-bold text-slate-900 tracking-tight">
              24-Hour Atmospheric Scroll 🕒
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Hour-by-hour temperature, sky gossip & moisture progression
            </p>
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-full border border-slate-200 shadow-soft-sm transition-all btn-press cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-full border border-slate-200 shadow-soft-sm transition-all btn-press cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3.5 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'thin' }}
      >
        {forecastHours.map((hour, idx) => {
          const weather = interpretWeatherCode(hour.weatherCode);
          const microStory = HOURLY_COMIC_MICRO_STORIES[idx % HOURLY_COMIC_MICRO_STORIES.length];
          const isNow = idx === 0;

          return (
            <div
              key={`${hour.timeRaw}-${idx}`}
              className={`w-44 sm:w-48 shrink-0 snap-start rounded-3xl p-4 border transition-all card-hover flex flex-col justify-between text-center ${
                isNow 
                  ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-500 shadow-glow-amber scale-102' 
                  : 'bg-white/95 hover:bg-white text-slate-800 border-slate-200/80 shadow-soft-sm'
              }`}
            >
              {/* Hour & Act Label */}
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className={isNow ? 'text-amber-100' : 'text-slate-600'}>
                  {isNow ? 'Right Now' : hour.displayHour}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isNow ? 'bg-amber-700 text-amber-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  Act #{idx + 1}
                </span>
              </div>

              {/* Weather Graphic */}
              <div className="my-2 flex justify-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft-sm ${
                  isNow ? 'bg-amber-700/60' : 'bg-slate-50'
                }`}>
                  {getForecastIcon(weather.icon)}
                </div>
              </div>

              {/* Temperature */}
              <div className="text-3xl font-display font-extrabold tracking-tight">
                {hour.temp}°<span className={`text-sm font-bold ${isNow ? 'text-amber-200' : 'text-slate-400'}`}>C</span>
              </div>

              {/* Micro-Story */}
              <p className={`text-[11px] font-semibold italic mt-2 line-clamp-2 leading-tight ${
                isNow ? 'text-amber-100' : 'text-slate-600'
              }`}>
                "{microStory}"
              </p>

              {/* Moisture & Wind */}
              <div className={`mt-3 pt-2 border-t flex items-center justify-around text-[10px] font-bold ${
                isNow ? 'border-amber-400/40 text-amber-100' : 'border-slate-100 text-slate-500'
              }`}>
                <span className="flex items-center gap-0.5">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  {hour.humidity}%
                </span>
                <span className="flex items-center gap-0.5">
                  <Wind className="w-3 h-3 text-amber-400" />
                  {hour.windSpeed} km/h
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
