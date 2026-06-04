// API Contract: History & Daily Aggregates
// Endpoint: /api/history
// Phase: 1 - Design

/**
 * GET /api/history?date_from=2026-05-06&date_to=2026-06-04&include_breakdown=true
 * Fetch 30-day calorie history with daily aggregates
 */
export interface HistoryRequest {
  date_from?: string; // ISO 8601 date (optional, defaults to 30 days ago)
  date_to?: string; // ISO 8601 date (optional, defaults to today)
  include_breakdown?: boolean; // Include detailed food entries per day (default false)
  include_chart_data?: boolean; // Format for chart consumption (default false)
}

export interface DailyAggregate {
  date: string; // ISO 8601 date
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  entry_count: number; // Number of food items logged that day
  has_data: boolean; // false if no entries for that day (data gap)
}

export interface HistoryEntry {
  id: string; // UUID
  food_name: string;
  portion_size: number;
  portion_unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  entry_date: string; // ISO 8601 date
  created_at: string; // ISO 8601 timestamp
}

export interface HistoryResponse {
  status: 'success' | 'error';
  data?: {
    period: {
      date_from: string;
      date_to: string;
      days: number; // Total days in range (30 for typical query)
    };
    dailies: DailyAggregate[]; // One entry per day in range, even if no data (has_data=false)
    
    // Optional: detailed breakdown by day
    breakdown?: {
      [date: string]: HistoryEntry[]; // ISO 8601 date as key
    };

    // Optional: chart-ready format (sorted, with nulls for gaps)
    chart_data?: {
      dates: string[];
      calories: (number | null)[]; // null for data gaps
      average_calories: number; // 30-day average
      min_daily: number;
      max_daily: number;
    };

    // Metadata for rendering & filters
    metadata: {
      total_days_with_entries: number;
      total_days_with_gaps: number; // Days with zero entries
      average_daily_calories: number;
    };
  };
  error?: {
    code: 'UNAUTHORIZED' | 'VALIDATION_ERROR';
    message: string;
  };
}

/**
 * GET /api/history/[date]
 * Fetch all entries for a specific date
 */
export interface DayDetailResponse {
  status: 'success' | 'error';
  data?: {
    date: string; // ISO 8601 date
    entries: HistoryEntry[]; // All food items logged that day
    daily_total: {
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    };
  };
  error?: {
    code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'VALIDATION_ERROR';
    message: string;
  };
}

/**
 * GET /api/history/stats
 * Fetch 30-day aggregate statistics
 */
export interface HistoryStatsResponse {
  status: 'success' | 'error';
  data?: {
    period_days: 30; // Always 30-day window
    total_entries: number; // Total food items logged in 30 days
    avg_daily_calories: number; // Average calories per day
    min_daily_calories: number; // Lowest single day
    max_daily_calories: number; // Highest single day
    days_with_data: number; // Days with at least 1 entry
    days_with_gaps: number; // Days with 0 entries
    macronutrients_avg: {
      // 30-day average breakdown
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    };
  };
  error?: {
    code: 'UNAUTHORIZED';
    message: string;
  };
}

/**
 * DELETE /api/history/[date]
 * Delete all entries for a specific date (GDPR compliance, bulk delete)
 */
export interface DeleteDayResponse {
  status: 'success' | 'error';
  data?: {
    date: string;
    entries_deleted: number;
    message: string; // "3 entries deleted for 2026-06-04"
  };
  error?: {
    code: 'NOT_FOUND' | 'UNAUTHORIZED';
    message: string;
  };
}

---

/**
 * Filter/Sort Patterns (Reusable)
 */
export interface FilterOptions {
  date_from?: string;
  date_to?: string;
  sort_by?: 'date' | 'calories';
  sort_order?: 'asc' | 'desc';
  include_gaps?: boolean; // Include days with zero entries (default true)
}

/**
 * Chart Data Transform (for frontend graph rendering)
 */
export interface ChartDataPoint {
  date: string; // ISO 8601 date
  calories: number | null; // null if no data for that day
  avg_calories: number; // Rolling 7-day average (for trend line)
  recommended: number; // User's daily calorie target
}
