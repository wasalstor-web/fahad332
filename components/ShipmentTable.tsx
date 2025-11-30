
import React, { useState } from 'react';
import { ShipmentStatus, Carrier, SourceChannel, Language, Shipment } from '../types';

interface ShipmentTableProps {
  lang: Language;
  shipments: Shipment[];
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({ lang, shipments }) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [carrierFilter, setCarrierFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  const isRtl = lang === 'ar';

  const translations = {
    recentShipments: { en: 'Shipment Management', ar: 'إدارة الشحنات' },
    exportCSV: { en: 'Export CSV', ar: 'تصدير CSV' },
    filters: {
      status: { en: 'Status', ar: 'الحالة' },
      carrier: { en: 'Carrier', ar: 'شركة الشحن' },
      source: { en: 'Source', ar: 'المصدر' },
      all: { en: 'All', ar: 'الكل' },
      clear: { en: 'Clear Filters', ar: 'مسح الفلاتر' }
    },
    headers: {
      tracking: { en: 'Unified Tracking', ar: 'التتبع الموحد' },
      customer: { en: 'Customer', ar: 'العميل' },
      carrier: { en: 'Carrier', ar: 'شركة الشحن' },
      status: { en: 'Status', ar: 'الحالة' },
      source: { en: 'Source', ar: 'المصدر' },
      financials: { en: 'Cost/Price', ar: 'التكلفة/السعر' },
      actions: { en: 'Actions', ar: 'إجراءات' }
    },
    actions: {
      view: { en: 'View', ar: 'عرض' }
    }
  };

  const statusMap: Record<string, string> = {
    [ShipmentStatus.CREATED]: isRtl ? 'تم الإنشاء' : 'Created',
    [ShipmentStatus.PICKED_UP]: isRtl ? 'تم الاستلام' : 'Picked Up',
    [ShipmentStatus.IN_TRANSIT]: isRtl ? 'جاري التوصيل' : 'In Transit',
    [ShipmentStatus.DELIVERED]: isRtl ? 'تم التوصيل' : 'Delivered',
    [ShipmentStatus.EXCEPTION]: isRtl ? 'استثناء' : 'Exception',
  };

  const sourceMap: Record<string, string> = {
    [SourceChannel.WHATSAPP]: isRtl ? 'واتساب' : 'WhatsApp',
    [SourceChannel.TELEGRAM]: isRtl ? 'تيليجرام' : 'Telegram',
    [SourceChannel.API]: 'API',
    [SourceChannel.STORE]: isRtl ? 'المتجر' : 'My Store',
    [SourceChannel.LANDING]: isRtl ? 'صفحة الهبوط' : 'Landing Page',
    [SourceChannel.SALLA]: isRtl ? 'سلة' : 'Salla',
    [SourceChannel.ODOO]: isRtl ? 'أودو' : 'Odoo',
    [SourceChannel.WORDPRESS]: isRtl ? 'ووردبريس' : 'WordPress',
    [SourceChannel.SHOPIFY]: isRtl ? 'شوبيفاي' : 'Shopify',
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;
    const matchesCarrier = carrierFilter === 'All' || shipment.carrier === carrierFilter;
    const matchesSource = sourceFilter === 'All' || shipment.source === sourceFilter;
    return matchesStatus && matchesCarrier && matchesSource;
  });

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.DELIVERED: return 'bg-green-100 text-green-700';
      case ShipmentStatus.IN_TRANSIT: return 'bg-blue-100 text-blue-700';
      case ShipmentStatus.EXCEPTION: return 'bg-red-100 text-red-700';
      case ShipmentStatus.CREATED: return 'bg-gray-100 text-gray-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };
  
  const getCarrierColor = (carrier: Carrier) => {
      switch(carrier) {
          case Carrier.ARAMEX: return 'text-red-600';
          case Carrier.SMSA: return 'text-orange-600';
          case Carrier.DHL: return 'text-yellow-600';
          case Carrier.SPL: return 'text-green-600';
          case Carrier.OTO: return 'text-purple-600'; // Purple for OTO
          case Carrier.MAPT: return 'text-blue-600';   // Blue for MAPT
          default: return 'text-gray-700';
      }
  }

  const t = (key: keyof typeof translations) => translations[key][lang];
  const tf = translations.filters;

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        
        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">{tf.status[lang]}</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 outline-none"
          >
            <option value="All">{tf.all[lang]}</option>
            {Object.values(ShipmentStatus).map(status => (
              <option key={status} value={status}>{isRtl ? statusMap[status] : status}</option>
            ))}
          </select>
        </div>

        {/* Carrier Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">{tf.carrier[lang]}</label>
          <select 
            value={carrierFilter} 
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 outline-none"
          >
            <option value="All">{tf.all[lang]}</option>
            {Object.values(Carrier).map(carrier => (
              <option key={carrier} value={carrier}>{carrier}</option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">{tf.source[lang]}</label>
          <select 
            value={sourceFilter} 
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 outline-none"
          >
            <option value="All">{tf.all[lang]}</option>
            {Object.values(SourceChannel).map(source => (
              <option key={source} value={source}>{sourceMap[source]}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={() => { setStatusFilter('All'); setCarrierFilter('All'); setSourceFilter('All'); }}
          className="mt-5 text-sm text-red-500 hover:text-red-700 font-medium px-3"
        >
          {tf.clear[lang]}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">
            {translations.recentShipments[lang]} 
            <span className="text-gray-400 text-sm font-normal mx-2">({filteredShipments.length})</span>
          </h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">{translations.exportCSV[lang]}</button>
        </div>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${isRtl ? 'text-right' : 'text-left'}`}>
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">{translations.headers.tracking[lang]}</th>
                <th className="px-6 py-4">{translations.headers.customer[lang]}</th>
                <th className="px-6 py-4">{translations.headers.carrier[lang]}</th>
                <th className="px-6 py-4">{translations.headers.status[lang]}</th>
                <th className="px-6 py-4">{translations.headers.source[lang]}</th>
                <th className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>{translations.headers.financials[lang]}</th>
                <th className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>{translations.headers.actions[lang]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{shipment.trackingNumber}</div>
                      <div className="text-xs text-gray-400">{shipment.carrierTracking}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-800">{shipment.customerName}</div>
                      <div className="text-xs text-gray-400">{shipment.destination}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${getCarrierColor(shipment.carrier)}`}>{shipment.carrier}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                        {statusMap[shipment.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {sourceMap[shipment.source]}
                    </td>
                    <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                      <div className="text-gray-800">{shipment.price} SAR</div>
                      <div className="text-xs text-gray-400">{shipment.cost} SAR ({lang === 'ar' ? 'تكلفة' : 'Cost'})</div>
                    </td>
                    <td className={`px-6 py-4 ${isRtl ? 'text-left' : 'text-right'}`}>
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                        {translations.actions.view[lang]}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    {lang === 'ar' ? 'لا توجد شحنات مطابقة للفلاتر' : 'No shipments found matching current filters'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
