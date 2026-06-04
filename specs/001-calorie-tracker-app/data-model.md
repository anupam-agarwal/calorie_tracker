# Data Model & Schema

**Date**: 2026-06-04 | **Phase**: 1 - Design

This document defines the core data entities, relationships, validation rules, and state transitions for the Calorie Tracker application.

---

## Entity Overview

### 1. User

**Purpose**: Represents an individual user account with profile information.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Unique user identifier |
| `email` | VARCHAR(255) | Unique, NOT NULL | Login email address |
| `password_hash` | VARCHAR(255) | NOT NULL (NextAuth) | Hashed password (salted) |
| `name` | VARCHAR(100) | NOT NULL | User's full name |
| `gender` | ENUM ('M', 'F', 'Other') | NOT NULL | Biological sex (for BMR calc) |
| `date_of_birth` | DATE | NOT NULL | Birth date (for BMR calc) |
| `weight_kg` | DECIMAL(5,2) | NOT NULL, > 0 | Current weight in kilograms |
| `height_cm` | DECIMAL(5,1) | NOT NULL, > 0 | Height in centimeters |
| `activity_level` | ENUM (1-5) | NOT NULL | 1=Sedentary, 2=Lightly Active, 3=Moderately Active, 4=Very Active, 5=Extremely Active |
| `created_at` | TIMESTAMP | NOT NULL, Default NOW() | Account creation time |
| `updated_at` | TIMESTAMP | NOT NULL, Default NOW() | Last profile update |
| `deleted_at` | TIMESTAMP | NULL | Soft-delete timestamp (GDPR) |

**Validation Rules**:
- `email`: Valid email format + unique in system
- `name`: 1-100 characters, non-empty
- `gender`: Must be one of M, F, Other
- `date_of_birth`: Must be ≥18 years old (age validation)
- `weight_kg`: 30 kg ≤ weight ≤ 300 kg (reasonable bounds)
- `height_cm`: 100 cm ≤ height ≤ 250 cm (reasonable bounds)
- `activity_level`: 1-5 integer (enum validation)

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_user_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_deleted_at ON users(deleted_at);
```

**State Transitions**:
- `created_at` → onboarding flow
- `updated_at` → profile edit, weight update
- `deleted_at` → GDPR data deletion request (soft-delete; data retained for 90 days, then purged)

---

### 2. FoodEntry

**Purpose**: Represents a single food item logged by a user with calorie/macronutrient data.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Unique entry identifier |
| `user_id` | UUID | Foreign Key → User.id, NOT NULL | Owner of the entry |
| `food_name` | VARCHAR(255) | NOT NULL | Name of the food (e.g., "Chicken Breast") |
| `portion_size` | DECIMAL(8,2) | NOT NULL, > 0 | Portion size (grams or standard unit) |
| `portion_unit` | VARCHAR(20) | NOT NULL | Unit (e.g., "g", "cup", "piece") |
| `calories` | DECIMAL(7,2) | NOT NULL, ≥ 0 | Total calories |
| `protein_g` | DECIMAL(6,2) | NOT NULL, ≥ 0 | Protein in grams |
| `carbs_g` | DECIMAL(6,2) | NOT NULL, ≥ 0 | Carbohydrates in grams |
| `fat_g` | DECIMAL(6,2) | NOT NULL, ≥ 0 | Fat in grams |
| `food_database_id` | UUID | Foreign Key → FoodDatabase.id, NULL | Reference to food database entry (if from search) |
| `photo_url` | VARCHAR(500) | NULL | Optional photo of the food |
| `created_at` | TIMESTAMP | NOT NULL, Default NOW() | When entry was logged |
| `entry_date` | DATE | NOT NULL | Date the food was consumed (may differ from created_at) |

**Validation Rules**:
- `user_id`: Must exist in User table
- `food_name`: 1-255 characters, non-empty
- `portion_size`: > 0 and ≤ 10,000 (reasonable bound)
- `portion_unit`: Must be one of: "g", "mg", "ml", "cup", "tbsp", "tsp", "piece", "slice", "oz", "lb"
- `calories`, `protein_g`, `carbs_g`, `fat_g`: ≥ 0 (non-negative)
- `entry_date`: Must be ≤ today (no future entries) and ≥ 30 days ago (rolling window)
- `photo_url`: Valid URL format if provided

**Indexes**:
```sql
CREATE INDEX idx_food_entry_user_date ON food_entries(user_id, entry_date DESC);
CREATE INDEX idx_food_entry_created_at ON food_entries(created_at);
CREATE INDEX idx_food_entry_30_day_window ON food_entries(user_id, entry_date) 
  WHERE entry_date >= CURRENT_DATE - INTERVAL '30 days';
