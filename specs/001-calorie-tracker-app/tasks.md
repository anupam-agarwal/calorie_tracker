# Tasks: Calorie Tracker Application

**Input**: Design documents from `/specs/001-calorie-tracker-app/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests NOT explicitly requested in spec - implementation-focused only.

**Organization**: Tasks are grouped by user story (US1-US5) to enable independent implementation and testing of each story. Foundational tasks must complete before user story work can begin.

**Technology Stack**: Next.js 14 + React 18 + PostgreSQL + TypeScript + Tailwind CSS

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Single Next.js project**: `app/` (App Router), `components/`, `lib/`, `public/`
- **Styles**: `app/globals.css` (Tailwind)
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/e2e/`
- **Database**: `lib/db.ts`, `lib/queries.ts`, migrations/ (TBD)
- **API routes**: `app/api/*/route.ts`
- **Pages**: `app/(dashboard)/*/page.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for Next.js + PostgreSQL

- [ ] T001 Create project structure per implementation plan (directories: app/, components/, lib/, tests/, public/)
- [ ] T002 Initialize Next.js 14 project with TypeScript and install core dependencies (React 18, Next.js, TanStack Query, Recharts, Zod, Tailwind, shadcn/ui, NextAuth.js)
- [ ] T003 [P] Configure ESLint and Prettier in `eslintrc.json` and `.prettierrc`
- [ ] T004 [P] Setup Tailwind CSS configuration in `tailwind.config.ts` and import globals in `app/globals.css`
- [ ] T005 [P] Configure environment variables template in `.env.local.example` (DATABASE_URL, NEXTAUTH_SECRET, etc.)
- [ ] T006 Create `.gitignore` with `.env.local`, node_modules, `.next/`, etc.
- [ ] T007 [P] Setup Git commit hooks (Husky) to run linting before commits

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 [P] Setup PostgreSQL schema migration framework (scripts for creating tables)
- [ ] T009 [P] Create database connection utility in `lib/db.ts` (node-postgres client, connection pooling)
- [ ] T010 [P] Implement authentication setup with NextAuth.js in `app/api/auth/[...nextauth]/route.ts`
- [ ] T011 [P] Create User entity/model schema in database migrations (id, email, password_hash, name, gender, date_of_birth, weight_kg, height_cm, activity_level, created_at, updated_at, deleted_at)
- [ ] T012 [P] Implement middleware for session verification in `lib/auth.ts` and `app/middleware.ts`
- [ ] T013 [P] Create standardized API response wrapper utility in `lib/api-response.ts` (success/error envelopes)
- [ ] T014 [P] Setup error handling and logging middleware in `app/api/middleware/` directory
- [ ] T015 [P] Create Zod validation schemas in `lib/validation.ts` for User, FoodEntry, Recommendation entities
- [ ] T016 [P] Create database query helper functions in `lib/queries.ts` for CRUD operations
- [ ] T017 Setup Jest and React Testing Library configuration in `jest.config.js` and `jest.setup.js`
- [ ] T018 Create base layout component in `app/layout.tsx` with navigation, auth state, error boundaries

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Food Entry Manually with Data Input (Priority: P1) 🎯 MVP

**Goal**: Users can search a food database, select a food, specify portion size, and the system calculates and saves calorie data.

**Independent Test**: Manually enter a food item with portion size and verify:
1. Calorie calculation matches formula: (db_value × portion / db_portion)
2. Entry saved with timestamp and user ID
3. API returns entry with correct structure (from contracts/food-entries.ts)

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create FoodDatabase entity schema in database migration (food_name, serving_size, serving_unit, calories_per_serving, protein_g, carbs_g, fat_g, usda_fdc_id, category, created_at)
- [ ] T020 [P] [US1] Create FoodEntry entity schema in database migration (user_id, food_name, portion_size, portion_unit, calories, protein_g, carbs_g, fat_g, food_database_id, photo_url, created_at, entry_date)
- [ ] T021 [P] [US1] Seed 100 common foods into FoodDatabase table in `scripts/seed-foods.ts` (chicken, rice, vegetables, fruits, dairy, grains, proteins)
- [ ] T022 [P] [US1] Create food search query function in `lib/queries.ts` - search FoodDatabase by name (case-insensitive LIKE)
- [ ] T023 [P] [US1] Create food entry creation function in `lib/queries.ts` with calorie calculation utility
- [ ] T024 [P] [US1] Create calorie calculation utility in `lib/calculations.ts` (formula: (portion_size / serving_size) × calories_per_serving)
- [ ] T025 [US1] Implement food search API endpoint in `app/api/food/search/route.ts` (GET, query parameter, returns matching foods with pagination)
- [ ] T026 [US1] Implement create food entry API endpoint in `app/api/food/entries/route.ts` (POST, with validation, calorie calculation, auth required)
- [ ] T027 [US1] Implement get food entries endpoint in `app/api/food/entries/route.ts` (GET, with pagination, date filtering, auth required)
- [ ] T028 [US1] Implement update food entry endpoint in `app/api/food/entries/[entryId]/route.ts` (PATCH, with validation, auth required)
- [ ] T029 [US1] Implement delete food entry endpoint in `app/api/food/entries/[entryId]/route.ts` (DELETE, auth required, trigger daily_intake recalc)
- [ ] T030 [P] [US1] Create FoodEntryForm component in `components/FoodEntryForm.tsx` (search input, results dropdown, portion size input, preview calories, submit button)
- [ ] T031 [P] [US1] Create FoodSearchResults component in `components/FoodSearchResults.tsx` (display food matches with nutrition info, clickable to select)
- [ ] T032 [US1] Create useAddFoodEntry hook in `components/hooks/useAddFoodEntry.ts` (TanStack Query mutation for POST /api/food/entries, optimistic updates)
- [ ] T033 [US1] Create AddEntry page in `app/(dashboard)/add-entry/page.tsx` (layout with FoodEntryForm, handle submission, show success/error toast)
- [ ] T034 [US1] Create Home/Dashboard page in `app/(dashboard)/page.tsx` (navigation to add entry, quick stats placeholder, recent entries preview)
- [ ] T035 [P] [US1] Create UI Button component in `components/ui/Button.tsx` (shadcn/ui based, variants: default, destructive, outline)
- [ ] T036 [P] [US1] Create UI Card component in `components/ui/Card.tsx` (container with border, padding, shadow)
- [ ] T037 [P] [US1] Create UI Form component in `components/ui/Form.tsx` (React Hook Form wrapper with Zod validation integration)
- [ ] T038 [P] [US1] Create UI Input component in `components/ui/Input.tsx` (text input with label, error state styling)
- [ ] T039 [P] [US1] Create UI Select component in `components/ui/Select.tsx` (dropdown for activity level, portion units, etc.)
- [ ] T040 [US1] Add validation error handling in API responses with detailed field-level errors

**Checkpoint**: User Story 1 fully functional - user can add food entry, search database, calculate calories, entry saved to database

---

## Phase 4: User Story 5 - Create and Manage User Profile (Priority: P2)

**Goal**: Users can set up and update their profile (name, gender, age, weight, activity level) to enable personalized recommendations.

**Independent Test**: Create user account, enter profile details, verify:
1. All required fields validated
2. Age validation (≥18 years)
3. Profile data persisted and retrievable
4. Profile changes trigger recommendation recalculation

### Implementation for User Story 5

- [ ] T041 [P] [US5] Create Recommendation entity schema in database migration (user_id, daily_calorie_target, protein_target_g, carbs_target_g, fat_target_g, bmr, tdee, created_at, updated_at)
- [ ] T042 [P] [US5] Create BMR calculation utility in `lib/calculations.ts` (Mifflin-St Jeor formula implementation)
- [ ] T043 [P] [US5] Create recommendation generation function in `lib/queries.ts` (calculate BMR, apply activity multiplier, derive macro targets)
- [ ] T044 [US5] Create/Update user profile endpoint in `app/api/profile/route.ts` (GET current, PATCH update with validation)
- [ ] T045 [US5] Implement profile update trigger in database to recalculate recommendations on weight/activity change
- [ ] T046 [P] [US5] Create UserProfileForm component in `components/UserProfileForm.tsx` (fields: name, gender, DOB, weight, height, activity level, submit)
- [ ] T047 [P] [US5] Create ActivityLevelSelect component in `components/ActivityLevelSelect.tsx` (radio buttons or dropdown with descriptions 1-5: Sedentary to Extremely Active)
- [ ] T048 [US5] Create ProfilePage in `app/(dashboard)/profile/page.tsx` (display current profile, edit form, show when recommendations last updated)
- [ ] T049 [US5] Implement registration flow in `app/(auth)/register/page.tsx` (email, password, redirect to onboarding)
- [ ] T050 [US5] Implement onboarding flow in `app/(auth)/onboarding/page.tsx` (profile completion form, save profile, redirect to dashboard)
- [ ] T051 [US5] Create useUpdateProfile hook in `components/hooks/useUpdateProfile.ts` (TanStack Query mutation for PATCH /api/profile)
- [ ] T052 [US5] Add profile completion check middleware in `app/middleware.ts` (redirect incomplete profiles to onboarding)
- [ ] T053 [US5] Implement NextAuth.js email/password provider configuration in `app/api/auth/[...nextauth]/route.ts`
- [ ] T054 [US5] Create login page in `app/(auth)/login/page.tsx` (email, password inputs, submit to NextAuth, redirect to dashboard on success)
- [ ] T055 [US5] Create user registration API endpoint in `app/api/auth/register/route.ts` (POST: email, password, password hash, create user record)

**Checkpoint**: User Story 5 fully functional - user can register, complete profile, login, edit profile, recommendations auto-generate

---

## Phase 5: User Story 2 - View 30-Day Calorie History & Trends (Priority: P1)

**Goal**: Users see all food entries over the past 30 days with daily totals, sortable/filterable, with visual gaps for missing days.

**Independent Test**: Log entries across multiple days, verify:
1. History displays 30-day rolling window (no entries >30 days old)
2. Daily totals correctly aggregated
3. Data gaps clearly marked (days with zero entries)
4. Sorting by date works (newest/oldest)
5. Filtering by date range works

### Implementation for User Story 2

- [ ] T056 [P] [US2] Create DailyIntake entity schema in database migration (user_id, date, total_calories, total_carbs_g, total_protein_g, total_fat_g, entry_count, updated_at)
- [ ] T057 [P] [US2] Create database trigger or function to auto-calculate daily_intake on food_entry insert/update/delete
- [ ] T058 [P] [US2] Create 30-day history query function in `lib/queries.ts` (fetch FoodEntry + DailyIntake for last 30 days with sorting/filtering)
- [ ] T059 [P] [US2] Create history API endpoint in `app/api/history/route.ts` (GET with date_from, date_to, include_breakdown params, returns dailies + optional entry breakdown)
- [ ] T060 [P] [US2] Create day detail endpoint in `app/api/history/[date]/route.ts` (GET specific day's entries and daily total)
- [ ] T061 [P] [US2] Create history stats endpoint in `app/api/history/stats/route.ts` (GET 30-day average, min/max daily calories, days with data/gaps)
- [ ] T062 [P] [US2] Create HistoryTable component in `components/HistoryTable.tsx` (display food entries with date, food name, portion, calories, action buttons)
- [ ] T063 [P] [US2] Create DailyBreakdownCard component in `components/DailyBreakdownCard.tsx` (show day's total calories, macro breakdown, expand/collapse entries)
- [ ] T064 [P] [US2] Create DateRangeFilter component in `components/DateRangeFilter.tsx` (date picker for start/end, apply filter button)
- [ ] T065 [US2] Create useHistoryData hook in `components/hooks/useHistoryData.ts` (TanStack Query with date range filtering, sorting, pagination)
- [ ] T066 [US2] Create HistoryPage in `app/(dashboard)/history/page.tsx` (layout with DateRangeFilter, HistoryTable, DailyBreakdownCard, delete entry functionality)
- [ ] T067 [US2] Implement day gap indicator in DailyBreakdownCard (visual marker or text: "No entries logged")
- [ ] T068 [US2] Implement delete entry from history with modal confirmation in HistoryPage
- [ ] T069 [US2] Add sorting toggle in HistoryPage (sort by date newest/oldest)
- [ ] T070 [P] [US2] Create SortButton component in `components/ui/SortButton.tsx` (toggle ascending/descending)

**Checkpoint**: User Story 2 fully functional - user can view 30-day history, see daily totals, identify gaps, filter/sort, delete entries

---

## Phase 6: User Story 3 - Visualize Calorie Trends with Graph (Priority: P1)

**Goal**: Users see a line/bar graph of daily calorie intake over 30 days with tooltips, reference lines for recommended intake, and visual identification of peaks/valleys.

**Independent Test**: Generate graph from 30 days of data, verify:
1. Graph renders in <1 second
2. Data points correctly plotted (daily totals match database)
3. Data gaps shown (null/break in line for missing days)
4. Tooltips display date and calorie count on hover
5. Recommended calorie line visible

### Implementation for User Story 3

- [ ] T071 [P] [US3] Create chart data formatting function in `lib/calculations.ts` (transform 30-day data into Recharts format with nulls for gaps)
- [ ] T072 [P] [US3] Create chart query endpoint in `app/api/history/route.ts` (add include_chart_data param to return chart-ready format)
- [ ] T073 [P] [US3] Create CalorieGraph component in `components/CalorieGraph.tsx` (Recharts LineChart with daily calories, reference line for recommended intake, tooltips)
- [ ] T074 [P] [US3] Create CustomTooltip component in `components/CustomTooltip.tsx` (display date and calorie count in tooltip on hover)
- [ ] T075 [P] [US3] Create useChartData hook in `components/hooks/useChartData.ts` (TanStack Query fetch chart data, format for Recharts, handle loading/error)
- [ ] T076 [US3] Create TrendsPage in `app/(dashboard)/trends/page.tsx` (layout with CalorieGraph, date range filter, stats summary showing avg/min/max calories)
- [ ] T077 [US3] Add reference line to CalorieGraph showing user's daily calorie recommendation (from Recommendation.daily_calorie_target)
- [ ] T078 [US3] Add color zones to CalorieGraph (green: on target, yellow: ±200 cal, red: >200 off target)
- [ ] T079 [US3] Implement graph responsiveness for mobile (smaller font, dynamic sizing)
- [ ] T080 [US3] Add export/download graph feature (optional: CSV or PNG)

**Checkpoint**: User Story 3 fully functional - user can view interactive trend graph with reference lines, tooltips, performance optimized

---

## Phase 7: User Story 4 - Receive Personalized Balanced Diet Recommendations (Priority: P2)

**Goal**: System calculates personalized daily calorie and macronutrient targets based on user profile, displays recommendations with example meals, and allows comparison to actual intake.

**Independent Test**: Enter complete profile, verify:
1. Recommendations calculated via Mifflin-St Jeor formula
2. Macronutrient percentages correct (protein/carbs/fat sum to 100%)
3. Example meals provided
4. Comparison to actual intake works (average vs. targets)

### Implementation for User Story 4

- [ ] T081 [P] [US4] Create recommendations API endpoint in `app/api/recommendations/route.ts` (GET current user's recommendation with BMR, TDEE, macro targets, formula details)
- [ ] T082 [P] [US4] Create comparison endpoint in `app/api/recommendations/comparison/route.ts` (GET date range, compare actual avg intake vs. recommendation targets with insights)
- [ ] T083 [P] [US4] Create RecommendationCard component in `components/RecommendationCard.tsx` (display daily calorie target, macro targets, formula transparency)
- [ ] T084 [P] [US4] Create MacroBreakdown component in `components/MacroBreakdown.tsx` (visual breakdown of protein/carbs/fat with percentages and gram targets)
- [ ] T085 [P] [US4] Create MealExamples component in `components/MealExamples.tsx` (display example breakfast/lunch/dinner/snack aligned with targets, ~500-800 cal per meal)
- [ ] T086 [P] [US4] Create ComparisonChart component in `components/ComparisonChart.tsx` (Recharts BarChart showing actual vs. target for calories + macros, last 7 days average)
- [ ] T087 [US4] Create useRecommendations hook in `components/hooks/useRecommendations.ts` (TanStack Query fetch recommendations)
- [ ] T088 [US4] Create useComparisonData hook in `components/hooks/useComparisonData.ts` (TanStack Query fetch comparison data, date range filtering)
- [ ] T089 [US4] Create RecommendationsPage in `app/(dashboard)/recommendations/page.tsx` (layout with RecommendationCard, MacroBreakdown, MealExamples, ComparisonChart with date filter)
- [ ] T090 [US4] Generate actionable insights text in comparison (e.g., "You're averaging 50g protein/day—add 120g more to reach target")
- [ ] T091 [US4] Implement meal example database or hardcoded set (20-30 meals with nutrition data for suggestions)
- [ ] T092 [US4] Add PDF export for recommendations (optional enhancement)

**Checkpoint**: User Story 4 fully functional - user receives personalized recommendations with comparison to actual intake, actionable insights provided

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, performance optimization, and validation

- [ ] T093 [P] Run quickstart.md validation scenarios end-to-end (Scenario 1-6: register, add entry, view history, view graph, view recommendations, full journey)
- [ ] T094 [P] Performance baseline testing (verify <1s graph render, <500ms API responses, <2s page load on 3G)
- [ ] T095 [P] Database index optimization (verify indexes on user_id, entry_date, created_at for query performance)
- [ ] T096 [P] Code cleanup and refactoring (consistent naming, remove dead code, consolidate utilities)
- [ ] T097 [P] Add comprehensive unit tests for calculation utilities in `tests/unit/calculations.test.ts` (BMR formula, calorie calculation, macro percentages)
- [ ] T098 [P] Add integration tests for API endpoints in `tests/integration/api.test.ts` (test each endpoint with valid/invalid inputs)
- [ ] T099 [P] Security hardening (verify no SQL injection, validate all inputs server-side, check CORS settings, rate limiting)
- [ ] T100 [P] Documentation: Create README.md with setup instructions, deployment steps, API endpoint documentation
- [ ] T101 [P] Documentation: Create ARCHITECTURE.md explaining folder structure, data flow, key design decisions
- [ ] T102 Add logging for critical operations (user registration, food entry creation, profile updates) in `lib/logger.ts`
- [ ] T103 Implement GDPR data deletion request flow in `app/api/profile/delete-data/route.ts` (soft-delete user data, schedule purge after 90 days)
- [ ] T104 Setup error tracking (Sentry or similar) for production environment
- [ ] T105 Test authentication flow edge cases (expired session, password reset, email verification if added)
- [ ] T106 Accessibility audit (run axe or Lighthouse, verify WCAG 2.1 AA compliance)
- [ ] T107 Mobile responsiveness testing (test on common breakpoints: 320px, 768px, 1024px)
- [ ] T108 Add loading skeletons for all data-fetching pages (HistoryPage, TrendsPage, RecommendationsPage)
- [ ] T109 Implement empty state UI (no entries, no profile, no recommendations, etc.)
- [ ] T110 Add success/error toast notifications (useToast hook, display across app for user feedback)

**Checkpoint**: All user stories validated, polished, tested, documented, and optimized for production

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T007) - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase (T008-T018) completion
  - US1 (P1 - Add Entry): Can start after Foundational
  - US5 (P2 - Profile): Can start after Foundational; needed for profile before US4 uses it
  - US2 (P1 - History): Can start after US1 (needs food entries to exist)
  - US3 (P1 - Graph): Can start after US2 (uses historical data)
  - US4 (P2 - Recommendations): Can start after US5 (needs profile for BMR calc)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

```
Setup (Phase 1) + Foundational (Phase 2)
    ↓
US1 (Add Entry) → US2 (History) → US3 (Graph)
    ↓                              
US5 (Profile) → US4 (Recommendations)
    ↓
Polish & Testing (Phase 8)
```

**Independent Execution**:
- Once Foundational is complete, US1 and US5 can be worked in parallel
- Once US1 is done, US2 can start (has entries to view)
- Once US2 is done, US3 can start (has historical data to plot)
- US4 depends on US5 completion (needs profile for recommendations)
- All user stories must complete before Polish phase

### Within Each User Story

- Models/entities before services/queries
- Services/queries before API endpoints
- API endpoints before UI components
- UI components before page integration
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 Setup** - All [P] tasks parallelizable:
- T003-T007 can run simultaneously (different config files)

**Phase 2 Foundational** - Most [P] tasks parallelizable:
- T008-T012, T015-T016 can run in parallel (different schemas/utilities)
- T013-T014 can follow T009 (depend on auth setup)
- T017-T018 parallel but need T009 complete first

**Phase 3 US1** - Many [P] tasks parallelizable:
- T019-T024 (models, queries, utilities) can run in parallel
- T025-T029 (API endpoints) can run after T023
- T030-T040 (UI components) can run in parallel after T025

**Phase 5 US2** - Similar parallelization:
- T056-T061 (database) can run in parallel
- T062-T067 (UI components) can run in parallel after T059

**Phase 6 US3** - Chart components parallelizable:
- T071-T075 can run in parallel
- T076-T080 follow T075

### Suggested Parallel Team Workflow

With 3 developers:
```
Week 1: All - Setup (Phase 1) + Foundational (Phase 2) = ~5 days
Week 2-3:
  - Dev A: US1 (Add Entry) + US2 (History) 
  - Dev B: US3 (Graph visualization)
  - Dev C: US5 (Profile) + US4 (Recommendations)
