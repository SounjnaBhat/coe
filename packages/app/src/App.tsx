import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MaizeAdvisorCore } from '@advisor/core';
import { MockGeminiPort } from '@advisor/core/src/network/ports';
import { type NLUPort } from '@advisor/core/src/network/ports';

import './styles/tokens.css';
import './styles/base.css';
import './styles/card.css';
import './styles/app.css';

import { AdvisoryCard } from './components/AdvisoryCard';
import { ContextStrip } from './components/ContextStrip';
import { TranscriptConfirm } from './components/TranscriptConfirm';
import { LoginPage, type UserProfileData } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { callGroq, callGroqNLU } from './llm';
import { translations, type Lang } from './translations';
import { syncFarmerProfile, fetchFarmerProfile, logChatMessage } from './supabase';

class GroqNLUPort implements NLUPort {
  async extractIntent(utterance: string): Promise<any> {
    return await callGroqNLU(utterance);
  }
}

function parseMarkdown(text: string): React.ReactNode[] {
  const sanitized = text.replace(/<[^>]*>?/gm, '');
  const lines = sanitized.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, li) => {
    if (li > 0) elements.push(<br key={`br-${li}`} />);
    let heading: React.ReactNode | null = null;
    if (line.startsWith('### ')) heading = <h3 key={`h-${li}`}>{parseBold(line.slice(4))}</h3>;
    else if (line.startsWith('## ')) heading = <h2 key={`h-${li}`}>{parseBold(line.slice(3))}</h2>;
    else if (line.startsWith('# ')) heading = <h1 key={`h-${li}`}>{parseBold(line.slice(2))}</h1>;

    if (heading) elements.push(heading);
    else if (line.startsWith('- ')) elements.push(<span key={`li-${li}`} style={{ display: 'block', paddingLeft: '8px' }}>{'• '}{parseBold(line.slice(2))}</span>);
    else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) elements.push(<em key={`em-${li}`}>{line.slice(1, -1)}</em>);
    else elements.push(<span key={`s-${li}`}>{parseBold(line)}</span>);
  });
  return elements;
}

function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

const core = new MaizeAdvisorCore({
  generationEnabled: false,
  generationPort: new MockGeminiPort(),
  nluPort: new GroqNLUPort()
});

// ─── Web Speech API Hook ───
type SpeechLang = 'kn-IN' | 'en-IN';

interface SpeechState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  detectedLang: SpeechLang;
  isSupported: boolean;
  error: string | null;
}

function useSpeechRecognition() {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    detectedLang: 'kn-IN',
    isSupported: false,
    error: null,
  });
  const recognitionRef = useRef<any>(null);
  const currentLangRef = useRef<SpeechLang>('kn-IN');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setState(s => ({ ...s, isSupported: true }));
    }
  }, []);

  const startListening = useCallback((lang: SpeechLang = 'kn-IN') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setState(s => ({ ...s, error: 'Speech recognition not supported' }));
      return;
    }
    if (recognitionRef.current) recognitionRef.current.abort();

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    currentLangRef.current = lang;

    recognition.onstart = () => {
      setState(s => ({ ...s, isListening: true, transcript: '', interimTranscript: '', detectedLang: lang, error: null }));
    };

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }
      setState(s => ({ ...s, transcript: final, interimTranscript: interim }));
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setState(s => ({ ...s, error: event.error, isListening: false }));
      }
    };

    recognition.onend = () => setState(s => ({ ...s, isListening: false }));
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
  }, []);

  const setLanguage = useCallback((lang: SpeechLang) => {
    currentLangRef.current = lang;
    setState(s => ({ ...s, detectedLang: lang }));
  }, []);

  const toggleLang = useCallback(() => {
    const newLang: SpeechLang = currentLangRef.current === 'kn-IN' ? 'en-IN' : 'kn-IN';
    currentLangRef.current = newLang;
    setState(s => ({ ...s, detectedLang: newLang }));
    return newLang;
  }, []);

  return { ...state, startListening, stopListening, toggleLang, setLanguage };
}

