import { Router } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { isDbConnected } from '../lib/db.js';
import { protect } from '../middleware/auth.js';
import { products as seedProducts } from '../seed/data.js';
import { memoryUsers } from './auth.js';

const router = Router();

function memoryProductById(id) {
  const idx = String(id).replace('mem_', '');
  const i = Number(idx) - 1;
  if (Number.isNaN(i) || !seedProducts[i]) return null;
  return {
    ...seedProducts[i],
    _id: `mem_${i + 1}`,
    id: `mem_${i + 1}`,
    currency: 'EUR',
  };
}

router.get('/', protect, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const mem = [...memoryUsers.values()].find((u) => u.id === req.user.id || u._id === req.user.id);
      const ids = mem?.wishlist || req.user.wishlist || [];
      const items = ids.map(memoryProductById).filter(Boolean);
      return res.json({ wishlist: items });
    }

    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ wishlist: user.wishlist || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load wishlist' });
  }
});

router.post('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isDbConnected()) {
      const mem = [...memoryUsers.values()].find((u) => u.id === req.user.id || u._id === req.user.id);
      if (!mem) return res.status(401).json({ message: 'Login required for wishlist persistence' });
      if (!mem.wishlist.includes(productId)) mem.wishlist.push(productId);
      const items = mem.wishlist.map(memoryProductById).filter(Boolean);
      return res.json({ wishlist: items });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: productId },
    });

    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
});

router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isDbConnected()) {
      const mem = [...memoryUsers.values()].find((u) => u.id === req.user.id || u._id === req.user.id);
      if (mem) mem.wishlist = mem.wishlist.filter((id) => id !== productId);
      const items = (mem?.wishlist || []).map(memoryProductById).filter(Boolean);
      return res.json({ wishlist: items });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: productId },
    });

    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
});

export default router;
