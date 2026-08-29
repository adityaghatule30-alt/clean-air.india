// CleanAir India - Location-Aware Local Banter & Cultural Humor Engine
// Provides culturally authentic, friendly regional banter for Indian states, cities, and world metros.

import { getRandomItem } from './personalityEngine.js';

export const LOCATION_BANTER_DATABASE = {
  // 1. BIHAR
  bihar: {
    aliases: ['bihar', 'patna', 'gaya', 'muzaffarpur', 'bhagalpur', 'darbhanga', 'purnia', 'ara', 'begusarai'],
    greetings: [
      "Arre Bihar wale ho kya? 😂",
      "Bihar detected. Ab asli weather report do.",
      "Bihar checking in! Sattu & chai ready rakho.",
      "Pranam Bihar! Let's see what the sky is cooking today."
    ],
    heat: [
      "Bihar unlocked the premium summer package. ☀️",
      "Garmi itni hai ki sattu energy drink mandatory hai. 🥤",
      "Patna temperature is demanding respect right now. 🫠",
      "Chhat pe mat jao, sun is on full aggressive mode."
    ],
    cold: [
      "Bihar ki thand: kambal ke andar se bahar aana mana hai 🥶",
      "Patna morning fog: render distance set to zero.",
      "Litti chokha with ghee is the only survival strategy today."
    ],
    rain: [
      "Bihar rain alert: kachori aur jalebi craving peaking 🌧️",
      "Ganga kinare cloudy breeze is hitting different today.",
      "The clouds over Bihar have decided to show off."
    ],
    aqiBad: [
      "Patna, respectfully... WHAT ARE WE BREATHING? 💀",
      "Bihar air quality has entered its villain arc.",
      "Bhai... mask pehen ke bahar niklo, hawa mein spicy masala hai."
    ],
    aqiGood: [
      "Bihar air passed the vibe check! Rare clean skies 🌿",
      "Patna with clean air? Take a screenshot immediately!"
    ],
    vibe: "Litti chokha on plate, atmospheric drama in the sky."
  },

  // 2. DELHI / NCR
  delhi: {
    aliases: ['delhi', 'new delhi', 'noida', 'gurugram', 'gurgaon', 'faridabad', 'ghaziabad', 'ncr'],
    greetings: [
      "Delhi detected. Ab pollution ka result dekhne aaye ho? 💀",
      "Delhi wale weather nahi, seedha AQI check karte hain.",
      "Dilli meri jaan... par hawa thodi questionable hai.",
      "Capital city status: inspecting the atmospheric drama."
    ],
    heat: [
      "Dilli ki garmi: straight out of tandoor. 🍗",
      "Connaught Place asphalt is currently preheated.",
      "AC on 16°C and prayers are the only plan today."
    ],
    cold: [
      "Delhi ki sardi has entered the chat 🥶",
      "Monkey cap & leather jacket season in full glory.",
      "Dilli sardi + hot momos = absolute peak existence."
    ],
    rain: [
      "Delhi rain: Minto bridge watching nervously 🌧️",
      "Barish aayi nahi ki chai-pakode trending on top.",
      "Dilli weather turned romantic for 15 minutes."
    ],
    aqiBad: [
      "Delhi said: visibility is completely optional. 💀",
      "AQI numbers looking like high school board exam marks.",
      "Dhundh nahi, Dilli ka standard Instagram filter hai.",
      "Bhai... parathe khao, mask lagao, ghar pe raho."
    ],
    aqiGood: [
      "Delhi air is clean?! Stop everything and look at the sky! 🎉",
      "Blue skies over India Gate! Historic moment recorded."
    ],
    vibe: "Parathe on the table, pollution in the review."
  },

  // 3. MUMBAI & MAHARASHTRA
  mumbai: {
    aliases: ['mumbai', 'bombay', 'thane', 'navi mumbai', 'kalyan'],
    greetings: [
      "Mumbai detected. Baarish ka boss fight loading. 🌧️",
      "Mumbai mein ho? Umbrella ko ID card samjho.",
      "Bambai nagariya: where humidity is free with every breath.",
      "Local train running status & weather sync check."
    ],
    heat: [
      "Mumbai heat + humidity: walking inside a warm pressure cooker. ♨️",
      "Marine Drive sunset looks great, but your shirt is soaked.",
      "Tender coconut vendors doing peak business today."
    ],
    cold: [
      "Mumbai people wearing sweaters at 23°C 🧥😂",
      "Winter in Mumbai: switching AC fan from speed 5 to speed 3.",
      "Pleasant breeze at Bandstand today!"
    ],
    rain: [
      "Mumbai has activated monsoon boss mode! 🌧️",
      "Hindmata waterlogged? Just Mumbai monsoon tradition.",
      "Vada pav & cutting chai weather officially certified. ☕",
      "Local train delay alert: auto-anticipated."
    ],
    aqiBad: [
      "Mumbai sea breeze is on vacation, air is getting spicy 😷",
      "Skyline looking a little crunchy today, Marine Drive."
    ],
    aqiGood: [
      "Arabian sea breeze working overtime! Crisp clean air 🌊",
      "Marine Drive breeze feels like a million bucks today."
    ],
    vibe: "Cutting chai in hand, navigating humid Mumbai realities."
  },

  // 4. PUNE & MAHARASHTRA INTERIOR
  pune: {
    aliases: ['pune', 'punekar', 'pcmc', 'pimpri', 'chinchwad', 'nagpur', 'nashik', 'aurangabad', 'sambhajinagar', 'kolhapur', 'solapur'],
    greetings: [
      "Pune detected. 1 PM to 4 PM nap time weather check. 😴",
      "Puneri banter loaded: Weather is good, traffic not so much.",
      "Kothrud to Viman Nagar: atmospheric status synced.",
      "Maharashtra interior: Misal pav energy fueling the day."
    ],
    heat: [
      "Puneri sun giving strong opinions today. ☀️",
      "Nagpur heat mode: even tarri poha won't cool you down.",
      "Nashik vineyards soaking up maximum solar energy."
    ],
    cold: [
      "Pune winter mornings: Tekdi walk weather unlocked! 🌲",
      "Pleasant chill across Deccan Gymkhana."
    ],
    rain: [
      "Pune drizzle: FC Road cutting chai sessions commence ☕",
      "Sinhagad fort weather is calling your name!"
    ],
    aqiBad: [
      "Pune air is getting suspicious. Mask up around Swargate! 😷",
      "Punekars would like to speak to the weather manager."
    ],
    aqiGood: [
      "Pristine Tekdi vibes! Fresh air circulating freely 🌿",
      "Weather so nice, even Puneri boards can't complain."
    ],
    vibe: "Misal pav breakfast, pleasant evening breeze."
  },

  // 5. BENGALURU & KARNATAKA
  bengaluru: {
    aliases: ['bengaluru', 'bangalore', 'mysuru', 'mysore', 'mangaluru', 'mangalore', 'hubballi', 'belagavi', 'udupi'],
    greetings: [
      "Bengaluru detected. Silk Board traffic weather check 🚗",
      "Bengaluru weather flexing on the rest of India again.",
      "Weather is 10/10, shame about Outer Ring Road.",
      "Filter coffee brewing while checking the clouds. ☕"
    ],
    heat: [
      "Bengaluru temperature crossed 30°C and residents are in shock.",
      "Fans turned on in Indiranagar. Unprecedented times."
    ],
    cold: [
      "Peak Bengaluru cozy weather: hoodie + hot filter coffee. 🧥",
      "Cubbon Park morning stroll certified 10/10."
    ],
    rain: [
      "Bengaluru rain has entered the chat. Traffic is celebrating. 🌧️",
      "Rain detected: auto rickshaw fares just went up 300%.",
      "Drizzle in Koramangala, chai on the balcony."
    ],
    aqiBad: [
      "Silk Board emissions caught up with the AQI meter 💀",
      "Tech parks looking a bit hazy today."
    ],
    aqiGood: [
      "Cubbon Park clean oxygen blessing your lungs today! 🌿",
      "Air so fresh you want to write code outside."
    ],
    vibe: "Filter coffee in hand, smug about our superior weather."
  },

  // 6. TAMIL NADU & CHENNAI
  tamilnadu: {
    aliases: ['chennai', 'madras', 'tamil nadu', 'coimbatore', 'madurai', 'trichy', 'salem', 'tirunelveli'],
    greetings: [
      "Vanakkam Chennai! Filter kaapi weather status check ☕",
      "Chennai detected. Sun is operating on maximum overdrive.",
      "Marina Beach breeze inspects the afternoon atmosphere.",
      "Tamil Nadu checking in: Idli, sambar, and sunny skies."
    ],
    heat: [
      "Chennai heat: Agni Natchathiram energy all year round. ☀️",
      "Filter kaapi + AC room: the only approved survival toolkit.",
      "Sun said: Vanakkam, now please sweat."
    ],
    cold: [
      "Chennai winter: 24°C is freezing for us! 🥶",
      "Pleasant evening breeze at Besant Nagar beach."
    ],
    rain: [
      "Chennai rain: Marina waves watching closely 🌧️",
      "Hot crispy medu vada weather officially unlocked."
    ],
    aqiBad: [
      "Chennai humidity trap: air feeling a bit heavy today.",
      "Take it easy around Mount Road commutes."
    ],
    aqiGood: [
      "Bay of Bengal coastal breeze sweeping all dust away! 🌊",
      "Marina beach air is crisp, fresh, and breezy."
    ],
    vibe: "Strong filter coffee, respecting the coastal sun."
  },

  // 7. WEST BENGAL & KOLKATA
  bengal: {
    aliases: ['kolkata', 'calcutta', 'west bengal', 'howrah', 'siliguri', 'darjeeling', 'durgapur', 'asansol'],
    greetings: [
      "Kolkata detected. Cha & adda weather inspection ☕",
      "Kolkata and clouds: a classic romantic collaboration.",
      "Roshogolla sweet, afternoon weather spicy!",
      "Howrah Bridge stands tall in today's atmosphere."
    ],
    heat: [
      "Kolkata summer humidity: walking inside a warm mist. ♨️",
      "Mishti doi and cold water are essential supplies today."
    ],
    cold: [
      "Kolkata winter: monkey cap + muffler season arrived! 🧣",
      "Park Street lights and crisp cool evening breeze."
    ],
    rain: [
      "Kolkata rain: Khichuri, ilish maach & telebhaja alert! 🐟",
      "Tram lines and raindrops: pure retro cinema vibe.",
      "Rain outside: adda on the balcony reaches peak form."
    ],
    aqiBad: [
      "Kolkata air quality having a bit of an existential crisis 😷",
      "Haze over Victoria Memorial: stay masked up."
    ],
    aqiGood: [
      "Maidan breeze is crisp and clean today! Go for a walk 🌿",
      "Clear blue skies over the Hooghly river."
    ],
    vibe: "Rooftop adda in session, tea glass always full."
  },

  // 8. RAJASTHAN
  rajasthan: {
    aliases: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'kota', 'bikaner', 'ajmer', 'jaisalmer'],
    greetings: [
      "Khamma Ghani Rajasthan! Sun already knows what's up ☀️",
      "Rajasthan detected. Desert atmosphere checking in.",
      "Pink City skies under atmospheric scrutiny.",
      "Dal baati churma energy powering the weather inspection."
    ],
    heat: [
      "Rajasthan DLC unlocked. Sun has chosen maximum power! ☀️💀",
      "Itni garmi? Rajasthan residents were born ready for this.",
      "Hawa Mahal breeze doing overtime trying to cool things down."
    ],
    cold: [
      "Desert night chill: freezing cold under open starry skies ❄️",
      "Jaipur winter morning: hot kachori is mandatory."
    ],
    rain: [
      "Barish in Rajasthan: peacock dancing weather unlocked! 🦚",
      "Udaipur lakes looking absolutely majestic in the rain."
    ],
    aqiBad: [
      "Dust and dry winds teaming up: mask up in Jaipur! 😷",
      "Air is carrying desert dust particles today."
    ],
    aqiGood: [
      "Udaipur lake breeze delivering fresh, clean mountain air ⛵",
      "Aravali hills looking crisp and clear today!"
    ],
    vibe: "Royal heritage pride, desert endurance mode."
  },

  // 9. PUNJAB & CHANDIGARH
  punjab: {
    aliases: ['punjab', 'chandigarh', 'amritsar', 'ludhiana', 'jalandhar', 'patiala', 'bathinda'],
    greetings: [
      "Sat Sri Akal Punjab! Weather bhi thoda energetic lag raha hai 😂",
      "Punjab detected. Big glass lassi weather status synced.",
      "Amritsar checking in: Golden Temple serenity in the air.",
      "Gedi route weather review commences."
    ],
    heat: [
      "Punjab heat: sun is flexing like a gym bro. ☀️💪",
      "Chilled sweet lassi is the only valid hydration strategy."
    ],
    cold: [
      "Punjab di sardi: Sarson da saag & makki di roti season! 🫓",
      "Fog so thick, can't even see the tractor ahead 🚜❄️"
    ],
    rain: [
      "Punjab monsoon: lush green mustard fields celebrating 🌾",
      "Amritsari kulcha weather officially declared."
    ],
    aqiBad: [
      "Punjab air is demanding a breather: stay safe indoors 😷",
      "Smog alert: keep the air purifiers spinning."
    ],
    aqiGood: [
      "Fresh village breeze: clean oxygen on full blast! 🌿",
      "Clear blue skies over the fields."
    ],
    vibe: "High energy, rich butter, tackling the day full throttle."
  },

  // 10. KERALA
  kerala: {
    aliases: ['kerala', 'kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'kozhikode', 'calicut', 'thrissur', 'alappuzha'],
    greetings: [
      "Namaskaram Kerala! God's own country weather check 🌴",
      "Kerala detected. Coconut palms swaying in the forecast.",
      "Kochi backwaters atmosphere inspection live.",
      "Kattan chaya & pazham pori vibes ready! ☕"
    ],
    heat: [
      "Kerala humidity hugging you with tropical intensity ♨️",
      "Tender coconut is the official drink of survival today."
    ],
    cold: [
      "Munnar hill station chill is perfection right now! 🌲",
      "Pleasant coastal evening breeze."
    ],
    rain: [
      "Kerala monsoon: nature's green filter set to 100% 🌧️🌴",
      "Rain on backwaters: pure cinematic poetry.",
      "Hot parotta & beef/veg curry rain weather unlocked."
    ],
    aqiBad: [
      "Even coastal paradise has occasional hazy days 😷",
      "Mask up during heavy city traffic commutes."
    ],
    aqiGood: [
      "Backwaters oxygen: cleanest breath in the country! 🌿",
      "Nature is showing off in God's Own Country today."
    ],
    vibe: "Lush green scenery, sound of raindrops on palm leaves."
  },

  // 11. GUJARAT
  gujarat: {
    aliases: ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'baroda', 'rajkot', 'bhavnagar', 'gandhinagar'],
    greetings: [
      "Kem Chho Gujarat! Dhokla & fafda weather approved 🪁",
      "Gujarat detected. Business-minded weather analysis.",
      "Ahmedabad checking in: Maximum ROI on outdoor time.",
      "Surat diamond energy powering today's forecast."
    ],
    heat: [
      "Ahmedabad heat: staying indoors is a smart business deal ☀️",
      "Chaas (buttermilk) consumption at record highs today.",
      "Sabarmati riverfront is sizzling under direct sun."
    ],
    cold: [
      "Gujarat winter: Undhiyu and jalebi festival weather! 🍲",
      "Pleasant morning chill in Gandhinagar."
    ],
    rain: [
      "Gujarat monsoon: Garba energy even in the rain 💃🌧️",
      "Surat locho & hot tea rain combination active."
    ],
    aqiBad: [
      "Industrial dust caught up with the atmosphere 😷",
      "Take it easy around busy ring road commutes."
    ],
    aqiGood: [
      "Sabarmati breeze is clean and delightful today! 🌿",
      "Clear skies over the kite capital."
    ],
    vibe: "Fafda-jalebi breakfast, smart moves throughout the day."
  },

  // 12. UTTAR PRADESH
  up: {
    aliases: ['uttar pradesh', 'up', 'lucknow', 'kanpur', 'varanasi', 'banaras', 'agra', 'prayagraj', 'allahabad', 'meerut', 'bareilly'],
    greetings: [
      "UP detected. Tehzeeb se weather check karte hain 🏛️",
      "Muskuraiye, aap Uttar Pradesh ka weather dekh rahe hain.",
      "Banaras ghats & Lucknow sham vibes syncing.",
      "Kanpur leather city energy inspecting the sky."
    ],
    heat: [
      "UP ki dhoop: direct attack without notice ☀️",
      "Nimbu paani and lassi stalls operating on full load.",
      "Tundey kebab dinner after sun sets is the only plan."
    ],
    cold: [
      "UP ki sardi: kanpuriya style muffler bandh lo! 🧣🥶",
      "Ganga ghat morning fog in Banaras looks mystical.",
      "Kullhad chai at 7 AM: pure bliss."
    ],
    rain: [
      "UP rain: samosa & jalebi lines extending out the door 🌧️",
      "Lucknow drizzle: pure poetic atmosphere."
    ],
    aqiBad: [
      "Kanpur/Lucknow air is feeling a bit crunchy today 💀",
      "Mask up! The air has texture today in the Gangetic plains."
    ],
    aqiGood: [
      "Ganga river breeze cleared the skies! Rare clean day 🌿",
      "Lucknow gardens smelling fresh after the breeze."
    ],
    vibe: "Kullhad chai in hand, navigating northern charm."
  },

  // 13. GOA
  goa: {
    aliases: ['goa', 'panaji', 'panjim', 'margao', 'calangute', 'candolim', 'vasco'],
    greetings: [
      "Goa detected. Susegad vibes in the atmosphere 🏖️",
      "Beach shack atmosphere status checking in.",
      "Goa checking in: Work can wait, weather cannot.",
      "Scooter ride breeze synced with satellite."
    ],
    heat: [
      "Goa afternoon sun: stay under palm shade with coconut water 🥥",
      "Beach is warm, sea is inviting."
    ],
    cold: [
      "Goa 'winter': 26°C and everyone is wearing linen shirts.",
      "Crisp coastal breeze on sunset beaches."
    ],
    rain: [
      "Monsoon Goa: green paradise & stormy sea waves 🌧️🌊",
      "Fish curry thali & rain watching from shack."
    ],
    aqiBad: [
      "Rare haze over the coast: even beach shacks notice it.",
    ],
    aqiGood: [
      "Pristine sea salt breeze! Cleanest air on the map 🌊🌿",
      "Breath in that 100% pure Arabian sea oxygen."
    ],
    vibe: "Susegad lifestyle, beach waves in the distance."
  },

  // 14. HIMACHAL & HILL STATIONS
  hills: {
    aliases: ['shimla', 'manali', 'dharamshala', 'himachal', 'uttarakhand', 'dehradun', 'mussoorie', 'rishikesh', 'nainital', 'kashmir', 'srinagar'],
    greetings: [
      "Pahadi air detected! Clean oxygen + Maggie cravings 🍜",
      "Hill station vibes: mountains are looking majestic today.",
      "Srinagar Dal Lake serenity synced with satellite 🛶",
      "Pine tree fragrance in today's mountain breeze."
    ],
    heat: [
      "Even the mountains feel warm today! Global warming alert.",
      "Pleasant mountain warmth for trekking."
    ],
    cold: [
      "Pahadi chill: wood fire & hot kahwa non-negotiable ❄️☕",
      "Snow flurries knocking on the cottage roof."
    ],
    rain: [
      "Mountain rain: clouds rolling right through your balcony ☁️",
      "Steaming hot bowl of noodles weather certified."
    ],
    aqiBad: [
      "Tourist traffic haze: even the hills feel it today.",
    ],
    aqiGood: [
      "Pristine Himalayan air! Lungs are singing in joy 🏔️🌿",
      "Pure pine forest oxygen: 100% natural luxury."
    ],
    vibe: "Steaming hot maggie, misty mountain peaks."
  },

  // 15. TELANGANA & HYDERABAD
  hyderabad: {
    aliases: ['hyderabad', 'telangana', 'secunderabad', 'warangal', 'cyberabad'],
    greetings: [
      "Hyderabad detected. Dum biryani & Irani chai weather ☕🍛",
      "Charminar breeze status check live.",
      "Hitec City techies checking if it's safe to step out.",
      "Osmania biscuit with chai: morning ritual synced."
    ],
    heat: [
      "Hyderabad sun is firing up like a fresh handi of biryani ☀️🔥",
      "Stay indoors in AC till evening Charminar breeze arrives."
    ],
    cold: [
      "Pleasant winter evening in Jubilee Hills.",
      "Irani chai hits 10x better in this cool breeze."
    ],
    rain: [
      "Hyderabad rain: Durgam Cheruvu bridge looking cinematic 🌧️",
      "Mirchi bajji & chai weather officially declared."
    ],
    aqiBad: [
      "Hitec City traffic smog on the rise: mask up! 😷",
      "Air is carrying urban dust today."
    ],
    aqiGood: [
      "Hussain Sagar evening breeze is fresh and clear today! ⛵",
      "Clean skies over the city of pearls."
    ],
    vibe: "Dum biryani lunch, Irani chai evening."
  },

  // 16. GLOBAL ICONS (LONDON, NYC, TOKYO, DUBAI)
  global: {
    aliases: ['london', 'new york', 'nyc', 'tokyo', 'dubai', 'paris', 'singapore', 'sydney', 'toronto'],
    greetings: [
      "Global destination detected! Teleporting around the world 🌐",
      "International atmosphere briefing in progress.",
      "World metro weather inspection live."
    ],
    heat: [
      "Global city heatwave: concrete jungle on blast 🏙️🔥"
    ],
    cold: [
      "Freezing global winter: coats & hot coffee deployed ☕❄️"
    ],
    rain: [
      "Classic rain over the world metro: umbrella essentials ☔"
    ],
    aqiBad: [
      "Major metro emissions detected: air quality needs work 😷"
    ],
    aqiGood: [
      "Pristine metropolitan air today! 🌿"
    ],
    vibe: "International metropolitan pulse, global atmosphere."
  }
};

