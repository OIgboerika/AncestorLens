import { Outlet } from 'react-router-dom'
import Sidebar from '../ui/Sidebar/Sidebar'
import Topbar from '../ui/Topbar/Topbar'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      <main className="md:pl-64 pt-20 md:pt-14">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout