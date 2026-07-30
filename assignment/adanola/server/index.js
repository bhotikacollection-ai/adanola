import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import { connectDB } from './lib/db.js';
import { configureCloudinary } from './lib/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    if (configureCloudinary()) {
      console.log('[cloudinary] configured');
    } else {
      console.log('[cloudinary] not configured — using direct image URLs');
    }
  } catch (err) {
    console.warn('[db] connection failed, continuing with memory seed:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Adanola API running on http://localhost:${PORT}`);
  });
}

start();
