export type Lang = 'kn' | 'en';

export const translations = {
  en: {
    appTitle: 'Holamaatu',
    subtitle: 'Smart Farming Assistance for Dharwad',
    offlineStatus: 'Offline-ready',
    loading: 'Loading system...',
    toggleLang: 'ಕನ್ನಡ',
    
    // Navigation
    navHome: 'Home',
    navChat: 'Advisor Chat',
    navProfile: 'Profile',
    navLogin: 'Login',
    navLogout: 'Logout',

    // Home Dashboard
    homeGreeting: 'Namaskara',
    homeSubtitle: 'Here is your maize crop advisory summary for today.',
    homeCropStatusTitle: 'Crop & Soil Status',
    homeCropStage: 'Current Stage',
    homeSoilType: 'Soil Type',
    homeWeatherTitle: 'Local Weather Forecast',
    homeWeatherRain: 'Rain (Next 72h)',
    homeWeatherNoRain: 'No rain expected',
    homeWeatherRainExpected: 'Rain expected',
    liveWeatherActive: 'Live Weather Active',
    weatherRainAlert: '🌧️ Rain Alert',
    weatherDryConditions: '☀️ Dry Conditions',
    humidityLabel: 'Humidity',
    windLabel: 'Wind',
    todayLabel: 'Today',
    tomorrowLabel: 'Tomorrow',

    homeQuickActionsTitle: 'Quick Advisory Actions',
    homeActionIrrigation: 'Water Management',
    homeActionIrrigationDesc: 'Depletion check & watering schedule',
    homeActionPest: 'Pest & Fall Armyworm',
    homeActionPestDesc: 'Early symptoms & chemical dosage',
    homeActionFertilizer: 'Fertilizer Dosing',
    homeActionFertilizerDesc: 'Urea, DAP & micronutrient plan',
    homeActionWeather: 'Weather & Sowing',
    homeActionWeatherDesc: 'Precipitation forecast & soil prep',
    homeAskCta: 'Ask Holamaatu Advisor',
    homeAskCtaSub: 'Voice or text query in Kannada / English',
    homeTipsTitle: 'Smart Agronomy Tips for Dharwad',

    // Sidebar
    sidebarProfileTitle: 'Active Profile',
    sidebarLiveWeather: 'Live Weather',
    sidebar72hRain: '72h Rain',
    sidebarTips: [
      'Check soil moisture before applying nitrogen fertilizer.',
      'Scout regularly for Fall Armyworm during vegetative stage.',
      'Ensure proper field drainage if heavy rainfall is forecasted.'
    ],

    // Login Page
    loginTitle: 'Welcome to Holamaatu',
    loginSubtitle: 'Enter your credentials to access personalized crop advisory',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'Enter 10-digit mobile number',
    nameLabel: 'Farmer / Worker Name',
    namePlaceholder: 'e.g. Ramesh Patil',
    districtLabel: 'District / Location',
    stageLabel: 'Current Crop Stage',
    soilLabel: 'Soil Type',
    langPreferenceLabel: 'Preferred Language',
    loginSubmit: 'Sign In / Save Profile',
    guestContinue: 'Continue as Guest',
    alreadyLoggedIn: 'Logged in as',
    
    // Profile Page
    profileTitle: 'Farmer Profile & Settings',
    personalSection: 'Personal Information',
    farmSection: 'Farm Details & Location',
    saveProfile: 'Save Profile Changes',
    profileSavedAlert: 'Profile updated successfully!',
    logoutConfirm: 'Are you sure you want to log out?',

    // Chat / Advisory
    chatPlaceholder: 'Ask your question in English or Kannada...',
    thinking: 'Analyzing crop query...',
    suggestedTopics: 'Suggested Topics',
    noMessagesYet: 'Hello! Ask me any question about maize irrigation, pests, fertilizer, or crop stage.',
    transcriptConfirmTitle: 'Voice Input Received:',
    editTranscript: 'Edit',
    
    // Stage options
    stages: {
      sowing: 'Sowing / Seedling (0-15 days)',
      vegetative: 'Vegetative Growth (15-45 days)',
      flowering: 'Tasseling & Flowering (45-65 days)',
      grainFilling: 'Grain Filling & Maturity (65-90+ days)',
    },
    
    // Districts
    districts: ['Dharwad', 'Hubli', 'Belagavi', 'Haveri', 'Gadag'],
    
    // Soils
    soils: ['Black Soil', 'Red Soil', 'Loamy Soil'],
  },
  kn: {
    appTitle: 'ಹೊಲಮಾತು',
    subtitle: 'ಧಾರವಾಡ ರೈತರಿಗೆ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಲಹೆ',
    offlineStatus: 'ಆಫ್‌ಲೈನ್ ಲಭ್ಯವಿದೆ',
    loading: 'ವ್ಯವಸ್ಥೆ ಸಿದ್ಧಗೊಳ್ಳುತ್ತಿದೆ...',
    toggleLang: 'EN',
    
    // Navigation
    navHome: 'ಮುಖಪುಟ',
    navChat: 'ಸಲಹೆಗಾರ ಚಾಟ್',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    navLogin: 'ಲಾಗಿನ್',
    navLogout: 'ಲಾಗೌಟ್',

    // Home Dashboard
    homeGreeting: 'ನಮಸ್ಕಾರ',
    homeSubtitle: 'ಇಂದಿನ ನಿಮ್ಮ ಮೆಕ್ಕೆಜೋಳ ಕೃಷಿ ಸಲಹಾ ಸಾರಾಂಶ ಇಲ್ಲಿದೆ.',
    homeCropStatusTitle: 'ಬೆಳೆ ಮತ್ತು ಮಣ್ಣಿನ ಸ್ಥಿತಿ',
    homeCropStage: 'ಪ್ರಸ್ತುತ ಬೆಳೆ ಹಂತ',
    homeSoilType: 'ಮಣ್ಣಿನ ವಿಧ',
    homeWeatherTitle: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    homeWeatherRain: 'ಮುಂದಿನ 72 ಗಂಟೆಗಳ ಮಳೆ',
    homeWeatherNoRain: 'ಮಳೆಯ ಸಾಧ್ಯತೆ ಇಲ್ಲ',
    homeWeatherRainExpected: 'ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ ಇದೆ',
    liveWeatherActive: 'ನೇರ ಹವಾಮಾನ ಸಕ್ರಿಯವಾಗಿದೆ',
    weatherRainAlert: '🌧️ ಮಳೆ ಮುನ್ಸೂಚನೆ',
    weatherDryConditions: '☀️ ಒಣ ಹವಾಮಾನ',
    humidityLabel: 'ತೇವಾಂಶ',
    windLabel: 'ಗಾಳಿ',
    todayLabel: 'ಇಂದು',
    tomorrowLabel: 'ನಾಳೆ',

    homeQuickActionsTitle: 'ತ್ವರಿತ ಕೃಷಿ ಸಲಹೆಗಳು',
    homeActionIrrigation: 'ನೀರಾವರಿ ನಿರ್ವಹಣೆ',
    homeActionIrrigationDesc: 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ನೀರಿನ ಯೋಜನೆ',
    homeActionPest: 'ಕೀಟ ಮತ್ತು ಲದ್ದಿ ಹುಳು',
    homeActionPestDesc: 'ರೋಗ ಲಕ್ಷಣಗಳು ಮತ್ತು ಕೀಟನಾಶಕ ಪ್ರಮಾಣ',
    homeActionFertilizer: 'ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ',
    homeActionFertilizerDesc: 'ಯೂರಿಯಾ, ಡಿಎಪಿ ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ವೇಳಾಪಟ್ಟಿ',
    homeActionWeather: 'ಹವಾಮಾನ ಮತ್ತು ಬಿತ್ತನೆ',
    homeActionWeatherDesc: 'ಮಳೆ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಜಮೀನು ಸಿದ್ಧತೆ',
    homeAskCta: 'ಹೊಲಮಾತು ಸಲಹೆಗಾರರನ್ನು ಕೇಳಿ',
    homeAskCtaSub: 'ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯ ಪ್ರಶ್ನೆ',
    homeTipsTitle: 'ಧಾರವಾಡ ರೈತರಿಗೆ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಲಹೆಗಳು',

    // Sidebar
    sidebarProfileTitle: 'ಸಕ್ರಿಯ ಪ್ರೊಫೈಲ್',
    sidebarLiveWeather: 'ನೇರ ಹವಾಮಾನ',
    sidebar72hRain: 'ಮುಂದಿನ 72 ಗಂ ಮಳೆ',
    sidebarTips: [
      'ಸಾರಜನಕ (ಯೂರಿಯಾ) ಗೊಬ್ಬರ ಹಾಕುವ ಮೊದಲು ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ಪರೀಕ್ಷಿಸಿ.',
      'ಬೆಳವಣಿಗೆಯ ಹಂತದಲ್ಲಿ ಲದ್ದಿ ಹುಳು (Fall Armyworm) ಕೀಟದ ಬಾಧೆಯನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ.',
      'ಭಾರಿ ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇದ್ದರೆ ಹೊಲದಲ್ಲಿ ಸರಿಯಾದ ನೀರು ಬಸಿದುಹೋಗುವ ಕಾಲುವೆಗಳನ್ನು ಮಾಡಿ.'
    ],

    // Login Page
    loginTitle: 'ಹೊಲಮಾತು ಗೆ ಸುಸ್ವಾಗತ',
    loginSubtitle: 'ವೈಯಕ್ತಿಕ ಕೃಷಿ ಸಲಹೆ ಪಡೆಯಲು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    phonePlaceholder: '10 ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    nameLabel: 'ರೈತರ / ಕಾರ್ಯಕರ್ತರ ಹೆಸರು',
    namePlaceholder: 'ಉದಾ: ರಮೇಶ್ ಪಾಟೀಲ್',
    districtLabel: 'ಜಿಲ್ಲೆ / ಸ್ಥಳ',
    stageLabel: 'ಪ್ರಸ್ತುತ ಬೆಳೆ ಹಂತ',
    soilLabel: 'ಮಣ್ಣಿನ ವಿಧ',
    langPreferenceLabel: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    loginSubmit: 'ಲಾಗಿನ್ ಮಾಡಿ / ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
    guestContinue: 'ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಯಿರಿ',
    alreadyLoggedIn: 'ಲಾಗಿನ್ ಆಗಿದ್ದಾರೆ',

    // Profile Page
    profileTitle: 'ರೈತರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸಂಯೋಜನೆಗಳು',
    personalSection: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
    farmSection: 'ಜಮೀನು ಮತ್ತು ಬೆಳೆ ವಿವರಗಳು',
    saveProfile: 'ವಿವರಗಳನ್ನು ಉಳಿಸಿ',
    profileSavedAlert: 'ಪ್ರೊಫೈಲ್ ವಿವರಗಳು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲ್ಪಟ್ಟಿವೆ!',
    logoutConfirm: 'ನೀವು ಲಾಗೌಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ?',

    // Chat / Advisory
    chatPlaceholder: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕೇಳಿ...',
    thinking: 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    suggestedTopics: 'ಸೂಚಿಸಿದ ವಿಷಯಗಳು',
    noMessagesYet: 'ನಮಸ್ಕಾರ! ಮೆಕ್ಕೆಜೋಳ ನೀರಾವರಿ, ಕ್ರಿಮಿನಾಶಕ, ಗೊಬ್ಬರ ಅಥವಾ ಬೆಳೆ ಹಂತದ ಬಗ್ಗೆ ಏನೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
    transcriptConfirmTitle: 'ಧ್ವನಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ:',
    editTranscript: 'ತಿದ್ದುಪಡಿ',
    
    // Stage options
    stages: {
      sowing: 'ಬಿತ್ತನೆ / ಸಸಿ ಹಂತ (0-15 ದಿನಗಳು)',
      vegetative: 'ಬೆಳವಣಿಗೆ ಹಂತ (15-45 ದಿನಗಳು)',
      flowering: 'ಹೂವು ಮತ್ತು ತೆನೆ ಹಂತ (45-65 ದಿನಗಳು)',
      grainFilling: 'ಕಾಳು ತುಂಬುವ ಹಂತ (65-90+ ದಿನಗಳು)',
    },
    
    // Districts
    districts: ['Dharwad (ಧಾರವಾಡ)', 'Hubli (ಹುಬ್ಬಳ್ಳಿ)', 'Belagavi (ಬೆಳಗಾವಿ)', 'Haveri (ಹಾವೇರಿ)', 'Gadag (ಗದಗ)'],
    
    // Soils
    soils: ['Black Soil (ಕಪ್ಪು ಮಣ್ಣು)', 'Red Soil (ಕೆಂಪು ಮಣ್ಣು)', 'Loamy Soil (ಎರಡುಮಣ್ಣು)'],
  }
};

