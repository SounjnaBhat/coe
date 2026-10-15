import React from 'react';
import {
  translations,
  type Lang,
  localizeLocation,
  localizeStage,
  localizeSoil,
  localizeWeatherCondition
} from '../translations';
import type { UserProfileData } from './LoginPage';
import type { WeatherData } from '../weather';

interface HomePageProps {
  user: UserProfileData;
  lang: Lang;
  onNavigate: (tab: 'home' | 'chat' | 'profile' | 'login') => void;
  onAskTopic: (query: string) => void;
  weatherData: WeatherData | null;
}

const CROP_STAGES = [
  {
    key: 'sowing',
    en: 'Sowing',
    kn: 'ಬಿತ್ತನೆ',
    rangeEn: '0-15d',
    rangeKn: '0-15 ದಿನ',
    matches: ['sowing', 'seedling', '0-15', 'ಬಿತ್ತನೆ', 'ಸಸಿ']
  },
  {
    key: 'vegetative',
    en: 'Vegetative',
    kn: 'ಬೆಳವಣಿಗೆ',
    rangeEn: '15-45d',
    rangeKn: '15-45 ದಿನ',
    matches: ['vegetative', 'growth', '15-45', '30 days', 'v4', 'v6', 'ಬೆಳವಣಿಗೆ', '30']
  },
  {
    key: 'flowering',
    en: 'Flowering',
    kn: 'ಹೂವು / ತೆನೆ',
    rangeEn: '45-65d',
    rangeKn: '45-65 ದಿನ',
    matches: ['flowering', 'tasseling', 'silking', '45-65', 'ಹೂವು', 'ತೆನೆ']
  },
  {
    key: 'maturity',
    en: 'Maturity',
    kn: 'ಕಾಳು / ಕೊಯ್ಲು',
    rangeEn: '65-90d+',
    rangeKn: '65-90+ ದಿನ',
    matches: ['grain', 'filling', 'maturity', 'harvest', '65-90', 'ಕಾಳು', 'ಕೊಯ್ಲು']
  }
];

function getActiveStageIndex(stageStr?: string): number {
  if (!stageStr) return 0;
  const s = stageStr.toLowerCase().trim();

  // Stage 0: Sowing / Seeding (0-15d)
  if (s.includes('sow') || s.includes('seed') || s.includes('0-15') || s.includes('0 - 15') || s.includes('ಬಿತ್ತನೆ') || s.includes('ಸಸಿ')) {
    return 0;
  }

  // Stage 2: Flowering / Tasseling (45-65d) - check 45 before 30/15-45
  if (s.includes('flower') || s.includes('tassel') || s.includes('silk') || s.includes('45') || s.includes('50') || s.includes('55') || s.includes('vt') || s.includes('r1') || s.includes('ಹೂವು') || s.includes('ತೆನೆ')) {
    return 2;
  }

  // Stage 3: Grain Filling / Maturity (65-90d+)
  if (s.includes('grain') || s.includes('fill') || s.includes('matur') || s.includes('harvest') || s.includes('60') || s.includes('65') || s.includes('70') || s.includes('80') || s.includes('90') || s.includes('ಕಾಳು') || s.includes('ಕೊಯ್ಲು')) {
    return 3;
  }

  // Stage 1: Vegetative (15-45d)
  if (s.includes('veg') || s.includes('growth') || s.includes('30') || s.includes('v4') || s.includes('v6') || s.includes('v8') || s.includes('ಬೆಳವಣಿಗೆ') || s.includes('15-45')) {
    return 1;
  }

  // Fallback: parse numeric days
  const match = s.match(/(\d+)/);
  if (match) {
    const days = parseInt(match[1], 10);
    if (days <= 15) return 0;
    if (days <= 40) return 1;
    if (days <= 60) return 2;
    return 3;
  }

  return 0;
}

