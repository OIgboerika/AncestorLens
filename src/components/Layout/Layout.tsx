import { Outlet } from 'react-router-dom'
import Navbar from '../ui/Navbar/Navbar'
import Footer from '../ui/Footer/Footer'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout