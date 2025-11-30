
import React, { useState, useRef, useEffect } from 'react';
import { generateAdminResponse } from '../services/geminiService';
import { MOCK_SHIPMENTS } from '../constants';
import { ChatMessage, AIProvider } from '../types';

export const AdminAIChat: React.FC = () => {
  const [activeProvider, setActiveProvider] = useState<AIProvider>('gemini');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your LogiSa Business Advisor. I've analyzed your current shipments. Ask me about revenue, carrier performance, or specific shipment details.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Pass the selected provider to the service to simulate routing
      const responseText = await generateAdminResponse(history, userMsg.text, MOCK_SHIPMENTS, activeProvider);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderColor = () => {
      switch(activeProvider) {
          case 'openai': return 'bg-emerald-600 text-white';
          case 'deepseek': return 'bg-blue-700 text-white';
          case 'anthropic': return 'bg-orange-700 text-white';
          case 'vertex': return 'bg-blue-500 text-white';
          default: return 'bg-blue-100 text-blue-700';
      }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">AI Business Intelligence</h2>
          <p className="text-sm text-gray-500">Ask strategic questions about your logistics</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Active Brain:</span>
            <select 
                value={activeProvider}
                onChange={(e) => setActiveProvider(e.target.value as AIProvider)}
                className={`px-3 py-1 rounded-full text-xs font-semibold focus:outline-none cursor-pointer ${getProviderColor()}`}
            >
                <option value="gemini" className="text-black bg-white">Gemini 3.0 Pro</option>
                <option value="vertex" className="text-black bg-white">Google Vertex AI</option>
                <option value="openai" className="text-black bg-white">OpenAI GPT-4</option>
                <option value="deepseek" className="text-black bg-white">DeepSeek R1</option>
                <option value="anthropic" className="text-black bg-white">Claude 3.5 Sonnet</option>
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
              <div className={`text-[10px] mt-2 opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="E.g., Which carrier has the best margin today?"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};