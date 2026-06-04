# Calorie Tracker Application

A full-stack calorie tracking web application built with Next.js, React, PostgreSQL, and Tailwind CSS. Users can log food intake, view 30-day history, visualize trends, and receive personalized diet recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Vercel Postgres)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anupam-agarwal/calorie_tracker.git
   cd calorie_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your configuration:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/calorie_tracker
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-minimum-32-chars
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Features

- **Add Food Entries**: Search food database and log meals with portion sizes
- **30-Day History**: View all food entries with daily totals and aggregates
- **Calorie Trends**: Interactive graph visualization of daily intake over 30 days
- **Personalized Recommendations**: Get BMR-based calorie targets and macro breakdowns
- **User Profile**: Setup and manage profile (name, weight, height, activity level)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 18 + Next.js 14 (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Vercel Postgres recommended)
- **Authentication**: NextAuth.js v5
- **Data Fetching**: TanStack Query v5
- **Validation**: Zod + React Hook Form
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel (free tier)

## 📚 Project Structure

```
calorie-tracker/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # Backend API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   └── hooks/             # Custom React hooks
├── lib/
│   ├── db.ts              # Database connection
│   ├── queries.ts         # Database queries
│   ├── calculations.ts    # Business logic (BMR, TDEE, etc.)
│   ├── validation.ts      # Zod schemas
│   ├── auth.ts            # Auth utilities
│   └── api-response.ts    # API response helpers
├── tests/                 # Test files
├── public/                # Static assets
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind CSS config
├── jest.config.js         # Jest testing config
└── vercel.json            # Vercel deployment config
```

## 🗄️ Database Setup

### Using Vercel Postgres (Recommended)

1. Create a Vercel account at https://vercel.com
2. Create a new Postgres database in Vercel Dashboard
3. Copy the connection string and set `DATABASE_URL` in `.env.local`

### Using Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb calorie_tracker`
3. Set `DATABASE_URL=postgresql://localhost/calorie_tracker`

### Run Migrations

```bash
npm run db:migrate
npm run db:seed
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect GitHub repository**
   ```bash
   vercel link
   ```

2. **Set environment variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
     - `NEXTAUTH_URL`: Your deployed URL (e.g., https://calorie-tracker.vercel.app)

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

   Or just push to GitHub and Vercel auto-deploys!

### Alternative: Deploy to Other Platforms

- **Netlify**: Requires serverless functions
- **AWS**: More complex setup
- **Google Cloud**: App Engine or Cloud Run
- **Heroku**: Dyno hours limited on free tier
- **Railway**: Similar to Vercel, good alternative

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/session` - Get current session

### Food Management
- `GET /api/food/search?query=chicken` - Search food database
- `POST /api/food/entries` - Add food entry
- `GET /api/food/entries` - Get user's food entries
- `PATCH /api/food/entries/[id]` - Update entry
- `DELETE /api/food/entries/[id]` - Delete entry

### History & Analytics
- `GET /api/history` - Get 30-day history
- `GET /api/history/stats` - Get history statistics
- `GET /api/history/[date]` - Get specific day

### User & Recommendations
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile
- `GET /api/recommendations` - Get calorie recommendations
- `GET /api/recommendations/comparison` - Compare actual vs recommended

See `/specs/001-calorie-tracker-app/contracts/` for detailed endpoint specifications.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## 🎨 Development

### Run development server with hot reload
```bash
npm run dev
```

### Format code
```bash
npm run format
```

### Run linting
```bash
npm run lint
```

### Build for production
```bash
npm run build
npm start
```

## 📋 Implementation Progress

**Phase 1 & 2**: ✅ Complete - Core infrastructure, database layer, API framework, UI components

**Phase 3-6**: 🚧 In Progress - User stories (food entry, history, graph, profile)

**Phase 7-8**: ⏳ Planned - Recommendations, Polish, Optimization

See `IMPLEMENTATION_PROGRESS.md` for detailed roadmap.

## 🔒 Security

- Password hashing with bcrypt
- CSRF protection via NextAuth.js
- SQL injection prevention via parameterized queries
- Rate limiting on API endpoints (planned)
- HTTPS enforced in production
- Environment variables for secrets (never committed)
- GDPR compliance with data deletion support

## 📝 License

Private project

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request

## 📞 Support

For issues or questions:
- Check `/specs/001-calorie-tracker-app/quickstart.md` for validation scenarios
- Review `/IMPLEMENTATION_PROGRESS.md` for roadmap
- Check `/specs/001-calorie-tracker-app/contracts/` for API details

## 🎯 Next Steps

1. **Complete Database Setup**: Run migrations and seed food database
2. **Implement Authentication**: Finish NextAuth.js configuration
3. **Build User Flows**: Complete Phase 3-6 user stories
4. **Test & Optimize**: Run tests and performance optimization
5. **Deploy to Vercel**: Push to production

---

**Last Updated**: 2026-06-04  
**Status**: MVP Foundation Complete - Ready for Feature Development
