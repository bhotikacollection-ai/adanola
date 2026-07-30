import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    announcement: { type: String, default: '🇳🇵 Handcrafted in Nepal — FREE Delivery on orders over $100' },
    heroHeadline: { type: String, default: 'Himalayan Craftsmanship' },
    heroCta: { type: String, default: 'SHOP COLLECTION' },
    heroImages: [{ type: String }],
    editorialImages: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema);
