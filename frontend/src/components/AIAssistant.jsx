import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../services/api';
import { Send, Bot, User } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your LifeOS Financial Co-Pilot. I have direct access to your spending records. Ask me things like 'What's my biggest expense this month?' or 'Can I afford a $200 dinner?'" }
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
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the neural engine. Please check your network." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border border-[var(--border)] ${msg.role === 'user' ? 'bg-[var(--accent)] text-[var(--bg)]' : 'bg-[var(--surface-2)] text-[var(--muted)]'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               <div 
                className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[var(--accent)] text-[var(--bg)] rounded-tr-none font-medium' 
                    : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center bg-[var(--surface-2)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-bounce bg-[var(--accent)]"></div>
                <div className="w-1.5 h-1.5 rounded-full animate-bounce bg-[var(--accent)]" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full animate-bounce bg-[var(--accent)]" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-[var(--border)] bg-[var(--surface)]">
        <form onSubmit={handleSend} className="relative flex items-center group">
          <input
            type="text"
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-6 py-3.5 pr-16 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-ring)] transition-all outline-none text-sm font-medium"
            placeholder="Search financial records or ask for advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2.5 bg-[var(--accent)] text-[var(--bg)] rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;