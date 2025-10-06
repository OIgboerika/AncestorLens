import { Outlet } from 'react-router-dom'
import Sidebar from '../ui/Sidebar/Sidebar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:pl-64 pt-4 md:pt-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout