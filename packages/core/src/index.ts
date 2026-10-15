import { NLUInferenceEngine } from './nlu/inference';
import { RuleEngine } from './reasoning/rules';
import { irrigationRule } from './reasoning/irrigation';
import { pestRule } from './reasoning/pest';
import { fertilizerRule } from './reasoning/fertilizer';
import { searchHybrid } from './retrieval/index';
import type { Advisory, Lang } from './contracts/types';
import { renderAdvisoryTemplate } from './expression/templates';
import { generateParaphrase } from './expression/generate';
import { NullGenerationPort, NullNLUPort, type GenerationPort, type NLUPort } from './network/ports';

export interface AppState {
    sessionId: string;
    turnIndex: number;
    farmerId: string;
    location?: string;
    stage?: string;
    weatherFeatures: Record<string, any>;
    previousAdvisory: Advisory | null;
    pendingIntent?: string;
    lang?: Lang;
}

export interface CoreConfig {
    generationEnabled: boolean;
    generationPort: GenerationPort;
    nluPort: NLUPort;
}

const FOLLOW_UP_TRANSLATIONS_KN: Record<string, string> = {
    'Why?': 'ಏಕೆ ಈ ಸಲಹೆ?',
    'What if it rains?': 'ಮಳೆ ಬಂದರೆ ಏನು ಮಾಡಬೇಕು?',
    'Alternative?': 'ಪರ್ಯಾಯ ಔಷಧಿ ಯಾವುದು?',
    'Dharwad': 'ಧಾರವಾಡ',
    'Hubli': 'ಹುಬ್ಬಳ್ಳಿ',
    '30 days': '30 ದಿನಗಳು',
    'Sowing': 'ಬಿತ್ತನೆ ಹಂತ',
    'Irrigation': 'ನೀರಾವರಿ',
    'Pest Control': 'ಕೀಟ ನಿಯಂತ್ರಣ',
    'Fertilizer': 'ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ',
};

export class MaizeAdvisorCore {
    private nlu: NLUInferenceEngine;
    private ruleEngine: RuleEngine;
    private config: CoreConfig;

    constructor(config?: Partial<CoreConfig>) {
        this.config = {
            generationEnabled: config?.generationEnabled ?? false,
            generationPort: config?.generationPort ?? new NullGenerationPort(),
            nluPort: config?.nluPort ?? new NullNLUPort()
        };
        this.nlu = new NLUInferenceEngine(this.config.nluPort);
        this.ruleEngine = new RuleEngine();
        this.ruleEngine.registerRule(irrigationRule);
        this.ruleEngine.registerRule(pestRule);
        this.ruleEngine.registerRule(fertilizerRule);
    }

    async initialize() {
        await this.nlu.initialize('mock_path.onnx');
    }