export function HomePage({ user, lang, onNavigate, onAskTopic, weatherData }: HomePageProps) {
  const t = translations[lang];
  const rain72h = weatherData?.forecastRain72h ?? 0;
  const activeStageIdx = getActiveStageIndex(user.stage);

  const quickActions = [
    {
      id: 'irrigation',
      title: t.homeActionIrrigation,
      desc: t.homeActionIrrigationDesc,
      icon: 'ti-droplet-filled',
      iconColor: '#0284c7',
      bgGradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1), rgba(2, 132, 199, 0.02))',
      query: lang === 'kn' ? 'ಇಂದು ನೀರು ಹಾಕಬೇಕಾ?' : 'Should I irrigate today?'
    },
    {
      id: 'pest',
      title: t.homeActionPest,
      desc: t.homeActionPestDesc,
      icon: 'ti-bug-filled',
      iconColor: '#dc2626',
      bgGradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.02))',
      query: lang === 'kn' ? 'ಲದ್ದಿ ಹುಳು ಕೀಟ ನಿಯಂತ್ರಣ ಹೇಗೆ?' : 'How to control Fall Armyworm pest?'
    },
    {
      id: 'fertilizer',
      title: t.homeActionFertilizer,
      desc: t.homeActionFertilizerDesc,
      icon: 'ti-flask-2-filled',
      iconColor: '#7c3aed',
      bgGradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.02))',
      query: lang === 'kn' ? 'ಮೆಕ್ಕೆಜೋಳಕ್ಕೆ ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ ಎಷ್ಟು?' : 'What is the fertilizer dose for maize?'
    },
    {
      id: 'weather',
      title: t.homeActionWeather,
      desc: t.homeActionWeatherDesc,
      icon: 'ti-cloud-rain',
      iconColor: '#059669',
      bgGradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(5, 150, 105, 0.02))',
      query: lang === 'kn' ? 'ಮುಂದಿನ 3 ದಿನಗಳ ಮಳೆ ಮುನ್ಸೂಚನೆ ಏನು?' : 'What is the rain forecast for next 72 hours?'
    }
  ];

  return (
    <div className="home-container">
      {/* ── Welcome Hero Banner ── */}
      <div className="home-banner-card">
        <div className="home-banner-content">
          <div className="home-badge-row">
            <span className="home-location-pill">
              <i className="ti ti-map-pin" /> {localizeLocation(weatherData?.location || user.location, lang)}
            </span>
            <span className="home-stage-pill">
              🌽 {localizeStage(user.stage, lang)}
            </span>
            {user.soil && (
              <span className="home-soil-pill">
                🌱 {localizeSoil(user.soil, lang)}
              </span>
            )}
            <span className="home-live-pill">
              <span className="live-dot" /> {t.liveWeatherActive}
            </span>
          </div>

          <h2 className="home-welcome-title">
            {t.homeGreeting}, {user.name || (lang === 'kn' ? 'ರೈತರೇ' : 'Farmer')}! 🌾
          </h2>
          <p className="home-welcome-sub">{t.homeSubtitle}</p>
        </div>

        {/* Big Interactive "Ask Holamaatu Advisor" CTA */}
        <div className="home-ask-cta" onClick={() => onNavigate('chat')} role="button" tabIndex={0}>
          <div className="home-ask-cta-left">
            <div className="home-cta-icon-circle">
              <i className="ti ti-microphone" />
            </div>
            <div>
              <div className="home-cta-title">{t.homeAskCta}</div>
              <div className="home-cta-sub">{t.homeAskCtaSub}</div>
            </div>
          </div>
          <div className="home-cta-btn">
            <span>{lang === 'kn' ? 'ಕೇಳಿ' : 'Ask'}</span>
            <i className="ti ti-arrow-right" />
          </div>
        </div>
      </div>

      {/* ── Real-Time Weather & Crop Advisory Grid ── */}
      <div className="home-summary-grid">
        {/* Live Weather Card */}
        <div className="home-summary-card weather-card">
          <div className="home-card-header">
            <h4>
              <i className="ti ti-cloud-storm" style={{ color: '#0284c7' }} />
              {t.homeWeatherTitle} — {localizeLocation(weatherData?.location || 'Dharwad', lang)}
            </h4>
            <span className={`home-status-badge ${rain72h > 5 ? 'rainy' : 'sunny'}`}>
              {rain72h > 5 ? t.weatherRainAlert : t.weatherDryConditions}
            </span>
          </div>

          {weatherData ? (
            <div className="home-weather-body">
              <div className="weather-primary-row">
                <div className="weather-temp-section">
                  <img
                    src={weatherData.conditionIcon}
                    alt={weatherData.conditionText}
                    className="weather-condition-img"
                  />
                  <div>
                    <div className="weather-current-temp">{weatherData.tempC}°C</div>
                    <div className="weather-condition-desc">
                      {localizeWeatherCondition(weatherData.conditionText, lang)}
                    </div>
                  </div>
                </div>

                <div className="weather-stats-column">
                  <div className="weather-stat-item">
                    <i className="ti ti-droplet" />
                    <span>{weatherData.humidity}% {t.humidityLabel}</span>
                  </div>
                  <div className="weather-stat-item">
                    <i className="ti ti-wind" />
                    <span>{weatherData.windKph} km/h {t.windLabel}</span>
                  </div>
                  <div className="weather-stat-item rain-metric">
                    <i className="ti ti-cloud-rain" />
                    <strong>{rain72h} mm / 72h</strong>
                  </div>
                </div>
              </div>

              {/* 3-Day Forecast Strip */}
              <div className="forecast-mini-grid">
                {weatherData.forecastDays.map((fd, i) => (
                  <div key={i} className="forecast-mini-day">
                    <span className="mini-day-title">
                      {fd.date === 'Today' ? t.todayLabel : fd.date === 'Tomorrow' ? t.tomorrowLabel : fd.date}
                    </span>
                    <img src={fd.conditionIcon} alt={fd.conditionText} className="mini-day-icon" />
                    <span className="mini-day-temp">{fd.maxTempC}° / {fd.minTempC}°</span>
                    <span className="mini-day-rain">🌧️ {fd.rainMm} mm</span>
                  </div>
                ))}
              </div>

              <p className="home-weather-tip">
                {rain72h > 10
                  ? (lang === 'kn' ? '⚠️ ಗಮನಾರ್ಹ ಮಳೆ ಮುನ್ಸೂಚನೆ ಇದೆ. ನೀರಾವರಿ ಮತ್ತು ಯೂರಿಯಾ ಸಿಂಪಡಣೆ ಮುಂದೂಡಿ.' : '⚠️ Heavy rain expected. Delay irrigation and pesticide application to prevent runoff.')
                  : (lang === 'kn' ? '✅ ಮುಂದಿನ 3 ದಿನಗಳಲ್ಲಿ ಮಳೆ ಕಡಿಮೆ. ಮಣ್ಣಿನ ತೇವಾಂಶ ಕಡಿಮೆಯಿದ್ದರೆ ನೀರು ನೀಡಿ.' : '✅ Low rainfall in forecast. Check soil moisture depletion and irrigate if required.')}
              </p>
            </div>
          ) : (
            <div className="weather-loading-state">
              <i className="ti ti-loader animate-spin" /> {lang === 'kn' ? 'ನೇರ ಹವಾಮಾನ ಮಾಹಿತಿ ಪಡೆಯಲಾಗುತ್ತಿದೆ...' : 'Loading live Dharwad weather...'}
            </div>
          )}
        </div>

        {/* Crop Stage Progress Card */}
        <div className="home-summary-card crop-card">
          <div className="home-card-header">
            <h4><i className="ti ti-plant-2" style={{ color: '#059669' }} /> {t.homeCropStatusTitle}</h4>
            <span className="home-status-badge active-stage">
              {localizeStage(user.stage, lang)}
            </span>
          </div>

          <div className="crop-details-summary">
            <div className="crop-metric-item">
              <span className="metric-label">{t.homeCropStage}</span>
              <span className="metric-value">🌽 {localizeStage(user.stage, lang)}</span>
            </div>
            <div className="crop-metric-item">
              <span className="metric-label">{t.homeSoilType}</span>
              <span className="metric-value">🌱 {localizeSoil(user.soil, lang)}</span>
            </div>
          </div>

          {/* Dynamic Interactive Crop Timeline */}
          <div className="home-timeline">
            {CROP_STAGES.map((stageItem, idx) => {
              let stepClass = 'timeline-step';
              if (idx < activeStageIdx) stepClass += ' completed';
              else if (idx === activeStageIdx) stepClass += ' current';

              return (
                <div key={stageItem.key} className={stepClass}>
                  <span className="step-dot" />
                  <span className="step-label">
                    {lang === 'kn' ? stageItem.kn : stageItem.en}
                    <br />
                    <small>{lang === 'kn' ? stageItem.rangeKn : stageItem.rangeEn}</small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Quick Advisory Actions ── */}
      <div className="home-section-title">
        <h3><i className="ti ti-sparkles" style={{ color: '#f59e0b' }} /> {t.homeQuickActionsTitle}</h3>
      </div>
      <div className="home-actions-grid">
        {quickActions.map(act => (
          <div
            key={act.id}
            className="home-action-card"
            style={{ background: act.bgGradient }}
            onClick={() => onAskTopic(act.query)}
            role="button"
            tabIndex={0}
          >
            <div className="home-action-icon" style={{ background: `${act.iconColor}22`, color: act.iconColor }}>
              <i className={`ti ${act.icon}`} />
            </div>
            <div className="home-action-info">
              <h4>{act.title}</h4>
              <p>{act.desc}</p>
            </div>
            <div className="home-action-arrow" style={{ color: act.iconColor }}>
              <i className="ti ti-arrow-right" />
            </div>
          </div>
        ))}
      </div>

      {/* ── North Karnataka Agronomy Tips ── */}
      <div className="home-tips-card">
        <h4><i className="ti ti-bulb-filled" style={{ color: '#f59e0b' }} /> {t.homeTipsTitle}</h4>
        <ul className="home-tips-list">
          <li>
            <div className="tip-badge blue">💧 {lang === 'kn' ? 'ನೀರಾವರಿ' : 'Irrigation'}</div>
            <div className="tip-text">
              {lang === 'kn' 
                ? 'ತೆನೆ ಮತ್ತು ಹೂವು ಬಿಡುವ ಹಂತದಲ್ಲಿ ನೀರು ಅತ್ಯಗತ್ಯ. ತೇವಾಂಶ ಕಡಿಮೆಯಾಗದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.'
                : 'Flowering & tasseling is the most critical moisture-sensitive stage. Avoid water stress to maximize grain fill.'}
            </div>
          </li>
          <li>
            <div className="tip-badge red">🐛 {lang === 'kn' ? 'ಕೀಟ ನಿಯಂತ್ರಣ' : 'Pest Scouting'}</div>
            <div className="tip-text">
              {lang === 'kn'
                ? 'ಲದ್ದಿ ಹುಳು (Fall Armyworm) ಬಾಧೆ ತಡೆಯಲು ಸುಳಿಯಲ್ಲಿ ಹಾನಿ ಲಕ್ಷಣಗಳನ್ನು ವಾರಕ್ಕೊಮ್ಮೆ ಗಮನಿಸಿ.'
                : 'Scout leaf whorls weekly for pin-holes and sawdust-like frass to catch Fall Armyworm early.'}
            </div>
          </li>
          <li>
            <div className="tip-badge purple">🧪 {lang === 'kn' ? 'ರಸಗೊಬ್ಬರ' : 'Fertilizer'}</div>
            <div className="tip-text">
              {lang === 'kn'
                ? 'ಯೂರಿಯಾವನ್ನು ಮಣ್ಣಿನಲ್ಲಿ ಹದವಾದ ತೇವಾಂಶವಿರುವಾಗ ಮಾತ್ರ ಮೇಲುಗೊಬ್ಬರವಾಗಿ ನೀಡಿ.'
                : 'Apply top-dress urea only when the root zone has moderate soil moisture to prevent volatilization.'}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
