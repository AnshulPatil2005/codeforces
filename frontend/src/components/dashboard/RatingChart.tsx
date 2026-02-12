import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface RatingChartProps {
  data: Array<{
    month: string
    rating: number
  }>
}

export default function RatingChart({ data }: RatingChartProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Rating Progression</h3>
          <p className="text-sm text-slate-500 font-medium">Monthly performance overview</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            Rating
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}
              itemStyle={{ fontWeight: 600, color: '#3b82f6', fontSize: '12px' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [value, 'Rating']}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRating)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