Week 4: All - Polish, testing, optimization (Phase 8)
Week 5: Deployment, monitoring, final validation
```

---

## Parallel Example: User Story 1 Implementation

Launch these tasks together (after T023 complete):

```
UI Components (parallel):
  - T030: FoodEntryForm component
  - T031: FoodSearchResults component
  - T035: Button UI component
  - T036: Card UI component
  - T037: Form UI component
  - T038: Input UI component
  - T039: Select UI component

API Endpoints (after T023):
  - T025: Food search endpoint
  - T026: Create entry endpoint
  - T027: Get entries endpoint
  - T028: Update entry endpoint
  - T029: Delete entry endpoint

Hooks & Pages (after endpoints ready):
  - T032: useAddFoodEntry hook
  - T033: AddEntry page
  - T034: Dashboard page
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (1-2 days)
2. Complete Phase 2: Foundational (2-3 days) - **BLOCKS everything**
3. Complete Phase 3: User Story 1 (2-3 days) - Add food entry
4. Complete Phase 5: User Story 2 (2-3 days) - View history
5. Complete Phase 6: User Story 3 (2-3 days) - View graph
6. **VALIDATE AND DEPLOY**: Test MVP independently
7. **DEMO TO STAKEHOLDERS**: Core feature (food tracking + history + trends)

