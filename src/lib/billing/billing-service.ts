import { getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export interface BillingItem {
  id: string;
  type: 'consultation' | 'prescription' | 'test' | 'procedure';
  description: string;
  amount: number;
  currency: string;
  patientId: string;
  doctorId: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    coverage: number;
  };
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  paidAt?: Date;
}

export class BillingService {
  private db = getFirestore();

  async createBillingItem(data: Omit<BillingItem, 'id' | 'status' | 'createdAt'>): Promise<BillingItem> {
    const billingItem: BillingItem = {
      ...data,
      id: this.generateBillingId(),
      status: 'pending',
      createdAt: new Date(),
    };

    await this.db.collection('billing_items').doc(billingItem.id).set(billingItem);
    return billingItem;
  }

  async processPayment(billingItemId: string, paymentMethod: string): Promise<void> {
    const billingItem = await this.getBillingItem(billingItemId);
    if (!billingItem) {
      throw new Error('Billing item not found');
    }

    try {
      // Calculate amount after insurance
      const finalAmount = this.calculateFinalAmount(billingItem);

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: billingItem.currency,
        payment_method: paymentMethod,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      if (paymentIntent.status === 'succeeded') {
        await this.updateBillingStatus(billingItemId, 'paid');
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      await this.updateBillingStatus(billingItemId, 'failed');
      throw error;
    }
  }

  private async getBillingItem(id: string): Promise<BillingItem | null> {
    const doc = await this.db.collection('billing_items').doc(id).get();
    return doc.exists ? (doc.data() as BillingItem) : null;
  }

  private async updateBillingStatus(
    id: string,
    status: BillingItem['status'],
    paidAt?: Date
  ): Promise<void> {
    await this.db.collection('billing_items').doc(id).update({
      status,
      ...(status === 'paid' ? { paidAt: paidAt || new Date() } : {}),
    });
  }

  private calculateFinalAmount(billingItem: BillingItem): number {
    if (!billingItem.insuranceInfo) {
      return billingItem.amount;
    }

    const coverageAmount = (billingItem.amount * billingItem.insuranceInfo.coverage) / 100;
    return billingItem.amount - coverageAmount;
  }

  private generateBillingId(): string {
    return `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async generateInvoice(billingItemId: string): Promise<Buffer> {
    // Implement PDF generation logic here
    throw new Error('Not implemented');
  }
}
