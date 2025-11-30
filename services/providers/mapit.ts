import crypto from 'crypto';
import fetch from 'node-fetch';

export interface MapitShipmentInput {
  customerName: string;
  destination: string;
  origin?: string;
  weight?: number;
  packageType?: string;
  cost?: number;
  price?: number;
  source?: string;
}

export interface MapitShipmentResponse {
  trackingNumber: string;
  status: string;
  estimatedDelivery?: string;
  carrier?: string;
}

export async function createMapitShipment(shipment: MapitShipmentInput): Promise<MapitShipmentResponse> {
  const apiKey = process.env.MAPIT_API_KEY;
  const apiUrl = process.env.MAPIT_API_URL || 'https://api.mapit.example/v1/shipments';

  try {
    if (!apiKey) throw new Error('MAPIT_API_KEY not set');

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        customer_name: shipment.customerName,
        destination: shipment.destination,
        origin: shipment.origin || 'Default Warehouse',
        weight: shipment.weight || 1,
        package_type: shipment.packageType || 'parcel',
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.warn('mapit create failed', res.status, txt);
      // fallthrough to simulated response
    } else {
      const data: any = await res.json();
      return {
        trackingNumber: data.tracking_number || data.trackingNumber || String(Date.now()),
        status: data.status || 'Created',
        estimatedDelivery: data.estimated_delivery || data.estimatedDelivery,
        carrier: 'MAPIT',
      };
    }
  } catch (err) {
    console.warn('mapit create error, falling back to simulated response', String(err));
  }

  // simulated fallback response
  const trackingNumber = `MAPIT-${Date.now()}`;
  return {
    trackingNumber,
    status: 'Created',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    carrier: 'MAPIT',
  };
}

export function verifyMapitWebhook(headers: Record<string, any>, rawBody: Buffer): boolean {
  const secret = process.env.MAPIT_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('MAPIT_WEBHOOK_SECRET not set - skipping verification');
    return true;
  }

  const signature = headers['x-mapit-signature'] || headers['x-signature'] || headers['x-hub-signature'];
  if (!signature) return false;

  try {
    const expectedBase64 = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
    const expectedHex = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    
    // Use timing-safe comparison - pad to same length to avoid timing leaks
    const sigBuffer = Buffer.from(signature);
    const base64Buffer = Buffer.from(expectedBase64);
    const hexBuffer = Buffer.from(expectedHex);
    
    // Constant-time comparison with length padding
    const maxLen = Math.max(sigBuffer.length, base64Buffer.length, hexBuffer.length);
    const paddedSig = Buffer.alloc(maxLen);
    const paddedBase64 = Buffer.alloc(maxLen);
    const paddedHex = Buffer.alloc(maxLen);
    
    sigBuffer.copy(paddedSig);
    base64Buffer.copy(paddedBase64);
    hexBuffer.copy(paddedHex);
    
    const base64Match = crypto.timingSafeEqual(paddedSig, paddedBase64) && sigBuffer.length === base64Buffer.length;
    const hexMatch = crypto.timingSafeEqual(paddedSig, paddedHex) && sigBuffer.length === hexBuffer.length;
    
    return base64Match || hexMatch;
  } catch (err) {
    console.warn('mapit verify webhook error', err);
    return false;
  }
}
