import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../../config/routes.js'

const TITLES = {
  [ROUTES.DATA_COLLECTION]: 'Data collection',
  [ROUTES.REPORTS]: 'Reports',
}

export default function ComingSoonPage() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'This section'
  return (
    <div className="af-coming-soon">
      <h1 className="af-coming-soon__title">{title}</h1>
      <p className="af-coming-soon__text">This area is not built yet. Use the sidebar to return to the overview.</p>
    </div>
  )
}
