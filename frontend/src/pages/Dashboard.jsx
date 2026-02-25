import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const Dashboard = () => {
  const { user, isAdmin, isCompany, isCandidate } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/dashboard')
      setStats(response.data.data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-xl shadow-lg p-8 text-white transition-colors duration-200">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Bienvenue, {user?.name}
        </h1>
        <p className="text-primary-100 dark:text-primary-200 text-lg">Voici un aperçu de vos activités</p>
      </div>

      {/* Statistiques Admin */}
      {isAdmin && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card hover className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Utilisateurs</h3>
              <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-blue-900 mb-1">{stats.total_users}</p>
            <p className="text-sm text-blue-600">Utilisateurs actifs</p>
          </Card>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-soft p-6 border border-purple-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Entreprises</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-purple-900">{stats.total_companies}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-soft p-6 border border-green-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">Candidats</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-green-900">{stats.total_candidates}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-soft p-6 border border-indigo-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">Offres d'emploi</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-indigo-900">{stats.total_job_offers}</p>
            <p className="text-sm font-medium text-indigo-700 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-200">
                {stats.active_job_offers} actives
              </span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-soft p-6 border border-yellow-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Candidatures</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-yellow-900">{stats.total_applications}</p>
            <p className="text-sm font-medium text-yellow-700 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-200">
                {stats.pending_applications} en attente
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Statistiques Entreprise */}
      {isCompany && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-soft p-6 border border-primary-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wide">Mes offres d'emploi</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-primary-900">{stats.total_job_offers}</p>
            <p className="text-sm font-medium text-primary-700 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-200">
                {stats.active_job_offers} actives
              </span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-soft p-6 border border-yellow-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Candidatures</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-yellow-900">{stats.total_applications}</p>
            <p className="text-sm font-medium text-yellow-700 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-200">
                {stats.pending_applications} en attente
              </span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-soft p-6 border border-green-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">Candidatures acceptées</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-green-900">{stats.accepted_applications}</p>
          </div>
        </div>
      )}

      {/* Statistiques Candidat */}
      {isCandidate && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-soft p-6 border border-blue-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Mes candidatures</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-blue-900">{stats.total_applications}</p>
            <p className="text-sm font-medium text-blue-700 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-200">
                {stats.pending_applications} en attente
              </span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-soft p-6 border border-green-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">Candidatures acceptées</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-green-900">{stats.accepted_applications}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-soft p-6 border border-purple-200 hover:shadow-medium transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">CV en ligne</h3>
              <span className="text-2xl"></span>
            </div>
            <p className="text-4xl font-bold text-purple-900">{stats.total_cv_files}</p>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Actions rapides</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Accédez rapidement aux fonctionnalités principales</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/job-offers">
            <Button variant="primary" size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Voir les offres d'emploi
            </Button>
          </Link>
          {isCandidate && (
            <>
              <Link to="/cv-files">
                <Button variant="success" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Gérer mes CV
                </Button>
              </Link>
              <Link to="/applications">
                <Button variant="primary" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Mes candidatures
                </Button>
              </Link>
            </>
          )}
          {isCompany && (
            <>
              <Link to="/company/job-offers">
                <Button variant="success" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Gérer mes offres
                </Button>
              </Link>
              <Link to="/company/applications">
                <Button variant="primary" size="lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Voir les candidatures
                </Button>
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/users">
              <Button variant="primary" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Gérer les utilisateurs
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard

