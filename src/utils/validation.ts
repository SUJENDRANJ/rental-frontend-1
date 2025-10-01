import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const urlSchema = z.string().url('Invalid URL');

export const priceSchema = z
  .number()
  .positive('Price must be positive')
  .max(999999, 'Price is too high');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  city: z.string().min(2, 'City must be at least 2 characters').optional(),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name is too long'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description is too long'),
  price: priceSchema,
  pricePerWeek: priceSchema.optional(),
  pricePerMonth: priceSchema.optional(),
  category: z.string().min(1, 'Category is required'),
  stockCount: z.number().int().positive('Stock count must be positive'),
  minRentalDays: z.number().int().positive('Minimum rental days must be positive'),
  maxRentalDays: z.number().int().positive('Maximum rental days must be positive'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  locationAddress: z.string().min(5, 'Address is required'),
  locationCity: z.string().min(2, 'City is required'),
  locationCountry: z.string().min(2, 'Country is required'),
}).refine((data) => data.minRentalDays <= data.maxRentalDays, {
  message: 'Minimum rental days cannot exceed maximum rental days',
  path: ['maxRentalDays'],
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment is too long').optional(),
});

export const passwordResetSchema = z.object({
  email: emailSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000);
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    };
  }

  if (!validateFileSize(file, 5)) {
    return {
      valid: false,
      error: 'Image size must not exceed 5MB',
    };
  }

  return { valid: true };
};

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
