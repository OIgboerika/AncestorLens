import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Camera,
  Save,
  Share2,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { familyService } from '../../firebase/services/familyService'
import { geocodingService } from '../../services/geocodingService'

interface MemberDetails {
  id: number | string
  name: string
  role: 'Living' | 'Deceased'
  birthYear?: string
  deathYear?: string
  birthPlace?: string
  deathPlace?: string
  location?: string
  city?: string
  state?: string
  country?: string
  address?: string
  coordinates?: { lat: number; lng: number }
  occupation?: string
  email?: string
  phone?: string
  bio?: string
  profileImage?: string | null
  image?: string | null
  relationship?: string
  parentId?: string | number
  heritageTags?: string[]
  relationships?: {
    father?: string
    mother?: string
    spouse?: string
    children?: string[]
  }
}

const MOCK_MEMBER: MemberDetails = {
  id: 1,
  name: 'John Doe',
  role: 'Living',
  birthYear: '1980',
  birthPlace: 'Lagos, Nigeria',
  occupation: 'Software Engineer',
  email: 'john.doe@email.com',
  phone: '+234 812 345 6789',
  address: '123 Victoria Island, Lagos, Nigeria',
  bio: 'John is a dedicated software engineer who loves technology and family.',
  profileImage: null,
  relationships: {
    father: 'Michael Doe',
    mother: 'Grace Doe',
    spouse: 'Jane Doe',
    children: ['David Doe', 'Sarah Doe']
  }
}

const FamilyMemberDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { member?: MemberDetails } }
  const [isEditing, setIsEditing] = useState(false)
  const [memberData, setMemberData] = useState<MemberDetails>(MOCK_MEMBER)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load member from navigation state, then localStorage, else mock
  useEffect(() => {
    // 1) From navigation state
    if (location.state?.member) {
      setMemberData({ ...location.state.member })
      return
    }

    // 2) From localStorage by id
    const numericId = Number(id)
    const savedMembers: MemberDetails[] = JSON.parse(localStorage.getItem('familyMembers') || '[]')
    const found = savedMembers.find(m => Number(m.id) === numericId)
    if (found) {
      setMemberData({ ...found })
      return
    }

    // 3) Fallback mock
    setMemberData(MOCK_MEMBER)
  }, [id, location.state])

  const handleEdit = () => setIsEditing(true)

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file)
      setMemberData(prev => ({ ...prev, image: dataUrl, profileImage: dataUrl }))
    } catch (err) {
      console.error('Failed to load image', err)
    }
  }

  // Geocoding functions
  const handleGeocodeAddress = async () => {
    const address = geocodingService.buildAddressString(
      memberData.city, // Now using city field
      '', // state - removed
      memberData.country,
      memberData.address
    )

    if (!address.trim()) {
      setGeocodingError('Please enter at least City, Country, or Street Address')
      return
    }

    setIsGeocoding(true)
    setGeocodingError(null)

    try {
      console.log('Attempting to geocode:', address) // Debug log
      const coordinates = await geocodingService.geocodeAddress(address)
      
      if (coordinates) {
        setMemberData(prev => ({
          ...prev,
          coordinates,
          location: address // Update the general location field
        }))
        setGeocodingError(null)
        console.log('Geocoding successful:', coordinates) // Debug log
      } else {
        setGeocodingError(`Could not find coordinates for "${address}". Try adding more specific details like city or state, or use "Use Current Location" instead.`)
      }
    } catch (error) {
      console.error('Geocoding error:', error) // Debug log
      setGeocodingError('Failed to get coordinates. Please check your internet connection and try again.')
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleUseCurrentLocation = async () => {
    setIsGeocoding(true)
    setGeocodingError(null)

    try {
      const coordinates = await geocodingService.getCurrentLocation()
      
      if (coordinates) {
        // Get address from coordinates
        const address = await geocodingService.reverseGeocode(coordinates.lat, coordinates.lng)
        
        // Extract city and country from the reverse geocoded address
        const addressParts = address?.split(',') || []
        const city = addressParts[addressParts.length - 2]?.trim() || ''
        const country = addressParts[addressParts.length - 1]?.trim() || ''
        
        setMemberData(prev => ({
          ...prev,
          coordinates,
          location: address || 'Current Location',
          city: city || prev.city, // Update city if found
          country: country || prev.country, // Update country if found
          address: prev.address || address || '' // Keep existing address or use reverse geocoded
        }))
        setGeocodingError(null)
      } else {
        setGeocodingError('Could not get your current location. Please check your browser permissions.')
      }
    } catch (error) {
      setGeocodingError('Failed to get current location. Please check your browser permissions.')
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleSave = async () => {
    try {
      // Update Firestore if we have an id string (Firestore doc id pattern)
      if (typeof memberData.id === 'string') {
        await familyService.updateFamilyMember(memberData.id, {
          name: memberData.name,
          role: memberData.role,
          birthYear: memberData.birthYear,
          deathYear: memberData.deathYear,
          birthPlace: memberData.birthPlace,
          deathPlace: memberData.deathPlace,
          location: memberData.location,
          city: memberData.city,
          state: memberData.state,
          country: memberData.country,
          address: memberData.address,
          coordinates: memberData.coordinates,
          occupation: memberData.occupation,
          email: memberData.email,
          phone: memberData.phone,
          bio: memberData.bio,
          image: memberData.image || memberData.profileImage || undefined,
          heritageTags: memberData.heritageTags || [],
        })
      }
      const all: MemberDetails[] = JSON.parse(localStorage.getItem('familyMembers') || '[]')
      const idx = all.findIndex(m => String(m.id) === String(memberData.id))
      if (idx !== -1) { all[idx] = { ...all[idx], ...memberData } }
      localStorage.setItem('familyMembers', JSON.stringify(all))
    } catch (err) {
      console.error('Failed to persist member', err)
    }
    setIsEditing(false)
    console.log('Updated member data:', memberData)
  }

  const handleDelete = async () => {
    if (!memberData?.id) return
    if (!confirm('Remove this family member from your tree? This action cannot be undone.')) return
    try {
      if (typeof memberData.id === 'string') {
        await familyService.deleteFamilyMember(memberData.id)
      }
      const all: MemberDetails[] = JSON.parse(localStorage.getItem('familyMembers') || '[]')
      const updated = all.filter(m => String(m.id) !== String(memberData.id))
      localStorage.setItem('familyMembers', JSON.stringify(updated))
      navigate('/family-tree')
    } catch (err) {
      console.error('Failed to delete member', err)
      alert('Failed to delete member')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMemberData(prev => ({ ...prev, [name]: value }))
  }

  const initials = useMemo(() => memberData.name.split(' ').map(n => n[0]).join(''), [memberData.name])

  // Calculate relationships dynamically from all family members
  const calculatedRelationships = useMemo(() => {
    const allMembers: MemberDetails[] = JSON.parse(localStorage.getItem('familyMembers') || '[]')
    const currentMember = memberData
    
    const relationships = {
      father: '',
      mother: '',
      spouse: '',
      children: [] as string[],
      siblings: [] as string[]
    }
    
    // Find father and mother - they have relationship 'Father'/'Mother' and their parentId points to current member
    // OR current member has parentId pointing to them
    const father = allMembers.find(m => 
      m.relationship === 'Father' && 
      (m.parentId === String(currentMember.id) || String(m.id) === currentMember.parentId)
    )
    
    const mother = allMembers.find(m => 
      m.relationship === 'Mother' && 
      (m.parentId === String(currentMember.id) || String(m.id) === currentMember.parentId)
    )
    
    // Find spouse - they have relationship 'Husband'/'Wife'/'Spouse' and their parentId points to current member
    const spouse = allMembers.find(m => 
      (m.relationship === 'Husband' || m.relationship === 'Wife' || m.relationship === 'Spouse') &&
      m.parentId === String(currentMember.id)
    )
    
    // Find children - their parentId points to current member and they are 'Son'/'Daughter'/'Child'
    const children = allMembers.filter(m => 
      m.parentId === String(currentMember.id) &&
      (m.relationship === 'Son' || m.relationship === 'Daughter' || m.relationship === 'Child')
    )
    
    // Find siblings - they have relationship 'Brother'/'Sister' 
    // For siblings, we need to find all members with Brother/Sister relationship
    // and exclude the current member
    const siblings = allMembers.filter(m => 
      m.id !== currentMember.id && // Don't include self
      (m.relationship === 'Brother' || m.relationship === 'Sister')
    )
    
    relationships.father = father?.name || ''
    relationships.mother = mother?.name || ''
    relationships.spouse = spouse?.name || ''
    relationships.children = children.map(c => c.name)
    relationships.siblings = siblings.map(s => s.name)
    
    // Debug logging
    console.log('Family Relationships Debug:', {
      currentMember: { id: currentMember.id, name: currentMember.name, relationship: currentMember.relationship },
      allMembers: allMembers.map(m => ({ id: m.id, name: m.name, relationship: m.relationship, parentId: m.parentId })),
      relationships,
      relationshipsCount: (
        (relationships.father ? 1 : 0) +
        (relationships.mother ? 1 : 0) +
        (relationships.spouse ? 1 : 0) +
        relationships.children.length +
        relationships.siblings.length
      )
    })
    
    return relationships
  }, [memberData.id, memberData.parentId, memberData.relationship])

  const relationshipsCount = useMemo(() => {
    return (
      (calculatedRelationships.father ? 1 : 0) +
      (calculatedRelationships.mother ? 1 : 0) +
      (calculatedRelationships.spouse ? 1 : 0) +
      calculatedRelationships.children.length +
      calculatedRelationships.siblings.length
    )
  }, [calculatedRelationships])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/family-tree')}
          className="inline-flex items-center text-ancestor-primary hover:text-ancestor-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Family Tree
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-ancestor-dark mb-2">{memberData.name}</h1>
            <p className="text-gray-600">Family Member Profile</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleEdit}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          <Button 
            variant="outline" 
            onClick={handleDelete}
            className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <span>Remove</span>
          </Button>
            <Button className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Photo and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {memberData.image || memberData.profileImage ? (
                  <img src={memberData.image || (memberData.profileImage as string)} alt={memberData.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-600 font-bold text-2xl">{initials}</span>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{memberData.name}</h2>
              <div className="flex items-center justify-center mb-4">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  memberData.role === 'Living' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-white-800'
                }`}>
                  {memberData.role}
                </span>
              </div>
              
              {isEditing && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <Button variant="outline" size="sm" className="mb-4" onClick={handlePhotoClick}>
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </>
              )}
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold text-gray-900">
                    {memberData.birthYear ? new Date().getFullYear() - parseInt(memberData.birthYear) : '—'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Relationships</p>
                  <p className="font-semibold text-gray-900">{relationshipsCount}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Family Relationships */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Relationships</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Father</span>
                <span className="text-sm font-medium text-gray-900">{calculatedRelationships.father || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mother</span>
                <span className="text-sm font-medium text-gray-900">{calculatedRelationships.mother || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Spouse</span>
                <span className="text-sm font-medium text-gray-900">{calculatedRelationships.spouse || '—'}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600">Children</span>
                <div className="mt-2 space-y-1">
                  {calculatedRelationships.children.map((child, index) => (
                    <div key={index} className="text-sm font-medium text-gray-900">• {child}</div>
                  ))}
                  {calculatedRelationships.children.length === 0 && (
                    <div className="text-sm text-gray-500">—</div>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600">Siblings</span>
                <div className="mt-2 space-y-1">
                  {calculatedRelationships.siblings.map((sibling, index) => (
                    <div key={index} className="text-sm font-medium text-gray-900">• {sibling}</div>
                  ))}
                  {calculatedRelationships.siblings.length === 0 && (
                    <div className="text-sm text-gray-500">—</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Details */}
        <div className="lg:col-span-2">
          {/* Cultural Tags */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultural Heritage Tags</h3>
            {memberData.heritageTags && memberData.heritageTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {memberData.heritageTags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs rounded-full bg-ancestor-light text-ancestor-primary">{tag}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">—</p>
            )}
          </Card>
          {/* Personal Information */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="birthYear"
                    value={memberData.birthYear || ''}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{memberData.birthYear || '—'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="occupation"
                    value={memberData.occupation || ''}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="text-gray-900">{memberData.occupation || '—'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="birthPlace"
                    value={memberData.birthPlace || ''}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {memberData.birthPlace || '—'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={memberData.location || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter current city, country"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {memberData.location || '—'}
                  </div>
                )}
              </div>
              {memberData.deathYear && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Death Year</label>
                  <p className="text-gray-900">{memberData.deathYear}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Detailed Location Information */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={memberData.city || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter city"
                  />
                ) : (
                  <p className="text-gray-900">{memberData.city || '—'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={memberData.country || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter country"
                  />
                ) : (
                  <p className="text-gray-900">{memberData.country || '—'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={memberData.address || ''}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter street address (optional)"
                  />
                ) : (
                  <p className="text-gray-900">{memberData.address || '—'}</p>
                )}
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-4 space-y-3">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGeocodeAddress}
                    disabled={isGeocoding}
                    className="flex-1"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {isGeocoding ? 'Getting Coordinates...' : 'Get Coordinates from Address'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUseCurrentLocation}
                    disabled={isGeocoding}
                    className="flex-1"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {isGeocoding ? 'Getting Location...' : 'Use Current Location'}
                  </Button>
                </div>
                
                {geocodingError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{geocodingError}</p>
                  </div>
                )}
                
                {memberData.coordinates && memberData.coordinates.lat !== 0 && memberData.coordinates.lng !== 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">
                      ✓ Coordinates found: {memberData.coordinates.lat.toFixed(6)}, {memberData.coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={memberData.phone || ''}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <span className="text-gray-900">{memberData.phone || '—'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={memberData.email || ''}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <span className="text-gray-900">{memberData.email || '—'}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={memberData.address || ''}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <span className="text-gray-900">{memberData.address || '—'}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Biography */}
          <Card>
            <h3 className="text-lg font-semibold text-ancestor-dark mb-4">Biography</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={memberData.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell us about this family member..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{memberData.bio || '—'}</p>
            )}
          </Card>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FamilyMemberDetailsPage