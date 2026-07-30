import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { isDbConnected } from '../lib/db.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { products as seedProducts } from '../seed/data.js';

const router = Router();
const FREE_SHIPPING = 125;
const memoryOrders = [];

function resolveMemoryProduct(id) {
  const i = Number(String(id).replace('mem_', '')) - 1;
  return seedProducts[i] ? { ...seedProducts[i], _id: `mem_${i + 1}` } : null;
}

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { items, email, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const lineItems = [];
    let subtotal = 0;

    for (const item of items) {
      let product = null;

      if (isDbConnected() && String(item.productId).match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(item.productId).lean();
      } else {
        product = resolveMemoryProduct(item.productId);
      }

      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = product.price;
      subtotal += price * qty;

      lineItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price,
        quantity: qty,
        size: item.size || '',
        color: item.color || '',
      });
    }

    const shipping = subtotal >= FREE_SHIPPING ? 0 : 6.95;
    const total = subtotal + shipping;

    if (!isDbConnected()) {
      const order = {
        _id: `ord_${memoryOrders.length + 1}`,
        id: `ord_${memoryOrders.length + 1}`,
        email,
        items: lineItems,
        shippingAddress,
        subtotal,
        shipping,
        total,
        currency: 'EUR',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      memoryOrders.push(order);
      return res.status(201).json({ order, message: 'Order placed (demo mode)' });
    }

    const order = await Order.create({
      user: req.auth?.id || undefined,
      email,
      items: lineItems,
      shippingAddress,
      subtotal,
      shipping,
      total,
      currency: 'EUR',
      status: 'pending',
    });

    res.status(201).json({ order, message: 'Order placed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

router.get('/mine', protect, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const list = memoryOrders.filter((o) => o.email === req.user.email);
      return res.json({ orders: list });
    }

    const orders = await Order.find({
      $or: [{ user: req.user._id }, { email: req.user.email }],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

export default router;
