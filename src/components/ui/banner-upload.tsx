import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';

interface BannerUploadProps {
  onUpload: (file: File, metadata: BannerMetadata) => Promise<void>;
  maxSize?: number;
  className?: string;
}

export interface BannerMetadata {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
}

export const BannerUpload: React.FC<BannerUploadProps> = ({
  onUpload,
  maxSize = 10 * 1024 * 1024,
  className = '',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const [metadata, setMetadata] = useState<BannerMetadata>({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    displayOrder: 1,
  });

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
    }

    if (!file.type.startsWith('image/')) {
      return 'Please upload a valid image file';
    }

    return null;
  };

  const validateMetadata = (): string | null => {
    if (!metadata.title.trim()) {
      return 'Banner title is required';
    }
    if (!metadata.subtitle.trim()) {
      return 'Banner subtitle is required';
    }
    if (!metadata.ctaText.trim()) {
      return 'Call-to-action text is required';
    }
    if (!metadata.ctaLink.trim()) {
      return 'Call-to-action link is required';
    }
    return null;
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) return;

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      setFile(selectedFile);
      setSuccess(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    },
    [maxSize]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFile = e.dataTransfer.files?.[0];
      if (!droppedFile) return;

      const validationError = validateFile(droppedFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      setFile(droppedFile);
      setSuccess(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    },
    [maxSize]
  );

  const handleUpload = async () => {
    if (!file) return;

    const metadataError = validateMetadata();
    if (metadataError) {
      setError(metadataError);
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      await onUpload(file, metadata);
      setUploadProgress(100);
      setSuccess(true);
      setTimeout(() => {
        handleReset();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview('');
    setError('');
    setSuccess(false);
    setUploadProgress(0);
    setMetadata({
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
      displayOrder: 1,
    });
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Upload Hero Banner</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a high-quality banner image for the homepage hero section
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Banner uploaded successfully!
            </AlertDescription>
          </Alert>
        )}

        {!file ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <label className="font-semibold text-primary hover:underline cursor-pointer">
                  Click to upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG (Recommended: 1920x600px, MAX. {maxSize / (1024 * 1024)}MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[16/5] bg-muted rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleReset}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Banner Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Rent Anything, Anytime"
                  value={metadata.title}
                  onChange={(e) =>
                    setMetadata((prev) => ({ ...prev, title: e.target.value }))
                  }
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Banner Subtitle *</Label>
                <Textarea
                  id="subtitle"
                  placeholder="e.g., From gadgets to furniture, find everything you need"
                  value={metadata.subtitle}
                  onChange={(e) =>
                    setMetadata((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  disabled={uploading}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ctaText">Button Text *</Label>
                  <Input
                    id="ctaText"
                    placeholder="e.g., Browse Products"
                    value={metadata.ctaText}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, ctaText: e.target.value }))
                    }
                    disabled={uploading}
                  />
                </div>

                <div>
                  <Label htmlFor="ctaLink">Button Link *</Label>
                  <Input
                    id="ctaLink"
                    placeholder="e.g., /products"
                    value={metadata.ctaLink}
                    onChange={(e) =>
                      setMetadata((prev) => ({ ...prev, ctaLink: e.target.value }))
                    }
                    disabled={uploading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="1"
                  value={metadata.displayOrder}
                  onChange={(e) =>
                    setMetadata((prev) => ({
                      ...prev,
                      displayOrder: parseInt(e.target.value) || 1,
                    }))
                  }
                  disabled={uploading}
                />
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading banner... {uploadProgress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading || success}
              className="w-full"
              size="lg"
            >
              {uploading ? 'Uploading...' : success ? 'Uploaded!' : 'Upload Banner'}
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Recommended dimensions: 1920x600 pixels</p>
          <p>• Image will be automatically optimized for web delivery</p>
          <p>• Ensure text is readable when overlaid on the image</p>
        </div>
      </div>
    </Card>
  );
};
