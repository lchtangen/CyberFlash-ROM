
import { useState, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'init',
    role: 'model',
    text: 'System online. I am your crDroid Assistant. How can I help you with the flashing process?',
    timestamp: Date.now()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatSession = useRef<Chat | null>(null);

  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (!chatSession.current) {
        // NOTE: In a production environment, process.env.API_KEY would be injected by the builder.
        // For this generated preview, if the key is missing, we'll gracefully handle it.
        const apiKey = process.env.API_KEY;
        
        if (apiKey) {
            const ai = new GoogleGenAI({ apiKey });
            chatSession.current = ai.chats.create({
              model: 'gemini-3-pro-preview',
              config: { 
                systemInstruction: "You are an expert assistant for flashing custom ROMs on OnePlus 7 Pro. You are concise, technical, and helpful. Use a cyberpunk persona." 
              }
            });
        }
      }

      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Optimistic update for bot message container
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', timestamp: Date.now() }]);

      if (chatSession.current) {
          const result = await chatSession.current.sendMessageStream({ message: text });
          
          for await (const chunk of result) {
            const c = chunk as GenerateContentResponse;
            if (c.text) {
                fullText += c.text;
                setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
            }
          }
      } else {
        // Fallback simulation if no API key is present (Development Mode)
        setTimeout(() => {
           const simResponse = "I am running in simulation mode because no API Key was detected. In production, I would use Gemini 3 Pro to answer: " + text;
           setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: simResponse } : m));
        }, 1000);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = "Connection to Neural Network failed. Please check your API configuration.";
      setMessages(prev => prev.map(m => m.role === 'model' && m.text === '' ? { ...m, text: errorMsg } : m));
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, isOpen, setIsOpen };
};
