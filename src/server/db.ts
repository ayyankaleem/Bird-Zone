import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'owner' | 'staff';
  avatar?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export interface DBProduct {
  id: string;
  name: string;
  nameUrdu: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  availabilityStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'enquiry_only';
  productStatus: 'published' | 'draft' | 'archived';
  productType: 'Bird' | 'Cage' | 'Feed' | 'Toy' | 'Accessory' | 'Other';
  isFeatured: boolean;
  mainImage: string;
  galleryImages: string[];
  imageAlt?: string;
  weight?: string;
  dimensions?: string;
  careInstructions?: string;
  diet?: string;
  origin?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  species?: string;
  ageRange?: string;
  handTamed?: boolean;
  availabilityNotes?: string;
  deliveryEligibility: 'all' | 'lahore_only' | 'pickup_only';
  createdAt: string;
  updatedAt: string;
}

export interface DBCategory {
  id: string;
  name: string;
  nameUrdu: string;
  slug: string;
  description: string;
  thumbnail: string;
  iconName: string;
  displayOrder: number;
  active: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBOrderItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

export interface DBOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  cityArea: string;
  deliveryZoneId: string;
  deliveryZoneName: string;
  items: DBOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  orderStatus:
    | 'Pending Confirmation'
    | 'Confirmed'
    | 'Processing'
    | 'Ready for Pickup'
    | 'Dispatched'
    | 'Delivered'
    | 'Cancelled'
    | 'Returned';
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'whatsapp';
  paymentStatus: 'Unpaid' | 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  transactionId?: string;
  internalNotes?: string;
  customerNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string;
  }>;
}

export interface DBCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  addresses: string[];
  status: 'active' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface DBInventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  changeAmount: number;
  reason: 'sale' | 'restock' | 'damage' | 'manual_adjustment' | 'order_cancelled' | 'return';
  previousStock: number;
  newStock: number;
  referenceId?: string;
  adminName: string;
  timestamp: string;
}

export interface DBCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  applicableCategory?: string;
  active: boolean;
  createdAt: string;
}

export interface DBStoreSettings {
  general: {
    storeName: string;
    tagline: string;
    contactPhone: string;
    whatsappNumber: string;
    email: string;
    address: string;
    businessHours: string;
    currency: string;
    locale: string;
  };
  delivery: {
    deliveryEnabled: boolean;
    freeDeliveryThreshold: number;
    zones: Array<{
      id: string;
      name: string;
      nameUrdu: string;
      rate: number;
      freeDeliveryThreshold?: number;
      eta: string;
      description: string;
    }>;
    pickupEnabled: boolean;
    pickupAddress: string;
    expectedDeliveryNote: string;
  };
  payment: {
    codEnabled: boolean;
    jazzcashEnabled: boolean;
    jazzcashAccount: string;
    jazzcashTitle: string;
    easypaisaEnabled: boolean;
    easypaisaAccount: string;
    easypaisaTitle: string;
    bankTransferEnabled: boolean;
    bankDetails: string;
    instructions: string;
  };
  content: {
    heroHeading: string;
    heroHeadingUrdu: string;
    heroSubtitle: string;
    heroImage: string;
    announcementText: string;
    aboutText: string;
    footerNote: string;
  };
}

export interface DBNotification {
  id: string;
  type: 'new_order' | 'low_stock' | 'out_of_stock' | 'payment_pending' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface DBAuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: AdminUser[];
  categories: DBCategory[];
  products: DBProduct[];
  orders: DBOrder[];
  customers: DBCustomer[];
  inventoryMovements: DBInventoryMovement[];
  coupons: DBCoupon[];
  settings: DBStoreSettings;
  notifications: DBNotification[];
  auditLogs: DBAuditLog[];
}