// ── Global Localization Helper Functions ──

export const LOCATION_MAP: Record<string, string> = {
  'dharwad': 'ಧಾರವಾಡ',
  'hubli': 'ಹುಬ್ಬಳ್ಳಿ',
  'belagavi': 'ಬೆಳಗಾವಿ',
  'belgaum': 'ಬೆಳಗಾವಿ',
  'haveri': 'ಹಾವೇರಿ',
  'gadag': 'ಗದಗ',
};

export function localizeLocation(location?: string, lang: Lang = 'en'): string {
  if (!location) return lang === 'kn' ? 'ಧಾರವಾಡ' : 'Dharwad';
  if (lang !== 'kn') return location.replace(/\(.*\)/g, '').trim();
  const cleaned = location.replace(/\(.*\)/g, '').trim().toLowerCase();
  return LOCATION_MAP[cleaned] || location;
}

export const STAGE_MAP: Record<string, string> = {
  'sowing': 'ಬಿತ್ತನೆ ಹಂತ',
  'sowing / seedling (0-15 days)': 'ಬಿತ್ತನೆ ಹಂತ (0-15 ದಿನ)',
  'seedling': 'ಸಸಿ ಹಂತ',
  'vegetative': 'ಬೆಳವಣಿಗೆ ಹಂತ',
  'vegetative growth (15-45 days)': 'ಬೆಳವಣಿಗೆ ಹಂತ (15-45 ದಿನ)',
  '30 days': '30 ದಿನಗಳು (ಬೆಳವಣಿಗೆ ಹಂತ)',
  'flowering': 'ಹೂವು ಮತ್ತು ತೆನೆ ಹಂತ',
  'tasseling & flowering (45-65 days)': 'ಹೂವು ಮತ್ತು ತೆನೆ ಹಂತ (45-65 ದಿನ)',
  'grain filling': 'ಕಾಳು ತುಂಬುವ ಹಂತ',
  'grain filling & maturity (65-90+ days)': 'ಕಾಳು ತುಂಬುವ / ಕೊಯ್ಲು ಹಂತ',
  'maturity': 'ಕೊಯ್ಲು ಹಂತ',
};

