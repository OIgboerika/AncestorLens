import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions')
      return
    }
    // Placeholder for signup logic
    console.log('Signup data:', formData)
    navigate('/dashboard')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ancestor-light to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="text-left">
          <Link
            to="/login"
            className="inline-flex items-center text-ancestor-primary hover:text-ancestor-dark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">𝔘</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-ancestor-dark mb-2">Create Account</h2>
          <p className="text-gray-600">Start preserving your family heritage</p>
        </div>

        {/* Sign Up Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-ancestor-primary focus:ring-ancestor-primary border-gray-300 rounded"
              required
            />
            <span className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-ancestor-primary hover:text-ancestor-dark">Terms of Service</a> and <a href="#" className="text-ancestor-primary hover:text-ancestor-dark">Privacy Policy</a>
            </span>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Create Account
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-ancestor-primary hover:text-ancestor-dark">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage