import { Product, DeliveryZone, Review, CareGuide } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-cockatiel-pair',
    name: 'Cockatiel Pair (Lutino & Pearl)',
    nameUrdu: 'کوکاٹیل جوڑا (لوٹینو اور پرل)',
    category: 'Exotic Birds',
    price: 8500,
    originalPrice: 9500,
    rating: 4.9,
    reviewsCount: 38,
    image: '/src/assets/images/product_cockatiel_pair_1790931312595.jpg',
    inStock: true,
    stockCount: 4,
    sku: 'BZ-BRD-001',
    description: 'Healthy, active, hand-reared breeding pair of Cockatiels with distinct vibrant crests and affectionate personalities. DNA tested and vet checked in Lahore.',
    features: [
      'Hand-tamed and friendly with family & children',
      'Fully vaccinated and dewormed with veterinary health card',
      'Age: 10-12 months (Prime breeding age)',
      'High whistling and mimicry capability'
    ],
    careTips: 'Provide daily out-of-cage flight time in a draft-free room. Keep away from kitchen fumes and non-stick cookware.',
    diet: 'Mix of premium seeds, sprouted millets, boiled egg food twice a week, and fresh leafy greens (spinach, cucumber).',
    origin: 'Locally bred in Wapda Town Aviary, Lahore',
    isFeatured: true,
  },
  {
    id: 'prod-ringneck-parrot',
    name: 'Hand-Tamed Green Ringneck (Raw Parrot)',
    nameUrdu: 'ہینڈ ٹیم سبز رنگ نیک طوطا',
    category: 'Exotic Birds',
    price: 18000,
    originalPrice: 20000,
    rating: 5.0,
    reviewsCount: 24,
    image: '/src/assets/images/hero_colorful_parrot_1790931293239.jpg',
    inStock: true,
    stockCount: 2,
    sku: 'BZ-BRD-002',
    description: 'Exceptionally tame juvenile Green Ringneck parrot. Accustomed to stepping up on hands, gentle beak behavior, and beginning speech mimicry.',
    features: [
      'Semi-trained speech mimicry (whistles and calls "Mithu")',
      'Hand-fed on Kaytee formula from 3 weeks old',
      'Complete health certificate from Lahore Pet Clinic',
      'Gentle with kids and family members'
    ],
    careTips: 'Requires daily interaction and puzzle toys to prevent boredom. Needs a tall flight cage with 0.75-inch bar spacing.',
    diet: 'High-quality parrot pellets, seasonal guavas, pomegranates, green chillies, sunflower seeds, and almonds.',
    origin: 'Hand-raised at Bird Zone Wapda Town',
    isFeatured: true,
  },
  {
    id: 'prod-flight-cage-large',
    name: 'Spacious Wrought-Iron Flight Bird Cage',
    nameUrdu: 'بڑا لوہے کا فلائٹ پنجرہ برائے پرندے',
    category: 'Cages & Aviaries',
    price: 6500,
    originalPrice: 7500,
    rating: 4.8,
    reviewsCount: 52,
    image: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
    inStock: true,
    stockCount: 8,
    sku: 'BZ-CAG-001',
    description: 'Heavy-duty non-toxic powder-coated wrought-iron cage engineered for parakeets, lovebirds, and cockatiels. Features a slide-out waste tray and easy-access feeder doors.',
    features: [
      'Dimensions: 30" Length x 18" Width x 36" Height',
      'Safe 0.5-inch bar spacing preventing head entrapment',
      'Includes 3 solid hardwood perches & 4 feeder cups',
      'Slide-out bottom metal grate and removable plastic tray for effortless cleaning'
    ],
    dimensions: '30" x 18" x 36"',
    origin: 'Manufactured with rust-resistant epoxy coating',
    isFeatured: true,
  },
  {
    id: 'prod-aviary-mansion-cage',
    name: 'Heavy-Duty Rolling Aviary Stand Cage',
    nameUrdu: 'پہیوں والا بڑا ایویری اسٹینڈ پنجرہ',
    category: 'Cages & Aviaries',
    price: 16500,
    originalPrice: 18500,
    rating: 4.9,
    reviewsCount: 19,
    image: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
    inStock: true,
    stockCount: 3,
    sku: 'BZ-CAG-002',
    description: 'Architectural-grade rolling aviary with 360-degree lockable caster wheels, integrated storage shelf for seeds and supplies, and safety lock main door.',
    features: [
      'Dimensions: 32" L x 21" W x 54" H with stand',
      'Heavy-gauge 3mm steel bars with hammer-tone finish',
      'Play-top perch area with stainless steel bowls and ladder',
      'Seed guard skirts included to prevent room mess'
    ],
    dimensions: '32" x 21" x 54"',
    origin: 'Premium import for large parrots & multi-bird aviaries',
    isFeatured: false,
  },
  {
    id: 'prod-premium-seed-mix',
    name: 'Versele-Laga Prestige Exotic Seed & Nut Feed (2kg)',
    nameUrdu: 'پریمیئم امپورٹڈ بیج اور گری دار میوہ فیڈ (2 کلو)',
    category: 'Feed & Nutrition',
    price: 2800,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 86,
    image: '/src/assets/images/product_premium_bird_seed_1790931342356.jpg',
    inStock: true,
    stockCount: 35,
    sku: 'BZ-FOD-001',
    description: 'Enriched seed mixture formulated with vitamins, amino acids, and minerals (VAM pellets) for optimal feather plumage, vibrant color, and strong immune defense.',
    features: [
      'Fortified with Florastimul for healthy intestinal flora',
      'Cleaned and dust-free processed grains and seeds',
      'Contains sunflower seeds, safflower, buckwheat, oats, and dried red peppers',
      'Net Weight: 2 Kilograms in resealable freshness pouch'
    ],
    diet: 'Ideal everyday staple for medium to large parrots',
    origin: 'Imported Belgian Formulation',
    isFeatured: true,
  },
  {
    id: 'prod-natural-wood-toys',
    name: 'Handcrafted Wooden Ladder, Swing & Rope Perch Set',
    nameUrdu: 'ہینڈ کرافٹڈ لکڑی کی سیڑھی اور رسّی جھولا سیٹ',
    category: 'Toys & Perches',
    price: 1450,
    originalPrice: 1750,
    rating: 4.7,
    reviewsCount: 44,
    image: '/src/assets/images/product_natural_bird_toys_1790931355709.jpg',
    inStock: true,
    stockCount: 16,
    sku: 'BZ-TOY-001',
    description: 'Chemical-free natural neem and apple wood play gym accessories with food-grade vegetable dyes. Promotes beak trimming and mental enrichment.',
    features: [
      'Includes 1 flexible cotton rope perch, 1 wooden bell swing, and 1 8-step ladder',
      '100% pet-safe non-toxic natural vegetable coloring',
      'Universal quick-connect metal clips for instant cage installation',
      'Prevents destructive feather plucking caused by boredom'
    ],
    origin: 'Handmade by local Lahore artisans',
    isFeatured: true,
  },
  {
    id: 'prod-calcium-mineral-block',
    name: 'Natural Cuttlefish Bone & Mineral Iodine Block (Pack of 3)',
    nameUrdu: 'قدرتی سمندری جھاگ اور منرل کیلشیم بلاک',
    category: 'Feed & Nutrition',
    price: 650,
    originalPrice: 750,
    rating: 4.8,
    reviewsCount: 67,
    image: '/src/assets/images/product_premium_bird_seed_1790931342356.jpg',
    inStock: true,
    stockCount: 40,
    sku: 'BZ-FOD-002',
    description: 'Pure essential calcium and trace mineral source for strong egg shells, robust bone density, and natural beak shaping.',
    features: [
      'Contains 1 large pure cuttlebone + 2 fruit-flavored mineral blocks',
      'Supplies bioavailable calcium, phosphorus, and essential iodine',
      'Includes secure metal cage attachment clips',
      'Essential for breeding birds and growing chicks'
    ],
    origin: 'Natural coastal source with laboratory purity testing',
    isFeatured: false,
  },
  {
    id: 'prod-stainless-feeders',
    name: 'Heavy-Duty Clamp Stainless Steel Bird Bowls (Set of 2)',
    nameUrdu: 'سٹین لیس سٹیل کلیمپ والے برتن (2 عدد)',
    category: 'Toys & Perches',
    price: 950,
    originalPrice: 1150,
    rating: 4.9,
    reviewsCount: 31,
    image: '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
    inStock: true,
    stockCount: 22,
    sku: 'BZ-TOY-002',
    description: 'Hygienic 304 food-grade stainless steel bowls with lock-bracket clamp that prevents playful parrots from tipping or tossing food.',
    features: [
      'Rust-proof, dishwasher safe, and bacteria resistant',
      'Capacity: 300ml each (Food & Water pair)',
      'Twist-out bowl design makes refilling fast without unscrewing clamp',
      'Suitable for horizontal and vertical wire cages'
    ],
    origin: 'Grade 304 Stainless Steel',
    isFeatured: false,
  }
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-wapda',
    name: 'Wapda Town & Adjacent Phases',
    nameUrdu: 'واپڈا ٹاؤن اور ملحقہ فیز',
    rate: 150,
    freeDeliveryThreshold: 3500,
    eta: 'Under 2 Hours (Express Rider)',
    description: 'Phase 1, Phase 2, Revenue Society, Tariq Gardens & PCSIR Phase 2.'
  },
  {
    id: 'zone-south-lahore',
    name: 'Johar Town, Valencia & Bahria Town',
    nameUrdu: 'جوہر ٹاؤن، ویلنشیا اور بحریہ ٹاؤن',
    rate: 250,
    freeDeliveryThreshold: 5000,
    eta: 'Same Day (2 - 4 Hours)',
    description: 'Johar Town, PIA Road, Valencia, Khayaban-e-Amin, Lake City & Bahria Town.'
  },
  {
    id: 'zone-greater-lahore',
    name: 'DHA, Gulberg, Model Town & Cantt',
    nameUrdu: 'ڈی ایچ اے، گلبرگ، ماڈل ٹاؤن، کینٹ',
    rate: 350,
    freeDeliveryThreshold: 6000,
    eta: 'Same Day Evening Delivery',
    description: 'DHA Phases 1-8, Gulberg I-III, Model Town, Cavalry Ground & Lahore Cantt.'
  },
  {
    id: 'zone-nationwide',
    name: 'Nationwide (Rest of Pakistan - Cages & Supplies)',
    nameUrdu: 'ملک گیر ترسیل (پنجرے اور اشیاء)',
    rate: 600,
    freeDeliveryThreshold: 10000,
    eta: '2 - 4 Business Days (TCS / Leopard)',
    description: 'Deliveries for cages, feed, toys & accessories. (Note: Live birds available for store pickup or climate-controlled van arrangement only).'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Hamza Malik',
    location: 'Wapda Town Phase 1, Lahore',
    rating: 5,
    date: '2 days ago',
    text: 'Bought a pair of lutino cockatiels. They are completely hand-tamed, whistling happily from day one! Delivered within an hour to my door in Wapda Town with their seed box.',
    verifiedBuyer: true,
    itemPurchased: 'Cockatiel Pair (Lutino & Pearl)'
  },
  {
    id: 'rev-2',
    author: 'Dr. Ayesha Siddiqui',
    location: 'DHA Phase 5, Lahore',
    rating: 5,
    date: '1 week ago',
    text: 'The heavy wrought-iron cage arrived in pristine condition. Excellent non-toxic coating and sturdy construction. Very helpful team on WhatsApp explaining the assembly.',
    verifiedBuyer: true,
    itemPurchased: 'Spacious Wrought-Iron Flight Bird Cage'
  },
  {
    id: 'rev-3',
    author: 'Muhammad Usman',
    location: 'Johar Town, Lahore',
    rating: 5,
    date: '2 weeks ago',
    text: 'Genuine Versele-Laga Prestige feed at the best price in Lahore. Paid via JazzCash on delivery. My Green Ringneck loves the seed variety and dried chillies.',
    verifiedBuyer: true,
    itemPurchased: 'Versele-Laga Prestige Exotic Feed (2kg)'
  },
  {
    id: 'rev-4',
    author: 'Taimoor Cheema',
    location: 'Model Town, Lahore',
    rating: 5,
    date: '3 weeks ago',
    text: 'Visited their physical shop in Wapda Town commercial area. Very clean aviaries, no foul odor, and birds are super healthy and socialized. Highly recommended!',
    verifiedBuyer: true,
    itemPurchased: 'Hand-Tamed Green Ringneck (Raw Parrot)'
  }
];

