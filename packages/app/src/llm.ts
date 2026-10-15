/**
 * Groq LLM integration for conversational advisory and accurate Kannada / English translation.
 */

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

const getApiKey = () => {
    return (import.meta.env.VITE_GROQ_API_KEY || '').trim();
};

const SYSTEM_PROMPT_KN = `You are an expert, practical Maize Crop Assistant for farmers in the Dharwad district of Karnataka.
CRITICAL LANGUAGE MANDATE:
The user interface is set to Kannada (ಕನ್ನಡ). You MUST reply ENTIRELY in natural, fluent Kannada script (ಕನ್ನಡ).
Do NOT produce English paragraphs. Even if the farmer typed or asked in English or romanized Kannada, your response MUST be in pure, grammatically correct Kannada (ಕನ್ನಡ).
Translate all agronomic recommendations, chemical names, metrics, and instructions clearly for a local farmer in Dharwad.

CORE RULES:
1. STRICT GROUNDING: If AGRONOMIC CONTEXT is provided, you MUST base your answer ENTIRELY on those facts. Do not invent doses, dates, or rules. If the context says wait, say wait. If it gives a specific mm of water or chemical dose, use that exact number.
2. TONE: Speak like a friendly, knowledgeable local farmer or agricultural extension worker. Keep it practical, simple, and encouraging.
3. CONCISENESS: Farmers are busy in the field. Give the answer directly in 2-4 short bullet points with emojis (🌾, 💧, 🐛, 🌱, ⚠️) that are easy to read on a mobile screen in the sun.
4. RSK & LOCAL ADVICE: If the context advises scouting or consulting RSK, emphasize visiting their nearest Raitha Samparka Kendra (ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ - RSK).`;

const SYSTEM_PROMPT_EN = `You are a helpful, practical Maize Crop Assistant for farmers in the Dharwad district of Karnataka.

CORE RULES:
1. STRICT GROUNDING: If AGRONOMIC CONTEXT is provided, you MUST base your answer ENTIRELY on those facts. Do not invent doses, dates, or rules. If the context says wait, say wait. If it gives a specific mm of water, use that exact number.
2. TONE: Speak like a knowledgeable local farmer or friendly extension worker. Keep it simple, practical, and easy to understand.
3. CONCISENESS: Give the answer directly in 2-4 short bullet points with emojis (🌾, 💧, 🐛, 🌱, ⚠️) that are easy to read on a mobile screen in the sun.
4. If they ask a general maize farming question not in the context, answer based on standard University of Agricultural Sciences (UAS) Dharwad recommendations.`;

export async function callGroq(
    conversationHistory: Array<{ role: 'user' | 'bot'; text: string }>,
    currentQuery: string,
    agronomicContext: string | null,
    targetLang: 'kn' | 'en' = 'en'
): Promise<string> {
    const rawApiKey = getApiKey();
    if (!rawApiKey) {
        throw new Error('VITE_GROQ_API_KEY is not configured');
    }

    const safeApiKey = rawApiKey.replace(/[^\x20-\x7E]/g, '');
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const messages: ChatMessage[] = [];

    // Add recent history (last 4 turns)
    const recent = conversationHistory.slice(-4);
    for (const msg of recent) {
        messages.push({
            role: msg.role === 'bot' ? 'assistant' : 'user',
            content: msg.text
        });
    }

    // Current query with optional grounding context
    let userContent = currentQuery;
    if (agronomicContext) {
        const langDirective = targetLang === 'kn'
            ? 'Translate and explain these facts in fluent Kannada (ಕನ್ನಡ) for the farmer.'
            : 'Explain these facts clearly in English for the farmer.';
        userContent = `[AGRONOMIC CONTEXT FROM RULE ENGINE — ${langDirective}]\n${agronomicContext}\n\n[FARMER'S QUESTION]\n${currentQuery}`;
    }
    messages.push({ role: 'user', content: userContent });

    const systemPrompt = targetLang === 'kn' ? SYSTEM_PROMPT_KN : SYSTEM_PROMPT_EN;

    // Helper to send completion request
    const requestWithModel = async (modelName: string) => {
        const body = {
            model: modelName,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.3,
            max_tokens: 450,
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${safeApiKey}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            let errMsg = `Groq HTTP ${res.status}`;
            try {
                const errData = await res.json();
                errMsg += ` - ${errData?.error?.message || JSON.stringify(errData)}`;
            } catch {}
            throw new Error(errMsg);
        }

        const data = await res.json();
        return data?.choices?.[0]?.message?.content || '';
    };

    try {
        // Try high-capacity Llama-3.3 model first
        return await requestWithModel('llama-3.3-70b-versatile');
    } catch (e1) {
        console.warn('Groq 70b attempt failed, attempting fallback to 8b instant model:', e1);
        try {
            return await requestWithModel('llama-3.1-8b-instant');
        } catch (e2) {
            throw e2;
        }
    }
}

