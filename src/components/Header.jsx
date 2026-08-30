import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Volume2, VolumeX, 
  MapPin, Star, ChevronDown, MessageSquare, Trophy, 
  Gamepad2, Share2, Swords, Skull, Smile, HelpCircle
} from 'lucide-react';
import { getTimeBasedGreeting, HEADER_TAGLINES, getRandomItem } from '../utils/personalityEngine';
import { getLocalBanter } from '../utils/localBanterEngine';
import { isFavoriteLocation, toggleFavoriteLocation } from '../utils/locationStorage';
import { getUserProfile } from '../utils/achievementEngine';
import { weatherCommentary } from '../utils/weatherCommentaryEngine';
import confetti from 'canvas-confetti';

export default function Header({ 
  currentCity, 
  weatherData,
  aqiData,
  onRefresh, 
  isRefreshing, 
  soundEffectsOn, 
  toggleSoundEffects, 
  onOpenBattle, 
  onOpenLocationPicker,
  onOpenAchievements,
  onOpenGame,
  onOpenWhy,
  onShareCity,
  onEasterEgg,
  humorMode = 'sarcastic',
  onChangeHumorMode
}) {
  const [tagline, setTagline] = useState(HEADER_TAGLINES[0]);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const greeting = getTimeBasedGreeting();
  const localBanter = getLocalBanter(currentCity, weatherData, aqiData, 'greeting');
  const profile = getUserProfile();

  useEffect(() => {
    setTagline(getRandomItem(HEADER_TAGLINES));
    if (currentCity) {
      setIsFav(isFavoriteLocation(currentCity));
    }
  }, [currentCity]);

  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);

    if (next >= 7) {
      try {
        confetti({ particleCount: 50, spread: 90, origin: { y: 0.3 } });
      } catch (e) {}
      if (onEasterEgg) onEasterEgg("You clicked the logo 7 times. Cosmic Meteorologist Easter Egg unlocked! 🏆");
      setLogoClickCount(0);
    }
  };

  const handleToggleStar = (e) => {
    e.stopPropagation();
    if (!currentCity) return;
    toggleFavoriteLocation(currentCity);
    setIsFav(!isFav);
    if (!isFav) {
      try {
        confetti({ particleCount: 20, spread: 50, origin: { y: 0.2 } });
      } catch (err) {}
    }
  };

  const handleHumorClick = (mode) => {
    if (onChangeHumorMode) {
      onChangeHumorMode(mode);
    }
  };

  return (
    <header className="relative w-full max-w-6xl mx-auto mb-6">
      <div className="glass-card rounded-3xl p-5 md:p-6 shadow-soft border border-white/80 transition-all duration-300">
        
        {/* Top Mini Tagline & Local Banter Pill */}
        <div className="flex flex-wrap items-center justify-between text-xs font-bold gap-2 mb-2">
          <span 
            onClick={handleLogoClick}
            className="flex items-center gap-1 text-amber-800 font-black bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 shadow-soft-sm cursor-pointer select-none hover:scale-105 transition-transform"
            title="Tap 7 times for a secret easter egg!"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            {tagline}
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Humor Mode Intensity Selector */}
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-[10px] font-black">
              <button
                onClick={() => handleHumorClick('light')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  humorMode === 'light' ? 'bg-white text-slate-900 shadow-soft-sm font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Light Mode: Gentle & wholesome banter"
              >
                🙂 Light
              </button>
              <button
                onClick={() => handleHumorClick('sarcastic')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  humorMode === 'sarcastic' ? 'bg-white text-slate-900 shadow-soft-sm font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Sarcastic Mode: Classic witty banter (Default)"
              >
                😏 Sarcastic
              </button>
              <button
                onClick={() => handleHumorClick('dark')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  humorMode === 'dark' ? 'bg-slate-900 text-amber-300 shadow-soft-sm font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dark Mode: Deadpan & slightly unhinged internet humor"
              >
                💀 Dark
              </button>
            </div>

            {/* Local Cultural Banter Speech Pill */}
            <div className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-300 px-3 py-1 rounded-full text-xs font-extrabold shadow-soft-sm border border-slate-700 animate-fadeIn">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{localBanter.text}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Greeting & Subtitle with Attitude */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl animate-float">{greeting.icon}</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight">
                {greeting.title}!
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm md:text-base text-slate-600 font-bold">
                {greeting.subtitle}
              </span>

              {/* Clickable Location Chip */}
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenLocationPicker}
                  className="btn-press inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 px-3 py-1 rounded-full text-xs font-black shadow-soft-sm cursor-pointer transition-all border border-slate-700"
                  title="Click to switch location / search globally"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{[currentCity?.name, currentCity?.admin1, currentCity?.country].filter(Boolean).slice(0, 2).join(', ') || 'Select Location'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                </button>

                {/* Quick Favorite Toggle */}
                <button
                  onClick={handleToggleStar}
                  className={`btn-press p-1.5 rounded-full border transition-all cursor-pointer ${
                    isFav 
                      ? 'bg-amber-100 text-amber-600 border-amber-300 shadow-soft-sm' 
                      : 'bg-white/80 text-slate-400 hover:text-amber-500 border-slate-200'
                  }`}
                  title={isFav ? "Pinned in My Places ⭐ (Tap to unpin)" : "Add to My Places ⭐"}
                >
                  <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                </button>

                {/* 1-Click Share Button */}
                <button
                  onClick={onShareCity}
                  className="btn-press p-1.5 rounded-full border bg-white/90 hover:bg-slate-100 text-slate-600 border-slate-200 shadow-soft-sm cursor-pointer transition-all"
                  title="Share this city's weather & air quality forecast"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end flex-wrap">
            {/* Why Button */}
            {onOpenWhy && (
              <button
                onClick={() => onOpenWhy('temperature')}
                className="btn-press bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-black text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-indigo-200 shadow-soft-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Understand why atmospheric conditions are occurring"
              >
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Why? 🧠</span>
              </button>
            )}

            {/* Trophy Room / Achievements Button */}
            <button
              onClick={onOpenAchievements}
              className="btn-press bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-amber-300 shadow-soft-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="View Trophies & Climate Passport"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Lvl {profile.level} ({profile.unlockedCount} 🏆)</span>
            </button>

            {/* Mini Game Trigger */}
            <button
              onClick={onOpenGame}
              className="btn-press bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-emerald-200 shadow-soft-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="Play 'Hotter or Not?' City Duel Mini-Game"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-600" />
              <span>Hotter or Not? 🔥</span>
            </button>

            {/* City Duel */}
            <button
              onClick={onOpenBattle}
              className="btn-press bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-indigo-200 shadow-soft-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="Compare 2 Cities in an Atmosphere Duel"
            >
              <Swords className="w-4 h-4 text-indigo-600" />
              <span>City Battle ⚔️</span>
            </button>

            {/* Sound FX Toggle (OFF by default) */}
            <button
              onClick={toggleSoundEffects}
              className={`btn-press font-black text-xs sm:text-sm px-3 py-2.5 rounded-2xl border shadow-soft-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                soundEffectsOn 
                  ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100' 
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
              title={soundEffectsOn ? "Mute sound effects" : "Enable sound effects"}
            >
              {soundEffectsOn ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden sm:inline">{soundEffectsOn ? "SFX On" : "Muted"}</span>
            </button>

            {/* Live Refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn-press bg-white hover:bg-slate-50 text-slate-800 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 shadow-soft-sm flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              title="Ask the clouds for fresh numbers"
            >
              <RefreshCw className={`w-4 h-4 text-slate-700 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
              <span className="hidden sm:inline">Ask Clouds 🔄</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
