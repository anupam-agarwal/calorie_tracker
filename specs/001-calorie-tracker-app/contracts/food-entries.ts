// API Contract: Food Entry Management
// Endpoint: /api/food/entries
// Phase: 1 - Design

/**
 * POST /api/food/entries
 * Create a new food entry for the authenticated user
 */
export interface CreateFoodEntryRequest {
  food_name: string; // 1-255 chars, required
  portion_size: number; // > 0, required
  portion_unit: 'g' | 'mg' | 'ml' | 'cup' | 'tbsp' | 'tsp' | 'piece' | 'slice' | 'oz' | 'lb';
  calories: number; // >= 0, required
  protein_g: number; // >= 0, required
  carbs_g: number; // >= 0, required
  fat_g: number; // >= 0, required
  food_database_id?: string; // UUID (optional, from search)
  photo_url?: string; // Valid URL (optional)
  entry_date?: string; // ISO 8601 date (optional, defaults to today)
}

export interface CreateFoodEntryResponse {
  status: 'success' | 'error';
  data?: {
    id: string; // UUID
    user_id: string; // UUID
    food_name: string;
    portion_size: number;
    portion_unit: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    food_database_id: string | null;
    photo_url: string | null;
    created_at: string; // ISO 8601 timestamp
    entry_date: string; // ISO 8601 date
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>; // Validation errors per field
  };
}

/**
 * GET /api/food/entries?limit=100&offset=0&date_from=2026-06-01&date_to=2026-06-04
 * Fetch paginated food entries for the authenticated user (30-day window)
 */
export interface FoodEntriesListRequest {
  limit?: number; // 1-500, default 100
  offset?: number; // >= 0, default 0
  date_from?: string; // ISO 8601 date (optional, defaults to 30 days ago)
  date_to?: string; // ISO 8601 date (optional, defaults to today)
  sort_by?: 'created_at' | 'entry_date'; // default 'created_at'
  sort_order?: 'asc' | 'desc'; // default 'desc'
}

export interface FoodEntriesListResponse {
  status: 'success' | 'error';
  data?: {
    entries: Array<{
      id: string; // UUID
      user_id: string;
      food_name: string;
      portion_size: number;
      portion_unit: string;
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
      food_database_id: string | null;
      photo_url: string | null;
      created_at: string;
      entry_date: string;
    }>;
    pagination: {
      total: number; // Total entries in date range
      limit: number;
      offset: number;
      pages: number;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * GET /api/food/entries/[entryId]
 * Fetch a single food entry
 */
export interface FoodEntryDetailResponse {
  status: 'success' | 'error';
  data?: {
    id: string;
    user_id: string;
    food_name: string;
    portion_size: number;
    portion_unit: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    food_database_id: string | null;
    photo_url: string | null;
    created_at: string;
    entry_date: string;
  };
  error?: {
    code: 'NOT_FOUND' | 'UNAUTHORIZED';
    message: string;
  };
}

/**
 * PATCH /api/food/entries/[entryId]
 * Update an existing food entry
 */
export interface UpdateFoodEntryRequest {
  food_name?: string;
  portion_size?: number;
  portion_unit?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  photo_url?: string | null;
  entry_date?: string;
}

export interface UpdateFoodEntryResponse {
  status: 'success' | 'error';
  data?: {
    id: string;
    user_id: string;
    food_name: string;
    portion_size: number;
    portion_unit: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    food_database_id: string | null;
    photo_url: string | null;
    created_at: string;
    entry_date: string;
  };
  error?: {
    code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'VALIDATION_ERROR';
    message: string;
    details?: Record<string, string>;
  };
}

/**
 * DELETE /api/food/entries/[entryId]
 * Delete a food entry
 */
export interface DeleteFoodEntryResponse {
  status: 'success' | 'error';
  data?: {
    id: string;
    message: string; // "Entry deleted successfully"
  };
  error?: {
    code: 'NOT_FOUND' | 'UNAUTHORIZED';
    message: string;
  };
}

/**
 * POST /api/food/search
 * Search food database by name (queries FoodDatabase table + USDA API with caching)
 */
export interface FoodSearchRequest {
  query: string; // 1-100 chars, required
  limit?: number; // 1-50, default 20
}

export interface FoodSearchResponse {
  status: 'success' | 'error';
  data?: {
    results: Array<{
      id: string; // UUID or USDA FDC ID
      food_name: string;
      serving_size: number;
      serving_unit: string;
      calories_per_serving: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
      category?: string;
      source: 'database' | 'usda'; // Where the food came from
    }>;
  };
  error?: {
    code: 'VALIDATION_ERROR' | 'EXTERNAL_API_ERROR';
    message: string;
  };
}

---

/**
 * Error Response Structure (All Endpoints)
 * Standardized error format across all API routes
 */
export interface ApiErrorResponse {
  status: 'error';
  error: {
    code: string; // Machine-readable error code
    message: string; // Human-readable message
    details?: Record<string, unknown>; // Additional context (validation errors, etc.)
    timestamp: string; // ISO 8601 timestamp
    path: string; // Request path (/api/food/entries)
    request_id: string; // Unique ID for debugging
  };
}

/**
 * Success Response Envelope (All Endpoints)
 */
export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
  meta?: {
    request_id: string;
    timestamp: string;
  };
}
