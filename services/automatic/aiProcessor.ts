export class AIProcessor {
  aiEnabled = true;

  async processAutomaticRequest(userMessage: string, userContext: any): Promise<any> {
    const intent = await this.detectIntent(userMessage);
    const entities = await this.extractEntities(userMessage);

    if (intent === 'create_shipment') {
      return await this.autoCreateShipment(entities, userContext);
    } else if (intent === 'track_shipment') {
      return await this.autoTrackShipment(entities, userContext);
    } else if (intent === 'cancel_shipment') {
      return await this.autoCancelShipment(entities, userContext);
    }

    return { type: 'unhandled', message: 'Intent not supported', auto_processed: false };
  }

  async detectIntent(message: string): Promise<string> {
    const m = message.toLowerCase();
    if (m.includes('شحن') || m.includes('ابعث') || m.includes('ارسال') || m.includes('أرسل')) return 'create_shipment';
    if (m.includes('تتبع') || m.includes('track') || m.includes('رقم التتبع')) return 'track_shipment';
    if (m.includes('الغاء') || m.includes('إلغاء') || m.includes('cancel')) return 'cancel_shipment';
    return 'unknown';
  }

  async extractEntities(message: string): Promise<any> {
    const entities: any = {};
    const numMatch = message.match(/(\d+(?:\.\d+)?)\s*(kg|كيلو|كيلو|كجم)?/i);
    if (numMatch) entities.weight = parseFloat(numMatch[1]);

    const cityMatch = message.match(/(الى|إلى|من)\s+([\u0621-\u064A\u0620-\u06FFa-zA-Z\s]+)/i);
    if (cityMatch) {
      entities.location = cityMatch[2].trim();
    }

    return entities;
  }

  hasSufficientData(entities: any): boolean {
    return !!(entities.origin && entities.destination && entities.weight && entities.packageType);
  }

  findMissingData(entities: any): string[] {
    const required = ['origin', 'destination', 'weight', 'packageType'];
    return required.filter(k => !entities[k]);
  }

  async autoCreateShipment(entities: any, userContext: any): Promise<any> {
    if (this.hasSufficientData(entities)) {
      const shipment = await this.createShipmentImmediately(entities);
      const paymentLink = await this.generatePaymentAuto(shipment);

      return {
        type: 'immediate_creation',
        message: '✅ تم إنشاء الشحنة تلقائياً!',
        shipment,
        payment_link: paymentLink,
        auto_processed: true,
        confidence: 0.95
      };
    }

    const missing = this.findMissingData(entities);
    return {
      type: 'need_clarification',
      message: 'أحتاج بعض المعلومات الإضافية:',
      missing_fields: missing,
      auto_processed: false,
      confidence: 0.6
    };
  }

  async createShipmentImmediately(entities: any): Promise<any> {
    const id = 'AUTO-' + Date.now();
    return {
      id,
      trackingNumber: id,
      carrierTracking: '',
      carrier: 'AUTO',
      status: 'Created',
      customerName: entities.customerName || 'Unknown',
      destination: entities.destination || entities.location || 'Unknown',
      cost: entities.cost || 0,
      price: entities.price || 0,
      source: 'WhatsApp',
      date: new Date().toISOString()
    };
  }

  async generatePaymentAuto(shipment: any): Promise<string> {
    return `https://pay.example.com/${shipment.id}`;
  }

  async autoTrackShipment(entities: any): Promise<any> {
    return { type: 'track', message: 'نتيجة تتبع (اختباري)', auto_processed: true, details: entities };
  }

  async autoCancelShipment(entities: any): Promise<any> {
    return { type: 'cancel', message: 'تم إلغاء الشحنة (اختباري)', auto_processed: true, details: entities };
  }
}