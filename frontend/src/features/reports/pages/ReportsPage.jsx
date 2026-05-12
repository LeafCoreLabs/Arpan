import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Download, RefreshCcw, TrendingUp, TrendingDown, FileSpreadsheet } from 'lucide-react'
import { fetchReportSummary } from '../api/reports.api.js'
import { Loader } from '../../../components/ui/Loader.jsx'
import { ErrorState } from '../../../components/common/ErrorState.jsx'
import { apiClient } from '../../../services/apiClient.js'

const COLORS = ['#ea580c', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ReportsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    try { setLoading(true); const res = await fetchReportSummary(); setData(res) }
    catch (err) { setError(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const exportCSV = async (type) => {
    try {
      const res = await apiClient.get(`/api/export/${type}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a'); a.href = url; a.download = `${type}.csv`
      document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url)
    } catch (e) { console.error('Export failed', e) }
  }

  if (loading) return <Loader fullPage />
  if (error) return <ErrorState message={error.message} onRetry={loadData} />

  const pieData = Object.entries(data.typeDistribution).map(([name, value]) => ({ name, value }))

  return (
    <div className="af-dashboard">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>System Reports</h1>
          <p style={{ color: 'var(--af-muted)', fontSize: '0.9rem', margin: 0 }}>Analytical overview of Arpan humanitarian operations.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={loadData} className="btn btn--ghost"><RefreshCcw size={15} /> Refresh</button>
          <button onClick={() => exportCSV('report-summary')} className="btn btn--primary"><Download size={15} /> Export Summary</button>
          <button onClick={() => exportCSV('volunteers')} className="btn btn--ghost"><FileSpreadsheet size={15} /> Volunteers</button>
          <button onClick={() => exportCSV('needs')} className="btn btn--ghost"><FileSpreadsheet size={15} /> Needs</button>
          <button onClick={() => exportCSV('tasks')} className="btn btn--ghost"><FileSpreadsheet size={15} /> Tasks</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="af-metrics">
        {data.stats.map((stat, i) => (
          <div key={i} className="af-metric">
            <div className="af-metric__icon" data-tone={stat.trend?.startsWith('+') ? 'success' : 'danger'}>
              {stat.trend?.startsWith('+') ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
            <div>
              <p className="af-metric__label">{stat.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <p className="af-metric__value" style={{ fontSize: '1.5rem' }}>{stat.value}</p>
                <span style={{ color: stat.trend?.startsWith('+') ? '#16a34a' : '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="af-card" style={{ padding: '1.5rem', height: '400px' }}>
          <h3 className="af-card__title" style={{ marginBottom: '1rem' }}>Incidents by Category</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--af-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--af-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--af-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--af-card)', border: '1px solid var(--af-border)', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="var(--af-orange)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="af-card" style={{ padding: '1.5rem', height: '400px' }}>
          <h3 className="af-card__title" style={{ marginBottom: '1rem' }}>Priority Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={pieData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--af-card)', border: '1px solid var(--af-border)', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
