import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, CircleAlert as AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';

interface ProductImageUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxImages?: number;
  maxSize?: number;
  className?: string;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  onUpload,
  maxImages = 10,
  maxSize = 5 * 1024 * 1024,
  className = '',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>('');

  const validateFiles = (fileList: FileList): string | null => {
    if (files.length + fileList.length > maxImages) {
      return `Maximum ${maxImages} images allowed`;
    }

    for (const file of Array.from(fileList)) {
      if (file.size > maxSize) {
        return `File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`;
      }

      if (!file.type.startsWith('image/')) {
        return `File ${file.name} is not a valid image`;
      }
    }

    return null;
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      const validationError = validateFiles(selectedFiles);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });

      event.target.value = '';
    },
    [files.length, maxImages, maxSize]
  );

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    try {
      await onUpload(files);
      setUploadProgress(100);
      setTimeout(() => {
        setFiles([]);
        setPreviews([]);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = e.dataTransfer.files;
      if (!droppedFiles || droppedFiles.length === 0) return;

      const validationError = validateFiles(droppedFiles);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      const newFiles = Array.from(droppedFiles);
      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    },
    [files.length, maxImages, maxSize]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors"
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
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading || files.length >= maxImages}
              />
            </label>{' '}
            or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, JPEG (MAX. {maxSize / (1024 * 1024)}MB per image)
          </p>
          <p className="text-xs text-muted-foreground">
            {files.length} / {maxImages} images selected
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {(files[index].size / 1024).toFixed(0)} KB
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            Uploading images... {uploadProgress}%
          </p>
        </div>
      )}

      {files.length > 0 && !uploading && (
        <div className="flex gap-2">
          <Button onClick={handleUpload} className="flex-1">
            <Upload className="w-4 h-4 mr-2" />
            Upload {files.length} Image{files.length > 1 ? 's' : ''}
          </Button>
          <Button
            onClick={() => {
              setFiles([]);
              setPreviews([]);
            }}
            variant="outline"
          >
            Clear All
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• First image will be used as the main product image</p>
        <p>• All images will be optimized automatically</p>
        <p>• Maximum {maxImages} images per product</p>
        <p>• RentHub watermark will be added to protect your images</p>
      </div>
    </div>
  );
};
