import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, MapPin, TreePine, BookOpen, Settings } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'Family Tree', href: '/family-tree', icon: TreePine },
    { name: 'Burial Sites', href: '/burial-sites', icon: MapPin },
    { name: 'Cultural Memories', href: '/cultural-memories', icon: BookOpen },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-ancestor-primary/10 flex items-center justify-center group-hover:bg-ancestor-primary/20 transition-colors">
                <img 
                  src="/images/logo.png" 
                  alt="AncestorLens Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="font-bold text-xl text-ancestor-primary">AncestorLens</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-ancestor-primary/10 to-ancestor-primary/5 text-ancestor-primary shadow-sm border border-ancestor-primary/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-ancestor-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                </Link>
              )
            })}
            
            {/* Profile Dropdown */}
            <div className="relative group ml-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-2xl text-gray-600 hover:text-ancestor-primary hover:bg-gray-50 transition-all duration-300">
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Profile
                </Link>
                <Link
                  to="/privacy-settings"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Privacy Settings
                </Link>
                <Link
                  to="/account-settings"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Account Settings
                </Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3 ml-4">
              <div className="w-9 h-9 bg-gradient-to-br from-ancestor-primary to-ancestor-secondary rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-100">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <span className="text-sm font-medium text-gray-700">John Doe</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-gray-600 hover:text-ancestor-primary hover:bg-gray-50 rounded-2xl transition-all duration-300 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 pt-4 pb-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-ancestor-primary/10 to-ancestor-primary/5 text-ancestor-primary shadow-sm border border-ancestor-primary/20'
                        : 'text-gray-600 hover:text-ancestor-primary hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-ancestor-primary' : ''}`} />
                    <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                  </Link>
                )
              })}
              <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-gray-600 hover:text-ancestor-primary hover:bg-gray-50 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/privacy-settings"
                    className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-gray-600 hover:text-ancestor-primary hover:bg-gray-50 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Privacy Settings</span>
                  </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar