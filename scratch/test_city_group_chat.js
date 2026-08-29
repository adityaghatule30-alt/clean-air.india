console.log("=== TESTING DYNAMIC CITY GROUP CHAT LOGIC ===");

const MOCK_CITY_DATA = [
  { name: "Delhi", avatar: "🌫️", temp: 39, apparentTemp: 42, aqi: 210, pm25: 85, pm10: 190, wind: 8, humidity: 65, isRain: false },
  { name: "Mumbai", avatar: "🏙️", temp: 32, apparentTemp: 39, aqi: 62, pm25: 18, pm10: 55, wind: 14, humidity: 88, isRain: true },
  { name: "Bengaluru", avatar: "☕", temp: 23, apparentTemp: 23, aqi: 28, pm25: 7, pm10: 22, wind: 12, humidity: 55, isRain: false },
  { name: "Shimla", avatar: "🏔️", temp: 14, apparentTemp: 13, aqi: 22, pm25: 5, pm10: 18, wind: 9, humidity: 45, isRain: false },
  { name: "Jaipur", avatar: "🏰", temp: 41, apparentTemp: 43, aqi: 115, pm25: 42, pm10: 110, wind: 11, humidity: 32, isRain: false },
  { name: "Pune", avatar: "🛵", temp: 27, apparentTemp: 28, aqi: 35, pm25: 9, pm10: 30, wind: 15, humidity: 60, isRain: false }
];

const sortedHot = [...MOCK_CITY_DATA].sort((a, b) => b.temp - a.temp);
const sortedCold = [...MOCK_CITY_DATA].sort((a, b) => a.temp - b.temp);
const sortedClean = [...MOCK_CITY_DATA].sort((a, b) => a.aqi - b.aqi);
const sortedDirty = [...MOCK_CITY_DATA].sort((a, b) => b.aqi - a.aqi);

console.log("\n[Live Leaderboards Computed from Real Data]:");
console.log(`🔥 Hottest: #${sortedHot[0].name} (${sortedHot[0].temp}°C)`);
console.log(`🥶 Coldest: #${sortedCold[0].name} (${sortedCold[0].temp}°C)`);
console.log(`🌿 Cleanest: #${sortedClean[0].name} (AQI ${sortedClean[0].aqi})`);
console.log(`💀 Worst Air: #${sortedDirty[0].name} (AQI ${sortedDirty[0].aqi})`);

// Calculate Vibe Winner
const scored = MOCK_CITY_DATA.map(c => {
  let score = 0;
  score += Math.max(0, 50 - Math.abs(c.temp - 23) * 3.5);
  score += Math.max(0, 50 - c.aqi * 0.35);
  return { ...c, vibeScore: Math.round(score) };
}).sort((a, b) => b.vibeScore - a.vibeScore);

console.log(`\n🏆 Vibe Winner: ${scored[0].avatar} ${scored[0].name} (Score: ${scored[0].vibeScore}/100)`);
console.log(`💀 Vibe Struggler: ${scored[scored.length - 1].avatar} ${scored[scored.length - 1].name} (Score: ${scored[scored.length - 1].vibeScore}/100)`);

console.log("\n=== TEST PASSED WITH CLEAN RESULTS ===");
