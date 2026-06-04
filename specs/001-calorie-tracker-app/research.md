# Research & Technology Decisions

**Date**: 2026-06-04 | **Phase**: 0 - Research & Clarification

This document captures research findings that resolve technical uncertainties from the implementation plan.

## 1. Framework Selection: Next.js vs. Alternatives

**Decision**: Next.js 14 (App Router)

**Rationale**:
- Full-stack capability (React frontend + Node.js API routes in single repo)
- Vercel native deployment = zero configuration, free hosting
- Built-in TypeScript, ESLint, optimizations (Image, Font)
- Fastest path to MVP with minimal DevOps overhead
- Excellent for 10k user scale (free tier supports this)

**Alternatives Considered**:
1. **React + Separate Node.js Backend**
   - ❌ Rejected: Requires separate deployment, environment management, CORS setup
   - ❌ Vercel charges for backend; Next.js is free for both

2. **SvelteKit (Vercel-hosted)**
   - ❌ Rejected: Smaller ecosystem for charting libraries (Recharts is React-optimized)
   - ❌ Job market/team scaling favors React

3. **Python (Flask/FastAPI) + React**
   - ❌ Rejected: Requires external hosting (Vercel Python limited); extra complexity
   - ❌ Slower API cold starts on free tier

4. **Full-stack Meta-frameworks (Remix)**
   - ❌ Rejected: Smaller ecosystem; less free-tier optimization than Next.js on Vercel

## 2. Database: PostgreSQL via Vercel Postgres

**Decision**: Vercel Postgres (hosted PostgreSQL on free tier)

**Rationale**:
- **Free tier**: 3GB storage (sufficient for 10k users + 30-day history)
- **Zero DevOps**: Automatic backups, scaling handled by Vercel
- **Direct integration**: Environment variables automatically set for Next.js
- **SQL flexibility**: Complex queries for date ranges, aggregations
- **Migration path**: Easy upgrade from free to paid as scale increases

**Alternatives Considered**:
1. **MongoDB/DocumentDB**
   - ❌ Rejected: Overkill for normalized data (User, FoodEntry, DailyIntake have relationships)
   - ❌ Vercel Postgres has better free tier pricing

2. **Supabase (Postgres + Auth + Realtime)**
   - ✅ Valid alternative, but requires separate Auth library
   - ❌ Rejected: Next.js auth libraries (NextAuth.js) integrate better with Vercel
   - Stick with Vercel Postgres + NextAuth.js for tighter integration

3. **Firebase (Firestore + Auth)**
   - ❌ Rejected: Pay-per-read pricing gets expensive; PostgreSQL flat rate better
   - ❌ No date-based rollup/aggregation queries (needed for daily totals)

## 3. Authentication: NextAuth.js v5

**Decision**: NextAuth.js (v5) with Email/Password + OAuth (Google optional)

**Rationale**:
- Native Next.js integration; zero configuration required
- Handles session management, CSRF, JWT tokens
- Built-in database adapters for PostgreSQL
- Free tier supports unlimited users
- Secure by default (httpOnly cookies, encrypted sessions)

**Alternatives Considered**:
1. **Auth0**
   - ❌ Rejected: Requires paid tier for production; adds ~$15-30/mo cost
   - Overkill for MVP

2. **Firebase Auth**
   - ❌ Rejected: Coupling to Google ecosystem; Postgres not primary store

3. **Manual JWT + PostgreSQL**
   - ❌ Rejected: Security risks (CSRF, token refresh, password hashing)
   - NextAuth.js handles these concerns; don't reinvent

## 4. Food Database: Integration with USDA FoodData Central API

**Decision**: USDA FoodData Central API (free, public) with caching

**Rationale**:
- **Free API**: No auth required, 10 requests/sec rate limit (sufficient for MVP)
- **Comprehensive**: ~750k foods; nutrition data verified by USDA
- **Caching strategy**: Cache search results + nutrition data in PostgreSQL to minimize API calls
- **Fallback**: Pre-load ~100 common foods into local database for MVP

**Alternatives Considered**:
1. **Edamam API**
   - ✅ High quality, but requires paid API key ($0.50/1000 requests)
   - ❌ Rejected: Cost; USDA is free

2. **Nutritionix API**
   - ✅ Free, good coverage
   - ❌ Rejected: Rate limits lower; USDA more official

3. **Manual food database**
   - ❌ Rejected: Time-consuming; USDA API is free & available

## 5. Graph/Charting: Recharts

**Decision**: Recharts (React charting library)

**Rationale**:
- React-native component library (renders via SVG)
- Handles 30-day datasets efficiently
- Built-in animations, tooltips, responsive sizing
- ~50KB gzipped (minimal bundle impact)
- Excellent accessibility (ARIA labels built-in)

**Alternatives Considered**:
1. **Chart.js + react-chartjs-2**
   - ✅ Popular, small bundle
   - ❌ Rejected: Less responsive out-of-box; Recharts better for mobile

2. **Victory (Formidable)**
   - ✅ Composable React components
   - ❌ Rejected: Larger bundle (~100KB gzipped)

3. **Plotly.js**
   - ❌ Rejected: Massive bundle; overkill for simple line chart

## 6. Calorie Calculation: Mifflin-St Jeor Formula for BMR

