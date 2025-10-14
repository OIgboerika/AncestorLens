import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Camera, 
  UserPlus, 
  Users,
  Calendar,
  MapPin,
  Upload,
  X
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import { useAuth } from '../../contexts/AuthContext'
import { familyService } from '../../firebase/services/familyService'
import { activityService } from '../../firebase/services/activityService'
import { cloudinaryService } from '../../services/cloudinaryService'

const FamilyTreeBuilderPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    deathPlace: '',
    occupation: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    relationship: '',
    parentId: '',
    profileImage: null as File | null,
  })

  const [relationships] = useState([
    'Self',
    'Grandfather', 'Grandmother', 'Father', 'Mother', 'Brother', 'Sister',
    'Uncle', 'Aunt', 'Cousin', 'Son', 'Daughter', 'Grandson', 'Granddaughter',
    'Nephew', 'Niece', 'Husband', 'Partner', 'Other'
  ])

  // Dynamic parent options from saved members
  const [parentOptions, setParentOptions] = useState<Array<{ id: string | number; name: string; role: string; relationship: string }>>([])

  useEffect(() => {
    const loadParents = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('familyMembers') || '[]') as any[]
        // Load all existing family members as potential parents
        const options = (saved || []).map(m => ({ 
          id: m.id, 
          name: m.name, 
          role: m.relationship,
          relationship: m.relationship 
        }))
        setParentOptions(options)
      } catch (e) {
        setParentOptions([])
      }
    }
    loadParents()
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'familyMembers') loadParents()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Heritage tags state
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const suggested = [
    'Maasai','Yoruba','Asante','Zulu','Igbo','Hausa','Amhara','Xhosa','Elder','Storyteller','Lineage Keeper','Community Leader','Artisan','Warrior','Healer','Spiritual Guide','Historian','Poet','Musician','Educator','Innovator','Youth Ambassador'
  ]

  const addTag = (value: string) => {
    const v = value.trim()
    if (!v) return
    if (tags.includes(v)) return
    setTags([...tags, v])
    setNewTag('')
  }
  const removeTag = (value: string) => setTags(tags.filter(t => t !== value))
  const toggleSuggested = (value: string) => tags.includes(value) ? removeTag(value) : addTag(value)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        profileImage: file
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.relationship) {
      alert('Please fill in all required fields (First Name, Last Name, and Relationship)')
      return
    }
    
    const payload = { 
      ...formData, 
      heritageTags: tags,
      id: Date.now(), // temporary; may be replaced by Firestore id
      name: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim(),
      role: formData.deathDate ? 'Deceased' : 'Living',
      birthYear: formData.birthDate ? new Date(formData.birthDate).getFullYear().toString() : '',
      deathYear: formData.deathDate ? new Date(formData.deathDate).getFullYear().toString() : '',
      location: formData.birthPlace || 'Unknown',
      image: undefined as string | undefined
    }
    
    // Persist to Firestore when signed in
    // Upload image to Cloudinary and get URL
    let imageUrl: string | undefined = undefined
    try {
      if (formData.profileImage) {
        // Upload to Cloudinary for better performance and optimization
        imageUrl = await cloudinaryService.uploadFamilyMemberPhoto(formData.profileImage, payload.id.toString())
      }
      if (user?.uid) {
        const firestoreId = await familyService.addFamilyMember(user.uid, {
          name: payload.name,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName || undefined,
          role: formData.deathDate ? 'Deceased' : 'Living',
          birthYear: payload.birthYear || undefined,
          deathYear: payload.deathYear || undefined,
          birthDate: formData.birthDate || undefined,
          deathDate: formData.deathDate || undefined,
          birthPlace: formData.birthPlace || undefined,
          deathPlace: formData.deathPlace || undefined,
          location: payload.location || undefined,
          relationship: formData.relationship,
          gender: formData.gender || undefined,
          occupation: formData.occupation || undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          bio: formData.bio || undefined,
          image: imageUrl,
          heritageTags: tags,
          parentId: formData.parentId || undefined,
          hasChildren: undefined,
          hasParents: undefined,
        })
        payload.id = Number(firestoreId)
        if (imageUrl) payload.image = imageUrl
      }
    } catch (err) {
      console.error('Failed to save to Firestore, falling back to localStorage', err)
      // Fallback to data URL if Cloudinary fails
      if (formData.profileImage && !imageUrl) {
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(formData.profileImage as File)
        })
        payload.image = imageUrl
      }
    }

    // Store in localStorage as local cache
    const existingMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]')
    existingMembers.push({ ...payload, image: imageUrl || payload.image })
    localStorage.setItem('familyMembers', JSON.stringify(existingMembers))
    
    console.log('Family Tree Builder - Saved payload:', payload)
    console.log('Family Tree Builder - All members:', existingMembers)
    
    // Log activity
    if (user?.uid) {
      activityService.logFamilyMemberAdded(user.uid, payload.name, payload.id.toString())
    }
    
    console.log('Family member added:', payload)
    alert('Family member added successfully!')
    navigate('/family-tree')
  }

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
        
        <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Add Family Member</h1>
        <p className="text-gray-600">Create a new profile for a family member</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo Section */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Profile Photo</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              {formData.profileImage ? (
                <img 
                  src={URL.createObjectURL(formData.profileImage)} 
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ancestor-primary file:text-white hover:file:bg-ancestor-dark"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Basic Information</h2>
          
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="First Name *"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              required
            />
            
            <Input
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              placeholder="Enter middle name"
            />
            
            <Input
              label="Last Name *"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              required
            />
          </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <Input
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              placeholder="Enter occupation"
            />
          </div>
        </Card>

        {/* African Heritage Tags */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-2">African Heritage Tags</h2>
          <p className="text-sm text-gray-600 mb-4">Select relevant cultural tags or add your own.</p>

          {/* Selected tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(t => (
                <span key={t} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ancestor-light text-ancestor-primary text-sm">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="text-ancestor-primary/80 hover:text-ancestor-primary">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add tag input */}
          <div className="flex items-center gap-2 mb-4">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(newTag) } }}
              placeholder="Add a tag"
              className="input-field max-w-xs"
            />
            <Button type="button" variant="outline" onClick={() => addTag(newTag)}>Add Tag</Button>
          </div>

          {/* Suggested */}
          <div className="flex flex-wrap gap-2">
            {suggested.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSuggested(s)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${tags.includes(s) ? 'bg-ancestor-light text-ancestor-primary border-ancestor-primary' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        {/* Dates and Places */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Dates and Places</h2>
          
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Input
                label="Birth Date"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
              
              <Input
                label="Birth Place"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleInputChange}
                placeholder="Enter birth place"
              />
            </div>
            
            <div>
              <Input
                label="Death Date"
                name="deathDate"
                type="date"
                value={formData.deathDate}
                onChange={handleInputChange}
              />
              
              <Input
                label="Death Place"
                name="deathPlace"
                value={formData.deathPlace}
                onChange={handleInputChange}
                placeholder="Enter death place"
              />
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Contact Information</h2>
          
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
            
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </div>
          
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter full address"
            className="mt-4"
          />
        </Card>

        {/* Family Relationships */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Family Relationships</h2>
          
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to You *
              </label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select relationship</option>
                {relationships.map((rel) => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent (if applicable)
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select parent (optional)</option>
                {parentOptions.map(p => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name} ({p.relationship})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {['Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin', 'Nephew', 'Niece'].includes(formData.relationship) 
                  ? 'Select the parent to establish the family connection'
                  : 'Optional: Link this person to an existing family member'
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Biography */}
        <Card>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about this family member's life, achievements, and stories..."
              rows={4}
              className="input-field resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              Help preserve their legacy by sharing their story
            </p>
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
            <span>Save Family Member</span>
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/family-tree')}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FamilyTreeBuilderPage