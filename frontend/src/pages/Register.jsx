import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'candidat',
    phone: '',
    address: '',
  })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrors({})
    setLoading(true)

    const result = await register(formData)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
      if (result.errors) {
        setErrors(result.errors)
      }
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-2xl w-full space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">
              Recrutement
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Rejoignez notre plateforme</p>
          </Link>
        </div>

        <Card padding="lg" className="border-t-4 border-t-primary-600 dark:border-t-primary-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Inscription
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Déjà un compte ?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 underline-offset-2 hover:underline"
              >
                Connectez-vous
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="alert-error dark:bg-red-900/20 dark:border-red-600 dark:text-red-400" role="alert">
                <svg className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Nom complet"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  error={errors.name?.[0]}
                  autoComplete="name"
                  autoFocus
                />
              </div>

              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email?.[0]}
                autoComplete="email"
              />

              <div className="w-full">
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de compte <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="input"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="candidat">Candidat</option>
                  <option value="entreprise">Entreprise</option>
                </select>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password?.[0]}
                autoComplete="new-password"
                helperText="Minimum 8 caractères"
              />

              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />

              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Téléphone"
                placeholder="+33 6 12 34 56 78"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="2"
                  className="input resize-none"
                  placeholder="123 Rue de la Paix, 75001 Paris"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
              loading={loading}
            >
              S'inscrire
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
        </p>
      </div>
    </div>
  )
}

export default Register