```

**State Transitions**:
- `created_at` → auto-set to NOW()
- `entry_date` → user specifies (defaults to today)
- `food_database_id` → populated if entry from search, NULL if manual entry
- Deletion → remove entry; DailyIntake aggregate will auto-update

---

### 3. FoodDatabase

**Purpose**: Reference table for common foods with pre-calculated nutritional data (from USDA API or manual seed).

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Unique food identifier |
| `food_name` | VARCHAR(255) | NOT NULL | Official food name (e.g., "Chicken Breast, raw") |
| `serving_size` | DECIMAL(8,2) | NOT NULL, > 0 | Standard serving size |
| `serving_unit` | VARCHAR(20) | NOT NULL | Unit for serving (e.g., "g", "cup") |
| `calories_per_serving` | DECIMAL(7,2) | NOT NULL, ≥ 0 | Calories per standard serving |
| `protein_g` | DECIMAL(6,2) | NOT NULL, ≥ 0 | Protein per serving |
| `carbs_g` | DECIMAL(6,2) | NOT NULL, ≥ 0 | Carbs per serving |
| `fat_g` | DECIMAL(6,2) | NOT NULL, ≥ 0 | Fat per serving |
| `usda_fdc_id` | VARCHAR(20) | NULL | Reference to USDA FoodData Central ID |
| `category` | VARCHAR(50) | NULL | Food category (e.g., "Dairy", "Vegetables", "Grains") |
| `created_at` | TIMESTAMP | NOT NULL, Default NOW() | When entry was added to database |

**Validation Rules**:
- `food_name`: 1-255 characters, non-empty
- `serving_size`: > 0
- `serving_unit`: One of standard units
- All nutrition values: ≥ 0

**Indexes**:
```sql
CREATE INDEX idx_food_db_name ON food_database(food_name);
CREATE INDEX idx_food_db_category ON food_database(category);
CREATE UNIQUE INDEX idx_food_db_usda_id ON food_database(usda_fdc_id) WHERE usda_fdc_id IS NOT NULL;
```

**Seeding Strategy**:
- Phase 1: Seed ~100 common foods manually for MVP
- Phase 2: Integrate USDA API for on-demand search with caching

---

### 4. DailyIntake (Aggregate)

**Purpose**: Pre-calculated daily totals to optimize graph rendering and recommendations comparison.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Unique daily aggregate ID |
| `user_id` | UUID | Foreign Key → User.id, NOT NULL | Owner |
| `date` | DATE | NOT NULL | The date of aggregation |
| `total_calories` | DECIMAL(8,2) | NOT NULL, Default 0 | Sum of all entries for the day |
| `total_protein_g` | DECIMAL(7,2) | NOT NULL, Default 0 | Total protein |
| `total_carbs_g` | DECIMAL(7,2) | NOT NULL, Default 0 | Total carbs |
| `total_fat_g` | DECIMAL(7,2) | NOT NULL, Default 0 | Total fat |
| `entry_count` | INTEGER | NOT NULL, Default 0 | Number of food entries for the day |
| `updated_at` | TIMESTAMP | NOT NULL, Default NOW() | Last update time |

**Validation Rules**:
- `user_id`: Must exist in User table
- `date`: Must be ≤ today
- All nutrition values: ≥ 0
- Uniqueness: Only one DailyIntake per (user_id, date)

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_daily_intake_user_date ON daily_intake(user_id, date);
CREATE INDEX idx_daily_intake_30_day ON daily_intake(user_id, date DESC) 
  WHERE date >= CURRENT_DATE - INTERVAL '30 days';
```

**Calculation Strategy**:
- Triggered by INSERT/UPDATE/DELETE on FoodEntry
- Recalculate via trigger or background job (prefer trigger for consistency)
- Query: `SUM(calories), SUM(protein_g), SUM(carbs_g), SUM(fat_g), COUNT(*) FROM food_entries WHERE user_id=? AND entry_date=?`

---

### 5. Recommendation

