import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, TreePine, MapPin, BookOpen, Settings, Menu, X, Archive } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Family Tree', href: '/family-tree', icon: TreePine },
  { name: 'Burial Sites', href: '/burial-sites', icon: MapPin },
  { name: 'Cultural Memories', href: '/cultural-memories', icon: BookOpen },
  { name: 'Archives', href: '/archives', icon: Archive },
  { name: 'Settings', href: '/privacy-settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-gray-200"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 hidden md:flex md:flex-col">
      <div className="h-16 px-4 flex items-center border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img 
            src="/images/logo.png" 
            alt="AncestorLens Logo" 
            className="w-12 h-12 object-contain"
          />
          <span className="font-bold text-lg text-ancestor-primary">AncestorLens</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = location.pathname === href || location.pathname.startsWith(href + '/')
          return (
            <Link
              key={name}
              to={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-ancestor-light text-ancestor-primary'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-ancestor-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>

    {/* Mobile sidebar */}
    <aside className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
          <img 
            src="/images/logo.png" 
            alt="AncestorLens Logo" 
            className="w-12 h-12 object-contain"
          />
          <span className="font-bold text-lg text-ancestor-primary">AncestorLens</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = location.pathname === href || location.pathname.startsWith(href + '/')
          return (
            <Link
              key={name}
              to={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-ancestor-light text-ancestor-primary'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-ancestor-primary'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
    </>
  )
}
