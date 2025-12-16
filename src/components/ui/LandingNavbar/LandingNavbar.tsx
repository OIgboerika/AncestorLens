import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 fixed top-0 w-full z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src="/images/logo.png" 
                alt="AncestorLens Logo" 
                className="w-12 h-12 object-contain"
              />
              <span className="font-bold text-xl text-ancestor-primary dark:text-ancestor-primary">AncestorLens</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-600 dark:text-gray-300 hover:text-ancestor-primary font-medium transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-600 dark:text-gray-300 hover:text-ancestor-primary font-medium transition-colors duration-200"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 dark:text-gray-300 hover:text-ancestor-primary font-medium transition-colors duration-200"
            >
              Contact Us
            </button>
            
            <div className="flex items-center space-x-4 ml-4">
              <ThemeToggle />
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg border border-ancestor-primary text-ancestor-primary px-4 py-2 text-sm font-semibold hover:bg-ancestor-primary/10 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-ancestor-primary text-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-ancestor-dark transition"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-ancestor-primary focus:outline-none p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-3 py-2 rounded-2xl text-base font-medium text-gray-600 dark:text-gray-300 hover:text-ancestor-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 rounded-2xl text-base font-medium text-gray-600 dark:text-gray-300 hover:text-ancestor-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 rounded-2xl text-base font-medium text-gray-600 dark:text-gray-300 hover:text-ancestor-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Contact Us
              </button>
              <div className="pt-2 space-y-2">
                <div className="flex justify-center pb-2">
                  <ThemeToggle />
                </div>
                <Link
                  to="/signup"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium border border-ancestor-primary text-ancestor-primary hover:bg-ancestor-primary/10 dark:hover:bg-ancestor-primary/20"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-ancestor-primary text-white hover:bg-ancestor-dark"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default LandingNavbar
