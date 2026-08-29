// Friendly Air Quality & Weather Helper Definitions

export const AQI_LEVELS = {
  GOOD: {
    min: 0,
    max: 50,
    label: "Good",
    statusText: "Fresh & Crisp",
    tagline: "Air looks pristine and clean today!",
    iconEmoji: "🌿",
    heroMood: "good",
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgSoft: "bg-emerald-50",
    borderSoft: "border-emerald-200",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    glowClass: "shadow-glow-emerald",
    speech: "Fresh as a daisy! Perfect time for outdoor walks and open windows.",
    summary: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    tips: [
      "Open your windows to cycle fresh air inside.",
      "Ideal weather for morning jogs or outdoor exercise.",
      "No mask needed — enjoy the clear skies!"
    ]
  },
  MODERATE: {
    min: 51,
    max: 100,
    label: "Moderate",
    statusText: "Acceptable",
    tagline: "Decent air, enjoy your day outdoors.",
    iconEmoji: "🟡",
    heroMood: "moderate",
    color: "bg-amber-400",
    textColor: "text-amber-800",
    bgSoft: "bg-amber-50",
    borderSoft: "border-amber-200",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    glowClass: "shadow-glow-amber",
    speech: "Air quality is acceptable. Sensitive folks might want to take it a bit easy.",
    summary: "Air quality is acceptable; however, some pollutants may cause moderate concern for a very small number of unusually sensitive people.",
    tips: [
      "Unusually sensitive individuals should monitor how they feel outdoors.",
      "Great for normal commutes and outdoor activities.",
      "Keep a water bottle handy to stay refreshed."
    ]
  },
  UNHEALTHY_SENSITIVE: {
    min: 101,
    max: 150,
    label: "Unhealthy for Sensitive Groups",
    statusText: "Slightly Hazy",
    tagline: "Sensitive lungs should take it easy.",
    iconEmoji: "🟠",
    heroMood: "sensitive",
    color: "bg-orange-500",
    textColor: "text-orange-800",
    bgSoft: "bg-orange-50",
    borderSoft: "border-orange-200",
    badgeClass: "bg-orange-100 text-orange-900 border-orange-300",
    glowClass: "shadow-glow-amber",
    speech: "A bit spicy out there today. Sensitive groups, keep inhalers handy!",
    summary: "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
    tips: [
      "Children and people with asthma should limit heavy outdoor cardio.",
      "Run your indoor air purifier if available.",
      "Hydrate well with warm water or herbal tea."
    ]
  },
  UNHEALTHY: {
    min: 151,
    max: 200,
    label: "Unhealthy",
    statusText: "Smoggy",
    tagline: "Air quality isn't great today.",
    iconEmoji: "😷",
    heroMood: "unhealthy",
    color: "bg-rose-500",
    textColor: "text-rose-800",
    bgSoft: "bg-rose-50",
    borderSoft: "border-rose-200",
    badgeClass: "bg-rose-100 text-rose-900 border-rose-300",
    glowClass: "shadow-glow-rose",
    speech: "Grab a mask if you're stepping out for long periods.",
    summary: "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
    tips: [
      "Wear an N95 mask during outdoor commutes.",
      "Keep windows closed and run air filtration.",
      "Avoid intense outdoor sports today."
    ]
  },
  VERY_UNHEALTHY: {
    min: 201,
    max: 300,
    label: "Very Unhealthy",
    statusText: "Heavy Smog",
    tagline: "Air is heavily polluted. Limit outdoor time.",
    iconEmoji: "🟣",
    heroMood: "very_unhealthy",
    color: "bg-purple-600",
    textColor: "text-purple-900",
    bgSoft: "bg-purple-50",
    borderSoft: "border-purple-200",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
    glowClass: "shadow-glow-purple",
    speech: "Heavy haze alert! Stay indoors and keep filters running.",
    summary: "Health alert: The risk of health effects is increased for everyone.",
    tips: [
      "Avoid all outdoor cardio and workouts.",
      "Keep indoor air purifiers running on high.",
      "Seal door and window gaps to keep indoor air clean."
    ]
  },
  HAZARDOUS: {
    min: 301,
    max: 999,
    label: "Hazardous",
    statusText: "Severe Alert",
    tagline: "Emergency air warning. Stay indoors!",
    iconEmoji: "🟤",
    heroMood: "hazardous",
    color: "bg-stone-800",
    textColor: "text-stone-900",
    bgSoft: "bg-stone-100",
    borderSoft: "border-stone-300",
    badgeClass: "bg-stone-200 text-stone-900 border-stone-400",
    glowClass: "shadow-soft-xl",
    speech: "Severe air hazard. Everyone should stay inside today.",
    summary: "Health warning of emergency conditions: everyone is more likely to be affected.",
    tips: [
      "Remain indoors with all windows tightly shut.",
      "Use HEPA air purifiers in living and sleeping spaces.",
      "Avoid any unnecessary outdoor travel."
    ]
  }
};

export const getAQIDetails = (aqiValue) => {
  const num = Math.round(Number(aqiValue) || 0);
  if (num <= 50) return { ...AQI_LEVELS.GOOD, value: num };
  if (num <= 100) return { ...AQI_LEVELS.MODERATE, value: num };
  if (num <= 150) return { ...AQI_LEVELS.UNHEALTHY_SENSITIVE, value: num };
  if (num <= 200) return { ...AQI_LEVELS.UNHEALTHY, value: num };
  if (num <= 300) return { ...AQI_LEVELS.VERY_UNHEALTHY, value: num };
  return { ...AQI_LEVELS.HAZARDOUS, value: num };
};

