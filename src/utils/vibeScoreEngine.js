// CleanAir India - Vibe Score & City vs Weather Roast Engine

export const calculateVibeScore = (weather, aqi) => {
  const temp = weather?.current?.temperature ?? 26;
  const aqiVal = aqi?.aqi ?? 50;
  const humidity = weather?.current?.humidity ?? 50;
  const wind = weather?.current?.windSpeed ?? 10;
  const code = Number(weather?.current?.weatherCode ?? 0);

  // 1. Temperature Subscore (0 - 35 pts)
  let tempScore = 35;
  if (temp > 24) {
    tempScore = Math.max(5, 35 - (temp - 24) * 2.2);
  } else if (temp < 20) {
    tempScore = Math.max(5, 35 - (20 - temp) * 2.5);
  }

  // 2. Air Quality Subscore (0 - 45 pts)
  let aqiScore = 45;
  if (aqiVal > 30) {
    aqiScore = Math.max(0, 45 - (aqiVal - 30) * 0.22);
  }

  // 3. Sky Condition Subscore (0 - 20 pts)
  let skyScore = 20;
  if ([95, 96, 99].includes(code)) skyScore = 3; // Storm
  else if ([80, 81, 82].includes(code)) skyScore = 6; // Heavy rain
  else if ([51, 53, 55, 61, 63, 65].includes(code)) skyScore = 12; // Drizzle
  else if (humidity >= 85) skyScore -= 5;
  if (wind >= 35) skyScore -= 5;

  const totalScore = Math.min(100, Math.max(5, Math.round(tempScore + aqiScore + skyScore)));

  // Generate dynamic explanation
  let explanation = "Atmosphere is moderately balanced today.";
  let emoji = "😎";
  let status = "Chill";

  if (totalScore >= 85) {
    emoji = "🎉";
    status = "CHILL";
    explanation = "THE ATMOSPHERE HAS BEEN PATCHED. Perfect temperature and clean air!";
  } else if (totalScore >= 70) {
    emoji = "🙂";
    status = "FINE";
    explanation = "Pretty decent conditions outside. Minimal atmospheric drama.";
  } else if (totalScore >= 50) {
    emoji = "😐";
    status = "HMM...";
    if (aqiVal > 100 && temp <= 28) {
      explanation = "Beautiful temperature, but the air is being a bit suspicious.";
    } else if (temp >= 33) {
      explanation = "Clean enough air, but the sun is operating on maximum oven mode.";
    } else {
      explanation = "Surviving the day. Not great, but completely manageable.";
    }
  } else if (totalScore >= 35) {
    emoji = "😬";
    status = "YIKES";
    if (aqiVal >= 150) {
      explanation = "Air has entered its villain arc. Outdoor breathing is not recommended.";
    } else if ([80, 81, 82, 95, 96, 99].includes(code)) {
      explanation = "The sky has turned on the deluge. Puddle jumping mandatory.";
    } else {
      explanation = "Sweat, heat, and humidity teaming up against humanity.";
    }
  } else if (totalScore >= 20) {
    emoji = "💀";
    status = "BRO";
    explanation = "Who enabled nightmare mode? Stay inside and protect your lungs.";
  } else {
    emoji = "☠️";
    status = "ABSOLUTELY NOT";
    explanation = "Catastrophic atmospheric conditions. Nature has officially blocked you.";
  }

  return {
    score: totalScore,
    emoji,
    status,
    explanation
  };
};

// 6-Tier "How Bad Is It?" Scale Tiers
export const HOW_BAD_TIERS = [
  { id: 'chill', minScore: 80, label: 'Chill', emoji: '🌿', color: 'bg-emerald-500 text-white', ring: 'ring-emerald-400' },
  { id: 'fine', minScore: 65, label: 'Fine', emoji: '🙂', color: 'bg-teal-500 text-white', ring: 'ring-teal-400' },
  { id: 'hmm', minScore: 50, label: 'Hmm', emoji: '😐', color: 'bg-amber-400 text-slate-950', ring: 'ring-amber-400' },
  { id: 'yikes', minScore: 35, label: 'Yikes', emoji: '😬', color: 'bg-orange-500 text-white', ring: 'ring-orange-400' },
  { id: 'bro', minScore: 20, label: 'Bro', emoji: '💀', color: 'bg-rose-600 text-white', ring: 'ring-rose-500' },
  { id: 'not', minScore: 0, label: 'Abs. Not', emoji: '☠️', color: 'bg-purple-900 text-white', ring: 'ring-purple-600' }
];

// City Roast Battle Scorecard Generator
export const getCityRoastScorecard = (cityName, weather, aqi) => {
  const name = cityName || 'Your City';
  const temp = weather?.current?.temperature ?? 26;
  const aqiVal = aqi?.aqi ?? 50;
  const humidity = weather?.current?.humidity ?? 50;

  // 1. Weather Rating /10
  let weatherRating = 8;
  if (temp >= 38 || temp <= 5) weatherRating = 3;
  else if (temp >= 33 || temp <= 12) weatherRating = 5;
  else if (temp >= 20 && temp <= 27) weatherRating = 9;

  // 2. AQI Rating /10
  let aqiRating = 8;
  if (aqiVal >= 200) aqiRating = 2;
  else if (aqiVal >= 140) aqiRating = 4;
  else if (aqiVal >= 80) aqiRating = 6;
  else if (aqiVal <= 40) aqiRating = 10;

  // 3. Humidity Rating
  let humidityTag = "Optimal 💧";
  if (humidity >= 80) humidityTag = "Soup 🍜💀";
  else if (humidity >= 65) humidityTag = "Moist 🦁";
  else if (humidity <= 30) humidityTag = "Crispy 🏜️";

  // 4. Overall Roast Verdict
  let verdict = `${name} is trying its best.`;
  if (weatherRating >= 8 && aqiRating <= 4) {
    verdict = `Beautiful weather. Shame about the air quality, ${name}. 😷`;
  } else if (weatherRating <= 4 && aqiRating >= 8) {
    verdict = `Clean air, but ${name} is preheated like an oven. 🍗`;
  } else if (weatherRating >= 8 && aqiRating >= 8) {
    verdict = `${name} is showing off today. Rare 10/10 performance! 🎉`;
  } else if (weatherRating <= 4 && aqiRating <= 4) {
    verdict = `${name} has lost the plot today. Double trouble. 💀`;
  }

  return {
    weatherRating: `${weatherRating}/10`,
    aqiRating: `${aqiRating}/10`,
    humidityTag,
    verdict
  };
};
