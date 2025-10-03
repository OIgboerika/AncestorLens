import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Save, 
  Camera, 
  UserPlus, 
  Users,
  Calendar,
  MapPin,
  Upload
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'

const FamilyTreeBuilderPage = () => {
  const navigate = useNavigate()
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
    profileImage: null
  })

  const [relationships] = useState([
    'Grandfather', 'Grandmother', 'Father', 'Mother', 'Brother', 'Sister',
    'Uncle', 'Aunt', 'Cousin', 'Son', 'Daughter', 'Grandson', 'Granddaughter',
    'Nephew', 'Niece', 'Husband', 'Partner', 'Other'
  ])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
    // Here you would save the family member data
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

        {/* Dates and Places */}
        <Card>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Dates and Places</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="">Select parent</option>
                <option value="father">Michael Doe (Father)</option>
                <option value="mother">Grace Doe (Mother)</option>
              </select>
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