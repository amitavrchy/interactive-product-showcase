import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serializeProduct } from '../common/serialize.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

const productInclude = {
  variants: true,
  media: { orderBy: { sortOrder: 'asc' as const } },
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const products = await this.prisma.product.findMany({
      where: { published: true },
      include: productInclude,
      orderBy: { createdAt: 'asc' },
    });
    return products.map(serializeProduct);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });
    if (!product || !product.published) {
      throw new NotFoundException(`Product "${slug}" not found`);
    }
    return serializeProduct(product);
  }

  async create(dto: CreateProductDto) {
    const { variants, media, specsJson, ...data } = dto;
    const product = await this.prisma.product.create({
      data: {
        ...data,
        specsJson: specsJson as Prisma.InputJsonValue,
        variants: variants?.length
          ? { create: variants.map((v) => ({ ...v, priceDelta: v.priceDelta ?? 0 })) }
          : undefined,
        media: media?.length ? { create: media } : undefined,
      },
      include: productInclude,
    });
    return serializeProduct(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Product "${id}" not found`);

    const { variants, media, specsJson, ...data } = dto;

    const product = await this.prisma.$transaction(async (tx) => {
      if (variants) {
        await tx.variant.deleteMany({ where: { productId: id } });
      }
      if (media) {
        await tx.productMedia.deleteMany({ where: { productId: id } });
      }

      return tx.product.update({
        where: { id },
        data: {
          ...data,
          ...(specsJson !== undefined
            ? { specsJson: specsJson as Prisma.InputJsonValue }
            : {}),
          ...(variants
            ? {
                variants: {
                  create: variants.map((v) => ({
                    ...v,
                    priceDelta: v.priceDelta ?? 0,
                  })),
                },
              }
            : {}),
          ...(media ? { media: { create: media } } : {}),
        },
        include: productInclude,
      });
    });

    return serializeProduct(product);
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Product "${id}" not found`);
    await this.prisma.product.delete({ where: { id } });
    return { deleted: true, id };
  }
}
