/**
 * Bhotika (भोटिका) — Seed data
 * Handcrafted Nepal clothing brand.
 * Images: Unsplash free-to-use photos of hemp, handmade, and Nepali-style clothing.
 */

const IMG = {
  // Hero & editorial — Himalayan / Nepali aesthetic
  hero:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
  hero2:      'https://images.unsplash.com/photo-1594938298603-c8148c4b4e0e?w=1920&q=80',
  editorial1: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=1200&q=80',
  editorial2: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
  editorial3: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80',
  editorial4: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',

  // Products — natural fabrics, earthy tones, artisan clothing
  p1:  'https://images.unsplash.com/photo-1594938298603-c8148c4b4e0e?w=800&q=80',  // linen/hemp shirt
  p2:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',  // natural fabric dress
  p3:  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',  // boho clothing
  p4:  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',  // artisan fashion
  p5:  'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80',  // ethnic jacket
  p6:  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',  // natural dress
  p7:  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',  // model fashion
  p8:  'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800&q=80',  // artisan top
  p9:  'https://images.unsplash.com/photo-1520367745676-56196632073f?w=800&q=80',  // handmade bag
  p10: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',  // woven bag
  p11: 'https://images.unsplash.com/photo-1611731483562-56b3e5b10e5e?w=800&q=80',  // jewelry
  p12: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',  // accessories
};

export const SITE = {
  announcement: '🇳🇵 Handcrafted in Nepal — FREE Delivery on orders over $100',
  hero: {
    headline: 'Himalayan Craftsmanship',
    cta: 'SHOP COLLECTION',
    ctaLink: '/shop',
    images: [IMG.hero, IMG.hero2],
  },
  editorial: [
    { image: IMG.editorial1, alt: 'Handcrafted with love' },
    { image: IMG.editorial2, alt: 'Wear the mountains' },
    { image: IMG.editorial3, alt: 'Artisan made in Nepal' },
    { image: IMG.editorial4, alt: 'Natural, sustainable, beautiful' },
  ],
  categories: [
    { slug: 'shop',      label: 'SHOP' },
    { slug: 'hemp',      label: 'HEMP' },
    { slug: 'handmade',  label: 'HANDMADE' },
    { slug: 'new',       label: 'NEW ARRIVALS' },
  ],
  filters: ['SHIRTS', 'DRESSES', 'JACKETS', 'BAGS', 'JEWELRY'],
};

export const products = [
  {
    name: 'Hemp Linen Shirt',
    slug: 'hemp-linen-shirt',
    description: 'Woven from 100% Nepali hemp. Breathable, durable, and earthy — this shirt carries the spirit of the Himalayas. Naturally anti-bacterial and gets softer with every wash.',
    price: 55,
    category: 'shirts',
    tags: ['hemp', 'shop', 'new'],
    colors: [
      { name: 'Natural', hex: '#d4c5a9' },
      { name: 'Stone',   hex: '#8c8074' },
      { name: 'Sage',    hex: '#7d8c6e' },
      { name: 'Indigo',  hex: '#2d3561' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [IMG.p1, IMG.p3],
    featured: true,
    trending: true,
    newArrival: true,
  },
  {
    name: 'Handwoven Hemp Dress',
    slug: 'handwoven-hemp-dress',
    description: 'A flowing midi dress handwoven by artisans in Bhaktapur. Each piece is one-of-a-kind. Hemp fabric dyed with natural plant dyes — no chemicals, just nature.',
    price: 85,
    category: 'dresses',
    tags: ['hemp', 'handmade', 'shop'],
    colors: [
      { name: 'Clay',       hex: '#c97d4a' },
      { name: 'Indigo',     hex: '#2d3561' },
      { name: 'Natural',    hex: '#d4c5a9' },
      { name: 'Forest',     hex: '#3a5438' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [IMG.p2, IMG.p6],
    featured: true,
    trending: true,
  },
  {
    name: 'Artisan Block-Print Kurta',
    slug: 'artisan-block-print-kurta',
    description: 'Traditional Nepali block-printing on soft hemp cotton. Hand-stamped by master craftspeople in Patan. Comfortable for daily wear, beautiful enough for celebrations.',
    price: 65,
    category: 'shirts',
    tags: ['handmade', 'hemp', 'shop'],
    colors: [
      { name: 'Ivory + Black', hex: '#f5f0e8' },
      { name: 'Saffron',       hex: '#f4a015' },
      { name: 'Crimson',       hex: '#9b2335' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [IMG.p3, IMG.p4],
    featured: true,
    newArrival: true,
  },
  {
    name: 'Mountain Quilted Jacket',
    slug: 'mountain-quilted-jacket',
    description: 'Handstitched quilted jacket in natural hemp fabric. Inspired by traditional Nepali cholo. Warm, lightweight, and built for mountain life and city streets alike.',
    price: 120,
    category: 'jackets',
    tags: ['hemp', 'handmade', 'shop', 'new'],
    colors: [
      { name: 'Ochre',   hex: '#c8860a' },
      { name: 'Charcoal',hex: '#333333' },
      { name: 'Rust',    hex: '#8b3a2a' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [IMG.p5, IMG.editorial3],
    trending: true,
    newArrival: true,
  },
  {
    name: 'Dhaka Weave Top',
    slug: 'dhaka-weave-top',
    description: 'Crafted using the traditional Dhaka weaving technique of Palpa, Nepal. Geometric patterns woven on handlooms passed down through generations. Wear culture.',
    price: 48,
    category: 'shirts',
    tags: ['handmade', 'shop'],
    colors: [
      { name: 'Red & Gold', hex: '#9b2335' },
      { name: 'Black & Red',hex: '#1a1a1a' },
      { name: 'Blue & White',hex: '#2d3561' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [IMG.p8, IMG.p7],
    featured: true,
    trending: true,
  },
  {
    name: 'Hemp Drawstring Bag',
    slug: 'hemp-drawstring-bag',
    description: 'Hand-stitched hemp drawstring bag — strong, sustainable, and stylish. Perfect for market trips, yoga, or everyday carry. Naturally water-resistant.',
    price: 35,
    category: 'bags',
    tags: ['hemp', 'handmade', 'shop'],
    colors: [
      { name: 'Natural', hex: '#d4c5a9' },
      { name: 'Black',   hex: '#1a1a1a' },
      { name: 'Forest',  hex: '#3a5438' },
    ],
    sizes: ['One Size'],
    images: [IMG.p9, IMG.p10],
    featured: true,
  },
  {
    name: 'Woven Tote Bag',
    slug: 'woven-tote-bag',
    description: 'A spacious tote woven from hemp rope by cooperatives in Kathmandu valley. Each bag supports a women-led artisan group. Durable enough for daily life.',
    price: 42,
    category: 'bags',
    tags: ['handmade', 'shop', 'new'],
    colors: [
      { name: 'Natural',  hex: '#d4c5a9' },
      { name: 'Terracotta', hex: '#c97d4a' },
      { name: 'Indigo',   hex: '#2d3561' },
    ],
    sizes: ['One Size'],
    images: [IMG.p10, IMG.p9],
    trending: true,
    newArrival: true,
  },
  {
    name: 'Silver & Stone Pendant',
    slug: 'silver-stone-pendant',
    description: 'Sterling silver pendant set with Himalayan stone — turquoise, garnet, or lapis lazuli. Handcrafted by a silversmith family in Bhaktapur. Each piece is unique.',
    price: 38,
    category: 'jewelry',
    tags: ['handmade', 'shop'],
    colors: [
      { name: 'Turquoise', hex: '#40b8c4' },
      { name: 'Garnet',    hex: '#6b1c2c' },
      { name: 'Lapis',     hex: '#1a2c6b' },
    ],
    sizes: ['One Size'],
    images: [IMG.p11, IMG.p12],
    featured: true,
    trending: true,
  },
  {
    name: 'Beaded Bracelet Stack',
    slug: 'beaded-bracelet-stack',
    description: 'Set of 3 handmade bracelets using seeds, stones, and recycled glass beads. A tradition of wrist art from the hills of Nepal — wear one, gift two.',
    price: 24,
    category: 'jewelry',
    tags: ['handmade', 'shop', 'new'],
    colors: [
      { name: 'Earth Mix',  hex: '#9b7653' },
      { name: 'Ocean Mix',  hex: '#3a7ca5' },
      { name: 'Forest Mix', hex: '#3a5438' },
    ],
    sizes: ['One Size'],
    images: [IMG.p12, IMG.p11],
    newArrival: true,
  },
  {
    name: 'Hemp Wide-Leg Pant',
    slug: 'hemp-wide-leg-pant',
    description: 'Easy, breezy wide-leg trousers in 100% hemp. A comfortable everyday staple that looks effortless. Elastic waist with a drawcord — no compromise on comfort.',
    price: 72,
    category: 'dresses',
    tags: ['hemp', 'shop', 'new'],
    colors: [
      { name: 'Oat',     hex: '#d4c5a9' },
      { name: 'Charcoal',hex: '#333333' },
      { name: 'Clay',    hex: '#c97d4a' },
      { name: 'Forest',  hex: '#3a5438' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [IMG.p6, IMG.p2],
    featured: true,
    trending: true,
    newArrival: true,
  },
  {
    name: 'Pashmina Wrap Jacket',
    slug: 'pashmina-wrap-jacket',
    description: 'Luxuriously soft wrap jacket blending pashmina and hemp. Hand-loomed in the Kathmandu valley. A statement piece that tells a story — your story, and Nepal\'s.',
    price: 145,
    category: 'jackets',
    tags: ['handmade', 'shop'],
    colors: [
      { name: 'Cream',    hex: '#f5f0e8' },
      { name: 'Blush',    hex: '#e8a89c' },
      { name: 'Midnight', hex: '#1a1a2e' },
    ],
    sizes: ['S', 'M', 'L'],
    images: [IMG.editorial4, IMG.p5],
    featured: true,
  },
  {
    name: 'Hand-Embroidered Blouse',
    slug: 'hand-embroidered-blouse',
    description: 'Delicate hand-embroidery on a lightweight hemp cotton blouse. Floral motifs inspired by Nepali temple art. Takes 2–3 days to embroider each piece by hand.',
    price: 68,
    category: 'shirts',
    tags: ['handmade', 'shop', 'new'],
    colors: [
      { name: 'White + Multicolor', hex: '#ffffff' },
      { name: 'Black + Gold',       hex: '#1a1a1a' },
      { name: 'Ivory + Red',        hex: '#f5f0e8' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [IMG.p4, IMG.p8],
    trending: true,
    newArrival: true,
  },
];

/** In-memory store used when MongoDB is not connected */
export function createMemoryStore() {
  const list = products.map((p, i) => ({
    ...p,
    _id: `mem_${i + 1}`,
    id: `mem_${i + 1}`,
    currency: 'USD',
    inStock: true,
    stock: 50,
    cloudinaryIds: [],
    createdAt: new Date().toISOString(),
  }));

  return {
    products: list,
    users: [],
    orders: [],
  };
}

export { IMG };
