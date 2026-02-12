import { Link } from 'react-router-dom'
import { Code2, Trophy, TrendingUp, Zap, Terminal, Award, Users, Rocket } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated code background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-green-400 font-mono text-sm">
            {'function solve() { ... }'}
          </div>
          <div className="absolute top-40 right-20 text-blue-400 font-mono text-sm">
            {'while(rating < 3000) train();'}
          </div>
          <div className="absolute bottom-40 left-1/4 text-purple-400 font-mono text-sm">
            {'int dp[N][M];'}
          </div>
          <div className="absolute bottom-20 right-1/3 text-yellow-400 font-mono text-sm">
            {'vector<int> graph[N];'}
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
                <Code2 className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
              Codeforces<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">+</span>
            </h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your Ultimate Competitive Programming Dashboard
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Track ratings, analyze performance, practice problems, and code in real-time with our integrated IDE
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-bold rounded-lg hover:bg-white/20 border border-white/20 transition-all"
              >
                <Terminal className="w-5 h-5" />
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="Real-Time Stats"
              description="Track your Codeforces rating, contests, and achievements in one place"
              gradient="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Performance Analytics"
              description="Analyze your growth with detailed charts and insights"
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Code2 className="w-8 h-8" />}
              title="Integrated IDE"
              description="Code in Python, C++, Java, and JavaScript with live execution"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Global Leaderboard"
              description="Compare yourself with top coders worldwide"
              gradient="from-purple-500 to-pink-500"
            />
          </div>

          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-3 gap-8 text-center">
            <StatCard number="10+" label="Languages Supported" />
            <StatCard number="3000+" label="Practice Problems" />
            <StatCard number="Real-Time" label="Code Execution" />
          </div>

          {/* Demo Section */}
          <div className="mt-24 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Everything You Need to Excel
              </h2>
              <p className="text-gray-400">
                Built by competitive programmers, for competitive programmers
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6 rounded-xl border border-blue-500/30">
                <Zap className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-400">Optimized performance for instant feedback</p>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-6 rounded-xl border border-green-500/30">
                <Award className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
                <p className="text-gray-400">Detailed analytics and performance metrics</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 rounded-xl border border-purple-500/30">
                <Terminal className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Code Anywhere</h3>
                <p className="text-gray-400">Browser-based IDE with multi-language support</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-24 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Level Up Your Competitive Programming?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of coders improving their skills every day
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-2xl"
            >
              Start Your Journey
              <Rocket className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="font-mono">
              Built with <span className="text-red-500">❤</span> for competitive programmers
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient }: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${gradient} mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
        {number}
      </div>
      <div className="text-gray-400 font-medium">{label}</div>
    </div>
  )
}
