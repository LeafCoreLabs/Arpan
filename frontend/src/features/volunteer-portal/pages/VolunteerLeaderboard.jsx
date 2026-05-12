import { useState, useEffect } from 'react'
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'

export default function VolunteerLeaderboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/api/leaderboard').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loader-fullpage"><span className="loader" /></div>
  if (!data) return <div className="empty-state"><p>Failed to load leaderboard</p></div>

  const { leaderboard } = data
  const podium = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="af-dashboard">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={22} style={{ color: '#f59e0b' }} /> Volunteer Leaderboard
        </h1>
        <p style={{ color: 'var(--af-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
          Top performers based on completed tasks and ratings.
        </p>
      </div>

      {/* Podium */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {podium.map((v, i) => (
          <div key={v.id} className="af-card" style={{ padding: '1.5rem', textAlign: 'center', border: i === 0 ? '2px solid #f59e0b' : '1px solid var(--af-border)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
            </div>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--af-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', margin: '0 auto 0.5rem' }}>
              {v.initials}
            </div>
            <p style={{ fontWeight: 700, margin: '0 0 0.2rem' }}>{v.name}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--af-muted)', margin: '0 0 0.5rem' }}>{v.region}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem' }}>
              <span><strong>{v.completedTasks}</strong> tasks</span>
              <span><Star size={12} style={{ color: '#f59e0b' }} /> {v.rating}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {v.badges.map(b => (
                <span key={b.id} title={b.desc} style={{ fontSize: '1.1rem', cursor: 'help' }}>{b.icon}</span>
              ))}
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--af-orange)', margin: '0.5rem 0 0' }}>{v.score} pts</p>
          </div>
        ))}
      </div>

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <div className="af-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--af-border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--af-muted)', fontWeight: 500 }}>#</th>
                <th style={{ padding: '0.75rem 0.5rem', color: 'var(--af-muted)', fontWeight: 500 }}>Volunteer</th>
                <th style={{ padding: '0.75rem 0.5rem', color: 'var(--af-muted)', fontWeight: 500 }}>Tasks</th>
                <th style={{ padding: '0.75rem 0.5rem', color: 'var(--af-muted)', fontWeight: 500 }}>Rating</th>
                <th style={{ padding: '0.75rem 0.5rem', color: 'var(--af-muted)', fontWeight: 500 }}>Score</th>
                <th style={{ padding: '0.75rem 0.5rem', color: 'var(--af-muted)', fontWeight: 500 }}>Badges</th>
              </tr>
            </thead>
            <tbody>
              {rest.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--af-border)' }}>
                  <td style={{ padding: '0.6rem 1rem', fontWeight: 600 }}>{v.rank}</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
                        {v.initials}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>{v.name}</p>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--af-muted)' }}>{v.region}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>{v.completedTasks}</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>{v.rating}</td>
                  <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: 'var(--af-orange)' }}>{v.score}</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>
                    {v.badges.map(b => <span key={b.id} title={b.desc} style={{ marginRight: '0.2rem' }}>{b.icon}</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
