import { Outlet } from 'react-router-dom'
import { Sidebar } from '../../components/layout/Sidebar.jsx'
import { Topbar } from '../../components/layout/Topbar.jsx'
import { PageWrapper } from '../../components/layout/PageWrapper.jsx'

export function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <PageWrapper className="page-wrapper--arpan">
          <Outlet />
        </PageWrapper>
      </div>
    </div>
  )
}
