/**
 * make-admin.js — run once to create/promote an admin user
 * Usage: MONGODB_URI=... node server/scripts/make-admin.js
 *
 * Or promote an existing user:
 *   MONGODB_URI=... ADMIN_EMAIL=you@example.com node server/scripts/make-admin.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@bhotika.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bhotika-admin-2024';
const ADMIN_NAME     = process.env.ADMIN_NAME     || 'Bhotika Admin';

const userSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true, lowercase: true },
  password: String,
  role:     { type: String, default: 'customer' },
  wishlist: [],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('❌  Set MONGODB_URI environment variable first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected to MongoDB');

  let user = await User.findOne({ email: ADMIN_EMAIL });

  if (user) {
    user.role = 'admin';
    await user.save();
    console.log(`✅  Promoted existing user to admin: ${ADMIN_EMAIL}`);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    user = await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hash, role: 'admin' });
    console.log(`✅  Created admin user:`);
    console.log(`    Email:    ${ADMIN_EMAIL}`);
    console.log(`    Password: ${ADMIN_PASSWORD}`);
    console.log(`    ⚠️  Change this password after first login!`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => { console.error(err); process.exit(1); });
