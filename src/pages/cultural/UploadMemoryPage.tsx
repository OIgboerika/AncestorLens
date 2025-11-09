import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Mic, Upload, Save, FileAudio, Image as ImageIcon, Play, Pause, X, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { activityService } from '../../firebase/services/activityService'
import { culturalMemoryService } from '../../firebase/services/culturalMemoryService'
import { cloudinaryService } from '../../services/cloudinaryService'

export default function UploadMemoryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mediaType, setMediaType] = useState<'audio' | 'image'>('audio')
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recordedChunksRef = useRef<BlobPart[]>([])
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioDuration, setAudioDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    year: '',
    location: '',
    participants: '',
    tags: ''
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [audioPreviewUrl])

  // Handle audio player events
  useEffect(() => {
    const audio = audioPlayerRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setAudioDuration(audio.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioPreviewUrl])

  const togglePlayPause = () => {
    const audio = audioPlayerRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const handleRemoveAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setCurrentTime(0)
    setAudioDuration(0)
    setAudioFile(null)
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl)
      setAudioPreviewUrl(null)
    }
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioPlayerRef.current
    if (!audio) return
    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const startRecording = async () => {
    try {
      setAudioError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const recorder = new MediaRecorder(stream)
      recordedChunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
        setAudioFile(file)
        if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
        const url = URL.createObjectURL(blob)
        setAudioPreviewUrl(url)
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(t => t.stop())
          mediaStreamRef.current = null
        }
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch (err: any) {
      console.error('Microphone access error:', err)
      setAudioError('Microphone access denied or unavailable')
    }
  }

  const stopRecording = () => {
    try {
      mediaRecorderRef.current?.stop()
    } finally {
      setIsRecording(false)
    }
  }

  const onPick = () => fileRef.current?.click()
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length) return
    if (mediaType === 'audio') {
      setAudioFile(files[0])
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
      setAudioPreviewUrl(URL.createObjectURL(files[0]))
    }
    else setImageFiles([...imageFiles, ...Array.from(files)])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    
    if (!formData.title || !formData.category) {
      alert('Please fill in Title and Category')
      return
    }

    if (mediaType === 'audio' && !audioFile) {
      alert('Please select an audio file')
      return
    }

    if (mediaType === 'image' && imageFiles.length === 0) {
      alert('Please select at least one image')
      return
    }

    setSaving(true)
    
    const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    const localId = Date.now()
    
    // OPTIMIZATION: Save to localStorage FIRST for instant feedback
    const localMemory = {
      id: localId,
      title: formData.title,
      description: formData.description,
      uploadedBy: user?.displayName || 'You',
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: formData.location || 'Unknown',
      category: formData.category,
      type: mediaType,
      duration: mediaType === 'audio' ? 'unknown' : undefined,
      imageUrl: undefined as string | undefined,
      images: undefined as string[] | undefined,
      audioUrl: undefined as string | undefined,
      tags
    }
    
    const existing = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
    existing.push(localMemory)
    localStorage.setItem('culturalMemories', JSON.stringify(existing))
    
    // Navigate immediately (optimistic navigation)
    setSaving(false)
    navigate('/cultural-memories')
    
    // OPTIMIZATION: Upload media and save to Firestore in parallel (non-blocking)
    if (user?.uid) {
      const folderId = `${localId}`
      
      Promise.all([
        // Upload images in parallel
        mediaType === 'image' && imageFiles.length > 0
          ? cloudinaryService.uploadCulturalMemoryImages(imageFiles, folderId)
          : Promise.resolve(undefined),
        // Upload audio in parallel
        mediaType === 'audio' && audioFile
          ? cloudinaryService.uploadAudio(audioFile, {
              folder: `ancestorlens/cultural-memories/${folderId}`,
              public_id: `audio-${folderId}`,
              tags: ['cultural-memory', 'audio'],
              context: { caption: 'Cultural memory audio' }
            }).then(result => result.secure_url)
          : Promise.resolve(undefined)
      ]).then(async ([imagesData, audioUrl]) => {
        const imageUrl = imagesData?.[0]
        
        // Update localStorage with media URLs
        const updatedMemories = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
        const memoryIndex = updatedMemories.findIndex((m: any) => m.id === localId)
        if (memoryIndex !== -1) {
          updatedMemories[memoryIndex] = {
            ...updatedMemories[memoryIndex],
            imageUrl,
            images: imagesData,
            audioUrl
          }
          localStorage.setItem('culturalMemories', JSON.stringify(updatedMemories))
        }
        
        // Save to Firestore
        try {
          const memoryId = await culturalMemoryService.addCulturalMemory(user.uid, {
            title: localMemory.title,
            description: localMemory.description,
            category: localMemory.category,
            type: localMemory.type,
            duration: localMemory.duration,
            imageUrl,
            images: imagesData,
            audioUrl,
            year: formData.year || undefined,
            location: localMemory.location,
            participants: formData.participants || undefined,
            tags,
            uploadedBy: user.displayName || 'You',
            uploadDate: localMemory.uploadDate,
          })
          
          // Update localStorage with Firestore ID
          const finalMemories = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
          const finalIndex = finalMemories.findIndex((m: any) => m.id === localId)
          if (finalIndex !== -1) {
            finalMemories[finalIndex] = { ...finalMemories[finalIndex], id: memoryId }
            localStorage.setItem('culturalMemories', JSON.stringify(finalMemories))
          }
          
          // Log activity (non-blocking)
          activityService.logMemoryUploaded(user.uid, localMemory.title, memoryId, mediaType).catch(() => {
            // Silently fail - activity logging is not critical
          })
        } catch (err) {
          // Silently handle errors - user already navigated away
        }
      }).catch(() => {
        // Silently handle errors - user already navigated away
      })
    } else {
      // Not signed in: use data URLs
      if (mediaType === 'image' && imageFiles.length > 0) {
        const readers = imageFiles.map((f) => new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.onerror = reject
          r.readAsDataURL(f)
        }))
        const imagesData = await Promise.all(readers)
        const updatedMemories = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
        const memoryIndex = updatedMemories.findIndex((m: any) => m.id === localId)
        if (memoryIndex !== -1) {
          updatedMemories[memoryIndex] = {
            ...updatedMemories[memoryIndex],
            imageUrl: imagesData[0],
            images: imagesData
          }
          localStorage.setItem('culturalMemories', JSON.stringify(updatedMemories))
        }
      }
      if (mediaType === 'audio' && audioFile) {
        const audioUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.onerror = reject
          r.readAsDataURL(audioFile)
        })
        const updatedMemories = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
        const memoryIndex = updatedMemories.findIndex((m: any) => m.id === localId)
        if (memoryIndex !== -1) {
          updatedMemories[memoryIndex] = { ...updatedMemories[memoryIndex], audioUrl }
          localStorage.setItem('culturalMemories', JSON.stringify(updatedMemories))
        }
      }
    }
    
    alert('Memory uploaded successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="text-ancestor-primary hover:text-ancestor-dark inline-flex items-center gap-2 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-ancestor-dark">Memory Media</h2>
            <div className="flex items-center gap-2 text-sm">
              <span 
                className={`px-3 py-1 rounded-full cursor-pointer ${mediaType==='audio' ? 'bg-ancestor-primary text-white' : 'bg-gray-100 text-gray-700'}`} 
                onClick={() => {
                  if (mediaType !== 'audio') {
                    setImageFiles([])
                    setMediaType('audio')
                  }
                }}
              >
                Audio
              </span>
              <span 
                className={`px-3 py-1 rounded-full cursor-pointer ${mediaType==='image' ? 'bg-ancestor-primary text-white' : 'bg-gray-100 text-gray-700'}`} 
                onClick={() => {
                  if (mediaType !== 'image') {
                    handleRemoveAudio()
                    setMediaType('image')
                  }
                }}
              >
                Image
              </span>
            </div>
          </div>

          {mediaType === 'audio' ? (
            <div className="space-y-4">
              {audioFile && audioPreviewUrl ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileAudio className="w-6 h-6 text-ancestor-primary" />
                      <div>
                        <p className="font-medium text-ancestor-dark">{audioFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {audioFile.size ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveAudio}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove audio"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Audio Player */}
                  <div className="space-y-3">
                    <audio ref={audioPlayerRef} src={audioPreviewUrl} preload="metadata" />
                    
                    {/* Play/Pause Button */}
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={togglePlayPause}
                        className="w-16 h-16 rounded-full bg-ancestor-primary text-white flex items-center justify-center hover:bg-ancestor-dark transition-colors shadow-lg"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8 ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <input
                        type="range"
                        min="0"
                        max={audioDuration || 0}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ancestor-primary"
                        style={{
                          background: `linear-gradient(to right, #f97316 0%, #f97316 ${(currentTime / (audioDuration || 1)) * 100}%, #e5e7eb ${(currentTime / (audioDuration || 1)) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(audioDuration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-ancestor-primary/15 to-ancestor-secondary/15 mx-auto flex items-center justify-center mb-4">
                    <Mic className="w-10 h-10 text-ancestor-primary" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {!isRecording ? (
                      <Button 
                        type="button"
                        onClick={startRecording} 
                        className="flex items-center gap-2"
                        disabled={!!audioFile}
                      >
                        <Mic className="w-4 h-4" /> Record
                      </Button>
                    ) : (
                      <Button 
                        type="button"
                        onClick={stopRecording} 
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <Mic className="w-4 h-4" /> Stop Recording
                      </Button>
                    )}
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={onPick} 
                      className="flex items-center gap-2"
                      disabled={!!audioFile || isRecording}
                    >
                      <Upload className="w-4 h-4" /> Upload File
                    </Button>
                    <input type="file" accept="audio/*" ref={fileRef} onChange={onFile} className="hidden" />
                  </div>
                  {audioError && (
                    <p className="text-sm text-red-600 mt-2">{audioError}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="w-full rounded-xl bg-gray-100 mx-auto overflow-hidden mb-4 p-4">
                {imageFiles.length ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {imageFiles.map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} alt={`img-${i}`} className="w-full h-24 object-cover rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center text-gray-400"><ImageIcon className="w-10 h-10" /></div>
                )}
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={onPick} className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Images</Button>
                <input type="file" accept="image/*" ref={fileRef} onChange={onFile} className="hidden" multiple />
              </div>
              {imageFiles.length > 0 && <p className="text-sm text-gray-600 mt-3">Selected: {imageFiles.length} image(s)</p>}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Memory Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="Give this memory a title" 
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
                <option value="Ceremony">Ceremony</option>
                <option value="Daily Life">Daily Life</option>
                <option value="Migration">Migration</option>
                <option value="Folklore">Folklore</option>
                <option value="Food">Food</option>
                <option value="Music">Music</option>
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
                placeholder="Provide context, background information, or a summary..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input 
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="e.g., 1991" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="Where was this recorded?" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
              <input 
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="e.g., Grandmother, Aunt Ngozi" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input 
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="input-field" 
                placeholder="Add comma-separated keywords" 
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/cultural-memories')}>Cancel</Button>
          <Button type="submit" className="flex items-center gap-2" disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Memory'}
          </Button>
        </div>
      </form>
    </div>
  )
}