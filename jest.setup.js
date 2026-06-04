import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/calorie_tracker_test'

// Suppress console errors in tests (optional)
global.console.error = jest.fn()
global.console.warn = jest.fn()