    async processUtterance(utterance: string, state: AppState): Promise<{ text: string; advisory: Advisory | null }> {
        // 1. UNDERSTANDING (NLU)
        const frame = await this.nlu.predict(utterance);

        // Determine effective language: prioritize user's active UI language or Kannada script detection
        const hasKannadaChar = /[\u0C80-\u0CFF]/.test(utterance);
        const effectiveLang: Lang = (hasKannadaChar || state.lang === 'kn' || frame.lang === 'kn') ? 'kn' : 'en';

        // 3. OOD / Fallback Logic (T5.3)
        if (frame.intent === 'unknown' || frame.intentConfidence < 0.6) {
            const fallbackText = effectiveLang === 'kn'
                ? "ನಾನು ನಿಮಗೆ ಮೆಕ್ಕೆಜೋಳದ ನೀರಾವರಿ ಯೋಜನೆ, ಕೀಟ ನಿಯಂತ್ರಣ (ಲದ್ದಿ ಹುಳು), ಮತ್ತು ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣದ ಬಗ್ಗೆ ಸಲಹೆ ನೀಡಬಲ್ಲೆ. ಇವುಗಳಲ್ಲಿ ಯಾವುದರ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?"
                : "I can help you with irrigation planning, pest control (like Fall Armyworm), and fertilizer application. Would you like to ask about one of those?";
            return { text: fallbackText, advisory: null };
        }

        // 4. Handle info provisioning (Clarification responses)
        if (frame.intent === 'provide_info') {
            if (frame.slots && frame.slots['location']) state.location = frame.slots['location'].value as string;
            if (frame.slots && frame.slots['stage']) state.stage = frame.slots['stage'].value as string;
            if (frame.slots && frame.slots['soil']) state.weatherFeatures['soil'] = frame.slots['soil'].value;

            if (state.pendingIntent) {
                frame.intent = state.pendingIntent as any; // Resume pending goal
                state.pendingIntent = undefined; // Clear it
            } else {
                return { text: effectiveLang === 'kn' ? "ಧನ್ಯವಾದಗಳು. ಈಗ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ." : "Thanks for the information. What is your question?", advisory: null };
            }
        }

        // Handle meta-intents first
        if (frame.intent === 'greeting_smalltalk') {
            return { text: effectiveLang === 'kn' ? 
                "ನಮಸ್ಕಾರ! ನೀವು ಕನ್ನಡದಲ್ಲಿಯೂ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು. ಮೆಕ್ಕೆಜೋಳದ ಕೀಟ, ರಸಗೊಬ್ಬರ, ಮತ್ತು ನೀರಿನ ನಿರ್ವಹಣೆ ಬಗ್ಗೆ ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ." : 
                "Hello! I can answer your questions in English or Kannada. Ask me about irrigation, pests, or fertilizers for your maize crop.", advisory: null };
        }
        if (frame.intent === 'explain_why') {
            let adv = state.previousAdvisory;
            if (!adv) {
                try {
                    const dummyFrame = { intent: 'irrigation_advice', intentConfidence: 1.0, slots: {}, lang: effectiveLang };
                    adv = this.ruleEngine.evaluate(dummyFrame, {
                        ...state.weatherFeatures,
                        location: state.location,
                        stage: state.stage
                    });
                    state.previousAdvisory = adv;
                } catch {
                    // Fallback to default
                }
            }
            if (adv) {
                if (effectiveLang === 'kn') {
                    if (adv.intent === 'irrigation_advice') {
                        const depl = adv.facts.find(f => f.label === 'Depletion')?.value || '1';
                        const rain = adv.facts.find(f => f.label === 'Forecast Rain' || f.label === 'Forecast Rain (72h)')?.value || '0';
                        if (adv.headline === 'WAIT') {
                            return {
                                text: `💡 **ಸಲಹೆಯ ವೈಜ್ಞಾನಿಕ ವಿವರಣೆ (ಏಕೆ ಕಾಯಬೇಕು?):**\n\n- ನಿಮ್ಮ ಹೊಲದ ಮಣ್ಣಿನಲ್ಲಿ ನೀರಿನ ಕೊರತೆ ಕೇವಲ **${depl} ಮಿ.ಮೀ** ಇದೆ.\n- ಮೆಕ್ಕೆಜೋಳದ ಸುರಕ್ಷಿತ ತೇವಾಂಶ ಮಿತಿ (MAD) **55 ಮಿ.ಮೀ** ವರೆಗೆ ಇರುತ್ತದೆ.\n- ಮುಂದಿನ 72 ಗಂಟೆಗಳಲ್ಲಿ **${rain} ಮಿ.ಮೀ** ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇದೆ.\n\nಆದ್ದರಿಂದ ಮಣ್ಣಿನಲ್ಲಿ ಬೆಳೆಯ ಬೆಳವಣಿಗೆಗೆ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿರುವುದರಿಂದ ಈಗ ನೀರುಣಿಸುವ ಅಗತ್ಯವಿಲ್ಲ. ಹೆಚ್ಚು ನೀರು ಹಾಕಿದರೆ ಬೇರು ಕೊಳೆಯುವ ಸಂಭವವಿರುತ್ತದೆ.`,
                                advisory: null
                            };
                        } else {
                            return {
                                text: `💡 **ಸಲಹೆಯ ವೈಜ್ಞಾನಿಕ ವಿವರಣೆ (ಏಕೆ ನೀರು ಹಾಕಬೇಕು?):**\n\n- ನಿಮ್ಮ ಮಣ್ಣಿನಲ್ಲಿ ನೀರಿನ ಕೊರತೆ **${depl} ಮಿ.ಮೀ** ತಲುಪಿದ್ದು, ಸುರಕ್ಷಿತ ಮಿತಿಯನ್ನು (MAD) ಮೀರಿದೆ.\n- ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ ಕಡಿಮೆ ಇರುವುದರಿಂದ, ಬೆಳೆಯ ಬೆಳವಣಿಗೆಗೆ ಧಕ್ಕೆಯಾಗದಂತೆ ತಕ್ಷಣ ನೀರುಣಿಸುವುದು ಅತ್ಯಗತ್ಯ.`,
                                advisory: null
                            };
                        }
                    } else if (adv.intent === 'pest_management') {
                        return {
                            text: `💡 **ಸಲಹೆಯ ವೈಜ್ಞಾನಿಕ ವಿವರಣೆ (ಕೀಟ ನಿಯಂತ್ರಣ):**\n\n- ಧಾರವಾಡ ಪ್ರದೇಶದಲ್ಲಿ ಲದ್ದಿ ಹುಳು (Fall Armyworm) ಬಾಧೆಯು ಆರ್ಥಿಕ ಹಾನಿ ಮಿತಿಯನ್ನು (10% ಎಲೆ ಹಾನಿ) ತಲುಪಿದೆ.\n- ಕೀಟವು ಸುಳಿ ಮತ್ತು ಎಲೆಗಳನ್ನು ತಿಂದು ಬೆಳೆಯನ್ನು ಹಾಳುಮಾಡುವುದನ್ನು ತಡೆಯಲು ತಕ್ಷಣ ಹೊಲ ಪರಿಶೀಲಿಸಿ, ಸ್ಥಳೀಯ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK) ಸಲಹೆಯಂತೆ ಶಿಫಾರಸು ಮಾಡಿದ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಕು.`,
                            advisory: null
                        };
                    } else if (adv.intent === 'fertilizer_dose') {
                        return {
                            text: `💡 **ಸಲಹೆಯ ವೈಜ್ಞಾನಿಕ ವಿವರಣೆ (ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ):**\n\n- ಮೆಕ್ಕೆಜೋಳದ ಉತ್ತಮ ಇಳುವರಿಗಾಗಿ ಸಾರಜನಕ (ಯೂರಿಯಾ) ಅತ್ಯಂತ ಪ್ರಮುಖ ಪೋಷಕಾಂಶವಾಗಿದೆ.\n- ಬಿತ್ತನೆಯ 30-40 ದಿನಗಳ ಬೆಳವಣಿಗೆ ಹಂತದಲ್ಲಿ ಬೆಳೆಯು ವೇಗವಾಗಿ ಬೆಳೆಯುವುದರಿಂದ, ಈ ಸಮಯದಲ್ಲಿ ಮೊದಲ ಮೇಲುಗೊಬ್ಬರವನ್ನು ನೀಡಿದರೆ ಕಾಂಡ ಮತ್ತು ಎಲೆಗಳು ಬಲಗೊಳ್ಳುತ್ತವೆ.`,
                            advisory: null
                        };
                    }
                    const actionKn = adv.headline === 'WAIT' ? 'ಕಾಯಲು' : 'ಕ್ರಮ ಕೈಗೊಳ್ಳಲು';
                    return { text: `💡 ನೀವು ${actionKn} ಸಲಹೆ ನೀಡಲಾಗಿದೆ ಏಕೆಂದರೆ ಮಣ್ಣು ಹಾಗೂ ಬೆಳೆಯ ಸ್ಥಿತಿಯ ವೈಜ್ಞಾನಿಕ ವಿಶ್ಲೇಷಣೆಯ ಪ್ರಕಾರ ಇದು ಅತ್ಯಂತ ಸೂಕ್ತ ಕ್ರಮವಾಗಿದೆ.`, advisory: null };
                }
                return { text: `You are advised to ${adv.headline} because ${adv.facts.map(f => `${f.label} is ${f.value}`).join(' and ')}.`, advisory: null };
            }
        }
        if (frame.intent === 'alternative' && state.previousAdvisory) {
            const prevIntent = state.previousAdvisory.intent;
            if (prevIntent === 'pest_management') {
                return { text: effectiveLang === 'kn'
                    ? "ಸಾವಯವ ಪರ್ಯಾಯವಾಗಿ, ನೀವು ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2 ಮಿ.ಲೀ ಬೇವಿನ ಎಣ್ಣೆ (10,000 ppm) ಅಥವಾ ಬ್ಯಾಸಿಲಸ್ ತುರಿಂಜಿಯೆನ್ಸಿಸ್ (Bt) ಸೂತ್ರೀಕರಣವನ್ನು ಬಳಸಬಹುದು."
                    : "For an organic alternative, you can use Neem oil (10,000 ppm) at 2 ml/litre of water or apply Bacillus thuringiensis (Bt) formulation.", advisory: null };
            } else if (prevIntent === 'fertilizer_dose') {
                return { text: effectiveLang === 'kn'
                    ? "ಸಾವಯವ ಪರ್ಯಾಯಕ್ಕಾಗಿ, ರಾಸಾಯನಿಕ ಗೊಬ್ಬರಗಳ ಬದಲಾಗಿ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ (FYM) ಅಥವಾ ಎರೆಹುಳು ಗೊಬ್ಬರವನ್ನು ಬಳಸಬಹುದು."
                    : "For an organic approach, you can substitute chemical fertilizers with Farm Yard Manure (FYM) or vermicompost, though it is best applied during field preparation rather than top-dressing.", advisory: null };
            } else {
                return { text: effectiveLang === 'kn'
                    ? `ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆ ಹಂತಕ್ಕೆ, ${state.previousAdvisory.headline} ಅತ್ಯಂತ ಸೂಕ್ತವಾದ ವೈಜ್ಞಾನಿಕ ಕ್ರಮವಾಗಿದೆ.`
                    : `I'm sorry, based on the current weather and crop stage, ${state.previousAdvisory.headline} is the most scientifically sound action right now.`, advisory: null };
            }
        }
        if (frame.intent === 'challenge' && state.previousAdvisory) {
            return { text: effectiveLang === 'kn'
                ? `ಹೌದು, ಈ ಸಲಹೆಯು ಧಾರವಾಡ ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯದ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಮಾಹಿತಿಯನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಆಧರಿಸಿದೆ.`
                : `Yes, the advice to ${state.previousAdvisory.headline} is based strictly on local agronomic models and current data.`, advisory: null };
        }
        if (frame.intent === 'consequence' && state.previousAdvisory) {
            const prevIntent = state.previousAdvisory.intent;
            if (prevIntent === 'irrigation_advice') {
                return { text: effectiveLang === 'kn'
                    ? "ಗಮನಾರ್ಹ ಮಳೆ ಬಂದರೆ (10-15 ಮಿ.ಮೀ ಗಿಂತ ಹೆಚ್ಚು), ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶ ಮರುಪೂರಣಗೊಳ್ಳುತ್ತದೆ ಮತ್ತು ನೀವು ನೀರಾವರಿಯನ್ನು 3-4 ದಿನ ಮುಂದೂಡಬಹುದು."
                    : `If it rains significantly (more than 10-15mm), the soil moisture will be replenished and you can delay irrigation by 3-4 days.`, advisory: null };
            } else if (prevIntent === 'pest_management') {
                return { text: effectiveLang === 'kn'
                    ? "ಭಾರಿ ಮಳೆಯು ಇತ್ತೀಚೆಗೆ ಸಿಂಪಡಿಸಿದ ಕೀಟನಾಶಕಗಳನ್ನು ತೊಳೆದುಹಾಕಬಹುದು. ಸಿಂಪಡಿಸುವ ಮೊದಲು ಮಳೆ ನಿಲ್ಲುವವರೆಗೆ ಕಾಯಿರಿ."
                    : `Heavy rains can wash away recently applied pesticides, reducing their effectiveness. Wait for a clear window before spraying.`, advisory: null };
            } else if (prevIntent === 'fertilizer_dose') {
                return { text: effectiveLang === 'kn'
                    ? "ಯೂರಿಯಾ ಹಾಕಿದ ನಂತರ ಸಾಧಾರಣ ಮಳೆ ಬಂದರೆ ರಸಗೊಬ್ಬರ ಬೇರುಗಳಿಗೆ ತಲುಪಲು ಸಹಾಯಕ. ಆದರೆ ಅತಿಯಾದ ಮಳೆಯಾದರೆ ಕೊಚ್ಚಿಹೋಗುವ ಸಂಭವವಿದೆ."
                    : `Rain after applying urea is beneficial as it washes the fertilizer into the root zone. However, heavy downpours can cause leaching.`, advisory: null };
            } else {
                return { text: effectiveLang === 'kn'
                    ? "ಹವಾಮಾನ ಬದಲಾವಣೆಗಳು ಯಾವುದೇ ಕೃಷಿ ಕ್ರಮದ ಮೇಲೆ ಪ್ರಭಾವ ಬೀರಬಹುದು. ಯಾವಾಗಲೂ ಮುನ್ಸೂಚನೆಯನ್ನು ಗಮನಿಸಿ."
                    : `Weather changes can impact the effectiveness of any field intervention. Always check the forecast.`, advisory: null };
            }
        }
        // Meta-intent without context — ask the user to start with a domain question first
        if (['explain_why', 'alternative', 'challenge', 'consequence'].includes(frame.intent) && !state.previousAdvisory) {
            return { text: effectiveLang === 'kn'
                ? "ದಯವಿಟ್ಟು ಮೊದಲು ನೀರಾವರಿ, ಕೀಟ ಅಥವಾ ರಸಗೊಬ್ಬರದ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ. ನಂತರ ನಾನು ಕಾರಣವನ್ನು ವಿವರಿಸಬಹುದು ಅಥವಾ ಪರ್ಯಾಯಗಳನ್ನು ಸೂಚಿಸಬಹುದು."
                : "Could you first ask me a question about irrigation, pests, or fertilizer? Then I can explain my reasoning or suggest alternatives.", advisory: null };
        }

        // 2. REASONING (Rules + Retrieval)
        const combinedFeatures = { ...state.weatherFeatures, location: state.location, stage: state.stage };
        let advisory: Advisory | null = null;
        try {
            advisory = this.ruleEngine.evaluate(frame, combinedFeatures);
        } catch (e: any) {
            if (e.message?.startsWith('MISSING_FEATURE:')) {
                const missingKey = e.message.split(':')[1];
                state.pendingIntent = frame.intent; // Save the goal
                if (missingKey.includes('soil')) {
                    return { text: effectiveLang === 'kn' ? "ನಿಮ್ಮ ಜಮೀನಿನಲ್ಲಿ ಯಾವ ರೀತಿಯ ಮಣ್ಣು ಇದೆ? (ಉದಾಹರಣೆಗೆ: ಕೆಂಪು ಮಣ್ಣು, ಕಪ್ಪು ಮಣ್ಣು)" : "What type of soil do you have in your field? (e.g., red soil, black soil)", advisory: null };
                }
                if (missingKey.includes('location')) {
                    return { text: effectiveLang === 'kn' ? "ನಿಮ್ಮ ಜಮೀನು ಯಾವ ತಾಲೂಕು/ಜಿಲ್ಲೆಯಲ್ಲಿದೆ?" : "Which district or location is your field in?", advisory: null };
                }
                if (missingKey.includes('stage')) {
                    return { text: effectiveLang === 'kn' ? "ಮೆಕ್ಕೆಜೋಳ ಬಿತ್ತನೆ ಮಾಡಿ ಎಷ್ಟು ದಿನಗಳಾಗಿವೆ?" : "How many days has it been since you planted the maize?", advisory: null };
                }
                return { text: effectiveLang === 'kn' ? `ನನಗೆ ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಬೇಕು: ${missingKey}` : `I need more information about: ${missingKey}`, advisory: null };
            }
            throw e;
        }
        
        let response = "";
        if (advisory) {
            state.previousAdvisory = advisory;
            response = renderAdvisoryTemplate(advisory, state.sessionId, state.turnIndex, state.stage || '30 days', effectiveLang);
            if (advisory.suggestedFollowUps && advisory.suggestedFollowUps.length > 0) {
                const followUps = effectiveLang === 'kn'
                    ? advisory.suggestedFollowUps.map(fu => FOLLOW_UP_TRANSLATIONS_KN[fu] || fu)
                    : advisory.suggestedFollowUps;
                const header = effectiveLang === 'kn' ? 'ಸೂಚಿಸಲಾದ ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು:' : 'Suggested Follow-ups:';
                response += `\n\n---\n**${header}**\n${followUps.map(s => `- ${s}`).join('\n')}`;
            }
        } else {
            const docs = searchHybrid(utterance, [1,0,0,0]);
            if (docs.length > 0) {
                response = docs[0].text_en;
            } else {
                response = effectiveLang === 'kn'
                    ? "ನಾನು ನಿಮಗೆ ಮೆಕ್ಕೆಜೋಳದ ನೀರಾವರಿ ಯೋಜನೆ, ಕೀಟ ನಿಯಂತ್ರಣ (ಲದ್ದಿ ಹುಳು), ಮತ್ತು ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣದ ಬಗ್ಗೆ ಸಲಹೆ ನೀಡಬಲ್ಲೆ. ಇವುಗಳಲ್ಲಿ ಯಾವುದರ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?"
                    : "I can help you with irrigation planning, pest control (like Fall Armyworm), and fertilizer application. Would you like to ask about one of those?";
            }
        }

        // T4: Grounded Paraphrase Integration
        if (this.config.generationEnabled) {
            const docs = !advisory ? searchHybrid(utterance, [1,0,0,0]) : [];
            const cardText = docs.length > 0 ? docs[0].text_en : null;
            const paraphrase = await generateParaphrase(
                this.config.generationPort,
                advisory,
                cardText,
                frame.normalized,
                [],
                effectiveLang
            );
            if (paraphrase) {
                response = paraphrase;
            }
        }

        return { text: response, advisory };
    }
}
