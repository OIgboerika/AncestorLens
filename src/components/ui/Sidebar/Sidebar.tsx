import { Link, useLocation } from 'react-router-dom'
import { Home, TreePine, MapPin, BookOpen, Settings } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Family Tree', href: '/family-tree', icon: TreePine },
  { name: 'Burial Sites', href: '/burial-sites', icon: MapPin },
  { name: 'Cultural Memories', href: '/cultural-memories', icon: BookOpen },
  { name: 'Settings', href: '/privacy-settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 hidden md:flex md:flex-col">
      <div className="h-16 px-4 flex items-center border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-ancestor-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">𝔘</span>
          </div>
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
      <div className="px-4 py-4 border-t border-gray-200 text-xs text-gray-500">
        © 2024 AncestorLens
      </div>
    </aside>
  )
}
