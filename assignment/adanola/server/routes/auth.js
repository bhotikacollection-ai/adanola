import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { isDbConnected } from '../lib/db.js';
import { protect, signToken } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Simple in-memory users when DB is offline
const memoryUsers = new Map();

router.post(
  '/register',
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      if (!isDbConnected()) {
        if (memoryUsers.has(email)) {
          return res.status(400).json({ message: 'Email already registered' });
        }
        const id = `user_${memoryUsers.size + 1}`;
        const hash = await bcrypt.hash(password, 12);
        const user = {
          _id: id,
          id,
          name,
          email,
          password: hash,
          role: 'customer',
          wishlist: [],
          toSafeJSON() {
            return { id: this.id, name: this.name, email: this.email, role: this.role, wishlist: this.wishlist };
          },
        };
        memoryUsers.set(email, user);
        const token = signToken(user);
        return res.status(201).json({ token, user: user.toSafeJSON() });
      }

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already registered' });

      const user = await User.create({ name, email, password });
      const token = signToken(user);
      res.status(201).json({ token, user: user.toSafeJSON() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Registration failed' });
    }
  }
);

router.post(
  '/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const { email, password } = req.body;

    try {
      if (!isDbConnected()) {
        const user = memoryUsers.get(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = signToken(user);
        return res.json({ token, user: user.toSafeJSON() });
      }

      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = signToken(user);
      res.json({ token, user: user.toSafeJSON() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Login failed' });
    }
  }
);

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toSafeJSON ? req.user.toSafeJSON() : req.user });
});

export default router;
export { memoryUsers };
