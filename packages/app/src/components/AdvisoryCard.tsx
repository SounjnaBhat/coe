import React from 'react';
import type { Advisory } from '@advisor/core';
import { tierFor } from './tier';
import { WhyPanel } from './WhyPanel';

const ICON: Record<string, string> = {
  IRRIGATE: 'ti-droplet', APPLY: 'ti-flask', SOW: 'ti-seeding',
  HARVEST: 'ti-tractor', SCOUT: 'ti-eye', WAIT: 'ti-clock',
  INFORM: 'ti-info-circle',
};

const ACTION_LINES_EN: Record<string, string> = {
  IRRIGATE: 'Irrigate your field today',
  APPLY: 'Apply treatment',
  SOW: 'Ready for sowing',
  HARVEST: 'Ready for harvest',
  SCOUT: 'Scout your field',
  WAIT: 'No action needed right now',
  INFORM: 'Information provided',
};

const ACTION_LINES_KN: Record<string, string> = {
  IRRIGATE: 'ಇಂದು ನೀರು ಹಾಕಿ',
  APPLY: 'ಔಷಧಿ ಸಿಂಪಡಿಸಿ',
  SOW: 'ಬಿತ್ತನೆಗೆ ಸಿದ್ಧವಾಗಿದೆ',
  HARVEST: 'ಕೊಯ್ಲಿಗೆ ಸಿದ್ಧವಾಗಿದೆ',
  SCOUT: 'ಹೊಲವನ್ನು ಪರಿಶೀಲಿಸಿ',
  WAIT: 'ಈಗ ಯಾವುದೇ ಕ್ರಮ ಅಗತ್ಯವಿಲ್ಲ',
  INFORM: 'ಮಾಹಿತಿ ಒದಗಿಸಲಾಗಿದೆ',
};

const FACT_LABELS_KN: Record<string, string> = {
  'Location': 'ಸ್ಥಳ',
  'Crop Stage': 'ಬೆಳೆಯ ಹಂತ',
  'Depletion': 'ಮಣ್ಣಿನ ನೀರಿನ ಕೊರತೆ',
  'MAD Threshold': 'ಸುರಕ್ಷಿತ ತೇವಾಂಶ ಮಿತಿ (MAD)',
  'Forecast Rain': 'ಮಳೆ ಮುನ್ಸೂಚನೆ',
  'Forecast Rain (72h)': 'ಮುಂದಿನ 72 ಗಂ ಮಳೆ',
  'Pest Name': 'ಕೀಟದ ಹೆಸರು',
  'Treatment Threshold': 'ಹಾನಿಯ ಮಿತಿ',
  'Recommended Agent': 'ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧಿ / ಕ್ರಮ',
  'Location Risk': 'ಪ್ರದೇಶದ ಅಪಾಯ',
  'Recommended Dose': 'ಶಿಫಾರಸು ಪ್ರಮಾಣ',
};

const FACT_VALUES_KN: Record<string, string> = {
  'Fall Armyworm': 'ಲದ್ದಿ ಹುಳು (Fall Armyworm)',
  'MODERATE': 'ಮಧ್ಯಮ',
  'HIGH': 'ಹೆಚ್ಚು',
  'LOW': 'ಕಡಿಮೆ',
  'Scout first — consult RSK before spraying': 'ಮೊದಲು ಹೊಲ ಪರಿಶೀಲಿಸಿ — RSK ಸಂಪರ್ಕಿಸಿ',
  'Dharwad': 'ಧಾರವಾಡ',
  'DHARWAD': 'ಧಾರವಾಡ',
  'Hubli': 'ಹುಬ್ಬಳ್ಳಿ',
  'HUBLI': 'ಹುಬ್ಬಳ್ಳಿ',
  'Belagavi': 'ಬೆಳಗಾವಿ',
  'Haveri': 'ಹಾವೇರಿ',
  'Sowing': 'ಬಿತ್ತನೆ ಹಂತ (0-15 ದಿನ)',
  'Vegetative': 'ಬೆಳವಣಿಗೆ ಹಂತ (15-45 ದಿನ)',
  'Flowering': 'ಹೂವು ಮತ್ತು ತೆನೆ ಹಂತ (45-65 ದಿನ)',
  'Maturity': 'ಕಾಳು / ಕೊಯ್ಲು ಹಂತ',
};

const CATEGORIES_KN: Record<string, string> = {
  'irrigation advice': 'ನೀರಾವರಿ ಸಲಹೆ',
  'pest management': 'ಕೀಟ ನಿರ್ವಹಣೆ',
  'fertilizer dose': 'ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ',
};

