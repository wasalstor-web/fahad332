
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ShipmentTable } from './components/ShipmentTable';
import { AdminAIChat } from './components/AdminAIChat';
import { CustomerChatWidget } from './components/CustomerChatWidget';
import { Integrations } from './components/Integrations';
import { Finance } from './components/Finance';
import { Settings } from './components/Settings';
import { CRM } from './components/CRM';
import { Accounting } from './components/Accounting';
import { Tracking } from './components/Tracking';
import { Support } from './components/Support';
import { Language, Shipment } from './types';
import { MOCK_SHIPMENTS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('/');
  const [language, setLanguage] = useState<Language>('en');
  // Lifted State to enable "Integrated Workflow"
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);

  const handleNewShipment = (newShipment: Shipment) => {
    setShipments(prev => [newShipment, ...prev]);
  };

  const renderContent = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard shipments={shipments} />;
      case '/shipments':
        return <ShipmentTable lang={language} shipments={shipments} />;
      case '/finance':
        return <Finance lang={language} />;
      case '/crm':
        return <CRM lang={language} />;
      case '/accounting':
        return <Accounting lang={language} />;
      case '/tracking':
        return <Tracking lang={language} />;
      case '/support':
        return <Support lang={language} />;
      case '/store':
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-white rounded-xl border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">{language === 'ar' ? 'إدارة متجري' : 'My Store Management'}</h2>
            <p className="mt-2">{language === 'ar' ? 'إدارة المنتجات والمخزون الخاص بك من هنا.' : 'Manage your personal store products and inventory here.'}</p>
          </div>
        );
      case '/advisor':
        return <AdminAIChat />;
      case '/integrations':
        return <Integrations lang={language} />;
      case '/settings':
        return <Settings lang={language} />;
      default:
        return <Dashboard shipments={shipments} />;
    }
  };

  const getHeaderTitle = () => {
    if (language === 'ar') {
      switch (currentPage) {
        case '/': return 'لوحة التحكم';
        case '/shipments': return 'جميع الشحنات';
        case '/finance': return 'المالية والمحفظة';
        case '/crm': return 'إدارة العملاء';
        case '/accounting': return 'المحاسبة';
        case '/tracking': return 'تتبع الشحنات';
        case '/support': return 'الدعم الفني';
        case '/advisor': return 'المستشار الذكي';
        case '/integrations': return 'التكاملات';
        case '/settings': return 'الإعدادات';
        default: return 'متجري';
      }
    }
    // English defaults
    switch (currentPage) {
      case '/': return 'Dashboard';
      case '/shipments': return 'All Shipments';
      case '/finance': return 'Finance & Wallet';
      case '/crm': return 'CRM';
      case '/accounting': return 'Accounting';
      case '/tracking': return 'Tracking';
      case '/support': return 'Support Tickets';
      case '/advisor': return 'AI Business Advisor';
      case '/integrations': return 'Integrations';
      case '/settings': return 'Settings';
      default: return 'My Store';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} lang={language} />
      
      <main className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${language === 'ar' ? 'mr-64' : 'ml-64'}`}>
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-2xl font-bold text-slate-800">
                {getHeaderTitle()}
             </h1>
             <p className="text-slate-500 text-sm mt-1">
               {language === 'ar' ? 'أهلاً بك، المدير العام' : 'Welcome back, Admin'}
             </p>
          </div>
          <div className="flex items-center gap-4">
            
            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:text-blue-600 shadow-sm transition-colors flex items-center gap-2"
            >
              <span>{language === 'en' ? '🇺🇸 EN' : '🇸🇦 AR'}</span>
            </button>

            <button className="bg-white p-2 rounded-full text-gray-500 shadow-sm border border-gray-100 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            </button>
            <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src="https://picsum.photos/100/100" alt="Profile" className="object-cover w-full h-full"/>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* The Floating Widget for Customer Support Simulation */}
      <CustomerChatWidget onNewShipment={handleNewShipment} />
    </div>
  );
};

export default App;
