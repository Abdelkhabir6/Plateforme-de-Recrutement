import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const MyApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    try {
      const params = filter ? { status: filter } : {}
      const response = await axios.get('/applications', { params })
      setApplications(response.data.data.data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      reviewed: 'Examinée',
      accepted: 'Acceptée',
      rejected: 'Refusée',
    }
    return labels[status] || status
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
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes candidatures</h1>
        <p className="text-gray-600">Suivez l'état de vos candidatures</p>
      </div>

      {/* Filtre */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Filtrer par statut</label>
        <select
          className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="reviewed">Examinées</option>
          <option value="accepted">Acceptées</option>
          <option value="rejected">Refusées</option>
        </select>
      </div>

      {/* Liste des candidatures */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center border border-gray-100">
            <span className="text-6xl mb-4 block"></span>
            <p className="text-gray-600 text-lg font-medium mb-2">Aucune candidature</p>
            <Link 
              to="/job-offers" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mt-4 transition-colors duration-200"
            >
              Voir les offres d'emploi
              <span className="ml-2"></span>
            </Link>
          </div>
        ) : (
          applications.map((application) => (
            <div key={application.id} className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-medium hover:border-primary-200 transition-all duration-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors duration-200">
                    {application.job_offer?.title}
                  </h2>
                  <p className="text-lg font-semibold text-primary-600 mb-4">{application.job_offer?.company?.name}</p>
                  {application.message && (
                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">{application.message}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                      {getStatusLabel(application.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Postulé le {new Date(application.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    to={`/job-offers/${application.job_offer_id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                  >
                    Voir l'offre
                    <span className="ml-2"></span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyApplications

