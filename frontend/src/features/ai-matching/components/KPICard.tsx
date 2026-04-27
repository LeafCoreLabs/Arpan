import { TrendingUp, TrendingDown, Minus, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  tone?: 'success' | 'warning' | 'danger' | 'default';
}

const toneIcon: Record<string, typeof Sparkles> = {
  warning: Sparkles,
  success: CheckCircle,
  danger: AlertTriangle,
  default: Sparkles,
};

export function KPICard({ title, value, tone = 'default' }: KPICardProps) {
  const Icon = toneIcon[tone] || Sparkles;

  return (
    <div className="af-metric">
      <div className="af-metric__icon" data-tone={tone}><Icon size={18} /></div>
      <div>
        <p className="af-metric__label">{title}</p>
        <p className="af-metric__value" style={{ fontSize: '1.5rem' }}>{value}</p>
      </div>
    </div>
  );
}
