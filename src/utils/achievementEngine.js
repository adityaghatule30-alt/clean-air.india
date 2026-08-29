// CleanAir India - Achievement & Passport Progression Engine
// Tracks milestones, passport stamps, and level XP in localStorage

const ACHIEVEMENTS_KEY = 'cleanair_achievements_v1';
const PASSPORT_KEY = 'cleanair_passport_v1';
const STATS_KEY = 'cleanair_stats_v1';

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_forecast',
    title: 'First Forecast 🌤️',
    description: 'Checked your very first location.',
    icon: '🧭',
    xp: 50,
    check: (stats, weather, aqi, loc) => stats.checksCount >= 1
  },
  {
    id: 'heat_survivor',
    title: 'Heat Survivor 🔥',
    description: 'Checked a location with temperature above 38°C.',
    icon: '🫠',
    xp: 100,
    check: (stats, weather, aqi, loc) => (weather?.current?.temperature ?? 0) >= 38
  },
  {
    id: 'rain_enjoyer',
    title: 'Rain Enjoyer ☔',
    description: 'Checked weather during active rain or drizzle.',
    icon: '🌧️',
    xp: 100,
    check: (stats, weather, aqi, loc) => [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(Number(weather?.current?.weatherCode ?? 0))
  },
  {
    id: 'aqi_warrior',
    title: 'AQI Warrior 💀',
    description: 'Checked a location with AQI above 180.',
    icon: '😷',
    xp: 150,
    check: (stats, weather, aqi, loc) => (aqi?.aqi ?? 0) >= 180
  },
  {
    id: 'fresh_air_gang',
    title: 'Fresh Air Gang 🌿',
    description: 'Found a location with pristine clean air (AQI ≤ 50).',
    icon: '🌱',
    xp: 150,
    check: (stats, weather, aqi, loc) => (aqi?.aqi ?? 999) <= 50
  },
  {
    id: 'sub_zero',
    title: 'Frozen Dimension ❄️',
    description: 'Checked a location below 10°C.',
    icon: '🥶',
    xp: 120,
    check: (stats, weather, aqi, loc) => (weather?.current?.temperature ?? 20) <= 10
  },
  {
    id: 'map_hoarder',
    title: 'Map Hoarder 🗺️',
    description: 'Explored 6 or more unique cities.',
    icon: '📍',
    xp: 200,
    check: (stats) => (stats.uniqueCities?.length || 0) >= 6
  },
  {
    id: 'forecast_addict',
    title: 'Forecast Addict 🎯',
    description: 'Checked the atmosphere 5+ times in one session.',
    icon: '⚡',
    xp: 150,
    check: (stats) => stats.checksCount >= 5
  }
];

export const getStoredStats = () => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { checksCount: 0, uniqueCities: [], uniqueCountries: [], gameStreak: 0 };
    return JSON.parse(raw);
  } catch (e) {
    return { checksCount: 0, uniqueCities: [], uniqueCountries: [], gameStreak: 0 };
  }
};

export const saveStats = (stats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {}
};

export const getUnlockedAchievements = () => {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const unlockAchievement = (id) => {
  try {
    const unlocked = getUnlockedAchievements();
    if (!unlocked.includes(id)) {
      const updated = [...unlocked, id];
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
      return ACHIEVEMENTS_LIST.find(a => a.id === id);
    }
    return null;
  } catch (e) {
    return null;
  }
};

// Check all achievements against current state and return newly unlocked ones
export const evaluateAchievements = (weather, aqi, location) => {
  if (!location) return [];
  const stats = getStoredStats();
  
  // Update stats
  stats.checksCount = (stats.checksCount || 0) + 1;
  const cityName = location.name || 'Unknown';
  if (!stats.uniqueCities) stats.uniqueCities = [];
  if (!stats.uniqueCities.includes(cityName)) {
    stats.uniqueCities.push(cityName);
  }
  const countryName = location.country || 'India';
  if (!stats.uniqueCountries) stats.uniqueCountries = [];
  if (!stats.uniqueCountries.includes(countryName)) {
    stats.uniqueCountries.push(countryName);
  }
  saveStats(stats);

  // Add to passport
  addPassportStamp(location, weather, aqi);

  const newlyUnlocked = [];
  const currentlyUnlocked = getUnlockedAchievements();

  for (const ach of ACHIEVEMENTS_LIST) {
    if (!currentlyUnlocked.includes(ach.id)) {
      if (ach.check(stats, weather, aqi, location)) {
        const item = unlockAchievement(ach.id);
        if (item) newlyUnlocked.push(item);
      }
    }
  }

  return newlyUnlocked;
};

// Passport Stamps
export const getPassportStamps = () => {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const addPassportStamp = (location, weather, aqi) => {
  if (!location || !location.name) return;
  try {
    const stamps = getPassportStamps();
    const existingIdx = stamps.findIndex(s => s.name === location.name);
    
    const newStamp = {
      name: location.name,
      admin1: location.admin1 || '',
      country: location.country || 'India',
      temp: Math.round(weather?.current?.temperature ?? 26),
      aqi: Math.round(aqi?.aqi ?? 50),
      weatherCode: weather?.current?.weatherCode ?? 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    };

    let updated = [];
    if (existingIdx >= 0) {
      stamps[existingIdx] = newStamp;
      updated = stamps;
    } else {
      updated = [newStamp, ...stamps].slice(0, 15);
    }
    localStorage.setItem(PASSPORT_KEY, JSON.stringify(updated));
  } catch (e) {}
};

// Calculate user level profile
export const getUserProfile = () => {
  const unlocked = getUnlockedAchievements();
  const stats = getStoredStats();
  
  let totalXp = 0;
  for (const id of unlocked) {
    const item = ACHIEVEMENTS_LIST.find(a => a.id === id);
    if (item) totalXp += item.xp;
  }
  totalXp += (stats.checksCount || 0) * 10;
  
  const level = Math.max(1, Math.floor(totalXp / 100) + 1);
  const nextLevelXp = level * 100;
  const currentLevelProgress = totalXp % 100;

  return {
    level,
    totalXp,
    currentLevelProgress,
    nextLevelXp,
    unlockedCount: unlocked.length,
    totalAchievements: ACHIEVEMENTS_LIST.length,
    citiesVisited: stats.uniqueCities?.length || 1,
    checksCount: stats.checksCount || 1,
    gameStreak: stats.gameStreak || 0
  };
};
