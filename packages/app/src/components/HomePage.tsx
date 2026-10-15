import React from 'react';
import { translations, type Lang } from '../translations';
import type { UserProfileData } from './LoginPage';

interface HomePageProps {
  user: UserProfileData;
  lang: Lang;
  onNavigate: (tab: 'home' | 'chat' | 'profile' | 'login') => void;
  onAskTopic: (query: string) => void;
  weatherFeatures?: { dToday: number; forecastRain72h: number };
}

export function HomePage({ user, lang, onNavigate, onAskTopic, weatherFeatures }: HomePageProps) {
  const t = translations[lang];
  const rain72h = weatherFeatures?.forecastRain72h ?? 0;

  const quickActions = [
    {
      id: 'irrigation',
      title: t.homeActionIrrigation,
      desc: t.homeActionIrrigationDesc,
      icon: 'ti-droplet-filled',
      iconColor: '#38bdf8',
      query: lang === 'kn' ? 'ಇಂದು ನೀರು ಹಾಕಬೇಕಾ?' : 'Should I irrigate today?'
    },
    {
      id: 'pest',
      title: t.homeActionPest,
      desc: t.homeActionPestDesc,
      icon: 'ti-bug-filled',
      iconColor: '#f87171',
      query: lang === 'kn' ? 'ಲದ್ದಿ ಹುಳು ಕೀಟ ನಿಯಂತ್ರಣ ಹೇಗೆ?' : 'How to control Fall Armyworm pest?'
    },
    {
      id: 'fertilizer',
      title: t.homeActionFertilizer,
      desc: t.homeActionFertilizerDesc,
      icon: 'ti-flask-2-filled',
      iconColor: '#a78bfa',
      query: lang === 'kn' ? 'ಮೆಕ್ಕೆಜೋಳಕ್ಕೆ ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ ಎಷ್ಟು?' : 'What is the fertilizer dose for maize?'
    },
    {
      id: 'weather',
      title: t.homeActionWeather,
      desc: t.homeActionWeatherDesc,
      icon: 'ti-cloud-rain',
      iconColor: '#34d399',
      query: lang === 'kn' ? 'ಮುಂದಿನ 3 ದಿನಗಳ ಮಳೆ ಮುನ್ಸೂಚನೆ ಏನು?' : 'What is the rain forecast for next 72 hours?'
    }
  ];

  return (
    <div className="home-container">
      {/* ── Welcome Banner ── */}
      <div className="home-banner-card">
        <div className="home-banner-content">
          <div className="home-badge-row">
            <span className="home-location-pill">
              <i className="ti ti-map-pin" /> {user.location || 'Dharwad'}
            </span>
            <span className="home-stage-pill">
              🌽 {user.stage || '30 days'}
            </span>
            {user.soil && (
              <span className="home-soil-pill">
                🌱 {user.soil}
              </span>
            )}
          </div>

          <h2 className="home-welcome-title">
            {t.homeGreeting}, {user.name || (lang === 'kn' ? 'ರೈತರೇ' : 'Farmer')}! 🌾
          </h2>
          <p className="home-welcome-sub">{t.homeSubtitle}</p>
        </div>

        {/* Big Ask Advisor CTA */}
        <div className="home-ask-cta" onClick={() => onNavigate('chat')}>
          <div className="home-ask-cta-left">
            <div className="home-cta-icon-circle">
              <i className="ti ti-message-dots" />
            </div>
            <div>
              <div className="home-cta-title">{t.homeAskCta}</div>
              <div className="home-cta-sub">{t.homeAskCtaSub}</div>
            </div>
          </div>
          <div className="home-cta-arrow">
            <i className="ti ti-arrow-right" />
          </div>
        </div>
      </div>

      {/* ── Weather & Crop Advisory Summary ── */}
      <div className="home-summary-grid">
        {/* Weather Card */}
        <div className="home-summary-card">
          <div className="home-card-header">
            <h4><i className="ti ti-cloud-storm" style={{ color: '#38bdf8' }} /> {t.homeWeatherTitle}</h4>
            <span className="home-status-badge">
              {rain72h > 5 ? '🌧️ Rain expected' : '☀️ Dry & Clear'}
            </span>
          </div>
          <div className="home-weather-body">
            <div className="home-weather-metric">
              <span className="home-metric-val">{rain72h} mm</span>
              <span className="home-metric-lbl">{t.homeWeatherRain}</span>
            </div>
            <p className="home-weather-tip">
              {rain72h > 10
                ? (lang === 'kn' ? 'ಮಳೆ ಸಾಧ್ಯತೆ ಇದೆ. ನೀರಾವರಿ ಮುಂದೂಡಿ.' : 'Rain forecasted. You can hold off on irrigation.')
                : (lang === 'kn' ? 'ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ ಗಮನಾರ್ಹ ಮಳೆ ಇಲ್ಲ. ತೇವಾಂಶ ಪರಿಶೀಲಿಸಿ.' : 'No significant rain. Monitor soil moisture depletion.')}
            </p>
          </div>
        </div>

        {/* Crop Stage Progress Card */}
        <div className="home-summary-card">
          <div className="home-card-header">
            <h4><i className="ti ti-plant-2" style={{ color: '#4caf50' }} /> {t.homeCropStatusTitle}</h4>
            <span className="home-status-badge active-stage">
              {user.stage || 'Vegetative (15-45d)'}
            </span>
          </div>
          <div className="home-timeline">
            <div className="timeline-step completed">
              <span className="step-dot" />
              <span className="step-label">Sowing</span>
            </div>
            <div className="timeline-step current">
              <span className="step-dot" />
              <span className="step-label">Vegetative</span>
            </div>
            <div className="timeline-step">
              <span className="step-dot" />
              <span className="step-label">Flowering</span>
            </div>
            <div className="timeline-step">
              <span className="step-dot" />
              <span className="step-label">Maturity</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Advisory Actions ── */}
      <div className="home-section-title">
        <h3><i className="ti ti-bolt" /> {t.homeQuickActionsTitle}</h3>
      </div>
      <div className="home-actions-grid">
        {quickActions.map(act => (
          <div
            key={act.id}
            className="home-action-card"
            onClick={() => onAskTopic(act.query)}
            role="button"
            tabIndex={0}
          >
            <div className="home-action-icon" style={{ background: `${act.iconColor}1a`, color: act.iconColor }}>
              <i className={`ti ${act.icon}`} />
            </div>
            <div className="home-action-info">
              <h4>{act.title}</h4>
              <p>{act.desc}</p>
            </div>
            <i className="ti ti-chevron-right home-action-chevron" />
          </div>
        ))}
      </div>

      {/* ── North Karnataka Agronomy Tips ── */}
      <div className="home-tips-card">
        <h4><i className="ti ti-bulb" style={{ color: '#fbbf24' }} /> {t.homeTipsTitle}</h4>
        <ul>
          <li>
            <strong>{lang === 'kn' ? 'ನೀರಾವರಿ:' : 'Irrigation:'}</strong>{' '}
            {lang === 'kn' 
              ? 'ತೆನೆ ಮತ್ತು ಹೂವು ಬಿಡುವ ಹಂತದಲ್ಲಿ ನೀರು ಅತ್ಯಗತ್ಯ. ತೇವಾಂಶ ಕಡಿಮೆಯಾಗದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.'
              : 'Flowering & tasseling is the most critical moisture-sensitive stage. Avoid water stress.'}
          </li>
          <li>
            <strong>{lang === 'kn' ? 'ಕೀಟ ನಿಯಂತ್ರಣ:' : 'Pest Scouting:'}</strong>{' '}
            {lang === 'kn'
              ? 'ಲದ್ದಿ ಹುಳು (FAW) ಬಾಧೆ ತಡೆಯಲು ಸುಳಿಯಲ್ಲಿ ಹಾನಿ ಲಕ್ಷಣಗಳನ್ನು ವಾರಕ್ಕೊಮ್ಮೆ ಗಮನಿಸಿ.'
              : 'Scout leaf whorls weekly for pin-holes and frass to detect Fall Armyworm early.'}
          </li>
          <li>
            <strong>{lang === 'kn' ? 'ಪೋಷಕಾಂಶ:' : 'Fertilizer:'}</strong>{' '}
            {lang === 'kn'
              ? 'ಯೂರಿಯಾವನ್ನು ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶವಿರುವಾಗ ಮಾತ್ರ ಮೇಲುಗೊಬ್ಬರವಾಗಿ ನೀಡಿ.'
              : 'Apply top-dress urea only when the root zone has adequate moisture.'}
          </li>
        </ul>
      </div>
    </div>
  );
}
