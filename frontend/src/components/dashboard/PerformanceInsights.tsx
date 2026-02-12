import { TrendingUp, Trophy, Target, Activity } from 'lucide-react';

interface PerformanceInsightsProps {
  insights: string[];
}

export default function PerformanceInsights({ insights }: PerformanceInsightsProps) {
  const getIcon = (index: number) => {
    const icons = [
      <TrendingUp className="w-5 h-5 text-blue-600" />,
      <Trophy className="w-5 h-5 text-yellow-600" />,
      <Target className="w-5 h-5 text-green-600" />,
      <Activity className="w-5 h-5 text-purple-600" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>

      {insights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No insights available
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(index)}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
