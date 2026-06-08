import { Navigate, useLocation } from 'react-router-dom'
import { useShop } from '../context/useShop'

export function RequireAuth({ children }) {
  const { authSummary } = useShop()
  const location = useLocation()

  if (!authSummary.isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export function RequireAdmin({ children }) {
  const { authSummary } = useShop()
  const location = useLocation()

  if (!authSummary.isLoggedIn || !authSummary.isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}