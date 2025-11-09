import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import Button from '../../components/ui/Button/Button'
import { useAuth } from '../../contexts/AuthContext'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', agreeToTerms: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.fullName)
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }
  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      // Navigate immediately after auth promise resolves (optimistic navigation)
      // Don't wait for AuthContext state update
      const authPromise = signInWithGoogle()
      // Navigate as soon as auth completes, before state updates
      await authPromise
      navigate('/dashboard')
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google')
      setLoading(false)
    }
    // Note: Don't set loading to false on success - let navigation handle it
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left hero */}
      <div className="bg-ancestor-light/40 flex items-center justify-center px-8 py-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/images/logo.png" 
              alt="AncestorLens Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-3xl font-extrabold text-ancestor-dark">AncestorLens</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ancestor-dark leading-tight">Preserve your family’s legacy.</h1>
          <p className="mt-4 text-gray-600 max-w-md">Connect with your heritage through storytelling and shared memories.</p>
          <div className="mt-8 rounded-xl overflow-hidden border border-gray-200 bg-white">
            <img 
              src="/images/auth.jpg" 
              alt="African family celebrating together" 
              className="w-full h-72 object-cover" 
            />
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-ancestor-dark text-center">Join our community today!</h2>
          <p className="text-center text-sm text-gray-600 mt-1">Enjoy stories, connect with heritage, and preserve your legacy.</p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="input-field pl-9" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input-field pl-9" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Password" className="input-field pl-9 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="input-field pl-9 pr-10" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-400">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              <label className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="#" className="text-ancestor-primary hover:text-ancestor-dark">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create account'}
            </Button>
            <div className="text-center text-sm text-gray-500">or sign up with</div>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-4 h-4" />
                <span className="text-sm">{loading ? 'Signing up...' : 'Google'}</span>
              </button>
            </div>
            <div className="text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="text-ancestor-primary hover:text-ancestor-dark">Sign in</Link></div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage