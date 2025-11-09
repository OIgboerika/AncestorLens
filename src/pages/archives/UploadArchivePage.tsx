import { useState, useRef } from 'react'
import { ArrowLeft, Upload, Save, FileText, X } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { activityService } from '../../firebase/services/activityService'
import { archiveService } from '../../firebase/services/archiveService'
import { cloudinaryService } from '../../services/cloudinaryService'

export default function UploadArchivePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: ''
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)

  // Accepted file types
  const acceptedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/heif',
    'image/heic',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!acceptedFileTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(pdf|jpg|jpeg|png|heif|heic|doc|docx|xls|xlsx)$/i)) {
      alert('Please select a valid file format (PDF, JPG, PNG, HEIF, DOC, DOCX, XLS, XLSX)')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    setSelectedFile(file)
    // Auto-fill title if empty
    if (!formData.title) {
      setFormData(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }))
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    
    if (!formData.title) {
      alert('Please enter a title for the document')
      return
    }

    if (!selectedFile) {
      alert('Please select a file to upload')
      return
    }

    if (!formData.category) {
      alert('Please select a category for the document')
      return
    }

    setSaving(true)
    
    const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    const localId = Date.now()
    
    try {
      // Upload file to Cloudinary FIRST
      let fileUrl: string
      if (user?.uid) {
        fileUrl = await cloudinaryService.uploadArchiveDocument(selectedFile, localId.toString())
      } else {
        // Not signed in: use data URL
        fileUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.onerror = reject
          r.readAsDataURL(selectedFile)
        })
      }
      
      // Prepare document data
      const localDocument = {
        id: localId,
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileUrl,
        tags,
        uploadedBy: user?.displayName || 'You',
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }
      
      // Save to localStorage for instant feedback
      const existing = JSON.parse(localStorage.getItem('archives') || '[]')
      existing.push(localDocument)
      localStorage.setItem('archives', JSON.stringify(existing))
      
      // Save to Firestore if signed in
      if (user?.uid) {
        const documentId = await archiveService.addArchiveDocument(user.uid, {
          title: localDocument.title,
          description: localDocument.description,
          category: localDocument.category,
          fileUrl,
          fileName: localDocument.fileName,
          fileType: localDocument.fileType,
          fileSize: localDocument.fileSize,
          tags,
          uploadedBy: user.displayName || 'You',
          uploadDate: localDocument.uploadDate,
        })
        
        // Update localStorage with Firestore ID
        const finalArchives = JSON.parse(localStorage.getItem('archives') || '[]')
        const finalIndex = finalArchives.findIndex((a: any) => a.id === localId)
        if (finalIndex !== -1) {
          finalArchives[finalIndex] = { ...finalArchives[finalIndex], id: documentId }
          localStorage.setItem('archives', JSON.stringify(finalArchives))
        }
        
        // Log activity (non-blocking)
        activityService.logArchiveUploaded(user.uid, localDocument.title, documentId).catch(() => {
          // Silently fail - activity logging is not critical
        })
      }
      
      setSaving(false)
      alert('Document uploaded successfully!')
      navigate('/archives')
    } catch (error) {
      console.error('Error uploading document:', error)
      setSaving(false)
      alert('Failed to upload document. Please try again.')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="text-ancestor-primary hover:text-ancestor-dark inline-flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Document File</h2>
          
          {selectedFile ? (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-ancestor-primary" />
                  <div>
                    <p className="font-medium text-ancestor-dark">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-ancestor-primary/15 to-ancestor-secondary/15 mx-auto flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-ancestor-primary" />
              </div>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => fileRef.current?.click()} 
                className="flex items-center gap-2 mx-auto"
              >
                <Upload className="w-4 h-4" /> Upload Document
              </Button>
              <input 
                type="file" 
                ref={fileRef} 
                onChange={handleFileSelect} 
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.heif,.heic,.doc,.docx,.xls,.xlsx,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
              <p className="text-sm text-gray-500 mt-3">
                Supported formats: PDF, JPG, PNG, HEIF, DOC, DOCX, XLS, XLSX (Max 50MB)
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Document Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="e.g., Birth Certificate - John Doe" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field" 
                required
              >
                <option value="">Select category</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Death Certificate">Death Certificate</option>
                <option value="Marriage Certificate">Marriage Certificate</option>
                <option value="Graduation Certificate">Graduation Certificate</option>
                <option value="License">License</option>
                <option value="Passport">Passport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field resize-none" 
                rows={4} 
                placeholder="Add any additional notes or context about this document..." 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input 
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="Add comma-separated keywords (e.g., important, legal, official)" 
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/archives')}>Cancel</Button>
          <Button type="submit" className="flex items-center gap-2" disabled={saving || !selectedFile}>
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Document'}
          </Button>
        </div>
      </form>
    </div>
  )
}

