import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, DBProduct, DBCategory, DBOrder, DBCoupon, DBStoreSettings } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const apiRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'bird-zone-wapda-town-secret-key-2026';
const UPLOADS_DIR = path.resolve(__dirname, '..', '..', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage for persistent images
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) && (mime.startsWith('image/') || allowed.test(mime))) {
      cb(null, true);
    } else {
      cb(new Error('Only valid image files (JPG, PNG, WebP, GIF) up to 5MB are allowed.'));
    }
  },
});

// Authentication Middleware
export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'staff';
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid token.' });
  }
};

export const requireOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'owner') {
      return res.status(403).json({ error: 'Forbidden: Requires Owner permissions.' });
    }
    next();
  });
};

// -------------------------------------------------------------
// 1. AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------

apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const users = db.get('users');
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.status !== 'active') {
    return res.status(401).json({ error: 'Invalid email credentials or inactive account.' });
  }

  const matches = bcrypt.compareSync(password, user.passwordHash);
  if (!matches) {
    return res.status(401).json({ error: 'Invalid password credentials.' });
  }

  // Update last login
  db.mutate((draft) => {
    const u = draft.users.find((x) => x.id === user.id);
    if (u) u.lastLoginAt = new Date().toISOString();
  });

  db.logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'user_login',
    details: `User ${user.email} logged into Bird Zone Admin.`,
    ipAddress: req.ip,
  });

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthRequest, res) => {
  const users = db.get('users');
  const user = users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }
  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    lastLoginAt: user.lastLoginAt,
  });
});

apiRouter.post('/auth/change-password', requireAuth, (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  let updated = false;
  db.mutate((draft) => {
    const user = draft.users.find((u) => u.id === req.user?.id);
    if (user && bcrypt.compareSync(currentPassword, user.passwordHash)) {
      user.passwordHash = bcrypt.hashSync(newPassword, 10);
      updated = true;
    }
  });

  if (!updated) {
    return res.status(400).json({ error: 'Current password incorrect.' });
  }

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'password_change',
    details: 'User updated their account password.',
  });

  return res.json({ success: true, message: 'Password updated successfully.' });
});

apiRouter.get('/auth/team', requireOwner, (_req, res) => {
  const users = db.get('users').map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
  }));
  return res.json(users);
});

apiRouter.post('/auth/team', requireOwner, (req: AuthRequest, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, email, password, role) are required.' });
  }

  const users = db.get('users');
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: role === 'owner' ? ('owner' as const) : ('staff' as const),
    status: 'active' as const,
    createdAt: new Date().toISOString(),
  };

  db.mutate((draft) => {
    draft.users.push(newUser);
  });

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'create_team_member',
    details: `Added new ${role} account: ${email}`,
  });

  return res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
  });
});

// -------------------------------------------------------------
// 2. IMAGE UPLOAD
// -------------------------------------------------------------

