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
