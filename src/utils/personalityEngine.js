// CleanAir India - Exhaustive Personality, Roast & Atmosphere Humor Engine
// Powered by Anti-Repetition Ring Buffer & Multi-Condition Combination Engine

import { antiRepetition } from './antiRepetitionEngine.js';
import { HUMOR_DATABASE } from './humorDatabase.js';

export const getRandomItem = (arr, categoryKey = 'general') => {
  if (!arr || arr.length === 0) return '';
  return antiRepetition.pick(arr, categoryKey);
};

// Rare random easter egg lines
export const RARE_EASTER_EGG_LINES = HUMOR_DATABASE.easter_eggs;

// Header taglines
export const HEADER_TAGLINES = [
  "What's the sky cooking today? ☁️",
  "Let's see what Mother Nature is doing.",
  "Today's atmospheric nonsense:",
  "Checking the sky so you don't have to look up.",
  "Your personal atmosphere reality check.",
  "Weather report: with opinions included."
];

// 🕐 Time-based Greetings
export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      title: "Good morning",
      subtitle: getRandomItem([
        "Good morning. Let’s see what’s trying to ruin your day.",
        "Morning report: the atmosphere has opinions.",
        "Wake up. The weather already did.",
        "Coffee in hand, clouds in the sky. Let's see the numbers.",
        "Early morning telemetry: the sun is getting ready."
      ], 'greeting_morning'),
      icon: "🌅",
      period: "morning"
    };
  }
  if (hour >= 12 && hour < 17) {
    return {
      title: "Good afternoon",
      subtitle: getRandomItem([
        "The sun is clocked in and showing off.",
        "Peak daytime nonsense detected.",
        "The weather is working overtime right now.",
        "Afternoon heating in full effect across the city.",
        "Direct solar radiation testing human willpower."
      ], 'greeting_afternoon'),
      icon: "☀️",
      period: "afternoon"
    };
  }
  if (hour >= 17 && hour < 21) {
    return {
      title: "Good evening",
      subtitle: getRandomItem([
        "The sun is logging off for the day.",
        "Evening atmospheric gossip incoming.",
        "Let’s see how the atmosphere wraps up today.",
        "Sunset vibes and evening breeze check.",
        "The stars are attempting to peer through the haze."
      ], 'greeting_evening'),
      icon: "🌇",
      period: "evening"
    };
  }
  return {
    title: "Night owl mode",
    subtitle: getRandomItem([
      "It’s late. The weather is still being dramatic.",
      "Checking the weather at this hour? Respect.",
      "The moon has taken over management.",
      "Everyone is sleeping except the atmosphere."
    ], 'greeting_night'),
    icon: "🌙",
    period: "night"
  };
};

// 🌎 Location-specific Roasting
export const getCityJudgment = (cityName, weather, aqi) => {
  const name = cityName || 'This city';
  const temp = Math.round(weather?.current?.temperature ?? 26);
  const aqiVal = Math.round(aqi?.aqi ?? 50);

  if (aqiVal >= 250) {
    return getRandomItem([
      `${name} WHAT ARE WE BREATHING? 💀`,
      `${name} air quality has entered the shadow realm.`,
      `Stay inside ${name}. The atmosphere is textured today.`,
      `${name} AQI is spicy enough to flavor a curry.`
    ], `judgment_severe_aqi_${name}`);
  }
  if (temp >= 38) {
    return getRandomItem([
      `${name} IS PREHEATED TO 200°C 🔥`,
      `The sun has a personal vendetta against ${name}.`,
      `${name}: outside is currently an air fryer.`,
      `${name} asphalt is ready for cooking breakfast.`
    ], `judgment_extreme_heat_${name}`);
  }
  if (temp <= 12) {
    return getRandomItem([
      `${name} has enabled Arctic DLC ❄️`,
      `${name} is in maximum blanket burrito mode.`,
      `Chilly breeze taking over ${name} streets.`
    ], `judgment_cold_${name}`);
  }

  return getRandomItem([
    `Atmospheric reality check for ${name} 📡`,
    `Live weather & lung conditions in ${name} 📍`,
    `What the sky is doing over ${name} right now ☁️`,
    `Satellite telemetry report for ${name} ✨`
  ], `judgment_normal_${name}`);
};

