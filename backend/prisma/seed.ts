import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const colors = [
  { colorName: 'Matte Black', colorHex: '#111111', priceDelta: 0, skuSuffix: 'BLK' },
  { colorName: 'Sand', colorHex: '#F5F0E8', priceDelta: 0, skuSuffix: 'SND' },
  { colorName: 'Midnight', colorHex: '#1E3A5F', priceDelta: 20, skuSuffix: 'MID' },
  { colorName: 'Silver', colorHex: '#E8E8EA', priceDelta: 15, skuSuffix: 'SLV' },
] as const;

const products = [
  {
    slug: 'nova-h1',
    name: 'NOVA H1 Wireless Headphones',
    tagline: 'Studio clarity. All-day comfort.',
    description:
      'The NOVA H1 delivers reference-grade wireless listening with adaptive ANC, a 40mm graphene driver, and a featherlight titanium frame built for marathon sessions.',
    basePrice: 349,
    modelUrl: '/models/nova-h1.glb',
    specsJson: {
      drivers: '40mm graphene dynamic',
      battery: '40 hours (ANC on), 55 hours (ANC off)',
      weight: '252 g',
      connectivity: 'Bluetooth 5.3, multipoint, aptX Adaptive / AAC / SBC',
      anc: 'Hybrid adaptive ANC with transparency mode',
      charging: 'USB-C fast charge (10 min = 5 hrs)',
      microphone: '6-mic beamforming array',
      waterproof: 'IPX4',
    },
    embedText: [
      'NOVA H1 Wireless Headphones are premium over-ear headphones from NOVA Audio.',
      'Base price $349. Color options: Matte Black, Sand, Midnight (+$20), Silver (+$15).',
      '40mm graphene drivers deliver studio-grade clarity with deep, controlled bass.',
      'Hybrid adaptive active noise cancellation with transparency mode for awareness.',
      'Battery life up to 40 hours with ANC on, 55 hours with ANC off; USB-C fast charging.',
      'Bluetooth 5.3 multipoint supports aptX Adaptive, AAC, and SBC codecs.',
      'Weighs 252 grams with a titanium frame for all-day comfort.',
      'Six-mic beamforming array for clear calls; IPX4 splash resistance.',
      'Ideal for commuting, remote work, travel, and critical listening.',
    ].join(' '),
    media: [
      { url: '/images/h1-hero.jpg', kind: 'image', sortOrder: 0 },
      { url: '/images/h1-detail.jpg', kind: 'image', sortOrder: 1 },
    ],
    skuPrefix: 'H1',
  },
  {
    slug: 'nova-s1',
    name: 'NOVA S1 Portable Speaker',
    tagline: 'Room-filling sound. Pocket-friendly.',
    description:
      'The NOVA S1 packs a dual-driver stereo pair and passive radiator into a rugged aluminum shell—party-ready outdoors, refined indoors, with 24-hour playtime.',
    basePrice: 249,
    modelUrl: '/models/nova-s1.glb',
    specsJson: {
      drivers: 'Dual 50mm full-range + passive radiator',
      battery: '24 hours playback',
      weight: '680 g',
      connectivity: 'Bluetooth 5.3, stereo pair / party mode',
      waterproof: 'IP67 dust and water resistant',
      charging: 'USB-C (full charge ~2.5 hrs)',
      power: '40W peak output',
      microphone: 'Built-in speakerphone mic',
    },
    embedText: [
      'NOVA S1 Portable Speaker is a premium Bluetooth speaker from NOVA Audio.',
      'Base price $249. Color options: Matte Black, Sand, Midnight (+$20), Silver (+$15).',
      'Dual 50mm full-range drivers with a passive radiator deliver 40W peak stereo sound.',
      'IP67 dust and water resistance for beach, poolside, and outdoor use.',
      '24-hour battery life with USB-C charging in about 2.5 hours.',
      'Bluetooth 5.3 with stereo pairing and party mode for multi-speaker setups.',
      'Weighs 680 grams with a durable aluminum shell.',
      'Built-in speakerphone microphone for hands-free calls.',
      'Ideal for travel, outdoor gatherings, and home listening.',
    ].join(' '),
    media: [
      { url: '/images/s1-hero.jpg', kind: 'image', sortOrder: 0 },
      { url: '/images/s1-lifestyle.jpg', kind: 'image', sortOrder: 1 },
    ],
    skuPrefix: 'S1',
  },
  {
    slug: 'nova-buds',
    name: 'NOVA Buds Pro',
    tagline: 'Spatial audio. Invisible comfort.',
    description:
      'NOVA Buds Pro combine custom 11mm dual-magnet drivers, adaptive ANC, and spatial audio in a low-profile stem design with wireless charging case.',
    basePrice: 179,
    modelUrl: '/models/nova-buds.glb',
    specsJson: {
      drivers: '11mm dual-magnet dynamic',
      battery: '8 hours buds / 32 hours with case',
      weight: '5.2 g per bud',
      connectivity: 'Bluetooth 5.3, LE Audio ready',
      anc: 'Adaptive ANC + transparency',
      charging: 'USB-C + Qi wireless case',
      spatial: 'Head-tracked spatial audio',
      waterproof: 'IP54 buds / IPX4 case',
    },
    embedText: [
      'NOVA Buds Pro are premium true wireless earbuds from NOVA Audio.',
      'Base price $179. Color options: Matte Black, Sand, Midnight (+$20), Silver (+$15).',
      'Custom 11mm dual-magnet drivers with head-tracked spatial audio.',
      'Adaptive active noise cancellation and transparency mode.',
      '8 hours of bud battery, 32 hours total with the charging case.',
      'USB-C and Qi wireless charging; Bluetooth 5.3 LE Audio ready.',
      'Each bud weighs 5.2 grams; IP54 buds and IPX4 case rating.',
      'Ideal for workouts, commuting, calls, and immersive media.',
    ].join(' '),
    media: [
      { url: '/images/buds-hero.jpg', kind: 'image', sortOrder: 0 },
      { url: '/images/buds-case.jpg', kind: 'image', sortOrder: 1 },
    ],
    skuPrefix: 'BUDS',
  },
] as const;