// Initial Seed Data
function getInitialData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('BirdZone@Wapda2026!', salt);

  const initialUsers: AdminUser[] = [
    {
      id: 'usr-owner-001',
      name: 'Bird Zone Admin',
      email: 'admin@birdzone.pk',
      passwordHash,
      role: 'owner',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-staff-001',
      name: 'Wapda Town Staff',
      email: 'staff@birdzone.pk',
      passwordHash: bcrypt.hashSync('Staff@Wapda2026!', salt),
      role: 'staff',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ];

  const initialCategories: DBCategory[] = [
    {
      id: 'cat-exotic-birds',
      name: 'Exotic Birds',
      nameUrdu: 'طوطے اور نایاب پرندے',
      slug: 'exotic-birds',
      description: 'Hand-reared, tame, and companion parrots, lovebirds, and cockatiels.',
      thumbnail: '/src/assets/images/product_cockatiel_pair_1790931312595.jpg',
      iconName: 'Bird',
      displayOrder: 1,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-cages-aviaries',
      name: 'Cages & Aviaries',
      nameUrdu: 'پنجرے اور ایویری',
      slug: 'cages-aviaries',
      description: 'Heavy wrought-iron flight cages, stands, and spacious breeding boxes.',
      thumbnail: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
      iconName: 'Home',
      displayOrder: 2,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-feed-nutrition',
      name: 'Feed & Nutrition',
      nameUrdu: 'پریمیئم فیڈ اور بیج',
      slug: 'feed-nutrition',
      description: 'Imported Belgian seeds, fortified egg-food, vitamins, and calcium blocks.',
      thumbnail: '/src/assets/images/product_premium_bird_seed_1790931342356.jpg',
      iconName: 'Wheat',
      displayOrder: 3,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-toys-perches',
      name: 'Toys and Enrichment',
      nameUrdu: 'کھلونے اور جھولے',
      slug: 'toys-enrichment',
      description: 'Natural neem & apple wood chew toys, swings, perches, and ladders.',
      thumbnail: '/src/assets/images/product_natural_bird_toys_1790931355709.jpg',
      iconName: 'Smile',
      displayOrder: 4,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-feeders-waterers',
      name: 'Feeders and Waterers',
      nameUrdu: 'برتن اور فیڈرز',
      slug: 'feeders-waterers',
      description: 'Lock-bracket stainless steel bowls, automatic drinkers, and spill guards.',
      thumbnail: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
      iconName: 'Utensils',
      displayOrder: 5,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cat-bird-care',
      name: 'Supplements & Bird Care',
      nameUrdu: 'دیکھ بھال اور وٹامنز',
      slug: 'bird-care',
      description: 'Feather condition tonics, avian disinfectants, and respiratory support.',
      thumbnail: '/src/assets/images/product_premium_bird_seed_1790931342356.jpg',
      iconName: 'HeartPulse',
      displayOrder: 6,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const initialProducts: DBProduct[] = [
    {
      id: 'prod-cockatiel-pair',
      name: 'Cockatiel Pair (Lutino & Pearl)',
      nameUrdu: 'کوکاٹیل جوڑا (لوٹینو اور پرل)',
      slug: 'cockatiel-pair-lutino-pearl',
      sku: 'BZ-BRD-001',
      categoryId: 'cat-exotic-birds',
      categoryName: 'Exotic Birds',
      shortDescription: 'Healthy, active, hand-reared breeding pair of Cockatiels with distinct vibrant crests.',
      description: 'Healthy, active, hand-reared breeding pair of Cockatiels with distinct vibrant crests and affectionate personalities. DNA tested and vet checked in Lahore.',
      regularPrice: 9500,
      salePrice: 8500,
      stockQuantity: 4,
      lowStockThreshold: 2,
      availabilityStatus: 'in_stock',
      productStatus: 'published',
      productType: 'Bird',
      isFeatured: true,
      mainImage: '/src/assets/images/product_cockatiel_pair_1790931312595.jpg',
      galleryImages: ['/src/assets/images/product_cockatiel_pair_1790931312595.jpg'],
      imageAlt: 'Lutino and Pearl Cockatiel pair perched peacefully',
      weight: '180g (Pair)',
      dimensions: 'Approx 30cm length',
      careInstructions: 'Provide daily out-of-cage flight time in a draft-free room. Keep away from kitchen fumes.',
      diet: 'Mix of premium seeds, sprouted millets, boiled egg food twice a week, and fresh greens.',
      origin: 'Locally bred in Wapda Town Aviary, Lahore',
      tags: ['cockatiel', 'hand-tamed', 'breeding pair', 'whistling'],
      seoTitle: 'Cockatiel Pair For Sale in Lahore | Bird Zone Wapda Town',
      seoDescription: 'Buy hand-tamed healthy Cockatiel pairs in Wapda Town Lahore. Vet checked with health card.',
      species: 'Nymphicus hollandicus',
      ageRange: '10-12 months',
      handTamed: true,
      availabilityNotes: 'Available for immediate store inspection and safe climate carrier delivery in Lahore.',
      deliveryEligibility: 'lahore_only',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-ringneck-parrot',
      name: 'Hand-Tamed Green Ringneck (Raw Parrot)',
      nameUrdu: 'ہینڈ ٹیم سبز رنگ نیک طوطا',
      slug: 'hand-tamed-green-ringneck',
      sku: 'BZ-BRD-002',
      categoryId: 'cat-exotic-birds',
      categoryName: 'Exotic Birds',
      shortDescription: 'Exceptionally tame juvenile Green Ringneck parrot. Accustomed to stepping up on hands.',
      description: 'Exceptionally tame juvenile Green Ringneck parrot. Accustomed to stepping up on hands, gentle beak behavior, and beginning speech mimicry.',
      regularPrice: 20000,
      salePrice: 18000,
      stockQuantity: 2,
      lowStockThreshold: 1,
      availabilityStatus: 'low_stock',
      productStatus: 'published',
      productType: 'Bird',
      isFeatured: true,
      mainImage: '/src/assets/images/hero_colorful_parrot_1790931293239.jpg',
      galleryImages: ['/src/assets/images/hero_colorful_parrot_1790931293239.jpg'],
      imageAlt: 'Green ringneck raw parrot on a natural wood perch',
      weight: '130g',
      dimensions: '40cm with tail',
      careInstructions: 'Requires daily interaction and puzzle toys to prevent boredom. Needs tall flight cage.',
      diet: 'High-quality parrot pellets, seasonal guavas, pomegranates, green chillies, and sunflower seeds.',
      origin: 'Hand-raised at Bird Zone Wapda Town',
      tags: ['ringneck', 'raw parrot', 'speaking parrot', 'tame'],
      seoTitle: 'Hand Tamed Ringneck Parrot in Lahore | Bird Zone',
      seoDescription: 'Hand-fed friendly juvenile green ringneck parrot in Lahore Wapda Town.',
      species: 'Psittacula krameri',
      ageRange: '4-5 months',
      handTamed: true,
      availabilityNotes: 'Personal in-store meet & greet recommended before confirmation.',
      deliveryEligibility: 'lahore_only',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-flight-cage-large',
      name: 'Spacious Wrought-Iron Flight Bird Cage',
      nameUrdu: 'بڑا لوہے کا فلائٹ پنجرہ برائے پرندے',
      slug: 'spacious-wrought-iron-flight-cage',
      sku: 'BZ-CAG-001',
      categoryId: 'cat-cages-aviaries',
      categoryName: 'Cages & Aviaries',
      shortDescription: 'Heavy-duty non-toxic powder-coated wrought-iron cage with slide-out tray.',
      description: 'Heavy-duty non-toxic powder-coated wrought-iron cage engineered for parakeets, lovebirds, and cockatiels. Features a slide-out waste tray and easy-access feeder doors.',
      regularPrice: 7500,
      salePrice: 6500,
      stockQuantity: 8,
      lowStockThreshold: 3,
      availabilityStatus: 'in_stock',
      productStatus: 'published',
      productType: 'Cage',
      isFeatured: true,
      mainImage: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
      galleryImages: ['/src/assets/images/product_spacious_bird_cage_1790931327322.jpg'],
      imageAlt: 'White powder coated wrought iron bird flight cage',
      weight: '6.5 kg',
      dimensions: '30" L x 18" W x 36" H',
      careInstructions: 'Clean bottom tray weekly with warm mild soap water. Non-abrasive sponge recommended.',
      origin: 'Manufactured with rust-resistant epoxy coating',
      tags: ['cage', 'flight cage', 'cockatiel cage', 'powder coated'],
      seoTitle: 'Large Bird Flight Cage Lahore | Bird Zone Wapda Town',
      seoDescription: 'Durable non-toxic wrought-iron flight bird cages with express delivery in Lahore.',
      deliveryEligibility: 'all',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-premium-seed-mix',
      name: 'Versele-Laga Prestige Exotic Seed & Nut Feed (2kg)',
      nameUrdu: 'پریمیئم امپورٹڈ بیج اور گری دار میوہ فیڈ (2 کلو)',
      slug: 'versele-laga-prestige-seed-feed-2kg',
      sku: 'BZ-FOD-001',
      categoryId: 'cat-feed-nutrition',
      categoryName: 'Feed & Nutrition',
      shortDescription: 'Enriched seed mixture with vitamins, amino acids, and minerals (VAM pellets).',
      description: 'Enriched seed mixture formulated with vitamins, amino acids, and minerals (VAM pellets) for optimal feather plumage, vibrant color, and strong immune defense.',
      regularPrice: 3200,
      salePrice: 2800,
      stockQuantity: 35,
      lowStockThreshold: 10,
      availabilityStatus: 'in_stock',
      productStatus: 'published',
      productType: 'Feed',
      isFeatured: true,
      mainImage: '/src/assets/images/product_premium_bird_seed_1790931342356.jpg',
      galleryImages: ['/src/assets/images/product_premium_bird_seed_1790931342356.jpg'],
      imageAlt: 'Versele-Laga premium bird seeds and grains bag',
      weight: '2.0 kg',
      diet: 'Ideal everyday staple for medium to large parrots',
      origin: 'Imported Belgian Formulation',
      tags: ['feed', 'bird seed', 'versele laga', 'parrot nutrition'],
      seoTitle: 'Versele Laga Bird Seed in Lahore | Bird Zone',
      seoDescription: 'Original imported Belgian Versele Laga bird feed in Wapda Town Lahore.',
      deliveryEligibility: 'all',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-natural-wood-toys',
      name: 'Handcrafted Wooden Ladder, Swing & Rope Perch Set',
      nameUrdu: 'ہینڈ کرافٹڈ لکڑی کی سیڑھی اور رسّی جھولا سیٹ',
      slug: 'handcrafted-wooden-ladder-swing-toy-set',
      sku: 'BZ-TOY-001',
      categoryId: 'cat-toys-perches',
      categoryName: 'Toys and Enrichment',
      shortDescription: 'Chemical-free natural neem and apple wood play gym accessories.',
      description: 'Chemical-free natural neem and apple wood play gym accessories with food-grade vegetable dyes. Promotes beak trimming and mental enrichment.',
      regularPrice: 1750,
      salePrice: 1450,
      stockQuantity: 16,
      lowStockThreshold: 5,
      availabilityStatus: 'in_stock',
      productStatus: 'published',
      productType: 'Toy',
      isFeatured: true,
      mainImage: '/src/assets/images/product_natural_bird_toys_1790931355709.jpg',
      galleryImages: ['/src/assets/images/product_natural_bird_toys_1790931355709.jpg'],
      imageAlt: 'Colorful wooden bird ladder and rope swings for parrots',
      weight: '450g',
      origin: 'Handmade by local Lahore artisans',
      tags: ['toys', 'wood swing', 'ladder', 'chew toys'],
      seoTitle: 'Bird Toys & Wooden Swings Lahore | Bird Zone',
      seoDescription: 'Non-toxic natural wood bird toys and climbing ladders in Lahore.',
      deliveryEligibility: 'all',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-calcium-mineral-block',
      name: 'Natural Cuttlefish Bone & Mineral Iodine Block (Pack of 3)',
      nameUrdu: 'قدرتی سمندری جھاگ اور منرل کیلشیم بلاک',
      slug: 'natural-cuttlefish-bone-calcium-pack',
      sku: 'BZ-FOD-002',
      categoryId: 'cat-bird-care',
      categoryName: 'Supplements & Bird Care',
      shortDescription: 'Pure essential calcium and trace mineral source for strong bones and beak shaping.',
      description: 'Pure essential calcium and trace mineral source for strong egg shells, robust bone density, and natural beak shaping.',
      regularPrice: 750,
      salePrice: 650,
      stockQuantity: 40,
      lowStockThreshold: 10,
      availabilityStatus: 'in_stock',
      productStatus: 'published',
      productType: 'Feed',
      isFeatured: false,
      mainImage: '/src/assets/images/product_premium_bird_seed_1790931342356.jpg',
      galleryImages: ['/src/assets/images/product_premium_bird_seed_1790931342356.jpg'],
      imageAlt: 'Cuttlebone and mineral block for pet birds',
      weight: '300g',
      origin: 'Natural coastal source with purity testing',
      tags: ['calcium', 'cuttlebone', 'breeding supplement'],
      deliveryEligibility: 'all',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prod-stainless-feeders',
      name: 'Heavy-Duty Clamp Stainless Steel Bird Bowls (Set of 2)',
      nameUrdu: 'سٹین لیس سٹیل کلیمپ والے برتن (2 عدد)',
      slug: 'stainless-steel-clamp-bowls-set-of-2',
      sku: 'BZ-TOY-002',
      categoryId: 'cat-feeders-waterers',
      categoryName: 'Feeders and Waterers',
      shortDescription: 'Hygienic 304 food-grade stainless steel bowls with lock-bracket clamp.',
      description: 'Hygienic 304 food-grade stainless steel bowls with lock-bracket clamp that prevents playful parrots from tipping or tossing food.',
      regularPrice: 1150,
      salePrice: 950,
      stockQuantity: 22,
      lowStockThreshold: 5,
      availabilityStatus: 'in_stock',
      productStatus: 'published',
      productType: 'Accessory',
      isFeatured: false,
      mainImage: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
      galleryImages: ['/src/assets/images/product_spacious_bird_cage_1790931327322.jpg'],
      imageAlt: 'Stainless steel bird coop cups with clamp',
      weight: '250g',
      origin: 'Grade 304 Stainless Steel',
      tags: ['feeders', 'bowls', 'stainless steel'],
      deliveryEligibility: 'all',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const initialSettings: DBStoreSettings = {
    general: {
      storeName: 'Bird Zone Wapda Town',
      tagline: 'Premier Pet & Avian Store in Lahore',
      contactPhone: '+92 300 1234567',
      whatsappNumber: '923001234567',
      email: 'orders@birdzone.pk',
      address: 'Shop #4, Commercial Area, Phase 1, Wapda Town, Lahore, Punjab, Pakistan',
      businessHours: '10:00 AM – 11:00 PM (Monday – Sunday)',
      currency: 'PKR',
      locale: 'en-PK',
    },
    delivery: {
      deliveryEnabled: true,
      freeDeliveryThreshold: 3500,
      zones: [
        {
          id: 'zone-wapda',
          name: 'Wapda Town & Adjacent Phases',
          nameUrdu: 'واپڈا ٹاؤن اور ملحقہ فیز',
          rate: 150,
          freeDeliveryThreshold: 3500,
          eta: 'Under 2 Hours (Express Rider)',
          description: 'Phase 1, Phase 2, Revenue Society, Tariq Gardens & PCSIR Phase 2.',
        },
        {
          id: 'zone-south-lahore',
          name: 'Johar Town, Valencia & Bahria Town',
          nameUrdu: 'جوہر ٹاؤن، ویلنشیا اور بحریہ ٹاؤن',
          rate: 250,
          freeDeliveryThreshold: 5000,
          eta: 'Same Day (2 - 4 Hours)',
          description: 'Johar Town, PIA Road, Valencia, Khayaban-e-Amin, Lake City & Bahria Town.',
        },
        {
          id: 'zone-greater-lahore',
          name: 'DHA, Gulberg, Model Town & Cantt',
          nameUrdu: 'ڈی ایچ اے، گلبرگ، ماڈل ٹاؤن، کینٹ',
          rate: 350,
          freeDeliveryThreshold: 6000,
          eta: 'Same Day Evening Delivery',
          description: 'DHA Phases 1-8, Gulberg I-III, Model Town, Cavalry Ground & Lahore Cantt.',
        },
        {
          id: 'zone-nationwide',
          name: 'Nationwide (Rest of Pakistan - Cages & Supplies)',
          nameUrdu: 'ملک گیر ترسیل (پنجرے اور اشیاء)',
          rate: 600,
          freeDeliveryThreshold: 10000,
          eta: '2 - 4 Business Days (TCS / Leopard)',
          description: 'Deliveries for cages, feed, toys & accessories. Live birds require store pickup.',
        },
      ],
      pickupEnabled: true,
      pickupAddress: 'Bird Zone, Shop #4 Commercial Boulevard, Phase 1, Wapda Town, Lahore',
      expectedDeliveryNote: 'Same day delivery for Lahore orders placed before 7:00 PM.',
    },
    payment: {
      codEnabled: true,
      jazzcashEnabled: true,
      jazzcashAccount: '0300-1234567',
      jazzcashTitle: 'Bird Zone Wapda Town',
      easypaisaEnabled: true,
      easypaisaAccount: '0300-1234567',
      easypaisaTitle: 'Bird Zone Wapda Town',
      bankTransferEnabled: true,
      bankDetails: 'Meezan Bank Ltd, Wapda Town Branch, IBAN: PK42MEZN00012345678901',
      instructions: 'Please mention your Order Number as transaction reference when sending wallet or bank payments.',
    },
    content: {
      heroHeading: 'Welcome to Bird Zone, Wapda Town',
      heroHeadingUrdu: 'خوش آمدید · برڈ زون واپڈا ٹاؤن',
      heroSubtitle: 'Lahore’s premier avian boutique and pet supplies specialist. Discover healthy exotic birds, spacious flight aviaries, imported nutritional feed, and handcrafted toys with same-day Wapda Town delivery and WhatsApp ordering.',
      heroImage: '/src/assets/images/hero_colorful_parrot_1790931293239.jpg',
      announcementText: 'خوش آمدید · Welcome! Free express delivery in Wapda Town on orders over PKR 3,500 | WhatsApp: +92 300 1234567',
      aboutText: 'Bird Zone (Wapda Town branch) is a dedicated pet and avian sanctuary in Lahore specializing in healthy, socialized exotic companion birds, architectural flight cages, and vet-certified nutritional feeds.',
      footerNote: 'All birds at Bird Zone Wapda Town are captive-bred, domestically hand-reared companion birds.',
    },
  };

  const initialCoupons: DBCoupon[] = [
    {
      id: 'cpn-welcome',
      code: 'WELCOMEBZ',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 2000,
      maxDiscount: 1000,
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      usageLimit: 100,
      usageCount: 8,
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cpn-wapda-flat',
      code: 'WAPDA500',
      discountType: 'fixed',
      discountValue: 500,
      minOrderValue: 5000,
      startDate: '2026-01-01',
      expiryDate: '2026-12-31',
      usageLimit: 50,
      usageCount: 3,
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const initialOrders: DBOrder[] = [
    {
      id: 'BZ-LHR-7821',
      orderNumber: 'BZ-LHR-7821',
      customerName: 'Hamza Malik',
      customerPhone: '0302-8877112',
      customerEmail: 'hamza.malik@gmail.com',
      deliveryAddress: 'House 42, Block D, Wapda Town Phase 1, Lahore',
      cityArea: 'Wapda Town Phase 1',
      deliveryZoneId: 'zone-wapda',
      deliveryZoneName: 'Wapda Town & Adjacent Phases',
      items: [
        {
          productId: 'prod-cockatiel-pair',
          productName: 'Cockatiel Pair (Lutino & Pearl)',
          sku: 'BZ-BRD-001',
          price: 8500,
          quantity: 1,
          total: 8500,
          image: '/src/assets/images/product_cockatiel_pair_1790931312595.jpg',
        },
        {
          productId: 'prod-premium-seed-mix',
          productName: 'Versele-Laga Prestige Exotic Seed & Nut Feed (2kg)',
          sku: 'BZ-FOD-001',
          price: 2800,
          quantity: 1,
          total: 2800,
          image: '/src/assets/images/product_premium_bird_seed_1790931342356.jpg',
        },
      ],
      subtotal: 11300,
      deliveryFee: 0,
      discount: 0,
      total: 11300,
      orderStatus: 'Delivered',
      paymentMethod: 'cod',
      paymentStatus: 'Paid',
      internalNotes: 'Delivered via Wapda Town express rider. Customer verified live bird health.',
      customerNotes: 'Please ring the bell twice.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      statusHistory: [
        {
          status: 'Pending Confirmation',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedBy: 'System (Online Storefront)',
          note: 'Customer placed order via website',
        },
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(),
          updatedBy: 'Bird Zone Admin',
          note: 'Confirmed availability and delivery schedule',
        },
        {
          status: 'Dispatched',
          timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(),
          updatedBy: 'Wapda Town Staff',
          note: 'Handed to rider in safe climate carrier',
        },
        {
          status: 'Delivered',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          updatedBy: 'Bird Zone Admin',
          note: 'Received cash on delivery: PKR 11,300',
        },
      ],
    },
    {
      id: 'BZ-LHR-7890',
      orderNumber: 'BZ-LHR-7890',
      customerName: 'Dr. Ayesha Siddiqui',
      customerPhone: '0321-4455667',
      customerEmail: 'ayesha.siddiqui@dha.edu.pk',
      deliveryAddress: 'House 118, Sector J, DHA Phase 5, Lahore',
      cityArea: 'DHA Phase 5',
      deliveryZoneId: 'zone-greater-lahore',
      deliveryZoneName: 'DHA, Gulberg, Model Town & Cantt',
      items: [
        {
          productId: 'prod-flight-cage-large',
          productName: 'Spacious Wrought-Iron Flight Bird Cage',
          sku: 'BZ-CAG-001',
          price: 6500,
          quantity: 1,
          total: 6500,
          image: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
        },
        {
          productId: 'prod-natural-wood-toys',
          productName: 'Handcrafted Wooden Ladder, Swing & Rope Perch Set',
          sku: 'BZ-TOY-001',
          price: 1450,
          quantity: 1,
          total: 1450,
          image: '/src/assets/images/product_natural_bird_toys_1790931355709.jpg',
        },
      ],
      subtotal: 7950,
      deliveryFee: 0,
      discount: 0,
      total: 7950,
      orderStatus: 'Processing',
      paymentMethod: 'jazzcash',
      paymentStatus: 'Paid',
      transactionId: 'JC-982183921',
      internalNotes: 'Cage packed in bubble wrap. Assembled perches included.',
      customerNotes: 'Call before delivery.',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      statusHistory: [
        {
          status: 'Pending Confirmation',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          updatedBy: 'System (Online Storefront)',
          note: 'Customer placed order with JazzCash',
        },
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedBy: 'Bird Zone Admin',
          note: 'JazzCash payment confirmed (TID: JC-982183921)',
        },
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          updatedBy: 'Wapda Town Staff',
          note: 'Cage packaged and ready for courier pickup',
        },
      ],
    },
    {
      id: 'BZ-LHR-7944',
      orderNumber: 'BZ-LHR-7944',
      customerName: 'Usman Tariq',
      customerPhone: '0333-1122334',
      deliveryAddress: 'Apartment 3B, PIA Housing Society, Johar Town, Lahore',
      cityArea: 'Johar Town',
      deliveryZoneId: 'zone-south-lahore',
      deliveryZoneName: 'Johar Town, Valencia & Bahria Town',
      items: [
        {
          productId: 'prod-premium-seed-mix',
          productName: 'Versele-Laga Prestige Exotic Seed & Nut Feed (2kg)',
          sku: 'BZ-FOD-001',
          price: 2800,
          quantity: 2,
          total: 5600,
          image: '/src/assets/images/product_premium_bird_seed_1790931342356.jpg',
        },
      ],
      subtotal: 5600,
      deliveryFee: 0,
      discount: 0,
      total: 5600,
      orderStatus: 'Pending Confirmation',
      paymentMethod: 'cod',
      paymentStatus: 'Unpaid',
      customerNotes: 'Please deliver after 6 PM.',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      statusHistory: [
        {
          status: 'Pending Confirmation',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          updatedBy: 'System (Online Storefront)',
          note: 'Order awaiting admin confirmation',
        },
      ],
    },
  ];

  const initialCustomers: DBCustomer[] = [
    {
      id: 'cust-001',
      name: 'Hamza Malik',
      phone: '0302-8877112',
      email: 'hamza.malik@gmail.com',
      totalOrders: 1,
      totalSpent: 11300,
      lastOrderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      addresses: ['House 42, Block D, Wapda Town Phase 1, Lahore'],
      status: 'active',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'cust-002',
      name: 'Dr. Ayesha Siddiqui',
      phone: '0321-4455667',
      email: 'ayesha.siddiqui@dha.edu.pk',
      totalOrders: 1,
      totalSpent: 7950,
      lastOrderDate: new Date(Date.now() - 3600000 * 5).toISOString(),
      addresses: ['House 118, Sector J, DHA Phase 5, Lahore'],
      status: 'active',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'cust-003',
      name: 'Usman Tariq',
      phone: '0333-1122334',
      totalOrders: 1,
      totalSpent: 5600,
      lastOrderDate: new Date(Date.now() - 1800000).toISOString(),
      addresses: ['Apartment 3B, PIA Housing Society, Johar Town, Lahore'],
      status: 'active',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  const initialMovements: DBInventoryMovement[] = [
    {
      id: 'mov-001',
      productId: 'prod-cockatiel-pair',
      productName: 'Cockatiel Pair (Lutino & Pearl)',
      sku: 'BZ-BRD-001',
      changeAmount: -1,
      reason: 'sale',
      previousStock: 5,
      newStock: 4,
      referenceId: 'BZ-LHR-7821',
      adminName: 'System (Order)',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'mov-002',
      productId: 'prod-premium-seed-mix',
      productName: 'Versele-Laga Prestige Exotic Seed & Nut Feed (2kg)',
      sku: 'BZ-FOD-001',
      changeAmount: -1,
      reason: 'sale',
      previousStock: 36,
      newStock: 35,
      referenceId: 'BZ-LHR-7821',
      adminName: 'System (Order)',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'mov-003',
      productId: 'prod-flight-cage-large',
      productName: 'Spacious Wrought-Iron Flight Bird Cage',
      sku: 'BZ-CAG-001',
      changeAmount: -1,
      reason: 'sale',
      previousStock: 9,
      newStock: 8,
      referenceId: 'BZ-LHR-7890',
      adminName: 'System (Order)',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];

  const initialNotifications: DBNotification[] = [
    {
      id: 'notif-001',
      type: 'new_order',
      title: 'New Order Received',
      message: 'Order #BZ-LHR-7944 from Usman Tariq (Johar Town) for PKR 5,600 awaiting confirmation.',
      read: false,
      link: '/admin/orders',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'notif-002',
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'Green Ringneck (Raw Parrot) SKU: BZ-BRD-002 has only 2 units remaining.',
      read: false,
      link: '/admin/inventory',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const initialAuditLogs: DBAuditLog[] = [
    {
      id: 'aud-001',
      userId: 'usr-owner-001',
      userName: 'Bird Zone Admin',
      userRole: 'owner',
      action: 'system_initialized',
      details: 'Bird Zone Wapda Town Admin & Storefront persistent database initialized.',
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    users: initialUsers,
    categories: initialCategories,
    products: initialProducts,
    orders: initialOrders,
    customers: initialCustomers,
    inventoryMovements: initialMovements,
    coupons: initialCoupons,
    settings: initialSettings,
    notifications: initialNotifications,
    auditLogs: initialAuditLogs,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to load database file, creating fresh seed:', err);
    }
    const fresh = getInitialData();
    this.saveData(fresh);
    return fresh;
  }

  private saveData(data: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.data[key] = value;
    this.saveData(this.data);
  }

  public mutate(fn: (draft: DatabaseSchema) => void) {
    fn(this.data);
    this.saveData(this.data);
  }

  public logAudit(log: Omit<DBAuditLog, 'id' | 'timestamp'>) {
    const entry: DBAuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.saveData(this.data);
    return entry;
  }

  public createNotification(notif: Omit<DBNotification, 'id' | 'createdAt' | 'read'>) {
    const entry: DBNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notif,
    };
    this.data.notifications.unshift(entry);
    if (this.data.notifications.length > 100) {
      this.data.notifications.pop();
    }
    this.saveData(this.data);
    return entry;
  }
}

export const db = new Database();
