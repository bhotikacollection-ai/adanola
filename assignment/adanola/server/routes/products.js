import { Router } from 'express';
import Product from '../models/Product.js';
import { isDbConnected } from '../lib/db.js';
import { products as seedProducts, SITE } from '../seed/data.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

function memoryProducts() {
  return seedProducts.map((p, i) => ({
    ...p,
    _id: `mem_${i + 1}`,
    id: `mem_${i + 1}`,
    currency: 'EUR',
    inStock: true,
    stock: 50,
  }));
}

function matchesCategory(p, category) {
  if (!category || category === 'shop') return true;
  const c = category.toLowerCase();
  return (
    p.category === c ||
    (p.tags || []).map((t) => t.toLowerCase()).includes(c)
  );
}

router.get('/', async (req, res) => {
  try {
    const {
      category,
      tag,
      q,
      featured,
      trending,
      newArrival,
      sort = 'newest',
      limit,
    } = req.query;

    if (!isDbConnected()) {
      let list = memoryProducts();

      if (category) list = list.filter((p) => matchesCategory(p, category));
      if (tag) list = list.filter((p) => (p.tags || []).includes(tag) || p.category === tag.toLowerCase());
      if (featured === 'true') list = list.filter((p) => p.featured);
      if (trending === 'true') list = list.filter((p) => p.trending);
      if (newArrival === 'true') list = list.filter((p) => p.newArrival);
      if (q) {
        const s = q.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            (p.description || '').toLowerCase().includes(s) ||
            (p.tags || []).some((t) => t.includes(s))
        );
      }

      if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

      if (limit) list = list.slice(0, Number(limit));

      return res.json({ products: list, total: list.length, source: 'memory' });
    }

    const filter = {};
    if (category && category !== 'shop') {
      filter.$or = [
        { category: category.toLowerCase() },
        { tags: category.toLowerCase() },
      ];
    }
    if (tag) {
      filter.$or = [{ category: tag.toLowerCase() }, { tags: tag.toLowerCase() }];
    }
    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;
    if (newArrival === 'true') filter.newArrival = true;
    if (q) filter.$text = { $search: q };

    let query = Product.find(filter);
    if (sort === 'price-asc') query = query.sort({ price: 1 });
    else if (sort === 'price-desc') query = query.sort({ price: -1 });
    else if (sort === 'name') query = query.sort({ name: 1 });
    else query = query.sort({ createdAt: -1 });

    if (limit) query = query.limit(Number(limit));

    const list = await query.lean();
    res.json({ products: list, total: list.length, source: 'db' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/site', (_req, res) => {
  res.json(SITE);
});

router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    if (!isDbConnected()) {
      const list = memoryProducts();
      const product = list.find(
        (p) => p._id === idOrSlug || p.slug === idOrSlug || p.id === idOrSlug
      );
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const related = list
        .filter((p) => p._id !== product._id && (p.category === product.category || p.tags?.some((t) => product.tags?.includes(t))))
        .slice(0, 4);

      return res.json({ product, related });
    }

    let product = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug: idOrSlug }).lean();
    }
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category }, { tags: { $in: product.tags || [] } }],
    })
      .limit(4)
      .lean();

    res.json({ product, related });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// ── Admin: Create product ────────────────────────────────────────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database required for admin operations' });
    }
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Failed to create product' });
  }
});

// ── Admin: Update product ────────────────────────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database required for admin operations' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Failed to update product' });
  }
});

// ── Admin: Delete product ────────────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database required for admin operations' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

export default router;
