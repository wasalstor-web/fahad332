
import React from 'react';
import { MOCK_INVOICES } from '../constants';
import { Language } from '../types';

interface AccountingProps {
  lang: Language;
}

export const Accounting: React.FC<AccountingProps> = ({ lang }) => {
  const isRtl = lang === 'ar';

  const translations = {
    title: { en: 'Accounting & Invoicing', ar: 'المحاسبة والفواتير' },
    subtitle: { en: 'Manage invoices, tax reports, and financial statements.', ar: 'إدارة الفواتير والتقارير الضريبية والقوائم المالية.' },
    createBtn: { en: 'Create Invoice', ar: 'إنشاء فاتورة' },
    exportBtn: { en: 'Export VAT Report', ar: 'تصدير تقرير ضريبي' },
    headers: {
        id: { en: 'Invoice #', ar: 'رقم الفاتورة' },
        customer: { en: 'Customer', ar: 'العميل' },
        date: { en: 'Date', ar: 'التاريخ' },
        amount: { en: 'Amount', ar: 'المبلغ' },
        status: { en: 'Status', ar: 'الحالة' },
        actions: { en: 'Actions', ar: 'إجراءات' }
    }
  };

  const t = (key: keyof typeof translations) => translations[key][lang];
  const th = translations.headers;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
           <p className="text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                {translations.exportBtn[lang]}
            </button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
                + {translations.createBtn[lang]}
            </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 rtl:divide-x-reverse">
          <div className="px-4">
              <p className="text-sm text-gray-500">{lang === 'ar' ? 'إجمالي المبيعات (أكتوبر)' : 'Total Sales (Oct)'}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">45,200.00 SAR</p>
          </div>
          <div className="px-4">
              <p className="text-sm text-gray-500">{lang === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT Collected (15%)'}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">6,780.00 SAR</p>
          </div>
          <div className="px-4">
              <p className="text-sm text-gray-500">{lang === 'ar' ? 'الفواتير المستحقة' : 'Outstanding Invoices'}</p>
              <p className="text-2xl font-bold text-red-600 mt-1">2,150.50 SAR</p>
          </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">{th.id[lang]}</th>
                <th className="px-6 py-4">{th.customer[lang]}</th>
                <th className="px-6 py-4">{th.date[lang]}</th>
                <th className="px-6 py-4">{th.amount[lang]}</th>
                <th className="px-6 py-4">{th.status[lang]}</th>
                <th className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>{th.actions[lang]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-600">{inv.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{inv.customerName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{inv.items}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{inv.date}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{inv.amount} SAR</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {inv.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                    <button className="text-blue-600 hover:underline text-xs font-medium mr-2 ml-2">PDF</button>
                    <button className="text-gray-500 hover:text-gray-700 text-xs">Email</button>
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
