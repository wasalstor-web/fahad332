"use client"

import type React from "react"
import { useState } from "react"

interface NotificationConfig {
  whatsappNumber: string
  email: string
  telegramChatId: string
  defaultChannel: "whatsapp" | "email" | "telegram"
}

interface NotificationSettingsProps {
  onSave: (config: NotificationConfig) => void
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSave }) => {
  const [config, setConfig] = useState<NotificationConfig>({
    whatsappNumber: "+966500000001",
    email: "business@example.com",
    telegramChatId: "1234567890",
    defaultChannel: "whatsapp",
  })

  const handleSave = () => {
    onSave(config)
    alert("تم حفظ إعدادات الإخطارات بنجاح")
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">إعدادات إرسال البوليصات</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">رقم WhatsApp</label>
          <input
            type="text"
            value={config.whatsappNumber}
            onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
            placeholder="+966500000001"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => setConfig({ ...config, email: e.target.value })}
            placeholder="business@example.com"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">معرف Telegram Chat</label>
          <input
            type="text"
            value={config.telegramChatId}
            onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })}
            placeholder="1234567890"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">يمكنك الحصول على هذا من @userinfobot على Telegram</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">الطريقة الافتراضية</label>
          <select
            value={config.defaultChannel}
            onChange={(e) =>
              setConfig({ ...config, defaultChannel: e.target.value as "whatsapp" | "email" | "telegram" })
            }
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="email">البريد الإلكتروني</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          حفظ الإعدادات
        </button>
      </div>
    </div>
  )
}
