import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TrendingUp, Award, Hash, Activity, User, ChevronRight, Search } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import StatsCard from '../components/dashboard/StatsCard'
import RatingChart from '../components/dashboard/RatingChart'
import ContestHistory from '../components/dashboard/ContestHistory'
import PerformanceInsights from '../components/dashboard/PerformanceInsights'

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeHandle = searchParams.get('handle') || 'alice_codes'
  const [inputHandle, setInputHandle] = useState(activeHandle)

  const { data, isLoading, isError, error } = useDashboard(activeHandle)

  const handleLoad = () => {
    if (inputHandle.trim()) {
      setSearchParams({ handle: inputHandle.trim() })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoad()
    }
  }

  // Data mapping for components
  const chartData = data?.monthly_growth.map((item, index, array) => {
    // Simple approximation of progression since we don't have the full history start rating here
    // In a real app, the backend should provide the absolute rating points for the chart.
    const baseRating = data.stats.current_rating - array.slice(index).reduce((sum, current) => sum + current.change, 0) + item.change;
    return {
      month: item.month,
      rating: baseRating
    }
  }) || []

  const mappedContests = data?.contest_history.map(c => ({
    id: c.contestId,
    name: c.contestName,
    rank: c.rank,
    rating_change: c.rating_change,
    new_rating: c.newRating,
    date: new Date(c.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
  })) || []

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search Bar Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Contest Dashboard
            </h2>
            <p className="text-slate-500 text-sm font-medium">Visualize competitive programming performance</p>
          </div>
          <div className="flex flex-1 max-w-md gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search Codeforces handle..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <button
              onClick={handleLoad}
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {isLoading ? '...' : 'Load'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-center gap-4 text-rose-800">
          <div className="p-2 bg-rose-100 rounded-full text-rose-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold">Error loading dashboard</p>
            <p className="text-sm opacity-80">{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Fetching stats...</p>
        </div>
      )}

      {/* Dashboard Content */}
      {data && !isLoading && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Current Rating"
              value={data.stats.current_rating}
              rank={data.stats.current_rank}
              icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
            />
            <StatsCard
              title="Max Rating"
              value={data.stats.max_rating}
              rank={data.stats.max_rank}
              icon={<Award className="w-6 h-6 text-amber-600" />}
            />
            <StatsCard
              title="Last Change"
              value={data.stats.last_change > 0 ? `+${data.stats.last_change}` : data.stats.last_change}
              trend={data.stats.last_change > 0 ? 'up' : data.stats.last_change < 0 ? 'down' : 'neutral'}
              subtitle={data.stats.last_change !== 0 ? 'Latest contest' : undefined}
              icon={<Activity className="w-6 h-6 text-emerald-600" />}
            />
            <StatsCard
              title="Avg Performance"
              value={data.performance_metrics.average_rank}
              subtitle={`Best: #${data.performance_metrics.best_rank}`}
              icon={<Hash className="w-6 h-6 text-indigo-600" />}
            />
          </div>

          {/* Charts and Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RatingChart data={chartData} />
            </div>
            <div className="lg:col-span-1">
              <PerformanceInsights insights={data.insights} />
            </div>
          </div>

          {/* Detailed History */}
          <ContestHistory contests={mappedContests} />
        </div>
      )}
    </div>
  )
}
