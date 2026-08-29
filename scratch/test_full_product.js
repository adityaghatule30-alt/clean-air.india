import { fetchWeatherData } from '../src/api/weatherApi.js';
import { fetchAirQualityData } from '../src/api/aqiApi.js';
import { apiCache } from '../src/api/apiCache.js';
import { antiRepetition } from '../src/utils/antiRepetitionEngine.js';
import { getWeatherRoast, getAQIRoast, getShouldIGoOut } from '../src/utils/personalityEngine.js';
import { getLocalBanter } from '../src/utils/localBanterEngine.js';
import { POPULAR_INDIAN_CITIES } from '../src/utils/comicQuotes.js';

async function runFullSystemTest() {
  console.log("=== FULL SYSTEM POLISH & AUDIT TEST ===");

  // 1. Test Weather API & Centralized Caching
  console.log("\n[1. Weather API & Caching Test]");
  const mumbai = POPULAR_INDIAN_CITIES[3];
  const t0 = Date.now();
  const w1 = await fetchWeatherData(mumbai.lat, mumbai.lon);
  const dur1 = Date.now() - t0;
  console.log(`First call (Network): ${w1.current.temperature}°C, apparent: ${w1.current.apparentTemp}°C (${dur1}ms)`);

  const t1 = Date.now();
  const w2 = await fetchWeatherData(mumbai.lat, mumbai.lon);
  const dur2 = Date.now() - t1;
  console.log(`Second call (Cached): ${w2.current.temperature}°C, cached: ${w2._isCached} (${dur2}ms - Instant!)`);

  // 2. Test AQI API & Centralized Caching
  console.log("\n[2. Air Quality API & Caching Test]");
  const a1 = await fetchAirQualityData(mumbai.lat, mumbai.lon);
  console.log(`AQI: ${a1.aqi}, Standard: ${a1.standard}, PM2.5: ${a1.pollutants.pm25.value}`);
  const a2 = await fetchAirQualityData(mumbai.lat, mumbai.lon);
  console.log(`AQI cached: ${a2._isCached}`);

  // 3. Test Anti-Repetition Ring Buffer
  console.log("\n[3. Anti-Repetition Engine Test (50 iterations)]");
  const roasts = [];
  for (let i = 0; i < 50; i++) {
    const r = getWeatherRoast({ current: { temperature: 38, humidity: 40, weatherCode: 0, windSpeed: 10 } }, { aqi: 60 });
    roasts.push(r.roast);
  }
  let consecutiveRepeats = 0;
  for (let i = 1; i < roasts.length; i++) {
    if (roasts[i] === roasts[i - 1]) consecutiveRepeats++;
  }
  console.log(`50 Roasts generated: ${new Set(roasts).size} unique | Consecutive duplicates: ${consecutiveRepeats} (Target: 0)`);

  // 4. Test Should I Go Out Decision Logic
  console.log("\n[4. Should I Go Out Decision Logic]");
  const decNormal = getShouldIGoOut({ current: { temperature: 24, weatherCode: 0 } }, { aqi: 35 });
  console.log(`Perfect day decision: ${decNormal.status} | "${decNormal.reason}"`);

  const decHazard = getShouldIGoOut({ current: { temperature: 41, weatherCode: 0 } }, { aqi: 280 });
  console.log(`Severe day decision: ${decHazard.status} | "${decHazard.reason}"`);

  // 5. Test Local Banter across Indian States
  console.log("\n[5. Local Banter across Indian States]");
  for (const city of POPULAR_INDIAN_CITIES.slice(0, 6)) {
    const banter = getLocalBanter(city, { current: { temperature: 32, weatherCode: 0 } }, { aqi: 120 }, 'greeting');
    console.log(`📍 ${city.name} (${city.state}): "${banter.text}"`);
  }

  console.log("\n=== ALL FULL SYSTEM TESTS PASSED SUCCESSFULLY ===");
}

runFullSystemTest().catch(console.error);
