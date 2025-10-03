import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for login logic
    console.log('Login data:', formData)
    navigate('/dashboard')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ancestor-light to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">𝔘</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-ancestor-dark mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue preserving your heritage</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-ancestor-primary focus:ring-ancestor-primary border-gray-300 rounded" />
              <span className="ml-2 block text-sm text-gray-700">Remember me</span>
            </label>
            <Link to="#" className="text-sm text-ancestor-primary hover:text-ancestor-dark">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Sign In
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="font-medium text-ancestor-primary hover:text-ancestor-dark">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage