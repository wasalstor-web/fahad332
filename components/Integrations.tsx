
import React, { useState } from 'react';
import { Language } from '../types';

interface IntegrationsProps {
  lang: Language;
}

interface ConfigField {
  label: string;
  value: string;
  type: 'text' | 'password';
}

interface IntegrationItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected';
  fields: ConfigField[];
  category: 'channel' | 'carrier' | 'payment' | 'ai_automation';
}

export const Integrations: React.FC<IntegrationsProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'config' | 'docs'>('config');

  // --- Platform API State ---
  const [platformApiKey, setPlatformApiKey] = useState('sk_live_51M...92x');
  const [webhookUrl, setWebhookUrl] = useState('https://mystore.com/api/webhook');
  
  // --- Integrations State ---
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    // --- CHANNELS (INPUTS) ---
    { 
      id: 'whatsapp_main', 
      name: 'WhatsApp Business (Main)', 
      icon: <span className="text-2xl">💬</span>, 
      status: 'connected',
      category: 'channel',
      fields: [
        { label: 'API Key', value: 'wh_123456789', type: 'password' },
        { label: 'Phone Number ID', value: '1029384756', type: 'text' }
      ]
    },
    {
      id: 'salla',
      name: 'Salla Store',
      icon: <div className="font-bold text-xs bg-green-400 text-white p-1 rounded-md">Salla</div>,
      status: 'disconnected',
      category: 'channel',
      fields: [
        { label: 'Merchant ID', value: '', type: 'text' },
        { label: 'Access Token', value: '', type: 'password' },
        { label: 'Webhook Secret', value: '', type: 'password' }
      ]
    },
    {
      id: 'odoo',
      name: 'Odoo ERP',
      icon: <div className="font-bold text-xs bg-purple-800 text-white p-1 rounded-md">Odoo</div>,
      status: 'disconnected',
      category: 'channel',
      fields: [
        { label: 'Instance URL', value: 'https://mycompany.odoo.com', type: 'text' },
        { label: 'Database Name', value: '', type: 'text' },
        { label: 'API Key / Password', value: '', type: 'password' }
      ]
    },
    {
      id: 'wordpress',
      name: 'WordPress (WooCommerce)',
      icon: <div className="font-bold text-xs bg-blue-900 text-white p-1 rounded-md">Woo</div>,
      status: 'disconnected',
      category: 'channel',
      fields: [
        { label: 'Store URL', value: 'https://myshop.com', type: 'text' },
        { label: 'Consumer Key', value: '', type: 'password' },
        { label: 'Consumer Secret', value: '', type: 'password' }
      ]
    },
    {
      id: 'shopify',
      name: 'Shopify',
      icon: <div className="font-bold text-xs bg-green-600 text-white p-1 rounded-md">Shop</div>,
      status: 'disconnected',
      category: 'channel',
      fields: [
        { label: 'Store Domain', value: 'my-store.myshopify.com', type: 'text' },
        { label: 'Admin API Token', value: '', type: 'password' }
      ]
    },

    // --- AI & AUTOMATION ---
    {
      id: 'google_vertex',
      name: 'Google Vertex AI',
      icon: <div className="font-bold text-xs bg-blue-500 text-white p-1 rounded-md">Vertex</div>,
      status: 'connected',
      category: 'ai_automation',
      fields: [
        { label: 'Project ID', value: 'logisa-ai-101', type: 'text' },
        { label: 'Location', value: 'us-central1', type: 'text' },
        { label: 'Service Account Key', value: '******', type: 'password' }
      ]
    },
    {
      id: 'google_studio',
      name: 'Google AI Studio',
      icon: <div className="font-bold text-xs bg-blue-400 text-white p-1 rounded-md">Studio</div>,
      status: 'connected',
      category: 'ai_automation',
      fields: [
        { label: 'API Key', value: 'AIzaSy...', type: 'password' }
      ]
    },
    {
      id: 'openai',
      name: 'OpenAI (GPT-4)',
      icon: <div className="font-bold text-xs bg-emerald-700 text-white p-1 rounded-md">OpenAI</div>,
      status: 'connected',
      category: 'ai_automation',
      fields: [
        { label: 'API Key', value: 'sk-proj-...', type: 'password' },
        { label: 'Organization ID', value: '', type: 'text' }
      ]
    },
    {
      id: 'anthropic',
      name: 'Anthropic (Claude)',
      icon: <div className="font-bold text-xs bg-orange-700 text-white p-1 rounded-md">Claude</div>,
      status: 'disconnected',
      category: 'ai_automation',
      fields: [
        { label: 'API Key', value: '', type: 'password' }
      ]
    },
    {
      id: 'deepseek',
      name: 'DeepSeek R1',
      icon: <div className="font-bold text-xs bg-blue-700 text-white p-1 rounded-md">Deep</div>,
      status: 'connected',
      category: 'ai_automation',
      fields: [
        { label: 'API Key', value: 'sk-ds-...', type: 'password' }
      ]
    },
    {
      id: 'n8n',
      name: 'n8n Automation',
      icon: <div className="font-bold text-xs bg-red-500 text-white p-1 rounded-md">n8n</div>,
      status: 'disconnected',
      category: 'ai_automation',
      fields: [
        { label: 'Webhook URL', value: '', type: 'text' },
        { label: 'API Key', value: '', type: 'password' }
      ]
    },
    {
      id: 'make',
      name: 'Make (Integromat)',
      icon: <div className="font-bold text-xs bg-purple-500 text-white p-1 rounded-md">Make</div>,
      status: 'disconnected',
      category: 'ai_automation',
      fields: [
        { label: 'Webhook URL', value: '', type: 'text' }
      ]
    },
    {
      id: 'zapier',
      name: 'Zapier',
      icon: <div className="font-bold text-xs bg-orange-500 text-white p-1 rounded-md">Zapier</div>,
      status: 'disconnected',
      category: 'ai_automation',
      fields: [
        { label: 'Webhook URL', value: '', type: 'text' }
      ]
    },
    {
      id: 'custom_agent',
      name: 'Custom AI Agent',
      icon: <div className="font-bold text-xs bg-gray-800 text-white p-1 rounded-md">Agent</div>,
      status: 'disconnected',
      category: 'ai_automation',
      fields: [
        { label: 'Agent Name', value: 'My Support Bot', type: 'text' },
        { label: 'Endpoint URL (OpenAI Compatible)', value: '', type: 'text' },
        { label: 'API Key', value: '', type: 'password' },
        { label: 'System Prompt', value: 'You are a helpful assistant...', type: 'text' }
      ]
    },

    // --- CARRIERS (LOGISTICS) ---
    {
      id: 'aramex',
      name: 'Aramex',
      icon: <div className="font-bold text-xs bg-red-600 text-white p-1 rounded">ARX</div>,
      status: 'connected',
      category: 'carrier',
      fields: [
        { label: 'Account Number', value: '20092211', type: 'text' },
        { label: 'Username', value: 'logisa_admin', type: 'text' },
        { label: 'Password', value: '******', type: 'password' }
      ]
    },
    {
      id: 'oto',
      name: 'OTO',
      icon: <div className="font-bold text-xs bg-purple-600 text-white p-1 rounded">OTO</div>,
      status: 'connected',
      category: 'carrier',
      fields: [
        { label: 'Retailer ID', value: 'OTO_RET_8821', type: 'text' },
        { label: 'Secret Key', value: 'oto_sk_live_998877', type: 'password' }
      ]
    },
    {
      id: 'mapt',
      name: 'MAPT',
      icon: <div className="font-bold text-xs bg-blue-600 text-white p-1 rounded">MAPT</div>,
      status: 'connected',
      category: 'carrier',
      fields: [
        { label: 'Client Key', value: 'R9THQDQ-94V4SM2-JM6AJ47-ARXF9YM', type: 'text' },
        { label: 'Shared Secret', value: 'mapt_ss_223344', type: 'password' },
        { label: 'Webhook URL', value: 'https://mubasatplatform.com/wp-jsowebhook', type: 'text' }
      ]
    },

    // --- PAYMENTS ---
    {
      id: 'moyasar',
      name: 'Moyasar',
      icon: <span className="text-xl font-bold text-blue-800">M</span>,
      status: 'connected',
      category: 'payment',
      fields: [
        { label: 'Publishable Key', value: 'pk_live_...', type: 'text' },
        { label: 'Secret Key', value: 'sk_live_...', type: 'password' }
      ]
    },
    {
      id: 'tap',
      name: 'Tap',
      icon: <span className="text-xl font-bold text-gray-900">T</span>,
      status: 'disconnected',
      category: 'payment',
      fields: [
        { label: 'Public Key', value: '', type: 'text' },
        { label: 'Secret Key', value: '', type: 'password' }
      ]
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const translations = {
    title: { en: 'Infrastructure Control Center', ar: 'مركز التحكم في البنية التحتية' },
    tabs: {
      config: { en: 'Configuration', ar: 'الإعدادات والربط' },
      docs: { en: 'Developer API Docs', ar: 'وثائق المطورين (API)' }
    },
    actions: {
      addChannel: { en: '+ Add New Channel', ar: '+ إضافة قناة جديدة' },
      delete: { en: 'Delete', ar: 'حذف' }
    }
  };

  const t = (key: keyof typeof translations) => translations[key][lang];

  // --- Logic for Dynamic Add/Delete ---
  const handleAddChannel = () => {
    const newId = `channel_${Date.now()}`;
    const newChannel: IntegrationItem = {
      id: newId,
      name: 'New Telegram Bot',
      icon: <span className="text-2xl">✈️</span>,
      status: 'disconnected',
      category: 'channel',
      fields: [
        { label: 'Bot Token', value: '', type: 'password' },
        { label: 'Username', value: '', type: 'text' }
      ]
    };
    setIntegrations(prev => [...prev, newChannel]);
    setEditingId(newId);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this integration?')) {
      setIntegrations(prev => prev.filter(i => i.id !== id));
    }
  };

  // --- Logic for Updates ---
  const toggleStatus = (id: string, newStatus: 'connected' | 'disconnected') => {
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    if (newStatus === 'disconnected') setEditingId(null);
  };

  const updateField = (id: string, fieldIndex: number, newValue: string) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newFields = [...item.fields];
      newFields[fieldIndex] = { ...newFields[fieldIndex], value: newValue };
      return { ...item, fields: newFields };
    }));
  };

  const updateName = (id: string, newName: string) => {
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  };

  const renderIntegrationCard = (item: IntegrationItem) => (
    <div key={item.id} className={`bg-white rounded-xl border transition-all duration-200 ${editingId === item.id ? 'border-blue-500 shadow-md ring-1 ring-blue-100' : 'border-gray-200 shadow-sm'}`}>
      <div className="p-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden relative">
             {/* Small badge for category */}
             {item.category === 'ai_automation' && (
                 <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full border border-white"></div>
             )}
            {item.icon}
          </div>
          <div>
            {editingId === item.id && (item.category === 'channel' || item.id === 'custom_agent') ? (
               <input 
                 type="text" 
                 value={item.name} 
                 onChange={(e) => updateName(item.id, e.target.value)}
                 className="font-bold text-gray-800 text-lg border-b border-blue-300 focus:outline-none"
               />
            ) : (
               <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
            )}
            
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${item.status === 'connected' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <p className="text-xs text-gray-500">{item.status === 'connected' ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {item.status === 'disconnected' ? (
            <button 
              onClick={() => setEditingId(item.id)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              Connect
            </button>
          ) : (
            <>
              <button 
                  onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Config
              </button>
              <button 
                  onClick={() => toggleStatus(item.id, 'disconnected')}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors border border-red-100"
              >
                Disconnect
              </button>
            </>
          )}
          {/* Allow deletion only for dynamically added channels or specific items */}
          {item.category === 'channel' && item.id.startsWith('channel_') && (
             <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 px-2">
               🗑️
             </button>
          )}
        </div>
      </div>

      {/* Config Form */}
      {editingId === item.id && (
        <div className="px-5 pb-5 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.fields.map((field, idx) => (
                  <div key={idx} className={field.label === 'System Prompt' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{field.label}</label>
                    {field.label === 'System Prompt' ? (
                        <textarea
                            value={field.value}
                            onChange={(e) => updateField(item.id, idx, e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                            rows={3}
                        />
                    ) : (
                        <input 
                        type={field.type} 
                        value={field.value}
                        onChange={(e) => updateField(item.id, idx, e.target.value)}
                        placeholder={`Enter ${field.label}`}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                        />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 text-sm font-medium hover:text-gray-700 px-3 py-2"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    toggleStatus(item.id, 'connected');
                    setEditingId(null);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                  Save & Connect
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-gray-200">
           <button 
             onClick={() => setActiveTab('config')} 
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'config' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             {translations.tabs.config[lang]}
           </button>
           <button 
             onClick={() => setActiveTab('docs')} 
             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'docs' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
           >
             {translations.tabs.docs[lang]}
           </button>
        </div>
      </div>

      {activeTab === 'config' ? (
        <div className="space-y-8">
            {/* Platform Keys */}
            <section className="bg-slate-900 text-white rounded-xl p-6 shadow-md">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Platform API Keys (Output)</h3>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Active</span>
                 </div>
                 <div className="bg-slate-800 p-3 rounded font-mono text-sm text-yellow-400 mb-2 overflow-hidden text-ellipsis">
                    {platformApiKey}
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => alert('Regenerated!')} className="text-xs text-slate-400 hover:text-white underline">Regenerate Key</button>
                    <button onClick={() => alert('Webhook Test sent!')} className="text-xs text-blue-400 hover:text-blue-300 underline">Test Webhook</button>
                 </div>
            </section>

            {/* AI & Automation (New) */}
            <section>
                 <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-indigo-500 pl-3">AI & Google Cloud Ecosystem</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrations.filter(i => i.category === 'ai_automation').map(renderIntegrationCard)}
                 </div>
            </section>

            {/* Channels (Dynamic) */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-700 border-l-4 border-purple-500 pl-3">Communication Channels & ERP</h3>
                    <button onClick={handleAddChannel} className="text-blue-600 text-sm font-bold hover:underline">
                        {translations.actions.addChannel[lang]}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrations.filter(i => i.category === 'channel').map(renderIntegrationCard)}
                </div>
            </section>
            
            {/* Carriers */}
            <section>
                <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">Carriers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrations.filter(i => i.category === 'carrier').map(renderIntegrationCard)}
                </div>
            </section>

            {/* Payments */}
            <section>
                <h3 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-green-500 pl-3">Payment Gateways</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrations.filter(i => i.category === 'payment').map(renderIntegrationCard)}
                </div>
            </section>
        </div>
      ) : (
        /* --- Developer Docs Tab --- */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">API Documentation</h3>
                <p className="text-gray-500">Standard JSON formats for integrating with LogiSa.</p>
            </div>

            <div>
                <h4 className="font-bold text-gray-700 mb-2">1. Create Shipment Endpoint</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm text-gray-700">
                    <span className="text-purple-600">POST</span> https://api.logisa.com/v1/shipments
                </div>
                <pre className="mt-2 bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "api_key": "sk_live_...",
  "shipment": {
    "reference_id": "ORDER-123",
    "customer": {
      "name": "Ahmed Ali",
      "phone": "+966500000000",
      "city": "Riyadh",
      "address_line1": "King Fahd Road"
    },
    "parcel": {
      "weight_kg": 2.5,
      "items": ["Laptop", "Charger"]
    },
    "preferred_carrier": "auto" // or "aramex", "oto"
  }
}`}
                </pre>
            </div>

            <div>
                <h4 className="font-bold text-gray-700 mb-2">2. Webhook Event Format</h4>
                <p className="text-sm text-gray-500 mb-2">We send this JSON payload to your configured Webhook URL.</p>
                <pre className="bg-slate-900 text-blue-300 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "event": "shipment.status_changed",
  "data": {
    "shipment_id": "SH-998877",
    "unified_tracking": "OTO-789456",
    "previous_status": "created",
    "current_status": "picked_up",
    "timestamp": "2023-11-01T10:00:00Z"
  }
}`}
                </pre>
            </div>
        </div>
      )}
    </div>
  );
};