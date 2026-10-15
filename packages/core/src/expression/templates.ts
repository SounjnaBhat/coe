import type { Advisory } from '../contracts/types';

// Simple deterministic hash based on session ID and turn index
export function getVariantIndex(sessionId: string, turnIndex: number, variantCount: number): number {
    let hash = 0;
    const str = `${sessionId}_${turnIndex}`;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % variantCount;
}

// ── Translation Dictionaries for Dynamic Core Entities ──
export const PEST_TRANSLATIONS: Record<string, string> = {
    'faw': 'ಲದ್ದಿ ಹುಳು (Fall Armyworm)',
    'fall armyworm': 'ಲದ್ದಿ ಹುಳು (Fall Armyworm)',
    'fall army': 'ಲದ್ದಿ ಹುಳು (Fall Armyworm)',
    'pests': 'ಕೀಟಗಳು',
};

export const RISK_TRANSLATIONS: Record<string, string> = {
    'HIGH': 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    'MODERATE': 'ಮಧ್ಯಮ ಅಪಾಯ',
    'LOW': 'ಕಡಿಮೆ ಅಪಾಯ',
    'UNKNOWN': 'ಅನಿಶ್ಚಿತ',
};

export const CHEMICAL_TRANSLATIONS: Record<string, string> = {
    'Scout first — consult RSK before spraying': 'ಮೊದಲು ಹೊಲ ಪರಿಶೀಲಿಸಿ — ಸಿಂಪಡಿಸುವ ಮುನ್ನ ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK) ಸಂಪರ್ಕಿಸಿ',
    'Emamectin benzoate 5% SG at 0.4 g/litre': 'ಎಮಾಮೆಕ್ಟಿನ್ ಬೆಂಜೋಯೆಟ್ 5% SG (ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 0.4 ಗ್ರಾಂ)',
    'Spinetoram 11.7% SC at 0.5 ml/litre': 'ಸ್ಪಿನೆಟೋರಮ್ 11.7% SC (ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 0.5 ಮಿ.ಲೀ)',
    'Chlorantraniliprole 18.5% SC at 0.4 ml/litre': 'ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್ 18.5% SC (ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 0.4 ಮಿ.ಲೀ)',
};

export const LOCATION_TRANSLATIONS: Record<string, string> = {
    'DHARWAD': 'ಧಾರವಾಡ',
    'Dharwad': 'ಧಾರವಾಡ',
    'HUBLI': 'ಹುಬ್ಬಳ್ಳಿ',
    'Hubli': 'ಹುಬ್ಬಳ್ಳಿ',
    'BELAGAVI': 'ಬೆಳಗಾವಿ',
    'Belagavi': 'ಬೆಳಗಾವಿ',
    'HAVERI': 'ಹಾವೇರಿ',
    'Haveri': 'ಹಾವೇರಿ',
    'GADAG': 'ಗದಗ',
    'Gadag': 'ಗದಗ',
};

export const STAGE_TRANSLATIONS: Record<string, string> = {
    'sowing': 'ಬಿತ್ತನೆ ಹಂತ (0-15 ದಿನಗಳು)',
    'seedling': 'ಬಿತ್ತನೆ / ಸಸಿ ಹಂತ (0-15 ದಿನಗಳು)',
    'sowing / seedling (0-15 days)': 'ಬಿತ್ತನೆ / ಸಸಿ ಹಂತ (0-15 ದಿನಗಳು)',
    'vegetative': 'ಬೆಳವಣಿಗೆ ಹಂತ (15-45 ದಿನಗಳು)',
    'vegetative growth (15-45 days)': 'ಬೆಳವಣಿಗೆ ಹಂತ (15-45 ದಿನಗಳು)',
    'flowering': 'ಹೂವು ಮತ್ತು ತೆನೆ ಹಂತ (45-65 ದಿನಗಳು)',
    'tasseling & flowering (45-65 days)': 'ಹೂವು ಮತ್ತು ತೆನೆ ಹಂತ (45-65 ದಿನಗಳು)',
    'grain filling': 'ಕಾಳು ತುಂಬುವ ಹಂತ (65-90+ ದಿನಗಳು)',
    'grain filling & maturity (65-90+ days)': 'ಕಾಳು ತುಂಬುವ ಮತ್ತು ಕೊಯ್ಲು ಹಂತ (65-90+ ದಿನಗಳು)',
    'maturity': 'ಕೊಯ್ಲು ಹಂತ (65-90+ ದಿನಗಳು)',
    '30 days': '30 ದಿನಗಳು (ಬೆಳವಣಿಗೆ ಹಂತ)',
    'v4': 'ಬೆಳವಣಿಗೆ ಹಂತ (V4)',
    'v6': 'ಬೆಳವಣಿಗೆ ಹಂತ (V6)',
};

