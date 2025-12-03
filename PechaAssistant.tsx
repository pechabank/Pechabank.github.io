import React, { useState, useRef, useEffect } from 'react';
import { generateFinancialAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import GlassCard from './TornCard';

const PechaAssistant: React.FC<{ contextData: string }> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Привет! Я ИИ-помощник ПечаБанка. Чем могу помочь?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await generateFinancialAdvice(userMsg.text, contextData);
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Ошибка соединения.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button (Floating) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-violet-600 shadow-[0_0_30px_rgba(124,58,237,0.6)] flex items-center justify-center text-white transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) hover:scale-110 hover:bg-violet-500 active:scale-90 border border-white/20 ${isOpen ? 'rotate-45 bg-red-500 shadow-red-500/50' : 'animate-float'}`}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </button>

      {/* Chat Window */}
      <div className={`fixed z-[55] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-20 scale-95 pointer-events-none'}
        bottom-24 right-4 left-4 md:left-auto md:right-6 md:w-96 h-[60vh] md:h-[500px]
      `}>
        <GlassCard noAnimation className="h-full flex flex-col shadow-2xl bg-black/80 backdrop-blur-xl border border-violet-500/30">
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
            <h3 className="font-display font-bold text-xl tracking-wide text-white">Pecha AI</h3>
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up opacity-0`} style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <div className={`max-w-[85%] px-4 py-3 text-sm rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${
                  msg.role === 'user' 
                    ? 'bg-violet-600/80 text-white rounded-tr-none border border-violet-500/30 shadow-[0_4px_15px_rgba(124,58,237,0.3)]' 
                    : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/10'
                }`}>
                   {msg.text}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start animate-pulse">
                 <div className="text-xs text-white/50 pl-2 flex gap-1 items-center">
                    <span className="w-1 h-1 rounded-full bg-white/50 animate-bounce delay-75"></span>
                    <span className="w-1 h-1 rounded-full bg-white/50 animate-bounce delay-150"></span>
                    <span className="w-1 h-1 rounded-full bg-white/50 animate-bounce delay-300"></span>
                 </div>
               </div>
            )}
          </div>

          <div className="relative mt-auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Спроси о финансах..."
              className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 pr-12 font-sans text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all duration-300"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="absolute right-1 top-1 bottom-1 aspect-square rounded-full bg-violet-600 flex items-center justify-center hover:bg-violet-500 transition-all hover:scale-105 active:scale-90 disabled:opacity-50 disabled:hover:scale-100"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </GlassCard>
      </div>
    </>
  );
};

export default PechaAssistant;