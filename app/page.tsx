import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">🍽️ Calorie Tracker</div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">
            Track Your Nutrition Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Log your daily food intake, visualize your progress over time, and receive personalized diet recommendations based on your profile.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Features</h2>
            <ul className="text-lg text-gray-600 space-y-2">
              <li>✅ Add food entries with automatic calorie calculation</li>
              <li>✅ View your 30-day history with daily totals</li>
              <li>✅ Visualize trends with interactive graphs</li>
              <li>✅ Get personalized diet recommendations</li>
              <li>✅ Track macronutrients (protein, carbs, fat)</li>
            </ul>
          </div>

          <div className="pt-8">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>&copy; 2026 Calorie Tracker. Built with Next.js + React.</p>
        </div>
      </footer>
    </div>
  );
}
