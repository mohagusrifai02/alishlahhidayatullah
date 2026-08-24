import crypto from 'crypto';

export function getCloudinaryConfig() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_NAME ||
    '';

  const apiKey = process.env.CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET || '';

  return { cloudName, apiKey, apiSecret };
}

export async function uploadToCloudinary(file: Blob | File, folder = 'news') {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured. Set CLOUDINARY_CLOUD_NAME in env.local.');
  }

  if (!apiKey || !apiSecret) {
    throw new Error('Cloudinary API key and secret are not configured.');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    folder,
    timestamp,
  };

  const signaturePayload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const signature = crypto
    .createHash('sha1')
    .update(`${signaturePayload}${apiSecret}`)
    .digest('hex');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result?.secure_url) {
    throw new Error(result?.error?.message || 'Upload to Cloudinary failed');
  }

  return result.secure_url as string;
}
