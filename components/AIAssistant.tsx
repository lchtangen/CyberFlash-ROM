
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Mic, X, Minimize2, Maximize2, Cpu } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from '../types';

export const AIAssistant: React.FC = () => {
  const { messages, sendMessage, isLoading, isOpen, setIsOpen } = useChat();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 left-8 z-50 p-4 rounded-full bg-deep border border-neon-cyan/50 text-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:bg-neon-cyan hover:text-deep transition-all duration-300 group"
      >
        <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-lime rounded-full animate-pulse shadow-[0_0_10px_#00FF41]" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-28 left-8 z-50 w-[400px] h-[600px] flex flex-col transition-all duration-500 origin-bottom-left animate-[scaleNeon_0.3s_ease-out]">
      {/* Glass Container */}
      <div className="flex-1 flex flex-col glass-floating border-2 border-neon-cyan/30 overflow-hidden relative shadow-[0_0_60px_rgba(0,255,255,0.15)] bg-deep/80 backdrop-blur-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between backdrop-blur-xl">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/50">
                <Cpu size={18} className="text-neon-cyan" />
             </div>
             <div>
               <h3 className="font-black text-white text-sm tracking-wide">GEMINI <span className="text-neon-cyan">PRO</span></h3>
               <p className="text-[10px] text-text-comment font-mono uppercase">Neural Uplink Active</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-text-comment hover:text-white transition-colors">
               <Minimize2 size={16} />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-neon-red/20 rounded-lg text-text-comment hover:text-neon-red transition-colors">
               <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed relative group
                ${msg.role === 'user' 
                  ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-white rounded-tr-sm' 
                  : 'bg-white/5 border border-white/10 text-text-primary rounded-tl-sm'}
              `}>
                <div className="font-mono">{msg.text}</div>
                <div className={`text-[9px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex gap-2 items-center">
                 <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                 <div className="w-2 h-2 bg-neon-magenta rounded-full animate-bounce delay-100" />
                 <div className="w-2 h-2 bg-neon-lime rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/10">
          <div className="flex gap-2 relative">
             <input
               ref={inputRef}
               type="text"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyDown={handleKeyPress}
               placeholder="Ask about flashing protocols..."
               className="flex-1 bg-deep/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all"
             />
             
             <button 
               onClick={startListening}
               className={`absolute right-14 top-1.5 p-1.5 rounded-lg transition-colors ${isListening ? 'text-neon-red animate-pulse' : 'text-text-comment hover:text-white'}`}
             >
               <Mic size={18} />
             </button>

             <button 
               onClick={handleSend}
               disabled={!inputText.trim() && !isLoading}
               className="p-3 bg-neon-cyan text-deep rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
             >
               <Send size={18} />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};
