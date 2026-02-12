import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, TrendingUp, Award, Hash, Activity } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import StatsCard from '../components/dashboard/StatsCard'
import RatingChart from '../components/dashboard/RatingChart'
import ContestHistory from '../components/dashboard/ContestHistory'
import PerformanceInsights from '../components/dashboard/PerformanceInsights'

export default function Dashboard() {
  const [searchParams] = useSearchParams()
  const handleParam = searchParams.get('handle') || 'tourist'

  const [inputHandle, setInputHandle] = useState(handleParam)
  const [activeHandle, setActiveHandle] = useState(handleParam)

  useEffect(() => {
    const handle = searchParams.get('handle')
    if (handle) {
      setInputHandle(handle)
      setActiveHandle(handle)
    }
  }, [searchParams])

  const { data, isLoading, isError, error } = useDashboard(activeHandle)

  const handleLoad = () => {
    if (inputHandle.trim()) {
      setActiveHandle(inputHandle.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoad()
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Contest Dashboard</h2>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={inputHandle}
              onChange={(e) => setInputHandle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Codeforces handle (e.g., tourist, Benq)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleLoad}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : 'Load'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error loading dashboard: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Dashboard Content */}
      {data && !isLoading && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              icon={<Award className="w-6 h-6 text-yellow-600" />}
            />
            <StatsCard
              title="Last Change"
              value={data.stats.last_change > 0 ? `+${data.stats.last_change}` : data.stats.last_change}
              trend={data.stats.last_change > 0 ? 'up' : data.stats.last_change < 0 ? 'down' : 'neutral'}
              icon={<Activity className="w-6 h-6 text-green-600" />}
            />
            <StatsCard
              title="Total Contests"
              value={data.stats.total_contests}
              subtitle={`Avg rank: #${data.performance_metrics.average_rank}`}
              icon={<Hash className="w-6 h-6 text-purple-600" />}
            />
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Chart */}
            <RatingChart data={data.monthly_growth} />

            {/* Performance Insights */}
            <PerformanceInsights insights={data.insights} />
          </div>

          {/* Contest History */}
          <ContestHistory contests={data.contest_history} />
        </>
      )}
    </div>
  )
}