export const CAUTION_TRANSLATIONS: Record<string, string> = {
    'Soil moisture is adequate and crop is not under stress. No irrigation needed.':
        'ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ ಮತ್ತು ಬೆಳೆಯು ನೀರಿನ ಕೊರತೆಯಲ್ಲಿಲ್ಲ. ಈಗ ನೀರುಣಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.',
    'Significant rainfall (>15mm) expected in the next 72 hours.':
        'ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ ಗಮನಾರ್ಹ ಮಳೆ (>15 ಮಿ.ಮೀ) ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ.',
    'Crop is in a critical stage (flowering/yield formation) and soil moisture depletion exceeds critical threshold (40% TAW).':
        'ಬೆಳೆಯು ಹೂವು/ಕಾಳು ಕಟ್ಟುವ ನಿರ್ಣಾಯಕ ಹಂತದಲ್ಲಿದೆ ಮತ್ತು ಮಣ್ಣಿನ ತೇವಾಂಶ ಕಡಿಮೆಯಾಗಿದೆ. ತಕ್ಷಣ ನೀರು ಒದಗಿಸಿ.',
    'Soil moisture depletion exceeds standard Management Allowed Depletion (MAD).':
        'ಮಣ್ಣಿನ ತೇವಾಂಶ ಕೊರತೆ ಸುರಕ್ಷಿತ ಮಿತಿಯನ್ನು (MAD) ಮೀರಿದೆ. ನೀರು ನೀಡುವುದು ಅಗತ್ಯ.',
    'Infestation is at or above the Economic Threshold Level (10%). Please scout and consult your local RSK. No chemical dose is provided here.':
        'ಕೀಟದ ಬಾಧೆಯು ಆರ್ಥಿಕ ಹಾನಿ ಮಿತಿಯನ್ನು (10%) ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಹೊಲ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK) ಸಂಪರ್ಕಿಸಿ.',
    'Infestation is below ETL. Continue monitoring the crop.':
        'ಕೀಟದ ಬಾಧೆ ಆರ್ಥಿಕ ಮಿತಿಗಿಂತ ಕಡಿಮೆಯಿದೆ. ಹೊಲವನ್ನು ನಿಯಮಿತವಾಗಿ ಗಮನಿಸುತ್ತಿರಿ.',
    'Rainfall has exceeded 25mm in the past/next 72 hours. Soil moisture is adequate for sowing.':
        'ಕಳೆದ ಅಥವಾ ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ 25 ಮಿ.ಮೀ ಗಿಂತ ಹೆಚ್ಚು ಮಳೆಯಾಗಿದೆ. ಬಿತ್ತನೆಗೆ ಮಣ್ಣಿನ ತೇವಾಂಶ ಹದವಾಗಿದೆ.',
    'Insufficient rainfall. Wait for a good soaking rain (>25mm) before sowing.':
        'ಸಾಕಷ್ಟು ಮಳೆಯಾಗಿಲ್ಲ. ಬಿತ್ತನೆ ಮಾಡುವ ಮೊದಲು ಉತ್ತಮ ಹದ ಮಳೆಗಾಗಿ (>25 ಮಿ.ಮೀ) ಕಾಯಿರಿ.',
    'First nitrogen top-dressing is recommended at the vegetative stage (30-40 days). Apply PLACEHOLDER_UREA_DOSE kg/ha Urea.':
        'ಬೆಳವಣಿಗೆ ಹಂತದಲ್ಲಿ (30-40 ದಿನಗಳು) ಮೊದಲ ಸಾರಜನಕ ಮೇಲುಗೊಬ್ಬರವನ್ನು ನೀಡಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.',
    'Nitrogen top-dressing is not recommended at this stage.':
        'ಈ ಹಂತದಲ್ಲಿ ಸಾರಜನಕ ಮೇಲುಗೊಬ್ಬರ ನೀಡುವುದು ಸೂಕ್ತವಲ್ಲ.',
    'Heavy rain forecasted (> 20mm in 72h). Hold or reduce irrigation.':
        'ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ (> 20 ಮಿ.ಮೀ). ನೀರಾವರಿಯನ್ನು ಮುಂದೂಡಿ.',
    'Avoid spraying if rain is expected within 6 hours.':
        'ಮುಂದಿನ 6 ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆಯಾಗುವ ಮುನ್ಸೂಚನೆ ಇದ್ದರೆ ಸಿಂಪಡಿಸಬೇಡಿ.',
    'Wear protective gloves and mask during pesticide handling.':
        'ಕೀಟನಾಶಕ ಬಳಸುವಾಗ ರಕ್ಷಣಾತ್ಮಕ ಮುಖವಾಡ ಮತ್ತು ಕೈಗವಸುಗಳನ್ನು ಧರಿಸಿ.',
};

export function translateStage(stage: string, lang: string): string {
    if (lang !== 'kn' || !stage) return stage;
    const key = stage.toLowerCase().trim();
    if (STAGE_TRANSLATIONS[key]) return STAGE_TRANSLATIONS[key];
    for (const [k, v] of Object.entries(STAGE_TRANSLATIONS)) {
        if (key.includes(k)) return v;
    }
    return stage;
}

export function translateText(text: string, lang: string): string {
    if (lang !== 'kn' || !text) return text;
    // Check direct match
    if (CAUTION_TRANSLATIONS[text]) return CAUTION_TRANSLATIONS[text];
    if (CHEMICAL_TRANSLATIONS[text]) return CHEMICAL_TRANSLATIONS[text];
    if (RISK_TRANSLATIONS[text]) return RISK_TRANSLATIONS[text];
    if (PEST_TRANSLATIONS[text.toLowerCase()]) return PEST_TRANSLATIONS[text.toLowerCase()];
    if (LOCATION_TRANSLATIONS[text]) return LOCATION_TRANSLATIONS[text];

    let translated = text;
    // Partial substring replacements for any dynamic strings
    if (translated.includes('Soil moisture is adequate') || translated.includes('No irrigation needed')) {
        return 'ಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ ಮತ್ತು ಬೆಳೆಯು ನೀರಿನ ಕೊರತೆಯಲ್ಲಿಲ್ಲ. ಈಗ ನೀರುಣಿಸುವ ಅಗತ್ಯವಿಲ್ಲ.';
    }
    if (translated.includes('Economic Threshold Level')) {
        return 'ಕೀಟದ ಬಾಧೆ ಆರ್ಥಿಕ ಮಿತಿಯನ್ನು ಮೀರಿದೆ. ದಯವಿಟ್ಟು ಹೊಲ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸ್ಥಳೀಯ RSK ಸಂಪರ್ಕಿಸಿ.';
    }
    if (translated.includes('Scout first')) {
        return 'ಮೊದಲು ಹೊಲ ಪರಿಶೀಲಿಸಿ — ಸಿಂಪಡಿಸುವ ಮುನ್ನ ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK) ಸಂಪರ್ಕಿಸಿ';
    }
    if (translated.includes('nitrogen top-dressing') || translated.includes('PLACEHOLDER_UREA_DOSE')) {
        return 'ಬೆಳವಣಿಗೆ ಹಂತದಲ್ಲಿ (30-40 ದಿನಗಳು) ಮೊದಲ ಸಾರಜನಕ (ಯೂರಿಯಾ) ಮೇಲುಗೊಬ್ಬರವನ್ನು ನೀಡಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.';
    }
    if (translated.includes('Nitrogen top-dressing is not recommended')) {
        return 'ಈ ಹಂತದಲ್ಲಿ ಸಾರಜನಕ ಮೇಲುಗೊಬ್ಬರ ನೀಡುವುದು ಸೂಕ್ತವಲ್ಲ.';
    }
    return translated;
}

