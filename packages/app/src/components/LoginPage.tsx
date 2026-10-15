import React, { useState } from 'react';
import { translations, type Lang } from '../translations';
import { fetchFarmerProfile } from '../supabase';

export interface UserProfileData {
  farmerId: string;
  name: string;
  phone: string;
  location: string;
  stage: string;
  soil: string;
  isLoggedIn: boolean;
}

interface LoginPageProps {
  user: UserProfileData;
  lang: Lang;
  onLogin: (updatedUser: UserProfileData) => void;
  onContinueGuest: () => void;
}

export function LoginPage({ user, lang, onLogin, onContinueGuest }: LoginPageProps) {
  const t = translations[lang];

  const [name, setName] = useState(user.name || 'Ramesh Patil');
  const [phone, setPhone] = useState(user.phone || '9876543210');
  const [location, setLocation] = useState(user.location || 'Dharwad');
  const [stage, setStage] = useState(user.stage || '30 days');
  const [soil, setSoil] = useState(user.soil || 'Black Soil');
  const [isSearching, setIsSearching] = useState(false);

  const handlePhoneBlur = async () => {
    const clean = phone.trim();
    if (clean.length >= 10) {
      setIsSearching(true);
      try {
        const existing = await fetchFarmerProfile(clean);
        if (existing) {
          if (existing.name) setName(existing.name);
          if (existing.location) setLocation(existing.location);
          if (existing.stage) setStage(existing.stage);
          if (existing.soil) setSoil(existing.soil);
        }
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      farmerId: user.farmerId || `f_${Date.now()}`,
      name: name.trim() || 'Farmer',
      phone: phone.trim(),
      location,
      stage,
      soil,
      isLoggedIn: true,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🌾</div>
          <h2>{t.loginTitle}</h2>
          <p className="login-sub">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <i className="ti ti-user" /> {t.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="ti ti-phone" /> {t.phoneLabel}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={handlePhoneBlur}
              placeholder={t.phonePlaceholder}
              maxLength={10}
            />
          </div>

          <div className="form-group">
            <label>
              <i className="ti ti-map-pin" /> {t.districtLabel}
            </label>
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
              <i className="ti ti-plant" /> {t.stageLabel}
            </label>
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="Sowing">Sowing (0-15 days)</option>
              <option value="30 days">Vegetative (30 days)</option>
              <option value="45 days">Flowering (45 days)</option>
              <option value="60 days">Grain Filling (60 days)</option>
              <option value="Harvest">Harvest Stage</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <i className="ti ti-layers-subtract" /> {t.soilLabel}
            </label>
            <select value={soil} onChange={(e) => setSoil(e.target.value)}>
              <option value="Black Soil">Black Soil (ಕಪ್ಪು ಮಣ್ಣು)</option>
              <option value="Red Soil">Red Soil (ಕೆಂಪು ಮಣ್ಣು)</option>
              <option value="Loamy Soil">Loamy Soil (ಎರಡುಮಣ್ಣು)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="ti ti-login" /> {t.loginSubmit}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <button type="button" onClick={onContinueGuest} className="btn btn-secondary">
          <i className="ti ti-user-check" /> {t.guestContinue}
        </button>
      </div>
    </div>
  );
}
