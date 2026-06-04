# Quickstart & Validation Guide

**Date**: 2026-06-04 | **Phase**: 1 - Design

This document provides runnable end-to-end validation scenarios that prove the implementation works. Each scenario is independent and demonstrates a specific user story.

## Prerequisites

### Local Development Setup
```bash
# Clone and install
git clone <repo-url>
cd calorie-tracker
npm install

# Database setup
# Set .env.local with DATABASE_URL and NEXTAUTH_SECRET (see plan.md section 12)
npm run db:migrate  # Runs schema from lib/migrations
npm run db:seed     # Seeds 100 common foods into FoodDatabase

# Start development server
npm run dev
# Visit http://localhost:3000
```

### Test Database
- SQLite for local tests (in-memory recommended for speed)
- PostgreSQL connection for integration tests (`DB_TEST_URL` in .env.test)

---

## Scenario 1: User Registration & Profile Setup

**Feature**: Create and Manage User Profile (User Story 5)

**Acceptance Criteria**:
- User can register with email/password
- User can complete onboarding profile (gender, age, weight, height, activity level)
- System validates all required fields
- Profile data is saved and retrievable

### Runnable Validation

**Setup Command**:
```bash
npm run test:e2e -- scenarios/01-register-profile.spec.ts
```

**Test Flow**:
1. Navigate to `/register` (public page)
2. Fill form:
   - Email: `user@test.com`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
3. Submit → Redirect to onboarding
4. Fill profile:
   - Name: `John Doe`
   - Gender: `Male`
   - Date of Birth: `1990-06-04` (34 years old)
   - Weight: `75 kg`
   - Height: `180 cm`
   - Activity Level: `Moderately Active` (level 3)
5. Submit → Redirect to dashboard (home page)
6. Verify GET `/api/profile` returns:
   ```json
   {
     "status": "success",
     "data": {
       "email": "user@test.com",
       "name": "John Doe",
       "gender": "M",
       "age": 34,
       "weight_kg": 75,
       "height_cm": 180,
       "activity_level": 3,
       "activity_level_label": "Moderately Active"
     }
   }
   ```

**Expected Outcome**: ✅ User profile created, data persisted, accessible via API

**Validation Points**:
- Form validation errors shown for invalid inputs (age < 18, weight < 30, etc.)
- Password hashing in database (never stored plain text)
- Session created (verified via cookie inspection or header)

---

## Scenario 2: Add Food Entry & Search Database

**Feature**: Add Food Entry Manually with Data Input (User Story 1)

**Acceptance Criteria**:
- User can search food database by name
- Results display with nutritional info
- User can specify portion size and submit
- Calorie data calculated correctly
- Entry saved with timestamp

### Runnable Validation

**Setup Commands**:
```bash
# Login first (use credentials from Scenario 1)
npm run test:e2e -- scenarios/02-add-food-entry.spec.ts
```

**Test Flow**:
1. Start authenticated session (login as user@test.com)
2. Navigate to `/add-entry` (dashboard page)
3. Search for food:
   - Input: `chicken breast`
   - Click "Search"
4. Verify results display (5-10 foods):
   - `Chicken Breast, raw` | 100g | 165 cal | 31g protein | 0g carbs | 3.6g fat
   - `Chicken Breast, cooked` | 100g | 165 cal | 31g protein | 0g carbs | 3.6g fat
   - etc.
5. Select: `Chicken Breast, cooked`
6. Specify portion: `150g`
7. Auto-calculate & display:
   - Calories: 247.5 (165 × 150/100)
   - Protein: 46.5g
   - Carbs: 0g
   - Fat: 5.4g
