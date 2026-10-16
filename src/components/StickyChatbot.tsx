import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Eye,
  Check,
  Leaf,
  ChevronDown,
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, MASCOT_STICKY_IMAGE } from '../data/products';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

interface StickyChatbotProps {
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, variant?: string) => void;
  onOpenCart: () => void;
  onOpenCheckout: () => void;
}

const NUDGE_MESSAGES = [
  {
    text: "👋 Hey there! I'm Sticky! Looking to cut down on daily plastic?",
    prompt: "Hi Sticky! Which bamboo product should I start with?",
  },
  {
    text: "🌿 Did you know our bamboo straws save ~540 plastic straws every year?",
    prompt: "Tell me about the Everyday Bamboo Straw Set and its CO₂ savings.",
  },
  {
    text: "🍳 Looking for non-toxic cooking? Check out our 5-piece bamboo utensil set!",
    prompt: "Are your bamboo kitchen utensils heat-resistant and safe for ceramic pans?",
  },
  {
    text: "👕 Curious how bamboo fiber feels softer than cotton? Ask me!",
    prompt: "How does bamboo-fiber clothing compare to cotton in comfort and wash care?",
  },
];

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'model',
  content:
    "Hi there! I'm Sticky, your bamboo guide at STICKS. 🌱\n\nI can help you explore our 6 zero-plastic essentials, compare materials, calculate your CO₂ savings, or pick the perfect size. How can I help your everyday routine today?\n\n[ACTION:PRODUCT:bamboo-straw-set]",
  timestamp: Date.now(),
};

