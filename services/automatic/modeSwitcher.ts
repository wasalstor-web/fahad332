import { AIProcessor } from './aiProcessor.js';
import { Shipment } from '../../types.js';

export class ModeSwitcher {
  private aiProcessor: AIProcessor;
  private mode: 'auto' | 'manual' = 'auto';

  constructor() {
    this.aiProcessor = new AIProcessor();
  }

  setMode(mode: 'auto' | 'manual') {
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }

  async processMessageAuto(
    message: string,
    channel: string,
    userContext: any = {}
  ): Promise<{
    reply?: string;
    shipment?: Partial<Shipment>;
    paymentLink?: string;
    auto_processed?: boolean;
    type?: string;
    missing_fields?: string[];
  }> {
    try {
      if (this.mode === 'manual') {
        return {
          type: 'manual',
          reply: 'Manual mode is active. Please use dashboard to create shipments.',
          auto_processed: false,
        };
      }

      const result = await this.aiProcessor.processAutomaticRequest(message, { ...userContext, channel });

      if (result.type === 'immediate_creation' && result.shipment) {
        return {
          type: result.type,
          reply: result.message,
          shipment: result.shipment,
          paymentLink: result.payment_link,
          auto_processed: true,
        };
      }

      if (result.type === 'need_clarification') {
        return {
          type: result.type,
          reply: result.message,
          missing_fields: result.missing_fields,
          auto_processed: false,
        };
      }

      return {
        type: result.type,
        reply: result.message,
        auto_processed: result.auto_processed,
      };
    } catch (err: any) {
      console.error('ModeSwitcher processMessageAuto error:', err);
      return {
        type: 'error',
        reply: 'حدث خطأ في معالجة الرسالة. يرجى المحاولة مرة أخرى.',
        auto_processed: false,
      };
    }
  }
}
