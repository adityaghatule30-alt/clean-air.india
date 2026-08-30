import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AtmosphereHero from './components/AtmosphereHero';
import WeatherCard from './components/WeatherCard';
import HeroAQI from './components/HeroAQI';
import TodayVsYesterday from './components/TodayVsYesterday';
import IndiaLeaderboard from './components/IndiaLeaderboard';
import ForecastStrip from './components/ForecastStrip';
import CityGroupChat from './components/CityGroupChat';
import LocationModal from './components/LocationModal';
import CityFaceOff from './components/CityFaceOff';
import MiniGameModal from './components/MiniGameModal';
import AchievementModal from './components/AchievementModal';
import InfoModal from './components/InfoModal';
import WhyExplanationModal from './components/WhyExplanationModal';
import AdSlot from './components/AdSlot';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import AtmosphericParticles from './components/AtmosphericParticles';

import { fetchWeatherData } from './api/weatherApi';
import { fetchAirQualityData } from './api/aqiApi';
import { reverseGeocodeCoords, searchCities } from './api/geocodingApi';
import { POPULAR_INDIAN_CITIES } from './utils/comicQuotes';
import { soundFX } from './utils/audioFX';
import { getTimeBasedGreeting } from './utils/personalityEngine';
import { getLocalBanter } from './utils/localBanterEngine';
import { interpretWeatherCode } from './utils/aqiHelpers';
import { addRecentLocation } from './utils/locationStorage';
import { evaluateAchievements } from './utils/achievementEngine';
import { weatherCommentary } from './utils/weatherCommentaryEngine';
import confetti from 'canvas-confetti';
import { Sparkles, MessageCircle, Trophy, Share2, Info, ShieldCheck, FileText, Database, Mail, HelpCircle, Lock } from 'lucide-react';

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

  // Humor Intensity Mode: 'light' | 'sarcastic' | 'dark'
  const [humorMode, setHumorMode] = useState(() => weatherCommentary.getHumorMode());
  
  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isBattleOpen, setIsBattleOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState('about');
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [whyMetric, setWhyMetric] = useState('temperature');
  
  const [floatingToast, setFloatingToast] = useState(null);

  // Tracking user location switches & checks for rare easter eggs
  const locationSwitchCount = useRef(0);
  const checkCountPerCity = useRef({});
  const hasParsedInitialUrl = useRef(false);

  // Trigger floating toast
  const triggerToast = (text, isTrophy = false) => {
    setFloatingToast({ text, isTrophy });
    setTimeout(() => setFloatingToast(null), 3500);
  };

  // Main data fetcher with cache support
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

  // Initial URL Parameter & Hash Parsing (City URLs + Info Pages)
  useEffect(() => {
    if (hasParsedInitialUrl.current) return;
    hasParsedInitialUrl.current = true;

    const parseUrl = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();

      // Check info page hash routes e.g. #about, #privacy, #terms, #contact, #data-sources
      if (hash.includes('about')) {
        setInfoModalTab('about');
        setIsInfoModalOpen(true);
      } else if (hash.includes('privacy')) {
        setInfoModalTab('privacy');
        setIsInfoModalOpen(true);
      } else if (hash.includes('terms')) {
        setInfoModalTab('terms');
        setIsInfoModalOpen(true);
      } else if (hash.includes('contact')) {
        setInfoModalTab('contact');
        setIsInfoModalOpen(true);
      } else if (hash.includes('data-sources') || hash.includes('datasources')) {
        setInfoModalTab('data-sources');
        setIsInfoModalOpen(true);
      }

      // Check city query or hash param e.g. ?city=delhi or #/city/delhi
      const cityQuery = searchParams.get('city') || (hash.startsWith('#/city/') ? hash.replace('#/city/', '') : null);

      if (cityQuery) {
        const cleanQuery = decodeURIComponent(cityQuery).trim().toLowerCase();
        
        // 1. Check popular cities
        const match = POPULAR_INDIAN_CITIES.find(c => c.name.toLowerCase() === cleanQuery || (c.state && c.state.toLowerCase() === cleanQuery));
        if (match) {
          setCurrentCity(match);
          return;
        }

        // 2. Geocode query
        try {
          const results = await searchCities(cleanQuery);
          if (results && results.length > 0) {
            const first = results[0];
            const resolvedCity = {
              name: first.name,
              admin1: first.admin1 || '',
              country: first.country || 'India',
              lat: Number(first.lat),
              lon: Number(first.lon),
              timezone: first.timezone || 'auto',
              tag: 'Shared City 🔗'
            };
            setCurrentCity(resolvedCity);
          }
        } catch (e) {
          console.warn("Could not resolve URL city:", e);
        }
      }
    };

    parseUrl();
  }, []);

  // Load when currentCity changes & set 10-minute auto refresh interval
  useEffect(() => {
    if (currentCity) {
      loadDashboardData(currentCity);

      // Update URL query & document title dynamically
      try {
        const cityParam = encodeURIComponent(currentCity.name.toLowerCase());
        const newUrl = `${window.location.pathname}?city=${cityParam}`;
        window.history.replaceState(null, '', newUrl);
        document.title = `${currentCity.name} Weather & Air Quality (AQI) | CleanAir India 🌤️`;

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', `Live weather, temperature, US EPA AQI air quality telemetry and local atmosphere forecast for ${currentCity.name}, ${currentCity.admin1 || currentCity.country}.`);
        }
      } catch (e) {}

      const autoRefresh = setInterval(() => {
        loadDashboardData(currentCity, false);
      }, 10 * 60 * 1000); // 10 minutes
      return () => clearInterval(autoRefresh);
    }
  }, [currentCity, loadDashboardData]);

  // Handle Humor Intensity change
  const handleChangeHumorMode = (mode) => {
    setHumorMode(mode);
    weatherCommentary.setHumorMode(mode);
    const label = mode === 'light' ? 'Light 🙂 (Wholesome)' : mode === 'dark' ? 'Dark 💀 (Deadpan & sarcastic)' : 'Sarcastic 😏 (Classic)';
    triggerToast(`Humor set to ${label}`);
  };

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
    triggerToast("Scanning GPS coordinates... 🛰️");
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

  // 1-Click Share City URL (Web Share API + Clipboard Fallback)
  const handleShareCity = async () => {
    if (!currentCity) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?city=${encodeURIComponent(currentCity.name.toLowerCase())}`;
    const shareTitle = `${currentCity.name} Weather & Air Quality | CleanAir India 🌤️`;
    const shareText = `Check today's live temperature, AQI, and atmospheric gossip for ${currentCity.name}!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        triggerToast("Forecast shared! 🚀");
        return;
      } catch (err) {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      triggerToast(`Link copied! Share today's ${currentCity.name} forecast 🔗`);
    } catch (err) {
      triggerToast(`Share URL: ${shareUrl}`);
    }
  };

  // Open Info modal with specific tab
  const handleOpenInfo = (tab = 'about') => {
    setInfoModalTab(tab);
    setIsInfoModalOpen(true);
  };

  // Open Why Explanation Modal
  const handleOpenWhy = (metric = 'temperature') => {
    setWhyMetric(metric);
    setIsWhyModalOpen(true);
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
        
        {/* Header with Greeting, Location Chip, Humor Mode & Toolbar */}
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
          onOpenWhy={handleOpenWhy}
          onShareCity={handleShareCity}
          onEasterEgg={(msg) => triggerToast(msg)}
          humorMode={humorMode}
          onChangeHumorMode={handleChangeHumorMode}
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

            {/* 2. Today vs Yesterday Comparison (Real 24h Delta) */}
            <TodayVsYesterday
              weatherData={weatherData}
              aqiData={aqiData}
              onOpenWhy={handleOpenWhy}
            />

            {/* 3. Main Weather Section with Telemetry & Interactive Roasts */}
            <WeatherCard
              weatherData={weatherData}
              aqiData={aqiData}
              currentCity={currentCity}
              onMetricClick={handleMetricClick}
            />

            {/* 4. Clean Air Quality Section with Dynamic US EPA Scale & Mascot */}
            <HeroAQI
              aqiData={aqiData}
              cityName={currentCity?.name}
              onMascotPoke={handleMascotPoke}
            />

            {/* 5. India Atmospheric Leaderboard (National Extremes from Monitored Cities) */}
            <IndiaLeaderboard
              onSelectCity={handleSelectLocation}
            />

            {/* Non-intrusive AdSlot Container (Partner/Sponsorship Zone) */}
            <AdSlot slotId="mid_content" />

            {/* 6. 24-Hour Forecast Timeline with Micro-Stories */}
            <ForecastStrip
              forecastHours={weatherData?.forecast24h || []}
            />

            {/* 7. City Group Chat — Atmospheric Gossip & Top Rankings */}
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

      {/* "Why Is This Happening?" Scientific Atmosphere Explainer Modal */}
      <WhyExplanationModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        initialMetric={whyMetric}
        weatherData={weatherData}
        aqiData={aqiData}
      />

      {/* Trust & Information Hub Modal (About, Privacy, Terms, Data Sources, Contact) */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        initialTab={infoModalTab}
      />

      {/* Clean, Trustworthy & Monetization-Ready Modern Footer */}
      <footer className="mt-12 bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-8 px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Top Footer Row: Branding & Trust Statement */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-xl">🌤️</span>
                <span className="font-display font-black text-slate-900 text-base">CleanAir India</span>
                <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  Open Meteorological Telemetry
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1 max-w-xl">
                Real-time weather, US EPA standard air quality, national leaderboards, city chat, and climate games. Real API telemetry paired with creative cultural satire.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareCity}
                className="btn-press bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs px-3.5 py-2 rounded-xl shadow-soft-sm flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share Forecast 🔗</span>
              </button>
            </div>
          </div>

          {/* Simple, Honest User-Facing Privacy Disclaimer */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1 font-black text-slate-800 mr-1">
              <Lock className="w-3.5 h-3.5 text-indigo-600 inline" />
              Privacy Notice:
            </span>
            CleanAir India does not currently store your searched locations or create a location history. Weather and air-quality data is provided by external data providers (Open-Meteo). See our{' '}
            <button
              onClick={() => handleOpenInfo('privacy')}
              className="text-indigo-600 hover:text-indigo-800 font-black underline cursor-pointer"
            >
              Privacy Policy
            </button>{' '}
            for full transparency.
          </div>

          {/* Navigation Links: About | Privacy | Terms | Data Sources | Contact */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center md:justify-between gap-3 text-xs font-black text-slate-600">
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={() => handleOpenInfo('about')}
                className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>About</span>
              </button>

              <button
                onClick={() => handleOpenInfo('privacy')}
                className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy Policy</span>
              </button>

              <button
                onClick={() => handleOpenInfo('terms')}
                className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Terms & Disclaimer</span>
              </button>

              <button
                onClick={() => handleOpenInfo('data-sources')}
                className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Data Sources</span>
              </button>

              <button
                onClick={() => handleOpenInfo('contact')}
                className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact</span>
              </button>
            </nav>

            <div className="text-[11px] text-slate-400 font-bold text-center">
              <span>Data: Open-Meteo • US EPA Standard • © 2026 CleanAir India</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