**Purpose**: Personalized daily calorie & macronutrient targets based on user profile.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Unique recommendation ID |
| `user_id` | UUID | Foreign Key → User.id, NOT NULL | User this is for |
| `daily_calorie_target` | DECIMAL(7,2) | NOT NULL, > 0 | Recommended daily calorie intake |
| `protein_target_g` | DECIMAL(6,2) | NOT NULL, > 0 | Recommended daily protein |
| `carbs_target_g` | DECIMAL(6,2) | NOT NULL, > 0 | Recommended daily carbs |
| `fat_target_g` | DECIMAL(6,2) | NOT NULL, > 0 | Recommended daily fat |
| `protein_percentage` | DECIMAL(4,1) | NOT NULL | % of calories from protein (10-40%) |
| `carbs_percentage` | DECIMAL(4,1) | NOT NULL | % of calories from carbs (40-65%) |
| `fat_percentage` | DECIMAL(4,1) | NOT NULL | % of calories from fat (20-35%) |
| `bmr` | DECIMAL(7,2) | NOT NULL | Basal Metabolic Rate (calculated) |
| `tdee` | DECIMAL(7,2) | NOT NULL | Total Daily Energy Expenditure (BMR × activity_level) |
| `created_at` | TIMESTAMP | NOT NULL, Default NOW() | When recommendation was generated |
| `updated_at` | TIMESTAMP | NOT NULL, Default NOW() | When last recalculated (on profile update) |

**Validation Rules**:
- `user_id`: Must exist in User table
- All targets: > 0 and < 10,000
- Percentages: sum to 100 ± 0.1%, each in valid range
- BMR/TDEE: calculated via Mifflin-St Jeor formula

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_recommendation_user_id ON recommendations(user_id);
```

**Calculation Strategy**:
```
BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age_years) + sex_offset
      where sex_offset = 5 (male) or -161 (female)

TDEE = BMR × activity_multiplier
       where multiplier = 1.2 (Sedentary) to 1.9 (Extremely Active)

daily_calorie_target = TDEE (or adjusted for weight loss/gain if future enhancement)

protein_target_g = (daily_calorie_target × 0.25) / 4  # 25% of calories ÷ 4 cal/g
carbs_target_g   = (daily_calorie_target × 0.50) / 4  # 50% of calories ÷ 4 cal/g
fat_target_g     = (daily_calorie_target × 0.25) / 9  # 25% of calories ÷ 9 cal/g
```

**State Transitions**:
- Generated on user profile completion
- Recalculated on user weight/age/activity level update (updated_at refreshed)

---

## Relationships

```
User (1) ──→ (Many) FoodEntry
User (1) ──→ (Many) DailyIntake
User (1) ──→ (1) Recommendation

FoodEntry (Many) ──→ (1) FoodDatabase (optional)
FoodEntry (Many) ──→ (1) DailyIntake (via trigger on user_id + entry_date)
```

---

## 30-Day Rolling Window Policy

**Implementation**:
- `entry_date` field in FoodEntry enforces: `entry_date >= CURRENT_DATE - 30 days`
- Indexes optimize queries on this window
- Cleanup job (nightly): Delete FoodEntry records where `entry_date < CURRENT_DATE - 35 days` (buffer for recalculation)
- DailyIntake cleanup: Delete where `date < CURRENT_DATE - 30 days`

**Query Pattern**:
```sql
SELECT * FROM food_entries 
WHERE user_id = ? 
  AND entry_date >= CURRENT_DATE - 30 
ORDER BY entry_date DESC, created_at DESC;
```

---

## Soft-Delete & GDPR Compliance

**Deleted User Handling**:
1. User requests deletion via settings
2. Set `User.deleted_at = NOW()`
3. Cascade delete or soft-delete: FoodEntry, DailyIntake, Recommendation records
4. Retention: Keep encrypted data for 90 days (legal hold)
5. Purge: Automated job deletes `deleted_at < NOW() - 90 days`

---

## Phase 1 Completion Checklist

- [x] All 5 entities defined with fields, types, constraints
- [x] Validation rules documented for each entity
- [x] Database indexes specified for query performance
- [x] Relationships and cardinality documented
- [x] State transitions outlined (lifecycle of each entity)
- [x] 30-day rolling window policy defined
- [x] GDPR compliance approach documented

Ready for Phase 1 Contracts & API definition.
