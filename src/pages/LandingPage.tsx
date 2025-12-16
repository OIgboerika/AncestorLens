import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, MapPin, Mic, Send, CheckCircle, Star } from 'lucide-react'
import LandingNavbar from '../components/ui/LandingNavbar/LandingNavbar'

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [emailSignup, setEmailSignup] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setFormSubmitted(false), 5000)
  }

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email signup:', emailSignup)
    setEmailSignup('')
    alert('Thank you for subscribing!')
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      
      {/* Hero Section - Full Width with Background Image */}
      <section id="home" className="relative pt-16 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-page-images/abazie-uchenna-fedE6gJVSRA-unsplash.jpg" 
            alt="Heritage background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ancestor-dark/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Preserving African Heritage for Future Generations
              </h1>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-ancestor-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition border-2 border-white"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right - Feature Cards Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <img 
                  src="/landing-page-images/eyo-archibong-RJo9OowwG4g-unsplash.jpg" 
                  alt="Family heritage" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-ancestor-dark mb-2">Interactive Family Trees</h3>
                <p className="text-sm text-gray-600 mb-4">Create comprehensive family trees with photos, relationships, and stories.</p>
                <Link to="/signup" className="text-ancestor-primary font-semibold text-sm hover:underline">
                  VIEW DETAILS →
                </Link>
              </div>

              {/* Card 2 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <img 
                  src="/landing-page-images/joshua-duneebon-G8fEocK6g4w-unsplash.jpg" 
                  alt="Cultural memories" 
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-ancestor-dark mb-2">Cultural Memories</h3>
                <p className="text-sm text-gray-600 mb-4">Preserve oral histories and cultural traditions for future generations.</p>
                <Link to="/signup" className="text-ancestor-primary font-semibold text-sm hover:underline">
                  EXPLORE MORE →
                </Link>
              </div>
            </div>
          </div>

          {/* Customer Review Card - Top Right */}
          <div className="absolute top-20 right-4 md:right-8 bg-ancestor-primary rounded-2xl p-6 shadow-xl text-white max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">4.9</span>
            </div>
            <p className="text-sm mb-3">820+ Customer Reviews</p>
            <div className="flex -space-x-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-ancestor-primary font-bold text-xs">G</span>
              </div>
              <span className="text-xs">Google Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-ancestor-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">✱</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ancestor-dark">
              Elevating Heritage Preservation to New Heights
            </h2>
          </div>

          <p className="text-gray-600 mb-12 max-w-3xl">
            AncestorLens combines cutting-edge technology with intuitive design to help African families preserve their rich heritage, family histories, and cultural traditions for generations to come.
          </p>

          {/* Feature Cards Carousel */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-ancestor-light/50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
                <img 
                  src="/landing-page-images/lisa-marie-theck-igdYA2SwV8E-unsplash.jpg" 
                  alt="Heavy documentation" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-ancestor-dark mb-2">Comprehensive Documentation</h3>
                <p className="text-sm text-gray-600">Document every aspect of your family history with photos, videos, and detailed records.</p>
              </div>

              <div className="bg-gradient-to-br from-ancestor-light/50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
                <img 
                  src="/landing-page-images/muhammad-taha-ibrahim-HfC8mUqulJ8-unsplash.jpg" 
                  alt="Smooth sharing" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-ancestor-dark mb-2">Seamless Sharing</h3>
                <p className="text-sm text-gray-600">Share your heritage with family members across the globe with secure, private access.</p>
              </div>

              <div className="bg-gradient-to-br from-ancestor-light/50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
                <img 
                  src="/landing-page-images/abazie-uchenna-fedE6gJVSRA-unsplash.jpg" 
                  alt="Cultural preservation" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-ancestor-dark mb-2">Cultural Preservation</h3>
                <p className="text-sm text-gray-600">Preserve oral histories, traditions, and cultural practices through multimedia archives.</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 border-2 border-ancestor-primary text-ancestor-primary px-6 py-3 rounded-lg font-semibold hover:bg-ancestor-primary/10 transition"
              >
                EXPLORE FEATURES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2 - About Us */}
      <section id="about" className="py-16 md:py-24 bg-gradient-to-br from-ancestor-light/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-ancestor-primary rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ancestor-dark">
              Elevating Heritage Preservation to New Heights
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Features List */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ancestor-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">01</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-ancestor-dark mb-2">All Scenario Adaptability</h3>
                    <p className="text-gray-600 text-sm">Works for families of all sizes, from small nuclear families to large extended clans across multiple generations.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ancestor-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">02</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-ancestor-dark mb-2">Comprehensive Documentation</h3>
                    <p className="text-gray-600 text-sm">Document family trees, burial sites, cultural memories, and oral histories in one unified platform.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ancestor-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">03</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-ancestor-dark mb-2">Secure & Private</h3>
                    <p className="text-gray-600 text-sm">Enterprise-grade security ensures your family's sensitive information remains private and protected.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-ancestor-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">04</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-ancestor-dark mb-2">High Accessibility</h3>
                    <p className="text-gray-600 text-sm">Access your heritage from any device, anywhere in the world, keeping families connected across distances.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Image with Overlay Card */}
            <div className="relative">
              <img 
                src="/landing-page-images/eyo-archibong-RJo9OowwG4g-unsplash.jpg" 
                alt="Heritage preservation" 
                className="w-full h-[500px] object-cover rounded-2xl"
              />
              
              {/* Overlay Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-ancestor-dark mb-3">Tested for Reliability and Durability</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-ancestor-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-ancestor-dark text-sm">Seamless Preservation</p>
                      <p className="text-xs text-gray-600">Preserve memories with ease</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-ancestor-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-ancestor-dark text-sm">Unlimited Storage</p>
                      <p className="text-xs text-gray-600">Store unlimited family records</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-ancestor-primary font-semibold text-sm hover:underline"
                >
                  ABOUT US →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why AncestorLens Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-ancestor-dark mb-12 text-center">
            Why AncestorLens?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Feature List Card */}
            <div className="bg-gradient-to-br from-ancestor-light/50 to-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-ancestor-dark mb-6">What We Deliver</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-ancestor-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ancestor-dark mb-1">Interactive Family Trees</h4>
                    <p className="text-sm text-gray-600">Create comprehensive family trees with photos, biographies, and relationship mapping.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-ancestor-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ancestor-dark mb-1">Burial Site Mapping</h4>
                    <p className="text-sm text-gray-600">Map and preserve ancestral burial locations with GPS coordinates.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-ancestor-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Mic className="w-5 h-5 text-ancestor-dark" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ancestor-dark mb-1">Cultural Memories</h4>
                    <p className="text-sm text-gray-600">Preserve oral histories, folklore, and cultural traditions through multimedia archives.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Image with Overlay */}
            <div className="relative">
              <img 
                src="/landing-page-images/joshua-duneebon-G8fEocK6g4w-unsplash.jpg" 
                alt="Heritage connection" 
                className="w-full h-full min-h-[400px] object-cover rounded-2xl"
              />
              
              {/* Overlay Card */}
              <div className="absolute top-8 right-8 bg-ancestor-primary rounded-2xl p-6 text-white max-w-xs shadow-xl">
                <h4 className="font-bold mb-2">Connecting Generations Through Heritage</h4>
                <p className="text-sm mb-4 opacity-90">Preserve and share your family's legacy with advanced technology designed for African families.</p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 bg-white text-ancestor-primary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
                >
                  VIEW MORE →
                </Link>
              </div>

              {/* Small Image */}
              <div className="absolute bottom-8 left-8">
                <img 
                  src="/landing-page-images/lisa-marie-theck-igdYA2SwV8E-unsplash.jpg" 
                  alt="Family" 
                  className="w-32 h-32 object-cover rounded-xl shadow-lg border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-white to-ancestor-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-ancestor-dark mb-12 text-center">
            Explore Our Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Family Trees', image: '/landing-page-images/abazie-uchenna-fedE6gJVSRA-unsplash.jpg', price: 'Free' },
              { name: 'Burial Sites', image: '/landing-page-images/eyo-archibong-RJo9OowwG4g-unsplash.jpg', price: 'Free' },
              { name: 'Cultural Memories', image: '/landing-page-images/joshua-duneebon-G8fEocK6g4w-unsplash.jpg', price: 'Free' },
              { name: 'Archive Storage', image: '/landing-page-images/lisa-marie-theck-igdYA2SwV8E-unsplash.jpg', price: 'Free' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition">
                <img 
                  src={feature.image} 
                  alt={feature.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-ancestor-dark mb-2">{feature.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-ancestor-primary font-bold">{feature.price}</span>
                    <ArrowRight className="w-5 h-5 text-ancestor-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Articles Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-ancestor-dark mb-12 text-center">
            News & Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'How to Build Your First Family Tree', category: 'GUIDES', image: '/landing-page-images/abazie-uchenna-fedE6gJVSRA-unsplash.jpg' },
              { title: 'Preserving Oral Histories for Future Generations', category: 'TIPS', image: '/landing-page-images/eyo-archibong-RJo9OowwG4g-unsplash.jpg' },
              { title: 'Mapping Burial Sites: A Complete Guide', category: 'TUTORIAL', image: '/landing-page-images/joshua-duneebon-G8fEocK6g4w-unsplash.jpg' },
            ].map((article, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition group">
                <div className="relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-ancestor-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-ancestor-dark mb-2">{article.title}</h3>
                  <Link to="/signup" className="text-ancestor-primary font-semibold text-sm hover:underline inline-flex items-center gap-1">
                    READ NOW
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup CTA */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-page-images/muhammad-taha-ibrahim-HfC8mUqulJ8-unsplash.jpg" 
            alt="Heritage background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ancestor-dark/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Preserve Your Heritage?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Join thousands of families preserving their African heritage. Get started today.
          </p>
          
          <form onSubmit={handleEmailSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={emailSignup}
              onChange={(e) => setEmailSignup(e.target.value)}
              placeholder="Enter Email Address"
              required
              className="flex-1 px-6 py-4 rounded-lg border-0 focus:ring-2 focus:ring-ancestor-primary text-gray-900"
            />
            <button
              type="submit"
              className="bg-ancestor-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-ancestor-dark transition whitespace-nowrap"
            >
              Learn More
            </button>
          </form>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ancestor-dark mb-6">
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
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-ancestor-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-ancestor-dark transition"
                >
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">You can also reach us directly at:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-ancestor-primary">
              <a href="mailto:o.igboerika@alustudent.com" className="hover:text-ancestor-dark transition">
                o.igboerika@alustudent.com
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="tel:+250 792 342 75785" className="hover:text-ancestor-dark transition">
                +250 792 342 75785
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ancestor-dark text-white py-12 relative overflow-hidden">
        {/* Large Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <span className="text-[200px] font-bold">AncestorLens</span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <p className="text-gray-300 text-sm mb-4">
                Preserving African heritage for future generations through innovative technology and thoughtful design.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-xs">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-xs">X</span>
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-xs">in</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
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
                <li>
                  <Link to="/signup" className="hover:text-white transition">Sign Up</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition">Log In</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/signup" className="hover:text-white transition">Family Trees</Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white transition">Burial Sites</Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white transition">Cultural Memories</Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white transition">Archives</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © Copyright {new Date().getFullYear()} AncestorLens. All rights reserved.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-ancestor-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-ancestor-primary/80 transition"
            >
              <ArrowRight className="w-4 h-4 rotate-[-90deg]" />
              Scroll to Top
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
