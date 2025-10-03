import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import DashboardPage from './pages/DashboardPage'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ancestor-light to-white flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">𝔘</span>
        </div>
        <h1 className="text-4xl font-bold text-ancestor-dark mb-3">AncestorLens</h1>
        <p className="text-gray-600 mb-8">Preserving African Heritage</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/signup" className="btn-primary">Sign Up</Link>
          <Link to="/login" className="btn-secondary">Log In</Link>
          <Link to="/dashboard" className="text-ancestor-primary hover:text-ancestor-dark font-medium">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  )
}

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-ancestor-dark mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Sign in to continue</p>
        <input type="email" placeholder="Email" className="input-field mb-3" />
        <input type="password" placeholder="Password" className="input-field mb-4" />
        <button className="btn-primary w-full">Sign In</button>
        <p className="text-sm text-gray-600 mt-4 text-center">
          No account? <Link to="/signup" className="text-ancestor-primary hover:text-ancestor-dark">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-ancestor-dark mb-2">Create Account</h2>
        <p className="text-gray-600 mb-6">Start preserving your heritage</p>
        <input type="text" placeholder="Full name" className="input-field mb-3" />
        <input type="email" placeholder="Email" className="input-field mb-3" />
        <input type="password" placeholder="Password" className="input-field mb-4" />
        <button className="btn-primary w-full">Create Account</button>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Have an account? <Link to="/login" className="text-ancestor-primary hover:text-ancestor-dark">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Layout parent with Outlet */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}