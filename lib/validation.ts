import { z } from 'zod';

// User validation schema
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  gender: z.enum(['M', 'F', 'Other'], {
    errorMap: () => ({ message: 'Gender must be M, F, or Other' }),
  }),
  date_of_birth: z.string().refine(
    (date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 18;
    },
    { message: 'Must be at least 18 years old' }
  ),
  weight_kg: z.number().min(30, 'Weight too low').max(300, 'Weight too high'),
  height_cm: z.number().min(100, 'Height too low').max(250, 'Height too high'),
  activity_level: z.number().min(1).max(5).int('Activity level must be 1-5'),
});

export type User = z.infer<typeof userSchema>;

// Food entry validation schema
export const foodEntrySchema = z.object({
  food_name: z.string().min(1, 'Food name required').max(255),
  portion_size: z.number().positive('Portion size must be positive'),
  portion_unit: z.enum(['g', 'mg', 'ml', 'cup', 'tbsp', 'tsp', 'piece', 'slice', 'oz', 'lb']),
  calories: z.number().nonnegative('Calories cannot be negative'),
  protein_g: z.number().nonnegative('Protein cannot be negative'),
  carbs_g: z.number().nonnegative('Carbs cannot be negative'),
  fat_g: z.number().nonnegative('Fat cannot be negative'),
  food_database_id: z.string().optional(),
  photo_url: z.string().url().optional(),
  entry_date: z.string().optional(),
});

export type FoodEntry = z.infer<typeof foodEntrySchema>;

// Food database validation schema
export const foodDatabaseSchema = z.object({
  food_name: z.string().min(1).max(255),
  serving_size: z.number().positive(),
  serving_unit: z.string(),
  calories_per_serving: z.number().nonnegative(),
  protein_g: z.number().nonnegative(),
  carbs_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
  usda_fdc_id: z.string().optional(),
  category: z.string().optional(),
});

export type FoodDatabase = z.infer<typeof foodDatabaseSchema>;

// Recommendation validation schema
export const recommendationSchema = z.object({
  daily_calorie_target: z.number().positive(),
  protein_target_g: z.number().positive(),
  carbs_target_g: z.number().positive(),
  fat_target_g: z.number().positive(),
  bmr: z.number().positive(),
  tdee: z.number().positive(),
});

export type Recommendation = z.infer<typeof recommendationSchema>;

// API Response wrapper schemas
export const apiSuccessSchema = z.object({
  status: z.literal('success'),
  data: z.any(),
  meta: z
    .object({
      request_id: z.string(),
      timestamp: z.string(),
    })
    .optional(),
});

export const apiErrorSchema = z.object({
  status: z.literal('error'),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
    timestamp: z.string(),
    path: z.string(),
    request_id: z.string(),
  }),
});

export type ApiSuccess<T> = {
  status: 'success';
  data: T;
  meta?: {
    request_id: string;
    timestamp: string;
  };
};

export type ApiError = {
  status: 'error';
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
    path: string;
    request_id: string;
  };
};
