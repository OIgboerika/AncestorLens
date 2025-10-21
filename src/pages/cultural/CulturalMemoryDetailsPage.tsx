import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Share2, Download, Calendar, Clock, User, MapPin, Volume2, Image as ImageIcon, Trash2, AlertTriangle } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { culturalMemoryService } from '../../firebase/services/culturalMemoryService'
import React from 'react'

type MediaType = 'audio' | 'image'

interface MemoryItem {
  id: number | string
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
  participants?: string[]
  tags?: string[]
}

export default function CulturalMemoryDetailsPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { memory?: MemoryItem } }
  const { id } = useParams()
  const { user } = useAuth()
  const [playing, setPlaying] = useState(false)
  const memoryFromState = state?.memory as MemoryItem | undefined
  const [memory, setMemory] = useState<MemoryItem | undefined>(memoryFromState)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Load from Firestore if navigated directly
  React.useEffect(() => {
    if (!memoryFromState && user?.uid && id) {
      culturalMemoryService.getCulturalMemory(id).then(doc => {
        if (doc) setMemory(doc as any)
      }).catch(() => {})
    }
  }, [id, user, memoryFromState])

  useEffect(() => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false))
    } else {
      audioRef.current.pause()
    }
  }, [playing])

  // Gallery state for images
  const images = useMemo(() => memory?.images || (memory?.imageUrl ? [memory.imageUrl] : []), [memory])
  const [currentIdx, setCurrentIdx] = useState(0)

  // Handle download memory
  const handleDownload = async () => {
    if (!memory) return

    try {
      if (memory.type === 'audio' && memory.audioUrl) {
        // Download audio file
        const response = await fetch(memory.audioUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${memory.title}.${memory.audioUrl.split('.').pop() || 'mp3'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else if (memory.type === 'image') {
        // Download image(s)
        const images = memory.images || (memory.imageUrl ? [memory.imageUrl] : [])
        if (images.length === 1) {
          // Single image download
          const response = await fetch(images[0])
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${memory.title}.${images[0].split('.').pop() || 'jpg'}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } else if (images.length > 1) {
          // Multiple images - download as ZIP (simplified approach: download current image)
          const currentImage = images[currentIdx]
          const response = await fetch(currentImage)
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${memory.title}_${currentIdx + 1}.${currentImage.split('.').pop() || 'jpg'}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }
      }
    } catch (error) {
      console.error('Error downloading memory:', error)
      alert('Failed to download memory. Please try again.')
    }
  }

  // Handle share memory
  const handleShare = async () => {
    if (!memory) return

    try {
      const shareData = {
        title: memory.title,
        text: memory.description,
        url: window.location.href
      }

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${memory.title}\n\n${memory.description}\n\n${window.location.href}`)
        alert('Memory details copied to clipboard!')
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing memory:', error)
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(`${memory.title}\n\n${memory.description}\n\n${window.location.href}`)
          alert('Memory details copied to clipboard!')
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError)
          alert('Failed to share memory. Please try again.')
        }
      }
    }
  }

  // Handle delete memory
  const handleDeleteMemory = async () => {
    if (!memory || !user?.uid) return
    
    setDeleting(true)
    try {
      // Delete from Firestore if signed in
      if (typeof memory.id === 'string') {
        await culturalMemoryService.deleteCulturalMemory(memory.id)
      }
      
      // Remove from localStorage
      const existingMemories = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
      const updatedMemories = existingMemories.filter((m: MemoryItem) => m.id !== memory.id)
      localStorage.setItem('culturalMemories', JSON.stringify(updatedMemories))
      
      // Navigate back to memories list
      navigate('/cultural-memories')
    } catch (error) {
      console.error('Error deleting memory:', error)
      alert('Failed to delete memory. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (!memory) {
    // Fallback minimal UI if navigated directly without state
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="text-ancestor-primary hover:text-ancestor-dark inline-flex items-center gap-2 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>
        <Card>
          <div className="p-6 text-gray-700">This memory could not be loaded. Please return to the list and try again.</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="text-ancestor-primary hover:text-ancestor-dark inline-flex items-center gap-2 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            {memory.type === 'audio' ? (
              <div className="p-6">
                <div className="rounded-xl bg-gradient-to-br from-ancestor-primary/15 to-ancestor-secondary/15 aspect-video flex items-center justify-center">
                  <button onClick={() => setPlaying(p => !p)} className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition">
                    {playing ? <Pause className="w-8 h-8 text-ancestor-primary" /> : <Play className="w-8 h-8 text-ancestor-primary ml-1" />}
                  </button>
                </div>
                {memory.audioUrl && (
                  <div className="mt-4">
                    <audio ref={audioRef} src={memory.audioUrl} controls className="w-full" />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                  {images[currentIdx] ? (
                    <img src={images[currentIdx]} alt={memory.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-10 h-10" /></div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {images.map((src, i) => (
                      <button key={i} className={`h-16 rounded overflow-hidden border ${i===currentIdx ? 'border-ancestor-primary' : 'border-gray-200'}`} onClick={() => setCurrentIdx(i)}>
                        <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 px-6 pb-6">
              <h1 className="text-2xl font-bold text-ancestor-dark">{memory.title}</h1>
              <p className="text-gray-600 mt-2">{memory.description}</p>

              <div className="mt-4 flex items-center gap-2">
                <Button className="flex items-center gap-2" onClick={handleDownload}>
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-ancestor-dark mb-4">Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-400" /> Uploaded by {memory.uploadedBy}</div>
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-400" /> {memory.uploadDate}</div>
              {memory.type === 'audio' && memory.duration && (
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-400" /> {memory.duration}</div>
              )}
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" /> {memory.location}</div>
            </div>
            {(() => {
              const p: any = (memory as any).participants
              const text = Array.isArray(p) ? p.join(', ') : (typeof p === 'string' ? p : '')
              return text ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-600"><span className="font-medium text-ancestor-dark">Participants:</span> {text}</p>
                </div>
              ) : null
            })()}
            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {memory.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-ancestor-light text-ancestor-primary text-xs">{t}</span>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-ancestor-dark mb-4">Related Memories</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><Volume2 className="w-4 h-4 text-gray-500" /></div>
                <div className="flex-1">
                  <p className="font-medium text-ancestor-dark">Market Days</p>
                  <p className="text-xs text-gray-500">08:21 • Dec 29, 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center"><Volume2 className="w-4 h-4 text-gray-500" /></div>
                <div className="flex-1">
                  <p className="font-medium text-ancestor-dark">Migration West</p>
                  <p className="text-xs text-gray-500">18:03 • Nov 3, 2023</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                Are you sure you want to delete <strong>"{memory.title}"</strong>? 
                This will permanently remove the memory from your collection.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
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