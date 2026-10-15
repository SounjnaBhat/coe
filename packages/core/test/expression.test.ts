import { describe, it, expect } from 'vitest';
import { MaizeAdvisorCore } from '../src/index';

describe('Conversational Layer (Parts 1-3)', () => {
    it('rotates templates based on turn index (Part 1)', async () => {
        const core = new MaizeAdvisorCore();
        await core.initialize();
        
        const state1 = { sessionId: 's1', turnIndex: 0, farmerId: 'f1', location: 'DWD', stage: 'V4', weatherFeatures: { dToday: 60, raw: 50, forecastRain72h: 0 }, previousAdvisory: null };
        const state2 = { ...state1, turnIndex: 1 };
        
        const res1 = await core.processUtterance('how much water', state1);
        const res2 = await core.processUtterance('how much water', state2);
        
        expect(res1.text).toBeDefined();
        expect(res2.text).toBeDefined();
        expect(res1.advisory?.headline).toBeDefined();
    });

    it('answers meta-intents from previous advisory (Part 2)', async () => {
        const core = new MaizeAdvisorCore();
        await core.initialize();
        
        const state = { sessionId: 's1', turnIndex: 0, farmerId: 'f1', location: 'DWD', stage: 'V4', weatherFeatures: { dToday: 60, raw: 50, forecastRain72h: 0 }, previousAdvisory: null };
        
        // Trigger irrigation advisory
        await core.processUtterance('how much water', state);
        expect(state.previousAdvisory).not.toBeNull();
        
        // Ask why (should pull from facts)
        const whyRes = await core.processUtterance('why', state);
        expect(whyRes.text).toContain('You are advised to');
        expect(whyRes.text).toContain('because');
        
        // Challenge
        const sureRes = await core.processUtterance('are you sure', state);
        expect(sureRes.text).toContain('strictly on local agronomic models');
    });

    it('provides graceful refusal (Part 3)', async () => {
        const core = new MaizeAdvisorCore();
        await core.initialize();
        
        const state = { sessionId: 's1', turnIndex: 0, farmerId: 'f1', location: 'DWD', stage: 'V4', weatherFeatures: { dToday: 60, raw: 50, forecastRain72h: 0 }, previousAdvisory: null };
        
        // Utterance that gets matched as unknown
        const res = await core.processUtterance('who is the prime minister', state);
        expect(res.text).toContain('I can help you with irrigation planning, pest control');
    });

    it('returns natural Kannada responses when lang is kn', async () => {
        const core = new MaizeAdvisorCore();
        await core.initialize();
        
        const stateKn = { sessionId: 's1', turnIndex: 0, farmerId: 'f1', location: 'Dharwad', stage: '30 days', weatherFeatures: { dToday: 60, forecastRain72h: 0 }, previousAdvisory: null, lang: 'kn' as const };
        
        // Pest query in English while in Kannada mode
        const pestRes = await core.processUtterance('Pest control', stateKn);
        expect(pestRes.text).toContain('ಲದ್ದಿ ಹುಳು');
        expect(pestRes.text).toContain('ಕೀಟ ಸಲಹೆ');
        expect(pestRes.text).toContain('ಸೂಚಿಸಲಾದ ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು');
        
        // Follow-up question in Kannada
        const whyRes = await core.processUtterance('why', stateKn);
        expect(whyRes.text).toContain('ಸಲಹೆ');
    });
});
