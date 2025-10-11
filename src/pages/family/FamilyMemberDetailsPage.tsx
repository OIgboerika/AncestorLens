import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Camera,
  Save,
  Share2,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'

interface MemberDetails {
  id: number
  name: string
  role: 'Living' | 'Deceased'
  birthYear?: string
  deathYear?: string
  birthPlace?: string
  deathPlace?: string
  occupation?: string
  email?: string
  phone?: string
  address?: string
  bio?: string
  profileImage?: string | null
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

  // Load member from navigation state, then localStorage, else mock
  useEffect(() => {
    // 1) From navigation state
    if (location.state?.member) {
      setMemberData({ ...MOCK_MEMBER, ...location.state.member })
      return
    }

    // 2) From localStorage by id
    const numericId = Number(id)
    const savedMembers: MemberDetails[] = JSON.parse(localStorage.getItem('familyMembers') || '[]')
    const found = savedMembers.find(m => Number(m.id) === numericId)
    if (found) {
      setMemberData({ ...MOCK_MEMBER, ...found })
      return
    }

    // 3) Fallback mock
    setMemberData(MOCK_MEMBER)
  }, [id, location.state])

  const handleEdit = () => setIsEditing(true)
  const handleSave = () => {
    setIsEditing(false)
    console.log('Updated member data:', memberData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMemberData(prev => ({ ...prev, [name]: value }))
  }

  const initials = useMemo(() => memberData.name.split(' ').map(n => n[0]).join(''), [memberData.name])

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
                <span className="text-gray-600 font-bold text-2xl">
                  {initials}
                </span>
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
                <Button variant="outline" size="sm" className="mb-4">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
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
                  <p className="font-semibold text-gray-900">
                    {memberData.relationships ? (memberData.relationships.children?.length || 0) + 3 : 0}
                  </p>
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
                <span className="text-sm font-medium text-gray-900">{memberData.relationships?.father || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mother</span>
                <span className="text-sm font-medium text-gray-900">{memberData.relationships?.mother || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Spouse</span>
                <span className="text-sm font-medium text-gray-900">{memberData.relationships?.spouse || '—'}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600">Children</span>
                <div className="mt-2 space-y-1">
                  {(memberData.relationships?.children || []).map((child, index) => (
                    <div key={index} className="text-sm font-medium text-gray-900">• {child}</div>
                  ))}
                  {(!memberData.relationships?.children || memberData.relationships.children.length === 0) && (
                    <div className="text-sm text-gray-500">—</div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Details */}
        <div className="lg:col-span-2">
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
              {memberData.deathYear && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Death Year</label>
                  <p className="text-gray-900">{memberData.deathYear}</p>
                </div>
              )}
            </div>
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