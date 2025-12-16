import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, MapPin, Mic, Send, CheckCircle } from 'lucide-react'
import LandingNavbar from '../components/ui/LandingNavbar/LandingNavbar'

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setFormSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setFormSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center bg-gradient-to-b from-white via-ancestor-light/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-ancestor-primary/10 text-ancestor-primary text-sm font-semibold mb-6">
                Preserving African Heritage
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ancestor-dark mb-6">
                A place to preserve your heritage
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8">
                Preserve African heritage through interactive family trees, burial site mapping,
                and cultural memories — built for African families and traditions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-ancestor-primary text-white px-8 py-4 text-base md:text-lg font-semibold shadow-sm hover:bg-ancestor-dark transition group"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-ancestor-primary text-ancestor-primary px-8 py-4 text-base md:text-lg font-semibold hover:bg-ancestor-primary/10 transition"
                >
                  Log In
                </Link>
              </div>

              {/* Stats or Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-ancestor-primary">1000+</div>
                  <div className="text-sm text-gray-600">Families</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-ancestor-primary">5000+</div>
                  <div className="text-sm text-gray-600">Memories</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-ancestor-primary">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Images Gallery */}
            <div className="relative h-96 lg:h-[500px]">
              <div className="relative mx-auto max-w-2xl h-full">
                <img 
                  src="/landing-page-images/abazie-uchenna-fedE6gJVSRA-unsplash.jpg" 
                  alt="Showcase 1" 
                  className="absolute left-4 top-10 w-40 md:w-56 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[-6deg] hover:rotate-0 transition-transform duration-300" 
                />
                <img 
                  src="/landing-page-images/eyo-archibong-RJo9OowwG4g-unsplash.jpg" 
                  alt="Showcase 2" 
                  className="absolute left-36 md:left-56 top-8 w-44 md:w-64 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[4deg] hover:rotate-0 transition-transform duration-300" 
                />
                <img 
                  src="/landing-page-images/joshua-duneebon-G8fEocK6g4w-unsplash.jpg" 
                  alt="Showcase 3" 
                  className="absolute left-64 md:left-[26rem] top-9 w-40 md:w-56 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300" 
                />
                <img 
                  src="/landing-page-images/lisa-marie-theck-igdYA2SwV8E-unsplash.jpg" 
                  alt="Showcase 4" 
                  className="absolute left-[22rem] md:left-[34rem] top-8 w-44 md:w-64 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[3deg] hover:rotate-0 transition-transform duration-300" 
                />
                <img 
                  src="/landing-page-images/muhammad-taha-ibrahim-HfC8mUqulJ8-unsplash.jpg" 
                  alt="Showcase 5" 
                  className="absolute left-[32rem] md:left-[44rem] top-11 w-40 md:w-56 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[-5deg] hover:rotate-0 transition-transform duration-300" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-ancestor-primary/10 text-ancestor-primary text-sm font-semibold mb-4">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-ancestor-dark mb-6">
              What We Solve & What We Deliver
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              AncestorLens is dedicated to preserving African heritage for future generations through innovative technology and thoughtful design.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-ancestor-dark mb-6">
                The Challenge We Address
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                African families face the critical challenge of preserving their rich heritage, family histories, and cultural traditions. As generations pass, valuable stories, burial locations, and ancestral connections risk being lost forever.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Traditional methods of record-keeping are often fragmented, making it difficult for families to maintain comprehensive records of their lineage, cultural practices, and important locations.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Without a centralized, accessible platform, families struggle to document and share their heritage with future generations, leading to the gradual erosion of cultural identity and family connections.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-ancestor-dark mb-6">
                Our Solution
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                AncestorLens provides a comprehensive digital platform that empowers African families to preserve, organize, and share their heritage seamlessly. We deliver a unified system for managing family trees, mapping burial sites, and archiving cultural memories.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our platform combines intuitive design with powerful features, enabling families to create interactive family trees, document burial locations with GPS precision, and preserve oral histories through audio and video recordings.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With AncestorLens, families can ensure their heritage is preserved for generations to come, maintaining cultural continuity and strengthening family bonds across time and distance.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-ancestor-light/50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ancestor-dark mb-3">Interactive Family Trees</h3>
              <p className="text-gray-600">
                Create comprehensive family trees with photos, biographies, and relationship mapping. Connect generations and preserve family connections for future descendants.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-ancestor-light/50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-ancestor-secondary rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-ancestor-dark mb-3">Burial Site Mapping</h3>
              <p className="text-gray-600">
                Map and preserve ancestral burial locations with GPS coordinates. Document important sites and ensure they remain accessible to future generations.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-ancestor-light/50 to-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-ancestor-accent rounded-full flex items-center justify-center mb-6">
                <Mic className="w-8 h-8 text-ancestor-dark" />
              </div>
              <h3 className="text-xl font-bold text-ancestor-dark mb-3">Cultural Memories</h3>
              <p className="text-gray-600">
                Preserve oral histories, folklore, and cultural traditions through audio, video, and written records. Keep ancestral stories alive for generations.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-16 bg-ancestor-light/30 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-ancestor-dark mb-6 text-center">
              What Makes AncestorLens Special
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-ancestor-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-ancestor-dark mb-2">Secure & Private</h4>
                  <p className="text-gray-600">Your family data is protected with enterprise-grade security, ensuring your heritage remains private and secure.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-ancestor-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-ancestor-dark mb-2">Easy to Use</h4>
                  <p className="text-gray-600">Intuitive interface designed for all ages, making it simple for every family member to contribute and explore.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-ancestor-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-ancestor-dark mb-2">Accessible Anywhere</h4>
                  <p className="text-gray-600">Access your family heritage from any device, anywhere in the world, keeping your family connected across distances.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-ancestor-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-ancestor-dark mb-2">Built for African Families</h4>
                  <p className="text-gray-600">Designed specifically with African traditions, values, and cultural practices in mind, respecting your heritage.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-white to-ancestor-light/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-ancestor-primary/10 text-ancestor-primary text-sm font-semibold mb-4">
              Get In Touch
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-ancestor-dark mb-6">
              Contact Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a question, concern, or feedback? We're here to help. Reach out to us and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
            {formSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-ancestor-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-ancestor-dark mb-2">Thank You!</h3>
                <p className="text-gray-600">We've received your message and will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-ancestor-dark mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ancestor-primary focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-ancestor-dark mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ancestor-primary focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-ancestor-dark mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ancestor-primary focus:border-transparent transition-all"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-ancestor-dark mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ancestor-primary focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your question, concern, or feedback..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center rounded-lg bg-ancestor-primary text-white px-8 py-4 text-base font-semibold shadow-sm hover:bg-ancestor-dark transition group"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

          {/* Additional Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              You can also reach us directly at:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-ancestor-primary">
              <a href="mailto:support@ancestorelens.com" className="hover:text-ancestor-dark transition">
                support@ancestorelens.com
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="tel:+1234567890" className="hover:text-ancestor-dark transition">
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ancestor-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/images/logo.png" 
                  alt="AncestorLens Logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="font-bold text-xl">AncestorLens</span>
              </div>
              <p className="text-gray-300 text-sm">
                Preserving African heritage for future generations through innovative technology and thoughtful design.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <div className="space-y-2">
                <Link to="/signup" className="block text-sm text-gray-300 hover:text-white transition">
                  Sign Up
                </Link>
                <Link to="/login" className="block text-sm text-gray-300 hover:text-white transition">
                  Log In
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} AncestorLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
