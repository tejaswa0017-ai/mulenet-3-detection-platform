import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { Bot, X, Send, User, Sparkles, ChevronDown, Mic, MicOff, AlertCircle, Key } from 'lucide-react';
import { Theme } from '../utils/theme';

export const AiraAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model' | 'system', text: string }[]>([
    { role: 'model', text: 'Hi! I am Aira, your AI investigation assistant. How can I help you analyze the current threat landscape?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [apiKey, setApiKey] = useState<string>(process.env.GEMINI_API_KEY || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isKeyValid = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if key is valid on mount
  useEffect(() => {
    if (!isKeyValid) {
      setShowKeyInput(true);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, { role: 'system', text: '⚠️ Speech recognition is not supported in this browser. Please use Chrome or Edge.' }]);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          setMessages(prev => [...prev, { role: 'system', text: '🎤 Microphone access denied. Please allow microphone permissions in your browser settings.' }]);
        } else if (event.error === 'no-speech') {
          // Silent fail for no-speech — just stop
        } else {
          setMessages(prev => [...prev, { role: 'system', text: `⚠️ Speech error: ${event.error}. Try again.` }]);
        }
        setIsListening(false);
        recognitionRef.current = null;
      };
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setMessages(prev => [...prev, { role: 'system', text: '⚠️ Could not start voice input. Please check microphone permissions.' }]);
      setIsListening(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isKeyValid) {
      setShowKeyInput(true);
      setMessages(prev => [...prev, { role: 'system', text: '🔑 Please enter your Gemini API key first. Get one free at ai.google.dev' }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: userMessage,
        config: {
          systemInstruction: `You are Aira, an expert AI cybersecurity analyst and investigation assistant for the MuleNet 3.0 platform — an enterprise-grade cyber-financial mule detection system. You help users analyze:
- Financial crime patterns (layering, structuring, smurfing, fan-out/fan-in)
- Mule network topologies and attack chains
- Entity resolution and identity matching
- Risk score decomposition (TGN anomaly, graph proximity, cyber IOC)
- Federated learning and privacy-preserving computation
- Regulatory compliance (GDPR, DPDP, GLBA, UK MLR)

Keep your answers concise, professional, and actionable. Use bullet points and bold text for clarity. When discussing risk scores, reference the R = α·A + β·B + γ·C formula.`,
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Sorry, I could not process that request.' }]);
    } catch (error: any) {
      console.error('Error calling Gemini:', error);
      const errorMsg = error?.message || '';
      if (errorMsg.includes('API_KEY') || errorMsg.includes('401') || errorMsg.includes('403')) {
        setMessages(prev => [...prev, { role: 'system', text: '🔑 Invalid API key. Please check your Gemini API key and try again.' }]);
        setShowKeyInput(true);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again in a moment.' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="mb-4 flex h-[520px] w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-bg-panel shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ai/20 text-ai">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Aira Assistant</h3>
                  <p className="text-[0.62rem] text-text-muted">
                    {isKeyValid ? (
                      <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success inline-block"></span> Gemini Connected</span>
                    ) : (
                      <span className="flex items-center gap-1 text-risk-medium"><Key size={9} /> API Key Required</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-bg-card-hover hover:text-text-primary"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* API Key Input Banner */}
            <AnimatePresence>
              {showKeyInput && !isKeyValid && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-border"
                >
                  <div className="bg-risk-medium/5 p-3">
                    <div className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold text-risk-medium">
                      <Key size={12} /> Enter Gemini API Key
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKey === 'your_gemini_api_key_here' ? '' : apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy... (get at ai.google.dev)"
                        className="flex-1 rounded-lg border border-border-subtle bg-bg-main px-3 py-1.5 text-[0.72rem] text-text-primary placeholder-text-muted focus:border-primary focus:outline-none"
                      />
                      <button
                        onClick={() => { if (apiKey.length > 10) setShowKeyInput(false); }}
                        className="rounded-lg bg-primary px-3 py-1.5 text-[0.72rem] font-bold text-white transition-colors hover:bg-primary-hover"
                      >
                        Save
                      </button>
                    </div>
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 block text-[0.6rem] text-primary hover:underline"
                    >
                      → Get a free API key at Google AI Studio
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'system' ? (
                    <div className="w-full rounded-xl border border-risk-medium/20 bg-risk-medium/5 px-3.5 py-2.5 text-[0.75rem] text-risk-medium">
                      {msg.text}
                    </div>
                  ) : (
                    <>
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-ai/20 text-ai'}`}>
                        {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[0.8rem] leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-bg-card border border-border text-text-secondary rounded-tl-sm'}`}>
                        {msg.text}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ai/20 text-ai">
                    <Bot size={13} />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-bg-card px-4 py-3">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-bg-card p-3">
              <div className="relative flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${isListening
                      ? 'border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                      : 'border-border-subtle bg-bg-main text-text-muted hover:text-primary hover:border-primary/30'
                    }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <Mic size={18} className="animate-pulse" /> : <Mic size={18} />}
                </button>
                <div className="relative flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "🎤 Listening..." : "Ask Aira about the investigation..."}
                    className="max-h-32 min-h-[44px] w-full resize-none rounded-xl border border-border-subtle bg-bg-main py-2.5 pl-4 pr-12 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 disabled:opacity-40 disabled:hover:bg-primary disabled:hover:shadow-none"
                  >
                    <Send size={14} className="ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ai text-white shadow-lg shadow-ai/30 transition-all hover:shadow-xl hover:shadow-ai/40"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </motion.button>
    </div>
  );
};
