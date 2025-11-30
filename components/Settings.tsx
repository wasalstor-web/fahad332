
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { Language } from '../types';

interface SettingsProps {
  lang: Language;
}

export const Settings: React.FC<SettingsProps> = ({ lang }) => {
  const isRtl = lang === 'ar';

  const translations = {
    title: { en: 'Settings', ar: 'الإعدادات' },
    subtitle: { en: 'Manage users, roles, and system preferences.', ar: 'إدارة المستخدمين والأدوار وتفضيلات النظام.' },
    tabs: {
        profile: { en: 'Profile', ar: 'الملف الشخصي' },
        users: { en: 'Team Management', ar: 'إدارة الفريق' },
        general: { en: 'General Preferences', ar: 'تفضيلات عامة' }
    },
    usersTable: {
        name: { en: 'Name', ar: 'الاسم' },
        role: { en: 'Role', ar: 'الدور' },
        status: { en: 'Status', ar: 'الحالة' },
        lastLogin: { en: 'Last Login', ar: 'آخر دخول' },
        actions: { en: 'Actions', ar: 'إجراءات' },
        addBtn: { en: 'Add User', ar: 'إضافة مستخدم' }
    },
    general: {
        notifications: { en: 'Email Notifications', ar: 'إشعارات البريد الإلكتروني' },
        autoRefund: { en: 'Auto-refund Failed Orders', ar: 'استرداد تلقائي للطلبات الفاشلة' },
        currency: { en: 'Default Currency', ar: 'العملة الافتراضية' },
        language: { en: 'System Language', ar: 'لغة النظام' }
    }
  };

  const t = (key: keyof typeof translations) => translations[key][lang];
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'general'>('users');

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
        <p className="text-gray-500 mt-1">{t('subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex -mb-px space-x-8 rtl:space-x-reverse">
            {(['profile', 'users', 'general'] as const).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {translations.tabs[tab][lang]}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
        
        {/* USERS TAB */}
        {activeTab === 'users' && (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">{translations.tabs.users[lang]}</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        + {translations.usersTable.addBtn[lang]}
                    </button>
                </div>
                <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">{translations.usersTable.name[lang]}</th>
                            <th className="px-4 py-3">{translations.usersTable.role[lang]}</th>
                            <th className="px-4 py-3">{translations.usersTable.status[lang]}</th>
                            <th className="px-4 py-3">{translations.usersTable.lastLogin[lang]}</th>
                            <th className={`px-4 py-3 ${isRtl ? 'text-left' : 'text-right'}`}>{translations.usersTable.actions[lang]}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MOCK_USERS.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'Supervisor' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`flex items-center gap-1.5 ${user.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{user.lastLogin}</td>
                                <td className={`px-4 py-3 ${isRtl ? 'text-left' : 'text-right'}`}>
                                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
             <div className="max-w-2xl space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                        <h4 className="font-medium text-gray-800">{translations.general.notifications[lang]}</h4>
                        <p className="text-sm text-gray-500">Receive weekly reports and system alerts.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                        <h4 className="font-medium text-gray-800">{translations.general.autoRefund[lang]}</h4>
                        <p className="text-sm text-gray-500">Automatically refund to wallet if a carrier cancels shipment.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{translations.general.currency[lang]}</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50">
                            <option>SAR (Saudi Riyal)</option>
                            <option>USD (US Dollar)</option>
                            <option>AED (UAE Dirham)</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{translations.general.language[lang]}</label>
                        <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50" disabled>
                            <option>{lang === 'en' ? 'English' : 'Arabic'}</option>
                        </select>
                    </div>
                </div>
             </div>
        )}

        {/* PROFILE TAB (Placeholder) */}
        {activeTab === 'profile' && (
            <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>
                <div className="space-y-4 flex-1 max-w-md">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" defaultValue="Admin User" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" defaultValue="admin@logisa.com" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
