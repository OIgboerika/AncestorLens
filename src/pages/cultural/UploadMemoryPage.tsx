import { useState, useRef } from 'react'
import { ArrowLeft, Mic, Upload, Save, FileAudio, Image as ImageIcon } from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { activityService } from '../../firebase/services/activityService'
import { culturalMemoryService } from '../../firebase/services/culturalMemoryService'
import { storage } from '../../firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function UploadMemoryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mediaType, setMediaType] = useState<'audio' | 'image'>('audio')
  const [isRecording, setIsRecording] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
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

  const startRecording = () => setIsRecording(true)
  const stopRecording = () => setIsRecording(false)

  const onPick = () => fileRef.current?.click()
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length) return
    if (mediaType === 'audio') setAudioFile(files[0])
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
    // Build memory payload and persist
    let imagesData: string[] | undefined
    let imageUrl: string | undefined
    let audioUrl: string | undefined
    // If signed in, upload to Firebase Storage and use download URLs
    if (user?.uid) {
      const folderId = `${Date.now()}`
      if (mediaType === 'image' && imageFiles.length > 0) {
        const uploads = await Promise.all(imageFiles.map(async (file, idx) => {
          const objectRef = ref(storage, `users/${user.uid}/memories/${folderId}/images/${idx}-${file.name}`)
          await uploadBytes(objectRef, file)
          return await getDownloadURL(objectRef)
        }))
        imagesData = uploads
        imageUrl = uploads[0]
      }
      if (mediaType === 'audio' && audioFile) {
        const objectRef = ref(storage, `users/${user.uid}/memories/${folderId}/audio/${audioFile.name}`)
        await uploadBytes(objectRef, audioFile)
        audioUrl = await getDownloadURL(objectRef)
      }
    } else {
      // Not signed in: fallback to data URLs so the UI still works
      if (mediaType === 'image' && imageFiles.length > 0) {
        const readers = imageFiles.map((f) => new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.onerror = reject
          r.readAsDataURL(f)
        }))
        imagesData = await Promise.all(readers)
        imageUrl = imagesData[0]
      }
      if (mediaType === 'audio' && audioFile) {
        audioUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.onerror = reject
          r.readAsDataURL(audioFile)
        })
      }
    }

    const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []

    const localId = Date.now()
    const localMemory = {
      id: localId,
      title: formData.title,
      description: formData.description,
      uploadedBy: user?.displayName || 'You',
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: formData.location || 'Unknown',
      category: formData.category,
      type: mediaType,
      duration: mediaType === 'audio' ? '00:00' : undefined,
      imageUrl,
      images: imagesData,
      audioUrl,
      tags
    }

    // Persist to Firestore when signed in
    try {
      if (user?.uid) {
        const memoryId = await culturalMemoryService.addCulturalMemory(user.uid, {
          title: localMemory.title,
          description: localMemory.description,
          category: localMemory.category,
          type: localMemory.type,
          duration: localMemory.duration,
          imageUrl: localMemory.imageUrl,
          images: localMemory.images,
          audioUrl: localMemory.audioUrl,
          year: formData.year || undefined,
          location: localMemory.location,
          participants: formData.participants || undefined,
          tags,
          uploadedBy: user.displayName || 'You',
          uploadDate: localMemory.uploadDate,
        })
        // Log activity
        await activityService.logMemoryUploaded(user.uid, localMemory.title, memoryId, mediaType)
        // Cache in localStorage for instant UX
        const existing = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
        existing.push({ ...localMemory, id: memoryId })
        localStorage.setItem('culturalMemories', JSON.stringify(existing))
      } else {
        // Not signed in: keep local only
        const existing = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
        existing.push(localMemory)
        localStorage.setItem('culturalMemories', JSON.stringify(existing))
      }
    } catch (err) {
      console.error('Failed to save cultural memory:', err)
      // Fallback to local-only so the user doesn't lose work
      const existing = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
      existing.push(localMemory)
      localStorage.setItem('culturalMemories', JSON.stringify(existing))
    }
    setSaving(false)
    alert('Memory uploaded successfully!')
    navigate('/cultural-memories')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="text-ancestor-primary hover:text-ancestor-dark inline-flex items-center gap-2 mb-6"><ArrowLeft className="w-4 h-4" /> Back</button>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-ancestor-dark">Memory Media</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-3 py-1 rounded-full cursor-pointer ${mediaType==='audio' ? 'bg-ancestor-primary text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setMediaType('audio')}>Audio</span>
              <span className={`px-3 py-1 rounded-full cursor-pointer ${mediaType==='image' ? 'bg-ancestor-primary text-white' : 'bg-gray-100 text-gray-700'}`} onClick={() => setMediaType('image')}>Image</span>
            </div>
          </div>

          {mediaType === 'audio' ? (
            <div className="text-center">
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-ancestor-primary/15 to-ancestor-secondary/15 mx-auto flex items-center justify-center mb-4">
                {audioFile ? <FileAudio className="w-10 h-10 text-ancestor-primary" /> : <Mic className="w-10 h-10 text-ancestor-primary" />}
              </div>
              <div className="flex items-center justify-center gap-3">
                {!isRecording ? (
                  <Button onClick={startRecording} className="flex items-center gap-2"><Mic className="w-4 h-4" /> Record</Button>
                ) : (
                  <Button onClick={stopRecording} className="flex items-center gap-2"><Mic className="w-4 h-4" /> Stop</Button>
                )}
                <Button variant="outline" onClick={onPick} className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload File</Button>
                <input type="file" accept="audio/*" ref={fileRef} onChange={onFile} className="hidden" />
              </div>
              {audioFile && <p className="text-sm text-gray-600 mt-3">Selected: {audioFile.name}</p>}
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