/**
 * Groq LLM integration for conversational advisory.
 */

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

const SYSTEM_PROMPT = `You are a helpful, practical Maize Crop Assistant for farmers in the Dharwad district of Karnataka.

CORE RULES:
1. STRICT GROUNDING: If AGRONOMIC CONTEXT is provided, you MUST base your answer ENTIRELY on those facts. Do not invent doses, dates, or rules. If the context says wait, say wait. If it gives a specific mm of water, use that exact number.
2. TONE: Speak like a knowledgeable local farmer or friendly extension worker. Keep it simple, practical, and easy to understand. Avoid overly corporate, academic, or robotic language.
3. LANGUAGE: Reply naturally in whatever language the farmer uses (English, Kannada/ಕನ್ನಡ, or romanized Kannada like "neeru hakbeka").
4. CONCISENESS: Farmers are busy in the field. Give the answer directly in 2-4 short sentences.
5. IF NO CONTEXT IS PROVIDED: If they ask a general maize farming question not in the context, answer based on standard practices for North Karnataka. If it's unrelated to farming, politely redirect.
6. formatting: Use bullet points or a single emoji (like 💧, 🐛, 🌱, ⚠️) to make it easy to read on a cheap smartphone screen in the sun.`;

export async function callGroq(
    conversationHistory: Array<{ role: 'user' | 'bot'; text: string }>,
    currentQuery: string,
    agronomicContext: string | null
): Promise<string> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('VITE_GROQ_API_KEY is not set in .env');
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const messages: ChatMessage[] = [];

    // Add recent history (last 6 turns)
    const recent = conversationHistory.slice(-6);
    for (const msg of recent) {
        messages.push({
            role: msg.role === 'bot' ? 'assistant' : 'user',
            content: msg.text
        });
    }

    // Current query with optional grounding context
    let userContent = currentQuery;
    if (agronomicContext) {
        userContent = `[AGRONOMIC CONTEXT FROM RULE ENGINE — ground your answer in these facts]\n${agronomicContext}\n\n[FARMER'S QUESTION]\n${currentQuery}`;
    }
    messages.push({ role: 'user', content: userContent });

    const body = {
        model: 'openai/gpt-oss-20b',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
    };

    // Strip all non-ASCII characters
    const safeApiKey = apiKey.replace(/[^\x20-\x7E]/g, '');

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${safeApiKey}`
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        let errMsg = `Groq error: ${res.status}`;
        try {
            const errData = await res.json();
            errMsg += ` - ${errData?.error?.message || JSON.stringify(errData)}`;
        } catch (e) {}
        throw new Error(errMsg);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '';
}

export async function callGroqNLU(utterance: string): Promise<any> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) return null;

    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const NLU_PROMPT = `You are an NLU intent extractor for a Maize farming app. 
Analyze the farmer's utterance and extract the intent and slots.
Allowed Intents: irrigation_advice, pest_management, fertilizer_dose, explain_why, alternative, challenge, consequence, greeting_smalltalk, market_price, provide_info, unknown.
Return ONLY valid JSON matching this schema:
{
  "intent": "string",
  "intentConfidence": 0.99,
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

    const safeApiKey = apiKey.replace(/[^\x20-\x7E]/g, '');

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
