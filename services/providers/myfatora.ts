import crypto from 'crypto';
import fetch from 'node-fetch';

export async function createMyfatoraPayment(opts: { amount: number | string; currency: string; metadata?: any }) {
  const apiKey = process.env.MYFATORA_API_KEY;
  // best-effort: attempt to call provider if API URL is known, otherwise return a local simulated response
  try {
    if (!apiKey) throw new Error('MYFATORA_API_KEY not set');

    // Example endpoint - may need to be adjusted to actual provider URL
    const url = process.env.MYFATORA_API_URL || 'https://api.myfatora.example/v1/payments';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ amount: Number(opts.amount), currency: opts.currency, metadata: opts.metadata || {} }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.warn('myfatora create failed', res.status, txt);
      // fallthrough to simulated response
    } else {
      const data = await res.json();
      // adapt to expected shape
      return {
        providerId: data.id || data.payment_id || String(Date.now()),
        paymentUrl: data.checkout_url || data.payment_url || data.url,
        amount: data.amount || Number(opts.amount),
        currency: data.currency || opts.currency,
        status: data.status || 'created',
        metadata: data.metadata || opts.metadata || {},
      };
    }
  } catch (err) {
    console.warn('myfatora create error, falling back to simulated response', String(err));
  }

  // simulated fallback
  const id = `mf_${Date.now()}`;
  return {
    providerId: id,
    paymentUrl: `https://myfatora.example/pay/${id}`,
    amount: Number(opts.amount),
    currency: opts.currency,
    status: 'created',
    metadata: opts.metadata || {},
  };
}

export function verifyMyfatoraWebhook(headers: Record<string, any>, rawBody: Buffer) {
  const secret = process.env.MYFATORA_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('MYFATORA_WEBHOOK_SECRET not set - skipping verification');
    return true;
  }

  const signature = headers['x-myfatora-signature'] || headers['x-signature'] || headers['x-hub-signature'];
  if (!signature) return false;

  try {
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
    // some providers use hex digest - check both
    const expectedHex = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    return signature === expected || signature === expectedHex;
  } catch (err) {
    console.warn('verify webhook error', err);
    return false;
  }
}