// ─── Message Types ───
interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  followUps?: string[];
  advisory?: any;
  isTranscript?: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'login'>('chat');
  const [uiLang, setUiLang] = useState<Lang>('kn');

  const [userProfile, setUserProfile] = useState<UserProfileData>({
    farmerId: 'f_001',
    name: 'Ramesh Patil',
    phone: '9876543210',
    location: 'Dharwad',
    stage: '30 days',
    soil: 'Black Soil',
    isLoggedIn: true,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [appState, setAppState] = useState({
    sessionId: 'web-session',
    turnIndex: 0,
    previousAdvisory: null as any,
    pendingIntent: undefined as string | undefined,
    farmerId: 'f_001',
    location: 'Dharwad' as string | undefined,
    stage: '30 days' as string | undefined,
    weatherFeatures: { dToday: 60, forecastRain72h: 0 },
  });

  const speech = useSpeechRecognition();
  const t = translations[uiLang];

  useEffect(() => {
    core.initialize().then(() => setIsReady(true));

    // Load saved user profile and sync with Supabase
    const saved = localStorage.getItem('holamaatu_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed);
        const lookup = parsed.farmerId || parsed.phone;
        if (lookup) {
          fetchFarmerProfile(lookup).then(fresh => {
            if (fresh) {
              setUserProfile(prev => ({ ...prev, ...fresh, isLoggedIn: prev.isLoggedIn }));
            }
          });
        }
      } catch {}
    }
  }, []);

  // Sync user profile changes to appState
  useEffect(() => {
    setAppState(prev => ({
      ...prev,
      farmerId: userProfile.farmerId,
      location: userProfile.location,
      stage: userProfile.stage,
    }));
  }, [userProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (speech.transcript && !speech.isListening) {
      handleSend(speech.transcript, true);
    }
  }, [speech.transcript, speech.isListening]);

  useEffect(() => {
    if (speech.isListening && speech.interimTranscript) {
      setInput(speech.interimTranscript);
    }
  }, [speech.interimTranscript, speech.isListening]);

  const handleSend = async (text?: string, isFromSpeech = false) => {
    const msg = (text || input).trim();
    if (!msg || !isReady || isThinking) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msg,
      timestamp: new Date(),
      isTranscript: isFromSpeech
    };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setIsThinking(true);

    // Persist user interaction to Supabase asynchronously
    logChatMessage(userProfile.farmerId, 'user', msg);

    const currentState = { ...appState, turnIndex: appState.turnIndex + 1 };

    try {
      const botRes = await core.processUtterance(msg, currentState);
      setAppState(currentState);

      let followUps = botRes.advisory?.suggestedFollowUps || [];
      if (!botRes.advisory && botRes.text) {
        if (botRes.text.includes('Which district') || botRes.text.includes('stage')) {
           followUps = ['Dharwad', 'Hubli', '30 days', 'Sowing'];
        } else {
           followUps = ['Irrigation', 'Pest Control', 'Fertilizer'];
        }
      }

      // Re-enable Groq LLM overriding the text response
      let finalBotText = botRes.text;
      try {
        const history = messages.map(m => ({ role: m.sender, text: m.text }));
        const ctxStr = botRes.advisory ? JSON.stringify(botRes.advisory) : (botRes.text || null);
        const llmResponse = await callGroq(history, msg, ctxStr);
        if (llmResponse) {
          finalBotText = llmResponse;
        }
      } catch (err) {
        console.warn('Groq LLM failed, falling back to rule engine text', err);
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: finalBotText,
        timestamp: new Date(),
        followUps,
        advisory: botRes.advisory
      };
      setMessages(m => [...m, botMsg]);

      // Persist bot advisory to Supabase asynchronously
      logChatMessage(userProfile.farmerId, 'bot', finalBotText, botRes.advisory);
    } catch {
      setMessages(m => [
        ...m,
        {
          id: `e-${Date.now()}`,
          sender: 'bot',
          text: uiLang === 'kn' ? 'ಕ್ಷಮಿಸಿ, ದೋಷವೊಂದು ಸಂಭವಿಸಿದೆ.' : 'Sorry, something went wrong.',
          timestamp: new Date(),
        },
      ]);
    }
    setIsThinking(false);
  };

  const handleMicToggle = () => {
    const targetLang: SpeechLang = uiLang === 'kn' ? 'kn-IN' : 'en-IN';
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.startListening(targetLang);
    }
  };

  const handleLangToggle = () => {
    const nextLang: Lang = uiLang === 'kn' ? 'en' : 'kn';
    setUiLang(nextLang);
    speech.setLanguage(nextLang === 'kn' ? 'kn-IN' : 'en-IN');
  };

  const handleLoginSuccess = async (updatedUser: UserProfileData) => {
    setUserProfile(updatedUser);
    localStorage.setItem('holamaatu_user', JSON.stringify(updatedUser));
    await syncFarmerProfile(updatedUser);
    setActiveTab('chat');
  };

  const handleUpdateProfile = async (updatedUser: UserProfileData) => {
    setUserProfile(updatedUser);
    localStorage.setItem('holamaatu_user', JSON.stringify(updatedUser));
    await syncFarmerProfile(updatedUser);
  };

  const handleLogout = () => {
    const loggedOut = { ...userProfile, isLoggedIn: false };
    setUserProfile(loggedOut);
    localStorage.setItem('holamaatu_user', JSON.stringify(loggedOut));
    setActiveTab('login');
  };

  return (
    <div className="app-root">
      {/* ── App Header ── */}
      <header className="app-header">
        <div className="brand-section" onClick={() => setActiveTab('chat')}>
          <div className="brand-logo">🌾</div>
          <div>
            <div className="brand-title">{t.appTitle}</div>
            <div className="brand-subtitle">
              <i className="ti ti-wifi-off" />
              {isReady ? t.offlineStatus : t.loading}
            </div>
          </div>
        </div>

        <div className="nav-controls">
          <div className="nav-tabs-desktop">
            <button
              className={`nav-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <i className="ti ti-message-dots" />
              {t.navChat}
            </button>
            <button
              className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="ti ti-user" />
              {t.navProfile}
            </button>
            {userProfile.isLoggedIn ? (
              <button
                className="nav-tab-btn"
                onClick={handleLogout}
                title={t.navLogout}
              >
                <i className="ti ti-logout" />
              </button>
            ) : (
              <button
                className={`nav-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                <i className="ti ti-login" />
                {t.navLogin}
              </button>
            )}
          </div>

          <button
            onClick={handleLangToggle}
            className="lang-toggle-btn"
            title="Switch Language / ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ"
          >
            {t.toggleLang}
          </button>
        </div>
      </header>

      {/* ── Context Strip ── */}
      {activeTab === 'chat' && <ContextStrip profile={appState} lang={uiLang} />}

      {/* ── App Body ── */}
      <div className="app-body">
        <div className="main-view-container">
          {/* LOGIN VIEW */}
          {activeTab === 'login' && (
            <LoginPage
              user={userProfile}
              lang={uiLang}
              onLogin={handleLoginSuccess}
              onContinueGuest={() => setActiveTab('chat')}
            />
          )}

          {/* PROFILE VIEW */}
          {activeTab === 'profile' && (
            <ProfilePage
              user={userProfile}
              lang={uiLang}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
              weatherFeatures={appState.weatherFeatures}
            />
          )}

          {/* CHAT VIEW */}
          {activeTab === 'chat' && (
            <div className="chat-container">
              <div className="messages-list">
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
                    <p style={{ fontSize: '15px', maxWidth: '360px', margin: '0 auto', lineHeight: '1.6' }}>
                      {t.noMessagesYet}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                      {['Neeru hakbeka?', 'Pest control', 'Dharwad weather', 'Fertilizer dose'].map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          style={{
                            background: 'var(--surface-sunk)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-pill)',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            fontSize: '13px'
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, index) => (
                  <React.Fragment key={m.id}>
                    {m.sender === 'user' ? (
                      <div
                        style={{
                          alignSelf: 'flex-end',
                          background: 'var(--surface-sunk)',
                          padding: '12px 16px',
                          borderRadius: '16px 16px 0 16px',
                          maxWidth: '85%',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                        }}
                        lang={uiLang}
                        data-lang={uiLang}
                      >
                        {m.text}
                      </div>
                    ) : (
                      <div style={{ alignSelf: 'flex-start', width: '100%', maxWidth: '100%' }}>
                        {index > 0 && messages[index - 1].sender === 'user' && messages[index - 1].isTranscript && (
                          <TranscriptConfirm
                            text={messages[index - 1].text}
                            onEdit={() => setInput(messages[index - 1].text)}
                            lang={uiLang}
                          />
                        )}

                        {m.text && (
                          <div
                            style={{
                              background: 'var(--surface-sunk)',
                              padding: '12px 16px',
                              borderRadius: '16px 16px 16px 0',
                              maxWidth: '88%',
                              marginBottom: m.advisory ? '12px' : '0',
                              lineHeight: '1.6'
                            }}
                            lang={uiLang}
                            data-lang={uiLang}
                          >
                            {parseMarkdown(m.text)}
                          </div>
                        )}

                        {m.advisory && (
                          <AdvisoryCard advisory={m.advisory} lang={uiLang} />
                        )}

                        {m.followUps && m.followUps.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {m.followUps.map((fu, i) => (
                              <button
                                key={i}
                                onClick={() => handleSend(fu)}
                                style={{
                                  background: 'var(--surface-sunk)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 'var(--radius-pill)',
                                  padding: '8px 16px',
                                  cursor: 'pointer',
                                  fontFamily: 'inherit',
                                  color: 'var(--text-secondary)',
                                  fontSize: '13px'
                                }}
                              >
                                {fu}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {isThinking && (
                  <div style={{ alignSelf: 'flex-start', padding: '14px 18px', background: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }}>
                    <span style={{ letterSpacing: '3px', color: 'var(--text-muted)', fontWeight: 'bold' }}>••• {t.thinking}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="chat-input-area">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.chatPlaceholder}
                    disabled={!isReady || isThinking}
                    style={{
                      flex: 1,
                      padding: '12px 18px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-sunk)',
                      fontSize: '15px',
                      outline: 'none',
                      color: 'var(--text-primary)'
                    }}
                  />
                  {speech.isSupported && (
                    <button
                      type="button"
                      onClick={handleMicToggle}
                      title={speech.isListening ? 'Stop mic' : 'Start voice input'}
                      aria-label="Voice Input"
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: speech.isListening ? 'var(--accent)' : 'var(--surface-sunk)',
                        color: speech.isListening ? 'white' : 'var(--text-primary)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}
                    >
                      {speech.isListening ? <i className="ti ti-player-stop" /> : <i className="ti ti-microphone" />}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!input.trim() || !isReady || isThinking}
                    aria-label="Send Message"
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: input.trim() ? 'var(--accent)' : 'var(--surface-sunk)',
                      color: input.trim() ? 'white' : 'var(--text-muted)',
                      border: 'none',
                      cursor: input.trim() ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}
                  >
                    <i className="ti ti-send" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Widget */}
        <aside className="desktop-sidebar">
          <div className="side-widget">
            <h4><i className="ti ti-user-check" /> Active Profile</h4>
            <p style={{ margin: '0 0 6px', fontWeight: 600 }}>{userProfile.name}</p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
              📍 {userProfile.location} • 🌽 {userProfile.stage}
            </p>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--surface-card)',
                cursor: 'pointer',
                color: 'var(--accent)'
              }}
            >
              Edit Profile
            </button>
          </div>

          <div className="side-widget">
            <h4><i className="ti ti-bulb" /> Smart Tips for Dharwad</h4>
            <ul>
              <li>Check soil moisture before applying nitrogen fertilizer.</li>
              <li>Scout regularly for Fall Armyworm during vegetative stage.</li>
              <li>Ensure proper field drainage if heavy rainfall is forecasted.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Mobile Navigation Bar ── */}
      <nav className="mobile-nav-bar">
        <button
          className={`mobile-nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <i className="ti ti-message-dots" />
          <span>{t.navChat}</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <i className="ti ti-user" />
          <span>{t.navProfile}</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab(userProfile.isLoggedIn ? 'profile' : 'login')}
        >
          <i className={userProfile.isLoggedIn ? 'ti ti-user-check' : 'ti ti-login'} />
          <span>{userProfile.isLoggedIn ? userProfile.name.split(' ')[0] : t.navLogin}</span>
        </button>
      </nav>
    </div>
  );
}
