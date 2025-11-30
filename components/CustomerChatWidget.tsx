import React, { useState, useRef, useEffect } from 'react';
import { processCustomerMessage, ParsedShipmentIntent } from '../services/geminiService';
import { ChatMessage, Shipment, ShipmentStatus, Carrier, SourceChannel } from '../types';

interface CustomerChatWidgetProps {
  onNewShipment?: (shipment: Shipment) => void;
}

interface EnhancedChatMessage extends ChatMessage {
    groundingSources?: { uri: string; title: string }[];
}

export const CustomerChatWidget: React.FC<CustomerChatWidgetProps> = ({ onNewShipment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      text: "Hi! 👋 I'm Sara, your AI Shipping Agent. I can help you issue a policy. Just tell me what you want to ship!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draftShipment, setDraftShipment] = useState<ParsedShipmentIntent['details'] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, draftShipment]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: EnhancedChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setDraftShipment(null); // Reset previous drafts while processing

    try {
      // Pass history to maintain context for slot filling
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await processCustomerMessage(history, userMsg.text);
      
      const botMsg: EnhancedChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.reply,
        timestamp: new Date(),
        groundingSources: response.groundingSources
      };
      setMessages(prev => [...prev, botMsg]);

      // Only show draft card if the AI has collected all info and set this flag
      if (response.isShipmentRequest && response.details) {
        setDraftShipment(response.details);
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "Sorry, I'm having connection issues.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDraft = () => {
    if (!draftShipment) return;

    // 1. Create the Real Shipment Object
    const newId = `SH-${Date.now().toString().slice(-4)}`;
    const newTracking = `OTO-${Math.floor(Math.random() * 100000)}`;
    
    const realShipment: Shipment = {
      id: newId,
      trackingNumber: newTracking,
      carrierTracking: `SMSA-NEW-${Math.floor(Math.random() * 1000)}`,
      carrier: Carrier.SMSA, // Defaulting for demo
      status: ShipmentStatus.CREATED,
      customerName: 'Guest User',
      destination: draftShipment.destination || 'Riyadh',
      cost: 20,
      price: 30,
      source: SourceChannel.WHATSAPP, // Simulate WhatsApp source
      date: new Date().toISOString().split('T')[0]
    };

    // 2. Call Parent to Update State (The "Integrated" part)
    if (onNewShipment) {
      onNewShipment(realShipment);
    }

    // 3. UI Confirmation
    const confirmMsg: EnhancedChatMessage = {
      id: Date.now().toString(),
      role: 'model',
      text: `✅ Done! Shipment created.\nTracking: ${newTracking}\n\nI've sent the label to your WhatsApp.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMsg]);
    setDraftShipment(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-[36rem] rounded-2xl shadow-2xl border border-gray-100 mb-4 flex flex-col overflow-hidden pointer-events-auto transition-all duration-300 transform origin-bottom-right">
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <div>
                  <span className="font-semibold text-sm block">Sara (AI Agent)</span>
                  <span className="text-[10px] text-gray-400">LogiSa Smart Support</span>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 shadow-sm border border-gray-200'
                    }`}>
                        {msg.text}
                    </div>
                    {/* Display Sources if available (Search Grounding) */}
                    {msg.groundingSources && msg.groundingSources.length > 0 && (
                        <div className="mt-1 text-[10px] text-gray-500 max-w-[85%] flex flex-wrap gap-1">
                            <span>Sources:</span>
                            {msg.groundingSources.map((source, idx) => (
                                <a 
                                    key={idx} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline truncate max-w-[150px]"
                                >
                                    {source.title}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            ))}
             {isLoading && <div className="text-xs text-gray-400 ml-2 animate-pulse">Thinking...</div>}

             {/* AI Generated Draft Card */}
             {draftShipment && (
               <div className="mx-4 bg-white border border-blue-100 rounded-xl shadow-md p-3 text-sm animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center mb-2 border-b border-gray-50 pb-2">
                   <span className="font-bold text-gray-800">📦 Draft Shipment</span>
                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Ready</span>
                 </div>
                 <div className="space-y-1 text-gray-600 mb-3">
                   <div className="flex justify-between"><span>Origin:</span> <span className="font-medium text-gray-800">{draftShipment.origin}</span></div>
                   <div className="flex justify-between"><span>To:</span> <span className="font-medium text-gray-800">{draftShipment.destination}</span></div>
                   <div className="flex justify-between"><span>Item:</span> <span className="font-medium text-gray-800">{draftShipment.item}</span></div>
                   <div className="flex justify-between"><span>Weight:</span> <span className="font-medium text-gray-800">{draftShipment.weight}</span></div>
                 </div>
                 <button 
                   onClick={confirmDraft}
                   className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                 >
                   Confirm & Issue Policy
                 </button>
               </div>
             )}
          </div>

          {/* Quick Actions (Rules-based Mode) */}
          <div className="px-3 pt-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => handleSend("Track my shipment")} className="whitespace-nowrap px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 border border-gray-200">
               🔍 Track
            </button>
            <button onClick={() => handleSend("I want to issue a new shipment policy")} className="whitespace-nowrap px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 border border-gray-200">
               📦 New Policy
            </button>
             <button onClick={() => handleSend("Pricing list")} className="whitespace-nowrap px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 border border-gray-200">
               💲 Pricing
            </button>
          </div>

          <div className="p-3 bg-white flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your request..."
                className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button 
                onClick={() => handleSend()}
                disabled={isLoading}
                className="bg-slate-900 text-white px-3 py-2 rounded-md text-sm hover:bg-slate-800"
            >
                ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 flex items-center justify-center w-14 h-14"
      >
        {isOpen ? (
            <span className="text-xl font-bold">✕</span>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
        )}
      </button>
    </div>
  );
};