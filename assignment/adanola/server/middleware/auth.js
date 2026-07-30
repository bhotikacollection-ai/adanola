import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../lib/db.js';

export function signToken(user) {
  const secret = process.env.JWT_SECRET || 'adanola-dev-secret-change-me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    secret,
    { expiresIn }
  );
}

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const secret = process.env.JWT_SECRET || 'adanola-dev-secret-change-me';
    const decoded = jwt.verify(token, secret);

    if (isDbConnected()) {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user;
    } else {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'customer',
        name: decoded.name || 'Guest',
        wishlist: [],
        toSafeJSON() {
          return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            wishlist: this.wishlist,
          };
        },
      };
    }

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    const secret = process.env.JWT_SECRET || 'adanola-dev-secret-change-me';
    req.auth = jwt.verify(token, secret);
  } catch {
    /* ignore */
  }
  next();
}

export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}
