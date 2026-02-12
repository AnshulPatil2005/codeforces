import { Lightbulb, Target, Zap, BarChart } from 'lucide-react'

interface PerformanceInsightsProps {
  insights: string[]
}

export default function PerformanceInsights({ insights }: PerformanceInsightsProps) {
  const getInsightType = (text: string) => {
    const lower = text.toLowerCase()
    if (lower.includes('last contest') || lower.includes('streak')) return 'trend'
    if (lower.includes('best rank') || lower.includes('peak')) return 'strength'
    if (lower.includes('away from')) return 'weakness'
    return 'general'
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Target className="w-4 h-4 text-emerald-600" />
      case 'weakness': return <Zap className="w-4 h-4 text-rose-600" />
      case 'trend': return <BarChart className="w-4 h-4 text-blue-600" />
      default: return <Lightbulb className="w-4 h-4 text-amber-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-emerald-50 border-emerald-100'
      case 'weakness': return 'bg-rose-50 border-rose-100'
      case 'trend': return 'bg-blue-50 border-blue-100'
      default: return 'bg-amber-50 border-amber-100'
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-900">AI Insights</h3>
        <p className="text-sm text-slate-500 font-medium">Personalized strategy tips</p>
      </div>
      <div className="space-y-4 flex-1">
        {insights.map((insight, index) => {
          const type = getInsightType(insight)
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${getBgColor(type)} transition-all hover:scale-[1.02] cursor-default`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-white rounded-lg shadow-sm">
                  {getIcon(type)}
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {type === 'strength' ? 'Milestone' : type === 'trend' ? 'Momentum' : type === 'weakness' ? 'Goal' : 'Insight'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                {insight}
              </p>
            </div>
          )
        })}
        {insights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lightbulb className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-sm text-slate-400 font-medium">No insights available yet.<br/>Compete in more contests!</p>
          </div>
        )}
      </div>
    </div>
  )
}
