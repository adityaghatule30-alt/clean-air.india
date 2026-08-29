// Open-Meteo Weather API integration with Current, Hourly, Daily & Historical/Yesterday data
// Protected by Centralized In-Memory Cache (10-minute TTL)

import { apiCache } from './apiCache.js';

export const fetchWeatherData = async (lat, lon, forceRefresh = false) => {
  const cacheKey = apiCache.generateKey('weather', lat, lon);

  // Check cache first if not forced
  if (!forceRefresh) {
    const cached = apiCache.get(cacheKey);
    if (cached && !cached.isExpired) {
      return {
        ...cached.data,
        _fetchedAt: cached.timestamp,
        _isCached: true
      };
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=1&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo weather request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const current = data.current || {};
    const hourly = data.hourly || {};
    const daily = data.daily || {};
    
    // Find index of current hour in hourly array
    const currentTimeStr = current.time || '';
    let startIndex = 0;
    if (hourly.time && hourly.time.length > 0) {
      const idx = hourly.time.findIndex(t => t >= currentTimeStr);
      startIndex = idx >= 0 ? idx : 0;
    }
    
    // Extract next 24 hours of forecast
    const next24Hours = [];
    const count = Math.min(24, (hourly.time?.length || 0) - startIndex);
    
    for (let i = 0; i < count; i++) {
      const idx = startIndex + i;
      const timeStr = hourly.time[idx];
      const timeObj = new Date(timeStr);
      
      const hourNumber = timeObj.getHours();
      const ampm = hourNumber >= 12 ? 'PM' : 'AM';
      const displayHour = `${hourNumber % 12 || 12}:00 ${ampm}`;
      
      next24Hours.push({
        timeRaw: timeStr,
        displayHour,
        hourNumber,
        temp: Math.round(hourly.temperature_2m?.[idx] ?? current.temperature_2m ?? 25),
        humidity: Math.round(hourly.relative_humidity_2m?.[idx] ?? 50),
        windSpeed: Math.round(hourly.wind_speed_10m?.[idx] ?? current.wind_speed_10m ?? 10),
        weatherCode: hourly.weather_code?.[idx] ?? current.weather_code ?? 0,
      });
    }

    // Daily index 0 is Yesterday (since past_days=1), index 1 is Today
    const yesterdayMax = daily.temperature_2m_max?.[0] != null ? Math.round(daily.temperature_2m_max[0]) : null;
    const yesterdayMin = daily.temperature_2m_min?.[0] != null ? Math.round(daily.temperature_2m_min[0]) : null;
    const todayMax = daily.temperature_2m_max?.[1] != null ? Math.round(daily.temperature_2m_max[1]) : (daily.temperature_2m_max?.[0] != null ? Math.round(daily.temperature_2m_max[0]) : Math.round(current.temperature_2m ?? 28));
    const todayMin = daily.temperature_2m_min?.[1] != null ? Math.round(daily.temperature_2m_min[1]) : (daily.temperature_2m_min?.[0] != null ? Math.round(daily.temperature_2m_min[0]) : Math.round(current.temperature_2m ?? 24));
    
    const tempDiffFromYesterdayMax = yesterdayMax != null ? (todayMax - yesterdayMax) : null;

    const result = {
      current: {
        temperature: Math.round(current.temperature_2m ?? 26),
        apparentTemp: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 26),
        humidity: Math.round(current.relative_humidity_2m ?? 60),
        windSpeed: Math.round(current.wind_speed_10m ?? 12),
        weatherCode: current.weather_code ?? 0,
        time: current.time || new Date().toISOString(),
        todayMax,
        todayMin,
        yesterdayMax,
        yesterdayMin,
        tempDiffFromYesterdayMax
      },
      forecast24h: next24Hours,
      daily: daily,
      timezone: data.timezone || 'Asia/Kolkata',
      _fetchedAt: Date.now(),
      _isCached: false
    };

    // Store in cache
    apiCache.set(cacheKey, result);
    return result;
  } catch (error) {
    // If request fails but stale cache exists, return stale cache gracefully
    const stale = apiCache.get(cacheKey);
    if (stale && stale.data) {
      console.warn("Returning stale cached weather data due to network error:", error);
      return {
        ...stale.data,
        _fetchedAt: stale.timestamp,
        _isStale: true
      };
    }
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
