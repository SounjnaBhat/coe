import React, { useState } from 'react';
import { translations, type Lang, calculateStageFromSowingDate } from '../translations';
import type { UserProfileData } from './LoginPage';

interface ProfilePageProps {
  user: UserProfileData;
  lang: Lang;
  onUpdateProfile: (updatedUser: UserProfileData) => void;
  onLogout: () => void;
  weatherFeatures?: { dToday: number; forecastRain72h: number };
}

export function ProfilePage({ user, lang, onUpdateProfile, onLogout, weatherFeatures }: ProfilePageProps) {
  const t = translations[lang];

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [location, setLocation] = useState(user.location || 'Dharwad');
  const [sowingDate, setSowingDate] = useState(user.sowingDate || '');
  const [stage, setStage] = useState(user.stage || 'Sowing');
  const [soil, setSoil] = useState(user.soil || 'Black Soil');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSowingDateChange = (dateVal: string) => {
    setSowingDate(dateVal);
    if (dateVal) {
      const calc = calculateStageFromSowingDate(dateVal);
      setStage(calc.stageKey);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name,
      phone,
      location,
      sowingDate,
      stage,
      soil,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header Badge */}
        <div className="profile-badge-row">
          <div className="profile-avatar">
            {name ? name.charAt(0).toUpperCase() : '👨‍🌾'}
          </div>
          <div className="profile-badge-info">
            <h3>{name || 'Farmer User'}</h3>
            <span className="profile-id">ID: {user.farmerId}</span>
            <span className="profile-status">
              <i className="ti ti-circle-filled" style={{ color: '#4caf50', fontSize: '10px', marginRight: '4px' }} />
              {user.isLoggedIn ? 'Active Farmer' : 'Guest Mode'}
            </span>
          </div>
        </div>

        {savedNotice && (
          <div className="alert alert-success">
            <i className="ti ti-check" /> {t.profileSavedAlert}
          </div>
        )}

        <form onSubmit={handleSave} className="profile-form">
          <h4 className="section-title">
            <i className="ti ti-user" /> {t.personalSection}
          </h4>

          <div className="form-group">
            <label>{t.nameLabel}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.phoneLabel}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
            />
          </div>

          <h4 className="section-title">
            <i className="ti ti-seeding" /> {t.farmSection}
          </h4>

          <div className="form-group">
            <label>{t.districtLabel}</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="Dharwad">Dharwad (ಧಾರವಾಡ)</option>
              <option value="Hubli">Hubli (ಹುಬ್ಬಳ್ಳಿ)</option>
              <option value="Belagavi">Belagavi (ಬೆಳಗಾವಿ)</option>
              <option value="Haveri">Haveri (ಹಾವೇರಿ)</option>
              <option value="Gadag">Gadag (ಗದಗ)</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <i className="ti ti-calendar" /> {t.sowingDateLabel}
            </label>
            <input
              type="date"
              value={sowingDate}
              onChange={(e) => handleSowingDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            {sowingDate && (
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="ti ti-sparkles" />
                <span>
                  {t.sowingCalcPrefix}: {calculateStageFromSowingDate(sowingDate).daysElapsed} {lang === 'kn' ? 'ದಿನಗಳು' : 'days'} ➔ {lang === 'kn' ? calculateStageFromSowingDate(sowingDate).labelKn : calculateStageFromSowingDate(sowingDate).labelEn}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>{t.stageLabel}</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="Sowing">{lang === 'kn' ? 'ಬಿತ್ತನೆ ಹಂತ (0-15 ದಿನಗಳು)' : 'Sowing (0-15 days)'}</option>
              <option value="30 days">{lang === 'kn' ? 'ಬೆಳವಣಿಗೆ ಹಂತ (30 ದಿನಗಳು)' : 'Vegetative (30 days)'}</option>
              <option value="45 days">{lang === 'kn' ? 'ಹೂವು / ತೆನೆ ಹಂತ (45 ದಿನಗಳು)' : 'Flowering (45 days)'}</option>
              <option value="60 days">{lang === 'kn' ? 'ಕಾಳು ತುಂಬುವ ಹಂತ (60 ದಿನಗಳು)' : 'Grain Filling (60 days)'}</option>
              <option value="Harvest">{lang === 'kn' ? 'ಕೊಯ್ಲು ಹಂತ' : 'Harvest Stage'}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t.soilLabel}</label>
            <select value={soil} onChange={(e) => setSoil(e.target.value)}>
              <option value="Black Soil">Black Soil (ಕಪ್ಪು ಮಣ್ಣು)</option>
              <option value="Red Soil">Red Soil (ಕೆಂಪು ಮಣ್ಣು)</option>
              <option value="Loamy Soil">Loamy Soil (ಎರಡುಮಣ್ಣು)</option>
            </select>
          </div>

          {/* Environmental / Weather overview */}
          <div className="weather-overview">
            <h4 className="section-title">
              <i className="ti ti-cloud-sun" /> {lang === 'kn' ? 'ಪರಿಸರ ಹಾಗೂ ಹವಾಮಾನ ನಿಯತಾಂಕಗಳು' : 'Environmental Parameters'}
            </h4>
            <div className="weather-grid">
              <div className="weather-item">
                <span className="w-label">{lang === 'kn' ? 'ಮುಂದಿನ 72 ಗಂ ಮಳೆ ಮುನ್ಸೂಚನೆ' : 'Rain Forecast 72h'}</span>
                <span className="w-value">
                  {weatherFeatures ? `${weatherFeatures.forecastRain72h} mm` : '0 mm'}
                </span>
              </div>
              <div className="weather-item">
                <span className="w-label">{lang === 'kn' ? 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಸೂಚ್ಯಂಕ' : 'Soil Moisture Index'}</span>
                <span className="w-value">
                  {weatherFeatures ? `${weatherFeatures.dToday} %` : '60 %'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-device-floppy" /> {t.saveProfile}
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                if (window.confirm(t.logoutConfirm)) {
                  onLogout();
                }
              }}
            >
              <i className="ti ti-logout" /> {t.navLogout}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
