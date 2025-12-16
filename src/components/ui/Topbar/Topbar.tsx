import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { LogOut } from 'lucide-react'

export default function Topbar() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      // Clear all localStorage data
      localStorage.clear()
      
      // Sign out from Firebase
      await signOut()
      
      // Force page reload to clear any cached state
      window.location.href = '/login'
    } catch (error) {
      console.error('Failed to sign out:', error)
      // Even if Firebase signOut fails, clear local data and redirect
      localStorage.clear()
      window.location.href = '/login'
    }
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm z-30">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="inline-flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-2xl transition-all duration-300 hover:shadow-sm">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ancestor-primary to-ancestor-secondary text-white flex items-center justify-center text-sm font-semibold shadow-md ring-2 ring-gray-100">
                {getInitials(user?.displayName)}
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              {user?.displayName || 'User'}
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-2xl transition-all duration-300 hover:shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
