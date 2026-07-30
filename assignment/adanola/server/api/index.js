/**
 * Vercel serverless entry — exports the Express app.
 * Routes are matched via vercel.json: /api/* → this file.
 */
import dotenv from 'dotenv';
import app from '../app.js';
import { connectDB } from '../lib/db.js';
import { configureCloudinary } from '../lib/cloudinary.js';

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
  await ready;
}

export default async function handler(req, res) {
  await ensureReady();
  return app(req, res);
}
