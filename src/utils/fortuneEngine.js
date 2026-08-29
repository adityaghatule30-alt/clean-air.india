// CleanAir India - Fortune Cookie Weather Prediction Engine
// Generates playful, humorous "predictions" based on actual live data

import { getRandomItem } from './personalityEngine.js';

export const getDayPrediction = (weather, aqi, location) => {
  const temp = Math.round(weather?.current?.temperature ?? 26);
  const aqiVal = Math.round(aqi?.aqi ?? 50);
  const humidity = Math.round(weather?.current?.humidity ?? 50);
  const code = Number(weather?.current?.weatherCode ?? 0);
  const cityName = location?.name || 'Your city';

  const fortunes = [];

  // Heat fortunes
  if (temp >= 33) {
    fortunes.push(
      "There is a 94% chance you complain about the heat within 2 hours.",
      "You will consider ordering cold iced coffee even though you already had one.",
      "Your shirt and your back will form an unbreakable bond today.",
      "The sun will stare directly into your soul every time you step outside."
    );
  }

  // Rain fortunes
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    fortunes.push(
      "You will regret leaving home without an umbrella. Carry one anyway.",
      "Your future socks are currently praying for dry ground.",
      "There is a 100% chance you see someone dramatically jumping over a puddle.",
      "A hot cup of tea will taste 300% better today than on any normal day."
    );
  }

  // Humidity fortunes
  if (humidity >= 70) {
    fortunes.push(
      "Your hair and the humidity will have an intense disagreement today.",
      "You will feel like you stepped into a giant warm bowl of ramen.",
      "Your mirror will look at your frizz with slight sympathy."
    );
  }

  // Cold fortunes
  if (temp <= 12) {
    fortunes.push(
      "You will spend 20 minutes debating whether you truly need to leave your bed.",
      "Your fingers will demand hot pockets or a steaming beverage immediately.",
      "A warm blanket will become your most trusted companion today."
    );
  }

  // AQI fortunes
  if (aqiVal >= 150) {
    fortunes.push(
      "Your lungs will suggest an indoor movie marathon instead of a jog.",
      "You will wonder if the sky forgot to turn on its transparency layer.",
      "Wearing a mask today will make you look like a mysterious anime protagonist."
    );
  } else if (aqiVal <= 50) {
    fortunes.push(
      "You will take a deep breath outside and think: 'Wait, this actually feels great.'",
      "The universe is giving your city a rare atmospheric reward. Don't waste it!"
    );
  }

  // General quirky fortunes
  fortunes.push(
    `Someone in ${cityName} will look at the sky today and say 'Arey yaar!'`,
    "You will check the weather again in 3 hours even though nothing will change.",
    "A stray gust of wind will briefly test your dignity.",
    "You will see the sun today. Probably."
  );

  return {
    prediction: getRandomItem(fortunes),
    luckyCondition: temp >= 28 ? "Iced Chai 🥤" : temp <= 16 ? "Woolen Socks 🧦" : "Sunglasses 🕶️",
    cosmicWarning: aqiVal >= 150 ? "Don't challenge the smog 😷" : "Don't forget your phone charger 🔋"
  };
};
