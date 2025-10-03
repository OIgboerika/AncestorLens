import { Link } from 'react-router-dom'
import {
  TreePine,
  MapPin,
  Mic,
  Shield,
  ArrowRight,
  ChevronRight,
  Image as Camera,
} from 'lucide-react'
import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'

const DashboardPage = () => {
  const userFirstName = 'Onochie'

  const activities = [
    { id: 1, icon: Camera, text: 'John Adebayo added a new photo to the Family Tree.', time: '5 minutes ago' },
    { id: 2, icon: MapPin, text: "New burial site for 'Mama Ayisha' marked by Sarah.", time: '2 hours ago' },
    { id: 3, icon: Mic, text: "Afolabi uploaded an audio memory of grandfather's stories.", time: 'Yesterday' },
    { id: 4, icon: TreePine, text: 'Update suggested for the Adewale family branch.', time: '3 days ago' },
    { id: 5, icon: Shield, text: 'AncestorLens gift subscription activated for cousin Emeka.', time: 'Last week' },
  ]

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            {activities.map(({ id, icon: Icon, text, time }) => (
              <div key={id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-ancestor-primary flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage