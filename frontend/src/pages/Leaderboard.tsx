import { useState } from 'react'
import { Search, Trophy, Users, ExternalLink } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '../services/api'
import { getRankColor, getRankBgColor } from '../utils/rankColors'
import { Link } from 'react-router-dom'
import type { User } from '../types/user'

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => userApi.getLeaderboard(),
  })

  const filteredUsers = data?.users?.filter((user: User) =>
    user.handle.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-2xl border border-amber-200">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Leaderboard</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Users className="w-4 h-4" />
                <span>{data?.count || 0} competitors tracked</span>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by handle..."
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Loading Rankings...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-800 font-bold mb-1">Failed to load leaderboard</p>
          <p className="text-sm text-rose-600">Please try again later</p>
        </div>
      )}

      {/* Leaderboard Table Card */}
      {!isLoading && !isError && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                  <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Profile</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredUsers.map((user: User, index: number) => {
                  const rankColor = getRankColor(user.rank)
                  const rankBgColor = getRankBgColor(user.rank)
                  const actualRank = (data?.users ? data.users.indexOf(user) + 1 : 0) || index + 1

                  return (
                    <tr key={user.handle} className="hover:bg-slate-50/80 transition-all duration-200 group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {actualRank <= 3 ? (
                            <div className={`p-1.5 rounded-lg ${
                              actualRank === 1 ? 'bg-amber-100 text-amber-600' :
                              actualRank === 2 ? 'bg-slate-100 text-slate-500' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              <Trophy className="w-4 h-4" />
                            </div>
                          ) : null}
                          <span className={`text-sm font-bold ${actualRank <= 3 ? 'text-slate-900' : 'text-slate-500'} font-mono`}>
                            #{actualRank}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.handle}
                              className="w-10 h-10 rounded-xl border border-slate-200 object-cover"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${rankBgColor.replace('bg-', 'bg-')}`}></div>
                          </div>
                          <div>
                            <div className={`text-sm font-bold ${rankColor} flex items-center gap-1.5`}>
                              {user.handle}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              {user.contribution} contrib
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-center">
                        <span className={`text-base font-bold font-mono ${rankColor}`}>
                          {user.rating}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${rankBgColor} ${rankColor} border-current opacity-80`}>
                          {user.rank}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <Link
                          to={`/?handle=${user.handle}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 opacity-0 group-hover:opacity-100 duration-200"
                        >
                          View
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-24">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-slate-900 font-bold">No results found</h4>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your filter</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
