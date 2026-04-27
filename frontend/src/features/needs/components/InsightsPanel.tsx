import { TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Insight {
  type: 'warning' | 'success' | 'info' | 'alert';
  message: string;
}

interface InsightsPanelProps {
  insights: Insight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
      case 'alert':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
    }
  };

  const getInsightBg = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'info':
        return 'bg-primary/10 border-primary/20';
      case 'alert':
        return 'bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4">AI-Powered Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div key={idx} className={`p-3 rounded-lg border ${getInsightBg(insight.type)}`}>
            <div className="flex items-start gap-3">
              {getInsightIcon(insight.type)}
              <p className="text-sm text-foreground flex-1">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
