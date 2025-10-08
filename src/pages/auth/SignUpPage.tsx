import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import Button from '../../components/ui/Button/Button'

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', username: '', password: '', confirmPassword: '', agreeToTerms: false })
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) return alert('Passwords do not match')
    if (!formData.agreeToTerms) return alert('Please agree to the terms and conditions')
    navigate('/dashboard')
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
            <div className="w-8 h-8 bg-ancestor-primary rounded-full flex items-center justify-center text-white font-bold">✱</div>
            <span className="text-3xl font-extrabold text-ancestor-dark">AncestorLens</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ancestor-dark leading-tight">Preserve your family’s legacy.</h1>
          <p className="mt-4 text-gray-600 max-w-md">Connect with your heritage through storytelling and shared memories.</p>
          <div className="mt-8 rounded-xl overflow-hidden border border-gray-200 bg-white">
            <img src="https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=1400&auto=format&fit=crop" alt="family" className="w-full h-72 object-cover" />
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-ancestor-dark text-center">Join our community today!</h2>
          <p className="text-center text-sm text-gray-600 mt-1">Enjoy stories, connect with heritage, and preserve your legacy.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="input-field pl-9" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="input-field pl-9" required />
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
            <Button type="submit" className="w-full">Create account</Button>
            <div className="text-center text-sm text-gray-500">or sign up with</div>
            <div className="flex items-center gap-3">
              <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-4 h-4" />
                <span className="text-sm">Google</span>
              </button>
              <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1877F2]"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.495v-9.294H9.691V11.09h3.128V8.414c0-3.1 1.893-4.79 4.658-4.79 1.325 0 2.464.099 2.796.143v3.241l-1.919.001c-1.505 0-1.797.716-1.797 1.766v2.316h3.592l-.468 3.616h-3.124V24h6.127C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z"/></svg>
                <span className="text-sm">Facebook</span>
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