import { Router } from 'express';
import SiteConfig from '../models/SiteConfig.js';
import { isDbConnected } from '../lib/db.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { SITE, IMG } from '../seed/data.js';

const router = Router();

// Default fallback from seed data
const DEFAULT = {
  announcement: SITE.announcement,
  heroHeadline: SITE.hero.headline,
  heroCta: SITE.hero.cta,
  heroImages: SITE.hero.images,
  editorialImages: SITE.editorial.map((e) => e.image),
  whatsappNumber: '',
  contactEmail: 'hello@bhotika.com',
  freeShippingThreshold: 100,
};

// GET /api/site-config — public, used by frontend
router.get('/', async (_req, res) => {
  if (!isDbConnected()) {
    return res.json(DEFAULT);
  }
  try {
    let config = await SiteConfig.findOne({ key: 'main' }).lean();
    if (!config) config = DEFAULT;
    res.json(config);
  } catch (err) {
    console.error(err);
    res.json(DEFAULT);
  }
});

// PUT /api/site-config — admin only
router.put('/', protect, adminOnly, async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ message: 'Database required' });
  }
  try {
    const { announcement, heroHeadline, heroCta, heroImages, editorialImages, whatsappNumber, contactEmail, freeShippingThreshold } = req.body;
    const config = await SiteConfig.findOneAndUpdate(
      { key: 'main' },
      { announcement, heroHeadline, heroCta, heroImages, editorialImages, whatsappNumber, contactEmail, freeShippingThreshold },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save site config' });
  }
});

export default router;