// 🌡️ Weather Roasts (Dynamic Combo aware)
export const getWeatherRoast = (weatherData, aqiData) => {
  const current = weatherData?.current || {};
  const temp = Math.round(current.temperature ?? 26);
  const humidity = Math.round(current.humidity ?? 50);
  const wind = Math.round(current.windSpeed ?? 10);
  const code = Number(current.weatherCode ?? 0);
  const aqiVal = Math.round(aqiData?.aqi ?? 50);

  // Combination Checks
  if (temp >= 33 && humidity >= 75) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.combos.heat_and_humidity, 'combo_heat_humidity'),
      tempNote: "Sauna protocol: maximum moisture and heat.",
      vibeTag: "Atmospheric Soup 🥟"
    };
  }

  if (temp >= 33 && aqiVal >= 150) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.combos.heat_and_bad_aqi, 'combo_heat_aqi'),
      tempNote: "Double trouble: hot sun & spicy smog.",
      vibeTag: "Smoked Barbecue 💀"
    };
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code) && wind >= 25) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.combos.rain_and_wind, 'combo_rain_wind'),
      tempNote: "Rain with strong wind: umbrella danger zone.",
      vibeTag: "Umbrella Doom ☔"
    };
  }

  if (temp >= 20 && temp <= 27 && aqiVal <= 45) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.combos.perfect_and_clean, 'combo_perfect'),
      tempNote: "Rare atmospheric W: clean air and crisp temp.",
      vibeTag: "10/10 Heaven ✨"
    };
  }

  // Pure Temperature Fallbacks
  if (temp >= 40) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.temperature.extreme_heat, 'temp_extreme_heat'),
      tempNote: "Extreme Heat Warning: stay hydrated indoors.",
      vibeTag: "Air Fryer 🔥"
    };
  }
  if (temp >= 35) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.temperature.very_hot, 'temp_very_hot'),
      tempNote: "High Heat: AC on full blast recommended.",
      vibeTag: "Toasty AF 🥵"
    };
  }
  if (temp <= 9) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.temperature.freezing, 'temp_freezing'),
      tempNote: "Freezing Cold: bundle up immediately.",
      vibeTag: "Arctic Mode 🥶"
    };
  }
  if (temp <= 18) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.temperature.chilly, 'temp_chilly'),
      tempNote: "Chilly breeze: sweater weather active.",
      vibeTag: "Hoodie Season 🧥"
    };
  }

  return {
    roast: getRandomItem(HUMOR_DATABASE.temperature.pleasant, 'temp_pleasant'),
    tempNote: "Comfortable conditions across the area.",
    vibeTag: "Chill Vibes 😎"
  };
};

// 🫁 AQI Roasts
export const getAQIRoast = (aqi) => {
  const val = Math.round(Number(aqi) || 50);

  if (val <= 50) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.aqi.good, 'aqi_good'),
      comment: "Pristine oxygen purity. Breathe freely.",
      badge: "Pure Oxygen 🌿"
    };
  }
  if (val <= 100) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.aqi.moderate, 'aqi_moderate'),
      comment: "Acceptable urban air. Standard operations.",
      badge: "Moderate Air 🌤️"
    };
  }
  if (val <= 149) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.aqi.sensitive, 'aqi_sensitive'),
      comment: "Mild particulate texture detected.",
      badge: "Slightly Spicy 🌶️"
    };
  }
  if (val <= 249) {
    return {
      roast: getRandomItem(HUMOR_DATABASE.aqi.unhealthy, 'aqi_unhealthy'),
      comment: "N95 mask strongly advised for outdoor trips.",
      badge: "Textured Air 💀"
    };
  }

  return {
    roast: getRandomItem(HUMOR_DATABASE.aqi.hazardous, 'aqi_hazardous'),
    comment: "Bunker mode: turn air purifiers to maximum power.",
    badge: "Biohazard Level ☠️"
  };
};

// 👆 Interactive Click Commentary
export const getClickRoast = (type, weather, aqi) => {
  const temp = Math.round(weather?.current?.temperature ?? 28);
  const aqiVal = Math.round(aqi?.aqi ?? 55);

  if (type === 'temp') {
    if (temp >= 35) return getRandomItem(HUMOR_DATABASE.temperature.very_hot, 'click_temp_hot');
    if (temp <= 12) return getRandomItem(HUMOR_DATABASE.temperature.freezing, 'click_temp_cold');
    return getRandomItem(HUMOR_DATABASE.temperature.pleasant, 'click_temp_pleasant');
  }

  if (type === 'aqi') {
    if (aqiVal >= 150) return getRandomItem(HUMOR_DATABASE.aqi.unhealthy, 'click_aqi_bad');
    return getRandomItem(HUMOR_DATABASE.aqi.good, 'click_aqi_good');
  }

  if (type === 'humidity') {
    return getRandomItem(HUMOR_DATABASE.sky.humidity, 'click_humidity');
  }

  if (type === 'wind') {
    return getRandomItem(HUMOR_DATABASE.sky.wind, 'click_wind');
  }

  return "Atmospheric reality verified! 📡";
};

