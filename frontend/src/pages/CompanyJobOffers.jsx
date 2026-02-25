import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const CompanyJobOffers = () => {
  const { isAdmin } = useAuth()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: '',
    location: '',
    contract_type: '',
    status: 'active',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      // Utiliser l'endpoint spécifique pour les offres de l'entreprise connectée
      // Cet endpoint retourne uniquement les offres de l'entreprise authentifiée
      const response = await axios.get('/my-job-offers')
      setOffers(response.data.data.data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    try {
      if (editingOffer) {
        await axios.put(`/job-offers/${editingOffer.id}`, formData)
      } else {
        await axios.post('/job-offers', formData)
      }
      fetchOffers()
      setShowModal(false)
      resetForm()
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    }
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description,
      requirements: offer.requirements || '',
      salary_min: offer.salary_min || '',
      salary_max: offer.salary_max || '',
      location: offer.location || '',
      contract_type: offer.contract_type || '',
      status: offer.status,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return

    try {
      await axios.delete(`/job-offers/${id}`)
      fetchOffers()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requirements: '',
      salary_min: '',
      salary_max: '',
      location: '',
      contract_type: '',
      status: 'active',
    })
    setEditingOffer(null)
    setErrors({})
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
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Gestion des offres d\'emploi' : 'Mes offres d\'emploi'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Gérez toutes les offres d\'emploi' : 'Gérez vos offres d\'emploi'}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="inline-flex items-center px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span className="mr-2">+</span>
            Créer une offre
          </button>
        )}
      </div>

      {/* Liste des offres */}
      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center border border-gray-100">
            <span className="text-6xl mb-4 block"></span>
            <p className="text-gray-600 text-lg font-medium">Aucune offre d'emploi</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-medium hover:border-primary-200 transition-all duration-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-gray-900">{offer.title}</h2>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      offer.status === 'active' ? 'bg-green-100 text-green-800' :
                      offer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {offer.status === 'active' && ''}
                      {offer.status === 'inactive' && ''}
                      {offer.status === 'closed' && ''}
                      {offer.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">{offer.description.substring(0, 200)}...</p>
                  <div className="flex flex-wrap gap-2">
                    {offer.location && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        <span className="mr-1"></span>
                        {offer.location}
                      </span>
                    )}
                    {offer.contract_type && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {offer.contract_type}
                      </span>
                    )}
                    {offer.salary_min && offer.salary_max && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <span className="mr-1"></span>
                        {offer.salary_min} - {offer.salary_max} MAD
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  {isAdmin && offer.company && (
                    <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium">
                      {offer.company.name}
                    </span>
                  )}
                  <button
                    onClick={() => handleEdit(offer)}
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span className="mr-2"></span>
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="inline-flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span className="mr-2"></span>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - seulement pour les entreprises (pas pour l'admin) */}
      {showModal && !isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-gray-200">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingOffer ? 'Modifier l\'offre' : 'Nouvelle offre d\'emploi'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700">Titre *</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  name="description"
                  rows="4"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exigences</label>
                <textarea
                  name="requirements"
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salaire min (MAD)</label>
                  <input
                    type="number"
                    name="salary_min"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.salary_min}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salaire max (MAD)</label>
                  <input
                    type="number"
                    name="salary_max"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.salary_max}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Localisation</label>
                  <input
                    type="text"
                    name="location"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de contrat</label>
                  <select
                    name="contract_type"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.contract_type}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Temps partiel">Temps partiel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select
                  name="status"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="closed">Fermée</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md"
                >
                  {editingOffer ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyJobOffers

