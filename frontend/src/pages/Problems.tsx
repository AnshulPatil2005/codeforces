import { useState } from 'react'
import { Search, Filter, Code2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { problemApi } from '../services/api'

const TAGS = [
  'math',
  'implementation',
  'greedy',
  'dp',
  'data structures',
  'graphs',
  'strings',
  'sortings',
  'binary search',
  'trees',
  'number theory',
  'geometry',
  'combinatorics',
  'two pointers',
]

export default function Problems() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | undefined>()
  const [maxRating, setMaxRating] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState<'rating' | 'solved_count'>('rating')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['problems', selectedTags, minRating, maxRating, searchQuery, sortBy],
    queryFn: () =>
      problemApi.getProblems({
        tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
        min_rating: minRating,
        max_rating: maxRating,
        search: searchQuery || undefined,
        sort_by: sortBy,
      }),
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setMinRating(undefined)
    setMaxRating(undefined)
    setSearchQuery('')
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'text-red-600'
    if (rating >= 2100) return 'text-orange-600'
    if (rating >= 1900) return 'text-purple-600'
    if (rating >= 1600) return 'text-blue-600'
    if (rating >= 1400) return 'text-cyan-600'
    if (rating >= 1200) return 'text-green-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Code2 className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Problem Set</h2>
          </div>
          <div className="text-sm text-gray-600">
            {data?.total || 0} problems
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Rating Range */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Rating
              </label>
              <input
                type="number"
                value={minRating || ''}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="800"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Rating
              </label>
              <input
                type="number"
                value={maxRating || ''}
                onChange={(e) => setMaxRating(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="3500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'solved_count')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Difficulty (Rating)</option>
                <option value="solved_count">Popularity (Solved Count)</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
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
          <p className="text-red-800">Error loading problems</p>
        </div>
      )}

      {/* Problems Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.problems?.map((problem: any) => (
            <div
              key={problem.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              {/* Problem Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{problem.name}</h3>
                  <span className="text-xs text-gray-500">Problem {problem.id}</span>
                </div>
                <span className={`text-lg font-bold ${getRatingColor(problem.rating)}`}>
                  {problem.rating}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {problem.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  <span>{problem.solved_count.toLocaleString()} solved</span>
                </div>
                <a
                  href={`https://codeforces.com/problemset/problem/${problem.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Solve →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && data?.problems?.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No problems match your filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
