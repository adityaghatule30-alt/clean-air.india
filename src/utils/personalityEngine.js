// CleanAir India - Exhaustive Personality, Roast & Atmosphere Humor Engine
// Powered by Anti-Repetition Ring Buffer, Multi-Condition Combination Engine & WeatherCommentaryEngine

import { antiRepetition } from './antiRepetitionEngine.js';
import { HUMOR_DATABASE } from './humorDatabase.js';
import { weatherCommentary } from './weatherCommentaryEngine.js';

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
      `Hot pavement and air conditioning prayers in ${name}.`,
      `${name} detected: heatwave boss fight in progress.`
    ], `judgment_hot_${name}`);
  }
  if (temp <= 12) {
    return getRandomItem([
      `${name} IS FREEZING BRISK 🥶`,
      `Chai and blanket protocol mandatory in ${name}.`,
      `Winter has cornered ${name} completely.`
    ], `judgment_cold_${name}`);
  }
  return getRandomItem([
    `Atmosphere report for ${name} 📍`,
    `${name} weather is currently doing things.`,
    `Telemetry synced for ${name} 🌤️`,
    `Today's atmospheric vibe in ${name}:`
  ], `judgment_general_${name}`);
};

// 🌡️ Weather Roasts (Dynamic Multi-Condition & Telemetry Aware)
export const getWeatherRoast = (weatherData, aqiData, currentCity) => {
  const summary = weatherCommentary.getAtmosphereSummary(weatherData, aqiData, currentCity);
  return {
    roast: summary.roast,
    tempNote: summary.subtext,
    vibeTag: summary.badge,
    title: summary.title,
    emoji: summary.emoji,
    severity: summary.severity
  };
};

// 🫁 AQI Roasts
export const getAQIRoast = (aqi) => {
  const res = weatherCommentary.getAQICommentary(aqi);
  const val = Math.round(Number(aqi) || 50);
  let comment = "Air quality is normal.";
  if (val <= 50) comment = "Pristine oxygen purity. Breathe freely! 🌿";
  else if (val <= 100) comment = "Acceptable urban air. Lungs operating nominally.";
  else if (val <= 150) comment = "Mild particulate texture detected. Sensitive groups beware.";
  else if (val <= 200) comment = "N95 mask recommended for outdoor activity.";
  else if (val <= 300) comment = "Spicy atmospheric smog. Limit outdoor exposure.";
  else comment = "🚨 Health Alert: Serious hazardous particulate pollution.";

  return {
    roast: res.roast,
    comment,
    badge: res.label
  };
};

// 👆 Interactive Click Commentary
export const getClickRoast = (type, weather, aqi) => {
  const current = weather?.current || {};
  const temp = Math.round(current.temperature ?? 28);
  const apparent = Math.round(current.apparentTemp ?? temp);
  const humidity = Math.round(current.humidity ?? 50);
  const wind = Math.round(current.windSpeed ?? 10);
  const uv = Number(current.uvIndex ?? 0);
  const aqiVal = Math.round(aqi?.aqi ?? 55);

  if (type === 'temp') {
    return weatherCommentary.getFeelsLikeExplanation(temp, apparent, humidity, wind);
  }

  if (type === 'aqi') {
    const res = weatherCommentary.getAQICommentary(aqiVal);
    return res.roast;
  }

  if (type === 'humidity') {
    return weatherCommentary.getHumidityCommentary(humidity);
  }

  if (type === 'wind') {
    return weatherCommentary.getWindCommentary(wind);
  }

  if (type === 'uv') {
    return weatherCommentary.getUVCommentary(uv);
  }

  return "Atmospheric reality verified! 📡";
};

// 🚶 Should I Go Out? Decision Engine
export const getShouldIGoOut = (weatherData, aqiData) => {
  const current = weatherData?.current || {};
  const temp = Math.round(current.temperature ?? 26);
  const aqiVal = Math.round(aqiData?.aqi ?? 50);
  const code = Number(current.weatherCode ?? 0);
  const precipitation = Number(current.precipitation ?? 0);
  const isRain = precipitation > 0.2 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);

  if (aqiVal >= 250) {
    return {
      status: "NO — STAY HOME 💀",
      color: "bg-rose-600 text-white font-black shadow-soft-sm",
      reason: `Hazardous AQI (${aqiVal}). Limit all outdoor cardio and stay indoors.`,
      emoji: "😷"
    };
  }
  if (temp >= 40) {
    return {
      status: "NO — AIR FRYER 🔥",
      color: "bg-orange-600 text-white font-black shadow-soft-sm",
      reason: `${temp}°C detected. Severe heat exhaustion risk; stay in shade/AC.`,
      emoji: "🫠"
    };
  }
  if (isRain) {
    return {
      status: "TACTICAL ONLY ☔",
      color: "bg-blue-600 text-white font-black shadow-soft-sm",
      reason: "Monsoon showers active. Waterproof boots and umbrella required.",
      emoji: "🌧️"
    };
  }
  if (aqiVal <= 50 && temp >= 18 && temp <= 27) {
    return {
      status: "YES — PERFECT DAY 🎉",
      color: "bg-emerald-500 text-slate-950 font-black shadow-soft-sm",
      reason: `Temp ${temp}°C and clean AQI ${aqiVal}. Touch grass authorized!`,
      emoji: "😎"
    };
  }
  if (temp <= 8) {
    return {
      status: "BUNDLE UP 🥶",
      color: "bg-cyan-600 text-white font-black shadow-soft-sm",
      reason: `${temp}°C arctic breeze. Thermal layers and jacket mandatory.`,
      emoji: "🧥"
    };
  }

  return {
    status: "YES — ALL CLEAR 👍",
    color: "bg-emerald-100 text-emerald-900 border border-emerald-300 font-black",
    reason: "Atmosphere is behaving within standard comfortable parameters.",
    emoji: "🚶"
  };
};

// Today's Vibe helper
export const getTodaysVibe = (weatherData, aqiData, currentCity) => {
  const roast = getWeatherRoast(weatherData, aqiData, currentCity);
  return {
    title: roast.roast,
    emoji: roast.emoji || '✨',
    tag: roast.vibeTag
  };
};

// Micro Snippets
export const getMicroSnippets = (weatherData) => {
  const current = weatherData?.current || {};
  const humidity = Math.round(current.humidity ?? 50);
  const wind = Math.round(current.windSpeed ?? 10);
  const uv = Number(current.uvIndex ?? 0);

  return {
    humidityNote: humidity >= 75 ? "Heavy moisture (sweat alert)" : humidity <= 35 ? "Dry air (hydrate!)" : "Balanced moisture",
    windNote: wind >= 25 ? "Gusty wind (umbrella alert)" : wind <= 8 ? "Calm breeze" : "Gentle cooling breeze",
    uvNote: uv >= 8 ? "Extreme UV (SPF 50+)" : uv >= 6 ? "High UV (sunglasses)" : "Low / safe UV"
  };
};
