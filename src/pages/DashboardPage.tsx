import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  TreePine,
  MapPin,
  Mic,
  Shield,
  Image as Camera,
  User,
  Upload,
  Edit,
} from 'lucide-react'
import Card from '../components/ui/Card/Card'
import { useAuth } from '../contexts/AuthContext'
import { activityService, Activity } from '../firebase/services/activityService'

const DashboardPage = () => {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  
  // Extract first name from displayName, with fallbacks
  const getUserFirstName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0]
    }
    if (user?.email) {
      // Extract name from email if displayName is not available
      const emailName = user.email.split('@')[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    return 'User'
  }
  
  const userFirstName = getUserFirstName()

  // Subscribe to user activities in real-time (non-blocking)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    
    if (user?.uid) {
      // Set loading state but don't block UI
      setLoading(true)
      // Load activities asynchronously - don't block navigation
      unsubscribe = activityService.onActivitiesChange(user.uid, (latestActivities: Activity[]) => {
        // Sort activities by timestamp (newest first)
        const sortedActivities = latestActivities.sort((a, b) => {
          const timestampA = a.timestamp?.toDate ? a.timestamp.toDate() : (a.timestamp ? new Date(a.timestamp.seconds * 1000) : new Date(0))
          const timestampB = b.timestamp?.toDate ? b.timestamp.toDate() : (b.timestamp ? new Date(b.timestamp.seconds * 1000) : new Date(0))
          return timestampB.getTime() - timestampA.getTime() // Descending order (newest first)
        })
        setActivities(sortedActivities)
        setLoading(false)
      })
    } else {
      setActivities([])
      setLoading(false)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user])

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'family_member_added':
      case 'family_member_updated':
        return User
      case 'memory_uploaded':
        return Camera
      case 'burial_site_added':
      case 'burial_site_updated':
        return MapPin
      case 'profile_updated':
        return Edit
      default:
        return Upload
    }
  }

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Unknown time'
    
    const now = new Date()
    const activityTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome banner */}
      <div className="rounded-xl border border-orange-100 bg-orange-50 text-ancestor-dark p-6 sm:p-8 mb-8">
        <p className="text-sm font-semibold text-ancestor-dark/80">Your Ancestry, Your Story.</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">Welcome, {userFirstName}!</h1>
        <p className="mt-3 text-sm sm:text-base text-ancestor-dark/70 max-w-3xl">
          Dive into your family’s rich history, preserve cherished memories, and connect with your roots.
        </p>
      </div>

      {/* Feature cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-ancestor-primary/10 text-ancestor-primary flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-ancestor-dark">Manage Family Tree</h3>
              <p className="text-sm text-gray-600 mt-1">Add members, view relationships, and upload ancestral records.</p>
              <Link to="/family-tree" className="inline-flex items-center mt-4 px-4 py-2 rounded-md border border-ancestor-primary text-ancestor-primary hover:bg-ancestor-primary hover:text-white transition-colors">
                View Family Tree
              </Link>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-ancestor-secondary/10 text-ancestor-secondary flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-ancestor-dark">Explore Burial Sites</h3>
              <p className="text-sm text-gray-600 mt-1">Locate and document important family burial places on an interactive map.</p>
              <Link to="/burial-sites" className="inline-flex items-center mt-4 px-4 py-2 rounded-md border border-ancestor-secondary text-ancestor-secondary hover:bg-ancestor-secondary hover:text-white transition-colors">
                Explore Sites
              </Link>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-ancestor-accent/10 text-ancestor-accent flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-ancestor-dark">Record Cultural Memories</h3>
              <p className="text-sm text-gray-600 mt-1">Preserve photos, audio, and stories that define your family’s heritage.</p>
              <Link to="/upload-memory" className="inline-flex items-center mt-4 px-4 py-2 rounded-md border border-ancestor-accent text-ancestor-accent hover:bg-ancestor-accent hover:text-ancestor-dark transition-colors">
                Upload Memory
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Privacy + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-ancestor-dark flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-ancestor-dark">Review Privacy Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Control who sees your family data and cultural memories.</p>
              <Link to="/privacy-settings" className="inline-flex items-center mt-4 px-4 py-2 rounded-md border border-gray-300 text-ancestor-dark hover:bg-gray-50 transition-colors">
                Manage Privacy
              </Link>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-ancestor-dark">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ancestor-primary mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No recent activity</p>
                <p className="text-xs text-gray-400 mt-1">Start by adding family members or uploading memories</p>
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-ancestor-primary flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage