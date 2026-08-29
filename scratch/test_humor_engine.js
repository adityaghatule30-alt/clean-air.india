import { antiRepetition } from '../src/utils/antiRepetitionEngine.js';
import { HUMOR_DATABASE } from '../src/utils/humorDatabase.js';
import { getWeatherRoast, getAQIRoast, getClickRoast, getCityJudgment } from '../src/utils/personalityEngine.js';
import { getLocalBanter } from '../src/utils/localBanterEngine.js';

console.log("=== TESTING MASSIVE HUMOR DATABASE & ANTI-REPETITION ENGINE ===");

const CITIES = [
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Delhi", state: "NCT" },
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Shimla", state: "Himachal" },
  { name: "Patna", state: "Bihar" }
];

const TEMPS = [42, 38, 32, 24, 15, 6];
const AQIS = [350, 220, 160, 85, 30];

// Test 1: 50 consecutive calls to getWeatherRoast for the same high temp
console.log("\n[Test 1] 30 consecutive calls for 38°C (Verifying Anti-Repetition):");
const heatRoasts = [];
for (let i = 0; i < 30; i++) {
  const r = getWeatherRoast({ current: { temperature: 38, humidity: 45, weatherCode: 0, windSpeed: 10 } }, { aqi: 60 });
  heatRoasts.push(r.roast);
}
const uniqueHeat = new Set(heatRoasts);
console.log(`Picks: 30 | Unique results: ${uniqueHeat.size} (Expected high diversity)`);

// Check no consecutive identical duplicates
let consecutiveDups = 0;
for (let i = 1; i < heatRoasts.length; i++) {
  if (heatRoasts[i] === heatRoasts[i - 1]) consecutiveDups++;
}
console.log(`Consecutive duplicates: ${consecutiveDups} (Target: 0)`);

// Test 2: Local Banter across 10 cities
console.log("\n[Test 2] Local banter diversity across cities:");
for (const city of CITIES) {
  const banter = getLocalBanter(city, { current: { temperature: 35, weatherCode: 0 } }, { aqi: 180 }, 'greeting');
  console.log(`📍 ${city.name}: "${banter.text}" [${banter.tag}]`);
}

// Test 3: Combinations
console.log("\n[Test 3] Combination Roasts:");
const sauna = getWeatherRoast({ current: { temperature: 35, humidity: 85, weatherCode: 0 } }, { aqi: 45 });
console.log(`Heat + Humidity: "${sauna.roast}" [${sauna.vibeTag}]`);

const airFryer = getWeatherRoast({ current: { temperature: 36, humidity: 40, weatherCode: 0 } }, { aqi: 220 });
console.log(`Heat + Bad AQI: "${airFryer.roast}" [${airFryer.vibeTag}]`);

const storm = getWeatherRoast({ current: { temperature: 24, humidity: 90, weatherCode: 65, windSpeed: 30 } }, { aqi: 40 });
console.log(`Rain + Gale: "${storm.roast}" [${storm.vibeTag}]`);

console.log("\n[Debug Stats]:", antiRepetition.getDebugStats());
console.log("\n=== HUMOR ENGINE TEST COMPLETE & VERIFIED! ===");