**Decision**: Implement Mifflin-St Jeor formula in TypeScript utility

**Rationale**:
- Standard industry formula for Basal Metabolic Rate (BMR)
- Lightweight computation (no external service needed)
- Formula: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + (sex_offset)
- Apply Harris-Benedict multiplier based on activity level: 1.2-1.9x BMR

**Alternatives Considered**:
1. **External Calorie Calculator API**
   - ❌ Rejected: Unnecessary external dependency; formula is simple math

2. **Hardcoded recommendation ranges**
   - ❌ Rejected: Less personalized; spec requires age/weight/gender-based calcs

## 7. Form Validation: Zod + React Hook Form

**Decision**: Zod (schema validation) + React Hook Form (form state)

**Rationale**:
- **Type safety**: Zod generates TypeScript types from schema (single source of truth)
- **Performance**: React Hook Form minimizes re-renders
- **API validation**: Same Zod schemas validate on client + server (DRY)
- **Error messages**: Standardized, localization-ready

**Alternatives Considered**:
1. **Formik**
   - ❌ Rejected: Heavier; more boilerplate for this use case

2. **Manual validation**
   - ❌ Rejected: No type safety; error-prone

## 8. Data Fetching: TanStack Query (React Query)

**Decision**: TanStack Query v5 for client-side data fetching + caching

**Rationale**:
- Automatic request deduplication (prevents duplicate API calls)
- Background refetching + cache invalidation (keeps data fresh)
- Optimistic updates for instant UI feedback
- Network state management (loading, error, retry)
- Tiny footprint after tree-shaking (~30KB gzipped)

**Alternatives Considered**:
1. **SWR (Vercel)**
   - ✅ Simpler, smaller bundle
   - ❌ Rejected: TanStack Query has better invalidation patterns (needed for history updates)

2. **Apollo Client**
   - ❌ Rejected: Overkill for REST API; requires GraphQL

3. **Native fetch + useState**
   - ❌ Rejected: No deduplication, manual cache logic, error handling

## 9. Styling: Tailwind CSS + shadcn/ui

**Decision**: Tailwind CSS + shadcn/ui component library

**Rationale**:
- **Utility-first**: Fast development, consistency
- **shadcn/ui**: Headless component library (accessible, customizable, Vercel-recommended)
- **Bundle efficiency**: Tree-shaking removes unused styles
- **Responsive**: Mobile-first design (spec requires web + mobile)
- **WCAG compliance**: shadcn/ui components built on Radix UI (accessible)

**Alternatives Considered**:
1. **Material-UI (MUI)**
   - ✅ Great components, but heavier (~200KB gzipped)
   - ❌ Rejected: Overkill for MVP; Tailwind is leaner

2. **Styled Components / Emotion**
   - ❌ Rejected: Runtime CSS-in-JS adds overhead; Tailwind is build-time

## 10. Testing Strategy

**Decision**: Jest + React Testing Library (unit/integration) + Playwright (e2e)

**Rationale**:
- **Jest**: Native Next.js test runner, zero config required
- **React Testing Library**: Tests behavior, not implementation (stable tests)
- **Playwright**: E2E automation for critical user flows (deferred to Phase 2)
- **Target coverage**: 80%+ on business logic (calculations, validations, API handlers)

**Test Pyramid**:
- ✅ Unit tests: Calculations, validation schemas, utility functions
- ✅ Integration tests: API routes (database + business logic together)
- ✅ Component tests: Form, Graph, HistoryTable components
- ✅ E2E tests: Full user workflows (login → add entry → view graph)

## 11. Deployment: Vercel + GitHub

**Decision**: GitHub → Vercel CI/CD pipeline (auto-deploy on merge)

**Rationale**:
- **Zero config**: Vercel auto-detects Next.js projects
- **Preview deploys**: Every PR gets a live preview URL
- **Environment secrets**: Managed securely by Vercel
- **Free tier**: Unlimited deployments, 100GB bandwidth, custom domain support
- **Observability**: Built-in speed insights, analytics

**Deployment Flow**:
1. Push feature branch to GitHub
2. Vercel auto-creates preview deployment
3. Run tests on preview (CI check)
4. Merge to `main` branch
5. Vercel deploys to production automatically

## 12. Environment Configuration

**Decision**: `.env.local` (development) + Vercel environment variables (production)

**Required Variables**:
```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-32-char-key>

# USDA API (optional, public)
USDA_API_KEY=DEMO_KEY (free tier available)

# Optional OAuth (Phase 2)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

**Security**: 
- `.env.local` never committed (Git ignore)
- All secrets managed in Vercel UI
- Rotation policy: Every 3 months or on compromise

---

## Phase 0 Completion Checklist

- [x] Framework selected: Next.js 14 (App Router)
- [x] Database chosen: Vercel Postgres (free tier)
- [x] Authentication: NextAuth.js v5
- [x] Food database API: USDA FoodData Central
- [x] Charting: Recharts
- [x] Validation: Zod + React Hook Form
- [x] Data fetching: TanStack Query v5
- [x] Styling: Tailwind CSS + shadcn/ui
- [x] Testing: Jest + React Testing Library + Playwright
- [x] Deployment: Vercel + GitHub Actions

All NEEDS CLARIFICATION items resolved. Ready for Phase 1 (Design).