// Finder helper to match location string to database key with word-boundary awareness
export const findLocationKey = (cityObj) => {
  if (!cityObj) return null;
  const name = (cityObj.name || '').toLowerCase();
  const admin1 = (cityObj.admin1 || '').toLowerCase();
  const country = (cityObj.country || '').toLowerCase();
  const combined = ` ${name} ${admin1} ${country} `.replace(/[^a-z0-9]/g, ' ');

  for (const [key, data] of Object.entries(LOCATION_BANTER_DATABASE)) {
    for (const alias of data.aliases) {
      // Check for whole word match
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      if (regex.test(combined)) {
        return key;
      }
    }
  }
  return null;
};

// Main Location Banter Getter: getLocalBanter(location, weather, aqi, contextType)
export const getLocalBanter = (location, weather, aqi, contextType = 'greeting') => {
  const locKey = findLocationKey(location);
  const cityName = location?.name || 'Your city';

  // Fallback to general city judgment if no specific region matched
  if (!locKey || !LOCATION_BANTER_DATABASE[locKey]) {
    return {
      text: `${cityName} detected. Let's see what the sky has cooked today.`,
      tag: "Local Dispatch 📍"
    };
  }

  const regionData = LOCATION_BANTER_DATABASE[locKey];
  const temp = Math.round(weather?.current?.temperature ?? 26);
  const code = Number(weather?.current?.weatherCode ?? 0);
  const aqiVal = Math.round(aqi?.aqi ?? 50);

  // Weather roasts
  if (contextType === 'weather' || contextType === 'vibe') {
    if ([80, 81, 82, 95, 96, 99, 51, 53, 55, 61, 63, 65].includes(code) && regionData.rain) {
      return { text: getRandomItem(regionData.rain, `local_rain_${locKey}`), tag: "Rain Gossip 🌧️" };
    }
    if (temp >= 34 && regionData.heat) {
      return { text: getRandomItem(regionData.heat, `local_heat_${locKey}`), tag: "Heatwave Banter 🔥" };
    }
    if (temp <= 12 && regionData.cold) {
      return { text: getRandomItem(regionData.cold, `local_cold_${locKey}`), tag: "Chilly Banter 🥶" };
    }
    if (regionData.vibe) {
      return { text: regionData.vibe, tag: "Local Vibe 🎯" };
    }
  }

  // AQI roasts
  if (contextType === 'aqi') {
    if (aqiVal >= 140 && regionData.aqiBad) {
      return { text: getRandomItem(regionData.aqiBad, `local_aqi_bad_${locKey}`), tag: "Air Reality 💀" };
    }
    if (aqiVal <= 50 && regionData.aqiGood) {
      return { text: getRandomItem(regionData.aqiGood, `local_aqi_good_${locKey}`), tag: "Clean Blessing 🌿" };
    }
  }

  // Default greetings / location arrival
  return {
    text: getRandomItem(regionData.greetings, `local_greeting_${locKey}`),
    tag: "Local Banter 🗣️"
  };
};