const CAUTION_KN: Record<string, string> = {
  'Soil moisture is adequate and crop is not under stress. No irrigation needed.':
    'ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ ಮತ್ತು ಬೆಳೆಯು ನೀರಿನ ಕೊರತೆಯಲ್ಲಿಲ್ಲ. ಈಗ ನೀರುಣಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.',
  'Significant rainfall (>15mm) expected in the next 72 hours.':
    'ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ ಗಮನಾರ್ಹ ಮಳೆ (>15 ಮಿ.ಮೀ) ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ.',
  'Crop is in a critical stage (flowering/yield formation) and soil moisture depletion exceeds critical threshold (40% TAW).':
    'ಬೆಳೆಯು ಹೂವು/ಕಾಳು ಕಟ್ಟುವ ನಿರ್ಣಾಯಕ ಹಂತದಲ್ಲಿದೆ ಮತ್ತು ಮಣ್ಣಿನ ತೇವಾಂಶ ಕಡಿಮೆಯಾಗಿದೆ. ತಕ್ಷಣ ನೀರು ಒದಗಿಸಿ.',
  'Soil moisture depletion exceeds standard Management Allowed Depletion (MAD).':
    'ಮಣ್ಣಿನ ತೇವಾಂಶ ಕೊರತೆ ಸುರಕ್ಷಿತ ಮಿತಿಯನ್ನು (MAD) ಮೀರಿದೆ. ನೀರು ನೀಡುವುದು ಅಗತ್ಯ.',
  'Infestation is at or above the Economic Threshold Level (10%). Please scout and consult your local RSK. No chemical dose is provided here.':
    'ಕೀಟದ ಹಾನಿ ಆರ್ಥಿಕ ಮಿತಿಯನ್ನು (10%) ತಲುಪಿದೆ. ದಯವಿಟ್ಟು ಹೊಲ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸ್ಥಳೀಯ RSK ಸಂಪರ್ಕಿಸಿ.',
  'Infestation is below ETL. Continue monitoring the crop.':
    'ಕೀಟದ ಬಾಧೆ ಆರ್ಥಿಕ ಮಿತಿಗಿಂತ ಕಡಿಮೆಯಿದೆ. ಹೊಲವನ್ನು ನಿಯಮಿತವಾಗಿ ಗಮನಿಸುತ್ತಿರಿ.',
  'Rainfall has exceeded 25mm in the past/next 72 hours. Soil moisture is adequate for sowing.':
    'ಕಳೆದ ಅಥವಾ ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ 25 ಮಿ.ಮೀ ಗಿಂತ ಹೆಚ್ಚು ಮಳೆಯಾಗಿದೆ. ಬಿತ್ತನೆಗೆ ಮಣ್ಣಿನ ತೇವಾಂಶ ಹದವಾಗಿದೆ.',
  'Insufficient rainfall. Wait for a good soaking rain (>25mm) before sowing.':
    'ಸಾಕಷ್ಟು ಮಳೆಯಾಗಿಲ್ಲ. ಬಿತ್ತನೆ ಮಾಡುವ ಮೊದಲು ಉತ್ತಮ ಹದ ಮಳೆಗಾಗಿ (>25 ಮಿ.ಮೀ) ಕಾಯಿರಿ.',
  'Heavy rain forecasted (> 20mm in 72h). Hold or reduce irrigation.':
    'ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ (> 20 ಮಿ.ಮೀ). ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ.',
  'Avoid spraying if rain is expected within 6 hours.':
    'ಮುಂದಿನ 6 ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆಯಾಗುವ ಮುನ್ಸೂಚನೆ ಇದ್ದರೆ ಸಿಂಪಡಿಸಬೇಡಿ.',
};

function translateCautionStr(c: string, lang: 'kn' | 'en'): string {
  if (lang !== 'kn' || !c) return c;
  if (CAUTION_KN[c]) return CAUTION_KN[c];
  if (c.includes('Soil moisture is adequate') || c.includes('No irrigation needed')) {
    return 'ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ ಮತ್ತು ಬೆಳೆಯು ನೀರಿನ ಕೊರತೆಯಲ್ಲಿಲ್ಲ. ಈಗ ನೀರುಣಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.';
  }
  if (c.includes('Economic Threshold Level')) {
    return 'ಕೀಟದ ಹಾನಿ ಆರ್ಥಿಕ ಮಿತಿಯನ್ನು (10%) ತಲುಪಿದೆ. ದಯವಿಟ್ಟು ಹೊಲ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸ್ಥಳೀಯ RSK ಸಂಪರ್ಕಿಸಿ.';
  }
  if (c.includes('Significant rainfall')) {
    return 'ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ ಗಮನಾರ್ಹ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ.';
  }
  return c;
}

export function AdvisoryCard({ advisory, lang }: { advisory: any; lang: 'kn' | 'en' }) {
  const isKn = lang === 'kn';
  const tier = tierFor(advisory);
  
  const actionLine = advisory.actionLine || (isKn ? ACTION_LINES_KN[advisory.headline] : ACTION_LINES_EN[advisory.headline]) || advisory.headline;
  const rawCategory = advisory.categoryLabel || advisory.intent.replace(/_/g, ' ');
  const category = isKn ? (CATEGORIES_KN[rawCategory.toLowerCase()] || rawCategory) : rawCategory;

  return (
    <article className="card" lang={lang} data-lang={lang}>
      <header className={`verdict verdict--${tier}`}>
        <div className="verdict__meta">
          <i className={`ti ${ICON[advisory.headline] || 'ti-info-circle'}`} aria-hidden="true" />
          <span style={{ textTransform: 'capitalize' }}>{category}</span>
        </div>
        <h3 className="verdict__action">{actionLine}</h3>
      </header>

      {advisory.facts && advisory.facts.length > 0 && (
        <dl className="facts">
          {advisory.facts.map((f: any) => {
            const label = isKn ? (FACT_LABELS_KN[f.label] || f.label) : f.label;
            const rawVal = String(f.value);
            const value = isKn ? (FACT_VALUES_KN[rawVal] || rawVal) : rawVal;
            return (
              <div className="facts__row" key={f.label}>
                <dt>{label}</dt>
                <dd>{value}{f.unit ? ` ${f.unit}` : ''}</dd>
              </div>
            );
          })}
        </dl>
      )}

      {advisory.cautions && advisory.cautions.length > 0 && (
        <div className="caution" role="note">
          <i className="ti ti-alert-triangle" aria-hidden="true" />
          <span>
            {advisory.cautions.map((c: string) => translateCautionStr(c, lang)).join(' ')}
          </span>
        </div>
      )}

      {advisory.evidence && <WhyPanel advisory={advisory} lang={lang} />}
    </article>
  );
}
