import { Decimal } from '@prisma/client/runtime/library';

export function toNumber(value: Decimal | number | string | null | undefined): number {
  if (value == null) return 0;
  return Number(value);
}

type VariantLike = {
  priceDelta: Decimal | number | string;
  [key: string]: unknown;
};

type ProductLike = {
  basePrice: Decimal | number | string;
  variants?: VariantLike[];
  [key: string]: unknown;
};

type OrderLike = {
  total: Decimal | number | string;
  [key: string]: unknown;
};

export function serializeProduct<T extends ProductLike>(product: T) {
  const specsJson = product.specsJson ?? product.specs;
  return {
    ...product,
    basePrice: toNumber(product.basePrice),
    specsJson,
    specs: specsJson,
    variants: product.variants?.map((v) => ({
      ...v,
      priceDelta: toNumber(v.priceDelta),
    })),
  };
}

export function serializeOrder<T extends OrderLike>(order: T) {
  return {
    ...order,
    total: toNumber(order.total),
  };
}
