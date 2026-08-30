import React, { useState } from 'react';
import { 
  calculateVibeScore, HOW_BAD_TIERS, getCityRoastScorecard 
} from '../utils/vibeScoreEngine';
import { getDayPrediction } from '../utils/fortuneEngine';
import { getLocalBanter } from '../utils/localBanterEngine';
import { getShouldIGoOut } from '../utils/personalityEngine';
import { 
  Sparkles, Swords, Gamepad2, Footprints, Flame, 
  X, CheckCircle2, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AtmosphereHero({ 
  weatherData, 
  aqiData, 
  currentCity, 
  onPlayGame, 
  onOpenBattle 
}) {
  const vibe = calculateVibeScore(weatherData, aqiData);
  const localBanter = getLocalBanter(currentCity, weatherData, aqiData, 'vibe');
  const shouldGoOut = getShouldIGoOut(weatherData, aqiData);
  
  const [fortune, setFortune] = useState(null);
  const [isFortuneOpen, setIsFortuneOpen] = useState(false);

  const handlePredictDay = () => {
    const res = getDayPrediction(weatherData, aqiData, currentCity);
    setFortune(res);
    setIsFortuneOpen(true);
    try {
      confetti({ particleCount: 25, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // Active tier on the 6-tier meter
  const activeTier = HOW_BAD_TIERS.find(t => vibe.score >= t.minScore) || HOW_BAD_TIERS[HOW_BAD_TIERS.length - 1];

  return (
    <div className="relative w-full max-w-6xl mx-auto mb-6 space-y-4">
      
      {/* Unified Atmosphere Intelligence & Vibe Card */}
      <div className="glass-card rounded-3xl p-5 md:p-6 shadow-soft border border-white/80 transition-all duration-300">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* Left: Overall Vibe Score (0 to 100) */}
          <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-soft-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
              <span>ATMOSPHERE VIBE SCORE</span>
              <span className="text-2xl animate-bounce">{vibe.emoji}</span>
            </div>

            <div className="my-3 flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-display font-black text-amber-400 tracking-tight">
                {vibe.score}
              </span>
              <span className="text-2xl font-display font-bold text-slate-400">/100</span>
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-black text-amber-300 mb-1.5">
                STATUS: {vibe.status}
              </span>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                "{vibe.explanation}"
              </p>
            </div>
          </div>

          {/* Center: Live Mood, Local Banter & "Should I Go Out?" */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5">
            
            {/* Local Banter & Going Out Verdict */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 shadow-soft-sm">
                  📍 {currentCity?.name || 'Local'} Banter
                </span>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${shouldGoOut.color}`}>
                  {shouldGoOut.status}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-display font-black text-slate-900 leading-snug">
                "{localBanter.text}"
              </h3>
              
              <p className="text-xs font-bold text-slate-600">
                👉 Advice: {shouldGoOut.reason}
              </p>
            </div>

            {/* "How Bad Is It?" 6-Tier Progress Meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-500">
                <span>"HOW BAD IS IT?" SCALE</span>
                <span className="text-amber-800 font-bold">
                  {activeTier.label} {activeTier.emoji}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200">
                {HOW_BAD_TIERS.map((tier) => {
                  const isActive = activeTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      className={`py-1.5 px-0.5 rounded-xl text-center transition-all ${
                        isActive 
                          ? `${tier.color} shadow-soft scale-105 ring-2 ${tier.ring} font-black` 
                          : 'bg-white/60 text-slate-600 text-opacity-80'
                      }`}
                    >
                      <div className="text-base sm:text-lg">{tier.emoji}</div>
                      <div className="text-[9px] sm:text-[10px] font-extrabold truncate">
                        {tier.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Fast Interactive Game & Duel Launchpad */}
          <div className="lg:col-span-3 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-200/80 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
            
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-700">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>QUICK ACTIONS</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 px-2.5 py-0.5 rounded-full shadow-glow-amber border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-900 animate-pulse" />
                <span>PLAY NOW</span>
              </span>
            </div>

            {/* 1. Big Play Button for Hotter or Not */}
            <button
              onClick={onPlayGame}
              className="btn-press w-full bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-slate-950 font-black text-xs sm:text-sm py-3 px-4 rounded-2xl shadow-glow-amber flex items-center justify-center gap-2 cursor-pointer transition-transform transform hover:scale-102"
            >
              <Gamepad2 className="w-4 h-4 text-slate-950" />
              <span>PLAY "HOTTER OR NOT?" 🔥</span>
            </button>

            {/* 2. City Battle Trigger */}
            <button
              onClick={onOpenBattle}
              className="btn-press w-full bg-white hover:bg-slate-50 text-slate-800 font-black text-xs sm:text-sm py-2.5 px-3.5 rounded-2xl border border-slate-200 shadow-soft-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Swords className="w-4 h-4 text-indigo-600" />
              <span>City Battle (Smog Clash) ⚔️</span>
            </button>

            {/* 3. Sarcastic Fortune Predictor */}
            <button
              onClick={handlePredictDay}
              className="btn-press w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-2 px-3 rounded-xl border border-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Predict My Day 🔮</span>
            </button>

          </div>

        </div>

      </div>

      {/* Sarcastic Daily Prediction Popup */}
      {isFortuneOpen && fortune && (
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl shadow-soft-xl border border-indigo-500/40 space-y-3 animate-fadeIn">
          
          <div className="flex items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>TODAY'S ATMOSPHERIC PROPHECY & LOADOUT</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-amber-400 hidden sm:inline">{currentCity?.name || 'Local'} Forecast</span>
            </div>

            <button
              onClick={() => setIsFortuneOpen(false)}
              className="btn-press bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-xl text-xs font-black shrink-0 cursor-pointer"
            >
              Dismiss ✖
            </button>
          </div>

          <p className="text-base sm:text-lg font-display font-black text-amber-300 leading-snug">
            "{fortune.prediction}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs">
            {/* Special Item */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">🎒 SPECIAL ITEM</span>
              <div className="my-1">
                <strong className="text-white font-extrabold text-xs block">{fortune.specialItem}</strong>
                <span className="text-[10px] text-slate-400 leading-tight block">{fortune.itemDescription}</span>
              </div>
            </div>

            {/* Atmospheric Buff */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">⚡ PASSIVE BUFF</span>
              <strong className="text-emerald-200 font-bold text-xs my-1 block">{fortune.atmosphericBuff}</strong>
            </div>

            {/* Daily Side Quest */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">🎯 DAILY SIDE QUEST</span>
              <span className="text-indigo-200 font-semibold text-xs my-1 block">{fortune.sideQuest}</span>
            </div>

            {/* Cosmic Tip */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">💡 SURVIVAL TIP</span>
              <span className="text-rose-200 font-semibold text-xs my-1 block">{fortune.cosmicWarning}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
