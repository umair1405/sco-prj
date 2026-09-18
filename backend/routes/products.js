import express from 'express';
import { Product } from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/products.json');

const router = express.Router();

const getLocalProducts = () => {
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

const saveLocalProducts = (products) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (e) {}
};

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, size, search } = req.query;
    let filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (size && size !== 'All') {
      filter.sizes = size;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDesc: { $regex: search, $options: 'i' } }
      ];
    }

    const dbProducts = await Product.find(filter).sort({ createdAt: -1 });
    if (dbProducts && dbProducts.length > 0) {
      return res.json({ success: true, count: dbProducts.length, data: dbProducts });
    }

    // Fallback to local file if DB empty
    let local = getLocalProducts();
    if (category && category !== 'all') local = local.filter(p => p.category === category);
    if (size && size !== 'All') local = local.filter(p => p.sizes?.includes(size));
    if (search) {
      const q = search.toLowerCase();
      local = local.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    res.json({ success: true, count: local.length, data: local });
  } catch (err) {
    let local = getLocalProducts();
    res.json({ success: true, count: local.length, data: local });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (product) {
      return res.json({ success: true, data: product });
    }
    const local = getLocalProducts().find(p => p.id === req.params.id);
    if (!local) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: local });
  } catch (err) {
    const local = getLocalProducts().find(p => p.id === req.params.id);
    if (!local) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: local });
  }
});

// POST /api/products (Add product)
router.post('/', async (req, res) => {
  try {
    const newId = req.body.id || ('sen-' + Date.now().toString().slice(-4));
    const productData = {
      id: newId,
      name: req.body.name,
      category: req.body.category || 'onepiece',
      price: Number(req.body.price),
      originalPrice: Number(req.body.originalPrice || req.body.price * 1.3),
      discount: req.body.discount || 20,
      rating: 5.0,
      reviewsCount: 0,
      isBestSeller: Boolean(req.body.isBestSeller),
      isNew: true,
      stock: Number(req.body.stock || 10),
      sizes: req.body.sizes || ['S', 'M', 'L'],
      colors: req.body.colors || [{ name: 'Signature', hex: '#8E704F' }],
      images: req.body.images || ['/products/onepice/1/729660722_18094774553578472_7927858063859501886_n.jpg'],
      shortDesc: req.body.shortDesc || req.body.name,
      description: req.body.description || 'Exclusive piece by Senora & Co.',
      fabric: req.body.fabric || 'Korean Silk & Cotton Blend',
      care: req.body.care || 'Dry clean only',
      delivery: req.body.delivery || 'Ships in 24-48 Hours'
    };

    // Save to MongoDB
    const savedInDb = await Product.create(productData).catch(() => null);

    // Also sync local file
    const local = getLocalProducts();
    local.unshift(productData);
    saveLocalProducts(local);

    res.status(201).json({ success: true, data: savedInDb || productData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.params.id }).catch(() => null);

    let local = getLocalProducts();
    local = local.filter(p => p.id !== req.params.id);
    saveLocalProducts(local);

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
