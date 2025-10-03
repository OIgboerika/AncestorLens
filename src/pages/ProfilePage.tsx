import { useState } from 'react'
import { 
  User, 
  Edit, 
  Save, 
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Share2,
  Shield,
  Settings
} from 'lucide-react'
import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'
import Input from '../components/ui/Input/Input'

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+234 812 345 6789',
    location: 'Lagos, Nigeria',
    bio: 'Family historian and heritage preservation enthusiast. Passionate about keeping African traditions alive for future generations.',
    joinDate: 'January 2023',
    profileImage: null,
    familyStats: {
      familyMembers: 24,
      memoriesUploaded: 8,
      burialSites: 3,
      profileViews: 156
    }
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would save the updated profile data
    console.log('Updated profile:', userData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ancestor-dark mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and personal information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing && (
            <Button variant="outline" className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          )}
          {!isEditing && (
            <Button variant="outline" className="flex items-center space-x-2" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-ancestor-primary to-ancestor-secondary rounded-full mx-auto flex items-center justify-center overflow-hidden">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-4xl">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-ancestor-primary rounded-full flex items-center justify-center text-white border-2 border-white">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{userData.name}</h2>
              <div className="flex items-center justify-center mb-4">
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  Active Member
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                Member since {userData.joinDate}
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Heritage Contributions</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Family Members</span>
                <span className="font-semibold text-gray-900">{userData.familyStats.familyMembers}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memories Uploaded</span>
                <span className="font-semibold text-gray-900">{userData.familyStats.memoriesUploaded}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Burial Sites</span>
                <span className="font-semibold text-gray-900">{userData.familyStats.burialSites}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="font-semibold text-gray-900">{userData.familyStats.profileViews}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="w-4 h-4 mr-3" />
                Share Profile
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-3" />
                Privacy Settings
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Profile Details */}
        <div className="lg:col-span-2">
          {/* Personal Information */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {userData.name}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={userData.location}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {userData.location}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <a href={`mailto:${userData.email}`} className="text-ancestor-primary hover:text-ancestor-dark">
                      {userData.email}
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <a href={`tel:${userData.phone}`} className="text-ancestor-primary hover:text-ancestor-dark">
                      {userData.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Biography */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
            
            {isEditing ? (
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
            )}
          </Card>
          
          {/* Save Button */}
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

export default ProfilePage