export const getHumorousFeelsLike = (tempC) => {
  const temp = Math.round(Number(tempC) || 25);
  if (temp >= 40) return { text: "Intense heatwave — stay in the shade", color: "bg-rose-100 text-rose-800", comicTag: "Hot 🔥" };
  if (temp >= 35) return { text: "Quite warm — great for cold iced drinks", color: "bg-amber-100 text-amber-800", comicTag: "Warm ☀️" };
  if (temp >= 28) return { text: "Mild tropical warmth with gentle breeze", color: "bg-amber-100 text-amber-800", comicTag: "Pleasant ✨" };
  if (temp >= 22) return { text: "Delightful outdoor comfort weather", color: "bg-emerald-100 text-emerald-800", comicTag: "Optimal 🌿" };
  if (temp >= 16) return { text: "Crisp and cozy hoodie weather", color: "bg-sky-100 text-sky-800", comicTag: "Brisk 🧥" };
  return { text: "Cool and chilly — keep a warm layer handy", color: "bg-blue-100 text-blue-800", comicTag: "Chilly ❄️" };
};

export const getWindCommentary = (windSpeedKmH) => {
  const wind = Math.round(Number(windSpeedKmH) || 0);
  if (wind >= 40) return { text: "Strong gusty winds outdoors", level: "Gusty", tag: "Windy" };
  if (wind >= 25) return { text: "Fresh lively breeze across the skyline", level: "Fresh", tag: "Breezy" };
  if (wind >= 10) return { text: "Gentle soothing breeze", level: "Gentle", tag: "Mild" };
  return { text: "Calm and peaceful air", level: "Calm", tag: "Light" };
};

// Friendly time of day greeting
export const getFriendlyGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good morning", icon: "🌅", timePeriod: "morning" };
  if (hour >= 12 && hour < 17) return { text: "Good afternoon", icon: "☀️", timePeriod: "afternoon" };
  if (hour >= 17 && hour < 21) return { text: "Good evening", icon: "🌇", timePeriod: "evening" };
  return { text: "Good night", icon: "🌙", timePeriod: "night" };
};

// Friendly contextual advice based on actual live data
export const getContextualAdvice = (weather, aqi) => {
  const temp = weather?.current?.temperature ?? 26;
  const weatherCode = weather?.current?.weatherCode ?? 0;
  const windSpeed = weather?.current?.windSpeed ?? 10;
  const aqiVal = aqi?.aqi ?? 50;

  const messages = [];

  // Weather notes
  if (weatherCode === 0) {
    messages.push({ icon: "🕶️", text: "Looks like a bright sunglasses day!" });
  } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    messages.push({ icon: "🌧️", text: "Maybe keep an umbrella nearby today." });
  } else if ([95, 96, 99].includes(weatherCode)) {
    messages.push({ icon: "⚡", text: "Thunderstorms in the area — cozy up indoors!" });
  } else if (temp >= 35) {
    messages.push({ icon: "💧", text: "It's quite warm — remember to stay hydrated!" });
  } else if (temp <= 16) {
    messages.push({ icon: "🧥", text: "Crisp and cool — perfect hoodie weather." });
  }

  // Wind note
  if (windSpeed >= 28) {
    messages.push({ icon: "💨", text: "It's a little windy out there today." });
  }

  // Air note
  if (aqiVal <= 50) {
    messages.push({ icon: "🌿", text: "Air looks pretty clean today!" });
  } else if (aqiVal > 150) {
    messages.push({ icon: "😷", text: "Air quality isn't great today — consider a mask." });
  }

  if (messages.length === 0) {
    messages.push({ icon: "✨", text: "Pleasant atmosphere outside today." });
  }

  return messages;
};

// Weather code interpreter with friendly icons and themes
export const interpretWeatherCode = (code) => {
  const c = Number(code) || 0;
  switch (c) {
    case 0:
      return { label: "Clear Sunny Sky", icon: "Sun", emoji: "☀️", theme: "sunny" };
    case 1:
    case 2:
      return { label: "Partly Cloudy", icon: "CloudSun", emoji: "⛅", theme: "cloudy" };
    case 3:
      return { label: "Overcast Clouds", icon: "Cloud", emoji: "☁️", theme: "cloudy" };
    case 45:
    case 48:
      return { label: "Foggy Atmosphere", icon: "CloudFog", emoji: "🌫️", theme: "cloudy" };
    case 51:
    case 53:
    case 55:
      return { label: "Light Drizzle", icon: "CloudDrizzle", emoji: "🌦️", theme: "rainy" };
    case 61:
    case 63:
    case 65:
      return { label: "Rain Showers", icon: "CloudRain", emoji: "🌧️", theme: "rainy" };
    case 71:
    case 73:
    case 75:
      return { label: "Snow Flurries", icon: "Snowflake", emoji: "❄️", theme: "rainy" };
    case 80:
    case 81:
    case 82:
      return { label: "Heavy Downpour", icon: "CloudRainWind", emoji: "⛈️", theme: "rainy" };
    case 95:
    case 96:
    case 99:
      return { label: "Thunderstorm", icon: "CloudLightning", emoji: "🌩️", theme: "stormy" };
    default:
      return { label: "Mild Weather", icon: "SunMedium", emoji: "🌤️", theme: "sunny" };
  }
};
