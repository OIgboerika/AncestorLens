import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Button from '../../components/ui/Button/Button'
import { useAuth } from '../../contexts/AuthContext'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithGoogle } = useAuth()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(formData.email, formData.password)
      navigate(from, { replace: true })
    } catch (error: any) {
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }
  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      navigate(from, { replace: true })
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left hero */}
      <div className="bg-ancestor-light/40 flex items-center justify-center px-8 py-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-ancestor-primary rounded-full flex items-center justify-center text-white font-bold">✱</div>
            <span className="text-3xl font-extrabold text-ancestor-dark">AncestorLens</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ancestor-dark leading-tight">Welcome Back to AncestorLens.</h1>
          <p className="mt-4 text-gray-600 max-w-md">Continue exploring your family's rich heritage and stories.</p>
          <div className="mt-8 rounded-xl overflow-hidden border border-gray-200 bg-white">
            <img src="https://images.unsplash.com/photo-1619963258839-c72a9f9d9e20?q=80&w=1400&auto=format&fit=crop" alt="storytelling" className="w-full h-72 object-cover" />
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-ancestor-dark text-center">Sign in to your account</h2>
          <p className="text-center text-sm text-gray-600 mt-1">Unlock your ancestral journey.</p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="input-field pl-9" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Enter your password" className="input-field pl-9 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="text-right">
              <Link to="#" className="text-sm text-ancestor-primary hover:text-ancestor-dark">Forgot password?</Link>
            </div>
          </form>

          <div className="relative my-6">
            <div className="border-t border-gray-200" />
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-500">OR</span>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-4 h-4" />
              <span className="text-sm">{loading ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">Don't have an account? <Link to="/signup" className="text-ancestor-primary hover:text-ancestor-dark">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage