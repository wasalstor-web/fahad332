
import React, { useState } from 'react';
import { Language } from '../types';

interface TrackingProps {
  lang: Language;
}

export const Tracking: React.FC<TrackingProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [trackInput, setTrackInput] = useState('OTO-789456');

  const translations = {
    title: { en: 'Shipment Tracking', ar: 'تتبع الشحنات' },
    subtitle: { en: 'Real-time tracking for any shipment.', ar: 'تتبع لحظي لأي شحنة في النظام.' },
    placeholder: { en: 'Enter Tracking Number (e.g. OTO-xxxxx)', ar: 'أدخل رقم التتبع (مثل OTO-xxxxx)' },
    trackBtn: { en: 'Track', ar: 'تتبع' }
  };
  
  const steps = [
    { status: 'Shipment Created', date: 'Oct 25, 10:00 AM', completed: true, location: 'Riyadh' },
    { status: 'Picked Up by Carrier', date: 'Oct 25, 02:30 PM', completed: true, location: 'Riyadh Hub' },
    { status: 'In Transit', date: 'Oct 26, 09:15 AM', completed: true, location: 'On way to Dammam' },
    { status: 'Out for Delivery', date: 'Oct 27, 08:00 AM', completed: false, location: 'Dammam' },
    { status: 'Delivered', date: '-', completed: false, location: '-' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{translations.title[lang]}</h2>
        <p className="text-gray-500 mt-1">{translations.subtitle[lang]}</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        {/* Search Bar */}
        <div className="flex gap-2 max-w-xl mx-auto mb-10">
            <input 
              type="text" 
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              placeholder={translations.placeholder[lang]}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-blue-700">
                {translations.trackBtn[lang]}
            </button>
        </div>

        {/* Tracking Timeline */}
        <div className="max-w-3xl mx-auto">
            <div className="flex flex-col relative">
                 {/* Vertical Line */}
                <div className={`absolute top-0 bottom-0 w-0.5 bg-gray-200 ${isRtl ? 'right-4' : 'left-4'}`}></div>

                {steps.map((step, index) => (
                    <div key={index} className="flex gap-6 mb-8 relative">
                         {/* Circle */}
                        <div className={`z-10 w-9 h-9 rounded-full flex items-center justify-center border-4 ${
                            step.completed ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-gray-200 text-gray-400'
                        }`}>
                            {step.completed ? '✓' : (index + 1)}
                        </div>
                        
                        {/* Content */}
                        <div className="bg-gray-50 rounded-lg p-4 flex-1 border border-gray-100 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start">
                                <h4 className={`font-bold ${step.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {step.status}
                                </h4>
                                <span className="text-xs text-gray-500 font-mono">{step.date}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Location: {step.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
