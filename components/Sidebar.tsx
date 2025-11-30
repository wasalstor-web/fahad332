
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Language } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, lang }) => {
  const isRtl = lang === 'ar';

  return (
    <div className={`w-64 bg-slate-900 text-white h-screen flex flex-col fixed top-0 overflow-y-auto ${isRtl ? 'right-0' : 'left-0'}`}>
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">LogiSa</h1>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ar' ? 'منصة الخدمات اللوجستية الموحدة' : 'Unified Logistics Platform'}
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
              currentPage === item.path
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="font-medium">{lang === 'ar' ? item.nameAr : item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold">{lang === 'ar' ? 'المدير العام' : 'Admin User'}</p>
            <p className="text-xs text-slate-400">{lang === 'ar' ? 'مدير العمليات' : 'Operations Mgr'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
