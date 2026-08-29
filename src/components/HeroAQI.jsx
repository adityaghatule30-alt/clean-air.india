import React, { useState } from 'react';
import { Wind, Clock, History, Sparkles, Info, ShieldCheck, Smile } from 'lucide-react';
import { getAQIDetails } from '../utils/aqiHelpers';
import { getAQIRoast, getClickRoast } from '../utils/personalityEngine';
import MascotAvatar from './MascotAvatar';
import confetti from 'canvas-confetti';

export default function HeroAQI({ aqiData, cityName, onMascotPoke }) {
  const [selectedPollutant, setSelectedPollutant] = useState(null);
  const [clickedToast, setClickedToast] = useState(null);

  const aqiInfo = getAQIDetails(aqiData?.aqi ?? 56);
  const aqiRoast = getAQIRoast(aqiData?.aqi ?? 56);

  const pollutants = aqiData?.pollutants || {
    pm25: { value: 11.6, unit: 'µg/m³', label: 'PM2.5', full: 'Fine Inhalable Particles' },
    pm10: { value: 24.6, unit: 'µg/m³', label: 'PM10', full: 'Coarse Road Dust' },
    o3: { value: 42.0, unit: 'µg/m³', label: 'O₃', full: 'Ground Ozone' },
    no2: { value: 6.5, unit: 'µg/m³', label: 'NO₂', full: 'Nitrogen Dioxide' },
    so2: { value: 3.5, unit: 'µg/m³', label: 'SO₂', full: 'Sulphur Dioxide' },
    co: { value: 197, unit: 'µg/m³', label: 'CO', full: 'Carbon Monoxide' },
  };

  const pollutantConfigs = [
    { key: 'pm25', name: 'PM2.5', unit: 'µg/m³', punch: 'Tiny particles. Huge attitude.', desc: 'The invisible stuff is doing too much. Microscopic nonsense.' },
    { key: 'pm10', name: 'PM10', unit: 'µg/m³', punch: 'Someone shook the entire city rug.', desc: 'The air brought extra dust today. Looks like it skipped cleaning day.' },
    { key: 'o3', name: 'O₃', unit: 'µg/m³', punch: 'Sunlight-cooked nitrogen oxides.', desc: 'Ground-level ozone formed by photochemical reactions in direct sunlight.' },
    { key: 'no2', name: 'NO₂', unit: 'µg/m³', punch: 'Vehicle exhausts doing overtime.', desc: 'Nitrogen dioxide from heavy diesel traffic and thermal generation.' },
    { key: 'so2', name: 'SO₂', unit: 'µg/m³', punch: 'Industrial furnaces sending regards.', desc: 'Sulphur emissions from power plants and fossil combustion.' },
    { key: 'co', name: 'CO', unit: 'µg/m³', punch: 'Fossil fuel incomplete combustion.', desc: 'Colorless odorless gas from motor engines.' },
  ];

  const aqiPercentage = Math.min(100, Math.max(0, (aqiInfo.value / 300) * 100));

  const handleAQIClick = () => {
    const text = getClickRoast('aqi', null, aqiData);
    setClickedToast(text);
    setTimeout(() => setClickedToast(null), 2500);

    if (aqiInfo.value <= 50) {
      try {
        confetti({ particleCount: 25, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="relative w-full glass-card rounded-3xl p-5 md:p-7 shadow-soft border border-white/80 overflow-hidden mb-6 transition-all duration-300">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
            <Wind className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-display font-black text-slate-900 tracking-tight">
              Air Quality & Lung Drama 🫁
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              US EPA Standard AQI & real-time pollutant telemetry for {cityName || 'Selected City'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-black text-slate-700">
          <span className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200 shadow-soft-sm">
            {aqiRoast.badge}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Main AQI Card (Clickable!) */}
        <div 
          onClick={handleAQIClick}
          className={`lg:col-span-6 ${aqiInfo.bgSoft} border ${aqiInfo.borderSoft} rounded-3xl p-6 shadow-soft-sm flex flex-col justify-between card-hover cursor-pointer relative overflow-hidden select-none`}
          title="Click AQI for lung reaction"
        >
          
          {/* Top Status & Yesterday Delta */}
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${aqiInfo.badgeClass}`}>
              <span>{aqiInfo.iconEmoji}</span>
              <span>{aqiInfo.label}</span>
            </span>

            {aqiData?.yesterdayAvgAqi != null && (
              <span className="text-xs font-bold text-slate-700 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 shadow-soft-sm flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Yesterday: {aqiData.yesterdayAvgAqi}
                {aqiData.aqiChange != null && (
                  <strong className={aqiData.aqiChange > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                    ({aqiData.aqiChange > 0 ? `+${aqiData.aqiChange} pts worse` : `${aqiData.aqiChange} pts cleaner`})
                  </strong>
                )}
              </span>
            )}
          </div>

          {/* Big AQI Number & Snarky Headline */}
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-display font-black text-slate-900 tracking-tight">
                {aqiInfo.value}
              </span>
              <span className="text-xl font-display font-bold text-slate-400">AQI</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const whyAqi = aqiInfo.value <= 50 
                    ? "Air quality is satisfactory and poses minimal risk to human health."
                    : aqiInfo.value <= 100 
                    ? "Air quality is acceptable; moderate concern for sensitive groups."
                    : aqiInfo.value <= 150 
                    ? "Members of sensitive groups may experience health effects."
                    : aqiInfo.value <= 200 
                    ? "Everyone may begin to experience health effects; wear an N95 outdoors."
                    : "Health alert: serious atmospheric particulate pollution.";
                  setClickedToast(whyAqi);
                  setTimeout(() => setClickedToast(null), 3500);
                }}
                className="text-[10px] text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2 py-0.5 rounded-full font-black cursor-pointer transition-colors ml-1"
                title="What does this AQI level mean?"
              >
                Why?
              </button>
            </div>

            {/* Sarcastic AQI Quote */}
            <p className="text-base sm:text-lg font-display font-black text-slate-800 mt-2 italic leading-snug">
              "{clickedToast || aqiRoast.roast}"
            </p>
            <p className="text-xs font-bold text-slate-600 mt-1">
              💬 {aqiRoast.comment}
            </p>
          </div>

          {/* Visual Progress Scale Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 mb-1.5">
              <span className="text-emerald-600 font-black">0 Good</span>
              <span className="text-amber-600 font-black">50 Mod</span>
              <span className="text-orange-600 font-black">100 Sens</span>
              <span className="text-rose-600 font-black">150 Unh</span>
              <span className="text-purple-600 font-black">200+ Haz</span>
            </div>
            
            {/* Color Gradient Track */}
            <div className="relative w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 via-orange-400 via-rose-500 to-purple-600 transition-all duration-700"
                style={{ width: `${Math.max(8, aqiPercentage)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mt-2">
              <span>Standard: US EPA Scale</span>
              <span>Updated: {aqiData?.updatedAt || 'Live'}</span>
            </div>
          </div>

        </div>

        {/* Right: Interactive Pollutant Chips & Mascot Companion */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                PRIMARY POLLUTANTS (TAP FOR DETAILS)
              </span>
              <span className="text-[11px] text-amber-600 font-black">
                Tap chip 👇
              </span>
            </div>

            {/* Pollutant Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {pollutantConfigs.map((cfg) => {
                const pol = pollutants[cfg.key] || { value: '--', unit: 'µg/m³' };
                const isSelected = selectedPollutant === cfg.key;

                return (
                  <button
                    key={cfg.key}
                    onClick={() => setSelectedPollutant(isSelected ? null : cfg.key)}
                    className={`text-left p-3 rounded-2xl border transition-all card-hover cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-soft-lg scale-105' 
                        : 'bg-white/90 hover:bg-white text-slate-800 border-slate-200/80 shadow-soft-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-black mb-1">
                      <span className={isSelected ? 'text-amber-300' : 'text-slate-500'}>
                        {cfg.name}
                      </span>
                      <span className="text-[10px] opacity-75">{pol.unit}</span>
                    </div>

                    <div className="text-xl sm:text-2xl font-display font-black">
                      {pol.value}
                    </div>

                    <span className={`text-[10px] font-bold block truncate mt-0.5 ${
                      isSelected ? 'text-amber-200' : 'text-slate-400'
                    }`}>
                      {cfg.punch}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Pollutant Breakdown Detail */}
            {selectedPollutant && (
              <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-950 animate-fadeIn shadow-soft-sm">
                <strong className="font-extrabold text-amber-900">{pollutants[selectedPollutant]?.full}: </strong>
                {pollutantConfigs.find(c => c.key === selectedPollutant)?.desc} — 
                <span className="italic ml-1">"{pollutantConfigs.find(c => c.key === selectedPollutant)?.punch}"</span>
              </div>
            )}
          </div>

          {/* Interactive Mascot Companion */}
          <div className="bg-gradient-to-r from-slate-50 to-amber-50/70 p-4 rounded-3xl border border-slate-200/80 flex items-center justify-between shadow-soft-sm">
            <div className="flex items-center gap-3">
              <div className="scale-75 origin-left">
                <MascotAvatar mood={aqiInfo.heroMood} aqi={aqiInfo.value} onPoke={onMascotPoke} />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Atmosphere Companion (Tap to poke!)
                </span>
                <span className="text-[11px] text-slate-600 font-semibold">
                  Click the hero above for hilarious audio roasts & confetti!
                </span>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse mr-2 shrink-0" />
          </div>

        </div>

      </div>
    </div>
  );
}
