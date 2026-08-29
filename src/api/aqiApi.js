// Open-Meteo Air Quality API Integration with Current, Pollutants, Hourly & Historical data
// Protected by Centralized In-Memory Cache (10-minute TTL)

import { apiCache } from './apiCache.js';

export const fetchAirQualityData = async (lat, lon, forceRefresh = false) => {
  const cacheKey = apiCache.generateKey('aqi', lat, lon);

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
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi&hourly=pm10,pm2_5,us_aqi&past_days=1&timezone=auto`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo Air Quality request failed with status ${res.status}`);
    }

    const data = await res.json();
    const cur = data.current || {};
    const units = data.current_units || {};
    const hourly = data.hourly || {};

    // Current AQI (US EPA Standard)
    const currentAqi = Math.round(cur.us_aqi ?? calculateAqiFromPm25(cur.pm2_5 ?? 25));

    // Calculate Yesterday's average AQI from the first 24 hours of hourly data
    let yesterdayAvgAqi = null;
    let aqiChange = null;
    let aqiChangePct = null;

    if (hourly.us_aqi && hourly.us_aqi.length >= 24) {
      const yesterdaySlice = hourly.us_aqi.slice(0, 24).filter(v => v !== null && !isNaN(v));
      if (yesterdaySlice.length > 0) {
        yesterdayAvgAqi = Math.round(yesterdaySlice.reduce((a, b) => a + b, 0) / yesterdaySlice.length);
        aqiChange = currentAqi - yesterdayAvgAqi;
        aqiChangePct = yesterdayAvgAqi > 0 ? Number(((aqiChange / yesterdayAvgAqi) * 100).toFixed(1)) : 0;
      }
    }

    // Format local updated time
    let updatedTimeFormatted = 'Just now';
    if (cur.time) {
      try {
        const d = new Date(cur.time);
        updatedTimeFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      } catch (e) {}
    }

    const result = {
      aqi: currentAqi,
      standard: 'US EPA AQI Standard',
      updatedAt: updatedTimeFormatted,
      rawTime: cur.time,
      timezone: data.timezone || 'Asia/Kolkata',
      yesterdayAvgAqi,
      aqiChange,
      aqiChangePct,
      pollutants: {
        pm25: { 
          value: cur.pm2_5 != null ? Number(cur.pm2_5.toFixed(1)) : 12.0, 
          unit: units.pm2_5 || 'µg/m³', 
          label: 'PM2.5', 
          full: 'Fine Respirable Particulates' 
        },
        pm10: { 
          value: cur.pm10 != null ? Number(cur.pm10.toFixed(1)) : 25.0, 
          unit: units.pm10 || 'µg/m³', 
          label: 'PM10', 
          full: 'Inhalable Coarse Dust' 
        },
        no2: { 
          value: cur.nitrogen_dioxide != null ? Number(cur.nitrogen_dioxide.toFixed(1)) : 8.0, 
          unit: units.nitrogen_dioxide || 'µg/m³', 
          label: 'NO₂', 
          full: 'Nitrogen Dioxide' 
        },
        so2: { 
          value: cur.sulphur_dioxide != null ? Number(cur.sulphur_dioxide.toFixed(1)) : 4.0, 
          unit: units.sulphur_dioxide || 'µg/m³', 
          label: 'SO₂', 
          full: 'Sulphur Dioxide' 
        },
        o3: { 
          value: cur.ozone != null ? Number(cur.ozone.toFixed(1)) : 35.0, 
          unit: units.ozone || 'µg/m³', 
          label: 'O₃', 
          full: 'Ground-Level Ozone' 
        },
        co: { 
          value: cur.carbon_monoxide != null ? Number(cur.carbon_monoxide.toFixed(1)) : 200, 
          unit: units.carbon_monoxide || 'µg/m³', 
          label: 'CO', 
          full: 'Carbon Monoxide' 
        },
      },
      source: 'Open-Meteo Atmospheric Air Quality',
      _fetchedAt: Date.now(),
      _isCached: false
    };

    // Store in cache
    apiCache.set(cacheKey, result);
    return result;
  } catch (error) {
    // Stale fallback
    const stale = apiCache.get(cacheKey);
    if (stale && stale.data) {
      console.warn("Returning stale cached AQI data due to network error:", error);
      return {
        ...stale.data,
        _fetchedAt: stale.timestamp,
        _isStale: true
      };
    }
    console.error("Error fetching air quality data:", error);
    throw error;
  }
};

// Standard US EPA PM2.5 to AQI formula
function calculateAqiFromPm25(pm25) {
  const c = Math.max(0, Number(pm25) || 0);
  if (c <= 12.0) return Math.round(((50 - 0) / (12.0 - 0.0)) * (c - 0.0) + 0);
  if (c <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
  if (c <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
  if (c <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
  if (c <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
  return Math.round(((500 - 301) / (500.4 - 250.5)) * (c - 250.5) + 301);
}
