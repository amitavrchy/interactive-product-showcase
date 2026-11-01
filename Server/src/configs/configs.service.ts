import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateConfigDto } from './dto/create-config.dto.js';

@Injectable()
export class ConfigsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateConfigDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.savedConfig.create({
      data: {
        userId,
        productId: dto.productId,
        configJson: dto.configJson as Prisma.InputJsonValue,
      },
    });
  }

  async findByShareCode(shareCode: string) {
    const config = await this.prisma.savedConfig.findUnique({
      where: { shareCode },
    });
    if (!config) throw new NotFoundException('Config not found');
    return config;
  }
}
