import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const JobOfferDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isCandidate } = useAuth()
  const [offer, setOffer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cvFiles, setCvFiles] = useState([])
  const [application, setApplication] = useState({ message: '', cv_file_id: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOffer()
    if (isCandidate) {
      fetchCvFiles()
      checkApplication()
    }
  }, [id, isCandidate])

  const fetchOffer = async () => {
    try {
      const response = await axios.get(`/job-offers/${id}`)
      setOffer(response.data.data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCvFiles = async () => {
    try {
      const response = await axios.get('/cv-files')
      setCvFiles(response.data.data.data || [])
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const checkApplication = async () => {
    try {
      const response = await axios.get('/applications', {
        params: { job_offer_id: id }
      })
      const apps = response.data.data.data || []
      if (apps.length > 0) {
        setApplication({ ...application, alreadyApplied: true })
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await axios.post('/applications', {
        job_offer_id: id,
        message: application.message,
        cv_file_id: application.cv_file_id || null,
      })
      alert('Candidature envoyée avec succès!')
      navigate('/applications')
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de l\'envoi de la candidature')
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

  if (!offer) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl mb-4 block"></span>
        <p className="text-gray-600 text-lg font-medium">Offre non trouvée</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link 
        to="/job-offers" 
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
      >
        <span className="mr-2"></span>
        Retour aux offres
      </Link>

      <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{offer.title}</h1>
          <p className="text-xl font-semibold text-primary-600 mb-6">{offer.company?.name}</p>

          <div className="flex flex-wrap gap-3">
            {offer.location && (
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <span className="mr-2"></span>
                {offer.location}
              </span>
            )}
            {offer.contract_type && (
              <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {offer.contract_type}
              </span>
            )}
            {offer.salary_min && offer.salary_max && (
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="mr-2"></span>
                {offer.salary_min} - {offer.salary_max} MAD
              </span>
            )}
          </div>
        </div>

        <div className="mb-8 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description du poste</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{offer.description}</p>
          </div>
        </div>

        {offer.requirements && (
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exigences et compétences</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{offer.requirements}</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulaire de candidature pour les candidats */}
      {isCandidate && !application.alreadyApplied && (
        <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Postuler à cette offre</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 flex items-center">
              <span className="mr-2"></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cv_file_id" className="block text-sm font-semibold text-gray-700 mb-2">
                CV (optionnel)
              </label>
              <select
                id="cv_file_id"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                value={application.cv_file_id}
                onChange={(e) => setApplication({ ...application, cv_file_id: e.target.value })}
              >
                <option value="">Sélectionner un CV</option>
                {cvFiles.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    {cv.file_name}
                  </option>
                ))}
              </select>
              <Link 
                to="/cv-files" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block transition-colors duration-200"
              >
                + Gérer mes CV
              </Link>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Message de motivation (optionnel)
              </label>
              <textarea
                id="message"
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Rédigez votre message de motivation..."
                value={application.message}
                onChange={(e) => setApplication({ ...application, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span className="mr-2"></span>
              Envoyer ma candidature
            </button>
          </form>
        </div>
      )}

      {isCandidate && application.alreadyApplied && (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-6 py-4 rounded-r-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3"></span>
            <div>
              <p className="font-semibold mb-1">Vous avez déjà postulé à cette offre</p>
              <p className="text-sm">
                Consultez vos candidatures{' '}
                <Link to="/applications" className="underline font-medium hover:text-blue-800">ici</Link>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobOfferDetail

