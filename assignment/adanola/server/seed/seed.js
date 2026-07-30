import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { products } from './data.js';
import { configureCloudinary, uploadFromUrl } from '../lib/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;

async function maybeHostOnCloudinary(imageUrls) {
  if (!configureCloudinary()) return { images: imageUrls, cloudinaryIds: [] };

  const images = [];
  const cloudinaryIds = [];

  for (const url of imageUrls) {
    try {
      const result = await uploadFromUrl(url);
      images.push(result.secure_url);
      cloudinaryIds.push(result.public_id);
      console.log('  ↑ Cloudinary:', result.public_id);
    } catch (err) {
      console.warn('  ! Cloudinary upload failed, keeping source URL:', err.message);
      images.push(url);
    }
  }

  return { images, cloudinaryIds };
}

async function seed() {
  if (!uri) {
    console.error('Set MONGODB_URI in .env before seeding.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Product.deleteMany({});
  console.log('Cleared products');

  for (const p of products) {
    console.log('Seeding', p.name);
    const hosted = await maybeHostOnCloudinary(p.images);
    await Product.create({
      ...p,
      images: hosted.images,
      cloudinaryIds: hosted.cloudinaryIds,
      currency: 'EUR',
      inStock: true,
      stock: 50,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@adanola.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'adanola123';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Adanola Admin',
      email: adminEmail,
      password: adminPass,
      role: 'admin',
    });
    console.log(`Admin created: ${adminEmail} / ${adminPass}`);
  } else {
    console.log('Admin already exists');
  }

  console.log(`Done. ${products.length} products seeded.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
