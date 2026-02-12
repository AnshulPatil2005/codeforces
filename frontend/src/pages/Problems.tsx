import { useState } from 'react'
import { Search, Filter, Code2, CheckCircle2, ArrowUpRight, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { problemApi } from '../services/api'
import type { Problem } from '../types/problem'

const TAGS = [
  'math', 'implementation', 'greedy', 'dp', 'data structures',
  'graphs', 'strings', 'sortings', 'binary search', 'trees',
  'number theory', 'geometry', 'combinatorics', 'two pointers',
]

export default function Problems() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | undefined>()
  const [maxRating, setMaxRating] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState<'rating' | 'solved_count'>('rating')
  const [isFilterVisible, setIsFilterVisible] = useState(true)

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

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'text-rose-600'
    if (rating >= 2100) return 'text-orange-500'
    if (rating >= 1900) return 'text-purple-600'
    if (rating >= 1600) return 'text-blue-600'
    if (rating >= 1400) return 'text-cyan-600'
    if (rating >= 1200) return 'text-emerald-600'
    return 'text-slate-500'
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Search Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl border border-blue-200">
              <Code2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Problem Set</h2>
              <p className="text-sm text-slate-500 font-medium">{data?.total || 0} challenges available</p>
            </div>
          </div>
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
          >
            {isFilterVisible ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>

        {isFilterVisible && (
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Min Difficulty</label>
              <input
                type="number"
                value={minRating || ''}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 800"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Max Difficulty</label>
              <input
                type="number"
                value={maxRating || ''}
                onChange={(e) => setMaxRating(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 3500"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'solved_count')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="rating">Difficulty (Rating)</option>
                <option value="solved_count">Popularity (Solved)</option>
              </select>
            </div>
            <div className="md:col-span-3 space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Topic Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Searching challenges...</p>
        </div>
      )}

      {/* Problems Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.problems?.map((problem: Problem) => (
            <div
              key={problem.index + problem.name}
              className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{problem.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID:</span>
                    <span className="text-xs font-mono font-bold text-slate-500">{problem.index}</span>
                  </div>
                </div>
                {problem.rating && (
                  <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <span className={`text-sm font-black font-mono ${getRatingColor(problem.rating)}`}>
                      {problem.rating}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6 min-h-[48px]">
                {problem.tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-tight"
                  >
                    {tag}
                  </span>
                ))}
                {problem.tags.length > 3 && (
                  <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-md">
                    +{problem.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono">{(problem.solved_count || 0).toLocaleString()}</span>
                </div>
                <a
                  href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group/link"
                >
                  Solve Challenge
                  <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && data?.problems?.length === 0 && (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-24 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No matching challenges</h3>
          <p className="text-slate-500 font-medium">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  )
}
