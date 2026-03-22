/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { chatWithDatabase } from '../services/aiService';
import { Complaint } from '../types';

interface ChatbotProps {
  complaints: Complaint[];
}

export default function Chatbot({ complaints }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot', text: string }[]>([
    { sender: 'bot', text: 'Hello! I am your AI assistant. How can I help you with the complaint data today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    const botResponse = await chatWithDatabase(userMsg, complaints);
    setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 text-zinc-950 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-zinc-900 text-zinc-100 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-800 pointer-events-none">
          AI Assistant
        </span>
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col transition-all z-50 overflow-hidden",
      isMinimized ? "w-72 h-14" : "w-96 h-[500px]"
    )}>
      <div className="p-4 bg-zinc-800 flex items-center justify-between border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm text-zinc-100">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn(
                "flex gap-3 max-w-[85%]",
                msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  msg.sender === 'user' ? "bg-zinc-800 text-zinc-400" : "bg-emerald-500 text-zinc-950"
                )}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "p-3 rounded-xl text-xs leading-relaxed",
                  msg.sender === 'user' ? "bg-zinc-800 text-zinc-300" : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-500 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about complaints..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-emerald-500 text-zinc-950 rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:hover:bg-emerald-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
