import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface ComparativeRatingChartProps {
  user1Handle: string
  user2Handle: string
  user1Data: Array<{ month: string, rating: number }>
  user2Data: Array<{ month: string, rating: number }>
}

export default function ComparativeRatingChart({ user1Handle, user2Handle, user1Data, user2Data }: ComparativeRatingChartProps) {
  // Merge data for the chart
  const months = Array.from(new Set([
    ...user1Data.map(d => d.month),
    ...user2Data.map(d => d.month)
  ])).sort((a, b) => {
    // Basic sort by year-month if possible, but months are "Jan 2024" format.
    // For now, let's assume they are somewhat ordered or just use them as is.
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA.getTime() - dateB.getTime()
  })

  const mergedData = months.map(month => ({
    month,
    [user1Handle]: user1Data.find(d => d.month === month)?.rating,
    [user2Handle]: user2Data.find(d => d.month === month)?.rating,
  }))

  return (
    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/10 h-[450px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white">Comparative Progression</h3>
          <p className="text-sm text-gray-400 font-medium">Side-by-side rating history</p>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mergedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorU1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorU2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
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
                backgroundColor: '#1e293b',
                borderRadius: '12px',
                border: '1px solid #334155',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}
              itemStyle={{ fontWeight: 600, fontSize: '12px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey={user1Handle}
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorU1)"
              animationDuration={1500}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey={user2Handle}
              stroke="#a855f7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorU2)"
              animationDuration={1500}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
