import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

let configured = false;

export function configureCloudinary() {
  if (configured) return true;

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
  return true;
}

export function isCloudinaryReady() {
  return configureCloudinary();
}

export function getCloudName() {
  return process.env.CLOUDINARY_CLOUD_NAME || null;
}

/** Build a Cloudinary delivery URL (upload or fetch). */
export function cloudinaryUrl(publicIdOrUrl, options = {}) {
  const cloud = getCloudName();
  if (!cloud) return publicIdOrUrl;

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  const transforms = [`q_${quality}`, `f_${format}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const t = transforms.join(',');

  // Remote fetch through Cloudinary CDN
  if (typeof publicIdOrUrl === 'string' && publicIdOrUrl.startsWith('http')) {
    return `https://res.cloudinary.com/${cloud}/image/fetch/${t}/${encodeURIComponent(publicIdOrUrl)}`;
  }

  return `https://res.cloudinary.com/${cloud}/image/upload/${t}/${publicIdOrUrl}`;
}

export function uploadBuffer(buffer, options = {}) {
  if (!configureCloudinary()) {
    return Promise.reject(new Error('Cloudinary is not configured'));
  }

  const folder = process.env.CLOUDINARY_FOLDER || 'adanola';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        ...options,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

export function uploadFromUrl(url, options = {}) {
  if (!configureCloudinary()) {
    return Promise.reject(new Error('Cloudinary is not configured'));
  }

  const folder = process.env.CLOUDINARY_FOLDER || 'adanola';

  return cloudinary.uploader.upload(url, {
    folder,
    resource_type: 'image',
    ...options,
  });
}

export { cloudinary };
