import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const JobOffers = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [contractType, setContractType] = useState('')

  useEffect(() => {
    fetchOffers()
  }, [search, location, contractType])

  const fetchOffers = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (location) params.append('location', location)
      if (contractType) params.append('contract_type', contractType)

      const response = await axios.get(`/job-offers?${params.toString()}`)
      setOffers(response.data.data.data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Offres d'emploi</h1>
        <p className="section-subtitle">Trouvez l'opportunité qui correspond à votre profil</p>
      </div>

      {/* Filtres */}
      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Rechercher et filtrer</h2>
          <p className="text-sm text-gray-500">Affinez votre recherche selon vos critères</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="search"
            type="text"
            placeholder="Titre, entreprise, mots-clés..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Input
            id="location"
            type="text"
            placeholder="Ville, région..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
          <select
            className="input"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
            <option value="Temps partiel">Temps partiel</option>
          </select>
        </div>
      </Card>

      {/* Liste des offres */}
      <div className="space-y-4">
        {offers.length === 0 ? (
          <Card padding="lg">
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium mb-2">Aucune offre d'emploi trouvée</p>
              <p className="text-gray-500 text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          </Card>
        ) : (
          offers.map((offer) => (
            <Card key={offer.id} hover className="group">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <Link to={`/job-offers/${offer.id}`}>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                        {offer.title}
                      </h2>
                    </Link>
                    <p className="text-base font-semibold text-primary-600">{offer.company?.name}</p>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                    {offer.description.substring(0, 200)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {offer.location && (
                      <Badge variant="info">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {offer.location}
                      </Badge>
                    )}
                    {offer.contract_type && (
                      <Badge variant="purple">{offer.contract_type}</Badge>
                    )}
                    {offer.salary_min && offer.salary_max && (
                      <Badge variant="success">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {offer.salary_min} - {offer.salary_max} MAD
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link to={`/job-offers/${offer.id}`}>
                    <Button variant="primary" size="lg" className="w-full md:w-auto">
                      Voir détails
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default JobOffers

