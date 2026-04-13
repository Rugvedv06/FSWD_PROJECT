import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../services/api';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your LifeOS Financial Intelligence. Ask me anything about your spending or say 'Can I afford a $100 watch?'" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAI(input);
      const aiMessage = { role: 'assistant', content: response.data.data };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "System connection error. Please verify your AI uplink." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-6 py-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
            } shadow-lg transition-all animate-in slide-in-from-bottom-2`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none animate-pulse">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-6 bg-slate-900/80 border-t border-slate-800 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-100 placeholder-slate-500 shadow-inner"
            placeholder="Ask your AI assistant..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all active:scale-95 shadow-lg disabled:opacity-50"
          >
            {loading ? '...' : <span className="text-xl">🚀</span>}
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-3 text-center uppercase tracking-widest font-bold">
          Powered by LifeOS Financial Neural Engine v1.0
        </p>
      </form>
    </div>
  );
};

export default AIAssistant;