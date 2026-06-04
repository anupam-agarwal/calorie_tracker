# Implementation Plan: Calorie Tracker Application

**Branch**: `001-calorie-tracker-app` | **Date**: 2026-06-04 | **Spec**: `specs/001-calorie-tracker-app/spec.md`

**Input**: Feature specification from `specs/001-calorie-tracker-app/spec.md`

**Note**: This plan uses Next.js + PostgreSQL deployed on Vercel for easiest implementation and free hosting.

## Summary

Build a full-stack calorie tracking web application using Next.js with React frontend and API routes backend. Users can manually log food entries with a searchable food database, view 30-day history with visual graphs, and receive personalized diet recommendations based on their profile. Deployed on Vercel with free PostgreSQL storage via Vercel Postgres, enabling rapid iteration and zero-cost hosting for MVP.

## Technical Context

**Language/Version**: TypeScript/Next.js 14.x (Node 18+)

**Primary Dependencies**: 
- React 18 (frontend)
- Next.js 14 (full-stack)
- PostgreSQL 15+ (via Vercel Postgres)
- TanStack Query (data fetching)
- Recharts (graphs/visualizations)
- Zod (schema validation)

**Storage**: PostgreSQL (Vercel Postgres free tier, 3GB included)

**Testing**: Jest + React Testing Library (frontend), Jest + Supertest (API routes)

**Target Platform**: Web (Chrome, Firefox, Safari, Edge on desktop/mobile)

**Project Type**: Full-stack web application (Next.js)

**Performance Goals**: 
- API responses <200ms (food search, calorie calculation)
- Graph rendering <1s (30-day dataset)
- Page load <2s (3G connection)
- Support 1,000 concurrent users

**Constraints**: 
- Free tier deployment (Vercel)
- No external AI/ML services for MVP (food recognition out of scope)
- Manual food entry + database search only
- Offline support not required

**Scale/Scope**: 
- 10k users (free tier sufficient)
- ~50+ food database entries for MVP
- 5-6 main screens (home, add entry, history, graph, profile, recommendations)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality**: ✅ PASS
- Next.js enforces structure (app router, API routes)
- TypeScript + Zod for type safety
- Planned: ESLint + Prettier in CI/CD

**Testing Standards**: ✅ PASS
- Jest configured for unit/integration tests
- React Testing Library for component tests
- API route testing with Supertest
- Target: 80%+ coverage on business logic

**UX Consistency**: ✅ PASS
- Standardized API response format
- Consistent error handling
- WCAG 2.1 AA baseline (React a11y plugin)
- Localization-ready (i18n setup planned)

**Performance**: ✅ PASS
- Next.js Image optimization + lazy loading
- Database query indexing on user_id, created_at
- N+1 query prevention via TanStack Query batching
- Graph library (Recharts) optimized for 30-day datasets

**No violations identified. Proceed to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/001-calorie-tracker-app/
├── spec.md              # Feature specification (LOCKED)
├── plan.md              # This file (planning output)
├── research.md          # Phase 0: Technology stack & API integration decisions
├── data-model.md        # Phase 1: Data entities & relationships
├── quickstart.md        # Phase 1: Validation scenarios & run guide
├── contracts/           # Phase 1: API contract definitions
│   ├── food-entry.ts    # Add food, update, delete contracts
│   ├── history.ts       # List entries, filter contracts
│   └── recommendations.ts # Get recommendations contract
└── tasks.md             # Phase 2: Implementation task breakdown (NOT from /speckit.plan)
```

### Source Code (repository root)

```text
calorie-tracker/
├── app/                          # Next.js app router
│   ├── (auth)/                   # Auth group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Protected dashboard group
│   │   ├── page.tsx              # Home/dashboard
│   │   ├── add-entry/page.tsx    # Food entry form
│   │   ├── history/page.tsx      # History & filters
│   │   ├── trends/page.tsx       # Graph visualization
│   │   ├── profile/page.tsx      # User profile/settings
│   │   └── recommendations/page.tsx  # Diet recommendations
│   ├── api/                      # API Routes (backend)
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── food/
│   │   │   ├── search/route.ts   # Search food database
│   │   │   └── entries/route.ts  # CRUD food entries
│   │   ├── history/
│   │   │   └── [userId]/route.ts # Get 30-day history
│   │   ├── recommendations/
│   │   │   └── [userId]/route.ts # Get personalized recommendations
│   │   └── profile/
│   │       └── [userId]/route.ts # Get/update user profile
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Form.tsx
│   │   └── Modal.tsx
│   ├── FoodEntryForm.tsx         # Add food entry form
│   ├── CalorieGraph.tsx          # Chart using Recharts
│   ├── HistoryTable.tsx          # Food entry history table
│   └── RecommendationCard.tsx    # Display recommendations
│
├── lib/
│   ├── db.ts                     # PostgreSQL connection (node-postgres)
│   ├── auth.ts                   # Auth utilities (JWT)
│   ├── queries.ts                # Database query helpers
│   ├── calculations.ts           # Calorie & BMR calculations
│   └── validation.ts             # Zod schemas
│
├── public/
│   └── favicon.ico
│
├── tests/
│   ├── unit/
│   │   ├── calculations.test.ts
│   │   └── validation.test.ts
│   ├── integration/
│   │   ├── food-api.test.ts
│   │   ├── auth-api.test.ts
│   │   └── history-api.test.ts
│   └── e2e/                      # Playwright e2e tests (Phase 2)
│
├── package.json
├── tsconfig.json
├── next.config.js
├── jest.config.js
├── .env.local (secrets - not committed)
└── README.md
```

**Structure Decision**: Monolithic Next.js app with API routes. This is the easiest to deploy on Vercel with zero configuration. All code (frontend, API, database queries) in one repo; scales to ~100k users on free tier.

## Complexity Tracking

No constitution violations identified. All constraints met by Next.js + PostgreSQL architecture.