const irrigationTemplatesEn = [
    (stage: string, depletion: string, action: string, location: string) => {
        if (action === 'WAIT') {
            return `### Irrigation Check — ${location}\n\n✅ **No irrigation needed right now.**\n\n**Your Field:**\n- **Crop Stage:** ${stage}\n- **Current Soil Deficit:** ${depletion}\n- **MAD Threshold:** 55 mm\n\nYour soil still has enough moisture. Check again in 2–3 days or after a dry spell.`;
        }
        return `### Irrigation Needed — ${location}\n\n⚠️ **Irrigate your field today.**\n\n**Your Field:**\n- **Crop Stage:** ${stage}\n- **Current Soil Deficit:** ${depletion}\n- **MAD Threshold:** 55 mm\n\nYour soil moisture has dropped below the safe limit. Apply **${depletion}** of water to bring it back up.`;
    }
];

const irrigationTemplatesKn = [
    (stage: string, depletion: string, action: string, location: string) => {
        const stageKn = translateStage(stage, 'kn');
        if (action === 'WAIT') {
            return `### ನೀರಾವರಿ ಪರಿಶೀಲನೆ — ${location}\n\n✅ **ಈಗ ನೀರು ಹಾಕುವ ಅಗತ್ಯವಿಲ್ಲ.**\n\n**ನಿಮ್ಮ ಹೊಲ:**\n- **ಬೆಳೆಯ ಹಂತ:** ${stageKn}\n- **ಮಣ್ಣಿನ ನೀರಿನ ಕೊರತೆ:** ${depletion}\n- **ಸುರಕ್ಷಿತ ಮಿತಿ (MAD):** 55 ಮಿ.ಮೀ\n\nಮಣ್ಣಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ. 2–3 ದಿನಗಳ ನಂತರ ಅಥವಾ ಒಣ ಹವಾಮಾನ ಮುಂದುವರಿದರೆ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ.`;
        }
        return `### ನೀರಾವರಿ ಅಗತ್ಯ — ${location}\n\n⚠️ **ಇಂದು ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ನೀರು ಹಾಕಿ.**\n\n**ನಿಮ್ಮ ಹೊಲ:**\n- **ಬೆಳೆಯ ಹಂತ:** ${stageKn}\n- **ಮಣ್ಣಿನ ನೀರಿನ ಕೊರತೆ:** ${depletion}\n- **ಸುರಕ್ಷಿತ ಮಿತಿ (MAD):** 55 ಮಿ.ಮೀ\n\nಮಣ್ಣಿನ ತೇವಾಂಶ ಸುರಕ್ಷಿತ ಮಟ್ಟಕ್ಕಿಂತ ಕಡಿಮೆಯಾಗಿದೆ. ಬೆಳೆಯ ಬೆಳವಣಿಗೆಗೆ **${depletion}** ನೀರನ್ನು ಒದಗಿಸಿ.`;
    }
];

const pestTemplatesEn = [
    (pest: string, threshold: string, chemical: string, location: string, risk: string) => `### Pest Advisory: ${pest.toUpperCase()} in ${location}\n\n**Risk Level:** ${risk}\n\n**Analysis:**\nBased on regional models for ${location}, ${pest} requires action when damage reaches **${threshold}**.\n\n**Recommendation:**\nApply **${chemical}** to effectively control the outbreak.`,
    (pest: string, threshold: string, chemical: string, location: string, risk: string) => `### Alert: ${pest.toUpperCase()}\n\n**Region:** ${location} (${risk} risk)\n\n**Action Threshold:** ${threshold}\n\n**Treatment Plan:**\nPlease use **${chemical}** to manage the pest population.`
];

