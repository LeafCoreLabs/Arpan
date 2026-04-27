import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

interface AlertPanelProps {
  alerts: Alert[];
}

const config: Record<string, { icon: typeof Info; color: string; bg: string; border: string; tone: string }> = {
  critical: { icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2', border: '#fecaca', tone: 'danger' },
  warning:  { icon: AlertCircle,   color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', tone: 'warning' },
  info:     { icon: Info,          color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe', tone: '' },
};

export function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {alerts.map(alert => {
        const c = config[alert.type] || config.info;
        const Icon = c.icon;
        return (
          <div key={alert.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
            padding: '0.65rem 0.75rem', borderRadius: '0.5rem',
            background: c.bg, border: `1px solid ${c.border}`,
          }}>
            <Icon size={15} style={{ color: c.color, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', color: c.color }}>{alert.message}</div>
              {alert.timestamp && <div style={{ fontSize: '0.65rem', color: 'var(--af-muted)', marginTop: '0.2rem' }}>{alert.timestamp}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
