import { Shipment } from '../../types';

interface INlpEngine {
  detectIntent(text: string): Promise<{ intent: string; confidence: number }>; 
  extractEntities(text: string): Promise<Record<string, any>>; 
}

interface IDecisionMaker {
  chooseProvider(shipmentData: Partial<Shipment>): Promise<string>; 
}

class DummyNlpEngine implements INlpEngine {
  async detectIntent(text: string) {
    const m = text.toLowerCase();
    if (/(شحن|ابعث|أرسل|ارسال)/.test(m)) return { intent: 'create_shipment', confidence: 0.9 };
    if (/(تتبع|track|رقم التتبع)/.test(m)) return { intent: 'track_shipment', confidence: 0.9 };
    if (/(الغاء|إلغاء|cancel)/.test(m)) return { intent: 'cancel_shipment', confidence: 0.9 };
    return { intent: 'unknown', confidence: 0.5 };
  }

  async extractEntities(text: string) {
    const entities: Record<string, any> = {};

    const weightMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|كجم|كيلو|كيلوغرام)?/i);
    if (weightMatch) entities.weight = parseFloat(weightMatch[1].replace(',', '.'));

    const fromMatch = text.match(/من\s+([^\n,\.؟!]+)/i);
    if (fromMatch) entities.origin = fromMatch[1].trim();

    const toMatch = text.match(/(?:إلى|الى|لـ|ل)\s+([^\n,\.؟!]+)/i);
    if (toMatch) entities.destination = toMatch[1].trim();

    if (/هدية|هديه/.test(text)) entities.packageType = 'gift';
    else if (/وثائق|اوراق|وثيقه/.test(text)) entities.packageType = 'documents';
    else if (/صندوق|طرد|package|parcel/.test(text)) entities.packageType = 'parcel';

    const nameMatch = text.match(/(?:اسمي|أنا|اسمي هو)\s+([^\n,\.؟!]+)/i);
    if (nameMatch) entities.customerName = nameMatch[1].trim();

    return entities;
  }
}

class DummyDecisionMaker implements IDecisionMaker {
  async chooseProvider(_shipmentData: Partial<Shipment>) {
    return 'AUTO_PROVIDER';
  }
}

export class AIProcessor {
  private nlp: INlpEngine;
  private decisionMaker: IDecisionMaker;

  constructor(opts?: { nlpEngine?: INlpEngine; decisionMaker?: IDecisionMaker }) {
    this.nlp = opts?.nlpEngine ?? new DummyNlpEngine();
    this.decisionMaker = opts?.decisionMaker ?? new DummyDecisionMaker();
  }

  async processAutomaticRequest(userMessage: string, userContext: any = {}) {
    try {
      const intentRes = await this.nlp.detectIntent(userMessage);
      const entities = await this.nlp.extractEntities(userMessage);

      const intent = intentRes.intent;
      const confidence = intentRes.confidence ?? 0.0;

      if (intent === 'create_shipment') {
        return await this.autoCreateShipment(entities, userContext, confidence);
      } else if (intent === 'track_shipment') {
        return await this.autoTrackShipment(entities, userContext, confidence);
      } else if (intent === 'cancel_shipment') {
        return await this.autoCancelShipment(entities, userContext, confidence);
      }

      return { type: 'unhandled', message: 'Intent not supported', auto_processed: false, confidence };
    } catch (err: any) {
      return { type: 'error', message: 'Internal processing error', error: err?.message || String(err), auto_processed: false, confidence: 0 };
    }
  }

  private hasSufficientData(entities: Record<string, any>): boolean {
    return !!(entities.origin && entities.destination && entities.weight && entities.packageType);
  }

  private findMissingData(entities: Record<string, any>): string[] {
    const required = ['origin', 'destination', 'weight', 'packageType'];
    return required.filter((k) => !entities[k]);
  }

  private async autoCreateShipment(entities: Record<string, any>, _userContext: any, confidenceOverride = 0.0) {
    if (this.hasSufficientData(entities)) {
      const provider = await this.decisionMaker.chooseProvider(entities as Partial<Shipment>);
      const shipment = await this.createShipmentImmediately(entities, provider);
      const paymentLink = await this.generatePaymentAuto(shipment);

      return {
        type: 'immediate_creation',
        message: '✅ تم إنشاء الشحنة تلقائياً!',
        shipment,
        payment_link: paymentLink,
        auto_processed: true,
        confidence: Math.max(0.8, confidenceOverride)
      };
    }

    const missing = this.findMissingData(entities);
    return {
      type: 'need_clarification',
      message: 'أحتاج بعض المعلومات الإضافية:',
      missing_fields: missing,
      auto_processed: false,
      confidence: confidenceOverride
    };
  }

  private async createShipmentImmediately(entities: Record<string, any>, provider: string) {
    const id = 'AUTO-' + Date.now();
    const shipment: Shipment = {
      id,
      trackingNumber: id,
      carrierTracking: '',
      carrier: (provider as any) ?? ('AUTO' as any),
      status: (('Created') as any),
      customerName: entities.customerName ?? 'Unknown',
      destination: (entities.destination ?? entities.location) ?? 'Unknown',
      cost: entities.cost ?? 0,
      price: entities.price ?? 0,
      source: (entities.source ?? 'WhatsApp') as any,
      date: new Date().toISOString()
    };

    return shipment;
  }

  private async generatePaymentAuto(shipment: Shipment) {
    return `https://pay.example.com/${encodeURIComponent(shipment.id)}`;
  }

  private async autoTrackShipment(entities: Record<string, any>, _ctx: any, _confidence = 0.0) {
    return { type: 'track', message: 'نتيجة تتبع (تجريبي)', auto_processed: true, details: entities };
  }

  private async autoCancelShipment(entities: Record<string, any>, _ctx: any, _confidence = 0.0) {
    return { type: 'cancel', message: 'تم إلغاء الشحنة (تجريبي)', auto_processed: true, details: entities };
  }
}