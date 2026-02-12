import { ExternalLink } from 'lucide-react'

interface ContestHistoryProps {
  contests: Array<{
    id: number
    name: string
    rank: number
    rating_change: number
    new_rating: number
    date: string
  }>
}

export default function ContestHistory({ contests }: ContestHistoryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Contest Participation</h3>
          <p className="text-sm text-slate-500 font-medium">Recent competition performance</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Contest</th>
              <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Rank</th>
              <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Change</th>
              <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Rating</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contests.map((contest) => (
              <tr key={contest.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="max-w-md">
                    <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {contest.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">{contest.date}</p>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-sm font-black text-slate-700 font-mono">#{contest.rank}</span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`text-sm font-bold font-mono ${
                    contest.rating_change > 0 ? 'text-emerald-600' :
                    contest.rating_change < 0 ? 'text-rose-600' : 'text-slate-400'
                  }`}>
                    {contest.rating_change > 0 ? `+${contest.rating_change}` : contest.rating_change}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="text-sm font-black text-slate-900 font-mono">{contest.new_rating}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <a
                    href={`https://codeforces.com/contest/${contest.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
