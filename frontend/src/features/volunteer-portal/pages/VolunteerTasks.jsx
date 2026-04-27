import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search, ListOrdered, CheckCircle, Clock, AlertTriangle,
  MapPin, MessageSquare, Phone, X, AlertCircle, Play, TrendingUp, Check
} from 'lucide-react'
import { apiClient } from '../../../services/apiClient.js'
import { useAuth } from '../../../app/providers.jsx'

const STATUS_CFG = {
  pending:       { label: 'Pending',     cls: '' },
  'in-progress': { label: 'In Progress', cls: 'badge--warning' },
  completed:     { label: 'Completed',   cls: 'badge--success' },
  overdue:       { label: 'Overdue',     cls: 'badge--danger' },
}
const PRIORITY_CFG = {
  Low:      { cls: '' },
  Medium:   { cls: '' },
  High:     { cls: 'badge--warning' },
  Critical: { cls: 'badge--danger' },
}

export default function VolunteerTasks() {
  const { user } = useAuth()
  const [rawTasks, setRawTasks] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [selectedTask, setSelectedTask] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const { data: vols } = await apiClient.get('/api/volunteers')
      const my = vols.find(v => v.userId === user?.id)
      setProfile(my)
      if (my) {
        const { data } = await apiClient.get(`/api/volunteers/${my.id}/tasks`)
        const augmented = data.map(t => {
          let priority = 'Medium'
          if (t.needSeverity === 'critical') priority = 'Critical'
          else if (t.needSeverity === 'high') priority = 'High'
          else if (t.needSeverity === 'low') priority = 'Low'
          let progress = 0
          if (t.status === 'completed') progress = 100
          else if (t.status === 'in-progress') progress = Math.floor(Math.random() * 40) + 30
          return {
            ...t, priority, progress,
            coordinator: 'Sarah Jenkins',
            coordinatorRole: 'Regional Admin',
            lastInstruction: t.status === 'completed' ? 'Great work.' : 'Please verify location before starting.',
            deadline: new Date(Date.now() + Math.random() * 86400000 * 3).toLocaleDateString(),
          }
        })
        setRawTasks(augmented)
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const processedTasks = useMemo(() => {
    let result = rawTasks.filter(t => {
      const matchSearch = t.needTitle?.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'All' || t.status === statusFilter.toLowerCase()
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter
      return matchSearch && matchStatus && matchPriority
    })
    result.sort((a, b) => {
      if (a.priority === 'Critical' && b.priority !== 'Critical') return -1
      if (b.priority === 'Critical' && a.priority !== 'Critical') return 1
      return 0
    })
    return result
  }, [rawTasks, search, statusFilter, priorityFilter])

  const updateStatus = async (taskId, status) => {
    try {
      await apiClient.put(`/api/tasks/${taskId}/status`, { status })
      setRawTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, progress: status === 'completed' ? 100 : status === 'in-progress' ? 10 : t.progress } : t))
      if (selectedTask?.id === taskId) setSelectedTask(prev => ({ ...prev, status }))
    } catch (e) { console.error(e) }
  }

  const metrics = {
    total: rawTasks.length,
    inProgress: rawTasks.filter(t => t.status === 'in-progress').length,
    completed: rawTasks.filter(t => t.status === 'completed').length,
    urgent: rawTasks.filter(t => t.priority === 'Critical' && t.status !== 'completed').length,
  }

  const metricCards = [
    { label: 'Total Assigned', value: metrics.total, icon: ListOrdered, tone: 'default' },
    { label: 'In Progress', value: metrics.inProgress, icon: Clock, tone: 'warning' },
    { label: 'Completed', value: metrics.completed, icon: CheckCircle, tone: 'success' },
    { label: 'Urgent Actions', value: metrics.urgent, icon: AlertTriangle, tone: 'danger' },
  ]

  return (
    <div className="af-dashboard" style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem' }}>Tasks</h1>
          <p style={{ margin: 0, color: 'var(--af-muted)', fontSize: '0.85rem' }}>Execution workspace and task management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
            <input
              className="searchbar"
              placeholder="Search ID or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2rem', width: '220px' }}
            />
          </div>
          <select className="searchbar" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
            <option>All</option><option>Pending</option><option value="in-progress">In Progress</option><option>Completed</option>
          </select>
          <select className="searchbar" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ width: 'auto' }}>
            <option value="All">All Priorities</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="af-metrics">
        {metricCards.map(m => (
          <div key={m.label} className="af-metric">
            <div className="af-metric__icon" data-tone={m.tone}><m.icon size={18} /></div>
            <div>
              <p className="af-metric__label">{m.label}</p>
              <p className="af-metric__value" style={{ fontSize: '1.5rem' }}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Split workspace */}
      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
        {/* Task list */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          {loading ? (
            <div className="loader-fullpage"><span className="loader" /></div>
          ) : processedTasks.length === 0 ? (
            <div className="empty-state" style={{ marginTop: '2rem' }}>
              <h3 className="empty-state__title">No tasks match your filters</h3>
              <p className="empty-state__desc">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {processedTasks.map(task => {
                const isCritical = task.priority === 'Critical' && task.status !== 'completed'
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="af-card"
                    style={{
                      padding: '1rem 1.25rem', cursor: 'pointer', transition: 'box-shadow 0.15s',
                      boxShadow: selectedTask?.id === task.id ? '0 0 0 2px #3b82f6' : isCritical ? '0 0 0 1px #fca5a5' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span className={`badge ${STATUS_CFG[task.status]?.cls || ''}`}>{STATUS_CFG[task.status]?.label || task.status}</span>
                        <span className={`badge ${PRIORITY_CFG[task.priority]?.cls || ''}`}>{task.priority}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--af-muted)', fontFamily: 'monospace' }}>#{task.id.split('-')[1]}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--af-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> Deadline: <strong>{task.deadline}</strong>
                      </div>
                    </div>

                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600 }}>{task.needTitle}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--af-muted)', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={13} color="#3b82f6" /> {task.needLocation}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={13} /> Assigned: {task.assignedAt?.split('T')[0]}</span>
                    </div>

                    {/* Progress */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--af-muted)', marginBottom: '0.35rem' }}>
                        <span>Progress</span><span>{task.progress}%</span>
                      </div>
                      <div style={{ height: 5, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 3, transition: 'width 0.4s',
                          width: `${task.progress}%`,
                          background: task.status === 'completed' ? '#16a34a' : task.status === 'in-progress' ? '#f59e0b' : '#94a3b8',
                        }} />
                      </div>
                    </div>

                    {/* Actions row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--af-border)', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700 }}>
                          {task.coordinator.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{task.coordinator}</div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--af-muted)' }}>{task.coordinatorRole}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }} onClick={e => e.stopPropagation()}>
                        {task.status === 'pending' && (
                          <button className="btn btn--primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }} onClick={() => updateStatus(task.id, 'in-progress')}>
                            <Play size={13} /> Start
                          </button>
                        )}
                        {task.status === 'in-progress' && (
                          <>
                            <button className="btn btn--ghost" style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }}>
                              <TrendingUp size={13} /> Update
                            </button>
                            <button className="btn" style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem', background: '#16a34a', color: '#fff', border: 'none' }} onClick={() => updateStatus(task.id, 'completed')}>
                              <Check size={13} /> Complete
                            </button>
                          </>
                        )}
                        {task.status === 'completed' && (
                          <span className="badge badge--success" style={{ fontSize: '0.7rem' }}><CheckCircle size={12} /> Done</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedTask && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="af-card"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}
            >
              <div className="card__header">
                <h2 className="card__title" style={{ fontSize: '1rem' }}>Task Details</h2>
                <button onClick={() => setSelectedTask(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--af-muted)' }}><X size={18} /></button>
              </div>

              <div className="card__body" style={{ overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
                  <span className={`badge ${STATUS_CFG[selectedTask.status]?.cls || ''}`}>{STATUS_CFG[selectedTask.status]?.label}</span>
                  <span className={`badge ${PRIORITY_CFG[selectedTask.priority]?.cls || ''}`}>{selectedTask.priority}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem' }}>{selectedTask.needTitle}</h3>

                {/* Location card */}
                <div style={{
                  height: 120, borderRadius: '0.5rem', border: '1px solid var(--af-border)',
                  background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', marginBottom: '1.25rem', color: 'var(--af-muted)',
                }}>
                  <MapPin size={22} color="#3b82f6" style={{ marginBottom: '0.4rem' }} />
                  <span style={{ fontSize: '0.8rem' }}>{selectedTask.needLocation}</span>
                </div>

                {/* Instructions */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--af-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.5rem' }}>Instructions</h4>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0, padding: '0.75rem', background: '#f9fafb', borderRadius: '0.5rem', border: '1px solid var(--af-border)' }}>
                    {selectedTask.lastInstruction}
                  </p>
                </div>

                {/* Coordinator Notes */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--af-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Coordinator Notes</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><MessageSquare size={15} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer' }}><Phone size={15} /></button>
                    </div>
                  </div>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.75rem' }}>{selectedTask.coordinator}</strong>
                      <span style={{ fontSize: '0.65rem', color: 'var(--af-muted)' }}>Today</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>
                      Please update the status once you reach the location. Ensure you have the required supplies.
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--af-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.75rem' }}>Timeline</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.25rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '0.35rem', top: 8, bottom: 8, width: 2, background: 'var(--af-border)' }} />
                    {[
                      { title: 'Task Created', time: selectedTask.assignedAt, done: true },
                      { title: 'Assigned to You', time: selectedTask.assignedAt, done: true },
                      { title: 'Started', time: selectedTask.status !== 'pending' ? 'Updated recently' : '--', done: selectedTask.status !== 'pending' },
                      { title: 'Completed', time: selectedTask.status === 'completed' ? 'Done' : '--', done: selectedTask.status === 'completed' },
                    ].map((step, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute', left: '-1.25rem', top: 3,
                          width: 10, height: 10, borderRadius: '50%',
                          background: step.done ? '#3b82f6' : '#d1d5db',
                          border: '2px solid #fff',
                        }} />
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: step.done ? undefined : 'var(--af-muted)' }}>{step.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--af-muted)' }}>{step.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
