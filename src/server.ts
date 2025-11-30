import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ModeSwitcher } from '../services/automatic/modeSwitcher';
import { verifyMapitWebhook } from '../services/providers/mapit';
import { prisma } from './prismaClient';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const modeSwitcher = new ModeSwitcher();

app.post('/api/process-message', async (req, res) => {
  try {
    const { message, channel, user } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });
    const result = await modeSwitcher.processMessageAuto(message, channel || 'whatsapp', user || {});

    // If result contains shipment and payment link, persist minimal record
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
        source: s.source || channel || 'whatsapp',
        createdAt: new Date()
      }});
    }

    return res.json(result);
  } catch (err: any) {
    console.error('process-message error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

app.post('/api/providers/mapit/webhook', async (req, res) => {
  try {
    const ok = verifyMapitWebhook(req);
    if (!ok) {
      console.warn('Mapit webhook verification failed', req.headers);
      return res.status(401).json({ ok: false, message: 'invalid webhook signature' });
    }

    const payload = req.body;
    console.log('Mapit webhook payload:', payload);

    // Update shipment by trackingNumber if present
    if (payload && payload.trackingNumber) {
      await prisma.shipment.updateMany({ where: { trackingNumber: payload.trackingNumber }, data: { status: payload.status } });
    }

    return res.json({ ok: true });
  } catch (err: any) {
    console.error('mapit webhook error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

app.post('/api/providers/mapit/create', async (req, res) => {
  try {
    const shipment = req.body.shipment;
    if (!shipment) return res.status(400).json({ error: 'shipment required' });

    const { createMapitShipment } = await import('../services/providers/mapit');
    const mapitRes = await createMapitShipment(shipment);

    // Persist created shipment minimal
    if (mapitRes && mapitRes.trackingNumber) {
      await prisma.shipment.create({ data: {
        trackingNumber: mapitRes.trackingNumber,
        carrier: 'MAPIT',
        status: mapitRes.status || 'Created',
        customerName: shipment.customerName || 'Unknown',
        destination: shipment.destination || 'Unknown',
        cost: shipment.cost || 0,
        price: shipment.price || 0,
        source: shipment.source || 'api',
        createdAt: new Date()
      }});
    }

    return res.json({ ok: true, mapitRes });
  } catch (err: any) {
    console.error('create mapit shipment error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

app.post('/api/payment/webhook', async (req, res) => {
  try {
    // For Moyasar: verify signature if provided; here we use PAYMENT_GATEWAY_WEBHOOK_SECRET
    const event = req.body;
    console.log('payment webhook', event);

    // Example: if event contains metadata.trackingNumber
    const tracking = event?.data?.metadata?.trackingNumber || event?.metadata?.trackingNumber;
    if (tracking) {
      // mark shipment as Paid
      await prisma.shipment.updateMany({ where: { trackingNumber: tracking }, data: { status: 'Paid' } });
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
