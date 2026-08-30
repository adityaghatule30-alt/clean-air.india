// CleanAir India - Centralized Context-Aware Atmosphere Commentary & Personality Engine
// Powered by Anti-Repetition Ring Buffer, Dynamic Metric Prioritization, Dark Humor Mode & True Telemetry

import { antiRepetition } from './antiRepetitionEngine.js';

/* ─── Standard Sarcastic Commentary Pool ─── */
export const COMMENTARY_POOL = {
  // ─── TEMPERATURE ───
  temp_extreme_cold: [ // < 10°C
    "Bro, who turned India into a refrigerator? 🥶",
    "Jacket season has entered the chat with zero warning.",
    "Your blanket has a legally binding argument to stay in bed today.",
    "Stepping out of the shower requires genuine psychological bravery.",
    "The air just slapped you directly in the face with frozen wind.",
    "Fingers have formally resigned and left the conversation.",
    "Your water tap is dispensing liquid nitrogen this morning."
  ],
  temp_chilly: [ // 10°C – 18°C
    "Okay, this is suspiciously comfortable hoodie weather. 🧥",
    "Crisp morning air that wakes you up faster than double espresso.",
    "A brisk breeze that makes 4 cups of masala chai mandatory.",
    "Your nose tip is cold, but your spirit is thriving.",
    "The ceiling fan has been officially retired for the season."
  ],
  temp_pleasant: [ // 18°C – 25°C
    "Honestly? The weather is on its absolute best behavior. 🌿",
    "10/10 temperature. The atmospheric simulation is running smoothly.",
    "Window open, gentle breeze, zero sweat. Cherish every second.",
    "The weather gods have temporarily forgiven this city.",
    "Perfect balcony chai weather detected. Proceed immediately."
  ],
  temp_warm: [ // 25°C – 32°C
    "Warm, but we're surviving. Ceiling fan on medium speed. 🙂",
    "Toasty afternoon. Cold coffee is transitioning from luxury to necessity.",
    "Comfortable in the shade, slightly questionable in direct sunlight.",
    "The sun is mildly showing off without going completely feral."
  ],
  temp_very_hot: [ // 32°C – 38°C
    "The sun has clearly taken this day personally. 🥵",
    "Congratulations. You're being lightly roasted by the atmosphere.",
    "It’s giving 'AC on full blast or we riot'.",
    "You can go outside… but why would you do that to yourself?",
    "Your shirt is about 10 minutes away from becoming a towel."
  ],
  temp_extreme_heat: [ // > 38°C
    "This isn't weather anymore. It's an industrial air-fryer. 🔥",
    "The sun woke up today and chose personal violence.",
    "Going outside? That is a bold, scientifically questionable choice.",
    "The pavement is hot enough to cook a masala dosa in 40 seconds.",
    "AC on 16°C is no longer a luxury; it is a vital life support system."
  ],

  // ─── AIR QUALITY (US EPA STANDARD) ───
  aqi_good: [ // 0 – 50
    "Your lungs are having a pretty good day. Deep breaths authorized! 🌿",
    "Breathing peacefully. What a concept.",
    "Clean air detected! Your alveoli are throwing a full carnival. 🎉",
    "AQI under 50? Take a screenshot of this rare atmospheric miracle."
  ],
  aqi_moderate: [ // 51 – 100
    "Not perfect, but your lungs aren't filing complaints. Standard urban air. 🙂",
    "The air is acceptable. A neutral review from your respiratory system.",
    "Standard atmospheric conditions. Nothing to brag about, nothing to panic over."
  ],
  aqi_sensitive: [ // 101 – 150
    "Air is slightly spicy today. Maybe skip the heavy outdoor marathon sprint. 😬",
    "Dust and vehicle exhaust having a small afternoon gathering.",
    "Sensitive lungs: keep the inhaler handy and avoid prolonged outdoor cardio."
  ],
  aqi_unhealthy: [ // 151 – 200
    "Your lungs would like a word. N95 mask strongly advised outdoors. 😷",
    "The atmosphere looks like it was filtered through a dusty vacuum bag.",
    "You don't just inhale this air; you chew it slightly first."
  ],
  aqi_very_unhealthy: [ // 201 – 300
    "Yeah... maybe give outdoor plans a very serious second thought. 💀",
    "The air has entered boss-level toxicity. Bunker mode recommended.",
    "Even the air purifier is coughing looking out the window."
  ],
  aqi_hazardous: [ // 300+ (Serious First)
    "🚨 HEALTH ALERT: AQI is hazardous (300+). Limit all outdoor exposure and seal indoor airflow.",
    "Bro, your lungs just submitted a formal request for work-from-home. ☠️",
    "Severe particulate pollution alert. Keep indoor purifiers at maximum power."
  ],

  // ─── RAIN & PRECIPITATION ───
  rain_heavy: [
    "Okay, this is no longer a drizzle. The sky has committed to a full monsoon downpour. 🌧️",
    "Umbrella lifespan in this deluge: approximately 3 minutes.",
    "Maybe those clean white shoes should stay inside today.",
    "The road has temporarily rebranded as a freshwater canal."
  ],
  rain_moderate: [
    "Umbrella check! Trust issues with the clouds are 100% justified today. ☔",
    "The sky has entered its dramatic era with steady showers.",
    "Rain has officially joined the group chat. Petrichor aroma unlocked."
  ],
  rain_dry: [
    "Clouds are behaving for once. Zero rain interference detected. ☀️",
    "Dry pavement and clear skies. No umbrella needed today."
  ],

  // ─── HUMIDITY ───
  humidity_low: [
    "Dry enough to make your lips start negotiating for lip balm. 🌬️",
    "Crisp, dry air. Water bottle hydration check required."
  ],
  humidity_comfy: [
    "Humidity is actually behaving today. Atmospheric moisture in the sweet spot. 😌",
    "Balanced moisture levels. Your hair is maintaining its original shape."
  ],
  humidity_high: [
    "Why does the air feel personally attached to your skin? 🥵",
    "The air feels like it was briefly microwaved before delivery.",
    "Step out of the shower, dry off, immediately start glowing again."
  ],
  humidity_extreme: [
    "Congratulations, you are now officially part of the humidity. 💀",
    "Humidity at 85%+: you are essentially breathing warm soup."
  ],

  // ─── WIND ───
  wind_calm: [
    "The air is basically standing still. Not a leaf is moving. 🍃"
  ],
  wind_breeze: [
    "Nice little breeze blowing. The atmosphere is cooperating nicely. 🌬️"
  ],
  wind_high: [
    "Okay, the wind clearly has somewhere VERY important to be today. 💨",
    "Hold onto your hat and your umbrella. Aerodynamic turbulence active."
  ],
  wind_gale: [
    "Secure your loose belongings before they become independent citizens! 🌪️",
    "The wind is attempting to relocate your hairstyle into another district."
  ],

  // ─── UV INDEX ───
  uv_low: [ "UV index is low. The sun is being polite and reasonable. 😌" ],
  uv_moderate: [ "Moderate UV. Sunscreen wouldn't hurt if you're out for hours. 🧴" ],
  uv_high: [ "UV index is getting ambitious. Sunglasses and SPF recommended! ☀️" ],
  uv_very_high: [ "Sunglasses + sunscreen mandatory. The sun is not negotiating today. 🕶️" ],
  uv_extreme: [ "☀️ EXTREME UV ALERT: The sun has chosen maximum solar intensity. Protect skin and eyes." ],

  // ─── FEELS-LIKE DISCREPANCIES ───
  feels_much_hotter: [
    "The thermometer says {temp}°C, but your body has received very different information ({apparent}°C). 🥵",
    "High humidity is making {temp}°C feel like a spicy {apparent}°C.",
    "Technically {temp}°C outside, but thermal reality says {apparent}°C."
  ],
  feels_much_colder: [
    "The thermometer says {temp}°C, but wind chill says absolutely not ({apparent}°C). 🥶",
    "Wind is cutting through, making {temp}°C feel like {apparent}°C."
  ],
  feels_similar: [
    "What you see is basically what you get today: {temp}°C feels like {apparent}°C. 🙂",
    "Thermal honesty: {temp}°C on the sensor matches the body sensation."
  ],

  // ─── MULTI-CONDITION COMBINATIONS ───
  combo_heat_aqi: [
    "{temp}°C AND AQI {aqi}? The sun is cooking you and the air is seasoning you. 💀",
    "Double trouble: hot sun beating down through a thick layer of spicy atmospheric smog.",
    "Outside is currently set to: Smoked Barbecue Simulator ({temp}°C, AQI {aqi})."
  ],
  combo_heat_humidity: [
    "{temp}°C with {humidity}% humidity: welcome to the tropical steambath! 🥟",
    "The atmosphere is so hot ({temp}°C) and humid ({humidity}%) you could poach an egg in mid-air."
  ],
  combo_rain_wind: [
    "Rain + {wind} km/h Wind: Umbrella life expectancy is under 90 seconds. ☔💨",
    "Horizontal rain detected. Your umbrella has become a kite."
  ],
  combo_cold_wind: [
    "{temp}°C + {wind} km/h Wind: The atmosphere is delivering frozen slaps to your face. 🥶💨"
  ],
  combo_perfect_clean: [
    "{temp}°C, clean AQI {aqi} and a crisp breeze. Okay, who fixed the atmosphere? 🎉"
  ]
};

