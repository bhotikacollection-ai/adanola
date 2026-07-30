/**
 * Vercel serverless entry for /api/*
 * Boots Mongo + Cloudinary once, then hands off to Express.
 */
import dotenv from 'dotenv';
import app from '../server/app.js';
import { connectDB } from '../server/lib/db.js';
import { configureCloudinary } from '../server/lib/cloudinary.js';

dotenv.config();

let ready;

async function ensureReady() {
  if (!ready) {
    ready = (async () => {
      try {
        await connectDB();
      } catch (err) {
        console.warn('[vercel] DB connect failed:', err.message);
      }
      configureCloudinary();
    })();
  }
  return ready;
}

export default async function handler(req, res) {
  await ensureReady();
  return app(req, res);
}
