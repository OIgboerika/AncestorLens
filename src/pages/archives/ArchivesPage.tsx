import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Calendar, User, LayoutGrid, List, Trash2, AlertTriangle, Archive, Download, Eye } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useAuth } from '../../contexts/AuthContext'
import { archiveService } from '../../firebase/services/archiveService'

interface ArchiveItem {
  id: string | number
  title: string
  description?: string
  category?: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize?: number
  tags?: string[]
  uploadedBy: string
  uploadDate: string
}

export default function ArchivesPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [documents, setDocuments] = useState<ArchiveItem[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<ArchiveItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const categories = ['All', 'Birth Certificate', 'Death Certificate', 'Marriage Certificate', 'Graduation Certificate', 'License', 'Passport', 'Other']

  // Load realtime from Firestore if signed in; otherwise fall back to localStorage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    const loadLocal = () => {
      const saved = JSON.parse(localStorage.getItem('archives') || '[]')
      setDocuments(saved)
    }
    if (user?.uid) {
      unsubscribe = archiveService.onArchiveDocumentsChange(user.uid, (docs) => {
        try { localStorage.setItem('archives', JSON.stringify(docs)) } catch {}
        if (docs && docs.length > 0) {
          setDocuments(docs as any)
        } else {
          const saved = JSON.parse(localStorage.getItem('archives') || '[]')
          setDocuments(saved)
        }
      })
    } else {
      loadLocal()
    }
    return () => { if (unsubscribe) unsubscribe() }
  }, [user])

  const filtered = documents.filter(doc =>
    (category && category !== 'All' ? doc.category === category : true) &&
    (search ? (doc.title + (doc.description || '') + (doc.fileName || '')).toLowerCase().includes(search.toLowerCase()) : true)
  )

  // Handle delete document
  const handleDeleteDocument = async () => {
    if (!documentToDelete || !user?.uid) return
    
    setDeleting(true)
    try {
      // Delete from Firestore if signed in
      if (typeof documentToDelete.id === 'string') {
        await archiveService.deleteArchiveDocument(documentToDelete.id)
      }
      
      // Remove from local state and localStorage
      const updatedDocuments = documents.filter(d => d.id !== documentToDelete.id)
      setDocuments(updatedDocuments)
      localStorage.setItem('archives', JSON.stringify(updatedDocuments))
      
      // Close modal
      setShowDeleteModal(false)
      setDocumentToDelete(null)
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  // Open delete confirmation modal
  const openDeleteModal = (document: ArchiveItem) => {
    setDocumentToDelete(document)
    setShowDeleteModal(true)
  }

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('image')) return '🖼️'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    return '📎'
  }

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // Check if file is viewable in browser
  const isViewable = (fileType: string) => {
    return fileType.includes('pdf') || fileType.includes('image')
  }

  // Helper to generate alternative Cloudinary URLs
  const generateCloudinaryUrls = (url: string): string[] => {
    if (!url || !url.includes('cloudinary.com')) return [url]
    
    const urls: string[] = []
    
    // Extract cloud name and public_id from URL
    const cloudNameMatch = url.match(/res\.cloudinary\.com\/([^/]+)/)
    const versionMatch = url.match(/\/v(\d+)\//)
    const publicIdMatch = url.match(/\/(?:raw|image|video)\/upload(?:\/v\d+)?\/(.+)$/)
    
    if (cloudNameMatch && publicIdMatch) {
      const cloudName = cloudNameMatch[1]
      let publicId = publicIdMatch[1]
      
      // Remove file extension from public_id for raw files
      if (url.includes('/raw/upload')) {
        publicId = publicId.replace(/\.(pdf|doc|docx|xls|xlsx)$/i, '')
      }
      
      // Try different URL formats
      // Format 1: Without version, HTTPS
      urls.push(`https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`)
      
      // Format 2: Without version, HTTP
      urls.push(`http://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`)
      
      // Format 3: With transformation (fl_attachment for downloads)
      urls.push(`https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/${publicId}`)
      
      // Format 4: Original URL without version
      if (versionMatch) {
        urls.push(url.replace(/\/v\d+\//, '/'))
      }
    }
    
    // Add original URL
    urls.push(url)
    
    return [...new Set(urls)] // Remove duplicates
  }

  // Helper to handle file access with better error messages
  const handleFileAccess = async (fileUrl: string, fileName: string, action: 'view' | 'download') => {
    // Generate all possible URL formats to try
    const urlsToTry = generateCloudinaryUrls(fileUrl)
    
    console.log('Trying URLs:', urlsToTry)

    for (const url of urlsToTry) {
      try {
        const response = await fetch(url, { 
          mode: 'cors',
          credentials: 'omit',
          cache: 'no-cache'
        })
        
        console.log(`URL ${url} returned status:`, response.status)
        
        if (response.ok) {
          const blob = await response.blob()
          const objectUrl = window.URL.createObjectURL(blob)
          
          if (action === 'view') {
            window.open(objectUrl, '_blank')
            setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000)
          } else {
            const link = document.createElement('a')
            link.href = objectUrl
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000)
          }
          return true
        } else if (response.status === 401) {
          // 401 means unauthorized - file is private
          console.error(`File is private (401): ${url}`)
          continue
        }
      } catch (error) {
        console.error(`Failed to access ${url}:`, error)
        continue
      }
    }

    // If all URLs fail, show helpful error message
    alert(
      `Unable to ${action} document.\n\n` +
      `⚠️ ISSUE: File is "Blocked for delivery" in Cloudinary\n\n` +
      `This means the file cannot be accessed. Here's how to fix it:\n\n` +
      `STEP 1: Fix Upload Preset Settings\n` +
      `1. Go to Cloudinary Dashboard → Settings → Upload → Upload Presets\n` +
      `2. Click on your preset (m1_default)\n` +
      `3. Click "Show more..." to expand options\n` +
      `4. Set "Access control" to "Public"\n` +
      `5. Save the preset\n\n` +
      `STEP 2: Enable PDF/ZIP Delivery (if uploading PDFs)\n` +
      `1. Go to Cloudinary Dashboard → Settings → Security\n` +
      `2. Find "PDF and ZIP files delivery" section\n` +
      `3. Enable "Allow delivery of PDF and ZIP files"\n` +
      `4. Save settings\n\n` +
      `STEP 3: Fix Existing Files\n` +
      `⚠️ IMPORTANT: Files uploaded BEFORE these changes are still blocked.\n` +
      `Cloudinary cannot change access mode of already-uploaded files.\n\n` +
      `SOLUTION:\n` +
      `1. Delete this document from the Archives page\n` +
      `2. Re-upload it (it will now be public and accessible)\n\n` +
      `After completing all steps, new uploads will work correctly.\n\n` +
      `File URL: ${fileUrl.substring(0, 100)}...`
    )
    return false
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ancestor-dark">Archives</h1>
          <p className="text-gray-600">Store and manage important family documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-ancestor-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-ancestor-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Link to="/upload-archive">
            <Button className="flex items-center gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" /> Upload Document</Button>
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..." className="input-field pl-10" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setCategory(c)} 
              className={`px-3 py-1.5 rounded-full text-sm border ${
                category === c || (!category && c === 'All') 
                  ? 'bg-ancestor-light text-ancestor-primary border-ancestor-primary' 
                  : 'text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Display */}
      {filtered.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map(doc => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                {/* Document preview */}
                <div className="aspect-video rounded-lg bg-gradient-to-br from-ancestor-primary/10 to-ancestor-secondary/10 flex items-center justify-center relative">
                  <div className="text-6xl">{getFileIcon(doc.fileType)}</div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white text-ancestor-primary text-xs">
                    {doc.fileType.includes('pdf') ? 'PDF' : doc.fileType.includes('image') ? 'Image' : 'Document'}
                  </span>
                  {doc.fileSize && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs">
                      {formatFileSize(doc.fileSize)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ancestor-dark line-clamp-2">{doc.title}</h3>
                    <button 
                      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                      onClick={() => openDeleteModal(doc)}
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {doc.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{doc.description}</p>
                  )}
                  {doc.category && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-ancestor-light text-ancestor-primary text-xs">
                      {doc.category}
                    </span>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div className="flex items-center"><User className="w-3 h-3 mr-1" /> {doc.uploadedBy}</div>
                    <div className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {doc.uploadDate}</div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {isViewable(doc.fileType) && (
                      <button
                        onClick={() => handleFileAccess(doc.fileUrl, doc.fileName, 'view')}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" /> View
                        </Button>
                      </button>
                    )}
                    <button
                      onClick={() => handleFileAccess(doc.fileUrl, doc.fileName, 'download')}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Download
                      </Button>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(doc => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-ancestor-primary/10 to-ancestor-secondary/10 flex items-center justify-center flex-shrink-0">
                    <div className="text-4xl">{getFileIcon(doc.fileType)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-ancestor-dark mb-1">{doc.title}</h3>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{doc.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {doc.uploadedBy}</span>
                          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {doc.uploadDate}</span>
                          {doc.fileSize && <span>{formatFileSize(doc.fileSize)}</span>}
                          {doc.category && (
                            <span className="px-2 py-0.5 rounded-full bg-ancestor-light text-ancestor-primary">
                              {doc.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isViewable(doc.fileType) && (
                          <button
                            onClick={() => handleFileAccess(doc.fileUrl, doc.fileName, 'view')}
                          >
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Eye className="w-4 h-4" /> View
                            </Button>
                          </button>
                        )}
                        <button
                          onClick={() => handleFileAccess(doc.fileUrl, doc.fileName, 'download')}
                        >
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" /> Download
                          </Button>
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50"
                          onClick={() => openDeleteModal(doc)}
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents uploaded yet</h3>
          <p className="text-gray-600 mb-6">Start preserving important family documents by uploading your first archive.</p>
          <Link to="/upload-archive">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </Link>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && documentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Document</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>"{documentToDelete.title}"</strong>? 
                This will permanently remove the document from your archives.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false)
                  setDocumentToDelete(null)
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                variant="outline"
                className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                onClick={handleDeleteDocument}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Document'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

