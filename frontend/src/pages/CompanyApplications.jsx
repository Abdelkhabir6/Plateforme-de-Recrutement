import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const CompanyApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedApplication, setSelectedApplication] = useState(null)

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/applications/${id}`, { status: newStatus })
      fetchApplications()
      setSelectedApplication(null)
    } catch (error) {
      alert('Erreur lors de la mise à jour')
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures</h1>
        <p className="text-gray-600">Gérez les candidatures reçues pour vos offres</p>
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
            <p className="text-gray-600 text-lg font-medium">Aucune candidature</p>
          </div>
        ) : (
          applications.map((application) => (
            <div key={application.id} className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-medium hover:border-primary-200 transition-all duration-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {application.candidate?.name}
                  </h2>
                  <p className="text-lg text-gray-600 mb-3">
                    Pour: <Link to={`/job-offers/${application.job_offer_id}`} className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200">
                      {application.job_offer?.title}
                    </Link>
                  </p>
                  {application.message && (
                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">{application.message}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                      {getStatusLabel(application.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Postulé le {new Date(application.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {application.cv_file && (
                    <button
                      onClick={async () => {
                        try {
                          const response = await axios.get(`/cv-files/${application.cv_file.id}/download`, {
                            responseType: 'blob',
                            headers: {
                              'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                          })
                          const url = window.URL.createObjectURL(new Blob([response.data]))
                          const link = document.createElement('a')
                          link.href = url
                          link.setAttribute('download', application.cv_file.file_name || 'cv.pdf')
                          document.body.appendChild(link)
                          link.click()
                          link.remove()
                          window.URL.revokeObjectURL(url)
                        } catch (error) {
                          alert('Erreur lors du téléchargement du CV')
                          console.error(error)
                        }
                      }}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                    >
                      <span className="mr-2"></span>
                      Télécharger le CV
                    </button>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                  >
                    <span className="mr-2"></span>
                    Modifier le statut
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de changement de statut */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Modifier le statut</h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(selectedApplication.id, status)}
                  className={`w-full text-left px-5 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedApplication.status === status
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
              <button
                onClick={() => setSelectedApplication(null)}
                className="mt-4 w-full px-5 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyApplications

