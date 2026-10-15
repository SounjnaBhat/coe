import React from 'react';
import { localizeLocation, localizeStage, type Lang } from '../translations';

export function ContextStrip({ profile, lang }: { profile: any; lang: Lang }) {
  const crop = lang === 'kn' ? '🌽 ಮೆಕ್ಕೆಜೋಳ' : '🌽 Maize';
  const stage = profile.stage ? localizeStage(profile.stage, lang) : '';
  const location = profile.location ? `📍 ${localizeLocation(profile.location, lang)}` : '';

  const items = [crop, stage, location].filter(Boolean);
  
  return (
    <div className="context-strip" lang={lang} data-lang={lang}>
      {items.map((t, idx) => <span key={idx}>{t}</span>)}
    </div>
  );
}