/* ─── Dark Humor / Sarcastic Mode Pool ─── */
export const COMMENTARY_POOL_DARK = {
  aqi_good: [
    "Wow. The air chose violence... against pollution. 🌿",
    "Oxygen so pure it feels like an elaborate setup.",
    "Clean air detected. Suspicious. What's the hidden catch?"
  ],
  aqi_moderate: [
    "Technically acceptable. Humanity lives another day.",
    "Air quality is aggressively mediocre. Surviving on default settings.",
    "Your lungs gave today's atmosphere a 2.5-star Yelp review."
  ],
  aqi_sensitive: [
    "Air is flavored with diesel and regret. Proceed at your own risk. 😬",
    "Breathing outside is currently an Olympic endurance sport."
  ],
  aqi_unhealthy: [
    "Your lungs have reviewed today's agenda and declined attendance. 😷",
    "The air has more texture than a bowl of oatmeal. Chewing recommended."
  ],
  aqi_very_unhealthy: [
    "Atmosphere status: questionable life choices. 💀",
    "Your lungs have formally submitted a resignation letter.",
    "Nature is testing your will to live with this spicy particulate blend."
  ],
  aqi_hazardous: [
    "🚨 HEALTH ALERT: AQI 300+ is hazardous. Seal windows and cancel outside existence.",
    "The atmosphere has entered the final boss stage. Stay inside. ☠️"
  ],
  temp_extreme_heat: [
    "Nature has enabled industrial oven mode. 🔥",
    "The sun has promoted itself to management without authorization.",
    "Outside is currently preheated to 200°C for baking humans."
  ],
  temp_extreme_cold: [
    "The atmosphere is personally punishing you for not owning thermal underwear.",
    "Body temperature: negotiating a peace treaty with the blanket."
  ],
  combo_heat_humidity: [
    "Congratulations. You've unlocked human soup. 🥟",
    "You are no longer a person; you are a biological condensation collector."
  ],
  combo_heat_aqi: [
    "Sun cooking from above, smog seasoning from below. Gourmet catastrophe. 💀"
  ],
  combo_rain_wind: [
    "Umbrella ownership has become a temporary financial decision. ☔",
    "Your umbrella is about to become an uncontrolled drone."
  ],
  late_night: [
    "It's 3 AM. The weather isn't your biggest problem. Go to sleep. 😭"
  ]
};

