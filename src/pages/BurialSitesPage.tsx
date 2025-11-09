import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, MapPin, Calendar, Share2, Eye, EyeOff, X, Upload, Camera, Navigation, Trash2, AlertTriangle } from 'lucide-react'
import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'
import LeafletMap from '../components/maps/LeafletMap'
import '../styles/leaflet.css'
import { useAuth } from '../contexts/AuthContext'
import { activityService } from '../firebase/services/activityService'
import { burialSiteService, BurialSite as FirestoreBurialSite } from '../firebase/services/burialSiteService'
import { cloudinaryService } from '../services/cloudinaryService'

// Default placeholder image for burial sites without photos
const DEFAULT_BURIAL_IMAGE = '/images/burial filler image.JPG'

interface BurialSite {
  id: string | number
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
  visible?: boolean
}


const BurialSitesPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [sites, setSites] = useState<BurialSite[]>([])
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
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [siteToDelete, setSiteToDelete] = useState<BurialSite | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Load from Firestore or localStorage
  useEffect(() => {
    const loadBurialSites = async () => {
      if (!user?.uid) {
        // Fallback to localStorage if no user
        const saved = JSON.parse(localStorage.getItem('burialSites') || '[]') as BurialSite[]
        setSites(saved)
        setLoading(false)
        return
      }

      try {
        // Load from Firestore
        const firestoreSites = await burialSiteService.getBurialSites(user.uid)
        
        // Convert Firestore sites to local format
        const convertedSites: BurialSite[] = firestoreSites.map(site => ({
          id: site.id || Date.now().toString(),
          name: site.name,
          deceasedName: site.deceasedName,
          birthYear: site.birthYear,
          deathYear: site.deathYear,
          location: site.location,
          coordinates: site.coordinates,
          description: site.description,
          visitNotes: site.visitNotes,
          lastVisit: site.lastVisit,
          images: site.images,
          familyAccess: site.familyAccess,
          visible: site.visible !== undefined ? site.visible : true
        }))

        setSites(convertedSites)
      } catch (error) {
        console.error('Error loading burial sites:', error)
        // Fallback to localStorage
        const saved = JSON.parse(localStorage.getItem('burialSites') || '[]') as BurialSite[]
        setSites(saved)
      } finally {
        setLoading(false)
      }
    }

    loadBurialSites()
  }, [user?.uid])

  // Real-time updates from Firestore - DISABLED to prevent flashing
  useEffect(() => {
    if (!user?.uid) return

    // Temporarily disable real-time updates to prevent flashing
    // const unsubscribe = burialSiteService.onBurialSitesChange(user.uid, (firestoreSites) => {
    //   const convertedSites: BurialSite[] = firestoreSites.map(site => ({
    //     id: site.id || Date.now().toString(),
    //     name: site.name,
    //     deceasedName: site.deceasedName,
    //     birthYear: site.birthYear,
    //     deathYear: site.deathYear,
    //     location: site.location,
    //     coordinates: site.coordinates,
    //     description: site.description,
    //     visitNotes: site.visitNotes,
    //     lastVisit: site.lastVisit,
    //     images: site.images,
    //     familyAccess: site.familyAccess,
    //     visible: site.visible !== undefined ? site.visible : true
    //   }))
      
    //   // Only update if we don't have local changes, or merge carefully
    //   if (!hasLocalChanges) {
    //     setSites(convertedSites)
    //   } else {
    //     // Merge with existing local state to preserve visibility changes
    //     setSites(prevSites => {
    //       const mergedSites = convertedSites.map(firestoreSite => {
    //         const localSite = prevSites.find(s => s.id === firestoreSite.id)
    //         return {
    //           ...firestoreSite,
    //           visible: localSite?.visible !== undefined ? localSite.visible : firestoreSite.visible
    //         }
    //       })
    //       return mergedSites
    //     })
    //   }
    // })

    // return () => unsubscribe()
  }, [user?.uid])

  const stats = useMemo(() => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    const currentYear = new Date().getFullYear().toString()
    
    // Count all sites regardless of visibility
    const allSites = sites
    
    return {
      totalSites: allSites.length,
      visitsThisYear: allSites.filter(s => (s.lastVisit || '').includes('2024')).length,
      sitesWithPhotos: allSites.filter(s => s.images && s.images.length > 0).length,
      sitesVisitedThisMonth: allSites.filter(s => {
        const lastVisit = s.lastVisit || ''
        return lastVisit.includes(currentMonth) && lastVisit.includes(currentYear)
      }).length
    }
  }, [sites])

  const filteredSites = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    // Show all sites regardless of visibility - we'll handle visibility with blur overlay
    let filtered = sites
    
    if (q) {
      filtered = filtered.filter(s =>
        [s.name, s.deceasedName, s.location].some(val => (val || '').toLowerCase().includes(q))
      )
    }
    
    return filtered
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

  // Handle delete burial site
  const handleDeleteSite = async () => {
    if (!siteToDelete || !user?.uid) return
    
    setDeleting(true)
    try {
      // Delete from Firestore if signed in
      if (typeof siteToDelete.id === 'string') {
        await burialSiteService.deleteBurialSite(siteToDelete.id)
      }
      
      // Remove from local state and localStorage
      const updatedSites = sites.filter(s => s.id !== siteToDelete.id)
      setSites(updatedSites)
      localStorage.setItem('burialSites', JSON.stringify(updatedSites))
      
      // Close modal
      setShowDeleteModal(false)
      setSiteToDelete(null)
    } catch (error) {
      console.error('Error deleting burial site:', error)
      alert('Failed to delete burial site. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  // Open delete confirmation modal
  const openDeleteModal = (site: BurialSite) => {
    setSiteToDelete(site)
    setShowDeleteModal(true)
  }

  // Handle toggle burial site visibility
  const toggleVisibility = async (site: BurialSite) => {
    try {
      // Handle undefined visible property - treat undefined as true (visible)
      const currentVisible = site.visible !== undefined ? site.visible : true
      const newVisible = !currentVisible
      
      const updatedSites = sites.map(s => 
        s.id === site.id ? { ...s, visible: newVisible } : s
      )
      setSites(updatedSites)
      
      // Save to localStorage
      localStorage.setItem('burialSites', JSON.stringify(updatedSites))
      
      // Update Firestore if signed in and site has string ID
      if (user?.uid && typeof site.id === 'string') {
        await burialSiteService.updateBurialSite(site.id, { visible: newVisible } as Partial<FirestoreBurialSite>)
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
      alert('Failed to update visibility. Please try again.')
    }
  }

  // Handle share burial site
  const handleShareSite = async (site: BurialSite) => {
    try {
      const shareData = {
        title: `${site.name} - ${site.deceasedName}`,
        text: `${site.description || 'Burial site information'}\n\nLocation: ${site.location}\nCoordinates: ${site.coordinates.lat.toFixed(4)}°N, ${site.coordinates.lng.toFixed(4)}°E`,
        url: window.location.href
      }

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        const shareText = `${site.name} - ${site.deceasedName}\n\n${site.description || 'Burial site information'}\n\nLocation: ${site.location}\nCoordinates: ${site.coordinates.lat.toFixed(4)}°N, ${site.coordinates.lng.toFixed(4)}°E\n\n${window.location.href}`
        await navigator.clipboard.writeText(shareText)
        alert('Burial site details copied to clipboard!')
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing burial site:', error)
        // Fallback: copy to clipboard
        try {
          const shareText = `${site.name} - ${site.deceasedName}\n\n${site.description || 'Burial site information'}\n\nLocation: ${site.location}\nCoordinates: ${site.coordinates.lat.toFixed(4)}°N, ${site.coordinates.lng.toFixed(4)}°E\n\n${window.location.href}`
          await navigator.clipboard.writeText(shareText)
          alert('Burial site details copied to clipboard!')
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError)
          alert('Failed to share burial site. Please try again.')
        }
      }
    }
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    setUploadedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setEditUploadedImages(prev => [...prev, ...files])
  }

  const handleEditDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
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

  const handleSaveSite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSite.name || !newSite.deceasedName || !newSite.location) {
      alert('Please fill in Name, Deceased Name, and Location')
      return
    }
    if (!user?.uid) {
      alert('Please sign in to save burial sites')
      return
    }

    const tempId = Date.now()
    
    // OPTIMIZATION: Save to localStorage FIRST for instant feedback
    const siteData: any = {
      id: tempId,
      name: newSite.name!,
      deceasedName: newSite.deceasedName!,
      location: newSite.location!,
      coordinates: newSite.coordinates || { lat: 0, lng: 0 },
      images: [],
      familyAccess: [],
      visible: true
    }
    
    if (newSite.birthYear) siteData.birthYear = newSite.birthYear
    if (newSite.deathYear) siteData.deathYear = newSite.deathYear
    if (newSite.description) siteData.description = newSite.description
    if (newSite.visitNotes) siteData.visitNotes = newSite.visitNotes
    if (newSite.lastVisit) siteData.lastVisit = newSite.lastVisit
    
    const existingSites = JSON.parse(localStorage.getItem('burialSites') || '[]')
    existingSites.push(siteData)
    localStorage.setItem('burialSites', JSON.stringify(existingSites))
    
    // Reset form and close modal immediately
    setIsModalOpen(false)
    setNewSite({ name: '', deceasedName: '', birthYear: '', deathYear: '', location: '', coordinates: { lat: 0, lng: 0 }, description: '', visitNotes: '', lastVisit: '', images: [] })
    setUploadedImages([])
    
    alert('Burial site saved successfully!')
    
    // OPTIMIZATION: Upload images to Cloudinary and save to Firestore in parallel (non-blocking)
    Promise.all([
      // Upload images to Cloudinary in parallel (much faster than data URLs)
      uploadedImages.length > 0
        ? cloudinaryService.uploadBurialSitePhotos(uploadedImages, tempId.toString())
        : Promise.resolve([])
    ]).then(async ([imageUrls]) => {
      // Prepare Firestore data with Cloudinary URLs
      const firestoreData: Omit<FirestoreBurialSite, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        name: siteData.name,
        deceasedName: siteData.deceasedName,
        location: siteData.location,
        coordinates: siteData.coordinates,
        images: imageUrls.length > 0 ? imageUrls : (newSite.images && newSite.images.length > 0 ? newSite.images : []),
        familyAccess: [],
        visible: true
      }
      
      if (siteData.birthYear) firestoreData.birthYear = siteData.birthYear
      if (siteData.deathYear) firestoreData.deathYear = siteData.deathYear
      if (siteData.description) firestoreData.description = siteData.description
      if (siteData.visitNotes) firestoreData.visitNotes = siteData.visitNotes
      if (siteData.lastVisit) firestoreData.lastVisit = siteData.lastVisit
      
      try {
        // Save to Firestore
        const siteId = await burialSiteService.addBurialSite(user.uid, firestoreData)
        
        // Update localStorage with Firestore ID and image URLs
        const updatedSites = JSON.parse(localStorage.getItem('burialSites') || '[]')
        const siteIndex = updatedSites.findIndex((s: any) => s.id === tempId)
        if (siteIndex !== -1) {
          updatedSites[siteIndex] = { ...updatedSites[siteIndex], id: siteId, images: imageUrls.length > 0 ? imageUrls : updatedSites[siteIndex].images }
          localStorage.setItem('burialSites', JSON.stringify(updatedSites))
        }
        
        // Log activity (non-blocking)
        activityService.logBurialSiteAdded(user.uid, siteData.name, siteId).catch(() => {
          // Silently fail - activity logging is not critical
        })
      } catch (error) {
        // Update localStorage with image URLs even if Firestore fails
        if (imageUrls.length > 0) {
          const updatedSites = JSON.parse(localStorage.getItem('burialSites') || '[]')
          const siteIndex = updatedSites.findIndex((s: any) => s.id === tempId)
          if (siteIndex !== -1) {
            updatedSites[siteIndex] = { ...updatedSites[siteIndex], images: imageUrls }
            localStorage.setItem('burialSites', JSON.stringify(updatedSites))
          }
        }
      }
    }).catch(() => {
      // Silently handle errors - user already got feedback
    })
  }

  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editSite?.id || !editSite.name || !editSite.deceasedName || !editSite.location) {
      alert('Please fill in Name, Deceased Name, and Location')
      return
    }
    if (!user?.uid) {
      alert('Please sign in to update burial sites')
      return
    }

    try {
      // OPTIMIZATION: Upload new images to Cloudinary (much faster than data URLs)
      const newImageUrls = editUploadedImages.length > 0
        ? await cloudinaryService.uploadBurialSitePhotos(editUploadedImages, editSite.id.toString())
        : []
      
      // Prepare updates for Firestore
      const updates: Partial<FirestoreBurialSite> = {
        name: editSite.name,
        deceasedName: editSite.deceasedName,
        birthYear: editSite.birthYear || undefined,
        deathYear: editSite.deathYear || undefined,
        location: editSite.location,
        coordinates: editSite.coordinates || { lat: 0, lng: 0 },
        description: editSite.description || undefined,
        visitNotes: editSite.visitNotes || undefined,
        lastVisit: editSite.lastVisit || undefined,
        images: [...(editSite.images || []), ...newImageUrls] as string[]
      }

      // Update in Firestore
      await burialSiteService.updateBurialSite(editSite.id.toString(), updates)

      // Reset form
      setIsEditModalOpen(false)
      setEditSite(null)
      setEditUploadedImages([])

      alert('Burial site updated successfully!')
    } catch (error) {
      console.error('Error updating burial site:', error)
      alert('Failed to update burial site. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ancestor-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading burial sites...</p>
          </div>
        </div>
      </div>
    )
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
            <p className="text-2xl font-bold text-ancestor-accent">{stats.sitesVisitedThisMonth}</p>
            <p className="text-sm text-gray-600">Visited This Month</p>
          </div>
        </Card>
      </div>



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
        {filteredSites.map((site) => {
          const isVisible = site.visible !== undefined ? site.visible : true
          return (
            <Card key={site.id} className="hover:shadow-lg transition-shadow relative">
              {/* Top right buttons - Eye icon and Share button */}
              <div className="absolute top-4 right-4 z-20 flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleShareSite(site)}
                  className="bg-white/90 hover:bg-white shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleVisibility(site)}
                  className="bg-white/90 hover:bg-white shadow-sm"
                >
                  {isVisible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Blur overlay for hidden sites */}
              {!isVisible && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <EyeOff className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-600 font-medium">Site Hidden</p>
                    <p className="text-sm text-gray-500">Click the eye icon to show</p>
                  </div>
                </div>
              )}
              
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${!isVisible ? 'blur-sm' : ''}`}>
              {/* Site Image */}
              <div className="lg:col-span-1">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={site.images && site.images.length > 0 ? site.images[0] : DEFAULT_BURIAL_IMAGE} 
                    alt={site.name}
                    className={`w-full h-full ${site.images && site.images.length > 0 ? 'object-cover' : 'object-contain object-center bg-gray-100'}`}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_BURIAL_IMAGE
                      e.currentTarget.className = 'w-full h-full object-contain object-center bg-gray-100'
                    }}
                  />
                </div>
              </div>

              {/* Site Details */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{site.name}</h2>
                    <p className="text-lg text-gray-600 mb-2">{site.deceasedName}</p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{(site.birthYear || '—')} - {(site.deathYear || '—')}</span>
                    </div>
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
                    <Button variant="outline" size="sm" onClick={async () => {
                      const visitDate = prompt('Enter visit date (e.g., March 15, 2024):')
                      if (visitDate && user?.uid) {
                        try {
                          await burialSiteService.updateVisit(site.id.toString(), visitDate)
                          alert('Visit recorded successfully!')
                        } catch (error) {
                          console.error('Error updating visit:', error)
                          alert('Failed to record visit. Please try again.')
                        }
                      } else if (!user?.uid) {
                        alert('Please sign in to record visits')
                      }
                    }}>
                      Add Visit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                      onClick={() => openDeleteModal(site)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            </Card>
          )
        })}
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
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload photos of the burial site</p>
                      <p className="text-xs text-gray-500 mb-3">Drag & drop images here or click the button below</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        type="button"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Photos
                      </Button>
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
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Photos</h4>
                  {selectedSite.images && selectedSite.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedSite.images.map((image, index) => (
                        <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${selectedSite.name} - Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_BURIAL_IMAGE
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img 
                        src={DEFAULT_BURIAL_IMAGE} 
                        alt={`${selectedSite.name} - Default placeholder`}
                        className="w-full h-full object-contain object-center"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='60' font-family='sans-serif' font-size='14' text-anchor='middle' fill='%236b7280'%3EHeadstone%3C/text%3E%3C/svg%3E"
                        }}
                      />
                    </div>
                  )}
                </div>

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
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                      onDragOver={handleEditDragOver}
                      onDrop={handleEditDrop}
                    >
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload additional photos</p>
                        <p className="text-xs text-gray-500 mb-3">Drag & drop images here or click the button below</p>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          onChange={handleEditImageUpload} 
                          className="hidden" 
                          id="edit-image-upload" 
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          type="button"
                          onClick={() => document.getElementById('edit-image-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Photos
                        </Button>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && siteToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Burial Site</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>"{siteToDelete.name}"</strong>? 
                This will permanently remove the burial site from your collection.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteModal(false)
                  setSiteToDelete(null)
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                variant="outline"
                className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                onClick={handleDeleteSite}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Site'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BurialSitesPage