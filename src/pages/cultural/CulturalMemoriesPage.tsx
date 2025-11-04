import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Calendar, User, MapPin, SlidersHorizontal, Image as ImageIcon, Headphones, Trash2, AlertTriangle, BookOpen } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useAuth } from '../../contexts/AuthContext'
import { culturalMemoryService } from '../../firebase/services/culturalMemoryService'

type MediaType = 'audio' | 'image'

interface MemoryItem {
  id: string | number
  title: string
  description: string
  uploadedBy: string
  uploadDate: string
  location: string
  category: string
  type: MediaType
  duration?: string
  imageUrl?: string
  images?: string[]
  audioUrl?: string
  tags: string[]
}
 

export default function CulturalMemoriesPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memoryToDelete, setMemoryToDelete] = useState<MemoryItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const categories = ['All', 'Ceremony', 'Daily Life', 'Migration', 'Folklore', 'Food', 'Music']

  // Load realtime from Firestore if signed in; otherwise fall back to localStorage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    const loadLocal = () => {
      const saved = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
      setMemories(saved)
    }
    if (user?.uid) {
      unsubscribe = culturalMemoryService.onCulturalMemoriesChange(user.uid, (docs) => {
        try { localStorage.setItem('culturalMemories', JSON.stringify(docs)) } catch {}
        if (docs && docs.length > 0) {
          setMemories(docs as any)
        } else {
          const saved = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
          setMemories(saved)
        }
      })
    } else {
      loadLocal()
    }
    return () => { if (unsubscribe) unsubscribe() }
  }, [user])

  const filtered = memories.filter(m =>
    (category && category !== 'All' ? m.category === category : true) &&
    (search ? (m.title + m.description).toLowerCase().includes(search.toLowerCase()) : true)
  )

  // Handle delete memory
  const handleDeleteMemory = async () => {
    if (!memoryToDelete || !user?.uid) return
    
    setDeleting(true)
    try {
      // Delete from Firestore if signed in
      if (typeof memoryToDelete.id === 'string') {
        await culturalMemoryService.deleteCulturalMemory(memoryToDelete.id)
      }
      
      // Remove from local state and localStorage
      const updatedMemories = memories.filter(m => m.id !== memoryToDelete.id)
      setMemories(updatedMemories)
      localStorage.setItem('culturalMemories', JSON.stringify(updatedMemories))
      
      // Close modal
      setShowDeleteModal(false)
      setMemoryToDelete(null)
    } catch (error) {
      console.error('Error deleting memory:', error)
      alert('Failed to delete memory. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  // Open delete confirmation modal
  const openDeleteModal = (memory: MemoryItem) => {
    setMemoryToDelete(memory)
    setShowDeleteModal(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ancestor-dark">Cultural Memories</h1>
          <p className="text-gray-600">Preserve and explore your family's oral traditions and visual memories</p>
        </div>
        <Link to="/upload-memory">
          <Button className="flex items-center gap-2 w-full sm:w-auto"><Plus className="w-4 h-4" /> Upload Memory</Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search memories..." className="input-field pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-sm border ${category === c || (!category && c==='All') ? 'bg-ancestor-light text-ancestor-primary border-ancestor-primary' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(m => (
            <Card key={m.id} className="hover:shadow-lg transition-shadow">
              {/* Media preview */}
              {m.type === 'audio' ? (
                <div className="aspect-video rounded-lg bg-gradient-to-br from-ancestor-primary/10 to-ancestor-secondary/10 flex items-center justify-center relative">
                  <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition">
                    <Headphones className="w-6 h-6 text-ancestor-primary" />
                  </button>
                  {m.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-xs">{m.duration}</div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white text-ancestor-primary text-xs inline-flex items-center gap-1"><Headphones className="w-3 h-3" /> Audio</span>
                </div>
              ) : (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white text-ancestor-primary text-xs inline-flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image</span>
                </div>
              )}

              {/* Info */}
              <div className="mt-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ancestor-dark line-clamp-2">{m.title}</h3>
                  <div className="relative">
                    <button 
                      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                      onClick={() => openDeleteModal(m)}
                      title="Delete memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{m.description}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {m.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-ancestor-light text-ancestor-primary text-xs">{t}</span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <div className="flex items-center"><User className="w-3 h-3 mr-1" /> {m.uploadedBy}</div>
                  <div className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {m.location}</div>
                  <div className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {m.uploadDate}</div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Link to={`/cultural-memories/${m.id}`} state={{ memory: m }} className="flex-1">
                    <Button variant="outline" className="w-full">{m.type === 'audio' ? 'Listen' : 'View'}</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No cultural memories uploaded yet</h3>
          <p className="text-gray-600 mb-6">Start preserving your family's oral traditions and visual memories by uploading your first memory.</p>
          <Link to="/upload-memory">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Memory
            </Button>
          </Link>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && memoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Memory</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>"{memoryToDelete.title}"</strong>? 
                This will permanently remove the memory from your collection.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false)
                  setMemoryToDelete(null)
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                variant="outline"
                className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                onClick={handleDeleteMemory}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Memory'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}