const pestTemplatesKn = [
    (pest: string, threshold: string, chemical: string, location: string, risk: string) => 
        `### ಎಚ್ಚರಿಕೆ: ${pest}\n\n` +
        `**ಪ್ರದೇಶ:** ${location} (${risk})\n\n` +
        `**ಕ್ರಮದ ಮಿತಿ:** ${threshold}\n\n` +
        `**ಚಿಕಿತ್ಸಾ ಕ್ರಮ:**\n` +
        `ದಯವಿಟ್ಟು ಕೀಟ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ **${chemical}** ಅನುಸರಿಸಿ.`,

    (pest: string, threshold: string, chemical: string, location: string, risk: string) => 
        `### ಕೀಟ ಸಲಹೆ: ${location} ದಲ್ಲಿ ${pest}\n\n` +
        `**ಅಪಾಯದ ಮಟ್ಟ:** ${risk}\n\n` +
        `**ವಿಶ್ಲೇಷಣೆ:**\n` +
        `ಧಾರವಾಡ ಪ್ರಾದೇಶಿಕ ಮಾದರಿಯ ಪ್ರಕಾರ, ಹಾನಿ **${threshold}** ತಲುಪಿದಾಗ ನಿಯಂತ್ರಣ ಕ್ರಮ ಅಗತ್ಯ.\n\n` +
        `**ಶಿಫಾರಸು:**\n` +
        `ಹತೋಟಿಗಾಗಿ ದಯವಿಟ್ಟು **${chemical}** ಕ್ರಮ ಕೈಗೊಳ್ಳಿ.`
];

const fertilizerTemplatesEn = [
    (stage: string, dose: string, location: string) => `### Fertilizer Advisory (${location})\n\n**Crop Stage:** ${stage}\n\n**Recommendation:**\nApply **${dose}** of Urea. This dosage is specifically calibrated for ${location} soils at this growth stage.`,
    (stage: string, dose: string, location: string) => `### Nutrient Management\n\n**Location:** ${location}\n**Stage:** ${stage}\n\n**Action:**\nWe recommend a top-dressing of **${dose}** of Urea.`
];

const fertilizerTemplatesKn = [
    (stage: string, dose: string, location: string) => {
        const stageKn = translateStage(stage, 'kn');
        return `### ರಸಗೊಬ್ಬರ ಸಲಹೆ (${location})\n\n**ಬೆಳೆಯ ಹಂತ:** ${stageKn}\n\n**ಶಿಫಾರಸು:**\n**${dose}** ಯೂರಿಯಾ ಬಳಸಿ. ಈ ಪ್ರಮಾಣವನ್ನು ${location} ಮಣ್ಣಿಗೆ ಮತ್ತು ಬೆಳವಣಿಗೆಯ ಹಂತಕ್ಕೆ ನಿಖರವಾಗಿ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ.`;
    },
    (stage: string, dose: string, location: string) => {
        const stageKn = translateStage(stage, 'kn');
        return `### ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆ\n\n**ಸ್ಥಳ:** ${location}\n**ಹಂತ:** ${stageKn}\n\n**ಕ್ರಮ:**\n**${dose}** ಯೂರಿಯಾ ಮೇಲುಗೊಬ್ಬರವಾಗಿ ನೀಡಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.`;
    }
];

