import { cloudinaryConfig } from '@/lib/cloudinary';

export interface UploadOptions {
  folder: string;
  transformation?: Array<{
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    fetch_format?: string;
    gravity?: string;
  }>;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  publicId?: string;
  tags?: string[];
  context?: Record<string, string>;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
  bytes: number;
  created_at: string;
}

export class CloudinaryService {
  private static getUploadUrl(): string {
    return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;
  }

  private static async uploadFile(
    file: File | Blob,
    options: UploadOptions
  ): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset || '');
    formData.append('folder', options.folder);

    if (options.publicId) {
      formData.append('public_id', options.publicId);
    }

    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    if (options.context) {
      formData.append('context', Object.entries(options.context)
        .map(([key, value]) => `${key}=${value}`)
        .join('|'));
    }

    if (options.transformation && options.transformation.length > 0) {
      formData.append('transformation', JSON.stringify(options.transformation));
    }

    const response = await fetch(this.getUploadUrl(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    return response.json();
  }

  static async uploadProfilePhoto(
    file: File,
    userId: string
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: 'renthub/profiles',
      publicId: `user_${userId}`,
      resourceType: 'image',
      transformation: [
        {
          width: 500,
          height: 500,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto:good',
          fetch_format: 'auto',
        },
      ],
      tags: ['profile', 'user'],
      context: { userId },
    });
  }

  static async uploadKYCDocument(
    file: File,
    userId: string,
    documentType: 'aadhar' | 'pan' | 'license' | 'passport'
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: `renthub/kyc/${documentType}`,
      publicId: `${documentType}_${userId}_${Date.now()}`,
      resourceType: 'image',
      transformation: [
        {
          width: 1200,
          quality: 'auto:best',
          fetch_format: 'auto',
        },
      ],
      tags: ['kyc', documentType, 'document'],
      context: { userId, documentType },
    });
  }

  static async uploadKYCVideo(
    file: Blob,
    userId: string
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: 'renthub/kyc/videos',
      publicId: `kyc_video_${userId}_${Date.now()}`,
      resourceType: 'video',
      tags: ['kyc', 'video', 'verification'],
      context: { userId },
    });
  }

  static async uploadProductImage(
    file: File,
    productId: string,
    index: number
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: 'renthub/products',
      publicId: `product_${productId}_${index}`,
      resourceType: 'image',
      transformation: [
        {
          width: 1200,
          height: 900,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto',
        },
      ],
      tags: ['product', 'listing'],
      context: { productId, index: index.toString() },
    });
  }

  static async uploadBannerImage(
    file: File,
    bannerId: string
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: 'renthub/banners',
      publicId: `banner_${bannerId}`,
      resourceType: 'image',
      transformation: [
        {
          width: 1920,
          height: 600,
          crop: 'fill',
          quality: 'auto:best',
          fetch_format: 'auto',
        },
      ],
      tags: ['banner', 'hero'],
      context: { bannerId },
    });
  }

  static getOptimizedUrl(
    publicId: string,
    width?: number,
    height?: number,
    quality: 'auto' | 'auto:low' | 'auto:good' | 'auto:best' = 'auto:good'
  ): string {
    const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push('f_auto');

    const transformation = transformations.join(',');
    return `${baseUrl}/${transformation}/${publicId}`;
  }

  static getResponsiveUrls(publicId: string): Record<string, string> {
    return {
      thumbnail: this.getOptimizedUrl(publicId, 150, 150),
      small: this.getOptimizedUrl(publicId, 400, 300),
      medium: this.getOptimizedUrl(publicId, 800, 600),
      large: this.getOptimizedUrl(publicId, 1200, 900),
      original: this.getOptimizedUrl(publicId),
    };
  }

  static async deleteMedia(
    publicIds: string[],
    resourceType: 'image' | 'video' | 'raw' = 'image'
  ): Promise<{ success: boolean; deleted: string[]; errors: Array<{ publicId: string; error: string }> }> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(
      `${supabaseUrl}/functions/v1/delete-cloudinary-media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ publicIds, resourceType }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete media');
    }

    return response.json();
  }
}
