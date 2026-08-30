import React, { useState } from 'react';
import { History, ArrowUpRight, ArrowDownRight, Minus, Sparkles, HelpCircle, ChevronRight } from 'lucide-react';
import { weatherCommentary } from '../utils/weatherCommentaryEngine';

export default function TodayVsYesterday({ weatherData, aqiData, onOpenWhy }) {
  const current = weatherData?.current || {};
  const curTemp = current.temperature != null ? Math.round(current.temperature) : 28;
  const yMax = current.yesterdayMax != null ? Math.round(current.yesterdayMax) : null;
  const curMax = current.todayMax != null ? Math.round(current.todayMax) : curTemp;
  const tempDiff = yMax != null ? (curMax - yMax) : null;

  const curAqi = aqiData?.aqi != null ? Math.round(aqiData.aqi) : 56;
  const yAqi = aqiData?.yesterdayAvgAqi != null ? Math.round(aqiData.yesterdayAvgAqi) : null;
  const aqiDiff = yAqi != null ? (curAqi - yAqi) : null;

  const curHumidity = current.humidity != null ? Math.round(current.humidity) : 60;
  const yHumidity = current.yesterdayAvgHumidity != null ? Math.round(current.yesterdayAvgHumidity) : null;
  const humDiff = yHumidity != null ? (curHumidity - yHumidity) : null;

  const curWind = current.windSpeed != null ? Math.round(current.windSpeed) : 12;
  const yWind = current.yesterdayAvgWind != null ? Math.round(current.yesterdayAvgWind) : null;
  const windDiff = yWind != null ? (curWind - yWind) : null;

  const verdict = weatherCommentary.getTodayVsYesterdayVerdict(weatherData, aqiData);

  const METRICS = [
    {
      id: 'temp',
      label: 'Max Temperature',
      today: `${curMax}°C`,
      yesterday: yMax != null ? `${yMax}°C` : 'Unavailable',
      diff: tempDiff,
      unit: '°C',
      formatDiff: (d) => d > 0 ? `+${d}° hotter` : d < 0 ? `${d}° cooler` : 'Identical',
      diffColor: (d) => d > 0 ? 'text-amber-600 bg-amber-50' : d < 0 ? 'text-sky-600 bg-sky-50' : 'text-slate-500 bg-slate-50'
    },
    {
      id: 'aqi',
      label: 'Air Quality (AQI)',
      today: `${curAqi}`,
      yesterday: yAqi != null ? `${yAqi}` : 'Unavailable',
      diff: aqiDiff,
      unit: 'pts',
      formatDiff: (d) => d > 0 ? `+${d} pts worse` : d < 0 ? `${Math.abs(d)} pts cleaner` : 'Unchanged',
      diffColor: (d) => d > 0 ? 'text-rose-600 bg-rose-50' : d < 0 ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'
    },
    {
      id: 'humidity',
      label: 'Humidity',
      today: `${curHumidity}%`,
      yesterday: yHumidity != null ? `${yHumidity}%` : 'Unavailable',
      diff: humDiff,
      unit: '%',
      formatDiff: (d) => d > 0 ? `+${d}% more humid` : d < 0 ? `${d}% drier` : 'Same',
      diffColor: (d) => d > 0 ? 'text-blue-600 bg-blue-50' : d < 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-50'
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      today: `${curWind} km/h`,
      yesterday: yWind != null ? `${yWind} km/h` : 'Unavailable',
      diff: windDiff,
      unit: 'km/h',
      formatDiff: (d) => d > 0 ? `+${d} km/h windier` : d < 0 ? `${d} km/h calmer` : 'Same',
      diffColor: (d) => d > 0 ? 'text-indigo-600 bg-indigo-50' : d < 0 ? 'text-slate-600 bg-slate-50' : 'text-slate-500 bg-slate-50'
    }
  ];

  return (
    <div className="glass-card rounded-3xl p-5 md:p-6 shadow-soft border border-white/80 overflow-hidden mb-6 transition-all duration-300">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-2xl">
            <History className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>📊 Today vs Yesterday Comparison</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Actual 24-hour atmospheric changes based on Open-Meteo historical readings
            </p>
          </div>
        </div>

        <span className="self-start sm:self-center text-xs font-black text-slate-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          24h Delta
        </span>
      </div>

      {/* Dynamic Verdict Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/10 rounded-2xl border border-amber-200/80 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
            "{verdict}"
          </p>
        </div>
      </div>

      {/* 4-Metric Grid Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map(m => (
          <div 
            key={m.id}
            className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-soft-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
              <span>{m.label}</span>
              {onOpenWhy && (
                <button
                  onClick={() => onOpenWhy(m.id)}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-black cursor-pointer"
                  title={`Why is ${m.label.toLowerCase()} changing?`}
                >
                  Why? 🧠
                </button>
              )}
            </div>

            <div className="flex items-baseline justify-between my-1">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 block">TODAY</span>
                <span className="text-xl font-display font-black text-slate-900">{m.today}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-black text-slate-400 block">YESTERDAY</span>
                <span className="text-sm font-bold text-slate-500">{m.yesterday}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-black">
              <span className="text-slate-400">Trend:</span>
              {m.diff != null ? (
                <span className={`px-2 py-0.5 rounded-md ${m.diffColor(m.diff)}`}>
                  {m.formatDiff(m.diff)}
                </span>
              ) : (
                <span className="text-slate-400">No delta</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
