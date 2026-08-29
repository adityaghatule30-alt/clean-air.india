import React from 'react';
import { X, Trophy, Star, MapPin, CheckCircle2, Lock, Sparkles, Flame, Shield, Award } from 'lucide-react';
import { ACHIEVEMENTS_LIST, getUnlockedAchievements, getPassportStamps, getUserProfile } from '../utils/achievementEngine';

export default function AchievementModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const profile = getUserProfile();
  const unlocked = getUnlockedAchievements();
  const stamps = getPassportStamps();

  const dailyChallenges = [
    { id: 1, title: "Check 3 different cities", done: profile.citiesVisited >= 3, xp: 50 },
    { id: 2, title: "Explore a location with clean air (AQI ≤ 50)", done: unlocked.includes('fresh_air_gang'), xp: 100 },
    { id: 3, title: "Survive a 3-win streak in the mini-game", done: profile.gameStreak >= 3, xp: 100 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-soft-xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-100">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-glow-amber font-black">
              🏆
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight">
                WEATHER TROPHY ROOM & PASSPORT
              </h2>
              <p className="text-xs font-semibold text-amber-300">
                Level {profile.level} Climate Explorer • {profile.unlockedCount}/{profile.totalAchievements} Badges Unlocked
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

        {/* Level XP Progress Bar */}
        <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800">
            <Award className="w-4 h-4 text-amber-500" />
            <span>LEVEL {profile.level}</span>
          </div>

          <div className="flex-1 max-w-md h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, profile.currentLevelProgress)}%` }}
            />
          </div>

          <span className="text-xs font-bold text-slate-500">
            {profile.totalXp} XP
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Section 1: Daily Challenges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-900 font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>TODAY'S CLIMATE CHALLENGES</span>
              </span>
              <span className="text-amber-700 font-bold">Daily Rewards</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {dailyChallenges.map((ch) => (
                <div
                  key={ch.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    ch.done 
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-soft-sm' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-black text-slate-800 leading-snug">
                      {ch.title}
                    </span>
                    {ch.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-black bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md shrink-0">+{ch.xp} XP</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold ${ch.done ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {ch.done ? "Completed! 🏆" : "In Progress..."}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Achievements Badges */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
              <span>EXPLORATION ACHIEVEMENTS ({profile.unlockedCount}/{ACHIEVEMENTS_LIST.length})</span>
              <span className="text-slate-500 font-semibold">Unlock by exploring</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS_LIST.map((ach) => {
                const isUnlocked = unlocked.includes(ach.id);

                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isUnlocked 
                        ? 'bg-white border-amber-300/80 shadow-soft-sm hover:scale-102 ring-1 ring-amber-400/40' 
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                        isUnlocked ? 'bg-amber-100 text-amber-700 shadow-soft-sm' : 'bg-slate-200 text-slate-400'
                      }`}>
                        {isUnlocked ? ach.icon : <Lock className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                          <span>{ach.title}</span>
                          {isUnlocked && <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">UNLOCKED</span>}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold leading-tight mt-0.5">
                          {ach.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-black text-slate-400 shrink-0">
                      +{ach.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Passport Stamps Collection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-900 font-black">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                <span>YOUR CLIMATE PASSPORT ({stamps.length} STAMPS)</span>
              </span>
              <span className="text-slate-500 font-semibold">Auto-collected</span>
            </div>

            {stamps.length === 0 ? (
              <p className="text-xs font-semibold text-slate-400 bg-slate-50 p-4 rounded-2xl text-center">
                Explore different locations to stamp your climate passport!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {stamps.map((s, idx) => (
                  <div
                    key={`${s.name}-${idx}`}
                    className="p-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-soft-sm flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-slate-900">
                      <span className="truncate">{s.name}</span>
                      <span className="text-[10px] text-slate-400">{s.date}</span>
                    </div>

                    <div className="my-1.5 flex items-center justify-between text-xs font-bold">
                      <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">{s.temp}°C</span>
                      <span className={`px-1.5 py-0.5 rounded-md ${s.aqi <= 50 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        AQI {s.aqi}
                      </span>
                    </div>

                    <span className="text-[9px] text-slate-400 font-semibold truncate">
                      {[s.admin1, s.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
