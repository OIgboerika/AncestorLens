import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Mic, 
  Upload, 
  Save, 
  FileAudio,
  Calendar,
  Tag,
  MapPin,
  Clock
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'

const UploadMemoryPage = () => {
  const navigate = useNavigate()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    location: '',
    year: '',
    participants: '',
    audioFile: null,
    isPublic: false
  })

  const categories = [
    'Migration Story',
    'Cultural Event', 
    'Childhood Memory',
    'Daily Life',
    'Legend/Folklore',
    'Recipe/Food',
    'Music/Dance',
    'Family History',
    'Wedding/Union',
    'Other'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        audioFile: file
      })
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    // Start recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
    
    // Placeholder for actual recording implementation
    setTimeout(() => {
      setIsRecording(false)
      clearInterval(timer)
      setFormData({
        ...formData,
        audioFile: 'recorded-file.mp3' // Placeholder
      })
    }, 5000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Memory data:', formData)
    // Here you would save the memory
    navigate('/cultural-memories')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/cultural-memories')}
          className="inline-flex items-center text-ancestor-primary hover:text-ancestor-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cultural Memories
        </button>
        
        <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Upload Memory</h1>
        <p className="text-gray-600">Preserve family stories and traditions through audio recordings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Audio Recording Section */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Audio Recording</h2>
          
          <div className="text-center">
            {formData.audioFile ? (
              <div className="space-y-4">
                <div className="w-32 h-32 bg-gradient-to-br from-ancestor-primary to-ancestor-secondary rounded-lg mx-auto flex items-center justify-center mb-4">
                  <FileAudio className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{formData.audioFile.name || 'Recording'}</p>
                  <p className="text-sm text-gray-500">
                    {formData.audioFile.type || 'Audio file'} • 
                    {isRecording ? formatTime(recordingTime) : 'Ready to upload'}
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleStartRecording} disabled={isRecording}>
                    <Mic className="w-4 h-4 mr-2" />
                    {isRecording ? 'Recording...' : 'Record New'}
                  </Button>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <Mic className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">No audio file uploaded</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Record a new memory or upload an existing audio file
                  </p>
                </div>
                
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleStartRecording} disabled={isRecording}>
                    <Mic className="w-4 h-4 mr-2" />
                    {isRecording ? 'Recording...' : 'Record Memory'}
                  </Button>
                  
                  <Button variant="outline" onClick={() => document.getElementById('audio-upload')?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
                
                {isRecording && (
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-600">Recording in progress... {formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>
                <strong>Tip:</strong> Find a quiet place with good audio quality. 
                Ask the storyteller to speak clearly and include context about the story.
              </p>
            </div>
          </div>
        </Card>

        {/* Memory Details */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Memory Details</h2>
          
          <div className="space-y-6">
            <Input
              label="Title *"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title for this memory"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide context, background information, or summary of this memory..."
                rows={4}
                className="input-field resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Year (Optional)"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g., 1965"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Participants"
                name="participants"
                value={formData.participants}
                onChange={handleInputChange}
                placeholder="e.g., Grandmother Sarah, Uncle Michael"
              />
              
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Where did this take place?"
              />
            </div>
            
            <Input
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Add keywords separated by commas (e.g., wedding, tradition, ceremony)"
              helperText="Tags help others find and organize memories"
            />
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
              <p className="text-sm text-gray-600">Who can view this memory?</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="h-4 w-4 text-ancestor-primary focus:ring-ancestor-primary border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Make this memory visible to family members
              </label>
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            type="submit" 
            size="lg"
            className="w-full sm:w-auto flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Memory</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/cultural-memories')}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UploadMemoryPage