import { useState } from 'react'
import { 
  User, 
  Edit, 
  Save, 
  Camera,
  Mail,
  Phone,
  MapPin,
  Shield,
  Settings,
  Share2
} from 'lucide-react'
import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+234 812 345 6789',
    location: 'Lagos, Nigeria',
    bio: 'Family historian and heritage preservation enthusiast. Passionate about keeping African traditions alive for future generations.',
    joinDate: 'January 2023',
    profileImage: '',
    familyStats: { familyMembers: 24, memoriesUploaded: 8, burialSites: 3, profileViews: 156 }
  })

  const handleSave = () => setIsEditing(false)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ancestor-primary to-ancestor-secondary text-white flex items-center justify-center text-2xl font-bold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              {isEditing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow"><Camera className="w-4 h-4 text-ancestor-primary" /></button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ancestor-dark">{userData.name}</h1>
              <p className="text-sm text-gray-600">Member since {userData.joinDate}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-ancestor-light text-ancestor-primary">Family Members: {userData.familyStats.familyMembers}</span>
                <span className="px-2 py-1 rounded-full bg-ancestor-light text-ancestor-primary">Memories: {userData.familyStats.memoriesUploaded}</span>
                <span className="px-2 py-1 rounded-full bg-ancestor-light text-ancestor-primary">Burial Sites: {userData.familyStats.burialSites}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4" /> Edit Profile</Button>
            ) : (
              <Button className="flex items-center gap-2" onClick={handleSave}><Save className="w-4 h-4" /> Save Changes</Button>
            )}
            <Button variant="outline" className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-lg font-semibold text-ancestor-dark mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                {!isEditing ? (
                  <div className="flex items-center text-gray-900"><User className="w-4 h-4 mr-2 text-gray-400" />{userData.name}</div>
                ) : (
                  <input className="input-field" defaultValue={userData.name} />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Location</label>
                {!isEditing ? (
                  <div className="flex items-center text-gray-900"><MapPin className="w-4 h-4 mr-2 text-gray-400" />{userData.location}</div>
                ) : (
                  <input className="input-field" defaultValue={userData.location} />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                {!isEditing ? (
                  <div className="flex items-center text-ancestor-primary"><Mail className="w-4 h-4 mr-2 text-gray-400" />{userData.email}</div>
                ) : (
                  <input className="input-field" defaultValue={userData.email} />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Phone</label>
                {!isEditing ? (
                  <div className="flex items-center text-ancestor-primary"><Phone className="w-4 h-4 mr-2 text-gray-400" />{userData.phone}</div>
                ) : (
                  <input className="input-field" defaultValue={userData.phone} />
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">About Me</label>
                {!isEditing ? (
                  <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                ) : (
                  <textarea className="input-field resize-none" rows={4} defaultValue={userData.bio} />
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-ancestor-dark mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start"><Shield className="w-4 h-4 mr-3" /> Privacy Settings</Button>
              <Button variant="outline" className="w-full justify-start"><Settings className="w-4 h-4 mr-3" /> Account Settings</Button>
              <Button variant="outline" className="w-full justify-start"><Share2 className="w-4 h-4 mr-3" /> Share Profile</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-ancestor-dark mb-4">Heritage Contributions</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between"><span>Family Members</span><span className="font-semibold">{userData.familyStats.familyMembers}</span></div>
              <div className="flex items-center justify-between"><span>Memories Uploaded</span><span className="font-semibold">{userData.familyStats.memoriesUploaded}</span></div>
              <div className="flex items-center justify-between"><span>Burial Sites</span><span className="font-semibold">{userData.familyStats.burialSites}</span></div>
              <div className="border-t border-gray-200 pt-2 flex items-center justify-between"><span>Profile Views</span><span className="font-semibold">{userData.familyStats.profileViews}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}