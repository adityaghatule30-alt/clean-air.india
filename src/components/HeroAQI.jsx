import React, { useState } from 'react';
import { Wind, Clock, History, Sparkles, Info, ShieldCheck, Smile, HelpCircle, ChevronDown, X } from 'lucide-react';
import { getAQIDetails, US_EPA_AQI_TIERS, calculateAqiPositionPercent } from '../utils/aqiHelpers';
import { getAQIRoast, getClickRoast } from '../utils/personalityEngine';
import MascotAvatar from './MascotAvatar';
import confetti from 'canvas-confetti';

export default function HeroAQI({ aqiData, cityName, onMascotPoke }) {
  const [selectedPollutant, setSelectedPollutant] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [clickedToast, setClickedToast] = useState(null);
  const [showWhyModal, setShowWhyModal] = useState(false);

  // Single Source of Truth for AQI
  const aqiValue = aqiData?.aqi != null ? Math.round(Number(aqiData.aqi)) : null;
  const aqiInfo = getAQIDetails(aqiValue ?? 50);
  const aqiRoast = getAQIRoast(aqiValue ?? 50);

  // Position percentage (0% to 100%) on the 6-tier piecewise scale
  const positionPercent = aqiValue != null ? calculateAqiPositionPercent(aqiValue) : null;

  // Identify the active tier
  const activeTier = aqiValue != null 
    ? (US_EPA_AQI_TIERS.find(t => aqiValue >= t.min && aqiValue <= t.max) || US_EPA_AQI_TIERS[US_EPA_AQI_TIERS.length - 1])
    : null;

  const pollutants = aqiData?.pollutants || {
    pm25: { value: 11.6, unit: 'µg/m³', label: 'PM2.5', full: 'Fine Inhalable Particles' },
    pm10: { value: 24.6, unit: 'µg/m³', label: 'PM10', full: 'Coarse Road Dust' },
    o3: { value: 42.0, unit: 'µg/m³', label: 'O₃', full: 'Ground Ozone' },
    no2: { value: 6.5, unit: 'µg/m³', label: 'NO₂', full: 'Nitrogen Dioxide' },
    so2: { value: 3.5, unit: 'µg/m³', label: 'SO₂', full: 'Sulphur Dioxide' },
    co: { value: 197, unit: 'µg/m³', label: 'CO', full: 'Carbon Monoxide' },
  };

  const pollutantConfigs = [
    { key: 'pm25', name: 'PM2.5', unit: 'µg/m³', punch: 'Tiny particles. Huge attitude.', desc: 'The invisible stuff is doing too much. Microscopic respirable particulate.' },
    { key: 'pm10', name: 'PM10', unit: 'µg/m³', punch: 'Someone shook the entire city rug.', desc: 'The air brought extra dust today. Coarse inhalable particles from roads and construction.' },
    { key: 'o3', name: 'O₃', unit: 'µg/m³', punch: 'Sunlight-cooked nitrogen oxides.', desc: 'Ground-level ozone formed by photochemical reactions in direct sunlight.' },
    { key: 'no2', name: 'NO₂', unit: 'µg/m³', punch: 'Vehicle exhausts doing overtime.', desc: 'Nitrogen dioxide from heavy diesel traffic and thermal generation.' },
    { key: 'so2', name: 'SO₂', unit: 'µg/m³', punch: 'Industrial furnaces sending regards.', desc: 'Sulphur emissions from power plants and fossil combustion.' },
    { key: 'co', name: 'CO', unit: 'µg/m³', punch: 'Fossil fuel incomplete combustion.', desc: 'Colorless odorless gas from motor engines.' },
  ];

  // Determine main dominant pollutant (highest relative to safety threshold)
  const getDominantPollutant = () => {
    const pm25Val = Number(pollutants?.pm25?.value) || 0;
    const pm10Val = Number(pollutants?.pm10?.value) || 0;
    if (pm25Val > 15 || pm25Val * 2 > pm10Val) {
      return { name: 'PM2.5', value: `${pm25Val} µg/m³`, desc: 'Fine respirable particles from vehicle exhaust & combustion' };
    }
    return { name: 'PM10', value: `${pm10Val} µg/m³`, desc: 'Coarse dust and surface particulates' };
  };

  const dominant = getDominantPollutant();

  const handleAQIClick = () => {
    if (activeTier?.funToast) {
      setClickedToast(activeTier.funToast);
      setTimeout(() => setClickedToast(null), 3000);
    }

    if (aqiValue != null && aqiValue <= 50) {
      try {
        confetti({ particleCount: 30, spread: 65, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleTierClick = (tier, e) => {
    e.stopPropagation();
    setSelectedTier(selectedTier?.id === tier.id ? null : tier);
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

            {aqiData?.yesterdayAvgAqi != null ? (
              <span className="text-xs font-bold text-slate-700 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 shadow-soft-sm flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Yesterday: {aqiData.yesterdayAvgAqi}
                {aqiData.aqiChange != null && (
                  <strong className={aqiData.aqiChange > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                    ({aqiData.aqiChange > 0 ? `+${aqiData.aqiChange} pts worse` : `${Math.abs(aqiData.aqiChange)} pts cleaner`})
                  </strong>
                )}
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-500 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
                Yesterday: Unavailable
              </span>
            )}
          </div>

          {/* Big AQI Number & Snarky Headline */}
          <div className="my-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              {aqiValue != null ? (
                <>
                  <span className="text-6xl sm:text-7xl font-display font-black text-slate-900 tracking-tight">
                    {aqiValue}
                  </span>
                  <span className="text-xl font-display font-bold text-slate-400">AQI</span>
                </>
              ) : (
                <span className="text-3xl font-display font-black text-slate-500">
                  AQI Unavailable
                </span>
              )}

              {/* Interactive [Why?] Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWhyModal(!showWhyModal);
                }}
                className="text-[10px] text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-2 py-0.5 rounded-full font-black cursor-pointer transition-colors ml-1"
                title="Explain this AQI measurement"
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

            {/* Inline "Why?" Health Explanation Card */}
            {showWhyModal && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="mt-3 p-3.5 bg-white/95 rounded-2xl border border-indigo-200 shadow-soft text-xs text-slate-800 space-y-1.5 animate-fadeIn"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-indigo-900 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-indigo-600" />
                    {activeTier?.badge || 'US EPA AQI Explanation'}
                  </span>
                  <button onClick={() => setShowWhyModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-semibold text-slate-700">
                  {activeTier?.description || 'Air quality measurement according to US EPA Standard.'}
                </p>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <strong>Main Contributor:</strong> {dominant.name} ({dominant.value}) — {dominant.desc}.
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* REAL DYNAMIC US EPA AQI SCALE & POSITION INDICATOR     */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            
            {/* Top Category Scale Labels */}
            <div className="grid grid-cols-6 text-center text-[10px] sm:text-[11px] font-black text-slate-500 mb-1.5 gap-0.5">
              {US_EPA_AQI_TIERS.map(tier => {
                const isActive = activeTier?.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={(e) => handleTierClick(tier, e)}
                    className={`truncate px-0.5 py-0.5 rounded transition-all cursor-pointer ${
                      isActive 
                        ? `${tier.textColor} font-black underline decoration-2 decoration-current` 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title={`Click for ${tier.label} (${tier.min}–${tier.max}) health advice`}
                  >
                    {tier.shortLabel}
                  </button>
                );
              })}
            </div>
            
            {/* Multi-Segment Track with Dynamic "YOU ARE HERE" Indicator */}
            <div className="relative w-full pt-6 pb-2">
              
              {/* Dynamic Position Marker (Tooltip & Arrow) */}
              {positionPercent != null && (
                <div 
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700 ease-out pointer-events-none z-20 motion-reduce:transition-none"
                  style={{ left: `${Math.min(96, Math.max(4, positionPercent))}%` }}
                >
                  <div className="bg-slate-900 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full shadow-soft flex items-center gap-0.5 border border-slate-700 whitespace-nowrap">
                    <span>📍 {aqiValue}</span>
                  </div>
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-900 -mt-0.5"></div>
                </div>
              )}

              {/* Contiguous 6-Segment Color Track */}
              <div className="relative w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner flex gap-0.5">
                {US_EPA_AQI_TIERS.map(tier => {
                  const isActive = activeTier?.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={(e) => handleTierClick(tier, e)}
                      className={`h-full flex-1 rounded-sm cursor-pointer transition-all duration-300 ${tier.color} ${
                        isActive 
                          ? 'ring-2 ring-slate-900 ring-offset-1 scale-y-110 shadow-soft-sm opacity-100 z-10' 
                          : 'opacity-75 hover:opacity-100'
                      }`}
                      title={`${tier.label} (${tier.min}–${tier.max}): Click to read guidance`}
                    ></div>
                  );
                })}
              </div>

              {/* Glowing Dot on Track */}
              {positionPercent != null && (
                <div 
                  className="absolute top-[27px] -translate-x-1/2 w-3.5 h-3.5 bg-white border-2 border-slate-900 rounded-full shadow-soft transition-all duration-700 ease-out z-20 pointer-events-none motion-reduce:transition-none"
                  style={{ left: `${Math.min(97, Math.max(3, positionPercent))}%` }}
                ></div>
              )}

            </div>

            {/* Selected Tier Health Definition Box */}
            {selectedTier && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="mt-2.5 p-3 bg-white/95 rounded-2xl border border-slate-200 shadow-soft-sm text-xs space-y-1 animate-fadeIn"
              >
                <div className="flex items-center justify-between font-black">
                  <span className={`${selectedTier.textColor} flex items-center gap-1`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {selectedTier.badge}
                  </span>
                  <button onClick={() => setSelectedTier(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-600 font-semibold leading-snug">
                  {selectedTier.description}
                </p>
                <span className="text-[11px] text-amber-800 font-bold block pt-0.5">
                  👉 Tip: {selectedTier.funToast}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mt-1.5">
              <span>Standard: US EPA Scale (0–500)</span>
              <span>Updated: {aqiData?.updatedAt || 'Live Telemetry'}</span>
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
                  Click the mascot above for hilarious audio roasts & confetti!
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
