import express from 'express';
import cors from 'cors';
import { ModeSwitcher } from '../services/automatic/modeSwitcher.js';
import { verifyMapitWebhook } from '../services/providers/mapit.js';
import { createMyfatoraPayment, verifyMyfatoraWebhook } from '../services/providers/myfatora.js';
import { prisma } from './prismaClient.js';
import { sendNotification } from '../services/notifications/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));

// keep rawBody for webhooks
app.use(express.json({
  verify: (req: any, _res, buf: Buffer) => {
    req.rawBody = buf;
  }
}));

const modeSwitcher = new ModeSwitcher();

app.post('/api/process-message', async (req, res) => {
  try {
    const { message, channel, user } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });
    const result = await modeSwitcher.processMessageAuto(message, channel || 'whatsapp', user || {});

    if (result && result.shipment) {
      const s = result.shipment;
      await prisma.shipment.create({ data: {
        trackingNumber: s.trackingNumber || s.id,
        carrier: s.carrier || 'MAPT',
        status: s.status || 'Created',
        customerName: s.customerName || 'Unknown',
        destination: s.destination || 'Unknown',
        cost: s.cost || 0,
        price: s.price || 0,
        source: s.source || channel || 'whatsapp'
      }});
    }

    return res.json(result);
  } catch (err: any) {
    console.error('process-message error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

// Mapit webhook (use raw parser)
app.post('/api/providers/mapit/webhook', express.raw({ type: 'application/json' }), async (req: any, res) => {
  try {
    const raw = req.body as Buffer;
    const ok = verifyMapitWebhook(req.headers as Record<string,string>, raw);
    if (!ok) {
      console.warn('Mapit webhook verification failed', req.headers);
      return res.status(401).json({ ok: false, message: 'invalid webhook signature' });
    }

    const payload = JSON.parse(raw.toString('utf8'));
    console.log('Mapit webhook payload:', payload);

    if (payload && payload.trackingNumber) {
      await prisma.shipment.updateMany({ where: { trackingNumber: payload.trackingNumber }, data: { status: payload.status } });
    }

    return res.json({ ok: true });
  } catch (err: any) {
    console.error('mapit webhook error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

// Create shipment via Mapit provider
app.post('/api/providers/mapit/create', async (req, res) => {
  try {
    const shipment = req.body.shipment;
    if (!shipment) return res.status(400).json({ error: 'shipment required' });

    const { createMapitShipment } = await import('../services/providers/mapit.js');
    const mapitRes = await createMapitShipment(shipment);

    if (mapitRes && mapitRes.trackingNumber) {
      await prisma.shipment.create({ data: {
        trackingNumber: mapitRes.trackingNumber,
        carrier: 'MAPIT',
        status: mapitRes.status || 'Created',
        customerName: shipment.customerName || 'Unknown',
        destination: shipment.destination || 'Unknown',
        cost: shipment.cost || 0,
        price: shipment.price || 0,
        source: shipment.source || 'api'
      }});
    }

    return res.json({ ok: true, mapitRes });
  } catch (err: any) {
    console.error('create mapit shipment error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// Create payment (MyFatora)
app.post('/api/payment/create', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;
    if (!amount || !currency) return res.status(400).json({ error: 'amount and currency required' });

    const paymentRes = await createMyfatoraPayment({ amount, currency, metadata });

    // Persist minimal payment record if provider returned id
    if (paymentRes && paymentRes.providerId) {
      await prisma.payment.create({ data: {
        provider: 'MYFATORA',
        providerId: paymentRes.providerId,
        amount: paymentRes.amount || Number(amount),
        currency: paymentRes.currency || currency,
        status: paymentRes.status || 'created',
        metadata: typeof (paymentRes.metadata || metadata) === 'string' 
          ? (paymentRes.metadata || metadata) 
          : JSON.stringify(paymentRes.metadata || metadata || {}),
      }});
    }

    return res.json({ ok: true, payment: paymentRes });
  } catch (err: any) {
    console.error('create payment error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// Send payment link to user via chosen channel
app.post('/api/payment/send-link', async (req, res) => {
  try {
    const { trackingNumber, channel, contact } = req.body;
    if (!trackingNumber || !channel || !contact) return res.status(400).json({ error: 'trackingNumber, channel and contact required' });

    // create payment for shipment
    const shipment = await prisma.shipment.findFirst({ where: { trackingNumber } });
    if (!shipment) return res.status(404).json({ error: 'shipment not found' });

    const amount = shipment.price || shipment.cost || 0;
    const currency = 'SAR';

    const paymentRes = await createMyfatoraPayment({ amount, currency, metadata: { trackingNumber } });
    const paymentUrl = paymentRes?.paymentUrl || paymentRes?.url || paymentRes?.checkoutUrl;

    // persist payment
    if (paymentRes && paymentRes.providerId) {
      await prisma.payment.create({ data: {
        provider: 'MYFATORA',
        providerId: paymentRes.providerId,
        amount: Number(amount),
        currency,
        status: paymentRes.status || 'created',
        trackingNumber,
        channel,
        contact,
        metadata: JSON.stringify({ trackingNumber, channel, contact })
      }});
    }

    // send via notifications
    const message = `رابط دفع الشحنة ${trackingNumber}: ${paymentUrl}`;
    await sendNotification(channel, contact, message, { trackingNumber, paymentUrl });

    return res.json({ ok: true, paymentUrl });
  } catch (err: any) {
    console.error('send payment link error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// Payment webhook (MyFatora)
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), async (req: any, res) => {
  try {
    const raw = req.body as Buffer;
    const headers = req.headers as Record<string,string>;

    const ok = verifyMyfatoraWebhook(headers, raw);
    if (!ok) {
      console.warn('Payment webhook verification failed', headers);
      return res.status(401).json({ ok: false, message: 'invalid webhook signature' });
    }

    const event = JSON.parse(raw.toString('utf8'));
    console.log('payment webhook', event);

    const providerId = event?.data?.id || event?.id;
    const tracking = event?.data?.metadata?.trackingNumber || event?.metadata?.trackingNumber;
    const status = event?.data?.status || event?.status || 'unknown';

    if (providerId) {
      await prisma.payment.updateMany({ where: { providerId }, data: { status, metadata: JSON.stringify(event?.data?.metadata || {}) } });
    }

    if (tracking && status === 'paid') {
      // mark shipment as Paid and send shipping document automatically
      await prisma.shipment.updateMany({ where: { trackingNumber: tracking }, data: { status: 'Paid' } });

      // find related contacts from payments using indexed trackingNumber column
      const payment = await prisma.payment.findFirst({ where: { trackingNumber: tracking } });
      if (payment && payment.channel && payment.contact) {
        const shipment = await prisma.shipment.findFirst({ where: { trackingNumber: tracking } });
        const docLink = `https://your-cdn.example.com/shipping-docs/${tracking}.pdf`;
        const message = `تم استلام الدفعة لرقم الشحنة ${tracking}. يمكنك تنزيل بوليصتك: ${docLink}`;
        await sendNotification(payment.channel, payment.contact, message, { shipment, docLink });
      }
    }

    return res.json({ ok: true });
  } catch (err: any) {
    console.error('payment webhook error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

app.get('/api/shipments', async (req, res) => {
  const list = await prisma.shipment.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(list);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
