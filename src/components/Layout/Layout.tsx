import { Outlet } from 'react-router-dom'
import Sidebar from '../ui/Sidebar/Sidebar'
import Topbar from '../ui/Topbar/Topbar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <Sidebar />
      <Topbar />
      <main className="md:pl-64 pt-20 md:pt-16">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout