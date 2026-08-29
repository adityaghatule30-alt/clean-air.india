import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  X, Trophy, Flame, Sparkles, Star, RotateCcw, 
  ArrowRight, CheckCircle2, Play, Compass, Award, ShieldAlert,
  Zap, AlertCircle, Wind, Droplets, Thermometer, Smile, Clock, Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchWeatherData } from '../api/weatherApi';
import { fetchAirQualityData } from '../api/aqiApi';
import { POPULAR_INDIAN_CITIES } from '../utils/comicQuotes';
import { getStoredStats, saveStats, unlockAchievement } from '../utils/achievementEngine';

// Extended roster of battle cities
const GAME_CITIES = [
  ...POPULAR_INDIAN_CITIES,
  { name: "London", state: "UK", lat: 51.5074, lon: -0.1278, tag: "Rain & Tea ☕", aqiEstimate: "Clean" },
  { name: "Dubai", state: "UAE", lat: 25.2048, lon: 55.2708, tag: "Desert Air Fryer 🏜️", aqiEstimate: "Spicy" },
  { name: "Tokyo", state: "Japan", lat: 35.6762, lon: 139.6503, tag: "Neon & Clean 🌸", aqiEstimate: "Fresh" },
  { name: "New York", state: "USA", lat: 40.7128, lon: -74.0060, tag: "Big Apple Breeze 🗽", aqiEstimate: "Moderate" },
  { name: "Singapore", state: "SG", lat: 1.3521, lon: 103.8198, tag: "Equator Humidity 🌴", aqiEstimate: "Clean" },
  { name: "Goa", state: "Goa", lat: 15.2993, lon: 74.1240, tag: "Beach Vibes 🏖️", aqiEstimate: "Fresh" },
  { name: "Srinagar", state: "Kashmir", lat: 34.0837, lon: 74.7973, tag: "Chilly Valley ❄️", aqiEstimate: "Clean" }
];

const GAME_MODES = [
  { id: 'hotter', label: '🔥 HOTTER', question: 'Which city is HOTTER right now?' },
  { id: 'cleaner', label: '🫁 CLEANER AIR', question: 'Which city has CLEANER AIR (Lower AQI)?' },
  { id: 'colder', label: '🥶 COLDER', question: 'Which city is COLDER right now?' },
  { id: 'windier', label: '💨 WINDIER', question: 'Which city has STRONGER WIND right now?' },
  { id: 'guess_temp', label: '🌡️ GUESS TEMP', question: 'What is the actual temperature?' }
];

const WAGER_OPTIONS = [50, 100, 250];

