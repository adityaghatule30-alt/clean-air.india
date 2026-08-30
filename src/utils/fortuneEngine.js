// CleanAir India - Fortune Cookie Weather Prediction Engine
// Generates playful, humorous "predictions" & special equipment based on actual live data

import { antiRepetition } from './antiRepetitionEngine.js';

export const getDayPrediction = (weather, aqi, location) => {
  const current = weather?.current || {};
  const temp = Math.round(current.temperature ?? 26);
  const apparent = Math.round(current.apparentTemp ?? temp);
  const aqiVal = Math.round(aqi?.aqi ?? 50);
  const humidity = Math.round(current.humidity ?? 50);
  const wind = Math.round(current.windSpeed ?? 10);
  const code = Number(current.weatherCode ?? 0);
  const precipitation = Number(current.precipitation ?? 0);
  const isRain = precipitation > 0.2 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code);
  const cityName = location?.name || 'Your city';

  // 1. Predictions Pool
  const fortunes = [];

  if (temp >= 36) {
    fortunes.push(
      "There is a 97% probability you verbally complain about the sun within 45 minutes.",
      "You will consider ordering an iced drink even though you just finished one 5 minutes ago.",
      "Your shirt and your back will form an unbreakable thermodynamic bond today.",
      "Stepping outside will feel like opening an industrial pizza oven while checking the crust."
    );
  } else if (temp >= 30) {
    fortunes.push(
      "You will instinctively calculate the exact path of shadow on the sidewalk before crossing.",
      "The ceiling fan on speed 5 will become your primary emotional anchor.",
      "Cold water from the fridge will taste like an expensive Michelin-star luxury."
    );
  } else if (temp <= 12) {
    fortunes.push(
      "You will spend 25 minutes debating whether you truly need to leave your warm bed today.",
      "Your fingers will demand hot pockets or a steaming mug of ginger tea immediately.",
      "A warm blanket will become your most trusted, loyal companion today.",
      "Stepping out of the shower will require extraordinary psychological willpower."
    );
  } else if (temp <= 18) {
    fortunes.push(
      "Hoodie season has granted you +30 charisma and +50 cozy vibes today.",
      "Crisp breeze detected: a piping hot plate of pakoras is cosmically required."
    );
  }

  if (isRain) {
    fortunes.push(
      "Your future socks are currently praying for dry ground and solid footwear.",
      "You will see at least three people attempting Olympic-level puddle parkour.",
      "A hot cup of masala chai will taste 350% better today than on any normal day.",
      "Your umbrella will experience an unexpected aerodynamic integrity test."
    );
  }

  if (humidity >= 75) {
    fortunes.push(
      "Your hair and the atmospheric moisture will engage in an intense structural debate.",
      "You will feel like you stepped into a giant warm bowl of spicy ramen soup.",
      "Your mirror will look at your afternoon frizz with genuine cosmic sympathy."
    );
  }

  if (aqiVal >= 200) {
    fortunes.push(
      "Your lungs have reviewed today's schedule and formally requested work-from-home.",
      "Wearing a tactical N95 mask today will make you look like a mysterious cyberpunk protagonist.",
      "An indoor streaming movie marathon is cosmically sanctioned by atmospheric authorities."
    );
  } else if (aqiVal <= 45) {
    fortunes.push(
      "You will take a deep breath outside and think: 'Wait, this actually feels heavenly.'",
      "The universe is granting your city a rare atmospheric jackpot. Cherish every breath!"
    );
  }

  // Fallbacks
  fortunes.push(
    `Someone in ${cityName} will look at the clouds today and say 'Arey yaar!'`,
    "You will check the weather again in 3 hours even though nothing will change.",
    "A stray gust of wind will briefly test your dignified hairstyle.",
    "You will see the sun today. Probably."
  );

  // 2. Special Tactical Items Pool
  const SPECIAL_ITEMS = [
    { name: "Tactical Polarized Sunglasses 🕶️", note: "Blocks 99% solar glare & judgemental stares" },
    { name: "Hydro Flask of Liquid Ice 🧊", note: "Provides +40 cold damage resistance" },
    { name: "Emergency N95 Respirator 😷", note: "Filters particulate matter & spicy urban smog" },
    { name: "Masala Ginger Chai Flask ☕", note: "Instantly restores +50 warmth and mental morale" },
    { name: "Windproof Titanium Umbrella ☔", note: "Aerodynamically rated for monsoon squalls" },
    { name: "Pocket USB Hand Fan 🪭", note: "Personal micro-breeze on demand" },
    { name: "Anti-Frizz Humidity Shield 🧴", note: "Protects hair from atmospheric soup absorption" },
    { name: "Waterproof Canvas Sneaker Covers 👟", note: "Keeps clean socks at 100% dry capacity" },
    { name: "Thermal Fleece Layer 🧥", note: "Traps 95% body heat during arctic breezes" },
    { name: "Chilled Sweet Mango Lassi 🥛", note: "Neutralizes internal heatwave temperatures" }
  ];

  // Pick contextual special item
  let item = SPECIAL_ITEMS[0];
  if (temp >= 33) item = SPECIAL_ITEMS[1];
  else if (isRain) item = SPECIAL_ITEMS[4];
  else if (aqiVal >= 150) item = SPECIAL_ITEMS[2];
  else if (temp <= 14) item = SPECIAL_ITEMS[3];
  else if (humidity >= 75) item = SPECIAL_ITEMS[6];
  else item = antiRepetition.pick(SPECIAL_ITEMS, 'special_item');

  // 3. Atmospheric Buffs / Perks
  const BUFFS = [
    temp >= 32 ? "+35% Heat Resistance in the shade ☀️" : "+25% Morning Chai Sipping Morale ☕",
    isRain ? "+40% Puddle Jumping Accuracy 🌧️" : "+30% Balcony Stroll Aesthetic 🌿",
    aqiVal >= 150 ? "+50% Smog Dodging Agility 🏃" : "+60% Pure Oxygen Absorption Rate ✨",
    humidity >= 75 ? "+20% AC Negotiation Persuasion ❄️" : "+15% Natural Hair Bounce 💁",
    "+100% Blanket Magnetism When Alarms Ring ⏰"
  ];

  // 4. Daily Side Quests
  const SIDE_QUESTS = [
    temp >= 32 ? "Find an open seat directly under the ceiling fan on speed 5." : "Spot 3 people enthusiastically drinking hot chai.",
    isRain ? "Dodge 5 giant street puddles without getting a single drop on your socks." : "Take exactly one deep breath and rate the sky aesthetic 10/10.",
    aqiVal >= 150 ? "Successfully avoid standing behind a diesel bus exhaust pipe." : "Step outside for 10 minutes and absorb natural solar Vitamin D.",
    "Drink at least 2.5 Liters of water before the sun sets today."
  ];

  // 5. Cosmic Tips & Warnings
  const WARNINGS = [
    aqiVal >= 150 ? "Don't challenge the smog to an endurance contest 😷" : "Don't forget your phone charger and cold water 🔋",
    temp >= 35 ? "The direct asphalt is preheated to 200°C. Seek shaded sidewalks." : "Carry an umbrella just to psychologically prevent rain.",
    humidity >= 75 ? "Avoid touching your hair after leaving air-conditioned spaces." : "The weather is behaving. Enjoy it before nature changes its mind."
  ];

  return {
    prediction: antiRepetition.pick(fortunes, 'fortune_prediction'),
    specialItem: item.name,
    itemDescription: item.note,
    atmosphericBuff: antiRepetition.pick(BUFFS, 'fortune_buff'),
    sideQuest: antiRepetition.pick(SIDE_QUESTS, 'fortune_quest'),
    cosmicWarning: antiRepetition.pick(WARNINGS, 'fortune_warning')
  };
};
