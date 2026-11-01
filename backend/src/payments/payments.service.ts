import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { serializeOrder } from '../common/serialize.js';

@Injectable()
export class PaymentsService {
  private stripe: Stripe | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    if (key) {
      this.stripe = new Stripe(key);
    }
  }

  private getClient() {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured (STRIPE_SECRET_KEY missing)');
    }
    return this.stripe;
  }

  async createPaymentIntent(input: {
    email: string;
    name?: string;
    total: number;
    itemsJson: unknown;
    userId?: string;
  }) {
    const stripe = this.getClient();
    const amountCents = Math.round(Number(input.total) * 100);
    if (!Number.isFinite(amountCents) || amountCents < 50) {
      throw new BadRequestException('Invalid amount');
    }

    const order = await this.prisma.order.create({
      data: {
        email: input.email.toLowerCase(),
        total: input.total,
        itemsJson: input.itemsJson as Prisma.InputJsonValue,
        userId: input.userId ?? null,
        status: 'PENDING',
      },
    });

    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      receipt_email: input.email,
      metadata: {
        orderId: order.id,
        customerName: input.name ?? '',
      },
    });

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      order: serializeOrder(order),
    };
  }

  async confirmOrder(paymentIntentId: string) {
    const stripe = this.getClient();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const orderId = intent.metadata?.orderId;
    if (!orderId) {
      throw new BadRequestException('Payment intent missing order metadata');
    }

    if (intent.status !== 'succeeded') {
      throw new BadRequestException(`Payment not succeeded (${intent.status})`);
    }

    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });
    return serializeOrder(order);
  }
}
