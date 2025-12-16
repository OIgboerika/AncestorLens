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
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 shadow-lg z-40 hidden md:flex md:flex-col">
      <div className="h-20 px-6 flex items-center border-b border-gray-100">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-ancestor-primary/10 flex items-center justify-center group-hover:bg-ancestor-primary/20 transition-colors">
            <img 
              src="/images/logo.png" 
              alt="AncestorLens Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-bold text-lg text-ancestor-primary">AncestorLens</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = location.pathname === href || location.pathname.startsWith(href + '/')
          return (
            <Link
              key={name}
              to={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-ancestor-primary/10 to-ancestor-primary/5 text-ancestor-primary shadow-sm border border-ancestor-primary/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-ancestor-primary hover:shadow-sm'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-ancestor-primary' : ''}`} />
              <span className={isActive ? 'font-semibold' : ''}>{name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>

    {/* Mobile sidebar */}
    <aside className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-20 px-6 flex items-center justify-between border-b border-gray-100">
        <Link to="/dashboard" className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-ancestor-primary/10 flex items-center justify-center">
            <img 
              src="/images/logo.png" 
              alt="AncestorLens Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-bold text-lg text-ancestor-primary">AncestorLens</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = location.pathname === href || location.pathname.startsWith(href + '/')
          return (
            <Link
              key={name}
              to={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-ancestor-primary/10 to-ancestor-primary/5 text-ancestor-primary shadow-sm border border-ancestor-primary/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-ancestor-primary hover:shadow-sm'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-ancestor-primary' : ''}`} />
              <span className={isActive ? 'font-semibold' : ''}>{name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
    </>
  )
}
