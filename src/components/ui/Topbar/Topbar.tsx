import { Link } from 'react-router-dom'

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-14 bg-white border-b border-gray-200 z-30">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end">
        <Link to="/profile" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-ancestor-accent text-white flex items-center justify-center text-sm font-semibold">JD</div>
          <span className="hidden sm:inline text-sm text-gray-700">Profile</span>
        </Link>
      </div>
    </header>
  )
}