async function main() {
  const adminHash = await bcrypt.hash('Admin123!', 10);
  const demoHash = await bcrypt.hash('Demo123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@nova.audio' },
    update: { passwordHash: adminHash, name: 'NOVA Admin', role: Role.ADMIN },
    create: {
      email: 'admin@nova.audio',
      passwordHash: adminHash,
      name: 'NOVA Admin',
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'demo@nova.audio' },
    update: { passwordHash: demoHash, name: 'Demo Customer', role: Role.CUSTOMER },
    create: {
      email: 'demo@nova.audio',
      passwordHash: demoHash,
      name: 'Demo Customer',
      role: Role.CUSTOMER,
    },
  });

  for (const product of products) {
    const { media, skuPrefix, ...productData } = product;

    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: productData.name,
        tagline: productData.tagline,
        description: productData.description,
        basePrice: productData.basePrice,
        specsJson: productData.specsJson,
        modelUrl: productData.modelUrl,
        embedText: productData.embedText,
        published: true,
      },
      create: {
        ...productData,
        published: true,
      },
    });

    await prisma.variant.deleteMany({ where: { productId: created.id } });
    await prisma.productMedia.deleteMany({ where: { productId: created.id } });

    await prisma.variant.createMany({
      data: colors.map((c) => ({
        productId: created.id,
        sku: `${skuPrefix}-${c.skuSuffix}`,
        colorName: c.colorName,
        colorHex: c.colorHex,
        priceDelta: c.priceDelta,
        stock: 100,
      })),
    });

    await prisma.productMedia.createMany({
      data: media.map((m) => ({
        productId: created.id,
        url: m.url,
        kind: m.kind,
        sortOrder: m.sortOrder,
      })),
    });
  }

  console.log('Seed complete: 3 products, admin@nova.audio, demo@nova.audio');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
