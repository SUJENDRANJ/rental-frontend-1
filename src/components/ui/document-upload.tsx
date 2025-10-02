import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Alert, AlertDescription } from './alert';
import { Progress } from './progress';

interface DocumentUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number;
  label?: string;
  description?: string;
  documentType: 'aadhar' | 'pan' | 'license' | 'passport';
  className?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  accept = 'image/jpeg,image/png,image/jpg,application/pdf',
  maxSize = 5 * 1024 * 1024,
  label,
  description,
  documentType,
  className = '',
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
    }

    const acceptedTypes = accept.split(',').map((t) => t.trim());
    if (!acceptedTypes.some((type) => file.type.match(type))) {
      return 'Invalid file type. Please upload a valid image or PDF';
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

      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview('');
      }
    },
    [maxSize, accept]
  );

  const handleUpload = async () => {
    if (!file) return;

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
      await onUpload(file);
      setUploadProgress(100);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview('');
    setError('');
    setSuccess(false);
    setUploadProgress(0);
  };

  const documentLabels = {
    aadhar: 'Aadhar Card',
    pan: 'PAN Card',
    license: 'Driving License',
    passport: 'Passport',
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {label || `Upload ${documentLabels[documentType]}`}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
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
              Document uploaded successfully!
            </AlertDescription>
          </Alert>
        )}

        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or PDF (MAX. {maxSize / (1024 * 1024)}MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="space-y-4">
            {preview ? (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Document preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <FileText className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploading || success}
                className="flex-1"
              >
                {uploading ? 'Uploading...' : success ? 'Uploaded' : 'Upload Document'}
              </Button>
              <Button
                onClick={handleRemove}
                variant="outline"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Ensure the document is clear and all details are visible</p>
          <p>• Accepted formats: JPEG, PNG, PDF</p>
          <p>• Maximum file size: {maxSize / (1024 * 1024)}MB</p>
        </div>
      </div>
    </Card>
  );
};