export async function callGroqNLU(utterance: string): Promise<any> {
    const raw = utterance.trim().toLowerCase();
    const hasKannada = /[\u0C80-\u0CFF]/.test(utterance);
    const lang = hasKannada ? 'kn' : 'en';

    // Fast deterministic intent extraction for standard chips & queries
    if (raw.includes('ಏಕೆ') || raw.includes('ಯಾಕೆ') || raw === 'why' || raw.includes('why') || raw.includes('reason') || raw.includes('ಕಾರಣ')) {
        return { intent: 'explain_why', intentConfidence: 1.0, lang, slots: {} };
    }
    if (raw.includes('ಮಳೆ') || raw.includes('what if') || raw.includes('rains') || raw.includes('rain')) {
        return { intent: 'consequence', intentConfidence: 1.0, lang, slots: {} };
    }
    if (raw.includes('ಪರ್ಯಾಯ') || raw.includes('alternative') || raw.includes('ಬೇರೆ')) {
        return { intent: 'alternative', intentConfidence: 1.0, lang, slots: {} };
    }
    if (raw.includes('ಖಂಡಿತ') || raw.includes('ಖಚಿತ') || raw.includes('sure') || raw.includes('challenge')) {
        return { intent: 'challenge', intentConfidence: 1.0, lang, slots: {} };
    }
    if (raw.includes('ನೀರು') || raw.includes('ನೀರಾವರಿ') || raw.includes('irrigat') || raw.includes('water')) {
        return { intent: 'irrigation_advice', intentConfidence: 0.95, lang, slots: {} };
    }
    if (raw.includes('ಕೀಟ') || raw.includes('ಹುಳು') || raw.includes('pest') || raw.includes('armyworm') || raw.includes('faw')) {
        return { intent: 'pest_management', intentConfidence: 0.95, lang, slots: {} };
    }
    if (raw.includes('ಗೊಬ್ಬರ') || raw.includes('ಯೂರಿಯಾ') || raw.includes('fertiliz') || raw.includes('urea')) {
        return { intent: 'fertilizer_dose', intentConfidence: 0.95, lang, slots: {} };
    }

    const rawApiKey = getApiKey();
    if (!rawApiKey) return null;

    const safeApiKey = rawApiKey.replace(/[^\x20-\x7E]/g, '');
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    const NLU_PROMPT = `You are an NLU intent extractor for a Maize farming app in Karnataka. 
Analyze the farmer's utterance and extract the intent and slots.
Allowed Intents: irrigation_advice, pest_management, fertilizer_dose, explain_why, alternative, challenge, consequence, greeting_smalltalk, market_price, provide_info, unknown.
Return ONLY valid JSON matching this schema:
{
  "intent": "string",
  "intentConfidence": 0.95,
  "lang": "en" | "kn",
  "slots": {
    "location": { "value": "string" },
    "stage": { "value": "string" },
    "pest": { "value": "string" },
    "soil": { "value": "string" }
  }
}
If there are no slots, leave the slots object empty.`;

    const body = {
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: NLU_PROMPT },
            { role: 'user', content: utterance }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${safeApiKey}`
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) return null;
        const data = await res.json();
        const jsonStr = data?.choices?.[0]?.message?.content || '{}';
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Groq NLU extraction failed", e);
        return null;
    }
}
