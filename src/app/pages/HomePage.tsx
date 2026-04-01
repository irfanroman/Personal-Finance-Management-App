/**
 * HomePage Component
 * Landing page before login
 */
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Wallet, TrendingUp, PieChart, Shield, ArrowRight } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FinanceTracker</span>
            </div>
            <Link to="/login">
              <Button size="lg">
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Take Control of Your
            <span className="text-blue-600"> Finances</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your income and expenses, visualize your spending patterns, and make smarter
            financial decisions with our easy-to-use personal finance manager.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose FinanceTracker?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Easy Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Quickly add, edit, and manage your transactions with our intuitive interface.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-2 hover:border-green-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Monthly Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Compare your spending month-over-month and identify trends in your finances.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Visual Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Beautiful charts and graphs help you understand your financial situation at a glance.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="border-2 hover:border-orange-200 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your financial data is stored locally and securely on your device.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0">
          <CardContent className="py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Managing Your Money?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are taking control of their finances with FinanceTracker.
            </p>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Login Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 FinanceTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
