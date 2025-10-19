import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, MapPin, Calendar, Share2, Eye, X, Upload, Camera, Navigation } from 'lucide-react'
import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'
import LeafletMap from '../components/maps/LeafletMap'
import '../styles/leaflet.css'
import { useAuth } from '../contexts/AuthContext'
import { activityService } from '../firebase/services/activityService'

interface BurialSite {
  id: number
  name: string
  deceasedName: string
  birthYear?: string
  deathYear?: string
  location: string
  coordinates: { lat: number; lng: number }
  description?: string
  visitNotes?: string
  lastVisit?: string
  images: string[]
  familyAccess?: string[]
}

const DEFAULT_SITES: BurialSite[] = [
  {
    id: 1,
    name: "Grandfather's Grave",
    deceasedName: 'Samuel Doe',
    birthYear: '1925',
    deathYear: '1995',
    location: 'Abuja Central Cemetery',
    coordinates: { lat: 9.0765, lng: 7.3986 },
    description: 'Final resting place of Samuel Doe, beloved grandfather',
    visitNotes: 'Well maintained plot with a beautiful headstone',
    lastVisit: 'March 15, 2024',
    images: ['placeholder-headstone-1.jpg'],
    familyAccess: ['John Doe', 'Grace Doe']
  },
  {
    id: 2,
    name: 'Family Burial Ground',
    deceasedName: 'Mary Doe',
    birthYear: '1930',
    deathYear: '2000',
    location: 'Enugu Burial Ground',
    coordinates: { lat: 6.5244, lng: 7.4951 },
    description: 'Traditional family burial site',
    visitNotes: 'Located in the eastern section of the cemetery',
    lastVisit: 'February 20, 2024',
    images: ['placeholder-headstone-2.jpg'],
    familyAccess: ['John Doe', 'Michael Doe']
  },
  {
    id: 3,
    name: "Uncle's Memorial",
    deceasedName: 'Paul Doe',
    birthYear: '1970',
    deathYear: '2020',
    location: 'Lagos Memorial Garden',
    coordinates: { lat: 6.5244, lng: 3.3792 },
    description: 'Memorial for beloved uncle who passed suddenly',
    visitNotes: 'Peaceful location with flowers',
    lastVisit: 'January 10, 2024',
    images: ['placeholder-headstone-3.jpg'],
    familyAccess: ['John Doe', 'David Doe']
  }
]

const BurialSitesPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [sites, setSites] = useState<BurialSite[]>(DEFAULT_SITES)
  const [showMap, setShowMap] = useState(false)
  const [selectedSite, setSelectedSite] = useState<BurialSite | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editSite, setEditSite] = useState<Partial<BurialSite> | null>(null)
  const [newSite, setNewSite] = useState<Partial<BurialSite>>({
    name: '',
    deceasedName: '',
    birthYear: '',
    deathYear: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    description: '',
    visitNotes: '',
    lastVisit: '',
    images: []
  })
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [editUploadedImages, setEditUploadedImages] = useState<File[]>([])
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Load from localStorage and merge with defaults
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('burialSites') || '[]') as BurialSite[]
    if (saved.length > 0) {
      const defaultIds = new Set(DEFAULT_SITES.map(s => s.id))
      const onlyNew = saved.filter(s => !defaultIds.has(s.id))
      setSites([...DEFAULT_SITES, ...onlyNew])
    } else {
      setSites(DEFAULT_SITES)
    }
  }, [])

  const stats = useMemo(() => ({
    totalSites: sites.length,
    visitsThisYear: sites.filter(s => (s.lastVisit || '').includes('2024')).length,
    sitesWithPhotos: sites.filter(s => s.images && s.images.length > 0).length,
    familyMembers: 4
  }), [sites])

  const filteredSites = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return sites
    return sites.filter(s =>
      [s.name, s.deceasedName, s.location].some(val => (val || '').toLowerCase().includes(q))
    )
  }, [searchTerm, sites])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const openDetailsModal = (site: BurialSite) => {
    setSelectedSite(site)
    setIsDetailsModalOpen(true)
  }
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedSite(null)
  }

  const openEditModal = (site: BurialSite) => {
    setEditSite({ ...site })
    setEditUploadedImages([])
    setIsEditModalOpen(true)
  }
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditSite(null)
    setEditUploadedImages([])
  }

  const handleNewSiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'lat' || name === 'lng') {
      const numValue = value === '' ? 0 : parseFloat(value)
      if (!isNaN(numValue)) {
        setNewSite(prev => ({ 
          ...prev, 
          coordinates: { 
            lat: name === 'lat' ? numValue : (prev.coordinates?.lat || 0), 
            lng: name === 'lng' ? numValue : (prev.coordinates?.lng || 0) 
          } 
        }))
      }
      return
    }
    if (name === 'location') {
      setNewSite(prev => ({ ...prev, [name]: value }))
      // Generate location suggestions
      generateLocationSuggestions(value)
      setShowSuggestions(value.length > 2)
      return
    }
    setNewSite(prev => ({ ...prev, [name]: value }))
  }

  const handleEditSiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editSite) return
    const { name, value } = e.target
    if (name === 'lat' || name === 'lng') {
      const numValue = value === '' ? 0 : parseFloat(value)
      if (!isNaN(numValue)) {
        setEditSite(prev => ({ 
          ...prev!, 
          coordinates: { 
            lat: name === 'lat' ? numValue : (prev?.coordinates?.lat || 0), 
            lng: name === 'lng' ? numValue : (prev?.coordinates?.lng || 0) 
          } 
        }))
      }
      return
    }
    setEditSite(prev => ({ ...prev!, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setEditUploadedImages(prev => [...prev, ...files])
  }

  const removeEditImage = (index: number) => {
    setEditUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Well-known cemeteries and burial sites in Nigeria
  const wellKnownLocations = [
    'Abuja Central Cemetery',
    'Lagos Memorial Garden',
    'Enugu Burial Ground',
    'Kaduna Cemetery',
    'Kano Cemetery',
    'Port Harcourt Cemetery',
    'Ibadan Cemetery',
    'Jos Cemetery',
    'Maiduguri Cemetery',
    'Calabar Cemetery',
    'Benin Cemetery',
    'Abeokuta Cemetery',
    'Warri Cemetery',
    'Uyo Cemetery',
    'Owerri Cemetery',
    'Akure Cemetery',
    'Ilorin Cemetery',
    'Bauchi Cemetery',
    'Gombe Cemetery',
    'Yola Cemetery',
    'Makurdi Cemetery',
    'Lokoja Cemetery',
    'Minna Cemetery',
    'Katsina Cemetery',
    'Sokoto Cemetery',
    'Zaria Cemetery',
    'Keffi Cemetery',
    'Nasarawa Cemetery',
    'Lafia Cemetery',
    'Dutse Cemetery',
    'Damaturu Cemetery',
    'Birnin Kebbi Cemetery',
    'Gusau Cemetery',
    'Katsina Cemetery',
    'Dutse Cemetery',
    'Jalingo Cemetery',
    'Yenagoa Cemetery',
    'Asaba Cemetery',
    'Awka Cemetery',
    'Abakaliki Cemetery',
    'Ogoja Cemetery',
    'Ikot Ekpene Cemetery',
    'Umuahia Cemetery',
    'Orlu Cemetery',
    'Nnewi Cemetery',
    'Onitsha Cemetery',
    'Aba Cemetery',
    'Umuahia Cemetery',
    'Owerri Cemetery',
    'Port Harcourt Cemetery',
    'Yenagoa Cemetery',
    'Asaba Cemetery',
    'Awka Cemetery',
    'Abakaliki Cemetery',
    'Ogoja Cemetery',
    'Ikot Ekpene Cemetery',
    'Umuahia Cemetery',
    'Orlu Cemetery',
    'Nnewi Cemetery',
    'Onitsha Cemetery',
    'Aba Cemetery'
  ]

  const generateLocationSuggestions = (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([])
      return
    }
    
    const filtered = wellKnownLocations
      .filter(location => 
        location.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5) // Limit to 5 suggestions
    
    setLocationSuggestions(filtered)
  }

  const selectLocationSuggestion = (location: string) => {
    setNewSite(prev => ({ ...prev, location }))
    setShowSuggestions(false)
    
    // Try to get coordinates for well-known locations
    const knownCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'Abuja Central Cemetery': { lat: 9.0765, lng: 7.3986 },
      'Lagos Memorial Garden': { lat: 6.5244, lng: 3.3792 },
      'Enugu Burial Ground': { lat: 6.5244, lng: 7.4951 },
      'Kaduna Cemetery': { lat: 10.5200, lng: 7.4383 },
      'Kano Cemetery': { lat: 12.0022, lng: 8.5920 },
      'Port Harcourt Cemetery': { lat: 4.8156, lng: 7.0498 },
      'Ibadan Cemetery': { lat: 7.3775, lng: 3.9470 },
      'Jos Cemetery': { lat: 9.9167, lng: 8.9000 },
      'Maiduguri Cemetery': { lat: 11.8333, lng: 13.1500 },
      'Calabar Cemetery': { lat: 4.9500, lng: 8.3167 }
    }
    
    if (knownCoordinates[location]) {
      setNewSite(prev => ({ 
        ...prev, 
        coordinates: knownCoordinates[location] 
      }))
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    setIsGettingLocation(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setNewSite(prev => ({ 
          ...prev, 
          coordinates: { lat: latitude, lng: longitude } 
        }))
        setIsGettingLocation(false)
        
        // Reverse geocoding to get location name
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(response => response.json())
          .then(data => {
            if (data.city && data.principalSubdivision) {
              const locationName = `${data.city}, ${data.principalSubdivision}`
              setNewSite(prev => ({ ...prev, location: locationName }))
            }
          })
          .catch(() => {
            // Fallback if reverse geocoding fails
            setNewSite(prev => ({ 
              ...prev, 
              location: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})` 
            }))
          })
      },
      (error) => {
        setIsGettingLocation(false)
        console.error('Error getting location:', error)
        alert('Unable to retrieve your location. Please check your browser permissions.')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  const handleMapClick = (lat: number, lng: number) => {
    setNewSite(prev => ({ ...prev, coordinates: { lat, lng } }))
  }

  const handleMarkerClick = (siteId: string) => {
    const site = sites.find(s => s.id.toString() === siteId)
    if (site) {
      setSelectedSite(site)
    }
  }

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSite.name || !newSite.deceasedName || !newSite.location) {
      alert('Please fill in Name, Deceased Name, and Location')
      return
    }
    const imageUrls = await Promise.all(uploadedImages.map(fileToDataUrl))
    const payload: BurialSite = {
      id: Date.now(),
      name: newSite.name!,
      deceasedName: newSite.deceasedName!,
      birthYear: newSite.birthYear || undefined,
      deathYear: newSite.deathYear || undefined,
      location: newSite.location!,
      coordinates: newSite.coordinates || { lat: 0, lng: 0 },
      description: newSite.description || undefined,
      visitNotes: newSite.visitNotes || undefined,
      lastVisit: newSite.lastVisit || undefined,
      images: (newSite.images && newSite.images.length > 0) ? newSite.images : imageUrls
    }

    const existing = JSON.parse(localStorage.getItem('burialSites') || '[]') as BurialSite[]
    existing.push(payload)
    localStorage.setItem('burialSites', JSON.stringify(existing))

    // Log activity
    if (user?.uid) {
      activityService.logBurialSiteAdded(user.uid, payload.name, payload.id.toString())
    }

    setSites(prev => [...prev, payload])
    setIsModalOpen(false)
    setNewSite({ name: '', deceasedName: '', birthYear: '', deathYear: '', location: '', coordinates: { lat: 0, lng: 0 }, description: '', visitNotes: '', lastVisit: '', images: [] })
    setUploadedImages([])
  }

  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editSite?.id || !editSite.name || !editSite.deceasedName || !editSite.location) {
      alert('Please fill in Name, Deceased Name, and Location')
      return
    }
    const newImageUrls = await Promise.all(editUploadedImages.map(fileToDataUrl))
    const updated: BurialSite = {
      id: Number(editSite.id),
      name: editSite.name,
      deceasedName: editSite.deceasedName,
      birthYear: editSite.birthYear || undefined,
      deathYear: editSite.deathYear || undefined,
      location: editSite.location,
      coordinates: editSite.coordinates || { lat: 0, lng: 0 },
      description: editSite.description || undefined,
      visitNotes: editSite.visitNotes || undefined,
      lastVisit: editSite.lastVisit || undefined,
      images: [...(editSite.images || []), ...newImageUrls]
    }

    const updatedSites = sites.map(s => s.id === updated.id ? updated : s)
    setSites(updatedSites)
    localStorage.setItem('burialSites', JSON.stringify(updatedSites.filter(s => !DEFAULT_SITES.some(ds => ds.id === s.id))))

    setIsEditModalOpen(false)
    setEditSite(null)
    setEditUploadedImages([])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ancestor-dark mb-2">Burial Sites</h1>
          <p className="text-gray-600">Map and preserve ancestral burial locations</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setShowMap(!showMap)} 
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <MapPin className="w-4 h-4" />
            <span>{showMap ? 'List View' : 'Map View'}</span>
          </Button>
          <Button className="flex items-center space-x-2 w-full sm:w-auto" onClick={openModal}>
            <Plus className="w-4 h-4" />
            <span>Add Site</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card hoverable={false}>
          <div className="text-center">
            <MapPin className="w-8 h-8 text-ancestor-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-ancestor-primary">{stats.totalSites}</p>
            <p className="text-sm text-gray-600">Total Sites</p>
          </div>
        </Card>
        <Card hoverable={false}>
          <div className="text-center">
            <Calendar className="w-8 h-8 text-ancestor-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-ancestor-secondary">{stats.visitsThisYear}</p>
            <p className="text-sm text-gray-600">Visits This Year</p>
          </div>
        </Card>
        <Card hoverable={false}>
          <div className="text-center">
            <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.sitesWithPhotos}</p>
            <p className="text-sm text-gray-600">With Photos</p>
          </div>
        </Card>
        <Card hoverable={false}>
          <div className="text-center">
            <Calendar className="w-8 h-8 text-ancestor-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-ancestor-accent">{stats.familyMembers}</p>
            <p className="text-sm text-gray-600">Family Members</p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search burial sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </Card>


      {/* Map or List View */}
      {showMap ? (
        <Card className="mb-8">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-ancestor-dark mb-4">Burial Sites Map</h3>
            <LeafletMap
              center={[9.0765, 7.3986]} // Default to Abuja, Nigeria
              zoom={10}
              markers={sites.map(site => ({
                id: site.id.toString(),
                position: [site.coordinates.lat, site.coordinates.lng],
                title: site.name,
                description: `${site.deceasedName} (${site.birthYear || 'Unknown'} - ${site.deathYear || 'Unknown'})`
              }))}
              onMarkerClick={handleMarkerClick}
              height="500px"
            />
            {selectedSite && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{selectedSite.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedSite.deceasedName}</p>
                <p className="text-sm text-gray-500">{selectedSite.location}</p>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search burial sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9"
              />
            </div>
          </div>

          {/* Burial Sites List */}
          <div className="space-y-6">
        {filteredSites.map((site) => (
          <Card key={site.id} className="hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Site Image */}
              <div className="lg:col-span-1">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={site.images[0] || ''} 
                    alt={site.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='60' font-family='sans-serif' font-size='14' text-anchor='middle' fill='%236b7280'%3EHeadstone%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>
              </div>

              {/* Site Details */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{site.name}</h2>
                    <p className="text-lg text-gray-600 mb-2">{site.deceasedName}</p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{(site.birthYear || '—')} - {(site.deathYear || '—')}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location Details</h4>
                    <p className="text-sm text-gray-600 flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{site.location}</span>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Last Visit</h4>
                    <p className="text-sm text-gray-600">{site.lastVisit || '—'}</p>
                  </div>
                </div>

                {site.description && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{site.description}</p>
                  </div>
                )}

                {site.visitNotes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Visit Notes</h4>
                    <p className="text-sm text-gray-600">{site.visitNotes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                      Coordinates: {site.coordinates.lat.toFixed(4)}°N, {site.coordinates.lng.toFixed(4)}°E
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openDetailsModal(site)}>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditModal(site)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      const visitDate = prompt('Enter visit date (e.g., March 15, 2024):')
                      if (visitDate) {
                        const updatedSites = sites.map(s => 
                          s.id === site.id ? { ...s, lastVisit: visitDate } : s
                        )
                        setSites(updatedSites)
                        localStorage.setItem('burialSites', JSON.stringify(updatedSites.filter(s => !DEFAULT_SITES.some(ds => ds.id === s.id))))
                        alert('Visit recorded successfully!')
                      }
                    }}>
                      Add Visit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredSites.length === 0 && (
        <Card className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No burial sites mapped yet</h3>
          <p className="text-gray-600 mb-6">Start preserving ancestral burial locations by adding your first site.</p>
          <Button onClick={openModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Burial Site
          </Button>
        </Card>
      )}
        </>
      )}

      {/* Add Site Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ancestor-dark">Add Burial Site</h3>
              <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveSite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name *</label>
                  <input name="name" value={newSite.name as string} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., Grandfather's Grave" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deceased Name *</label>
                  <input name="deceasedName" value={newSite.deceasedName as string} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., Samuel Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year</label>
                  <input name="birthYear" value={newSite.birthYear as string} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., 1925" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Death Year</label>
                  <input name="deathYear" value={newSite.deathYear as string} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., 1995" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <div className="relative">
                    <input 
                      name="location" 
                      value={newSite.location as string} 
                      onChange={handleNewSiteChange} 
                      className="input-field pr-20" 
                      placeholder="e.g., Abuja Central Cemetery" 
                      required 
                      onFocus={() => setShowSuggestions(Boolean(newSite.location && newSite.location.length > 2))}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      {isGettingLocation ? 'Getting...' : 'Current'}
                    </Button>
                    
                    {/* Location Suggestions Dropdown */}
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {locationSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            onClick={() => selectLocationSuggestion(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Coordinates</label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                      <input 
                        name="lat" 
                        value={newSite.coordinates?.lat || ''} 
                        onChange={handleNewSiteChange} 
                        className="input-field" 
                        placeholder="e.g., 9.0765" 
                        type="number"
                        step="any"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                      <input 
                        name="lng" 
                        value={newSite.coordinates?.lng || ''} 
                        onChange={handleNewSiteChange} 
                        className="input-field" 
                        placeholder="e.g., 7.3986" 
                        type="number"
                        step="any"
                      />
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <LeafletMap
                      center={[newSite.coordinates?.lat || 9.0765, newSite.coordinates?.lng || 7.3986]}
                      zoom={15}
                      onMapClick={handleMapClick}
                      height="300px"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Click on the map to set coordinates</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload photos of the burial site</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" type="button">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Photos
                        </Button>
                      </label>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Selected photos:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea name="description" value={newSite.description as string} onChange={handleNewSiteChange} className="input-field resize-none" rows={3} placeholder="Notes about the site..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Visit</label>
                  <input name="lastVisit" value={newSite.lastVisit as string} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., March 15, 2024" />
                </div>
              </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                  <Button type="submit">Save Site</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Site Details Modal */}
      {isDetailsModalOpen && selectedSite && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={closeDetailsModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ancestor-dark">Burial Site Details</h3>
              <button onClick={closeDetailsModal} className="p-1 rounded hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => selectedSite && openEditModal(selectedSite)}>Edit</Button>
                </div>
                {/* Site Images */}
                {selectedSite.images && selectedSite.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Photos</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedSite.images.map((image, index) => (
                        <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${selectedSite.name} - Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='60' font-family='sans-serif' font-size='14' text-anchor='middle' fill='%236b7280'%3EHeadstone%3C/text%3E%3C/svg%3E"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Site Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Site Name</h4>
                    <p className="text-gray-900">{selectedSite.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Deceased Name</h4>
                    <p className="text-gray-900">{selectedSite.deceasedName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Birth Year</h4>
                    <p className="text-gray-900">{selectedSite.birthYear || 'Unknown'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Death Year</h4>
                    <p className="text-gray-900">{selectedSite.deathYear || 'Unknown'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
                    <p className="text-gray-900">{selectedSite.location}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Coordinates</h4>
                    <p className="text-gray-900">
                      {selectedSite.coordinates.lat.toFixed(4)}°N, {selectedSite.coordinates.lng.toFixed(4)}°E
                    </p>
                  </div>
                  {selectedSite.description && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p className="text-gray-900">{selectedSite.description}</p>
                    </div>
                  )}
                  {selectedSite.visitNotes && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Visit Notes</h4>
                      <p className="text-gray-900">{selectedSite.visitNotes}</p>
                    </div>
                  )}
                  {selectedSite.lastVisit && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Last Visit</h4>
                      <p className="text-gray-900">{selectedSite.lastVisit}</p>
                    </div>
                  )}
                </div>

                {/* Map */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Location Map</h4>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <LeafletMap
                      center={[selectedSite.coordinates.lat, selectedSite.coordinates.lng]}
                      zoom={15}
                      markers={[{
                        id: selectedSite.id.toString(),
                        position: [selectedSite.coordinates.lat, selectedSite.coordinates.lng],
                        title: selectedSite.name,
                        description: `${selectedSite.deceasedName} (${selectedSite.birthYear || 'Unknown'} - ${selectedSite.deathYear || 'Unknown'})`
                      }]}
                      height="300px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Site Modal */}
      {isEditModalOpen && editSite && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40" onClick={closeEditModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ancestor-dark">Edit Burial Site</h3>
              <button onClick={closeEditModal} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateSite} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Name *</label>
                    <input name="name" value={editSite.name as string} onChange={handleEditSiteChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deceased Name *</label>
                    <input name="deceasedName" value={editSite.deceasedName as string} onChange={handleEditSiteChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year</label>
                    <input name="birthYear" value={editSite.birthYear as string} onChange={handleEditSiteChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Death Year</label>
                    <input name="deathYear" value={editSite.deathYear as string} onChange={handleEditSiteChange} className="input-field" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input name="location" value={editSite.location as string} onChange={handleEditSiteChange} className="input-field" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location Coordinates</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                        <input 
                          name="lat" 
                          value={editSite.coordinates?.lat || ''} 
                          onChange={handleEditSiteChange} 
                          className="input-field" 
                          type="number"
                          step="any"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                        <input 
                          name="lng" 
                          value={editSite.coordinates?.lng || ''} 
                          onChange={handleEditSiteChange} 
                          className="input-field" 
                          type="number"
                          step="any"
                        />
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <LeafletMap
                        center={[editSite.coordinates?.lat || 9.0765, editSite.coordinates?.lng || 7.3986]}
                        zoom={15}
                        onMapClick={(lat, lng) => setEditSite(prev => ({ ...prev!, coordinates: { lat, lng } }))}
                        height="300px"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click on the map to set coordinates</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload additional photos</p>
                        <input type="file" multiple accept="image/*" onChange={handleEditImageUpload} className="hidden" id="edit-image-upload" />
                        <label htmlFor="edit-image-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm" type="button"><Upload className="w-4 h-4 mr-2" />Choose Photos</Button>
                        </label>
                      </div>
                      {(editSite.images && editSite.images.length > 0) && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Existing photos:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {editSite.images!.map((src, index) => (
                              <div key={index} className="relative">
                                <img src={src} alt={`Existing ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {editUploadedImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">New photos to add:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {editUploadedImages.map((file, index) => (
                              <div key={index} className="relative">
                                <img src={URL.createObjectURL(file)} alt={`New ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                                <button type="button" onClick={() => removeEditImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea name="description" value={editSite.description as string} onChange={handleEditSiteChange} className="input-field resize-none" rows={3} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visit Notes</label>
                    <textarea name="visitNotes" value={editSite.visitNotes as string} onChange={handleEditSiteChange} className="input-field resize-none" rows={2} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Visit</label>
                    <input name="lastVisit" value={editSite.lastVisit as string} onChange={handleEditSiteChange} className="input-field" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button type="button" variant="outline" onClick={closeEditModal}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BurialSitesPage