apiRouter.post('/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// -------------------------------------------------------------
// 3. PRODUCTS MANAGEMENT
// -------------------------------------------------------------

apiRouter.get('/products', (req, res) => {
  const { category, search, status, sort, page = '1', limit = '50', admin = 'false' } = req.query;

  let products = db.get('products');

  // If public storefront, only show published
  if (admin !== 'true') {
    products = products.filter((p) => p.productStatus === 'published');
  } else if (status && status !== 'all') {
    products = products.filter((p) => p.productStatus === status);
  }

  if (category && category !== 'All') {
    products = products.filter(
      (p) => p.categoryId === category || p.categoryName.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (search) {
    const q = (search as string).toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameUrdu.includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort
  if (sort === 'price-asc') {
    products.sort((a, b) => (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice));
  } else if (sort === 'price-desc') {
    products.sort((a, b) => (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice));
  } else if (sort === 'stock-asc') {
    products.sort((a, b) => a.stockQuantity - b.stockQuantity);
  } else {
    // Default featured first or newest
    products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const total = products.length;
  const paginated = products.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.json({
    products: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

apiRouter.get('/products/:id', (req, res) => {
  const product = db.get('products').find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  return res.json(product);
});

apiRouter.post('/products', requireAuth, (req: AuthRequest, res) => {
  const body = req.body;
  if (!body.name || !body.regularPrice || !body.sku) {
    return res.status(400).json({ error: 'Product name, SKU, and regular price in PKR are required.' });
  }

  const slug = (body.slug || body.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const id = `prod-${Date.now()}`;
  const regularPrice = Number(body.regularPrice);
  const salePrice = body.salePrice ? Number(body.salePrice) : undefined;
  const stockQuantity = Number(body.stockQuantity ?? 10);
  const lowStockThreshold = Number(body.lowStockThreshold ?? 2);

  let availabilityStatus: DBProduct['availabilityStatus'] = 'in_stock';
  if (stockQuantity <= 0) availabilityStatus = 'out_of_stock';
  else if (stockQuantity <= lowStockThreshold) availabilityStatus = 'low_stock';
  if (body.availabilityStatus === 'enquiry_only') availabilityStatus = 'enquiry_only';

  const newProduct: DBProduct = {
    id,
    name: body.name,
    nameUrdu: body.nameUrdu || '',
    slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
    sku: body.sku.toUpperCase(),
    categoryId: body.categoryId || 'cat-exotic-birds',
    categoryName: body.categoryName || 'Exotic Birds',
    shortDescription: body.shortDescription || '',
    description: body.description || '',
    regularPrice,
    salePrice,
    stockQuantity,
    lowStockThreshold,
    availabilityStatus,
    productStatus: body.productStatus || 'published',
    productType: body.productType || 'Bird',
    isFeatured: Boolean(body.isFeatured),
    mainImage: body.mainImage || '/src/assets/images/hero_colorful_parrot_1790931293239.jpg',
    galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [body.mainImage].filter(Boolean),
    imageAlt: body.imageAlt || body.name,
    weight: body.weight || '',
    dimensions: body.dimensions || '',
    careInstructions: body.careInstructions || '',
    diet: body.diet || '',
    origin: body.origin || 'Bird Zone Wapda Town',
    tags: Array.isArray(body.tags) ? body.tags : [],
    seoTitle: body.seoTitle || `${body.name} | Bird Zone Wapda Town`,
    seoDescription: body.seoDescription || body.shortDescription || '',
    species: body.species || '',
    ageRange: body.ageRange || '',
    handTamed: Boolean(body.handTamed),
    availabilityNotes: body.availabilityNotes || '',
    deliveryEligibility: body.deliveryEligibility || 'all',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.mutate((draft) => {
    draft.products.unshift(newProduct);
    draft.inventoryMovements.unshift({
      id: `mov-${Date.now()}`,
      productId: id,
      productName: newProduct.name,
      sku: newProduct.sku,
      changeAmount: stockQuantity,
      reason: 'manual_adjustment',
      previousStock: 0,
      newStock: stockQuantity,
      adminName: req.user!.name,
      timestamp: new Date().toISOString(),
    });
  });

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'create_product',
    details: `Added new product: ${newProduct.name} (${newProduct.sku}) at PKR ${newProduct.salePrice || newProduct.regularPrice}`,
  });

  return res.status(201).json(newProduct);
});

apiRouter.put('/products/:id', requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const body = req.body;

  let updatedProduct: DBProduct | undefined;
  let stockDelta = 0;
  let oldStock = 0;

  db.mutate((draft) => {
    const idx = draft.products.findIndex((p) => p.id === id);
    if (idx === -1) return;

    const existing = draft.products[idx];
    oldStock = existing.stockQuantity;
    const newStock = body.stockQuantity !== undefined ? Number(body.stockQuantity) : existing.stockQuantity;
    stockDelta = newStock - oldStock;

    const lowStockThreshold =
      body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : existing.lowStockThreshold;

    let availabilityStatus: DBProduct['availabilityStatus'] = 'in_stock';
    if (newStock <= 0) availabilityStatus = 'out_of_stock';
    else if (newStock <= lowStockThreshold) availabilityStatus = 'low_stock';
    if (body.availabilityStatus === 'enquiry_only') availabilityStatus = 'enquiry_only';

    draft.products[idx] = {
      ...existing,
      ...body,
      id: existing.id,
      regularPrice: Number(body.regularPrice ?? existing.regularPrice),
      salePrice: body.salePrice !== undefined ? (body.salePrice ? Number(body.salePrice) : undefined) : existing.salePrice,
      stockQuantity: newStock,
      lowStockThreshold,
      availabilityStatus,
      updatedAt: new Date().toISOString(),
    };

    updatedProduct = draft.products[idx];

    if (stockDelta !== 0) {
      draft.inventoryMovements.unshift({
        id: `mov-${Date.now()}`,
        productId: id,
        productName: draft.products[idx].name,
        sku: draft.products[idx].sku,
        changeAmount: stockDelta,
        reason: 'manual_adjustment',
        previousStock: oldStock,
        newStock,
        adminName: req.user!.name,
        timestamp: new Date().toISOString(),
      });
    }
  });

  const finalUpdated = updatedProduct as DBProduct | undefined;
  if (!finalUpdated) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'update_product',
    details: `Updated product ${finalUpdated.name} (${finalUpdated.sku}). Stock: ${oldStock} -> ${finalUpdated.stockQuantity}`,
  });

  return res.json(finalUpdated);
});

apiRouter.delete('/products/:id', requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  let deleted: DBProduct | undefined;

  db.mutate((draft) => {
    const idx = draft.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      deleted = draft.products.splice(idx, 1)[0];
    }
  });

  const finalDeleted = deleted as DBProduct | undefined;
  if (!finalDeleted) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'delete_product',
    details: `Deleted product: ${finalDeleted.name} (${finalDeleted.sku})`,
  });

  return res.json({ success: true, message: `Product ${finalDeleted.name} deleted.` });
});

apiRouter.post('/products/:id/duplicate', requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  let duplicated: DBProduct | null = null;

  db.mutate((draft) => {
    const orig = draft.products.find((p) => p.id === id);
    if (!orig) return;

    duplicated = {
      ...orig,
      id: `prod-${Date.now()}`,
      name: `${orig.name} (Copy)`,
      slug: `${orig.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sku: `${orig.sku}-COPY`,
      productStatus: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    draft.products.unshift(duplicated);
  });

  if (!duplicated) {
    return res.status(404).json({ error: 'Original product not found.' });
  }

  return res.status(201).json(duplicated);
});

apiRouter.patch('/products/bulk', requireAuth, (req: AuthRequest, res) => {
  const { ids, action, value } = req.body;
  if (!Array.isArray(ids) || ids.length === 0 || !action) {
    return res.status(400).json({ error: 'Product IDs and action are required.' });
  }

  let count = 0;
  db.mutate((draft) => {
    if (action === 'delete') {
      draft.products = draft.products.filter((p) => !ids.includes(p.id));
      count = ids.length;
    } else if (action === 'status') {
      draft.products.forEach((p) => {
        if (ids.includes(p.id)) {
          p.productStatus = value;
          p.updatedAt = new Date().toISOString();
          count++;
        }
      });
    } else if (action === 'featured') {
      draft.products.forEach((p) => {
        if (ids.includes(p.id)) {
          p.isFeatured = Boolean(value);
          p.updatedAt = new Date().toISOString();
          count++;
        }
      });
    }
  });

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'bulk_product_action',
    details: `Performed bulk ${action} on ${count} products.`,
  });

  return res.json({ success: true, count });
});

// -------------------------------------------------------------
// 4. CATEGORIES MANAGEMENT
// -------------------------------------------------------------

apiRouter.get('/categories', (_req, res) => {
  const categories = db.get('categories');
  const products = db.get('products');

  const withCounts = categories.map((cat) => ({
    ...cat,
    productCount: products.filter((p) => p.categoryId === cat.id || p.categoryName === cat.name).length,
  }));

  return res.json(withCounts.sort((a, b) => a.displayOrder - b.displayOrder));
});

apiRouter.post('/categories', requireAuth, (req: AuthRequest, res) => {
  const { name, nameUrdu, description, thumbnail, iconName, displayOrder, seoTitle, seoDescription } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newCat: DBCategory = {
    id: `cat-${slug}-${Date.now().toString().slice(-4)}`,
    name,
    nameUrdu: nameUrdu || '',
    slug,
    description: description || '',
    thumbnail: thumbnail || '/src/assets/images/product_spacious_bird_cage_1790931327322.jpg',
    iconName: iconName || 'Bird',
    displayOrder: Number(displayOrder || 10),
    active: true,
    seoTitle: seoTitle || `${name} | Bird Zone Wapda Town`,
    seoDescription: seoDescription || description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.mutate((draft) => {
    draft.categories.push(newCat);
  });

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'create_category',
    details: `Created category: ${newCat.name}`,
  });

  return res.status(201).json(newCat);
});

apiRouter.put('/categories/:id', requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const body = req.body;

  let updated: DBCategory | null = null;
  db.mutate((draft) => {
    const idx = draft.categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      draft.categories[idx] = {
        ...draft.categories[idx],
        ...body,
        id: draft.categories[idx].id,
        updatedAt: new Date().toISOString(),
      };
      updated = draft.categories[idx];
    }
  });

  if (!updated) {
    return res.status(404).json({ error: 'Category not found.' });
  }

  return res.json(updated);
});

apiRouter.delete('/categories/:id', requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { reassignTo } = req.body;

  const products = db.get('products');
  const itemsInCat = products.filter((p) => p.categoryId === id);

  if (itemsInCat.length > 0 && !reassignTo) {
    return res.status(400).json({
      error: `Category contains ${itemsInCat.length} products. Please specify 'reassignTo' category ID or delete products first.`,
      productCount: itemsInCat.length,
    });
  }

  let deleted: DBCategory | undefined;
  db.mutate((draft) => {
    if (reassignTo) {
      const targetCat = draft.categories.find((c) => c.id === reassignTo);
      if (targetCat) {
        draft.products.forEach((p) => {
          if (p.categoryId === id) {
            p.categoryId = targetCat.id;
            p.categoryName = targetCat.name;
          }
        });
      }
    }
    const idx = draft.categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      deleted = draft.categories.splice(idx, 1)[0];
    }
  });

  const finalDeleted = deleted as DBCategory | undefined;
  if (!finalDeleted) {
    return res.status(404).json({ error: 'Category not found.' });
  }

  return res.json({ success: true, message: `Category ${finalDeleted.name} deleted.` });
});

// -------------------------------------------------------------
// 5. ORDERS MANAGEMENT & CHECKOUT
// -------------------------------------------------------------

apiRouter.get('/orders', requireAuth, (req, res) => {
  const { status, paymentStatus, search, sort = 'desc', page = '1', limit = '50' } = req.query;

  let orders = [...db.get('orders')];

  if (status && status !== 'all') {
    orders = orders.filter((o) => o.orderStatus === status);
  }

  if (paymentStatus && paymentStatus !== 'all') {
    orders = orders.filter((o) => o.paymentStatus === paymentStatus);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
        o.deliveryAddress.toLowerCase().includes(q)
    );
  }

  orders.sort((a, b) => {
    const tA = new Date(a.createdAt).getTime();
    const tB = new Date(b.createdAt).getTime();
    return sort === 'asc' ? tA - tB : tB - tA;
  });

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const total = orders.length;
  const paginated = orders.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.json({
    orders: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

apiRouter.get('/orders/:id', requireAuth, (req, res) => {
  const order = db.get('orders').find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  return res.json(order);
});

// Public storefront checkout order creation
apiRouter.post('/orders', (req, res) => {
  const { customerName, customerPhone, customerEmail, deliveryAddress, cityArea, deliveryZoneId, items, paymentMethod, transactionId, customerNotes, couponCode } = req.body;

  if (!customerName || !customerPhone || !deliveryAddress || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer name, phone, address, and at least one item are required.' });
  }

  const products = db.get('products');
  const settings = db.get('settings');

  // Verify stock & calculate true totals server-side
  let subtotal = 0;
  const orderItems: DBOrder['items'] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId || p.id === item.product?.id);
    if (!product) {
      return res.status(400).json({ error: `Product with ID ${item.productId} does not exist.` });
    }

    const price = product.salePrice || product.regularPrice;
    const qty = Math.max(1, Number(item.quantity || 1));

    if (product.availabilityStatus !== 'enquiry_only' && product.stockQuantity < qty) {
      return res.status(400).json({
        error: `Insufficient stock for "${product.name}". Only ${product.stockQuantity} available.`,
      });
    }

    const itemTotal = price * qty;
    subtotal += itemTotal;

    orderItems.push({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      price,
      quantity: qty,
      total: itemTotal,
      image: product.mainImage,
    });
  }

  // Delivery zone calculation
  const zone = settings.delivery.zones.find((z) => z.id === deliveryZoneId) || settings.delivery.zones[0];
  const isFreeDelivery = zone.freeDeliveryThreshold && subtotal >= zone.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : zone.rate;

  // Coupon discount validation
  let discount = 0;
  if (couponCode) {
    const coupons = db.get('coupons');
    const cpn = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);
    if (cpn && subtotal >= cpn.minOrderValue) {
      if (cpn.discountType === 'percentage') {
        discount = Math.round((subtotal * cpn.discountValue) / 100);
        if (cpn.maxDiscount && discount > cpn.maxDiscount) discount = cpn.maxDiscount;
      } else {
        discount = cpn.discountValue;
      }
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);
  const orderNumber = `BZ-LHR-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newOrder: DBOrder = {
    id: orderNumber,
    orderNumber,
    customerName,
    customerPhone,
    customerEmail: customerEmail || undefined,
    deliveryAddress,
    cityArea: cityArea || 'Wapda Town Phase 1, Lahore',
    deliveryZoneId: zone.id,
    deliveryZoneName: zone.name,
    items: orderItems,
    subtotal,
    deliveryFee,
    discount,
    couponCode: discount > 0 ? couponCode : undefined,
    total: grandTotal,
    orderStatus: 'Pending Confirmation',
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa' ? 'Pending' : 'Unpaid',
    transactionId: transactionId || undefined,
    customerNotes: customerNotes || undefined,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: 'Pending Confirmation',
        timestamp: now,
        updatedBy: 'System (Online Storefront)',
        note: `Order placed via website checkout (${paymentMethod.toUpperCase()})`,
      },
    ],
  };

  // Atomically update DB: save order, decrement product stock, create customer record, generate notification
  db.mutate((draft) => {
    draft.orders.unshift(newOrder);

    // Decrement stock & record inventory movement
    orderItems.forEach((it) => {
      const prod = draft.products.find((p) => p.id === it.productId);
      if (prod) {
        const prev = prod.stockQuantity;
        prod.stockQuantity = Math.max(0, prod.stockQuantity - it.quantity);
        if (prod.stockQuantity <= 0) {
          prod.availabilityStatus = 'out_of_stock';
        } else if (prod.stockQuantity <= prod.lowStockThreshold) {
          prod.availabilityStatus = 'low_stock';
        }

        draft.inventoryMovements.unshift({
          id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          changeAmount: -it.quantity,
          reason: 'sale',
          previousStock: prev,
          newStock: prod.stockQuantity,
          referenceId: orderNumber,
          adminName: 'System (Storefront Order)',
          timestamp: now,
        });

        // Trigger low-stock alert if threshold reached
        if (prod.stockQuantity <= prod.lowStockThreshold) {
          draft.notifications.unshift({
            id: `notif-${Date.now()}`,
            type: prod.stockQuantity === 0 ? 'out_of_stock' : 'low_stock',
            title: prod.stockQuantity === 0 ? 'Product Out of Stock' : 'Low Stock Warning',
            message: `${prod.name} (${prod.sku}) has only ${prod.stockQuantity} remaining.`,
            read: false,
            link: '/admin/inventory',
            createdAt: now,
          });
        }
      }
    });

    // Customer record creation or update
    const existingCust = draft.customers.find((c) => c.phone === customerPhone);
    if (existingCust) {
      existingCust.totalOrders += 1;
      existingCust.totalSpent += grandTotal;
      existingCust.lastOrderDate = now;
      if (!existingCust.addresses.includes(deliveryAddress)) {
        existingCust.addresses.push(deliveryAddress);
      }
    } else {
      draft.customers.unshift({
        id: `cust-${Date.now()}`,
        name: customerName,
        phone: customerPhone,
        email: customerEmail || undefined,
        totalOrders: 1,
        totalSpent: grandTotal,
        lastOrderDate: now,
        addresses: [deliveryAddress],
        status: 'active',
        createdAt: now,
        updatedAt: now,
      });
    }

    // New Order Notification for Admin
    draft.notifications.unshift({
      id: `notif-${Date.now()}-ord`,
      type: 'new_order',
      title: 'New Order Received',
      message: `Order #${orderNumber} from ${customerName} (${zone.name}) for PKR ${grandTotal.toLocaleString()}.`,
      read: false,
      link: `/admin/orders`,
      createdAt: now,
    });
  });

  return res.status(201).json(newOrder);
});

apiRouter.patch('/orders/:id/status', requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus, note, reason } = req.body;

  let updatedOrder: DBOrder | null = null;
  let restockRequired = false;

  db.mutate((draft) => {
    const order = draft.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return;

    const previousStatus = order.orderStatus;
    const now = new Date().toISOString();

    // Check if moving to Cancelled from non-cancelled status -> restore stock safely
    if (orderStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
      restockRequired = true;
      order.cancellationReason = reason || 'Cancelled by admin request';
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = now;

    order.statusHistory.push({
      status: orderStatus || order.orderStatus,
      timestamp: now,
      updatedBy: req.user!.name,
      note: note || reason || `Status changed from ${previousStatus} to ${orderStatus || order.orderStatus}`,
    });

    // Handle stock restoration if cancelled
    if (restockRequired) {
      order.items.forEach((it) => {
        const prod = draft.products.find((p) => p.id === it.productId);
        if (prod) {
          const prev = prod.stockQuantity;
          prod.stockQuantity += it.quantity;
          if (prod.stockQuantity > prod.lowStockThreshold) {
            prod.availabilityStatus = 'in_stock';
          }
          draft.inventoryMovements.unshift({
            id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            changeAmount: it.quantity,
            reason: 'order_cancelled',
            previousStock: prev,
            newStock: prod.stockQuantity,
            referenceId: order.orderNumber,
            adminName: req.user!.name,
            timestamp: now,
          });
        }
      });
    }

    updatedOrder = order;
  });

  if (!updatedOrder) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'update_order_status',
    details: `Order #${(updatedOrder as DBOrder).orderNumber} updated to ${orderStatus || 'unchanged'} (Payment: ${paymentStatus || 'unchanged'})`,
  });

  return res.json(updatedOrder);
});