/* ─── Reusable Commentary Engine ─── */
export class WeatherCommentaryEngine {
  constructor() {
    this.humorMode = this.loadHumorMode();
  }

  loadHumorMode() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('cleanair_humor_mode') || 'sarcastic';
      }
    } catch (e) {}
    return 'sarcastic';
  }

  setHumorMode(mode) {
    if (['light', 'sarcastic', 'dark'].includes(mode)) {
      this.humorMode = mode;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('cleanair_humor_mode', mode);
        }
      } catch (e) {}
    }
  }

  getHumorMode() {
    return this.humorMode;
  }

  /**
   * Generates a primary contextual atmosphere summary for the hero cards.
   */
  getAtmosphereSummary(weatherData, aqiData, currentCity) {
    const current = weatherData?.current || {};
    const temp = Math.round(current.temperature ?? 26);
    const apparent = Math.round(current.apparentTemp ?? temp);
    const humidity = Math.round(current.humidity ?? 50);
    const wind = Math.round(current.windSpeed ?? 10);
    const precipitation = Number(current.precipitation ?? 0);
    const uv = Number(current.uvIndex ?? 0);
    const code = Number(current.weatherCode ?? 0);
    const aqi = Math.round(aqiData?.aqi ?? 50);
    const isRain = precipitation > 0.2 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);

    const cityName = currentCity?.name || 'Local area';
    const isDark = this.humorMode === 'dark';

    // 1. EMERGENCY / CRITICAL CHECK FIRST (Safety First!)
    if (aqi >= 300) {
      return {
        title: "SEVERE AQI WARNING 🚨",
        roast: isDark 
          ? antiRepetition.pick(COMMENTARY_POOL_DARK.aqi_hazardous, 'dark_aqi_haz') 
          : antiRepetition.pick(COMMENTARY_POOL.aqi_hazardous, 'aqi_hazardous'),
        subtext: `AQI is ${aqi} (Hazardous). Avoid prolonged outdoor activity and wear an N95 respirator.`,
        badge: "Hazardous Air ☠️",
        emoji: "😷",
        severity: "emergency",
        category: "aqi"
      };
    }

    if (temp >= 42) {
      return {
        title: "EXTREME HEAT PROTOCOL 🔥",
        roast: isDark 
          ? antiRepetition.pick(COMMENTARY_POOL_DARK.temp_extreme_heat, 'dark_heat_ext') 
          : antiRepetition.pick(COMMENTARY_POOL.temp_extreme_heat, 'temp_extreme_heat'),
        subtext: `${temp}°C outside. High risk of heat exhaustion; stay hydrated in air-conditioned spaces.`,
        badge: "Extreme Heat ☀️",
        emoji: "🫠",
        severity: "warning",
        category: "heat"
      };
    }

    // 2. COMBINATION MATCHES (Prioritize multi-dimensional synergies)
    if (temp >= 33 && aqi >= 150) {
      const pool = isDark ? COMMENTARY_POOL_DARK.combo_heat_aqi : COMMENTARY_POOL.combo_heat_aqi;
      const template = antiRepetition.pick(pool, 'combo_heat_aqi');
      const roast = template.replace('{temp}', temp).replace('{aqi}', aqi);
      return {
        title: isDark ? "GOURMET CATASTROPHE 💀" : "THE SMOKED BARBECUE 💀",
        roast,
        subtext: `High heat (${temp}°C) combined with unhealthy air (AQI ${aqi}).`,
        badge: "Heat + Smog 🌶️",
        emoji: "💀",
        severity: "warning",
        category: "combo"
      };
    }

    if (temp >= 32 && humidity >= 75) {
      const pool = isDark ? COMMENTARY_POOL_DARK.combo_heat_humidity : COMMENTARY_POOL.combo_heat_humidity;
      const template = antiRepetition.pick(pool, 'combo_heat_humidity');
      const roast = template.replace('{temp}', temp).replace('{humidity}', humidity);
      return {
        title: isDark ? "HUMAN SOUP UNLOCKED 🥟" : "TROPICAL STEAMBATH 🥟",
        roast,
        subtext: `${temp}°C with ${humidity}% humidity feels like ${apparent}°C.`,
        badge: "High Humidity 💧",
        emoji: "🥵",
        severity: "normal",
        category: "combo"
      };
    }

    if (isRain && wind >= 22) {
      const pool = isDark ? COMMENTARY_POOL_DARK.combo_rain_wind : COMMENTARY_POOL.combo_rain_wind;
      const template = antiRepetition.pick(pool, 'combo_rain_wind');
      const roast = template.replace('{wind}', wind);
      return {
        title: "UMBRELLA DOOM PROTOCOL ☔",
        roast,
        subtext: `Active rain with ${wind} km/h wind gusts.`,
        badge: "Stormy Weather 🌧️",
        emoji: "💨",
        severity: "normal",
        category: "combo"
      };
    }

    if (temp <= 14 && wind >= 18) {
      const template = antiRepetition.pick(COMMENTARY_POOL.combo_cold_wind, 'combo_cold_wind');
      const roast = template.replace('{temp}', temp).replace('{wind}', wind);
      return {
        title: "THE ARCTIC SLAP 🥶",
        roast,
        subtext: `${temp}°C temperature with brisk ${wind} km/h wind chill.`,
        badge: "Wind Chill ❄️",
        emoji: "🥶",
        severity: "normal",
        category: "combo"
      };
    }

    if (temp >= 19 && temp <= 27 && aqi <= 45) {
      const pool = isDark ? COMMENTARY_POOL_DARK.aqi_good : COMMENTARY_POOL.combo_perfect_clean;
      const template = antiRepetition.pick(pool, 'combo_perfect');
      const roast = template.replace('{temp}', temp).replace('{aqi}', aqi);
      return {
        title: "ATMOSPHERIC MIRACLE 🎉",
        roast,
        subtext: `Rare 10/10 day: ${temp}°C and crystal clean air (AQI ${aqi}).`,
        badge: "10/10 Vibes ✨",
        emoji: "😎",
        severity: "normal",
        category: "pleasant"
      };
    }

    // 3. RAIN PRIORITY
    if (isRain) {
      const pool = precipitation > 4 ? COMMENTARY_POOL.rain_heavy : COMMENTARY_POOL.rain_moderate;
      return {
        title: "RAIN GOSSIP INCOMING 🌧️",
        roast: antiRepetition.pick(pool, 'rain_active'),
        subtext: `Precipitation active in ${cityName}. Carry an umbrella.`,
        badge: "Rainy Skies ☔",
        emoji: "🌧️",
        severity: "normal",
        category: "rain"
      };
    }

    // 4. TEMPERATURE BRACKET FALLBACKS
    if (temp >= 38) {
      return {
        title: isDark ? "OVEN MODE ACTIVATED 🔥" : "AIR FRYER MODE 🔥",
        roast: isDark ? antiRepetition.pick(COMMENTARY_POOL_DARK.temp_extreme_heat, 'dark_heat') : antiRepetition.pick(COMMENTARY_POOL.temp_extreme_heat, 'temp_extreme_heat'),
        subtext: `${temp}°C outside. High heat warning active.`,
        badge: "Blazing Sun ☀️",
        emoji: "🫠",
        severity: "warning",
        category: "heat"
      };
    }

    if (temp >= 32) {
      return {
        title: "TOASTY AFTERNOON 🥵",
        roast: antiRepetition.pick(COMMENTARY_POOL.temp_very_hot, 'temp_very_hot'),
        subtext: `${temp}°C (feels like ${apparent}°C). Stay hydrated.`,
        badge: "Warm Sun 🌡️",
        emoji: "🥵",
        severity: "normal",
        category: "heat"
      };
    }

    if (temp <= 9) {
      return {
        title: "ARCTIC BURRITO MODE 🥶",
        roast: isDark ? antiRepetition.pick(COMMENTARY_POOL_DARK.temp_extreme_cold, 'dark_cold') : antiRepetition.pick(COMMENTARY_POOL.temp_extreme_cold, 'temp_extreme_cold'),
        subtext: `${temp}°C outside. Extra layers strongly recommended.`,
        badge: "Freezing Cold ❄️",
        emoji: "🥶",
        severity: "normal",
        category: "cold"
      };
    }

    if (temp <= 18) {
      return {
        title: "HOODIE SEASON 🧥",
        roast: antiRepetition.pick(COMMENTARY_POOL.temp_chilly, 'temp_chilly'),
        subtext: `${temp}°C. Crisp and refreshing sweater temperature.`,
        badge: "Chilly Breeze 🍂",
        emoji: "😌",
        severity: "normal",
        category: "cold"
      };
    }

    if (temp <= 25) {
      return {
        title: "PLEASANT ATMOSPHERE 🌿",
        roast: antiRepetition.pick(COMMENTARY_POOL.temp_pleasant, 'temp_pleasant'),
        subtext: `${temp}°C with comfortable airflow across ${cityName}.`,
        badge: "Pure Comfort ✨",
        emoji: "😎",
        severity: "normal",
        category: "pleasant"
      };
    }

    return {
      title: "WARM & SURVIVABLE 🙂",
      roast: antiRepetition.pick(COMMENTARY_POOL.temp_warm, 'temp_warm'),
      subtext: `${temp}°C outside with ${humidity}% humidity.`,
      badge: "Standard Weather 🌤️",
      emoji: "🙂",
      severity: "normal",
      category: "warm"
    };
  }

  /**
   * Generates Today vs Yesterday Verdict comparing live data against historical telemetry.
   */
  getTodayVsYesterdayVerdict(weatherData, aqiData) {
    const cur = weatherData?.current || {};
    const curTemp = cur.temperature != null ? Math.round(cur.temperature) : null;
    const yMax = cur.todayMax != null && cur.yesterdayMax != null ? (cur.todayMax - cur.yesterdayMax) : null;
    const curAqi = aqiData?.aqi != null ? Math.round(aqiData.aqi) : null;
    const yAqi = aqiData?.yesterdayAvgAqi != null ? Math.round(aqiData.yesterdayAvgAqi) : null;
    const aqiDiff = curAqi != null && yAqi != null ? (curAqi - yAqi) : null;
    const curHum = cur.humidity != null ? Math.round(cur.humidity) : null;
    const yHum = cur.yesterdayAvgHumidity != null ? Math.round(cur.yesterdayAvgHumidity) : null;

    if (curTemp == null && curAqi == null) {
      return "Yesterday's comparison data is currently loading...";
    }

    if (aqiDiff != null && aqiDiff <= -5) {
      return `${Math.abs(aqiDiff)} AQI points cleaner today. Tiny win for your respiratory system! 🌿`;
    }
    if (aqiDiff != null && aqiDiff >= 15) {
      return `Air quality dropped by ${aqiDiff} AQI points compared to yesterday. Air purifier on duty. 😷`;
    }
    if (yMax != null && yMax >= 3) {
      return `${yMax}°C hotter today. The sun is getting ambitious. ☀️`;
    }
    if (yMax != null && yMax <= -3) {
      return `${Math.abs(yMax)}°C cooler than yesterday. Crisp cooling relief. 🧥`;
    }
    if (curHum != null && yHum != null && curHum - yHum >= 15) {
      return `AQI is similar, but humidity spiked by ${curHum - yHum}%. Moisture drama active. 💧`;
    }

    return "Basically the same as yesterday. Nature did nothing particularly dramatic today. 🙂";
  }

  /**
   * Generates factual, non-alarmist scientific "Why is this happening?" explanations.
   */
  getWhyExplanation(metricType, weatherData, aqiData) {
    const cur = weatherData?.current || {};
    const temp = Math.round(cur.temperature ?? 26);
    const apparent = Math.round(cur.apparentTemp ?? temp);
    const humidity = Math.round(cur.humidity ?? 50);
    const wind = Math.round(cur.windSpeed ?? 10);
    const aqi = Math.round(aqiData?.aqi ?? 50);
    const pol = aqiData?.pollutants || {};

    if (metricType === 'temperature') {
      if (apparent - temp >= 4) {
        return {
          metric: 'Temperature & Feels-Like',
          value: `${temp}°C (Feels like ${apparent}°C)`,
          title: 'High Humidity Thermal Trapping',
          explanation: `Measured ambient air is ${temp}°C, but high atmospheric humidity (${humidity}%) slows down skin sweat evaporation, causing your body to retain more heat and feel like ${apparent}°C.`,
          scienceTag: 'Thermal Index & Latent Heat'
        };
      }
      if (temp - apparent >= 3) {
        return {
          metric: 'Temperature & Wind Chill',
          value: `${temp}°C (Feels like ${apparent}°C)`,
          title: 'Convective Wind Chill Effect',
          explanation: `Brisk wind speeds (${wind} km/h) accelerate the rate of heat loss from exposed skin, creating a cooling wind-chill effect of ${apparent}°C.`,
          scienceTag: 'Convective Heat Dissipation'
        };
      }
      return {
        metric: 'Ambient Temperature',
        value: `${temp}°C`,
        title: 'Solar Insolation & Air Mass',
        explanation: `Today's temperature of ${temp}°C is driven by solar radiation heating the ground surface, balanced by local cloud cover and regional air mass circulation.`,
        scienceTag: 'Surface Solar Radiation Balance'
      };
    }

    if (metricType === 'aqi') {
      let dominantPollutant = 'PM2.5';
      let dominantDesc = 'Fine inhalable combustion particles';
      if (Number(pol?.pm10?.value) > 100 && Number(pol?.pm10?.value) > (Number(pol?.pm25?.value) || 0) * 2.5) {
        dominantPollutant = 'PM10';
        dominantDesc = 'Coarse road dust and construction particulates';
      } else if (Number(pol?.o3?.value) > 80) {
        dominantPollutant = 'Ground Ozone (O₃)';
        dominantDesc = 'Photochemical reaction of nitrogen oxides in direct sunlight';
      }

      return {
        metric: 'Air Quality Index (US EPA)',
        value: `AQI ${aqi}`,
        title: `Dominant Contributor: ${dominantPollutant}`,
        explanation: `Today's AQI of ${aqi} is calculated from primary atmospheric sensors. ${dominantPollutant} (${dominantDesc}) is the leading concentration influencing the index.`,
        scienceTag: 'Atmospheric Particulate Chemistry'
      };
    }

    if (metricType === 'humidity') {
      return {
        metric: 'Relative Humidity',
        value: `${humidity}%`,
        title: 'Water Vapor Saturation',
        explanation: `Relative humidity measures the amount of water vapor present in the air relative to the maximum possible moisture the air can hold at ${temp}°C before condensing into dew or fog.`,
        scienceTag: 'Psychrometric Vapor Pressure'
      };
    }

    if (metricType === 'wind') {
      return {
        metric: 'Wind Velocity',
        value: `${wind} km/h`,
        title: 'Atmospheric Pressure Gradient',
        explanation: `Wind is generated when air flows from regions of higher atmospheric pressure to regions of lower pressure. Higher wind speeds (${wind} km/h) enhance vertical mixing and pollutant dispersion.`,
        scienceTag: 'Pressure Gradient Force'
      };
    }

    return {
      metric: 'Precipitation',
      value: `${cur.precipitation || 0} mm`,
      title: 'Atmospheric Condensation',
      explanation: 'Precipitation occurs when rising air parcels cool, causing water vapor to condense into droplets large enough to fall under gravity.',
      scienceTag: 'Condensation & Cloud Physics'
    };
  }

  getFeelsLikeExplanation(temp, apparent, humidity, windSpeed) {
    const diff = apparent - temp;
    if (diff >= 4) {
      const template = antiRepetition.pick(COMMENTARY_POOL.feels_much_hotter, 'feels_hotter');
      return template.replace('{temp}', temp).replace('{apparent}', apparent);
    }
    if (diff <= -3) {
      const template = antiRepetition.pick(COMMENTARY_POOL.feels_much_colder, 'feels_colder');
      return template.replace('{temp}', temp).replace('{apparent}', apparent);
    }
    const template = antiRepetition.pick(COMMENTARY_POOL.feels_similar, 'feels_similar');
    return template.replace('{temp}', temp).replace('{apparent}', apparent);
  }

  getAQICommentary(aqi) {
    const val = Math.round(Number(aqi) || 50);
    const isDark = this.humorMode === 'dark';
    if (val <= 50) return { roast: antiRepetition.pick(isDark ? COMMENTARY_POOL_DARK.aqi_good : COMMENTARY_POOL.aqi_good, 'aqi_good'), label: 'Good 🌿' };
    if (val <= 100) return { roast: antiRepetition.pick(isDark ? COMMENTARY_POOL_DARK.aqi_moderate : COMMENTARY_POOL.aqi_moderate, 'aqi_moderate'), label: 'Moderate 🌤️' };
    if (val <= 150) return { roast: antiRepetition.pick(isDark ? COMMENTARY_POOL_DARK.aqi_sensitive : COMMENTARY_POOL.aqi_sensitive, 'aqi_sensitive'), label: 'Sensitive 🌶️' };
    if (val <= 200) return { roast: antiRepetition.pick(isDark ? COMMENTARY_POOL_DARK.aqi_unhealthy : COMMENTARY_POOL.aqi_unhealthy, 'aqi_unhealthy'), label: 'Unhealthy 😷' };
    if (val <= 300) return { roast: antiRepetition.pick(isDark ? COMMENTARY_POOL_DARK.aqi_very_unhealthy : COMMENTARY_POOL.aqi_very_unhealthy, 'aqi_very_unhealthy'), label: 'Very Unhealthy 💀' };
    return { roast: antiRepetition.pick(isDark ? COMMENTARY_POOL_DARK.aqi_hazardous : COMMENTARY_POOL.aqi_hazardous, 'aqi_hazardous'), label: 'Hazardous ☠️' };
  }

  getHumidityCommentary(humidity) {
    const h = Number(humidity) || 50;
    if (h < 35) return antiRepetition.pick(COMMENTARY_POOL.humidity_low, 'humidity_low');
    if (h <= 65) return antiRepetition.pick(COMMENTARY_POOL.humidity_comfy, 'humidity_comfy');
    if (h <= 84) return antiRepetition.pick(COMMENTARY_POOL.humidity_high, 'humidity_high');
    return antiRepetition.pick(COMMENTARY_POOL.humidity_extreme, 'humidity_extreme');
  }

  getWindCommentary(windSpeed) {
    const w = Number(windSpeed) || 10;
    if (w < 8) return antiRepetition.pick(COMMENTARY_POOL.wind_calm, 'wind_calm');
    if (w <= 20) return antiRepetition.pick(COMMENTARY_POOL.wind_breeze, 'wind_breeze');
    if (w <= 38) return antiRepetition.pick(COMMENTARY_POOL.wind_high, 'wind_high');
    return antiRepetition.pick(COMMENTARY_POOL.wind_gale, 'wind_gale');
  }

  getUVCommentary(uvIndex) {
    const uv = Number(uvIndex) || 0;
    if (uv <= 2) return antiRepetition.pick(COMMENTARY_POOL.uv_low, 'uv_low');
    if (uv <= 5) return antiRepetition.pick(COMMENTARY_POOL.uv_moderate, 'uv_moderate');
    if (uv <= 7) return antiRepetition.pick(COMMENTARY_POOL.uv_high, 'uv_high');
    if (uv <= 10) return antiRepetition.pick(COMMENTARY_POOL.uv_very_high, 'uv_very_high');
    return antiRepetition.pick(COMMENTARY_POOL.uv_extreme, 'uv_extreme');
  }
}

export const weatherCommentary = new WeatherCommentaryEngine();
