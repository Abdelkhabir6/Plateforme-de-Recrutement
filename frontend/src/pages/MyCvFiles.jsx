import { useEffect, useState } from 'react'
import axios from 'axios'

const MyCvFiles = () => {
  const [cvFiles, setCvFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchCvFiles()
  }, [])

  const fetchCvFiles = async () => {
    try {
      const response = await axios.get('/cv-files')
      setCvFiles(response.data.data.data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 10MB)')
      return
    }

    const formData = new FormData()
    formData.append('cv_file', file)

    setUploading(true)
    try {
      await axios.post('/cv-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      fetchCvFiles()
      alert('CV uploadé avec succès!')
      e.target.value = '' // Reset input
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) return

    try {
      await axios.delete(`/cv-files/${id}`)
      fetchCvFiles()
      alert('CV supprimé avec succès!')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes CV</h1>
        <p className="text-gray-600">Gérez vos CV en ligne</p>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Uploader un nouveau CV</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-200">
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Upload en cours...
              </>
            ) : (
              <>
                <span className="mr-2"></span>
                Sélectionner un fichier
              </>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-600">Formats acceptés: PDF, DOC, DOCX (max 10MB)</span>
        </div>
      </div>

      {/* Liste des CV */}
      <div className="space-y-4">
        {cvFiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center border border-gray-100">
            <span className="text-6xl mb-4 block"></span>
            <p className="text-gray-600 text-lg font-medium">Aucun CV uploadé</p>
          </div>
        ) : (
          cvFiles.map((cv) => (
            <div key={cv.id} className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-medium hover:border-primary-200 transition-all duration-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2"></span>
                    {cv.file_name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <span className="mr-1"></span>
                      Taille: {formatFileSize(cv.file_size)}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1"></span>
                      Type: {cv.mime_type}
                    </span>
                    <span className="flex items-center">
                      <span className="mr-1"></span>
                      Uploadé le {new Date(cv.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    {cv.is_active && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Actif
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const response = await axios.get(`/cv-files/${cv.id}/download`, {
                          responseType: 'blob',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                          }
                        })
                        const url = window.URL.createObjectURL(new Blob([response.data]))
                        const link = document.createElement('a')
                        link.href = url
                        link.setAttribute('download', cv.file_name)
                        document.body.appendChild(link)
                        link.click()
                        link.remove()
                        window.URL.revokeObjectURL(url)
                      } catch (error) {
                        alert('Erreur lors du téléchargement du CV')
                        console.error(error)
                      }
                    }}
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <span className="mr-2"></span>
                    Télécharger
                  </button>
                  <button
                    onClick={() => handleDelete(cv.id)}
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
    </div>
  )
}

export default MyCvFiles