export function localizeStage(stage?: string, lang: Lang = 'en'): string {
  if (!stage) return lang === 'kn' ? 'ಬೆಳವಣಿಗೆ ಹಂತ' : 'Vegetative';
  if (lang !== 'kn') return stage.replace(/\(.*\)/g, '').trim();
  const cleaned = stage.toLowerCase().trim();
  if (STAGE_MAP[cleaned]) return STAGE_MAP[cleaned];
  for (const [k, v] of Object.entries(STAGE_MAP)) {
    if (cleaned.includes(k)) return v;
  }
  return stage;
}

export const SOIL_MAP: Record<string, string> = {
  'black soil': 'ಕಪ್ಪು ಮಣ್ಣು',
  'black': 'ಕಪ್ಪು ಮಣ್ಣು',
  'red soil': 'ಕೆಂಪು ಮಣ್ಣು',
  'red': 'ಕೆಂಪು ಮಣ್ಣು',
  'loamy soil': 'ಎರಡುಮಣ್ಣು',
  'loamy': 'ಎರಡುಮಣ್ಣು',
};

export function localizeSoil(soil?: string, lang: Lang = 'en'): string {
  if (!soil) return lang === 'kn' ? 'ಕಪ್ಪು ಮಣ್ಣು' : 'Black Soil';
  if (lang !== 'kn') return soil.replace(/\(.*\)/g, '').trim();
  const cleaned = soil.toLowerCase().trim();
  if (SOIL_MAP[cleaned]) return SOIL_MAP[cleaned];
  for (const [k, v] of Object.entries(SOIL_MAP)) {
    if (cleaned.includes(k)) return v;
  }
  return soil;
}

