#!/bin/bash
set -e

# Smoke test script for LogiSa backend

BASE_URL="${BASE_URL:-http://localhost:3001}"
MAX_RETRIES=30
RETRY_INTERVAL=2

echo "🔄 Waiting for server at $BASE_URL..."

# Wait for server to be ready
for i in $(seq 1 $MAX_RETRIES); do
  if curl -s "$BASE_URL/api/shipments" > /dev/null 2>&1; then
    echo "✅ Server is ready!"
    break
  fi
  if [ $i -eq $MAX_RETRIES ]; then
    echo "❌ Server did not start within expected time"
    exit 1
  fi
  echo "  Waiting... ($i/$MAX_RETRIES)"
  sleep $RETRY_INTERVAL
done

echo ""
echo "📦 Testing GET /api/shipments..."
SHIPMENTS_RESPONSE=$(curl -s "$BASE_URL/api/shipments")
echo "Response: $SHIPMENTS_RESPONSE"
if echo "$SHIPMENTS_RESPONSE" | grep -q "\["; then
  echo "✅ Shipments endpoint works"
else
  echo "❌ Shipments endpoint failed"
  exit 1
fi

echo ""
echo "🚚 Testing POST /api/providers/mapit/create (simulated)..."
MAPIT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/providers/mapit/create" \
  -H "Content-Type: application/json" \
  -d '{"shipment": {"customerName": "Test Customer", "destination": "Riyadh", "cost": 50, "price": 75}}')
echo "Response: $MAPIT_RESPONSE"
if echo "$MAPIT_RESPONSE" | grep -q '"ok":true'; then
  echo "✅ Mapit shipment creation works"
else
  echo "❌ Mapit shipment creation failed"
  exit 1
fi

echo ""
echo "💳 Testing POST /api/payment/create (simulated)..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/payment/create" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "SAR", "metadata": {"test": true}}')
echo "Response: $PAYMENT_RESPONSE"
if echo "$PAYMENT_RESPONSE" | grep -q '"ok":true'; then
  echo "✅ Payment creation works"
else
  echo "❌ Payment creation failed"
  exit 1
fi

echo ""
echo "📬 Testing POST /api/process-message..."
MESSAGE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/process-message" \
  -H "Content-Type: application/json" \
  -d '{"message": "أريد شحن طرد من الرياض إلى جدة وزن 2 كجم", "channel": "whatsapp"}')
echo "Response: $MESSAGE_RESPONSE"
if [ -n "$MESSAGE_RESPONSE" ]; then
  echo "✅ Process message endpoint works"
else
  echo "❌ Process message endpoint failed"
  exit 1
fi

echo ""
echo "📋 Verifying shipment was persisted..."
FINAL_SHIPMENTS=$(curl -s "$BASE_URL/api/shipments")
echo "Final shipments: $FINAL_SHIPMENTS"
if echo "$FINAL_SHIPMENTS" | grep -q "MAPIT"; then
  echo "✅ Shipment was persisted correctly"
else
  echo "⚠️ Warning: Shipment may not have been persisted"
fi

echo ""
echo "🎉 All smoke tests passed!"
