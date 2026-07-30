import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import wishlistRouter from './routes/wishlist.js';
import ordersRouter from './routes/orders.js';
import uploadRouter from './routes/upload.js';
import siteConfigRouter from './routes/siteConfig.js';

const app = express();

const clientUrl = process.env.CLIENT_URL || '*';

app.use(
  cors({
    origin: clientUrl === '*' ? true : clientUrl.split(',').map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'adanola-api',
    time: new Date().toISOString(),
    mongo: Boolean(process.env.MONGODB_URI),
    cloudinary: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    ),
  });
});

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/site-config', siteConfigRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

export default app;
