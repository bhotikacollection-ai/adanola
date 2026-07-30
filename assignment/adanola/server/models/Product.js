import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema(
  {
    name: String,
    hex: String,
    image: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'EUR' },
    category: {
      type: String,
      required: true,
      enum: ['shop', 'active', 'sweats', 'spring-summer', 'hoodies', 'shorts', 't-shirts', 'leggings', 'sets'],
    },
    tags: [String],
    colors: [colorSchema],
    sizes: [{ type: String }],
    images: [{ type: String }],
    cloudinaryIds: [{ type: String }],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 50 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, featured: 1, trending: 1 });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
