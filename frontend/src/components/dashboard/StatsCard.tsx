import { getRankColor, getRankBgColor } from '../../utils/rankColors';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  rank?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ title, value, subtitle, rank, icon, trend }: StatsCardProps) {
  const rankColor = getRankColor(rank);
  const rankBgColor = getRankBgColor(rank);

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className={`text-3xl font-bold ${rankColor}`}>{value}</p>
            {subtitle && (
              <span className={`ml-2 text-sm ${getTrendColor()}`}>
                {subtitle}
              </span>
            )}
          </div>
          {rank && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rankBgColor} ${rankColor}`}>
                {rank}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
