"use client"

import type React from "react"
import { useState } from "react"
import { createPaymentInvoice } from "@/services/payment"
import { generatePolicy, sendPolicyToCustomer } from "@/services/notificationService"
import type { NotificationChannel, ShipmentPolicy } from "@/services/notificationService"

interface PaymentModalProps {
  isOpen: boolean
  shipmentId: string
  trackingNumber: string
  amount: number
  shipmentDetails: any
  onClose: () => void
  onPaymentComplete: () => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  shipmentId,
  trackingNumber,
  amount,
  shipmentDetails,
  onClose,
  onPaymentComplete,
}) => {
  const [stage, setStage] = useState<"select-channel" | "payment" | "success">("select-channel")
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>([
    { type: "whatsapp", value: "+966500000001", enabled: true },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAddChannel = () => {
    setSelectedChannels([...selectedChannels, { type: "email", value: "", enabled: false }])
  }

  const handleRemoveChannel = (index: number) => {
    setSelectedChannels(selectedChannels.filter((_, i) => i !== index))
  }

  const handleUpdateChannel = (index: number, field: string, value: any) => {
    const updated = [...selectedChannels]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedChannels(updated)
  }

  const handleProceedToPayment = async () => {
    const validChannels = selectedChannels.filter((c) => c.enabled && c.value)
    if (validChannels.length === 0) {
      setError("الرجاء تحديد طريقة استقبال البوليصة على الأقل")
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      console.log(
        "[v0] Step 8: Proceeding to payment with channels:",
        validChannels.map((c) => c.type),
      )

      const paymentResponse = await createPaymentInvoice({
        shipmentId,
        amount,
        currency: "SAR",
        customerName: shipmentDetails.customerName || "Guest",
        customerEmail: selectedChannels.find((c) => c.type === "email")?.value || "customer@example.com",
        customerPhone: selectedChannels.find((c) => c.type === "whatsapp")?.value || "+966500000000",
        description: `Shipment Policy - ${trackingNumber}`,
        notificationOption:
          validChannels.length > 1 ? "BOTH" : validChannels[0].type.toUpperCase() === "WHATSAPP" ? "SMS" : "EMAIL",
      })

      console.log("[v0] Step 9: MyFatoora response received - Invoice ID:", paymentResponse.invoiceId)
      console.log("[v0] Step 9: Payment URL:", paymentResponse.paymentUrl)

      setPaymentLink(paymentResponse.paymentUrl)
      setStage("payment")
    } catch (err) {
      console.error("[v0] Step 8: Error creating payment:", err)
      setError("فشل في إنشاء رابط الدفع. تأكد من تكوين متغيرات MyFatoora البيئية.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true)

    try {
      console.log("[v0] Step 10: Confirming payment - generating policy")

      const policy: ShipmentPolicy = generatePolicy(
        shipmentId,
        trackingNumber,
        shipmentDetails,
        paymentLink || undefined,
      )

      console.log(
        "[v0] Step 11: Sending policy to channels:",
        selectedChannels.filter((c) => c.enabled).map((c) => c.type),
      )

      await sendPolicyToCustomer(
        selectedChannels.filter((c) => c.enabled),
        policy,
      )

      console.log("[v0] Step 11: Policy sent successfully")

      setStage("success")
      setTimeout(() => {
        onPaymentComplete()
        onClose()
      }, 2000)
    } catch (err) {
      console.error("[v0] Step 11: Error sending policy:", err)
      setError("فشل في إرسال البوليصة. الرجاء المحاولة مرة أخرى.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 max-h-[90vh] overflow-y-auto">
        {stage === "select-channel" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">تأكيد الدفع والإرسال</h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-600 text-sm">المبلغ المستحق:</p>
              <p className="text-3xl font-bold text-blue-600">{amount} ر.س</p>
              <p className="text-xs text-gray-500 mt-2">رقم التتبع: {trackingNumber}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">اختر طرق استقبال البوليصة:</h3>
              <div className="space-y-3">
                {selectedChannels.map((channel, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">
                        {channel.type === "whatsapp"
                          ? "WhatsApp"
                          : channel.type === "email"
                            ? "البريد الإلكتروني"
                            : channel.type === "telegram"
                              ? "Telegram"
                              : "الرسائل النصية"}
                      </label>
                      <input
                        type="text"
                        value={channel.value}
                        onChange={(e) => handleUpdateChannel(idx, "value", e.target.value)}
                        placeholder={
                          channel.type === "whatsapp"
                            ? "+966500000000"
                            : channel.type === "email"
                              ? "example@mail.com"
                              : channel.type === "telegram"
                                ? "123456789"
                                : "+966500000000"
                        }
                        className="w-full border rounded px-2 py-2 text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={channel.enabled}
                        onChange={(e) => handleUpdateChannel(idx, "enabled", e.target.checked)}
                        className="w-4 h-4"
                      />
                    </label>
                    <button
                      onClick={() => handleRemoveChannel(idx)}
                      className="text-red-500 hover:text-red-700 px-2 py-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={handleAddChannel} className="text-blue-600 text-sm font-semibold mt-3 hover:underline">
                + إضافة طريقة إرسال أخرى
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {isProcessing ? "جاري..." : "المتابعة للدفع"}
              </button>
            </div>
          </>
        )}

        {stage === "payment" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">رابط الدفع</h2>

            <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
              <p className="text-xs text-green-600 font-semibold mb-2">تم إنشاء رابط الدفع</p>
              <a
                href={paymentLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm break-all hover:underline block p-2 bg-white rounded border border-blue-200"
              >
                {paymentLink}
              </a>
              <p className="text-xs text-gray-500 mt-2">
                الرجاء اتباع الرابط أعلاه لإكمال عملية الدفع بشكل آمن عبر MyFatoora
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStage("select-channel")}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                عودة
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {isProcessing ? "جاري الإرسال..." : "تم الدفع - إرسال البوليصة"}
              </button>
            </div>
          </>
        )}

        {stage === "success" && (
          <>
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">تم بنجاح!</h2>
              <p className="text-gray-600 mb-4">تم إرسال بوليصة الشحن إلى جميع الطرق المختارة.</p>
              <p className="text-sm text-gray-500">جاري إغلاق النافذة...</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
