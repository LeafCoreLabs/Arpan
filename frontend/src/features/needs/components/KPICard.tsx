import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  status?: 'critical' | 'warning' | 'success' | 'neutral';
  subtitle?: string;
}

export function KPICard({ title, value, trend, status = 'neutral', subtitle }: KPICardProps) {
  const statusColors = {
    critical: 'border-red-500 bg-red-50',
    warning: 'border-yellow-500 bg-yellow-50',
    success: 'border-green-500 bg-green-50',
    neutral: 'border-border bg-card'
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4 text-muted-foreground" />;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <TrendingDown className="w-4 h-4 text-green-500" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    return trend > 0 ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${statusColors[status]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
