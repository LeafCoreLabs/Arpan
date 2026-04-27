import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { performanceData } from '../data/mockData';

export function PerformanceAnalytics() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-base">Performance Analytics</h3>
      </div>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Avg Completion Rate</p>
          <p className="text-2xl text-primary">93%</p>
        </div>
        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
          <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
          <p className="text-2xl text-green-600 dark:text-green-400">21 min</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-muted-foreground mb-1">Top Performer</p>
          <p className="text-base text-purple-700">Emily R.</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-sm">
          <span className="text-yellow-600 dark:text-yellow-400">Insight:</span> Emily Rodriguez leads with 203 completed tasks this quarter,
          maintaining a 98% success rate.
        </p>
      </div>
    </div>
  );
}
