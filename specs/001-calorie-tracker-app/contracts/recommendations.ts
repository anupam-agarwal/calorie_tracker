// API Contract: Recommendations & Profile
// Endpoints: /api/recommendations, /api/profile
// Phase: 1 - Design

/**
 * GET /api/recommendations
 * Fetch personalized diet recommendations based on user profile
 */
export interface RecommendationResponse {
  status: 'success' | 'error';
  data?: {
    user_id: string; // UUID
    
    // Calorie targets
    daily_calorie_target: number; // TDEE
    bmr: number; // Basal Metabolic Rate
    tdee: number; // Total Daily Energy Expenditure
    
    // Macronutrient targets (grams)
    protein_target_g: number;
    carbs_target_g: number;
    fat_target_g: number;
    
    // Macronutrient breakdown (percentages)
    protein_percentage: number; // 25% default
    carbs_percentage: number; // 50% default
    fat_percentage: number; // 25% default
    
    // Formula details (for transparency)
    formula: {
      type: 'Mifflin-St Jeor'; // Formula used for BMR
      bmr_calculation: string; // e.g., "(10 × 75kg) + (6.25 × 180cm) - (5 × 30y) + 5"
      tdee_multiplier: number; // 1.2-1.9 based on activity level
      activity_level: number; // 1-5 (Sedentary to Extremely Active)
    };
    
    // Guidance text
    guidance: {
      summary: string; // e.g., "Maintain 2500 cal/day with 50% carbs, 25% protein, 25% fat"
      meal_examples?: {
        breakfast: string[];
        lunch: string[];
        dinner: string[];
        snack: string[];
      };
    };
    
    // Timestamps
    created_at: string; // ISO 8601
    updated_at: string; // ISO 8601 (recalculated when profile updates)
  };
  error?: {
    code: 'UNAUTHORIZED' | 'PROFILE_INCOMPLETE';
    message: string; // "Complete your profile to view recommendations"
  };
}

/**
 * GET /api/profile
 * Fetch current user profile
 */
export interface UserProfileResponse {
  status: 'success' | 'error';
  data?: {
    id: string; // UUID
    email: string;
    name: string;
    gender: 'M' | 'F' | 'Other';
    date_of_birth: string; // ISO 8601 date
    age: number; // Calculated from DOB
    weight_kg: number;
    height_cm: number;
    activity_level: 1 | 2 | 3 | 4 | 5; // Sedentary to Extremely Active
    activity_level_label: string; // "Moderately Active"
    created_at: string;
    updated_at: string;
  };
  error?: {
    code: 'UNAUTHORIZED' | 'NOT_FOUND';
    message: string;
  };
}

/**
 * PATCH /api/profile
 * Update user profile (triggers recommendation recalculation)
 */
export interface UpdateProfileRequest {
  name?: string; // 1-100 chars
  weight_kg?: number; // 30-300
  height_cm?: number; // 100-250
  activity_level?: 1 | 2 | 3 | 4 | 5;
  date_of_birth?: string; // ISO 8601 date (must be >= 18 years old)
  gender?: 'M' | 'F' | 'Other';
}

export interface UpdateProfileResponse {
  status: 'success' | 'error';
  data?: {
    id: string;
    email: string;
    name: string;
    gender: 'M' | 'F' | 'Other';
    date_of_birth: string;
    age: number;
    weight_kg: number;
    height_cm: number;
    activity_level: 1 | 2 | 3 | 4 | 5;
    activity_level_label: string;
    created_at: string;
    updated_at: string;
    message: string; // "Profile updated. Recommendations recalculated."
  };
  error?: {
    code: 'UNAUTHORIZED' | 'VALIDATION_ERROR';
    message: string;
    details?: Record<string, string>; // Validation errors per field
  };
}

/**
 * GET /api/recommendations/comparison
 * Compare actual intake vs. recommendations for a date range
 */
export interface ComparisonRequest {
  date_from?: string; // ISO 8601 date (default: 7 days ago)
  date_to?: string; // ISO 8601 date (default: today)
}

export interface ComparisonResponse {
  status: 'success' | 'error';
  data?: {
    period: {
      date_from: string;
      date_to: string;
      days: number;
    };
    
    recommendation: {
      daily_calorie_target: number;
      protein_target_g: number;
      carbs_target_g: number;
      fat_target_g: number;
    };
    
    actual: {
      avg_daily_calories: number;
      avg_protein_g: number;
      avg_carbs_g: number;
      avg_fat_g: number;
    };
    
    comparison: {
      calories: {
        recommendation: number;
        actual: number;
        difference: number; // positive = over, negative = under
        percentage_of_target: number; // 95% of target, 110% of target, etc.
      };
      protein: {
        recommendation: number;
        actual: number;
        difference: number;
        percentage_of_target: number;
      };
      carbs: {
        recommendation: number;
        actual: number;
        difference: number;
        percentage_of_target: number;
      };
      fat: {
        recommendation: number;
        actual: number;
        difference: number;
        percentage_of_target: number;
      };
    };
    
    insights: string[]; // e.g., ["You're averaging 100 cal/day over target", "Great protein intake!"]
  };
  error?: {
    code: 'UNAUTHORIZED' | 'INSUFFICIENT_DATA';
    message: string;
  };
}

/**
 * POST /api/profile/delete-data
 * Request data deletion (GDPR compliance)
 */
export interface DeleteDataRequest {
  confirmation: 'DELETE_MY_DATA'; // Explicit confirmation
}

export interface DeleteDataResponse {
  status: 'success' | 'error';
  data?: {
    user_id: string;
    message: string; // "Your data will be deleted within 90 days"
    scheduled_deletion_date: string; // ISO 8601 date (NOW + 90 days)
  };
  error?: {
    code: 'UNAUTHORIZED' | 'VALIDATION_ERROR';
    message: string;
  };
}

---

/**
 * Activity Level Enum (Shared)
 */
export const ACTIVITY_LEVELS = {
  1: { label: 'Sedentary', multiplier: 1.2, description: 'Little or no exercise' },
  2: { label: 'Lightly Active', multiplier: 1.375, description: 'Exercise 1-3 days/week' },
  3: { label: 'Moderately Active', multiplier: 1.55, description: 'Exercise 3-5 days/week' },
  4: { label: 'Very Active', multiplier: 1.725, description: 'Exercise 6-7 days/week' },
  5: { label: 'Extremely Active', multiplier: 1.9, description: 'Physical job or twice-daily exercise' },
} as const;

/**
 * Validation Rules (Shared)
 */
export const PROFILE_CONSTRAINTS = {
  age_minimum: 18,
  age_maximum: 120,
  weight_kg_min: 30,
  weight_kg_max: 300,
  height_cm_min: 100,
  height_cm_max: 250,
  name_min_length: 1,
  name_max_length: 100,
} as const;