// 🚶 Should I Go Out? Decision Engine
export const getShouldIGoOut = (weatherData, aqiData) => {
  const temp = Math.round(weatherData?.current?.temperature ?? 26);
  const aqiVal = Math.round(aqiData?.aqi ?? 50);
  const code = Number(weatherData?.current?.weatherCode ?? 0);
  const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);

  if (aqiVal >= 200) {
    return {
      status: "NO — STAY HOME 💀",
      color: "bg-rose-500 text-white",
      reason: `AQI is ${aqiVal}. Your lungs will thank you for staying indoors.`,
      emoji: "😷"
    };
  }
  if (temp >= 38) {
    return {
      status: "NO — OVEN OUTSIDE 🔥",
      color: "bg-orange-500 text-white",
      reason: `${temp}°C detected. The sun is in aggressive interrogation mode.`,
      emoji: "🫠"
    };
  }
  if (isRain) {
    return {
      status: "TACTICAL ONLY ☔",
      color: "bg-blue-500 text-white",
      reason: "Rain active. Deploy umbrella and waterproof shoes before leaving.",
      emoji: "🌧️"
    };
  }
  if (aqiVal <= 50 && temp >= 20 && temp <= 29) {
    return {
      status: "YES — PERFECT DAY 🎉",
      color: "bg-emerald-500 text-slate-950 font-black",
      reason: `Temp ${temp}°C and clean AQI ${aqiVal}. Touch grass authorized!`,
      emoji: "😎"
    };
  }

  return {
    status: "YES — ALL CLEAR 👍",
    color: "bg-emerald-500/20 text-emerald-800 border border-emerald-300 font-bold",
    reason: "Conditions are normal and safe for everyday activities.",
    emoji: "🚶"
  };
};

// Today's Vibe helper
export const getTodaysVibe = (weatherData, aqiData) => {
  const roast = getWeatherRoast(weatherData, aqiData);
  return {
    title: roast.roast,
    emoji: roast.vibeTag.split(' ').pop() || '✨',
    tag: roast.vibeTag
  };
};

// Roast Scale helper
export const getRoastScale = (weatherData, aqiData) => {
  const temp = Math.round(weatherData?.current?.temperature ?? 26);
  let currentTier = 2;
  if (temp >= 38) currentTier = 4;
  else if (temp >= 32) currentTier = 3;
  else if (temp <= 12) currentTier = 0;

  return {
    currentTier,
    tiers: [
      { id: 'frozen', title: 'Frozen', emoji: '🥶', color: 'bg-blue-500', barColor: 'bg-blue-600', explanation: 'Arctic conditions detected.' },
      { id: 'chilly', title: 'Chilly', emoji: '🧥', color: 'bg-sky-500', barColor: 'bg-sky-600', explanation: 'Sweater weather active.' },
      { id: 'chill', title: 'Chill', emoji: '😎', color: 'bg-emerald-500', barColor: 'bg-emerald-600', explanation: 'Pleasant atmospheric state.' },
      { id: 'toasty', title: 'Toasty', emoji: '🥵', color: 'bg-amber-500', barColor: 'bg-amber-600', explanation: 'High heat warning.' },
      { id: 'volcano', title: 'Volcanic', emoji: '💀', color: 'bg-rose-500', barColor: 'bg-rose-600', explanation: 'Industrial air fryer mode.' }
    ]
  };
};

// Micro Snippets
export const getMicroSnippets = (weatherData) => {
  const current = weatherData?.current || {};
  const humidity = Math.round(current.humidity ?? 50);
  const wind = Math.round(current.windSpeed ?? 10);

  return {
    humidityNote: humidity >= 75 ? "Heavy moisture in the air" : humidity <= 35 ? "Dry air" : "Comfortable moisture",
    windNote: wind >= 25 ? "Breezy / gusty" : wind <= 8 ? "Calm breeze" : "Gentle wind"
  };
};