apiRouter.post('/orders/:id/notes', requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const { internalNotes } = req.body;

  let order: DBOrder | undefined;
  db.mutate((draft) => {
    order = draft.orders.find((o) => o.id === id || o.orderNumber === id);
    if (order) {
      order.internalNotes = internalNotes;
      order.updatedAt = new Date().toISOString();
    }
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  return res.json({ success: true, internalNotes });
});

// -------------------------------------------------------------
// 6. CUSTOMERS MANAGEMENT
// -------------------------------------------------------------

apiRouter.get('/customers', requireAuth, (req, res) => {
  const { search } = req.query;
  let customers = db.get('customers');

  if (search) {
    const q = (search as string).toLowerCase();
    customers = customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q))
    );
  }

  return res.json(customers);
});

apiRouter.get('/customers/:id', requireAuth, (req, res) => {
  const customer = db.get('customers').find((c) => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found.' });
  }

  const orders = db.get('orders').filter((o) => o.customerPhone === customer.phone);
  return res.json({ customer, orders });
});

// -------------------------------------------------------------
// 7. INVENTORY MANAGEMENT
// -------------------------------------------------------------

apiRouter.get('/inventory', requireAuth, (_req, res) => {
  const products = db.get('products');
  const movements = db.get('inventoryMovements');

  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold);
  const outOfStock = products.filter((p) => p.stockQuantity === 0);

  return res.json({
    summary: {
      totalProducts,
      totalUnits: products.reduce((sum, p) => sum + p.stockQuantity, 0),
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
    },
    lowStock,
    outOfStock,
    recentMovements: movements.slice(0, 50),
  });
});