**MVP Scope**: Users can log food, see 30-day history, visualize trends. (~9-12 days total)

### Incremental Delivery (Add Stories 4-5)

1. MVP complete and deployed (above)
2. Phase 4: User Story 5 (2-3 days) - User profile
3. Phase 7: User Story 4 (2-3 days) - Recommendations
4. Phase 8: Polish & Testing (2-3 days)
5. **DEPLOY VERSION 2**: Full feature set

**Full Scope**: MVP + personalized recommendations (~15-18 days total)

### Parallel Team Strategy

With multiple developers, deploy after each story completion:

1. Setup + Foundational: **All team** (Days 1-5)
2. **Day 6-9**: US1 ready → Deploy MVP v0.1 (add food entries)
3. **Day 10-13**: US1+US2 ready → Deploy MVP v0.2 (add history)
4. **Day 14-17**: US1+US2+US3 ready → Deploy MVP v1.0 (add trends graph)
5. **Day 18-21**: US1+US2+US3+US5+US4 ready → Deploy Full v2.0 (add recommendations)

Each deployment validates story independently before adding next feature.

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [US#] label = maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group of tasks
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Design-first approach: Contracts + data model defined before implementation
- Database migrations managed as separate tasks (schema setup prerequisites)
- API contracts from `/contracts/` guide endpoint implementation
- Quickstart scenarios validate end-to-end functionality per story
- Performance targets: <1s graph, <500ms API, <2s page load (use Lighthouse)

---

## Task Summary

**Total Tasks**: 110

**By Phase**:
- Phase 1 (Setup): 7 tasks
- Phase 2 (Foundational): 11 tasks
- Phase 3 (US1 - Add Entry): 22 tasks
- Phase 4 (US5 - Profile): 15 tasks
- Phase 5 (US2 - History): 15 tasks
- Phase 6 (US3 - Graph): 10 tasks
- Phase 7 (US4 - Recommendations): 12 tasks
- Phase 8 (Polish): 18 tasks

**By User Story**:
- US1 (Add Food Entry, P1): 22 tasks
- US2 (30-Day History, P1): 15 tasks
- US3 (Trends Graph, P1): 10 tasks
- US4 (Recommendations, P2): 12 tasks
- US5 (User Profile, P2): 15 tasks
- Foundational: 11 tasks
- Setup: 7 tasks
- Polish: 18 tasks

**Parallelizable Tasks**: ~50 tasks marked [P]

**MVP Scope (Stories 1-3 only)**: ~54 tasks (Phase 1 + Phase 2 + Phase 3 + Phase 5 + Phase 6)

**Full Scope (All Stories)**: ~110 tasks

**Estimated Timeline**:
- MVP: 9-12 days (1-2 weeks with 1 developer)
- Full: 15-18 days (2-3 weeks with 1 developer)
- Parallel (3 devs): 5-7 weeks including deployment & polish