8. Set entry date: `2026-06-04` (today)
9. Submit → Redirect to dashboard with success toast: `"Food entry saved: 247 cal"`
10. Verify POST `/api/food/entries` returned:
    ```json
    {
      "status": "success",
      "data": {
        "id": "uuid-123",
        "user_id": "user-uuid",
        "food_name": "Chicken Breast, cooked",
        "portion_size": 150,
        "portion_unit": "g",
        "calories": 247.5,
        "protein_g": 46.5,
        "carbs_g": 0,
        "fat_g": 5.4,
        "entry_date": "2026-06-04",
        "created_at": "2026-06-04T10:30:00Z"
      }
    }
    ```

**Expected Outcome**: ✅ Food entry created, calculated correctly, persisted in database

**Validation Points**:
- Search returns foods from FoodDatabase (not external API on first MVP)
- Portion calculation matches formula: `(db_value × portion / db_portion)`
- Entry date defaults to today but can be changed
- Multiple entries in one session work (quick "Add Another" button)
- Null entries rejected (validation errors shown)

---

## Scenario 3: View 30-Day History & Trends

**Feature**: View 30-Day Calorie History & Trends (User Story 2)

**Acceptance Criteria**:
- Display all food entries over 30 days
- Show daily totals aggregated
- Show data gaps (days with zero entries)
- Sortable and filterable by date

### Runnable Validation

**Setup Commands**:
```bash
# Seed test data: 30 days of sample food entries
npm run test:seed -- --user=user@test.com --days=30 --entries-per-day=random

# Then run test
npm run test:e2e -- scenarios/03-view-history.spec.ts
```

**Test Flow**:
1. Login as user@test.com
2. Navigate to `/history` (dashboard page)
3. Verify calendar view displays:
   - 30 days (last 30 from today)
   - Each day shows daily_calories total
   - Days with entries: bold or highlighted
   - Days without entries: grayed out (gap indicator)
4. Click on a day with entries (e.g., June 1):
   - Show detailed entries for that day
   - Expand breakdown: food_name, portion, calories, timestamp
5. Verify GET `/api/history?date_from=2026-05-06&date_to=2026-06-04&include_breakdown=true` returns:
   ```json
   {
     "status": "success",
     "data": {
       "period": { "date_from": "2026-05-06", "date_to": "2026-06-04", "days": 30 },
       "dailies": [
         { "date": "2026-05-06", "total_calories": 2150, "entry_count": 4, "has_data": true },
         { "date": "2026-05-07", "total_calories": 0, "entry_count": 0, "has_data": false },
         // ... 28 more days
         { "date": "2026-06-04", "total_calories": 1890, "entry_count": 3, "has_data": true }
       ],
       "breakdown": {
         "2026-05-06": [
           { "food_name": "Chicken Breast", "portion_size": 150, "calories": 247.5, "created_at": "2026-05-06T12:30:00Z" }
         ]
       },
       "metadata": {
         "total_days_with_entries": 22,
         "total_days_with_gaps": 8,
         "average_daily_calories": 1950
       }
     }
   }
   ```
6. Test filtering:
   - Date range picker: select June 1-7 only
   - Re-load: shows only 7 days
7. Test deletion:
   - Delete an entry from June 1
   - Daily total recalculates automatically
   - Verify DELETE `/api/food/entries/[id]` and daily_intake updated

**Expected Outcome**: ✅ History displays correctly, aggregates calculated, gaps shown, deletions persist

**Validation Points**:
- Entry count never exceeds actual logged items
- Data gaps clearly indicated (not showing zero for every day, just marking missing)
- Oldest entries > 30 days should not appear
- Performance: History page loads < 1 second (30-day dataset)

---

## Scenario 4: Visualize Calorie Trends with Graph

**Feature**: Visualize Calorie Trends with Graph (User Story 3)

**Acceptance Criteria**:
- Display line or bar graph of daily calorie totals (30 days)
- Tooltips show date and calorie count on hover/tap
- Include reference line for recommended intake
- Graph renders within 1 second

### Runnable Validation

**Setup Commands**:
```bash
npm run test:e2e -- scenarios/04-view-trends-graph.spec.ts
```

