import { toast } from 'sonner';

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export class AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;

  constructor(message: string, code?: string, statusCode?: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    return {
      message: (err.message as string) || 'An unexpected error occurred',
      code: (err.code as string) || 'UNKNOWN_ERROR',
      statusCode: (err.statusCode as number) || undefined,
      details: err.details as Record<string, unknown>,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const showErrorToast = (error: unknown, customMessage?: string) => {
  const apiError = handleApiError(error);
  const message = customMessage || apiError.message;

  toast.error(message, {
    description: apiError.code !== 'UNKNOWN_ERROR' ? `Error code: ${apiError.code}` : undefined,
  });
};

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, { description });
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('network') ||
           error.message.includes('fetch') ||
           error.message.includes('offline');
  }
  return false;
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};
