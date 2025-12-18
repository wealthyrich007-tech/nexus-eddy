import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Intelligence: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Bonjour. I am the DGM Neural Assistant. I can analyze border trends, provide visa regulation updates for the 26 provinces, or assist with complex immigration cases. How can I help?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      
      const response = await ai.models.generateContent({
        model: model,
        contents: input,
        config: {
          systemInstruction: "You are an advanced AI assistant for the Direction Générale de Migration (DGM) of the Democratic Republic of Congo. You assist immigration officers. Your tone is professional, authoritative, yet helpful. You know about DRC geography, the 26 provinces, border control protocols, and visa types (Flying, Ordinary, Diplomatic). Keep answers concise and operational."
        }
      });

      const text = response.text || "I apologize, but I could not retrieve that information at this time.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Connection to DGM Central Server interrupted. Please verify your API key and network connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-dgm-blue/50 flex items-center gap-3">
        <div className="p-2 bg-dgm-gold/20 rounded-lg">
          <Bot className="w-6 h-6 text-dgm-gold" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">DGM Intelligence</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-white/60">Gemini 2.5 Flash Connected</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-dgm-blue border border-dgm-gold/30 text-white rounded-tr-none' 
                : 'bg-white/10 border border-white/10 text-gray-100 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-50 text-xs uppercase tracking-wider font-bold">
                {msg.role === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                {msg.role === 'user' ? 'Officer' : 'DGM AI'}
              </div>
              <p className="leading-relaxed whitespace-pre-wrap text-sm">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-dgm-gold animate-spin" />
              <span className="text-sm text-white/50">Analyzing protocols...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 border-t border-white/10">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the database or ask for procedural guidance..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-dgm-gold/50 focus:ring-1 focus:ring-dgm-gold/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-dgm-gold hover:bg-dgm-goldLight text-dgm-blue font-bold rounded-xl px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
