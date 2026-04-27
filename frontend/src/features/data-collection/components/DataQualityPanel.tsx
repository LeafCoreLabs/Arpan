import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { AlertCircle, CheckCircle2, AlertTriangle, Copy } from "lucide-react";
import { Badge } from "./ui/badge";

interface QualityMetric {
  label: string;
  value: number;
  total: number;
  percentage: number;
  color: string;
}

interface Alert {
  type: "warning" | "error" | "info";
  message: string;
  count: number;
}

const qualityMetrics: QualityMetric[] = [
  {
    label: "Complete Reports",
    value: 983,
    total: 1247,
    percentage: 78.8,
    color: "bg-green-500"
  },
  {
    label: "Missing Fields",
    value: 264,
    total: 1247,
    percentage: 21.2,
    color: "bg-yellow-500"
  },
  {
    label: "Verification Rate",
    value: 983,
    total: 1172,
    percentage: 83.8,
    color: "bg-primary/100"
  }
];

const alerts: Alert[] = [
  {
    type: "warning",
    message: "reports missing GPS coordinates",
    count: 45
  },
  {
    type: "error",
    message: "duplicate entries detected",
    count: 12
  },
  {
    type: "warning",
    message: "reports pending verification >48hrs",
    count: 28
  },
  {
    type: "info",
    message: "reports with incomplete media",
    count: 67
  }
];

export default function DataQualityPanel() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <h2 className="text-xl">Data Quality & Validation</h2>
      </div>

      <div className="space-y-6">
        {qualityMetrics.map((metric, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">{metric.label}</span>
              <span className="text-sm">
                {metric.value} / {metric.total} ({metric.percentage}%)
              </span>
            </div>
            <Progress value={metric.percentage} className="h-2" />
          </div>
        ))}

        <div className="border-t pt-6">
          <h3 className="text-sm mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            Quality Alerts
          </h3>

          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  alert.type === "error"
                    ? "bg-red-500/10 border-red-500/20"
                    : alert.type === "warning"
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-primary/10 border-primary/20"
                }`}
              >
                {alert.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                ) : alert.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        alert.type === "error"
                          ? "bg-red-500/20 text-red-800 border-red-300"
                          : alert.type === "warning"
                          ? "bg-yellow-500/20 text-yellow-800 border-yellow-300"
                          : "bg-primary/20 text-primary border-primary/30"
                      }
                    >
                      {alert.count}
                    </Badge>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-1">Data Accuracy</p>
              <p className="text-2xl text-green-600 dark:text-green-400">94.3%</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
              <p className="text-2xl text-primary">3.2h</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
