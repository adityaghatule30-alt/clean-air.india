// LocalStorage helpers for Favorite & Recent Locations

const RECENT_KEY = 'cleanair_recent_locations_v2';
const FAVORITES_KEY = 'cleanair_favorites_locations_v2';

const DEFAULT_RECENTS = [
  { name: "Mumbai", admin1: "Maharashtra", country: "India", lat: 19.0760, lon: 72.8777, timezone: "Asia/Kolkata", tag: "Bollywood Central 🏖️" },
  { name: "Delhi", admin1: "Delhi", country: "India", lat: 28.6139, lon: 77.2090, timezone: "Asia/Kolkata", tag: "Smog Champion 🌫️" },
  { name: "Bengaluru", admin1: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946, timezone: "Asia/Kolkata", tag: "Silicon Valley 💻" },
  { name: "London", admin1: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278, timezone: "Europe/London", tag: "Tea & Rain 🫖" },
  { name: "Tokyo", admin1: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, timezone: "Asia/Tokyo", tag: "Neon Metropolis 🗼" }
];

const DEFAULT_FAVORITES = [
  { name: "Mumbai", admin1: "Maharashtra", country: "India", lat: 19.0760, lon: 72.8777, timezone: "Asia/Kolkata", tag: "Home 🏖️" },
  { name: "Bengaluru", admin1: "Karnataka", country: "India", lat: 12.9716, lon: 77.5946, timezone: "Asia/Kolkata", tag: "Cool Haven 💻" }
];

export const getRecentLocations = () => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return DEFAULT_RECENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_RECENTS;
  } catch (e) {
    return DEFAULT_RECENTS;
  }
};

export const addRecentLocation = (loc) => {
  if (!loc || !loc.name || loc.lat == null || loc.lon == null) return;
  try {
    const current = getRecentLocations();
    // Filter out duplicates based on close coordinates or matching name & country
    const filtered = current.filter(item => 
      !(Math.abs(item.lat - loc.lat) < 0.05 && Math.abs(item.lon - loc.lon) < 0.05) &&
      !(item.name.toLowerCase() === loc.name.toLowerCase() && item.country?.toLowerCase() === loc.country?.toLowerCase())
    );
    const updated = [
      {
        name: loc.name,
        admin1: loc.admin1 || '',
        country: loc.country || 'India',
        lat: Number(loc.lat),
        lon: Number(loc.lon),
        timezone: loc.timezone || 'auto',
        tag: loc.tag || 'Recent Spot 📍'
      },
      ...filtered
    ].slice(0, 8); // Keep up to 8

    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const clearRecentLocations = () => {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch (e) {}
};

export const getFavoriteLocations = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return DEFAULT_FAVORITES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
  } catch (e) {
    return DEFAULT_FAVORITES;
  }
};

export const toggleFavoriteLocation = (loc) => {
  if (!loc || !loc.name) return getFavoriteLocations();
  try {
    const current = getFavoriteLocations();
    const exists = current.some(item => 
      (Math.abs(item.lat - loc.lat) < 0.05 && Math.abs(item.lon - loc.lon) < 0.05) ||
      (item.name.toLowerCase() === loc.name.toLowerCase() && item.country?.toLowerCase() === loc.country?.toLowerCase())
    );

    let updated = [];
    if (exists) {
      updated = current.filter(item => 
        !(Math.abs(item.lat - loc.lat) < 0.05 && Math.abs(item.lon - loc.lon) < 0.05) &&
        !(item.name.toLowerCase() === loc.name.toLowerCase() && item.country?.toLowerCase() === loc.country?.toLowerCase())
      );
    } else {
      updated = [
        ...current,
        {
          name: loc.name,
          admin1: loc.admin1 || '',
          country: loc.country || 'India',
          lat: Number(loc.lat),
          lon: Number(loc.lon),
          timezone: loc.timezone || 'auto',
          tag: loc.tag || 'Saved Star ⭐'
        }
      ];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const isFavoriteLocation = (loc) => {
  if (!loc || !loc.name) return false;
  const current = getFavoriteLocations();
  return current.some(item => 
    (Math.abs(item.lat - loc.lat) < 0.05 && Math.abs(item.lon - loc.lon) < 0.05) ||
    (item.name.toLowerCase() === loc.name.toLowerCase() && item.country?.toLowerCase() === loc.country?.toLowerCase())
  );
};