export const CARE_GUIDES: CareGuide[] = [
  {
    id: 'guide-nutrition',
    title: 'Optimal Parrot Nutrition: Beyond Simple Seeds',
    titleUrdu: 'طوطوں کی متوازن خوراک اور ضروری وٹامنز',
    category: 'Diet & Health',
    readTime: '4 min read',
    summary: 'Why an all-seed diet causes fatty liver syndrome and how to transition your pet birds to healthy vegetable chops and fortified pellets.',
    content: [
      'In the wild, parrots forage for hundreds of fruits, nuts, berries, vegetation, and seeds according to seasonal availability. A seed-only diet in captivity is high in fats and severely lacks Vitamin A, Vitamin D3, and Calcium.',
      'Daily Fresh Chop: Chop finely grated carrots, broccoli florets, kale, capsicum, cooked lentils, and fresh pomegranate seeds. Offer in the morning for 2-3 hours.',
      'Toxic Foods to NEVER Feed: Avocados, chocolate, caffeine, apple seeds (contain cyanide traces), onions, garlic, and heavily salted or fried food.',
      'Fresh Water: Provide clean filtered water twice daily. Birds dip seeds and pellets into water cups, breeding bacteria rapidly in Lahore summer temperatures.'
    ]
  },
  {
    id: 'guide-winter',
    title: 'Winter Avian Care in Lahore: Drafts & Humidity',
    titleUrdu: 'لاہور کی سردیوں میں پرندوں کی حفاظت اور دیکھ بھال',
    category: 'Seasonal Care',
    readTime: '3 min read',
    summary: 'Protecting your exotic birds from abrupt temperature drops, cold smog drafts, and dry indoor air during Lahore winters.',
    content: [
      'Exotic tropical birds can adapt to mild cool temperatures, but cold drafts (sudden cold wind through windows or doorways) are the #1 cause of respiratory infections.',
      'Cage Cover: Cover the top, back, and sides of the flight cage with a breathable heavy cotton blanket or thermal fleece at sunset.',
      'Ceramic Heat Emitters: Use non-light ceramic heat emitters or safe oil-filled space heaters rather than open coil room heaters that burn oxygen.',
      'Smog Defense: On high-AQI winter smog days in Lahore, keep birds strictly indoors. Avian lungs are 10x more sensitive to particulate toxins than human lungs.'
    ]
  },
  {
    id: 'guide-taming',
    title: 'Gentle Hand-Taming: Building Trust With Your Bird',
    titleUrdu: 'پرندوں کو ہاتھ پر بیٹھنے کی تربیت اور مانوس کرنے کا طریقہ',
    category: 'Training & Socialization',
    readTime: '5 min read',
    summary: 'A step-by-step patience method for turning a shy parakeet or cockatiel into a loving shoulder companion without fear.',
    content: [
      'Day 1-3: Acclimatization. Place the cage at eye level in a calm family room. Talk softly without opening the doors or grabbing.',
      'Target Feeding: Find your bird\'s highest-value treat (millet spray or sunflower seed). Hand-feed it gently through the cage bars.',
      'The "Step Up" Command: Open the cage door and place your forefinger gently against the lower belly just above the feet, saying "Step up" in a warm, consistent tone.',
      'Positive Reinforcement: Never punish, yell, or chase a bird with a towel. Parrots respond exclusively to trust and positive rewards.'
    ]
  }
];