export const StickyChatbot: React.FC<StickyChatbotProps> = ({
  onQuickView,
  onAddToCart,
  onOpenCart,
  onOpenCheckout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('sticks_sticky_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Fallback
    }
    return [INITIAL_GREETING];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeNudgeIndex, setActiveNudgeIndex] = useState(0);
  const [showNudge, setShowNudge] = useState(true);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [characterState, setCharacterState] = useState<'idle' | 'waving' | 'thinking' | 'happy'>('idle');
  const [itemAddedFeedback, setItemAddedFeedback] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'checking' | 'error'>('checking');
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check Gemini API Health
  const checkHealth = async () => {
    try {
      setApiStatus('checking');
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        if (data.apiConnected) {
          setApiStatus('connected');
          return;
        }
      }
      setApiStatus('error');
    } catch (e) {
      setApiStatus('error');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sticks_sticky_chat_history', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
      checkHealth();
    }
  }, [messages, isOpen, isLoading]);

  // Rotate friendly nudges periodically if closed
  useEffect(() => {
    if (isOpen || nudgeDismissed) return;

    const interval = setInterval(() => {
      setActiveNudgeIndex((prev) => (prev + 1) % NUDGE_MESSAGES.length);
      setShowNudge(true);
      // Trigger waving animation
      setCharacterState('waving');
      setTimeout(() => setCharacterState('idle'), 2500);
    }, 14000);

    return () => clearInterval(interval);
  }, [isOpen, nudgeDismissed]);

  const [thinkingStep, setThinkingStep] = useState(0);

  // Dynamic thinking step animation while waiting for response
  useEffect(() => {
    if (!isLoading) {
      setThinkingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setThinkingStep((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // Filter out any previous error messages from history so conversation flows cleanly
    const cleanPrevious = messages.filter((m) => !m.id.startsWith('bot-err-'));
    const newHistory = [...cleanPrevious, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    setCharacterState('thinking');
    setLastFailedText(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 24000);

    try {
      // Format messages for the server-side Gemini endpoint
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to reach Sticky AI`);
      }

      const data = await res.json();
      setApiStatus('connected');

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || "I'm right here with you! What bamboo essential are you curious about?",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setCharacterState('happy');
      setTimeout(() => setCharacterState('idle'), 3000);
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('Chat error:', error);
      setApiStatus('error');
      setLastFailedText(text);

      const isTimeout = error.name === 'AbortError';
      const errorText = isTimeout
        ? 'The request took a little longer than expected. Please try again or tap a suggestion chip below!'
        : error?.message?.includes('GEMINI_API_KEY')
        ? 'Gemini API key is not configured on the server. Please check the Secrets panel in AI Studio.'
        : `Connection hiccup: ${error?.message || 'Unable to connect to Gemini API.'}`;

      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        content: `Oops! ${errorText}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setCharacterState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset conversation with Sticky?')) {
      const reset = [INITIAL_GREETING];
      setMessages(reset);
      localStorage.removeItem('sticks_sticky_chat_history');
    }
  };

  const handleNudgeClick = () => {
    const nudge = NUDGE_MESSAGES[activeNudgeIndex];
    setShowNudge(false);
    setIsOpen(true);
    handleSendMessage(nudge.prompt);
  };

  // Helper to extract action tags from text
  const parseActionTags = (content: string) => {
    const productMatch = content.match(/\[ACTION:PRODUCT:([a-z0-9-]+)\]/);
    const hasViewBag = content.includes('[ACTION:VIEW_BAG]');
    const hasCheckout = content.includes('[ACTION:CHECKOUT]');
    
    // Clean content without the tag brackets for display
    const cleanText = content
      .replace(/\[ACTION:PRODUCT:[a-z0-9-]+\]/g, '')
      .replace(/\[ACTION:VIEW_BAG\]/g, '')
      .replace(/\[ACTION:CHECKOUT\]/g, '')
      .replace(/\[ACTION:CATEGORY:[a-zA-Z\s]+\]/g, '')
      .trim();

    const productId = productMatch ? productMatch[1] : null;
    const matchedProduct = productId ? PRODUCTS.find((p) => p.id === productId) : null;

    return { cleanText, matchedProduct, hasViewBag, hasCheckout };
  };

  const handleCardQuickAdd = (product: Product) => {
    onAddToCart(product);
    setItemAddedFeedback(product.id);
    setCharacterState('happy');
    setTimeout(() => {
      setItemAddedFeedback(null);
      setCharacterState('idle');
    }, 2000);
  };

  return (
    <>
      {/* ================= MASCOT FLOATING TRIGGER ================= */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
        
        {/* Nudge Speech Bubble */}
        {!isOpen && showNudge && !nudgeDismissed && (
          <div className="pointer-events-auto mb-3 max-w-xs bg-white text-[#242320] p-3.5 rounded-2xl rounded-br-xs shadow-xl border border-[#EAE6DD] animate-in fade-in slide-in-from-bottom-2 duration-300 relative group">
            <button
              onClick={() => {
                setShowNudge(false);
                setNudgeDismissed(true);
              }}
              aria-label="Dismiss nudge"
              className="absolute -top-2 -left-2 w-5 h-5 bg-[#242320] text-white rounded-full flex items-center justify-center text-[10px] hover:bg-[#444] transition-colors shadow-xs"
            >
              ✕
            </button>
            <p className="text-xs font-medium leading-relaxed">
              {NUDGE_MESSAGES[activeNudgeIndex].text}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={handleNudgeClick}
                className="text-[11px] font-semibold text-[#2E472F] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ask Sticky</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-[10px] text-[#8C887E]">AI Guide</span>
            </div>
          </div>
        )}

        {/* Live Character Mascot Button */}
        <div className="pointer-events-auto relative">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setShowNudge(false);
            }}
            aria-label={isOpen ? 'Close Sticky Chat' : 'Open Sticky Chat'}
            className="group relative flex items-center justify-center focus:outline-none cursor-pointer"
          >
            {/* Ambient Aura Ring */}
            <div
              className={`absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#C2A676]/40 via-[#526B54]/40 to-[#C2A676]/40 blur-xs transition-opacity duration-500 ${
                isOpen ? 'opacity-80 scale-105' : 'opacity-40 group-hover:opacity-90'
              }`}
            />

            {/* Mascot Avatar Circular Container */}
            <div
              className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-[#FAF7F0] border-2 border-[#D8D2C4] shadow-xl transition-all duration-300 transform ${
                characterState === 'thinking'
                  ? 'animate-bounce'
                  : characterState === 'waving'
                  ? 'rotate-6 scale-105'
                  : 'group-hover:scale-105 group-hover:-translate-y-0.5'
              }`}
            >
              <img
                src={MASCOT_STICKY_IMAGE}
                alt="Sticky, the STICKS bamboo mascot"
                className="w-full h-full object-cover select-none"
              />

              {/* Live Character Eye Blink / Sparkle Overlay */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                aria-hidden="true"
              >
                {characterState === 'happy' && (
                  <Sparkles className="w-6 h-6 text-[#E9C46A] animate-spin" />
                )}
              </div>
            </div>

            {/* Live Green Status Dot Badge */}
            <span
              className="absolute bottom-0 right-0 w-4 h-4 bg-[#3D523C] border-2 border-white rounded-full shadow-xs flex items-center justify-center"
              title="Sticky is Online & Ready"
            >
              <span className="w-1.5 h-1.5 bg-[#8FA587] rounded-full animate-ping" />
            </span>

            {/* Name micro-tag */}
            <span className="absolute -top-2 right-1/2 translate-x-1/2 bg-[#242320] text-[#FBF9F5] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
              Sticky
            </span>
          </button>
        </div>

      </div>

      {/* ================= CHAT WINDOW MODAL / DRAWER ================= */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[550px] bg-[#FBF9F5] rounded-2xl shadow-2xl border border-[#EAE6DD] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#242320] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#FAF7F0] border border-[#555] shrink-0">
                <img
                  src={MASCOT_STICKY_IMAGE}
                  alt="Sticky"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-wide">Sticky</h3>
                  <span className="text-[10px] bg-[#3D523C] text-[#C5DEC3] px-1.5 py-0.2 rounded font-mono">
                    AI Guide
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      apiStatus === 'connected'
                        ? 'bg-emerald-400'
                        : apiStatus === 'checking'
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-rose-400'
                    }`}
                  />
                  <button
                    onClick={checkHealth}
                    className="text-[10px] text-[#C5DEC3] hover:text-white transition-colors cursor-pointer text-left"
                    title="Click to check connection status"
                  >
                    {apiStatus === 'connected'
                      ? 'Gemini 3.8 Flash Online'
                      : apiStatus === 'checking'
                      ? 'Connecting to Gemini...'
                      : 'Offline / Reconnecting (Click)'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#A8A49A]">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#FBF9F5]">
            
            {/* Top Memory Notice */}
            <div className="text-center py-1">
              <span className="text-[10px] text-[#8C887E] bg-[#EAE5D9]/70 px-2.5 py-1 rounded-full">
                🧠 Context & memory active for your session
              </span>
            </div>

            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const { cleanText, matchedProduct, hasViewBag, hasCheckout } = parseActionTags(msg.content);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-[#242320] text-[#FBF9F5] rounded-br-xs'
                        : 'bg-white text-[#242320] border border-[#EAE6DD] rounded-bl-xs'
                    }`}
                  >
                    {/* Message Text with newlines */}
                    <div className="whitespace-pre-line">{cleanText}</div>

                    {/* Interactive Embedded Product Card */}
                    {matchedProduct && !isUser && (
                      <div className="mt-3 pt-3 border-t border-[#EAE6DD] bg-[#FAF8F2] -mx-2 px-3 py-2.5 rounded-xl border">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={matchedProduct.image}
                            alt={matchedProduct.name}
                            className="w-12 h-12 object-cover rounded bg-[#EAE5D9] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-[#242320] truncate">
                              {matchedProduct.name}
                            </h4>
                            <p className="text-[10px] text-[#73716A]">
                              ₹{matchedProduct.price.toLocaleString('en-IN')} · {matchedProduct.category}
                            </p>
                          </div>
                        </div>

                        {/* Direct Action Buttons */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onQuickView(matchedProduct)}
                            className="flex-1 py-1.5 px-2 bg-white text-[#242320] text-[11px] font-medium rounded-md border border-[#D5D0C5] hover:bg-[#F2EFE9] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCardQuickAdd(matchedProduct)}
                            className="flex-1 py-1.5 px-2 bg-[#242320] text-white text-[11px] font-semibold rounded-md hover:bg-[#3D523C] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            {itemAddedFeedback === matchedProduct.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#A3D9A5]" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3 h-3" />
                                <span>Add to Bag</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Quick navigation actions if triggered */}
                    {hasViewBag && !isUser && (
                      <button
                        type="button"
                        onClick={onOpenCart}
                        className="mt-2.5 w-full py-1.5 px-3 bg-[#3D523C] text-white text-[11px] font-semibold rounded-md hover:bg-[#2E472F] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Open Shopping Bag</span>
                      </button>
                    )}

                    {hasCheckout && !isUser && (
                      <button
                        type="button"
                        onClick={onOpenCheckout}
                        className="mt-2.5 w-full py-1.5 px-3 bg-[#242320] text-white text-[11px] font-semibold rounded-md hover:bg-[#383733] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3" />
                        <span>Proceed to Checkout</span>
                      </button>
                    )}
                    {/* Retry button on error */}
                    {msg.id.startsWith('bot-err-') && lastFailedText && (
                      <button
                        type="button"
                        onClick={() => handleSendMessage(lastFailedText)}
                        className="mt-2.5 py-1.5 px-3 bg-[#3D523C] text-white text-[11px] font-semibold rounded-md hover:bg-[#2E472F] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry Sending Message</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[9px] text-[#A8A49A] mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })}

            {/* Thinking / Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#73716A] bg-white p-3 rounded-2xl rounded-bl-xs border border-[#EAE6DD] w-fit shadow-2xs">
                <span>
                  {thinkingStep === 0
                    ? 'Sticky is browsing the bamboo collection...'
                    : thinkingStep === 1
                    ? 'Calculating materials & CO₂ savings...'
                    : 'Sticky is crafting your personalized answer...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Suggestion Chips */}
          <div className="px-3 py-2 bg-[#F2EFE9] border-t border-[#EAE6DD] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleSendMessage('Which product should I start with?')}
              className="px-2.5 py-1 bg-white hover:bg-[#FAF8F2] text-[#4A4843] rounded-full text-[11px] border border-[#DDD8CC] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              🌱 Best starter item?
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('How much CO₂ do bamboo straws save?')}
              className="px-2.5 py-1 bg-white hover:bg-[#FAF8F2] text-[#4A4843] rounded-full text-[11px] border border-[#DDD8CC] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              🌍 Straw CO₂ savings
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Are bamboo kitchen utensils safe for hot cooking?')}
              className="px-2.5 py-1 bg-white hover:bg-[#FAF8F2] text-[#4A4843] rounded-full text-[11px] border border-[#DDD8CC] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              🍳 Utensil safety
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('Tell me about the bamboo tee sizing and care')}
              className="px-2.5 py-1 bg-white hover:bg-[#FAF8F2] text-[#4A4843] rounded-full text-[11px] border border-[#DDD8CC] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              👕 Apparel sizing
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#EAE6DD] flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask Sticky about bamboo products..."
              className="flex-1 px-3 py-2 bg-[#FBF9F5] rounded-md text-xs text-[#242320] placeholder-[#8C887E] border border-[#DDD8CC] focus:outline-none focus:border-[#242320]"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message to Sticky"
              className="p-2 bg-[#242320] text-white rounded-md hover:bg-[#3D523C] disabled:opacity-40 disabled:hover:bg-[#242320] transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
