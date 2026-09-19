import { NavLink } from 'react-router-dom'
import { useApp } from '../app/useApp'
import Navigation from './Navigation'
import Toast from './Toast'

function Layout({ children }) {
  const { toast } = useApp()

  return (
    <div className="app-shell">
      <header>
        <p className="eyebrow">Category D Theory</p>
        <NavLink className="app-title-link" to="/cards"><h1>Проблемные карточки</h1></NavLink>
        <Navigation />
      </header>
      <main>{children}</main>
      <Toast toast={toast} />
    </div>
  )
}

export default Layout