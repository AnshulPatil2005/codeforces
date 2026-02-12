import { useState } from 'react'
import { Users, Search, ChevronRight, Activity, Award, Hash, Zap } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'
import StatsCard from '../components/dashboard/StatsCard'
import ComparativeRatingChart from '../components/dashboard/ComparativeRatingChart'
import type { DashboardResponse } from '../services/api'

export default function Compare() {
  const [handle1, setHandle1] = useState('')
  const [handle2, setHandle2] = useState('')
  const [activeHandle1, setActiveHandle1] = useState('')
  const [activeHandle2, setActiveHandle2] = useState('')

  const user1 = useDashboard(activeHandle1, !!activeHandle1)
  const user2 = useDashboard(activeHandle2, !!activeHandle2)

  const handleCompare = () => {
    if (handle1.trim() && handle2.trim()) {
      setActiveHandle1(handle1.trim())
      setActiveHandle2(handle2.trim())
    }
  }

  const mapChartData = (data: DashboardResponse | undefined) => {
    if (!data) return []
    return data.monthly_growth.map((item, index, array) => {
      const baseRating = data.stats.current_rating - array.slice(index).reduce((sum, current) => sum + current.change, 0) + item.change;
      return {
        month: item.month,
        rating: baseRating
      }
    })
  }

  const user1ChartData = mapChartData(user1.data)
  const user2ChartData = mapChartData(user2.data)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search Bar Section */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="p-1.5 bg-purple-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              User Comparison
            </h2>
            <p className="text-gray-400 text-sm font-medium">Compare performance of two competitors</p>
          </div>
          <div className="flex flex-col sm:flex-row flex-1 max-w-2xl gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={handle1}
                onChange={(e) => setHandle1(e.target.value)}
                placeholder="User 1 handle..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={handle2}
                onChange={(e) => setHandle2(e.target.value)}
                placeholder="User 2 handle..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <button
              onClick={handleCompare}
              disabled={user1.isLoading || user2.isLoading}
              className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {user1.isLoading || user2.isLoading ? '...' : 'Compare'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      {(user1.data || user2.data) && (
        <div className="space-y-8">
          {/* Main Chart */}
          {user1.data && user2.data && (
            <ComparativeRatingChart
              user1Handle={activeHandle1}
              user2Handle={activeHandle2}
              user1Data={user1ChartData}
              user2Data={user2ChartData}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* User 1 Column */}
             <div className="space-y-6">
                {user1.isLoading && <div className="animate-pulse h-64 bg-white/5 rounded-2xl" />}
                {user1.data && (
                  <>
                    <div className="flex items-center gap-4 p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                      <img src={user1.data.user.avatar} className="w-20 h-20 rounded-2xl border-2 border-blue-500/30" alt={user1.data.user.handle} />
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">{user1.data.user.handle}</h3>
                        <p className="text-blue-400 font-black uppercase text-xs tracking-widest">{user1.data.user.rank}</p>
                        <div className="flex gap-4 mt-2">
                           <div className="text-center">
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Contrib</p>
                              <p className="text-sm text-white font-mono">{user1.data.user.contribution}</p>
                           </div>
                           <div className="text-center">
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Contests</p>
                              <p className="text-sm text-white font-mono">{user1.data.stats.total_contests}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <StatsCard title="Current Rating" value={user1.data.stats.current_rating} icon={<Activity className="w-5 h-5 text-blue-500" />} />
                      <StatsCard title="Max Rating" value={user1.data.stats.max_rating} icon={<Award className="w-5 h-5 text-amber-500" />} />
                      <StatsCard title="Avg Rank" value={user1.data.performance_metrics.average_rank} icon={<Hash className="w-5 h-5 text-indigo-500" />} />
                      <StatsCard title="Win Rate" value={`${Math.round((user1.data.performance_metrics.positive_contests / user1.data.stats.total_contests) * 100)}%`} icon={<Zap className="w-5 h-5 text-emerald-500" />} />
                    </div>
                  </>
                )}
                {user1.isError && <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-bold">Failed to load {activeHandle1}</div>}
             </div>

             {/* User 2 Column */}
             <div className="space-y-6">
                {user2.isLoading && <div className="animate-pulse h-64 bg-white/5 rounded-2xl" />}
                {user2.data && (
                  <>
                    <div className="flex items-center gap-4 p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                      <img src={user2.data.user.avatar} className="w-20 h-20 rounded-2xl border-2 border-purple-500/30" alt={user2.data.user.handle} />
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">{user2.data.user.handle}</h3>
                        <p className="text-purple-400 font-black uppercase text-xs tracking-widest">{user2.data.user.rank}</p>
                        <div className="flex gap-4 mt-2">
                           <div className="text-center">
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Contrib</p>
                              <p className="text-sm text-white font-mono">{user2.data.user.contribution}</p>
                           </div>
                           <div className="text-center">
                              <p className="text-[10px] text-gray-500 font-bold uppercase">Contests</p>
                              <p className="text-sm text-white font-mono">{user2.data.stats.total_contests}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <StatsCard title="Current Rating" value={user2.data.stats.current_rating} icon={<Activity className="w-5 h-5 text-blue-500" />} />
                      <StatsCard title="Max Rating" value={user2.data.stats.max_rating} icon={<Award className="w-5 h-5 text-amber-500" />} />
                      <StatsCard title="Avg Rank" value={user2.data.performance_metrics.average_rank} icon={<Hash className="w-5 h-5 text-indigo-500" />} />
                      <StatsCard title="Win Rate" value={`${Math.round((user2.data.performance_metrics.positive_contests / user2.data.stats.total_contests) * 100)}%`} icon={<Zap className="w-5 h-5 text-emerald-500" />} />
                    </div>
                  </>
                )}
                {user2.isError && <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-bold">Failed to load {activeHandle2}</div>}
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
