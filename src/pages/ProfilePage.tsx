import { useState, useEffect } from 'react'
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
  Share2,
  RefreshCw
} from 'lucide-react'
import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase/config'
import { userProfileService } from '../firebase/services/userProfileService'
import { activityService } from '../firebase/services/activityService'
import { familyService } from '../firebase/services/familyService'
import { culturalMemoryService } from '../firebase/services/culturalMemoryService'
import { burialSiteService } from '../firebase/services/burialSiteService'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    joinDate: '',
    profileImage: '',
    familyStats: { familyMembers: 0, memoriesUploaded: 0, burialSites: 0, profileViews: 0 }
  })

  // Load real-time metrics with data cleanup
  const loadRealTimeMetrics = async (userId: string) => {
    try {
      // Load data from all services in parallel
      const [familyMembers, culturalMemories, burialSites] = await Promise.all([
        familyService.getFamilyMembers(userId).catch(() => []),
        culturalMemoryService.getCulturalMemories(userId).catch(() => []),
        burialSiteService.getBurialSites(userId).catch(() => [])
      ])

      // Also check localStorage for offline data
      const localFamilyMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]')
      const localCulturalMemories = JSON.parse(localStorage.getItem('culturalMemories') || '[]')
      const localBurialSites = JSON.parse(localStorage.getItem('burialSites') || '[]')

      // DATA CLEANUP: Remove orphaned Firestore data that doesn't exist in localStorage
      // This fixes the issue where "Ezenwa Igboerika" exists in Firestore but not in localStorage
      const validFamilyMembers = familyMembers.filter((firestoreMember: any) => 
        localFamilyMembers.some((localMember: any) => 
          localMember.id === firestoreMember.id || 
          localMember.name === firestoreMember.name
        )
      )

      // If there are orphaned Firestore members, clean them up
      const orphanedMembers = familyMembers.filter((firestoreMember: any) => 
        !localFamilyMembers.some((localMember: any) => 
          localMember.id === firestoreMember.id || 
          localMember.name === firestoreMember.name
        )
      )

      if (orphanedMembers.length > 0) {
        console.log('Found orphaned family members in Firestore:', orphanedMembers.map((m: any) => m.name))
        
        // Remove orphaned members from Firestore
        for (const orphanedMember of orphanedMembers) {
          try {
            if (orphanedMember.id) {
              await familyService.deleteFamilyMember(orphanedMember.id)
              console.log(`Removed orphaned member: ${orphanedMember.name}`)
            } else {
              console.warn(`Cannot remove orphaned member ${orphanedMember.name}: missing ID`)
            }
          } catch (error) {
            console.error(`Failed to remove orphaned member ${orphanedMember.name}:`, error)
          }
        }
      }

      // Combine Firestore and localStorage data, removing duplicates
      const allFamilyMembers = [...validFamilyMembers, ...localFamilyMembers.filter((local: any) => 
        !validFamilyMembers.some(firestore => firestore.id === local.id)
      )]
      
      const allCulturalMemories = [...culturalMemories, ...localCulturalMemories.filter((local: any) => 
        !culturalMemories.some(firestore => firestore.id === local.id)
      )]
      
      const allBurialSites = [...burialSites, ...localBurialSites.filter((local: any) => 
        !burialSites.some(firestore => firestore.id === local.id)
      )]

      // Update family stats with cleaned data
      setUserData(prev => ({
        ...prev,
        familyStats: {
          familyMembers: allFamilyMembers.length,
          memoriesUploaded: allCulturalMemories.length,
          burialSites: allBurialSites.length,
          profileViews: prev.familyStats.profileViews // Keep existing profile views
        }
      }))
    } catch (error) {
      console.error('Error loading real-time metrics:', error)
    }
  }

  // Manual refresh function
  const handleRefreshMetrics = async () => {
    if (!user) return
    setRefreshing(true)
    try {
      await loadRealTimeMetrics(user.uid)
    } finally {
      setRefreshing(false)
    }
  }

  // Manual cleanup function for orphaned data
  const handleCleanupData = async () => {
    if (!user) return
    setRefreshing(true)
    try {
      console.log('Starting data cleanup...')
      await loadRealTimeMetrics(user.uid)
      console.log('Data cleanup completed!')
    } finally {
      setRefreshing(false)
    }
  }

  // Load user profile data from Firestore
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          // First set basic data from Firebase Auth
          setUserData(prev => ({
            ...prev,
            name: user.displayName || 'User',
            email: user.email || '',
            profileImage: user.photoURL || '',
            joinDate: 'January 2024',
            bio: 'Family historian and heritage preservation enthusiast. Passionate about keeping African traditions alive for future generations.',
            phone: '',
            location: '',
          }))

          // Then load additional data from Firestore
          const profile = await userProfileService.getUserProfile(user.uid)
          if (profile) {
            setUserData(prev => ({
              ...prev,
              name: profile.displayName || prev.name,
              email: profile.email || prev.email,
              phone: profile.phone || prev.phone,
              location: profile.location || prev.location,
              bio: profile.bio || prev.bio,
              profileImage: profile.photoURL || prev.profileImage,
            }))
          }

          // Load real-time metrics
          await loadRealTimeMetrics(user.uid)
        } catch (error) {
          console.error('Error loading user profile:', error)
        }
      }
    }

    loadUserProfile()
  }, [user])

  // Refresh metrics when page becomes visible (user returns from other pages)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadRealTimeMetrics(user.uid)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (auth.currentUser && user) {
        // Update Firebase Auth profile
        await updateProfile(auth.currentUser, {
          displayName: userData.name,
          photoURL: userData.profileImage
        })

        // Update Firestore profile with additional data
               await userProfileService.updateUserProfile({
                 uid: user.uid,
                 displayName: userData.name,
                 email: userData.email,
                 phone: userData.phone,
                 location: userData.location,
                 bio: userData.bio,
                 photoURL: userData.profileImage
               })

               // Log activity
               await activityService.logProfileUpdated(user.uid)

               console.log('Profile updated successfully')
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      // Still exit edit mode even if update fails
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {userData.profileImage ? (
                <img 
                  src={userData.profileImage} 
                  alt={userData.name} 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ancestor-primary to-ancestor-secondary text-white flex items-center justify-center text-2xl font-bold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
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
              <Button className="flex items-center gap-2" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4" /> 
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
            <Button variant="outline" className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
                  <input 
                    name="name"
                    type="text" 
                    value={userData.name} 
                    onChange={handleChange}
                    className="input-field" 
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Location</label>
                {!isEditing ? (
                  <div className="flex items-center text-gray-900"><MapPin className="w-4 h-4 mr-2 text-gray-400" />{userData.location || 'Not specified'}</div>
                ) : (
                  <input 
                    name="location"
                    type="text" 
                    value={userData.location} 
                    onChange={handleChange}
                    className="input-field" 
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                {!isEditing ? (
                  <div className="flex items-center text-ancestor-primary"><Mail className="w-4 h-4 mr-2 text-gray-400" />{userData.email}</div>
                ) : (
                  <input 
                    name="email"
                    type="email" 
                    value={userData.email} 
                    onChange={handleChange}
                    className="input-field" 
                    disabled
                  />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Phone</label>
                {!isEditing ? (
                  <div className="flex items-center text-ancestor-primary"><Phone className="w-4 h-4 mr-2 text-gray-400" />{userData.phone || 'Not specified'}</div>
                ) : (
                  <input 
                    name="phone"
                    type="tel" 
                    value={userData.phone} 
                    onChange={handleChange}
                    className="input-field" 
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">About Me</label>
                {!isEditing ? (
                  <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                ) : (
                  <textarea 
                    name="bio"
                    value={userData.bio} 
                    onChange={handleChange}
                    className="input-field resize-none" 
                    rows={4} 
                  />
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
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/privacy-settings'}><Shield className="w-4 h-4 mr-3" /> Privacy Settings</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/account-settings'}><Settings className="w-4 h-4 mr-3" /> Account Settings</Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleRefreshMetrics} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-3 ${refreshing ? 'animate-spin' : ''}`} /> 
                {refreshing ? 'Refreshing...' : 'Refresh Metrics'}
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleCleanupData} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-3 ${refreshing ? 'animate-spin' : ''}`} /> 
                {refreshing ? 'Cleaning...' : 'Cleanup Data'}
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                alert('Profile link copied to clipboard!')
              }}><Share2 className="w-4 h-4 mr-3" /> Share Profile</Button>
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