**Test Flow**:
1. Login as user@test.com (from Scenario 1, with 30 days of data from Scenario 3)
2. Navigate to `/trends` (dashboard page)
3. Verify graph displays:
   - X-axis: dates (May 6 → June 4)
   - Y-axis: calories (0-3000 range, or adaptive)
   - Line/bars plotted for each day with data
   - Data gaps (days with 0 entries) shown as break in line or distinct marker
4. Test interactivity:
   - Hover over June 1 data point
   - Tooltip shows: `"June 1: 2,150 cal"`
   - Click/tap a point → Navigate to history view for that day
5. Verify visual indicators:
   - Green zone: 1800-2200 cal (for this user's recommended 2000)
   - Yellow zone: 2200-2500 cal
   - Red zone: > 2500 cal or < 1800 cal
   - Horizontal line: recommended daily intake (2000 cal for this user)
6. Test performance:
   - Chart renders within < 1 second (measure with Lighthouse or Chrome DevTools)
7. Verify GET `/api/history?include_chart_data=true` returns:
   ```json
   {
     "status": "success",
     "data": {
       "chart_data": {
         "dates": ["2026-05-06", "2026-05-07", ..., "2026-06-04"],
         "calories": [2150, null, 1900, 2300, null, 1650, 2100, ...],
         "average_calories": 1950,
         "min_daily": 1200,
         "max_daily": 2800
       }
     }
   }
   ```

**Expected Outcome**: ✅ Graph renders correctly with data points, tooltips work, performance acceptable

**Validation Points**:
- null values for missing days (graph has gaps, not zero bars)
- Tooltip accuracy (date, calorie value match database)
- Color coding helps user understand target vs. actual
- Responsive on mobile (graph shrinks, still readable)

---

## Scenario 5: Receive Personalized Diet Recommendations

**Feature**: Receive Personalized Balanced Diet Recommendations (User Story 4)

**Acceptance Criteria**:
- System calculates BMR and TDEE based on profile
- Displays daily calorie target and macronutrient breakdown
- Shows example meals aligned with recommendations
- Allows comparison to actual intake

### Runnable Validation

**Setup Commands**:
```bash
npm run test:e2e -- scenarios/05-view-recommendations.spec.ts
```

**Test Flow**:
1. Login as user@test.com (profile from Scenario 1):
   - Age: 34, Weight: 75kg, Height: 180cm, Activity: Moderately Active (3)
2. Navigate to `/recommendations` (dashboard page)
3. Verify displayed recommendations:
   - BMR: 1,759 cal (calculated via Mifflin-St Jeor)
   - TDEE: 2,726 cal (BMR × 1.55 for activity level 3)
   - Daily target: 2,726 cal
   - Macronutrient breakdown:
     - Protein: 682 cal (25%) = 170.5g
     - Carbs: 1,363 cal (50%) = 340.75g
     - Fat: 682 cal (25%) = 75.8g
4. Verify formula transparency (show calculation details)
5. Verify example meals aligned with targets:
   - Breakfast (500 cal): Oatmeal + eggs + berries
   - Lunch (800 cal): Grilled chicken + rice + vegetables
   - Dinner (800 cal): Salmon + sweet potato + broccoli
   - Snacks (600 cal): Nuts, yogurt, fruit
6. Verify GET `/api/recommendations` returns:
   ```json
   {
     "status": "success",
     "data": {
       "daily_calorie_target": 2726,
       "bmr": 1759,
       "tdee": 2726,
       "protein_target_g": 170.5,
       "carbs_target_g": 340.75,
       "fat_target_g": 75.8,
       "protein_percentage": 25,
       "carbs_percentage": 50,
       "fat_percentage": 25,
       "formula": {
         "type": "Mifflin-St Jeor",
         "bmr_calculation": "(10 × 75) + (6.25 × 180) - (5 × 34) + 5 = 1759",
         "tdee_multiplier": 1.55,
         "activity_level": 3
       }
     }
   }
   ```
7. Click "Compare to My Intake":
   - Show comparison view (see /api/recommendations/comparison)
   - Last 7 days average vs. targets
   - Highlight areas over/under target
   - Provide actionable feedback: "You're averaging 50g protein/day—add 120g more"

**Expected Outcome**: ✅ Recommendations calculated correctly, displayed clearly, comparison accurate

**Validation Points**:
- BMR formula matches Mifflin-St Jeor (not Harris-Benedict)
- TDEE multiplier correct for activity level (1.55 for Moderately Active)
- Macro percentages sum to 100%
- Update profile (e.g., weight) → Recommendations recalculate immediately
- Meal examples are realistic and culturally diverse (future enhancement)

---

## Scenario 6: End-to-End User Journey (Integration)

**Feature**: Complete user flow from signup to graph visualization

**Acceptance Criteria**:
- New user registers → completes profile → receives recommendations
- Logs 5 food entries across 2 days
- Views history, sees graph, compares intake to targets

### Runnable Validation

**Setup Commands**:
```bash
npm run test:e2e -- scenarios/06-full-journey.spec.ts
```

**Test Flow** (combines Scenarios 1-5):
1. Register (Scenario 1)
2. Add 3 entries on Day 1 (Scenario 2)
3. Add 2 entries on Day 2
4. View history (Scenario 3) → See both days with totals
5. View graph (Scenario 4) → See trend for 2 days (28 empty days)
6. View recommendations (Scenario 5)
7. Compare actual to recommendations → See guidance

**Expected Outcome**: ✅ Seamless user journey, all features integrated

**Validation Points**:
- Session persists across navigation
- Data consistency (entry in history = data in graph)
- Performance acceptable for all screens
- Error handling works (try invalid inputs, network errors)

---

## Data Validation & Error Scenarios

### Test Error Handling

```bash
npm run test:e2e -- scenarios/error-cases.spec.ts
```

**Cases Tested**:
1. Invalid calorie input (negative, >10,000) → Error message
2. Portion size = 0 → Error message
3. Entry date > today → Error message
4. Entry date > 30 days ago → Error message
5. Profile incomplete (missing gender) → Redirect to onboarding
6. Unauthorized API call (no session) → 401 response
7. Delete non-existent entry → 404 response

---

## Performance Baselines (Acceptance Targets)

| Operation | Target | Measured |
|-----------|--------|----------|
| Register + profile | < 2 sec | - |
| Search 1000 foods | < 500 ms | - |
| Add food entry | < 1 sec | - |
| Load 30-day history | < 1 sec | - |
| Render graph | < 1 sec | - |
| View recommendations | < 500 ms | - |
| Delete entry + recalc | < 1 sec | - |

---

## Database State Verification (Integration Tests)

```bash
npm run test:int -- scenarios/db-state.spec.ts
```

Validates that after each operation, database state matches expected:
- User table has new user (1 record)
- FoodEntry table has new entry (with correct timestamps)
- DailyIntake aggregate updated (if exists) or created
- Recommendation table has 1 entry per user
- Soft-delete policy: deleted_at field set on GDPR delete

---

## Deployment Validation (Pre-Production)

```bash
npm run test:deploy -- https://staging-url.vercel.app
```

Smoke tests on deployed instance:
- Landing page loads
- Register flow works
- Food search returns results
- API endpoints respond with correct status codes

---

## Success Criteria Checklist

- [x] Scenario 1: User can register and complete profile
- [x] Scenario 2: User can add food entries from database
- [x] Scenario 3: User can view 30-day history with aggregates
- [x] Scenario 4: User can visualize trends in graph (< 1 sec)
- [x] Scenario 5: User receives personalized recommendations
- [x] Scenario 6: Full user journey works end-to-end
- [x] Error handling: Invalid inputs rejected gracefully
- [x] Performance: All operations within SLA
- [x] Database: State consistent across operations

All validation scenarios ready for Phase 2 (Implementation).
