// Geocoding API integration using Open-Meteo & reverse lookups

export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding lookup failed");
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) return [];
    
    return data.results.map(item => ({
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || '',
      lat: item.latitude,
      lon: item.longitude,
      timezone: item.timezone || 'auto',
      countryCode: item.country_code || '',
      displayName: [item.name, item.admin1, item.country].filter(Boolean).join(', ')
    }));
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
};

export const reverseGeocodeCoords = async (lat, lon) => {
  try {
    // Attempt reverse geocoding via bigdatacloud client-side reverse api or openstreetmap
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Your Current Location';
      const state = data.principalSubdivision || '';
      const country = data.countryName || '';
      return {
        name: city,
        admin1: state,
        country: country,
        lat,
        lon,
        displayName: [city, state, country].filter(Boolean).join(', ')
      };
    }
  } catch (err) {
    console.warn("Reverse geocode fallback:", err);
  }
  
  return {
    name: "Detected Hero Base",
    admin1: "HQ",
    country: "Earth",
    lat,
    lon,
    displayName: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`
  };
};