export const WEATHER_COND_MAP: Record<string, string> = {
  'sunny': 'ಬಿಸಿಲು',
  'clear': 'ಸ್ವಚ್ಛ ಆಕಾಶ',
  'partly cloudy': 'ಭಾಗಶಃ ಮೋಡ',
  'cloudy': 'ಮೋಡ ಕವಿದಿದೆ',
  'overcast': 'ದಟ್ಟ ಮೋಡ ಕವಿದಿದೆ',
  'mist': 'ಮಂಜು ಮುಸುಕಿದ ವಾತಾವರಣ',
  'patchy rain nearby': 'ಸಾಧಾರಣ / ಚದುರಿದ ಮಳೆ',
  'patchy rain possible': 'ಚದುರಿದ ಮಳೆಯ ಸಾಧ್ಯತೆ',
  'light rain': 'ಹಗುರ ಮಳೆ',
  'moderate rain': 'ಮಧ್ಯಮ ಮಳೆ',
  'heavy rain': 'ಭಾರಿ ಮಳೆ',
  'patchy light rain': 'ಚದುರಿದ ಹಗುರ ಮಳೆ',
  'moderate rain at times': 'ಕೆಲವೊಮ್ಮೆ ಮಧ್ಯಮ ಮಳೆ',
  'heavy rain at times': 'ಕೆಲವೊಮ್ಮೆ ಭಾರಿ ಮಳೆ',
  'light drizzle': 'ತುಂತುರು ಮಳೆ',
  'thundery outbreaks in nearby': 'ಗುಡುಗು ಸಹಿತ ಮಳೆ',
  'thundery outbreaks possible': 'ಗುಡುಗು ಸಹಿತ ಮಳೆಯ ಸಾಧ್ಯತೆ',
  'fog': 'ದಟ್ಟ ಮಂಜು',
};

export function localizeWeatherCondition(conditionText: string, lang: Lang = 'en'): string {
  if (lang !== 'kn' || !conditionText) return conditionText;
  const key = conditionText.toLowerCase().trim();
  if (WEATHER_COND_MAP[key]) return WEATHER_COND_MAP[key];
  for (const [k, v] of Object.entries(WEATHER_COND_MAP)) {
    if (key.includes(k)) return v;
  }
  return conditionText;
}
