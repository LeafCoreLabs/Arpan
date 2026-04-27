import { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Search, Filter, Database, GitBranch, Shield, Users } from 'lucide-react';
import { KPICard } from './components/KPICard';
import { MatchCard } from './components/MatchCard';
import { UnmatchedNeedCard } from './components/UnmatchedNeedCard';
import { ActivityFeedItem } from './components/ActivityFeedItem';
import { VolunteerUtilization } from './components/VolunteerUtilization';
import { ModelControlPanel } from './components/ModelControlPanel';
import { AlertPanel } from './components/AlertPanel';

export default function App() {
  const [selectedTab, setSelectedTab] = useState<'matches' | 'unmatched' | 'analytics'>('matches');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'suggested' | 'assigned' | 'rejected'>('all');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const kpiData = {
    totalMatches: { today: 87, week: 542 },
    successfulMatches: 68,
    pendingMatches: 19,
    accuracyRate: 92.5,
    unmatchedCritical: 3,
  };

  const matches = [
    {
      id: '1',
      needTitle: 'Medical Emergency - Diabetic Patient',
      location: 'District 3, Zone A',
      severity: 'critical' as const,
      peopleAffected: 1,
      volunteerName: 'Dr. Sarah Chen',
      skills: ['Medical', 'Emergency Response', 'Diabetes Care'],
      distance: '2.3 km',
      availability: 'Immediate',
      matchScore: 94,
      skillMatch: 98,
      distanceScore: 92,
      availabilityScore: 100,
      performanceScore: 88,
      timeReported: '12 min ago',
      status: 'suggested' as const,
    },
    {
      id: '2',
      needTitle: 'Food Distribution Required',
      location: 'District 7, Zone C',
      severity: 'high' as const,
      peopleAffected: 45,
      volunteerName: 'Marcus Johnson',
      skills: ['Logistics', 'Food Distribution', 'Community Work'],
      distance: '5.7 km',
      availability: 'Within 2 hours',
      matchScore: 87,
      skillMatch: 90,
      distanceScore: 75,
      availabilityScore: 85,
      performanceScore: 95,
      timeReported: '28 min ago',
      status: 'suggested' as const,
    },
    {
      id: '3',
      needTitle: 'Temporary Shelter Setup',
      location: 'District 2, Zone B',
      severity: 'medium' as const,
      peopleAffected: 12,
      volunteerName: 'Emily Rodriguez',
      skills: ['Construction', 'Project Management', 'Shelter'],
      distance: '8.2 km',
      availability: 'Tomorrow',
      matchScore: 76,
      skillMatch: 82,
      distanceScore: 68,
      availabilityScore: 70,
      performanceScore: 85,
      timeReported: '1 hr ago',
      status: 'assigned' as const,
    },
    {
      id: '4',
      needTitle: 'Water Purification System Repair',
      location: 'District 5, Zone D',
      severity: 'high' as const,
      peopleAffected: 120,
      volunteerName: 'James Wilson',
      skills: ['Engineering', 'Water Systems', 'Technical Support'],
      distance: '12.1 km',
      availability: 'Within 4 hours',
      matchScore: 83,
      skillMatch: 95,
      distanceScore: 60,
      availabilityScore: 80,
      performanceScore: 90,
      timeReported: '45 min ago',
      status: 'suggested' as const,
    },
  ];

  const unmatchedNeeds = [
    {
      id: '1',
      title: 'Specialized Surgical Equipment Needed',
      location: 'District 9, Zone F',
      severity: 'critical' as const,
      reason: 'No volunteers with specialized surgical skills available',
    },
    {
      id: '2',
      title: 'Psychiatric Counseling Support',
      location: 'District 1, Zone A',
      severity: 'high' as const,
      reason: 'No licensed mental health professionals nearby',
    },
    {
      id: '3',
      title: 'Heavy Equipment Operation',
      location: 'District 8, Zone E',
      severity: 'medium' as const,
      reason: 'No volunteers available with heavy machinery licenses',
    },
  ];

  const activities = [
    {
      id: '1',
      type: 'match_generated' as const,
      needTitle: 'Medical Emergency',
      volunteerName: 'Dr. Sarah Chen',
      timestamp: '2 min ago',
    },
    {
      id: '2',
      type: 'match_accepted' as const,
      needTitle: 'Food Distribution',
      volunteerName: 'Marcus Johnson',
      timestamp: '8 min ago',
    },
    {
      id: '3',
      type: 'task_completed' as const,
      needTitle: 'Water Supply Check',
      volunteerName: 'Lisa Park',
      timestamp: '15 min ago',
    },
    {
      id: '4',
      type: 'match_rejected' as const,
      needTitle: 'Transportation',
      volunteerName: 'John Davis',
      timestamp: '22 min ago',
    },
    {
      id: '5',
      type: 'match_generated' as const,
      needTitle: 'Shelter Setup',
      volunteerName: 'Emily Rodriguez',
      timestamp: '28 min ago',
    },
  ];

  const utilizationData = {
    overloaded: 10,
    underutilized: 15,
    optimal: 42,
  };

  const alerts = [
    {
      id: '1',
      type: 'critical' as const,
      message: 'Critical need unmatched for 2 hours in District 9',
      timestamp: '5 min ago',
    },
    {
      id: '2',
      type: 'warning' as const,
      message: 'No volunteers available in Region X',
      timestamp: '12 min ago',
    },
    {
      id: '3',
      type: 'info' as const,
      message: 'Low match confidence detected for 3 pending assignments',
      timestamp: '18 min ago',
    },
  ];

  const matchTrendData = [
    { time: '00:00', successRate: 88 },
    { time: '04:00', successRate: 91 },
    { time: '08:00', successRate: 87 },
    { time: '12:00', successRate: 93 },
    { time: '16:00', successRate: 90 },
    { time: '20:00', successRate: 92 },
  ];

  const categoryDistribution = [
    { name: 'Medical', value: 35, color: '#ef4444' },
    { name: 'Food', value: 25, color: '#f59e0b' },
    { name: 'Shelter', value: 20, color: '#3b82f6' },
    { name: 'Water', value: 15, color: '#10b981' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ];

  const filteredMatches = matches.filter(match => {
    if (filterStatus !== 'all' && match.status !== filterStatus) return false;
    if (filterScore !== 'all') {
      if (filterScore === 'high' && match.matchScore < 80) return false;
      if (filterScore === 'medium' && (match.matchScore < 60 || match.matchScore >= 80)) return false;
      if (filterScore === 'low' && match.matchScore >= 60) return false;
    }
    if (searchQuery && !match.needTitle.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">AI Matching Dashboard</h1>
          </div>
          <p className="text-gray-400">Intelligent Resource Allocation System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <KPICard
            title="Total Matches Generated"
            value={kpiData.totalMatches.today}
            trend="up"
            trendValue="+12%"
            status="success"
          />
          <KPICard
            title="Successful Matches"
            value={kpiData.successfulMatches}
            trend="up"
            trendValue="+8%"
            status="success"
          />
          <KPICard
            title="Pending Matches"
            value={kpiData.pendingMatches}
            trend="neutral"
            status="warning"
          />
          <KPICard
            title="Match Accuracy Rate"
            value={`${kpiData.accuracyRate}%`}
            trend="up"
            trendValue="+2.3%"
            status="success"
          />
          <KPICard
            title="Unmatched Critical"
            value={kpiData.unmatchedCritical}
            trend="down"
            trendValue="-1"
            status="danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  AI Matching Panel
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTab('matches')}
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedTab === 'matches' ? 'bg-blue-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    Matches
                  </button>
                  <button
                    onClick={() => setSelectedTab('unmatched')}
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedTab === 'unmatched' ? 'bg-blue-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    Unmatched
                  </button>
                  <button
                    onClick={() => setSelectedTab('analytics')}
                    className={`px-4 py-2 rounded transition-colors ${
                      selectedTab === 'analytics' ? 'bg-blue-500 text-white' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    Analytics
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search needs or volunteers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="suggested">Suggested</option>
                  <option value="assigned">Assigned</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value as any)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Scores</option>
                  <option value="high">High (80%+)</option>
                  <option value="medium">Medium (60-80%)</option>
                  <option value="low">Low (&lt;60%)</option>
                </select>
              </div>

              {selectedTab === 'matches' && (
                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {filteredMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onAccept={() => console.log('Accept', match.id)}
                      onReject={() => console.log('Reject', match.id)}
                      onReassign={() => console.log('Reassign', match.id)}
                      onViewDetails={() => console.log('View Details', match.id)}
                    />
                  ))}
                </div>
              )}

              {selectedTab === 'unmatched' && (
                <div className="space-y-4">
                  {unmatchedNeeds.map((need) => (
                    <UnmatchedNeedCard key={need.id} need={need} />
                  ))}
                </div>
              )}

              {selectedTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="border border-gray-800 rounded-lg p-4 bg-black/20">
                    <h3 className="font-semibold mb-4">Match Success Rate Over Time</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={matchTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                        />
                        <Line type="monotone" dataKey="successRate" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-800 rounded-lg p-4 bg-black/20">
                      <h3 className="font-semibold mb-4">Match Distribution by Category</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="border border-gray-800 rounded-lg p-4 bg-black/20">
                      <h3 className="font-semibold mb-4">Key Insights</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                          <span className="text-gray-300">Medical tasks have highest match success rate (95%)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5" />
                          <span className="text-gray-300">Low match accuracy in Region X (78%)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                          <span className="text-gray-300">Average match score: 86.5%</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                          <span className="text-gray-300">Critical needs matched in avg 18 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <h3 className="font-semibold mb-4">System Integration Pipeline</h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                  <span className="text-xs text-gray-400">Data Collection</span>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-4" />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-purple-500" />
                  </div>
                  <span className="text-xs text-gray-400">AI Matching</span>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 mx-4" />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <Users className="w-8 h-8 text-green-500" />
                  </div>
                  <span className="text-xs text-gray-400">Assignment</span>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-yellow-500 mx-4" />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                    <GitBranch className="w-8 h-8 text-yellow-500" />
                  </div>
                  <span className="text-xs text-gray-400">Completion</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <h3 className="font-semibold mb-4">Real-Time Activity Feed</h3>
              <div className="space-y-1 max-h-[400px] overflow-y-auto">
                {activities.map((activity) => (
                  <ActivityFeedItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            <VolunteerUtilization data={utilizationData} />

            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <h3 className="font-semibold mb-4">System Alerts</h3>
              <AlertPanel alerts={alerts} />
            </div>

            <ModelControlPanel />

            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                User Role & Access
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded">
                  <span className="text-sm">Current Role</span>
                  <span className="text-sm font-medium text-green-500">Admin</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  <div className="mb-1">✓ Full control over AI and assignments</div>
                  <div className="mb-1">✓ Approve/reject matches</div>
                  <div>✓ Configure model parameters</div>
                </div>
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <h3 className="font-semibold mb-4">Smart AI Features</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Adaptive Learning Active</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Feedback Loop Enabled</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Predictive Matching Running</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Conflict Detection Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
