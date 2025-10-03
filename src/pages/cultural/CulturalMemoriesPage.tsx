import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Calendar,
  Clock,
  User,
  MapPin,
  Share2,
  MoreHorizontal,
  Microphone
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'

const CulturalMemoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock cultural memories data
  const memories = [
    {
      id: 1,
      title: "The Journey West",
      description: "Grandmother's story about migrating from Eastern Nigeria to Lagos",
      duration: "15:32",
      uploadedBy: "John Doe",
      uploadDate: "Dec 15, 2023",
      location: "Lagos, Nigeria",
      category: "Migration Story",
      thumbnail: "placeholder-audio-icon.jpg",
      tags: ["Migration", "Family", "History"]
    },
    {
      id: 2,
      title: "Traditional Wedding Ceremony",
      description: "Aunt Sarah shares memories of her traditional Igbo wedding",
      duration: "22:18",
      uploadedBy: "Grace Doe",
      uploadDate: "Dec 10, 2023",
      location: "Enugu, Nigeria",
      category: "Cultural Event",
      thumbnail: "placeholder-audio-icon.jpg",
      tags: ["Wedding", "Tradition", "Ceremony"]
    },
    {
      id: 3,
      title: "Childhood Games",
      description: "Uncle Michael recalls the games we played as children",
      duration: "18:45",
      uploadedBy: "David Doe",
      uploadDate: "Dec 8, 2023",
      location: "Abuja, Nigeria",
      category: "Childhood Memory",
      thumbnail: "placeholder-audio-icon.jpg",
      tags: ["Games", "Childhood", "Fun"]
    },
    {
      id: 4,
      title: "Market Stories",
      description: "Cousin Ada's stories about growing up near the local market",
      duration: "12:30",
      uploadedBy: "Sarah Doe",
      uploadDate: "Dec 5, 2023",
      location: "Onitsha, Nigeria",
      category: "Daily Life",
      thumbnail: "placeholder-audio-icon.jpg",
      tags: ["Market", "Daily Life", "Community"]
    }
  ]

  const categories = [
    "All Categories",
    "Migration Story",
    "Cultural Event", 
    "Childhood Memory",
    "Daily Life",
    "Legend/Folklore",
    "Recipe/Food",
    "Music/Dance"
  ]

  const stats = {
    totalMemories: memories.length,
    totalDuration: "68 hours",
    contributors: 4,
    recentUploads: 2
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Cultural Memories</h1>
          <p className="text-gray-600">Preserve and explore your family's oral traditions</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/upload-memory">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Upload Memory</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card hoverable={false}>
          <div className="text-center">
            <Play className="w-8 h-8 text-ancestor-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-ancestor-primary">{stats.totalMemories}</p>
            <p className="text-sm text-gray-600">Total Memories</p>
          </div>
        </Card>
        
        <Card hoverable={false}>
          <div className="text-center">
            <Clock className="w-8 h-8 text-ancestor-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-ancestor-secondary">{stats.totalDuration}</p>
            <p className="text-sm text-gray-600">Total Duration</p>
          </div>
        </Card>
        
        <Card hoverable={false}>
          <div className="text-center">
            <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.contributors}</p>
            <p className="text-sm text-gray-600">Contributors</p>
          </div>
        </Card>
        
        <Card hoverable={false}>
          <div className="text-center">
            <Calendar className="w-8 h-8 text-ancestor-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-ancestor-accent">{stats.recentUploads}</p>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="input-field">
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uploader</label>
                <select className="input-field">
                  <option value="">All Members</option>
                  <option value="john">John Doe</option>
                  <option value="grace">Grace Doe</option>
                  <option value="david">David Doe</option>
                  <option value="sarah">Sarah Doe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select className="input-field">
                  <option value="">All Locations</option>
                  <option value="lagos">Lagos</option>
                  <option value="enugu">Enugu</option>
                  <option value="abuja">Abuja</option>
                  <option value="onitsha">Onitsha</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <Card key={memory.id} className="hover:shadow-lg transition-shadow">
            {/* Audio Player Preview */}
            <div className="aspect-video bg-gradient-to-br from-ancestor-primary to-ancestor-secondary rounded-lg mb-4 flex items-center justify-center relative group">
              <div className="bg-white bg-opacity-90 rounded-full p-4">
                <Play className="w-8 h-8 text-ancestor-primary" />
              </div>
              
              {/* Duration Badge */}
              <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                {memory.duration}
              </div>
              
              {/* Quick Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                <button className="bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all">
                  <Play className="w-5 h-5 text-ancestor-primary" />
                </button>
                <button className="bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all">
                  <Share2 className="w-5 h-5 text-ancestor-primary" />
                </button>
              </div>
            </div>

            {/* Memory Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{memory.title}</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{memory.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {memory.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-ancestor-light text-ancestor-primary text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {memory.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{memory.tags.length - 2} more
                  </span>
                )}
              </div>
              
              {/* Meta Info */}
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  <span>By {memory.uploadedBy}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{memory.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Added {memory.uploadDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2">
              <Link 
                to={`/cultural-memories/${memory.id}`}
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  Listen
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {memories.length === 0 && (
        <Card className="text-center py-12">
          <Microphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No memories yet</h3>
          <p className="text-gray-600 mb-6">Start preserving your family's oral traditions by uploading your first memory.</p>
          <Link to="/upload-memory">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload First Memory
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

export default CulturalMemoriesPage