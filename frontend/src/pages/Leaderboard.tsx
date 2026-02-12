import { useState } from 'react'
import { Search, Trophy, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '../services/api'
import { getRankColor, getRankBgColor } from '../utils/rankColors'
import { Link } from 'react-router-dom'

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => userApi.getLeaderboard(),
  })

  const filteredUsers = data?.users?.filter((user: any) =>
    user.handle.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>{data?.count || 0} competitors</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading leaderboard</p>
        </div>
      )}

      {/* Leaderboard Table */}
      {!isLoading && !isError && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Rating
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user: any, index: number) => {
                  const rankColor = getRankColor(user.rank)
                  const rankBgColor = getRankBgColor(user.rank)
                  const actualRank = data?.users?.indexOf(user) + 1 || index + 1

                  return (
                    <tr key={user.handle} className="hover:bg-gray-50 transition-colors">
                      {/* Rank */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {actualRank <= 3 && (
                            <Trophy
                              className={`w-5 h-5 mr-2 ${
                                actualRank === 1
                                  ? 'text-yellow-500'
                                  : actualRank === 2
                                  ? 'text-gray-400'
                                  : 'text-orange-600'
                              }`}
                            />
                          )}
                          <span className="text-sm font-semibold text-gray-900">
                            #{actualRank}
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.avatar}
                            alt={user.handle}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className={`text-sm font-medium ${rankColor}`}>
                              {user.handle}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.contribution} contribution
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Rating */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`text-lg font-bold ${rankColor}`}>
                          {user.rating}
                        </span>
                      </td>

                      {/* Max Rating */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-gray-600">{user.maxRating}</span>
                      </td>

                      {/* Rank Badge */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${rankBgColor} ${rankColor}`}
                        >
                          {user.rank}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Link
                          to={`/?handle=${user.handle}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchQuery ? 'No users found matching your search' : 'No users available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