apiRouter.post('/inventory/adjust', requireAuth, (req: AuthRequest, res) => {
  const { productId, newStock, reason, notes } = req.body;
  if (!productId || newStock === undefined || !reason) {
    return res.status(400).json({ error: 'Product ID, new stock quantity, and adjustment reason are required.' });
  }

  let updatedProduct: DBProduct | null = null;
  const now = new Date().toISOString();

  db.mutate((draft) => {
    const prod = draft.products.find((p) => p.id === productId);
    if (!prod) return;

    const prev = prod.stockQuantity;
    const target = Number(newStock);
    const delta = target - prev;

    prod.stockQuantity = target;
    if (prod.stockQuantity <= 0) {
      prod.availabilityStatus = 'out_of_stock';
    } else if (prod.stockQuantity <= prod.lowStockThreshold) {
      prod.availabilityStatus = 'low_stock';
    } else {
      prod.availabilityStatus = 'in_stock';
    }
    prod.updatedAt = now;

    draft.inventoryMovements.unshift({
      id: `mov-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      changeAmount: delta,
      reason,
      previousStock: prev,
      newStock: target,
      referenceId: notes,
      adminName: req.user!.name,
      timestamp: now,
    });

    updatedProduct = prod;
  });

  if (!updatedProduct) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'inventory_adjustment',
    details: `Adjusted ${(updatedProduct as DBProduct).name} stock to ${newStock}. Reason: ${reason}`,
  });

  return res.json(updatedProduct);
});

// -------------------------------------------------------------
// 8. COUPONS MANAGEMENT
// -------------------------------------------------------------

apiRouter.get('/coupons', requireAuth, (_req, res) => {
  return res.json(db.get('coupons'));
});

apiRouter.post('/coupons', requireAuth, (req: AuthRequest, res) => {
  const { code, discountType, discountValue, minOrderValue, maxDiscount, startDate, expiryDate, usageLimit } = req.body;
  if (!code || !discountValue) {
    return res.status(400).json({ error: 'Coupon code and discount value are required.' });
  }

  const newCoupon: DBCoupon = {
    id: `cpn-${Date.now()}`,
    code: code.toUpperCase().trim(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minOrderValue: Number(minOrderValue || 0),
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    startDate: startDate || new Date().toISOString().slice(0, 10),
    expiryDate: expiryDate || '2026-12-31',
    usageLimit: Number(usageLimit || 100),
    usageCount: 0,
    active: true,
    createdAt: new Date().toISOString(),
  };

  db.mutate((draft) => {
    draft.coupons.unshift(newCoupon);
  });

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'create_coupon',
    details: `Created coupon code ${newCoupon.code}`,
  });

  return res.status(201).json(newCoupon);
});

apiRouter.post('/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required.' });
  }

  const coupons = db.get('coupons');
  const cpn = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());

  if (!cpn || !cpn.active) {
    return res.status(400).json({ error: 'Invalid or inactive coupon code.' });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (today < cpn.startDate || today > cpn.expiryDate) {
    return res.status(400).json({ error: 'This coupon has expired.' });
  }

  if (cpn.usageCount >= cpn.usageLimit) {
    return res.status(400).json({ error: 'This coupon usage limit has been reached.' });
  }

  const cartSubtotal = Number(subtotal || 0);
  if (cartSubtotal < cpn.minOrderValue) {
    return res.status(400).json({
      error: `Minimum order value for this coupon is PKR ${cpn.minOrderValue.toLocaleString()}.`,
    });
  }

  let discount = 0;
  if (cpn.discountType === 'percentage') {
    discount = Math.round((cartSubtotal * cpn.discountValue) / 100);
    if (cpn.maxDiscount && discount > cpn.maxDiscount) discount = cpn.maxDiscount;
  } else {
    discount = cpn.discountValue;
  }

  return res.json({
    valid: true,
    code: cpn.code,
    discountType: cpn.discountType,
    discountValue: cpn.discountValue,
    discountAmount: discount,
  });
});

// -------------------------------------------------------------
// 9. REPORTS AND ANALYTICS
// -------------------------------------------------------------

apiRouter.get('/reports', requireAuth, (_req, res) => {
  const orders = db.get('orders');
  const products = db.get('products');

  // Filter out cancelled orders for real financial reporting
  const validOrders = orders.filter((o) => o.orderStatus !== 'Cancelled');
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'Cancelled');

  const totalGrossSales = validOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDeliveryCollected = validOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
  const totalDiscountsGiven = validOrders.reduce((sum, o) => sum + o.discount, 0);
  const netRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => {
    statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
  });

  // Payment breakdown
  const paymentCounts: Record<string, { count: number; total: number }> = {};
  validOrders.forEach((o) => {
    if (!paymentCounts[o.paymentMethod]) {
      paymentCounts[o.paymentMethod] = { count: 0, total: 0 };
    }
    paymentCounts[o.paymentMethod].count += 1;
    paymentCounts[o.paymentMethod].total += o.total;
  });

  // Top products
  const productSalesMap: Record<string, { name: string; quantity: number; revenue: number; sku: string }> = {};
  validOrders.forEach((o) => {
    o.items.forEach((it) => {
      if (!productSalesMap[it.productId]) {
        productSalesMap[it.productId] = { name: it.productName, sku: it.sku, quantity: 0, revenue: 0 };
      }
      productSalesMap[it.productId].quantity += it.quantity;
      productSalesMap[it.productId].revenue += it.total;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  // Recent 7 days sales
  const last7Days: Array<{ date: string; sales: number; orders: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const dayOrders = validOrders.filter((o) => o.createdAt.slice(0, 10) === d);
    last7Days.push({
      date: d,
      sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
  }

  return res.json({
    metrics: {
      totalOrders: orders.length,
      validOrdersCount: validOrders.length,
      cancelledOrdersCount: cancelledOrders.length,
      pendingConfirmation: orders.filter((o) => o.orderStatus === 'Pending Confirmation').length,
      processingCount: orders.filter((o) => ['Confirmed', 'Processing', 'Ready for Pickup'].includes(o.orderStatus)).length,
      completedOrdersCount: orders.filter((o) => o.orderStatus === 'Delivered').length,
      totalProductsCount: products.length,
      lowStockCount: products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length,
      outOfStockCount: products.filter((p) => p.stockQuantity === 0).length,
      totalGrossSales,
      totalDeliveryCollected,
      totalDiscountsGiven,
      netRevenue,
    },
    statusCounts,
    paymentCounts,
    topProducts,
    last7Days,
  });
});

// -------------------------------------------------------------
// 10. SETTINGS & STOREFRONT SYNC
// -------------------------------------------------------------

apiRouter.get('/settings', (_req, res) => {
  return res.json(db.get('settings'));
});

apiRouter.put('/settings', requireOwner, (req: AuthRequest, res) => {
  const newSettings: DBStoreSettings = req.body;

  db.set('settings', newSettings);

  db.logAudit({
    userId: req.user!.id,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'settings_update',
    details: 'Store settings (delivery, payment, content) updated.',
  });

  return res.json(newSettings);
});

// -------------------------------------------------------------
// 11. NOTIFICATIONS & AUDIT LOGS
// -------------------------------------------------------------

apiRouter.get('/notifications', requireAuth, (_req, res) => {
  return res.json(db.get('notifications'));
});

apiRouter.patch('/notifications/:id/read', requireAuth, (req, res) => {
  db.mutate((draft) => {
    const notif = draft.notifications.find((n) => n.id === req.params.id);
    if (notif) notif.read = true;
  });
  return res.json({ success: true });
});

apiRouter.patch('/notifications/read-all', requireAuth, (_req, res) => {
  db.mutate((draft) => {
    draft.notifications.forEach((n) => (n.read = true));
  });
  return res.json({ success: true });
});

apiRouter.get('/audit-logs', requireOwner, (_req, res) => {
  return res.json(db.get('auditLogs'));
});
