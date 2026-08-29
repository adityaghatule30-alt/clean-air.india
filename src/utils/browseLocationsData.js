// Hierarchical Browse Locations Data (Country -> State / Region -> Cities with lat/lon)

export const BROWSE_COUNTRIES = [
  {
    id: "in",
    name: "India 🇮🇳",
    states: [
      {
        name: "Maharashtra",
        cities: [
          { name: "Mumbai", lat: 19.0760, lon: 72.8777, timezone: "Asia/Kolkata", tag: "Bollywood City 🏖️" },
          { name: "Pune", lat: 18.5204, lon: 73.8567, timezone: "Asia/Kolkata", tag: "Oxford of the East 🛵" },
          { name: "Nagpur", lat: 21.1458, lon: 79.0882, timezone: "Asia/Kolkata", tag: "Orange City 🍊" },
          { name: "Nashik", lat: 19.9975, lon: 73.7898, timezone: "Asia/Kolkata", tag: "Wine Capital 🍷" },
          { name: "Chhatrapati Sambhajinagar", lat: 19.8762, lon: 75.3433, timezone: "Asia/Kolkata", tag: "Cave City 🏛️" },
          { name: "Thane", lat: 19.2183, lon: 72.9781, timezone: "Asia/Kolkata", tag: "City of Lakes 🌊" }
        ]
      },
      {
        name: "Delhi NCR",
        cities: [
          { name: "New Delhi", lat: 28.6139, lon: 77.2090, timezone: "Asia/Kolkata", tag: "National Capital 🏛️" },
          { name: "Noida", lat: 28.5355, lon: 77.3910, timezone: "Asia/Kolkata", tag: "IT Hub 🏙️" },
          { name: "Gurugram", lat: 28.4595, lon: 77.0266, timezone: "Asia/Kolkata", tag: "Cyber City 💼" },
          { name: "Faridabad", lat: 28.4089, lon: 77.3178, timezone: "Asia/Kolkata", tag: "Industrial Heart 🏭" }
        ]
      },
      {
        name: "Karnataka",
        cities: [
          { name: "Bengaluru", lat: 12.9716, lon: 77.5946, timezone: "Asia/Kolkata", tag: "Silicon Valley 💻" },
          { name: "Mysuru", lat: 12.2958, lon: 76.6394, timezone: "Asia/Kolkata", tag: "Palace City 🏰" },
          { name: "Mangaluru", lat: 12.9141, lon: 74.8560, timezone: "Asia/Kolkata", tag: "Coastal Port 🌊" },
          { name: "Hubballi", lat: 15.3647, lon: 75.1240, timezone: "Asia/Kolkata", tag: "Commercial Hub 🚂" }
        ]
      },
      {
        name: "Tamil Nadu",
        cities: [
          { name: "Chennai", lat: 13.0827, lon: 80.2707, timezone: "Asia/Kolkata", tag: "Detroit of Asia 🚗" },
          { name: "Coimbatore", lat: 11.0168, lon: 76.9558, timezone: "Asia/Kolkata", tag: "Manchester of South 🏭" },
          { name: "Madurai", lat: 9.9252, lon: 78.1198, timezone: "Asia/Kolkata", tag: "Temple City 🛕" }
        ]
      },
      {
        name: "West Bengal",
        cities: [
          { name: "Kolkata", lat: 22.5726, lon: 88.3639, timezone: "Asia/Kolkata", tag: "City of Joy 🎭" },
          { name: "Howrah", lat: 22.5958, lon: 88.2636, timezone: "Asia/Kolkata", tag: "Bridge Hub 🌉" },
          { name: "Siliguri", lat: 26.7271, lon: 88.3953, timezone: "Asia/Kolkata", tag: "Tea Gateway 🍃" },
          { name: "Darjeeling", lat: 27.0410, lon: 88.2663, timezone: "Asia/Kolkata", tag: "Himalayan Queen 🏔️" }
        ]
      },
      {
        name: "Telangana",
        cities: [
          { name: "Hyderabad", lat: 17.3850, lon: 78.4867, timezone: "Asia/Kolkata", tag: "Biryani Capital 🍛" },
          { name: "Warangal", lat: 17.9689, lon: 79.5941, timezone: "Asia/Kolkata", tag: "Kakatiya Heritage 🏰" }
        ]
      },
      {
        name: "Gujarat",
        cities: [
          { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, timezone: "Asia/Kolkata", tag: "Heritage City 🪁" },
          { name: "Surat", lat: 21.1702, lon: 72.8311, timezone: "Asia/Kolkata", tag: "Diamond City 💎" },
          { name: "Vadodara", lat: 22.3072, lon: 73.1812, timezone: "Asia/Kolkata", tag: "Cultural Capital 🎨" }
        ]
      },
      {
        name: "Rajasthan",
        cities: [
          { name: "Jaipur", lat: 26.9124, lon: 75.7873, timezone: "Asia/Kolkata", tag: "Pink City 👑" },
          { name: "Udaipur", lat: 24.5854, lon: 73.7125, timezone: "Asia/Kolkata", tag: "City of Lakes ⛵" },
          { name: "Jodhpur", lat: 26.2389, lon: 73.0243, timezone: "Asia/Kolkata", tag: "Blue City 🏰" }
        ]
      },
      {
        name: "Himachal Pradesh & J&K",
        cities: [
          { name: "Shimla", lat: 31.1048, lon: 77.1734, timezone: "Asia/Kolkata", tag: "Summer Capital 🌲" },
          { name: "Manali", lat: 32.2432, lon: 77.1892, timezone: "Asia/Kolkata", tag: "Snow Paradise ❄️" },
          { name: "Dharamshala", lat: 32.2190, lon: 76.3234, timezone: "Asia/Kolkata", tag: "Little Lhasa 🧘" },
          { name: "Srinagar", lat: 34.0837, lon: 74.7973, timezone: "Asia/Kolkata", tag: "Paradise on Earth 🛶" },
          { name: "Jammu", lat: 32.7266, lon: 74.8570, timezone: "Asia/Kolkata", tag: "City of Temples 🛕" }
        ]
      },
      {
        name: "Goa & Kerala",
        cities: [
          { name: "Panaji", lat: 15.4909, lon: 73.8278, timezone: "Asia/Kolkata", tag: "Beach Capital 🏖️" },
          { name: "Kochi", lat: 9.9312, lon: 76.2673, timezone: "Asia/Kolkata", tag: "Queen of Arabian Sea ⛵" },
          { name: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366, timezone: "Asia/Kolkata", tag: "Evergreen City 🌴" }
        ]
      }
    ]
  },
  {
    id: "us",
    name: "United States 🇺🇸",
    states: [
      {
        name: "California",
        cities: [
          { name: "Los Angeles", lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles", tag: "Hollywood 🎬" },
          { name: "San Francisco", lat: 37.7749, lon: -122.4194, timezone: "America/Los_Angeles", tag: "Golden Gate 🌉" },
          { name: "San Diego", lat: 32.7157, lon: -117.1611, timezone: "America/Los_Angeles", tag: "Sunny Coast ☀️" }
        ]
      },
      {
        name: "New York",
        cities: [
          { name: "New York City", lat: 40.7128, lon: -74.0060, timezone: "America/New_York", tag: "The Big Apple 🍎" },
          { name: "Buffalo", lat: 42.8864, lon: -78.8784, timezone: "America/New_York", tag: "Snow Capital ❄️" }
        ]
      },
      {
        name: "Texas & Illinois",
        cities: [
          { name: "Austin", lat: 30.2672, lon: -97.7431, timezone: "America/Chicago", tag: "Live Music 🎸" },
          { name: "Houston", lat: 29.7604, lon: -95.3698, timezone: "America/Chicago", tag: "Space City 🚀" },
          { name: "Chicago", lat: 41.8781, lon: -87.6298, timezone: "America/Chicago", tag: "Windy City 💨" }
        ]
      },
      {
        name: "Washington & Florida",
        cities: [
          { name: "Seattle", lat: 47.6062, lon: -122.3321, timezone: "America/Los_Angeles", tag: "Emerald City ☕" },
          { name: "Miami", lat: 25.7617, lon: -80.1918, timezone: "America/New_York", tag: "Magic City 🌴" }
        ]
      }
    ]
  },
  {
    id: "uk",
    name: "United Kingdom 🇬🇧",
    states: [
      {
        name: "England",
        cities: [
          { name: "London", lat: 51.5074, lon: -0.1278, timezone: "Europe/London", tag: "Big Ben & Tea 🫖" },
          { name: "Manchester", lat: 53.4808, lon: -2.2426, timezone: "Europe/London", tag: "Football Capital ⚽" },
          { name: "Birmingham", lat: 52.4862, lon: -1.8904, timezone: "Europe/London", tag: "Peaky Blinders 🏭" }
        ]
      },
      {
        name: "Scotland",
        cities: [
          { name: "Edinburgh", lat: 55.9533, lon: -3.1883, timezone: "Europe/London", tag: "Castle City 🏰" },
          { name: "Glasgow", lat: 55.8642, lon: -4.2518, timezone: "Europe/London", tag: "Clyde Port 🎵" }
        ]
      }
    ]
  },
  {
    id: "jp",
    name: "Japan 🇯🇵",
    states: [
      {
        name: "Kanto & Kansai",
        cities: [
          { name: "Tokyo", lat: 35.6762, lon: 139.6503, timezone: "Asia/Tokyo", tag: "Neon Metropolis 🗼" },
          { name: "Yokohama", lat: 35.4437, lon: 139.6380, timezone: "Asia/Tokyo", tag: "Harbor City 🚢" },
          { name: "Osaka", lat: 34.6937, lon: 135.5023, timezone: "Asia/Tokyo", tag: "Street Food 🍱" },
          { name: "Kyoto", lat: 35.0116, lon: 135.7681, timezone: "Asia/Tokyo", tag: "Ancient Temples ⛩️" }
        ]
      }
    ]
  },
  {
    id: "uae",
    name: "United Arab Emirates 🇦🇪",
    states: [
      {
        name: "Emirates",
        cities: [
          { name: "Dubai", lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai", tag: "Burj Khalifa 🏙️" },
          { name: "Abu Dhabi", lat: 24.4539, lon: 54.3773, timezone: "Asia/Dubai", tag: "Capital Oasis 🕌" }
        ]
      }
    ]
  },
  {
    id: "global",
    name: "Global Icons 🌐",
    states: [
      {
        name: "World Metros",
        cities: [
          { name: "Singapore", lat: 1.3521, lon: 103.8198, timezone: "Asia/Singapore", tag: "Garden City 🦁" },
          { name: "Sydney", lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney", tag: "Opera House 🦘" },
          { name: "Paris", lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris", tag: "City of Light 🥐" },
          { name: "Toronto", lat: 43.6532, lon: -79.3832, timezone: "America/Toronto", tag: "Maple Capital 🍁" }
        ]
      }
    ]
  }
];
