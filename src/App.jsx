import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AtmosphereHero from './components/AtmosphereHero';
import WeatherCard from './components/WeatherCard';
import HeroAQI from './components/HeroAQI';
import ForecastStrip from './components/ForecastStrip';
import CityGroupChat from './components/CityGroupChat';
import LocationModal from './components/LocationModal';
import CityFaceOff from './components/CityFaceOff';
import MiniGameModal from './components/MiniGameModal';
import AchievementModal from './components/AchievementModal';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import AtmosphericParticles from './components/AtmosphericParticles';

import { fetchWeatherData } from './api/weatherApi';
import { fetchAirQualityData } from './api/aqiApi';
import { reverseGeocodeCoords } from './api/geocodingApi';
import { POPULAR_INDIAN_CITIES } from './utils/comicQuotes';
import { soundFX } from './utils/audioFX';
import { getTimeBasedGreeting } from './utils/personalityEngine';
import { getLocalBanter } from './utils/localBanterEngine';
import { interpretWeatherCode } from './utils/aqiHelpers';
import { addRecentLocation } from './utils/locationStorage';
import { evaluateAchievements } from './utils/achievementEngine';
import confetti from 'canvas-confetti';
import { Sparkles, MessageCircle, Trophy } from 'lucide-react';

export default function App() {
  // Default to Mumbai
  const [currentCity, setCurrentCity] = useState(POPULAR_INDIAN_CITIES[3]); // Mumbai
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  
  // Sound OFF by default
  const [soundEffectsOn, setSoundEffectsOn] = useState(false);
  
  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isBattleOpen, setIsBattleOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  
  const [floatingToast, setFloatingToast] = useState(null);

  // Tracking user location switches & checks for rare easter eggs
  const locationSwitchCount = useRef(0);
  const checkCountPerCity = useRef({});

  // Trigger floating toast
  const triggerToast = (text, isTrophy = false) => {
    setFloatingToast({ text, isTrophy });
    setTimeout(() => setFloatingToast(null), 3500);
  };

  // Main data fetcher
  const loadDashboardData = useCallback(async (city, isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
      triggerToast("Asking the clouds for data... ☁️");
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      if (soundEffectsOn) soundFX.playWhoosh();

      const [wData, aData] = await Promise.all([
        fetchWeatherData(city.lat, city.lon, isManualRefresh),
        fetchAirQualityData(city.lat, city.lon, isManualRefresh)
      ]);

      setWeatherData(wData);
      setAqiData(aData);

      // Evaluate achievements
      const newUnlocks = evaluateAchievements(wData, aData, city);
      if (newUnlocks && newUnlocks.length > 0) {
        newUnlocks.forEach(ach => {
          triggerToast(`🏆 ACHIEVEMENT UNLOCKED: ${ach.title} (+${ach.xp} XP)`, true);
          try {
            confetti({ particleCount: 35, spread: 70, origin: { y: 0.2 } });
          } catch (e) {}
        });
      }

      if (isManualRefresh) {
        triggerToast("The clouds have responded! ✨");
        if (soundEffectsOn) soundFX.playPop();
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError({
        type: 'general',
        message: err.message || "The atmosphere isn't answering right now. 😭"
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [soundEffectsOn]);

  // Load when currentCity changes & set 10-minute auto refresh interval
  useEffect(() => {
    if (currentCity) {
      loadDashboardData(currentCity);
      const autoRefresh = setInterval(() => {
        loadDashboardData(currentCity, false);
      }, 10 * 60 * 1000); // 10 minutes
      return () => clearInterval(autoRefresh);
    }
  }, [currentCity, loadDashboardData]);

  // Dynamic reaction when selecting a new location
  const handleSelectLocation = (cityObj) => {
    if (soundEffectsOn) soundFX.playZap();
    
    const formattedCity = {
      name: cityObj.name,
      admin1: cityObj.admin1 || '',
      country: cityObj.country || 'India',
      lat: Number(cityObj.lat),
      lon: Number(cityObj.lon),
      timezone: cityObj.timezone || 'auto',
      tag: cityObj.tag || 'Discovered Spot 🗺️'
    };

    locationSwitchCount.current += 1;
    checkCountPerCity.current[formattedCity.name] = (checkCountPerCity.current[formattedCity.name] || 0) + 1;

    addRecentLocation(formattedCity);
    setCurrentCity(formattedCity);

    // Rare Easter Egg Triggers
    if (locationSwitchCount.current >= 4 && locationSwitchCount.current % 4 === 0) {
      triggerToast("Bro is touring India through the weather app. 🚀");
    } else if (checkCountPerCity.current[formattedCity.name] >= 3) {
      triggerToast(`You checked ${formattedCity.name} 3+ times. We KNOW you're not going outside! 😭`);
    } else {
      const localMsg = getLocalBanter(formattedCity, weatherData, aqiData, 'greeting');
      triggerToast(`📍 ${formattedCity.name}: ${localMsg.text}`);
    }
  };

  // Handle "Where am I?!" Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError({
        type: 'general',
        message: "Geolocation is not supported by your browser."
      });
      return;
    }

    setIsLocating(true);
    triggerToast("Where the heck are you... scanning GPS 🛰️");
    if (soundEffectsOn) soundFX.playZap();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const locInfo = await reverseGeocodeCoords(latitude, longitude);
          const detectedCity = {
            name: locInfo.name,
            admin1: locInfo.admin1,
            country: locInfo.country,
            lat: latitude,
            lon: longitude,
            timezone: "auto",
            tag: "Current Location 📍"
          };
          addRecentLocation(detectedCity);
          setCurrentCity(detectedCity);
          triggerToast(`Found you in ${locInfo.name}! 🎯`);
          if (soundEffectsOn) soundFX.playPop();
        } catch (err) {
          const fallbackCity = {
            name: "Your Location",
            lat: latitude,
            lon: longitude,
            timezone: "auto",
            tag: "GPS Location 📍"
          };
          addRecentLocation(fallbackCity);
          setCurrentCity(fallbackCity);
          triggerToast("Found your coordinates! 🎯");
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        console.warn("Geolocation denied:", geoErr);
        setIsLocating(false);
        setError({
          type: 'geo_denied',
          message: geoErr.message || "Location access was denied."
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle Sound Effects
  const toggleSoundEffects = () => {
    const nextVal = !soundEffectsOn;
    setSoundEffectsOn(nextVal);
    soundFX.enabled = nextVal;
    if (nextVal) soundFX.playPop();
    triggerToast(nextVal ? "Sound effects enabled 🔊" : "Sound effects muted 🤫");
  };

  const handleMascotPoke = () => {
    if (soundEffectsOn) soundFX.playPop();
    triggerToast("Mascot poked! 💥");
  };

  const handleMetricClick = (type) => {
    if (soundEffectsOn) soundFX.playPop();
  };

  // Dynamic atmospheric background class
  const weatherCode = weatherData?.current?.weatherCode ?? 0;
  const weatherInfo = interpretWeatherCode(weatherCode);
  const greeting = getTimeBasedGreeting();

  const getAtmosphereBgClass = () => {
    if (greeting.period === 'night') return 'bg-atmosphere-night';
    if (greeting.period === 'evening') return 'bg-atmosphere-sunset';
    if (weatherInfo.theme === 'rainy' || weatherInfo.theme === 'stormy') return 'bg-atmosphere-rainy';
    if (weatherInfo.theme === 'cloudy') return 'bg-atmosphere-cloudy';
    return 'bg-atmosphere-sunny';
  };

  return (
    <div className={`min-h-screen text-slate-900 transition-colors duration-700 flex flex-col justify-between relative overflow-x-hidden ${getAtmosphereBgClass()}`}>
      
      {/* Ambient Atmospheric Particles (Rain / Sunbeams) */}
      <AtmosphericParticles weatherCode={weatherCode} aqi={aqiData?.aqi} />

      {/* Floating Modern Toast Notification */}
      {floatingToast && (
        <div className={`fixed top-6 right-6 z-50 backdrop-blur-md font-black text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-soft-xl flex items-center gap-2.5 animate-bounce border max-w-sm sm:max-w-md ${
          floatingToast.isTrophy
            ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-glow-amber'
            : 'bg-slate-900/95 text-white border-white/20'
        }`}>
          {floatingToast.isTrophy ? (
            <Trophy className="w-5 h-5 text-slate-950 shrink-0 animate-bounce" />
          ) : (
            <MessageCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="leading-snug">{floatingToast.text}</span>
        </div>
      )}

      {/* Main App Container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 relative z-10">
        
        {/* Header with Greeting, Location Chip & Trophy/Game Toolbar */}
        <Header
          currentCity={currentCity}
          weatherData={weatherData}
          aqiData={aqiData}
          onRefresh={() => loadDashboardData(currentCity, true)}
          isRefreshing={isRefreshing}
          soundEffectsOn={soundEffectsOn}
          toggleSoundEffects={toggleSoundEffects}
          onOpenBattle={() => setIsBattleOpen(true)}
          onOpenLocationPicker={() => setIsLocationModalOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenGame={() => setIsGameOpen(true)}
          onEasterEgg={(msg) => triggerToast(msg)}
        />

        {/* Floating Search & Location Hotspots */}
        <SearchBar
          currentCity={currentCity}
          onSelectCity={handleSelectLocation}
          onLocateMe={handleLocateMe}
          isLocating={isLocating}
          onOpenBrowseModal={() => setIsLocationModalOpen(true)}
        />

        {/* Dynamic Body Content */}
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorScreen
            errorType={error.type}
            errorMessage={error.message}
            onRetry={() => loadDashboardData(currentCity)}
            onSelectCity={handleSelectLocation}
          />
        ) : (
          <main className="space-y-6">
            
            {/* 1. Unified Atmosphere Intelligence Hero (Vibe Score, Mood, Banter & Quick Action Launchpad) */}
            <AtmosphereHero
              weatherData={weatherData}
              aqiData={aqiData}
              currentCity={currentCity}
              onPlayGame={() => setIsGameOpen(true)}
              onOpenBattle={() => setIsBattleOpen(true)}
            />

            {/* 2. Main Weather Section with Telemetry & Interactive Roasts */}
            <WeatherCard
              weatherData={weatherData}
              aqiData={aqiData}
              currentCity={currentCity}
              onMetricClick={handleMetricClick}
            />

            {/* 3. Clean Air Quality Section with Pollutant Breakdown & Mascot */}
            <HeroAQI
              aqiData={aqiData}
              cityName={currentCity?.name}
              onMascotPoke={handleMascotPoke}
            />

            {/* 4. 24-Hour Forecast Timeline with Micro-Stories */}
            <ForecastStrip
              forecastHours={weatherData?.forecast24h || []}
            />

            {/* 5. City Group Chat — Atmospheric Gossip & Top Rankings */}
            <CityGroupChat
              onSelectCity={handleSelectLocation}
            />

          </main>
        )}

      </div>

      {/* Mini-Game Modal (Hotter or Not?) */}
      <MiniGameModal
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        weatherData={weatherData}
        aqiData={aqiData}
        currentCity={currentCity}
      />

      {/* Trophy Room & Climate Passport Modal */}
      <AchievementModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      {/* Playful Full Location Hub Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentCity={currentCity}
        onSelectLocation={handleSelectLocation}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />

      {/* City Atmosphere Comparison Modal (City Battle / Smog Clash) */}
      <CityFaceOff
        isOpen={isBattleOpen}
        onClose={() => setIsBattleOpen(false)}
      />

      {/* Clean Modern Footer */}
      <footer className="mt-12 bg-white/80 backdrop-blur-md border-t border-slate-200/60 py-6 px-4 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500 font-bold">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900">CleanAir India 🌤️</span>
            <span>•</span>
            <span>Worldwide telemetry, Vibe Scores, Mini-Games & Trophy Progression</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Level {evaluateAchievements(weatherData, aqiData, currentCity)?.length ? 'Up!' : 'Active'} • Live
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
