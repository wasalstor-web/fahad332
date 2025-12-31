"use client"

import type React from "react"
import { useState } from "react"
import type { Language } from "../types"
import { MOCK_WAREHOUSES, MOCK_INVENTORY_ITEMS, MOCK_WAREHOUSE_ALERTS } from "../constants"

interface WarehouseProps {
  lang: Language
}

export const Warehouse: React.FC<WarehouseProps> = ({ lang }) => {
  const isRtl = lang === "ar"
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "alerts">("overview")
  const [selectedWarehouse, setSelectedWarehouse] = useState(MOCK_WAREHOUSES[0].id)

  const translations = {
    title: { en: "Warehouse Management", ar: "إدارة المستودعات" },
    overview: { en: "Overview", ar: "نظرة عامة" },
    inventory: { en: "Inventory", ar: "المخزون" },
    alerts: { en: "Alerts", ar: "التنبيهات" },
    name: { en: "Name", ar: "الاسم" },
    city: { en: "City", ar: "المدينة" },
    manager: { en: "Manager", ar: "المدير" },
    capacity: { en: "Capacity", ar: "السعة" },
    usage: { en: "Usage", ar: "الاستخدام" },
    sku: { en: "SKU", ar: "الرمز" },
    quantity: { en: "Quantity", ar: "الكمية" },
    minThreshold: { en: "Min Threshold", ar: "الحد الأدنى" },
    price: { en: "Price", ar: "السعر" },
    status: { en: "Status", ar: "الحالة" },
  }

  const currentWarehouse = MOCK_WAREHOUSES.find((w) => w.id === selectedWarehouse)
  const warehouseItems = MOCK_INVENTORY_ITEMS.filter((i) => i.warehouseId === selectedWarehouse)
  const warehouseAlerts = MOCK_WAREHOUSE_ALERTS.filter((a) => a.warehouseId === selectedWarehouse)

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{translations.title[lang]}</h2>
        <p className="text-gray-500 mt-1">
          {lang === "ar" ? "إدارة المستودعات والمخزون" : "Manage your warehouses and inventory"}
        </p>
      </div>

      {/* Warehouse Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MOCK_WAREHOUSES.map((warehouse) => (
            <button
              key={warehouse.id}
              onClick={() => setSelectedWarehouse(warehouse.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all ${
                selectedWarehouse === warehouse.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {warehouse.name}
            </button>
          ))}
        </div>
      </div>

      {/* Warehouse Info Card */}
      {currentWarehouse && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">معلومات المستودع</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">{translations.city[lang]}</p>
                <p className="font-semibold text-gray-800">{currentWarehouse.city}</p>
              </div>
              <div>
                <p className="text-gray-500">{translations.manager[lang]}</p>
                <p className="font-semibold text-gray-800">{currentWarehouse.manager}</p>
              </div>
              <div>
                <p className="text-gray-500">الهاتف</p>
                <p className="font-semibold text-gray-800">{currentWarehouse.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">العنوان</p>
                <p className="font-semibold text-gray-800">{currentWarehouse.address}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">السعة والاستخدام</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">المخزون الحالي</span>
                  <span className="font-bold text-gray-800">
                    {currentWarehouse.currentStock} / {currentWarehouse.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${(currentWarehouse.currentStock / currentWarehouse.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round((currentWarehouse.currentStock / currentWarehouse.capacity) * 100)}%
                </p>
                <p className="text-xs text-gray-500">استخدام السعة</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {(["overview", "inventory", "alerts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600 -mb-[1px]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {translations[tab][lang]}
          </button>
        ))}
      </div>

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700">المخزون في {currentWarehouse?.name}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">{translations.sku[lang]}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">{translations.name[lang]}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">{translations.quantity[lang]}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">{translations.minThreshold[lang]}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">{translations.price[lang]}</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">{translations.status[lang]}</th>
                </tr>
              </thead>
              <tbody>
                {warehouseItems.map((item) => {
                  const isLow = item.quantity < item.minThreshold
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-600">{item.sku}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-gray-700">{item.minThreshold}</td>
                      <td className="px-4 py-3 text-gray-700">{item.unitPrice.toFixed(2)} ر.س</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isLow ? "منخفض" : "جيد"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === "alerts" && (
        <div className="space-y-3">
          {warehouseAlerts.length > 0 ? (
            warehouseAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === "high"
                    ? "bg-red-50 border-red-500"
                    : alert.severity === "medium"
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.date || new Date().toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      alert.severity === "high"
                        ? "bg-red-200 text-red-800"
                        : alert.severity === "medium"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {alert.severity === "high" ? "عالي" : alert.severity === "medium" ? "متوسط" : "منخفض"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">لا توجد تنبيهات في الوقت الحالي</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