export default function MiniGameModal({ isOpen, onClose, weatherData, aqiData, currentCity }) {
  const [gameMode, setGameMode] = useState('hotter'); // hotter | cleaner | colder | windier | guess_temp
  const [gameState, setGameState] = useState('playing'); // playing | revealed | gameover
  const [cityA, setCityA] = useState(null);
  const [cityB, setCityB] = useState(null);
  const [cityAData, setCityAData] = useState(null);
  const [cityBData, setCityBData] = useState(null);
  const [isLoadingRound, setIsLoadingRound] = useState(true);

  // Guess Temp options
  const [tempOptions, setTempOptions] = useState([]);

  // Gameplay state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [wager, setWager] = useState(100);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lastVerdict, setLastVerdict] = useState(null);

  const timerRef = useRef(null);

  // Pick 2 random distinct cities
  const loadNewRound = useCallback(async (forcedMode = gameMode) => {
    setIsLoadingRound(true);
    setSelectedAnswer(null);
    setLastVerdict(null);
    setGameState('playing');
    setTimeLeft(7);

    try {
      // Pick City A (can be current city or random)
      const shuffled = [...GAME_CITIES].sort(() => 0.5 - Math.random());
      const cA = (currentCity && Math.random() < 0.4) ? currentCity : shuffled[0];
      let cB = shuffled[1];
      if (cB.name === cA.name) cB = shuffled[2];

      setCityA(cA);
      setCityB(cB);

      // Fetch live data for both cities
      const [wA, aA, wB, aB] = await Promise.all([
        fetchWeatherData(cA.lat, cA.lon),
        fetchAirQualityData(cA.lat, cA.lon),
        fetchWeatherData(cB.lat, cB.lon),
        fetchAirQualityData(cB.lat, cB.lon)
      ]);

      const dataA = {
        temp: Math.round(wA?.current?.temperature ?? 26),
        aqi: Math.round(aA?.aqi ?? 60),
        wind: Math.round(wA?.current?.windSpeed ?? 10),
        code: wA?.current?.weatherCode ?? 0
      };

      const dataB = {
        temp: Math.round(wB?.current?.temperature ?? 26),
        aqi: Math.round(aB?.aqi ?? 60),
        wind: Math.round(wB?.current?.windSpeed ?? 10),
        code: wB?.current?.weatherCode ?? 0
      };

      setCityAData(dataA);
      setCityBData(dataB);

      // If Guess Temp mode, generate 3 plausible options
      if (forcedMode === 'guess_temp') {
        const correct = dataA.temp;
        const fake1 = correct + (Math.random() < 0.5 ? -4 : 5);
        const fake2 = correct + (Math.random() < 0.5 ? 8 : -7);
        const opts = [correct, fake1, fake2].sort(() => 0.5 - Math.random());
        setTempOptions(opts);
      }

    } catch (err) {
      console.error("Game round load error:", err);
      // Fallback mock data in case of offline / network hiccup
      setCityA(GAME_CITIES[0]);
      setCityB(GAME_CITIES[1]);
      setCityAData({ temp: 31, aqi: 175, wind: 12, code: 0 });
      setCityBData({ temp: 28, aqi: 62, wind: 18, code: 0 });
      setTempOptions([31, 26, 36]);
    } finally {
      setIsLoadingRound(false);
    }
  }, [currentCity, gameMode]);

  // Initial load
  useEffect(() => {
    if (isOpen) {
      setRoundNumber(1);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      loadNewRound(gameMode);
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || gameState !== 'playing' || !timerActive || isLoadingRound) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [isOpen, gameState, timerActive, timeLeft, isLoadingRound]);

  const handleTimeout = () => {
    handleAnswer('TIMEOUT');
  };

  // Handle Answer Selection
  const handleAnswer = (choice) => {
    if (gameState !== 'playing' || isLoadingRound) return;
    setSelectedAnswer(choice);
    setGameState('revealed');

    let isCorrect = false;
    let deltaText = "";
    let diff = 0;

    if (gameMode === 'guess_temp') {
      isCorrect = Number(choice) === cityAData.temp;
      diff = Math.abs(Number(choice) - cityAData.temp);
    } else if (gameMode === 'hotter') {
      if (cityAData.temp === cityBData.temp) isCorrect = true;
      else isCorrect = (choice === 'A' && cityAData.temp > cityBData.temp) || (choice === 'B' && cityBData.temp > cityAData.temp);
      diff = Math.abs(cityAData.temp - cityBData.temp);
      deltaText = `${cityA.name} (${cityAData.temp}°C) vs ${cityB.name} (${cityBData.temp}°C)`;
    } else if (gameMode === 'colder') {
      if (cityAData.temp === cityBData.temp) isCorrect = true;
      else isCorrect = (choice === 'A' && cityAData.temp < cityBData.temp) || (choice === 'B' && cityBData.temp < cityAData.temp);
      diff = Math.abs(cityAData.temp - cityBData.temp);
      deltaText = `${cityA.name} (${cityAData.temp}°C) vs ${cityB.name} (${cityBData.temp}°C)`;
    } else if (gameMode === 'cleaner') {
      // Cleaner = LOWER AQI
      if (cityAData.aqi === cityBData.aqi) isCorrect = true;
      else isCorrect = (choice === 'A' && cityAData.aqi < cityBData.aqi) || (choice === 'B' && cityBData.aqi < cityAData.aqi);
      diff = Math.abs(cityAData.aqi - cityBData.aqi);
      deltaText = `${cityA.name} (AQI ${cityAData.aqi}) vs ${cityB.name} (AQI ${cityBData.aqi})`;
    } else if (gameMode === 'windier') {
      if (cityAData.wind === cityBData.wind) isCorrect = true;
      else isCorrect = (choice === 'A' && cityAData.wind > cityBData.wind) || (choice === 'B' && cityBData.wind > cityAData.wind);
      diff = Math.abs(cityAData.wind - cityBData.wind);
      deltaText = `${cityA.name} (${cityAData.wind} km/h) vs ${cityB.name} (${cityBData.wind} km/h)`;
    }

    // Reaction Generation
    let punchline = "";
    let subtext = "";

    if (choice === 'TIMEOUT') {
      punchline = "⏰ OUT OF TIME! 💀";
      subtext = "Hesitation in the forecast is fatal!";
    } else if (isCorrect) {
      if (diff <= 1 && gameMode !== 'guess_temp') {
        punchline = "THAT WAS CLOSE! 😱";
        subtext = `You won by just ${diff} unit! Pure weather telepathy!`;
      } else {
        const correctQuotes = [
          "LET'S GOOO! 🔥",
          "Okay, actual meteorologist! 🤓",
          "Big brain weather move! 🧠",
          "The atmosphere respects you! ✨",
          "You cooked. Literally! 🍳",
          "Certified forecast genius! 🚀"
        ];
        punchline = correctQuotes[Math.floor(Math.random() * correctQuotes.length)];
        subtext = deltaText || `Exact hit! ${cityA.name} is indeed ${cityAData.temp}°C.`;
      }

      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
      } catch (e) {}
    } else {
      if (diff >= 10 && (gameMode === 'hotter' || gameMode === 'colder')) {
        punchline = "BRO DIDN'T EVEN TRY 💀";
        subtext = `There was a massive ${diff}°C difference! ${deltaText}`;
      } else {
        const wrongQuotes = [
          "💀 NOPE! Nature fooled you.",
          "Bro trusted the wrong city! 😭",
          "The weather app is judging you.",
          "That was... certainly a bold guess.",
          "Close enough? Absolutely not! 💀"
        ];
        punchline = wrongQuotes[Math.floor(Math.random() * wrongQuotes.length)];
        subtext = deltaText || `Wrong guess! It was actually ${cityAData.temp}°C.`;
      }
    }

    // Points & Streak calculation
    let earnedPts = 0;
    let nextStreak = streak;

    if (isCorrect) {
      nextStreak = streak + 1;
      let multiplier = 1;
      if (nextStreak >= 10) multiplier = 2.5;
      else if (nextStreak >= 5) multiplier = 1.8;
      else if (nextStreak >= 3) multiplier = 1.4;

      earnedPts = Math.round(wager * multiplier);
    } else {
      earnedPts = -Math.round(wager * 0.5);
      nextStreak = 0;
    }

    const nextScore = Math.max(0, score + earnedPts);
    setScore(nextScore);
    setStreak(nextStreak);
    if (nextStreak > maxStreak) setMaxStreak(nextStreak);

    setLastVerdict({
      isCorrect,
      punchline,
      subtext,
      earnedPts,
      diff
    });

    // Save stats
    const stats = getStoredStats();
    stats.gameScore = nextScore;
    stats.gameStreak = Math.max(stats.gameStreak || 0, nextStreak);
    saveStats(stats);

    if (nextStreak >= 5) unlockAchievement('forecast_addict');
  };

  // Next Round Handler
  const handleNextRound = () => {
    if (roundNumber >= 10) {
      setGameState('gameover');
      return;
    }
    setRoundNumber(prev => prev + 1);
    loadNewRound(gameMode);
  };

  // Mode Switch
  const handleSwitchMode = (modeId) => {
    setGameMode(modeId);
    setRoundNumber(1);
    setScore(0);
    setStreak(0);
    loadNewRound(modeId);
  };

  // Final Player Title
  const getFinalPlayerTitle = () => {
    if (score >= 1500) return { title: "👑 FORECAST FINAL BOSS", desc: "You don't check the weather, the weather checks with you." };
    if (score >= 1000) return { title: "🤓 HUMAN WEATHER RADAR", desc: "Bro somehow knows the atmosphere of every coordinate on Earth." };
    if (maxStreak >= 5) return { title: "🔥 CERTIFIED WEATHER NERD", desc: "5+ win streak! You should work at the meteorological office." };
    if (score >= 500) return { title: "😎 WEATHER ENJOYER", desc: "Solid instincts. You survived the climate duel." };
    return { title: "💀 PROFESSIONAL BAD GUESSER", desc: "Mother Nature thoroughly bamboozled you today." };
  };

  // Streak milestone praise
  const getStreakPraise = () => {
    if (streak >= 10) return "👑 FORECAST FINAL BOSS";
    if (streak >= 5) return "🤓 WEATHER NERD (1.8x BONUS)";
    if (streak >= 3) return "🔥 HEATING UP! (1.4x BONUS)";
    return null;
  };

  if (!isOpen) return null;

  const currentModeInfo = GAME_MODES.find(m => m.id === gameMode) || GAME_MODES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl shadow-soft-xl overflow-hidden border-2 border-amber-400/40 flex flex-col max-h-[94vh]">
        
        {/* Game Top HUD */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 rounded-xl shadow-glow-amber font-black text-sm">
              🔥
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                HOTTER OR NOT? 🔥
              </span>
              <h2 className="text-base sm:text-lg font-display font-black text-white leading-none">
                CITY WEATHER DUEL
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 text-xs font-black">
              <span className="bg-white/10 px-3 py-1 rounded-xl text-amber-300 border border-white/10">
                ⭐ {score}
              </span>
              {streak > 0 && (
                <span className="bg-rose-500/30 text-rose-300 px-2.5 py-1 rounded-xl border border-rose-500/40 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  {streak}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Strip */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {GAME_MODES.map(m => (
            <button
              key={m.id}
              onClick={() => handleSwitchMode(m.id)}
              className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                gameMode === m.id
                  ? 'bg-amber-400 text-slate-950 shadow-glow-amber scale-105'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Quick Toolbar (Round, Bet & Speed Timer Toggle) */}
        <div className="px-5 py-2 bg-white/5 flex items-center justify-between text-xs font-bold text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-lg text-amber-300 font-black">
              Round {roundNumber}/10
            </span>
            {getStreakPraise() && (
              <span className="text-[11px] font-black text-rose-300 animate-pulse">
                {getStreakPraise()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Bet Selector */}
            <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10 text-[11px]">
              <span className="text-slate-400">Bet:</span>
              {WAGER_OPTIONS.map(w => (
                <button
                  key={w}
                  onClick={() => setWager(w)}
                  className={`px-1.5 py-0.2 rounded font-black cursor-pointer ${wager === w ? 'text-amber-400 underline' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Timer Toggle */}
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`p-1 rounded-lg border cursor-pointer transition-colors ${
                timerActive ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-white/5 text-slate-500 border-white/10'
              }`}
              title={timerActive ? "7s Speedrun Timer Active" : "Speedrun Timer Off"}
            >
              <Clock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Timer Bar (if active) */}
        {timerActive && gameState === 'playing' && (
          <div className="w-full h-1.5 bg-white/10 overflow-hidden shrink-0">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-1000"
              style={{ width: `${(timeLeft / 7) * 100}%` }}
            />
          </div>
        )}

        {/* Main Arena Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-4">
          
          {/* ========================================================= */}
          {/* A. PLAYING & REVEALED ARENA */}
          {/* ========================================================= */}
          {gameState !== 'gameover' && (
            <div className="space-y-4 my-auto">
              
              {/* Question Header */}
              <div className="text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  {currentModeInfo.label}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                  {gameMode === 'guess_temp' 
                    ? `What is the temperature in ${cityA?.name || '...'}?`
                    : currentModeInfo.question}
                </h3>
              </div>

              {/* Loading State */}
              {isLoadingRound ? (
                <div className="py-12 text-center space-y-3 animate-pulse">
                  <div className="text-5xl animate-bounce">🌍</div>
                  <p className="text-sm font-bold text-amber-300">
                    Sniffing live satellite weather for both cities... ☁️
                  </p>
                </div>
              ) : gameMode === 'guess_temp' ? (
                /* ===================================================== */
                /* SINGLE CITY GUESS TEMP MODE */
                /* ===================================================== */
                <div className="space-y-4">
                  <div className="bg-white/10 p-5 rounded-3xl border border-white/15 text-center space-y-2">
                    <span className="text-3xl">📍</span>
                    <h4 className="text-2xl font-display font-black text-white">{cityA?.name}</h4>
                    <p className="text-xs text-amber-300 font-bold">{cityA?.tag}</p>
                    <div className="text-xs text-slate-300 font-semibold pt-1">
                      Wind: {cityAData?.wind} km/h • AQI: {cityAData?.aqi}
                    </div>
                  </div>

                  {/* 3 Guess Options */}
                  <div className="grid grid-cols-3 gap-3">
                    {tempOptions.map((tOpt, idx) => (
                      <button
                        key={idx}
                        disabled={gameState === 'revealed'}
                        onClick={() => handleAnswer(tOpt)}
                        className={`p-4 rounded-2xl font-display font-black text-2xl border-2 transition-all card-hover cursor-pointer ${
                          gameState === 'revealed'
                            ? tOpt === cityAData.temp
                              ? 'bg-emerald-500 text-slate-950 border-emerald-300 scale-105 shadow-glow-emerald'
                              : selectedAnswer === tOpt
                              ? 'bg-rose-500/80 text-white border-rose-400'
                              : 'bg-white/5 text-slate-500 border-white/5'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/15 hover:border-amber-400 hover:scale-105'
                        }`}
                      >
                        {tOpt}°C
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* ===================================================== */
                /* CITY A vs CITY B DUEL ARENA */
                /* ===================================================== */
                <div className="grid grid-cols-2 gap-3 sm:gap-4 relative pt-2">
                  
                  {/* Big Animated VS Badge Centerpiece */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center shadow-glow-amber border-2 border-slate-950 animate-pulse">
                      VS
                    </div>
                  </div>

                  {/* CITY A BUTTON */}
                  <button
                    disabled={gameState === 'revealed'}
                    onClick={() => handleAnswer('A')}
                    className={`p-4 sm:p-5 rounded-3xl border-2 text-left flex flex-col justify-between min-h-[190px] sm:min-h-[210px] transition-all card-hover cursor-pointer relative overflow-hidden group ${
                      gameState === 'revealed'
                        ? selectedAnswer === 'A'
                          ? lastVerdict?.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-400 shadow-glow-emerald scale-[1.02]'
                            : 'bg-rose-950/80 border-rose-400 shadow-glow-rose'
                          : 'bg-white/5 border-white/10 opacity-70'
                        : 'bg-white/10 hover:bg-white/15 border-white/15 hover:border-amber-400 hover:scale-[1.02]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                        CITY 1
                      </span>
                      <h4 className="text-xl sm:text-2xl font-display font-black text-white leading-tight group-hover:text-amber-300">
                        {cityA?.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-semibold block truncate">
                        {cityA?.tag}
                      </span>
                    </div>

                    {/* Metric Display */}
                    <div className="pt-3">
                      {gameState === 'revealed' ? (
                        <div className="space-y-0.5 animate-fadeIn">
                          <span className="text-3xl sm:text-4xl font-display font-black text-amber-300">
                            {gameMode === 'cleaner' ? `AQI ${cityAData?.aqi}` : gameMode === 'windier' ? `${cityAData?.wind} km/h` : `${cityAData?.temp}°C`}
                          </span>
                          <div className="text-[11px] text-slate-300 font-bold">
                            {gameMode !== 'cleaner' && `AQI ${cityAData?.aqi} • `}
                            {gameMode !== 'windier' && `${cityAData?.wind} km/h`}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/10 p-2.5 rounded-2xl text-center font-black text-sm text-slate-300 border border-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                          TAP TO PICK 👆
                        </div>
                      )}
                    </div>
                  </button>

                  {/* CITY B BUTTON */}
                  <button
                    disabled={gameState === 'revealed'}
                    onClick={() => handleAnswer('B')}
                    className={`p-4 sm:p-5 rounded-3xl border-2 text-left flex flex-col justify-between min-h-[190px] sm:min-h-[210px] transition-all card-hover cursor-pointer relative overflow-hidden group ${
                      gameState === 'revealed'
                        ? selectedAnswer === 'B'
                          ? lastVerdict?.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-400 shadow-glow-emerald scale-[1.02]'
                            : 'bg-rose-950/80 border-rose-400 shadow-glow-rose'
                          : 'bg-white/5 border-white/10 opacity-70'
                        : 'bg-white/10 hover:bg-white/15 border-white/15 hover:border-amber-400 hover:scale-[1.02]'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                        CITY 2
                      </span>
                      <h4 className="text-xl sm:text-2xl font-display font-black text-white leading-tight group-hover:text-amber-300">
                        {cityB?.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-semibold block truncate">
                        {cityB?.tag}
                      </span>
                    </div>

                    {/* Metric Display */}
                    <div className="pt-3">
                      {gameState === 'revealed' ? (
                        <div className="space-y-0.5 animate-fadeIn">
                          <span className="text-3xl sm:text-4xl font-display font-black text-amber-300">
                            {gameMode === 'cleaner' ? `AQI ${cityBData?.aqi}` : gameMode === 'windier' ? `${cityBData?.wind} km/h` : `${cityBData?.temp}°C`}
                          </span>
                          <div className="text-[11px] text-slate-300 font-bold">
                            {gameMode !== 'cleaner' && `AQI ${cityBData?.aqi} • `}
                            {gameMode !== 'windier' && `${cityBData?.wind} km/h`}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/10 p-2.5 rounded-2xl text-center font-black text-sm text-slate-300 border border-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                          TAP TO PICK 👆
                        </div>
                      )}
                    </div>
                  </button>

                </div>
              )}

              {/* Instant Punchline & Result Banner */}
              {gameState === 'revealed' && lastVerdict && (
                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center space-y-2 animate-fadeIn shadow-soft-lg">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">
                      {lastVerdict.isCorrect ? '🎉' : '💀'}
                    </span>
                    <h4 className="text-lg sm:text-xl font-display font-black text-white">
                      {lastVerdict.punchline}
                    </h4>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      lastVerdict.earnedPts >= 0 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'
                    }`}>
                      {lastVerdict.earnedPts >= 0 ? `+${lastVerdict.earnedPts} PTS` : `${lastVerdict.earnedPts} PTS`}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-300">
                    {lastVerdict.subtext}
                  </p>

                  <button
                    onClick={handleNextRound}
                    className="btn-press w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-sm py-3 rounded-xl shadow-glow-amber flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{roundNumber >= 10 ? "VIEW FINAL SCOREBOARD 🏁" : "NEXT ROUND ▶"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* B. GAME OVER / FINAL SCOREBOARD */}
          {/* ========================================================= */}
          {gameState === 'gameover' && (
            <div className="py-4 text-center space-y-4 my-auto animate-fadeIn">
              
              <div className="p-3 bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center text-4xl shadow-glow-amber">
                🏆
              </div>

              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                  DUEL COMPLETE
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mt-0.5">
                  {getFinalPlayerTitle().title}
                </h3>
                <p className="text-xs font-semibold text-slate-300 max-w-sm mx-auto mt-1">
                  "{getFinalPlayerTitle().desc}"
                </p>
              </div>

              {/* Scorecard Stats */}
              <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-3xl border border-white/10 max-w-md mx-auto text-xs font-black">
                <div className="bg-white/5 p-3.5 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block uppercase">FINAL SCORE</span>
                  <span className="text-3xl text-amber-300 font-display">{score}</span>
                </div>
                <div className="bg-white/5 p-3.5 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block uppercase">MAX STREAK</span>
                  <span className="text-3xl text-rose-400 font-display">{maxStreak}</span>
                </div>
              </div>

              {/* Replay Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    setRoundNumber(1);
                    setScore(0);
                    setStreak(0);
                    loadNewRound(gameMode);
                  }}
                  className="btn-press flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm py-3 rounded-2xl shadow-glow-amber flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>PLAY AGAIN 🔄</span>
                </button>
                <button
                  onClick={onClose}
                  className="btn-press bg-white/10 hover:bg-white/20 text-white font-black text-sm px-6 py-3 rounded-2xl cursor-pointer"
                >
                  EXIT ✖
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
