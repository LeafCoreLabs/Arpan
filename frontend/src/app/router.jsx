import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ROUTES } from '../config/routes.js'
import { Loader } from '../components/ui/Loader.jsx'
import { MainLayout } from './layout/MainLayout.jsx'
import { AuthLayout } from './layout/AuthLayout.jsx'
import { useAuth } from '../features/auth/hooks/useAuth.js'

const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage.jsx'))
const CommunityNeedsPage = lazy(() => import('../features/needs/pages/CommunityNeedsPage.tsx'))
const VolunteersPage = lazy(() => import('../features/volunteers/pages/VolunteersPage.tsx'))
const MapPage = lazy(() => import('../features/map/pages/MapPage.tsx'))
const AIMatchingPage = lazy(() => import('../features/ai-matching/pages/AIMatchingPage.jsx'))
const NotificationsPage = lazy(() => import('../features/notifications/pages/NotificationsPage.jsx'))
const DataCollectionDashboardPage = lazy(() => import('../features/data-collection/pages/DataCollectionDashboardPage.tsx'))
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage.jsx'))
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage.jsx'))
const HelpSupportPage = lazy(() => import('../features/help/pages/HelpSupportPage.jsx'))
const Login = lazy(() => import('../features/auth/pages/Login.jsx'))
const Signup = lazy(() => import('../features/auth/pages/Signup.jsx'))
const Unauthorized = lazy(() => import('../features/auth/pages/Unauthorized.jsx'))

const VolunteerDashboard = lazy(() => import('../features/volunteer-portal/pages/VolunteerDashboard.jsx'))
const VolunteerDashboardTab = lazy(() => import('../features/volunteer-portal/pages/VolunteerDashboardTab.jsx'))
const VolunteerTasks = lazy(() => import('../features/volunteer-portal/pages/VolunteerTasks.jsx'))
const VolunteerEvents = lazy(() => import('../features/volunteer-portal/pages/VolunteerEvents.jsx'))
const VolunteerFeed = lazy(() => import('../features/volunteer-portal/pages/VolunteerFeed.jsx'))
const VolunteerNotifications = lazy(() => import('../features/volunteer-portal/pages/VolunteerNotifications.jsx'))
const VolunteerProfile = lazy(() => import('../features/volunteer-portal/pages/VolunteerProfile.jsx'))
const VolunteerLeaderboard = lazy(() => import('../features/volunteer-portal/pages/VolunteerLeaderboard.jsx'))
const UserReportNeed = lazy(() => import('../features/user-portal/pages/UserReportNeed.jsx'))
const VolunteerMapPage = lazy(() => import('../features/map/pages/MapPage.tsx'))

const UserDashboard = lazy(() => import('../features/user-portal/pages/UserDashboard.jsx'))
const UserDashboardTab = lazy(() => import('../features/user-portal/pages/UserDashboardTab.jsx'))
const UserReportNeedPage = lazy(() => import('../features/user-portal/pages/UserReportNeed.jsx'))
const UserTracker = lazy(() => import('../features/user-portal/pages/UserTracker.jsx'))
const UserFeed = lazy(() => import('../features/user-portal/pages/UserFeed.jsx'))
const UserSOS = lazy(() => import('../features/user-portal/pages/UserSOS.jsx'))
const UserResources = lazy(() => import('../features/user-portal/pages/UserResources.jsx'))
const UserProfile = lazy(() => import('../features/user-portal/pages/UserProfile.jsx'))

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <Loader fullPage />
  if (!user) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />

  if (allowedRoles && !allowedRoles.includes(user.role?.toUpperCase())) {
    const role = user.role?.toUpperCase()
    if (role === 'VOLUNTEER') return <Navigate to={ROUTES.VOLUNTEER_DASHBOARD} replace />
    if (role === 'USER' || role === 'COMMUNITY') return <Navigate to={ROUTES.COMMUNITY_DASHBOARD} replace />
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return children
}

function RoleBasedFallback() {
  const { user } = useAuth()
  const role = user?.role?.toUpperCase()
  if (role === 'VOLUNTEER') return <Navigate to={ROUTES.VOLUNTEER_DASHBOARD} replace />
  if (role === 'USER' || role === 'COMMUNITY') return <Navigate to={ROUTES.COMMUNITY_DASHBOARD} replace />
  return <Navigate to={ROUTES.DASHBOARD} replace />
}

export function AppRouter() {
  return (
    <Suspense fallback={<Loader fullPage />}>
      <Routes>
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        
        {/* Coordinator (Admin) Routes — full layout with sidebar */}
        <Route element={
          <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.DATA_COLLECTION} element={<DataCollectionDashboardPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.NEEDS} element={<CommunityNeedsPage />} />
          <Route path={ROUTES.VOLUNTEERS} element={<VolunteersPage />} />
          <Route path={ROUTES.MAP} element={<MapPage />} />
          <Route path={ROUTES.AI_MATCHING} element={<AIMatchingPage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.HELP} element={<HelpSupportPage />} />
        </Route>

        {/* Volunteer Portal — nested routes */}
        <Route path={ROUTES.VOLUNTEER_ROOT} element={
          <ProtectedRoute allowedRoles={['VOLUNTEER']}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VolunteerDashboardTab />} />
          <Route path="tasks" element={<VolunteerTasks />} />
          <Route path="data-collection" element={<UserReportNeed />} />
          <Route path="map" element={<VolunteerMapPage />} />
          <Route path="events" element={<VolunteerEvents />} />
          <Route path="feed" element={<VolunteerFeed />} />
          <Route path="notifications" element={<VolunteerNotifications />} />
          <Route path="leaderboard" element={<VolunteerLeaderboard />} />
          <Route path="profile" element={<VolunteerProfile />} />
        </Route>

        {/* Community User Portal — nested routes */}
        <Route path={ROUTES.COMMUNITY_ROOT} element={
          <ProtectedRoute allowedRoles={['USER', 'COMMUNITY']}>
            <UserDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboardTab />} />
          <Route path="report" element={<UserReportNeedPage />} />
          <Route path="tracker" element={<UserTracker />} />
          <Route path="feed" element={<UserFeed />} />
          <Route path="sos" element={<UserSOS />} />
          <Route path="resources" element={<UserResources />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        <Route path="*" element={
          <ProtectedRoute><RoleBasedFallback /></ProtectedRoute>
        } />
      </Routes>
    </Suspense>
  )
}
