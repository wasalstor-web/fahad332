
import React from 'react';
import { MOCK_TICKETS } from '../constants';
import { Language } from '../types';

interface SupportProps {
  lang: Language;
}

export const Support: React.FC<SupportProps> = ({ lang }) => {
  const isRtl = lang === 'ar';

  const translations = {
    title: { en: 'Support & Tickets', ar: 'الدعم الفني والتذاكر' },
    subtitle: { en: 'Manage customer complaints and inquiries.', ar: 'إدارة شكاوى واستفسارات العملاء.' },
    headers: {
        id: { en: 'Ticket ID', ar: 'رقم التذكرة' },
        subject: { en: 'Subject', ar: 'الموضوع' },
        customer: { en: 'Customer', ar: 'العميل' },
        priority: { en: 'Priority', ar: 'الأولوية' },
        status: { en: 'Status', ar: 'الحالة' },
        date: { en: 'Date', ar: 'التاريخ' },
        actions: { en: 'Actions', ar: 'إجراءات' }
    }
  };

  const t = (key: keyof typeof translations) => translations[key][lang];
  const th = translations.headers;

  const getPriorityColor = (p: string) => {
    switch(p) {
        case 'High': return 'text-red-600 bg-red-50';
        case 'Medium': return 'text-orange-600 bg-orange-50';
        default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                    <th className="px-6 py-4">{th.id[lang]}</th>
                    <th className="px-6 py-4">{th.subject[lang]}</th>
                    <th className="px-6 py-4">{th.customer[lang]}</th>
                    <th className="px-6 py-4">{th.priority[lang]}</th>
                    <th className="px-6 py-4">{th.status[lang]}</th>
                    <th className="px-6 py-4">{th.date[lang]}</th>
                    <th className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>{th.actions[lang]}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {MOCK_TICKETS.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-xs">{ticket.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{ticket.subject}</td>
                        <td className="px-6 py-4 text-gray-600">{ticket.customer}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 ${
                                ticket.status === 'Open' ? 'text-blue-600' : 
                                ticket.status === 'Resolved' ? 'text-green-600' : 'text-orange-600'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                     ticket.status === 'Open' ? 'bg-blue-600' : 
                                     ticket.status === 'Resolved' ? 'bg-green-600' : 'bg-orange-600'
                                }`}></span>
                                {ticket.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{ticket.date}</td>
                        <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                            <button className="text-blue-600 hover:underline text-xs">Reply</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
