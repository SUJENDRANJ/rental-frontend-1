import React, { useState } from 'react';
import { CloudinaryService } from '@/services/cloudinaryService';
import { Skeleton } from './skeleton';

interface ResponsiveImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best';
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  publicId,
  alt,
  width,
  height,
  quality = 'auto:good',
  className = '',
  sizes = '100vw',
  priority = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const urls = CloudinaryService.getResponsiveUrls(publicId);

  const srcSet = `
    ${urls.small} 400w,
    ${urls.medium} 800w,
    ${urls.large} 1200w
  `;

  const src = width && height
    ? CloudinaryService.getOptimizedUrl(publicId, width, height, quality)
    : urls.medium;

  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <p className="text-sm text-muted-foreground">Failed to load image</p>
      </div>
    );
  }

  return (
    <>
      {isLoading && <Skeleton className={className} />}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </>
  );
};

interface ResponsiveBackgroundImageProps {
  publicId: string;
  className?: string;
  quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best';
  children?: React.ReactNode;
}

export const ResponsiveBackgroundImage: React.FC<ResponsiveBackgroundImageProps> = ({
  publicId,
  className = '',
  quality = 'auto:good',
  children,
}) => {
  const urls = CloudinaryService.getResponsiveUrls(publicId);

  const backgroundImage = `
    image-set(
      url(${urls.small}) 1x,
      url(${urls.medium}) 2x,
      url(${urls.large}) 3x
    )
  `;

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${urls.medium})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  );
};
