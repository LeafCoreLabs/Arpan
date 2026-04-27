import { User, AlertTriangle, TrendingDown } from 'lucide-react';

interface VolunteerUtilizationProps {
  data: {
    overloaded: number;
    underutilized: number;
    optimal: number;
  };
}

const items = [
  { key: 'overloaded' as const, label: 'Overloaded', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2' },
  { key: 'optimal' as const, label: 'Optimal', icon: User, color: '#16a34a', bg: '#f0fdf4' },
  { key: 'underutilized' as const, label: 'Underutilized', icon: TrendingDown, color: '#f59e0b', bg: '#fffbeb' },
];

export function VolunteerUtilization({ data }: VolunteerUtilizationProps) {
  return (
    <div className="af-card" style={{ padding: '1.25rem' }}>
      <h3 style={{ margin: '0 0 1rem', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User size={18} style={{ color: 'var(--af-orange)' }} /> Volunteer Utilization
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.65rem 0.75rem', borderRadius: '0.5rem',
              background: item.bg, border: `1px solid ${item.color}20`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <Icon size={15} style={{ color: item.color }} />
                <span>{item.label}</span>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: item.color }}>{data[item.key]}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.75rem', background: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #dbeafe' }}>
        <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.25rem' }}>Insights</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--af-muted)' }}>
          {data.overloaded > 0 && <p style={{ margin: '0 0 0.15rem' }}>&bull; {data.overloaded} volunteer{data.overloaded > 1 ? 's are' : ' is'} overloaded</p>}
          {data.underutilized > 0 && <p style={{ margin: 0 }}>&bull; {data.underutilized} volunteer{data.underutilized > 1 ? 's are' : ' is'} underutilized</p>}
          {data.overloaded === 0 && data.underutilized === 0 && <p style={{ margin: 0 }}>All volunteers are at optimal capacity.</p>}
        </div>
      </div>
    </div>
  );
}
