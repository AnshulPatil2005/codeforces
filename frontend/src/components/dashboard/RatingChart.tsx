import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { MonthlyGrowth } from '../../types/rating';

interface RatingChartProps {
  data: MonthlyGrowth[];
}

export default function RatingChart({ data }: RatingChartProps) {
  // Format data for Recharts
  const chartData = data.map(item => ({
    month: item.month,
    change: item.change,
    contests: item.contests,
  }));

  // Get last 12 months
  const recentData = chartData.slice(-12);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Rating Growth</h3>

      {recentData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No rating data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={recentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={{ value: 'Rating Change', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'change') return [value > 0 ? `+${value}` : value, 'Change'];
                return [value, 'Contests'];
              }}
            />
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="change"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <p className="mt-4 text-xs text-gray-500 text-center">
        Showing last 12 months of rating changes
      </p>
    </div>
  );
}
