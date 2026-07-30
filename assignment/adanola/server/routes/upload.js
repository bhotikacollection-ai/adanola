import { Router } from 'express';
import multer from 'multer';
import { protect, adminOnly } from '../middleware/auth.js';
import { isCloudinaryReady, uploadBuffer, uploadFromUrl } from '../lib/cloudinary.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only images are allowed'));
  },
});

router.get('/status', (_req, res) => {
  res.json({
    configured: isCloudinaryReady(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
    folder: process.env.CLOUDINARY_FOLDER || 'adanola',
  });
});

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!isCloudinaryReady()) {
      return res.status(503).json({
        message: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.',
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = await uploadBuffer(req.file.buffer, {
      public_id: req.body.publicId || undefined,
    });

    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

router.post('/from-url', protect, adminOnly, async (req, res) => {
  try {
    if (!isCloudinaryReady()) {
      return res.status(503).json({ message: 'Cloudinary is not configured' });
    }
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'url is required' });

    const result = await uploadFromUrl(url);
    res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

export default router;
