import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole, requiredRoles }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Vérifier si un rôle est requis
  if (requiredRoles && Array.isArray(requiredRoles)) {
    // Vérifier si l'utilisateur a un des rôles requis
    if (!requiredRoles.includes(user?.role)) {
      return <Navigate to="/dashboard" replace />
    }
  } else if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

