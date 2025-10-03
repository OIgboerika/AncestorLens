import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Share2, 
  Download,
  Calendar,
  Clock,
  User,
  MapPin,
  Heart,
  Volume2
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'

const CulturalMemoryDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(15 * 60 + 32) // 15:32 in seconds

  // Mock memory data
  const память = {
    id: id,
    title: "The Journey West",
    description: "Grandmother's story about migrating from Eastern Nigeria to Lagos in the early 1960s. This oral history captures the challenges, hopes, and dreams of a young woman seeking better opportunities for her family.",
    uploader: "John Doe",
    uploadDate: "December 15, 2023",
    duration: "15:32",
    category: "Migration Story",
    location: "Lagos, Nigeria",
    year: "1962",
    participants: ["Grandmother Sarah", "Great Uncle Michael"],
    tags: ["Migration", "Family History", "Nigeria", "1960s"],
    transcript: "This is a transcript of the audio recording...",
    likes: 23,
    downloads: 45,
    audioUrl: "placeholder-audio.mp3"
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Placeholder for actual audio control
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
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-ancestor-dark mb-2">{память.title}</h1>
            <p className="text-gray-600">{память.category} • Uploaded by {память.uploader}</p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>{память.likes}</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Audio Player */}
        <div className="lg:col-span-2">
          <Card>
            <div className="aspect-video bg-gradient-to-br from-ancestor-primary to-ancestor-secondary rounded-lg mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-ancestor-primary" />
                  ) : (
                    <Play className="w-8 h-8 text-ancestor-primary ml-1" />
                  )}
                </button>
              </div>
              
              {/* Duration Display */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm">
                <Clock className="w-4 h-4 inline mr-2" />
                {память.duration}
              </div>
              
              {/* Play Progress */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
                <div 
                  className="h-full bg-white bg-opacity-80 transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Audio Controls */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 bg-ancestor-primary rounded-full flex items-center justify-center text-white hover:bg-ancestor-dark transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{память.duration}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full cursor-pointer">
                    <div 
                      className="h-2 bg-ancestor-primary rounded-full transition-all duration-100"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <div className="w-16 h-1 bg-gray-200 rounded-full">
                    <div className="w-12 h-1 bg-gray-600 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share Memory</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Memory Details */}
          <Card className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Memory Details</h2>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{память.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{память.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Year Recorded</p>
                    <p className="text-sm text-gray-600">{память.year}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Participants</p>
                <p className="text-sm text-gray-600">{память.participants.join(', ')}</p>
              </div>
              
              {/* Tags */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-900 mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {память.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-ancestor-light text-ancestor-primary text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upload Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Uploaded by</p>
                  <p className="text-sm text-gray-600">{память.uploader}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Upload Date</p>
                  <p className="text-sm text-gray-600">{память.uploadDate}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">{память.duration}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Engagement Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Likes</span>
                <span className="font-semibold text-gray-900">{память.likes}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Downloads</span>
                <span className="font-semibold text-gray-900">{память.downloads}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Play Count</span>
                <span className="font-semibold text-gray-900">127</span>
              </div>
            </div>
          </Card>

          {/* Related Memories */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Memories</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">Traditional Wedding Ceremony</h4>
                  <p className="text-xs text-gray-500">Aunt Sarah</p>
                  <p className="text-xs text-gray-500">22:18 • Dec 10, 2023</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">Childhood Games</h4>
                  <p className="text-xs text-gray-500">Uncle Michael</p>
                  <p className="text-xs text-gray-500">18:45 • Dec 8, 2023</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CulturalMemoryDetailsPage