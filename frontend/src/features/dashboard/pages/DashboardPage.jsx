import { ErrorState } from '../../../components/common/ErrorState.jsx'
import { Loader } from '../../../components/ui/Loader.jsx'
import { useDashboard } from '../hooks/useDashboard.js'
import { ArpanMetricsRow } from '../components/ArpanMetricsRow.jsx'
import { ResourceMapCard } from '../components/ResourceMapCard.jsx'
import { DashboardAIMatchWidget } from '../components/DashboardAIMatchWidget.jsx'
import { DashboardNeedsTable } from '../components/DashboardNeedsTable.jsx'
import { LiveActivityFeed } from '../components/LiveActivityFeed.jsx'
import {
  buildArpanMetrics,
  getNeedsSnapshot,
  getLiveActivity,
  getAiMatch,
} from '../utils/dashboardMappers.js'

export default function DashboardPage() {
  const { data, isPending, isError, error, refetch } = useDashboard()

  if (isPending) {
    return <Loader fullPage />
  }
  if (isError) {
    return <ErrorState message={error?.message} onRetry={() => refetch()} />
  }

  const metrics = buildArpanMetrics(data)
  const needRows = getNeedsSnapshot(data)
  const activities = getLiveActivity(data)
  const aiMatch = getAiMatch(data)

  return (
    <div className="af-dashboard">
      <ArpanMetricsRow metrics={metrics} />
      <div className="af-dashboard__row af-dashboard__row--split-70">
        <ResourceMapCard />
        <DashboardAIMatchWidget match={aiMatch} />
      </div>
      <div className="af-dashboard__row af-dashboard__row--split-70">
        <DashboardNeedsTable rows={needRows} />
        <LiveActivityFeed items={activities} />
      </div>
    </div>
  )
}
