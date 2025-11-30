import React, { useState } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { Language, TransactionStatus, TransactionType, Transaction } from '../types';

interface FinanceProps {
  lang: Language;
}

export const Finance: React.FC<FinanceProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const handleRefund = () => {
    const newRefund: Transaction = {
      id: `REF-${Date.now()}`,
      type: TransactionType.CREDIT,
      amount: 150.00,
      currency: 'SAR',
      description: 'Manual Refund: Order #9912',
      date: new Date().toLocaleString(),
      status: TransactionStatus.COMPLETED
    };
    setTransactions([newRefund, ...transactions]);
    alert(lang === 'ar' ? 'تم استرداد المبلغ بنجاح إلى المحفظة' : 'Refund processed successfully to wallet.');
  };

  const translations = {
    title: { en: 'Finance & Wallet', ar: 'المالية والمحفظة' },
    subtitle: { en: 'Manage balance, refunds, and transaction history.', ar: 'إدارة الرصيد والاسترداد وسجل العمليات.' },
    balanceCard: {
      currentBalance: { en: 'Current Balance', ar: 'الرصيد الحالي' },
      pendingClearance: { en: 'Pending Clearance', ar: 'قيد التسوية' },
      totalWithdrawn: { en: 'Total Withdrawn', ar: 'إجمالي المسحوبات' },
      withdrawBtn: { en: 'Withdraw Funds', ar: 'سحب الرصيد' },
      topUpBtn: { en: 'Top Up Wallet', ar: 'شحن المحفظة' },
    },
    actions: {
        processRefund: { en: 'Process Refund', ar: 'إجراء استرداد' }
    },
    table: {
      recentTransactions: { en: 'Recent Transactions', ar: 'آخر العمليات' },
      id: { en: 'ID', ar: 'رقم العملية' },
      type: { en: 'Type', ar: 'النوع' },
      amount: { en: 'Amount', ar: 'المبلغ' },
      description: { en: 'Description', ar: 'الوصف' },
      status: { en: 'Status', ar: 'الحالة' },
      date: { en: 'Date', ar: 'التاريخ' },
    },
    types: {
      Credit: { en: 'Credit (+)', ar: 'إيداع (+)' },
      Debit: { en: 'Debit (-)', ar: 'خصم (-)' },
      Fee: { en: 'Fee (-)', ar: 'رسوم (-)' }
    },
    status: {
      Completed: { en: 'Completed', ar: 'مكتمل' },
      Pending: { en: 'Pending', ar: 'قيد المعالجة' },
      Failed: { en: 'Failed', ar: 'فشل' }
    }
  };

  const t = (key: keyof typeof translations) => translations[key][lang];
  const tType = (type: TransactionType) => translations.types[type][lang];
  const tStatus = (status: TransactionStatus) => translations.status[status][lang];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">{t('title')}</h2>
           <p className="text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={handleRefund} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 shadow-sm">
            ↺ {translations.actions.processRefund[lang]}
        </button>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">{translations.balanceCard.currentBalance[lang]}</p>
            <h3 className="text-4xl font-bold">12,450.00 <span className="text-lg font-normal opacity-80">SAR</span></h3>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-white text-blue-700 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-50 transition-colors">
                {translations.balanceCard.withdrawBtn[lang]}
              </button>
              <button className="flex-1 bg-blue-500 text-white border border-blue-400 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-600 transition-colors">
                {translations.balanceCard.topUpBtn[lang]}
              </button>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">{translations.balanceCard.pendingClearance[lang]}</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 ml-1">1,200.00 SAR</h3>
          <p className="text-xs text-gray-400 mt-2 ml-1">
             {lang === 'ar' ? 'مبالغ عمليات الدفع عند الاستلام (COD) التي لم يتم تحصيلها بعد.' : 'COD amounts pending collection from carriers.'}
          </p>
        </div>

        {/* Withdrawn */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">{translations.balanceCard.totalWithdrawn[lang]}</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 ml-1">45,890.00 SAR</h3>
          <p className="text-xs text-gray-400 mt-2 ml-1">
            {lang === 'ar' ? 'تم تحويلها لحسابك البنكي بنجاح.' : 'Successfully transferred to your bank account.'}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <h3 className="font-bold text-gray-800">{translations.table.recentTransactions[lang]}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">{translations.table.id[lang]}</th>
                <th className="px-6 py-4">{translations.table.description[lang]}</th>
                <th className="px-6 py-4">{translations.table.date[lang]}</th>
                <th className="px-6 py-4">{translations.table.type[lang]}</th>
                <th className="px-6 py-4">{translations.table.status[lang]}</th>
                <th className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>{translations.table.amount[lang]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500 text-xs">{trx.id}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {trx.description}
                    {trx.referenceId && (
                      <span className="block text-xs text-blue-500 cursor-pointer hover:underline">Ref: {trx.referenceId}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{trx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold 
                      ${trx.type === TransactionType.CREDIT ? 'bg-green-100 text-green-700' : 
                        trx.type === TransactionType.FEE ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>
                      {tType(trx.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium border
                      ${trx.status === TransactionStatus.COMPLETED ? 'bg-white border-green-200 text-green-600' : 
                        trx.status === TransactionStatus.PENDING ? 'bg-white border-yellow-200 text-yellow-600' : 'bg-white border-red-200 text-red-600'}`}>
                      {tStatus(trx.status)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${isRtl ? 'text-left' : 'text-right'} ${trx.type === TransactionType.CREDIT ? 'text-green-600' : 'text-gray-800'}`}>
                    {trx.type === TransactionType.CREDIT ? '+' : '-'}{trx.amount} {trx.currency}
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