import { Link } from 'react-router-dom'
import { ArrowRight, Users, MapPin, Mic } from 'lucide-react'
import Button from '../components/ui/Button/Button'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ancestor-light to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-3xl">𝔘</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-ancestor-dark mb-6">
              Preserve Your <br />
              <span className="text-ancestor-primary">African Heritage</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AncestorLens helps African families preserve their heritage through family trees, 
              burial site mapping, and oral storytelling traditions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-ancestor-dark mb-2">Family Trees</h3>
              <p className="text-gray-600">
                Create interactive family trees with photos, bios, and relationships
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ancestor-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-ancestor-dark mb-2">Burial Sites</h3>
              <p className="text-gray-600">
                Map and preserve ancestral burial locations with GPS coordinates
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ancestor-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-ancestor-dark" />
              </div>
              <h3 className="text-xl font-semibold text-ancestor-dark mb-2">Oral Stories</h3>
              <p className="text-gray-600">
                Upload and preserve folklore, ancestor stories, and cultural traditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage