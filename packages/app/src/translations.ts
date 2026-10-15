export type Lang = 'kn' | 'en';

export const translations = {
  en: {
    appTitle: 'Holamaatu',
    subtitle: 'Smart Farming Assistance for Dharwad',
    offlineStatus: 'Offline-ready',
    loading: 'Loading system...',
    toggleLang: 'ಕನ್ನಡ',
    
    // Navigation
    navChat: 'Advisor Chat',
    navProfile: 'Profile',
    navLogin: 'Login',
    navLogout: 'Logout',

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
    navChat: 'ಸಲಹೆಗಾರ ಚಾಟ್',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    navLogin: 'ಲಾಗಿನ್',
    navLogout: 'ಲಾಗೌಟ್',

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
