import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

interface AnalyticsProps {
  categoryData: { name: string; value: number }[];
  regionData: { name: string; value: number }[];
  severityData: { name: string; value: number }[];
  trendData: { date: string; needs: number }[];
}

export function Analytics({ categoryData, regionData, severityData, trendData }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-foreground mb-4">Needs by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-foreground mb-4">Needs by Region</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-foreground mb-4">Severity Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={severityData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="font-semibold text-foreground mb-4">Needs Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="needs" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
