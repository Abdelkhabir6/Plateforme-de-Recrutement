import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import JobOffers from './pages/JobOffers'
import JobOfferDetail from './pages/JobOfferDetail'
import MyApplications from './pages/MyApplications'
import MyCvFiles from './pages/MyCvFiles'
import Users from './pages/Users'
import CompanyJobOffers from './pages/CompanyJobOffers'
import CompanyApplications from './pages/CompanyApplications'
import Layout from './components/Layout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="job-offers" element={<JobOffers />} />
            <Route path="job-offers/:id" element={<JobOfferDetail />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="cv-files" element={<MyCvFiles />} />
            <Route path="users" element={<ProtectedRoute requiredRole="admin"><Users /></ProtectedRoute>} />
            <Route path="company/job-offers" element={<ProtectedRoute requiredRoles={['entreprise', 'admin']}><CompanyJobOffers /></ProtectedRoute>} />
            <Route path="company/applications" element={<ProtectedRoute requiredRole="entreprise"><CompanyApplications /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

