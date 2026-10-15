import React from 'react';
import { localizeLocation, localizeStage, localizeSoil } from '../translations';

const SNAPSHOT_KEY_KN: Record<string, string> = {
  'dToday': 'ಇಂದಿನ ನೀರಿನ ಕೊರತೆ',
  'forecastRain72h': 'ಮುಂದಿನ 72 ಗಂ ಮಳೆ',
  'stage': 'ಬೆಳೆಯ ಹಂತ',
  'location': 'ಸ್ಥಳ',
  'soil': 'ಮಣ್ಣಿನ ವಿಧ',
  'taw': 'ಒಟ್ಟು ಲಭ್ಯ ನೀರು (TAW)',
  'mad_p': 'ಸುರಕ್ಷಿತ ಮಿತಿ ಅಂಶ (MAD)',
  'pestObserved': 'ಗುರುತಿಸಿದ ಕೀಟ',
  'infestationLevel': 'ಹಾನಿಯ ಪ್ರಮಾಣ (%)',
};

export function WhyPanel({ advisory, lang }: { advisory: any; lang: 'kn' | 'en' }) {
  const e = advisory.evidence;
  if (!e) return null;
  const isKn = lang === 'kn';
  
  return (
    <details className="why">
      <summary>
        <i className="ti ti-info-circle" aria-hidden="true" />
        <span>{isKn ? 'ಏಕೆ ಈ ಸಲಹೆ?' : 'Why this answer?'}</span>
        <i className="ti ti-chevron-down why__chev" aria-hidden="true" />
      </summary>
      <div className="why__body">
        {e.ruleIds && e.ruleIds.length > 0 && (
          <p className="why__rule">
            <small>{isKn ? 'ನಿಯಮಗಳ ಕೋಡ್' : 'Rulepack'}: {e.ruleIds.join(', ')}</small>
          </p>
        )}
        {e.featureSnapshot && (
          <dl className="facts facts--compact">
            {Object.entries(e.featureSnapshot).map(([key, val]) => {
              const label = isKn ? (SNAPSHOT_KEY_KN[key] || key) : key;
              let valStr = String(val);
              if (isKn) {
                if (key === 'location') valStr = localizeLocation(valStr, 'kn');
                else if (key === 'stage') valStr = localizeStage(valStr, 'kn');
                else if (key === 'soil') valStr = localizeSoil(valStr, 'kn');
                else if (key === 'pestObserved' && valStr.toLowerCase().includes('fall')) valStr = 'ಲದ್ದಿ ಹುಳು (FAW)';
              }
              return (
                <div className="facts__row" key={key}>
                  <dt>{label}</dt><dd>{valStr}</dd>
                </div>
              );
            })}
          </dl>
        )}
        {e.parameterLevel && (
          <p className="why__level">
            {isKn ? 'ಮಾಹಿತಿ ಮೂಲ' : 'Parameter source'}: {e.parameterLevel}
          </p>
        )}
        {e.sources && e.sources.length > 0 && (
          <ul className="why__sources">
            {e.sources.map((s: any, idx: number) => (
              <li key={idx}>
                {s.doc}{s.page ? `, p.${s.page}` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
