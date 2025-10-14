import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, MapPin, Calendar, Share2, Eye, X } from 'lucide-react'
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

  const handleNewSiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'lat' || name === 'lng') {
      setNewSite(prev => ({ ...prev, coordinates: { lat: name === 'lat' ? Number(value) : (prev.coordinates?.lat || 0), lng: name === 'lng' ? Number(value) : (prev.coordinates?.lng || 0) } }))
      return
    }
    setNewSite(prev => ({ ...prev, [name]: value }))
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

  const handleSaveSite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSite.name || !newSite.deceasedName || !newSite.location) {
      alert('Please fill in Name, Deceased Name, and Location')
      return
    }
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
      images: newSite.images || []
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
          <Button variant="outline">
            View Map
          </Button>
        </div>
      </Card>

      {/* Map Placeholder */}
      <Card className="mb-8">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Interactive Map</h3>
            <p className="text-gray-500 mb-4">
              Interactive map showing burial site locations
            </p>
            <Button variant="outline">
              Enable Map View
            </Button>
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
                    <Button variant="outline" size="sm" onClick={() => alert(`Viewing details for ${site.name}`)}>
                      View Details
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ancestor-dark">Add Burial Site</h3>
              <button onClick={closeModal} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
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
                  <input name="location" value={newSite.location as string} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., Abuja Central Cemetery" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Coordinates</label>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                      <input name="lat" value={newSite.coordinates?.lat ?? 0} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., 9.0765" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                      <input name="lng" value={newSite.coordinates?.lng ?? 0} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., 7.3986" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea name="description" value={newSite.description as string} onChange={handleNewSiteChange} className="input-field resize-none" rows={3} placeholder="Notes about the site..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Visit</label>
                  <input name="lastVisit" value={newSite.lastVisit as string} onChange={handleNewSiteChange} className="input-field" placeholder="e.g., March 15, 2024" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                <Button type="submit">Save Site</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BurialSitesPage