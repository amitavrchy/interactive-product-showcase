import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serializeOrder } from '../common/serialize.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId?: string) {
    const order = await this.prisma.order.create({
      data: {
        email: dto.email.toLowerCase(),
        total: dto.total,
        itemsJson: dto.itemsJson as Prisma.InputJsonValue,
        userId: userId ?? null,
      },
    });
    return serializeOrder(order);
  }

  async findMine(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(serializeOrder);
  }
}
