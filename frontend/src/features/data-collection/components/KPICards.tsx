import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number;
  subValue?: string;
  trend?: "up" | "down";
  trendValue?: string;
  color: "green" | "red" | "yellow" | "blue";
}

const colorClasses = {
  green: "bg-green-500/10 border-green-500/20",
  red: "bg-red-500/10 border-red-500/20",
  yellow: "bg-yellow-500/10 border-yellow-500/20",
  blue: "bg-primary/10 border-primary/20",
};

const iconColorClasses = {
  green: "text-green-600",
  red: "text-red-600",
  yellow: "text-yellow-600",
  blue: "text-primary",
};

function KPICard({ title, value, subValue, trend, trendValue, color }: KPICardProps) {
  return (
    <Card className={`p-6 ${colorClasses[color]} border-2`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className={`text-3xl ${iconColorClasses[color]}`}>{value}</p>
          {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend === "up" ? (
              <TrendingUp className={`w-5 h-5 ${trend === "up" ? "text-green-600" : "text-red-600"}`} />
            ) : (
              <TrendingDown className={`w-5 h-5 text-red-600`} />
            )}
            <span className={`text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <KPICard
        title="Total Reports Submitted"
        value={1247}
        subValue="This week"
        trend="up"
        trendValue="+12%"
        color="blue"
      />
      <KPICard
        title="Verified Reports"
        value={983}
        subValue="78.8% verified"
        trend="up"
        trendValue="+8%"
        color="green"
      />
      <KPICard
        title="Pending Verification"
        value={189}
        subValue="15.2% pending"
        trend="down"
        trendValue="-5%"
        color="yellow"
      />
      <KPICard
        title="Rejected Reports"
        value={75}
        subValue="6% rejected"
        color="red"
      />
      <KPICard
        title="Urgent Cases"
        value={43}
        subValue="Immediate action needed"
        trend="up"
        trendValue="+3"
        color="red"
      />
    </div>
  );
}
