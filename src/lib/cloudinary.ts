import { v2 as cloudinary } from 'cloudinary';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
const apiSecret = import.meta.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey) {
  console.warn('Cloudinary configuration is missing. Upload features will be disabled.');
}

export const cloudinaryConfig = {
  cloudName,
  apiKey,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
  force_version: false,
  upload_prefix: 'https://api.cloudinary.com',
});

export { cloudinary };
