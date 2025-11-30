
import React, { useState } from 'react';
import { MOCK_CUSTOMERS } from '../constants';
import { Language } from '../types';

interface CRMProps {
  lang: Language;
}

export const CRM: React.FC<CRMProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const translations = {
    title: { en: 'Customer Relationship Management', ar: 'إدارة علاقات العملاء (CRM)' },
    subtitle: { en: 'Track customer profiles, history, and lifetime value.', ar: 'متابعة ملفات العملاء، التاريخ، والقيمة الإجمالية.' },
    search: { en: 'Search customers...', ar: 'بحث عن العملاء...' },
    headers: {
      name: { en: 'Customer Name', ar: 'اسم العميل' },
      contact: { en: 'Contact', ar: 'معلومات الاتصال' },
      location: { en: 'Location', ar: 'الموقع' },
      stats: { en: 'Lifetime Stats', ar: 'الإحصائيات' },
      status: { en: 'Status', ar: 'الحالة' },
      actions: { en: 'Actions', ar: 'إجراءات' }
    }
  };

  const t = (key: keyof typeof translations) => translations[key][lang];
  const th = translations.headers;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">{lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{MOCK_CUSTOMERS.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">{lang === 'ar' ? 'متوسط قيمة العميل' : 'Avg. Customer Value'}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,497 <span className="text-sm font-normal">SAR</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">{lang === 'ar' ? 'معدل التكرار' : 'Repeat Rate'}</p>
          <p className="text-3xl font-bold text-green-600 mt-2">68%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">{lang === 'ar' ? 'العملاء الجدد (هذا الشهر)' : 'New Customers (Mo)'}</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">+12</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-64">
             <input 
               type="text" 
               placeholder={t('search')}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
             <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
             {lang === 'ar' ? '+ عميل جديد' : '+ New Customer'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">{th.name[lang]}</th>
                <th className="px-6 py-4">{th.contact[lang]}</th>
                <th className="px-6 py-4">{th.location[lang]}</th>
                <th className="px-6 py-4">{th.stats[lang]}</th>
                <th className="px-6 py-4">{th.status[lang]}</th>
                <th className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>{th.actions[lang]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">ID: {customer.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-800">{customer.phone}</div>
                    <div className="text-xs text-blue-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{customer.city}</td>
                  <td className="px-6 py-4">
                     <div className="font-medium text-gray-900">{customer.totalSpent} SAR</div>
                     <div className="text-xs text-gray-500">{customer.orderCount} Orders</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                        {customer.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                    <button className="text-blue-600 hover:underline font-medium text-xs">
                        {lang === 'ar' ? 'عرض الملف' : 'View Profile'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