export function renderAdvisoryTemplate(advisory: Advisory, sessionId: string, turnIndex: number, stage: string, lang: string = 'en'): string {
    const isKn = lang === 'kn';
    const locationFact = advisory.facts.find(f => f.label === 'Location');
    const rawLocation = locationFact ? String(locationFact.value) : 'Dharwad';
    const location = isKn ? (LOCATION_TRANSLATIONS[rawLocation] || rawLocation) : rawLocation;

    if (advisory.intent === 'irrigation_advice') {
        const depletionFact = advisory.facts.find(f => f.label === 'Depletion');
        const depletionStr = depletionFact ? `${depletionFact.value} ${depletionFact.unit || 'mm'}` : 'unknown';
        const templates = isKn ? irrigationTemplatesKn : irrigationTemplatesEn;
        const index = getVariantIndex(sessionId, turnIndex, templates.length);
        
        let response = templates[index](stage, depletionStr, advisory.headline, location);
        
        if (advisory.cautions && advisory.cautions.length > 0) {
            const caution = isKn ? translateText(advisory.cautions[0], 'kn') : advisory.cautions[0];
            response += isKn ? `\n\n*ಗಮನಿಸಿ: ${caution}*` : `\n\n*Note: ${caution}*`;
        }
        return response;
    }
    
    if (advisory.intent === 'pest_management') {
        const pestFact = advisory.facts.find(f => f.label === 'Pest Name');
        const thresholdFact = advisory.facts.find(f => f.label === 'Treatment Threshold');
        const chemicalFact = advisory.facts.find(f => f.label === 'Recommended Agent');
        const riskFact = advisory.facts.find(f => f.label === 'Location Risk');
        
        const rawPest = pestFact ? String(pestFact.value) : 'Fall Armyworm';
        const rawThreshold = thresholdFact ? String(thresholdFact.value) : '10% leaf damage';
        const rawChemical = chemicalFact ? String(chemicalFact.value) : 'recommended pesticide';
        const rawRisk = riskFact ? String(riskFact.value) : 'MODERATE';

        const pest = isKn ? (PEST_TRANSLATIONS[rawPest.toLowerCase()] || rawPest) : rawPest;
        const threshold = isKn ? (rawThreshold.replace('leaf damage', 'ಎಲೆ ಹಾನಿ')) : rawThreshold;
        const chemical = isKn ? (CHEMICAL_TRANSLATIONS[rawChemical] || rawChemical) : rawChemical;
        const risk = isKn ? (RISK_TRANSLATIONS[rawRisk] || rawRisk) : rawRisk;

        const templates = isKn ? pestTemplatesKn : pestTemplatesEn;
        const index = getVariantIndex(sessionId, turnIndex, templates.length);
        let response = templates[index](pest, threshold, chemical, location, risk);
        
        if (advisory.cautions && advisory.cautions.length > 0) {
            const caution = isKn ? translateText(advisory.cautions[0], 'kn') : advisory.cautions[0];
            response += isKn ? `\n\n*ಗಮನಿಸಿ: ${caution}*` : `\n\n*Note: ${caution}*`;
        }
        return response;
    }

    if (advisory.intent === 'fertilizer_dose') {
        const doseFact = advisory.facts.find(f => f.label === 'Recommended Dose');
        const dose = doseFact ? String(doseFact.value) : '0 kg/acre';
        const stageKn = translateStage(stage, 'kn');
        
        if (advisory.headline === 'WAIT') {
            return isKn 
                ? `### ರಸಗೊಬ್ಬರ ಸಲಹೆ (${location})\n\n**ಶಿಫಾರಸು:** ಕಾಯಿರಿ. ${stageKn} ಹಂತದಲ್ಲಿ ಗೊಬ್ಬರ ಕೊಡುವುದು ಸೂಕ್ತವಲ್ಲ.\n\n*ಸೂಚನೆ: ${translateText(advisory.cautions[0], 'kn')}*` 
                : `### Fertilizer Advisory (${location})\n\n**Recommendation:** WAIT. Top-dressing is not recommended at the ${stage} stage.\n\n*Note: ${advisory.cautions[0]}*`;
        }

        const templates = isKn ? fertilizerTemplatesKn : fertilizerTemplatesEn;
        const index = getVariantIndex(sessionId, turnIndex, templates.length);
        let response = templates[index](stage, dose, location);
        
        if (advisory.cautions && advisory.cautions.length > 0) {
            const caution = isKn ? translateText(advisory.cautions[0], 'kn') : advisory.cautions[0];
            response += isKn ? `\n\n*ಗಮನಿಸಿ: ${caution}*` : `\n\n*Note: ${caution}*`;
        }
        return response;
    }
    
    // Fallback simple rendering
    return isKn ? `ಶಿಫಾರಸು: ${advisory.headline}.` : `Recommendation: ${advisory.headline}.`;
}
