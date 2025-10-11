import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { LogOut } from 'lucide-react'

export default function Topbar() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-14 bg-white border-b border-gray-200 z-30">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="inline-flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-ancestor-accent text-white flex items-center justify-center text-sm font-semibold">
                {getInitials(user?.displayName)}
              </div>
            )}
            <span className="hidden sm:inline text-sm text-gray-700">
              {user?.displayName || 'User'}
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
