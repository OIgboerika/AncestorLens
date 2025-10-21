import { Routes, Route, Navigate, Link } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/Layout/Layout'
import DashboardPage from './pages/DashboardPage'
import FamilyTreePage from './pages/family/FamilyTreePage'
import FamilyTreeBuilderPage from './pages/family/FamilyTreeBuilderPage'
import FamilyMemberDetailsPage from './pages/family/FamilyMemberDetailsPage'
import BurialSitesPage from './pages/BurialSitesPage'
import CulturalMemoriesPage from './pages/cultural/CulturalMemoriesPage'
import CulturalMemoryDetailsPage from './pages/cultural/CulturalMemoryDetailsPage'
import UploadMemoryPage from './pages/cultural/UploadMemoryPage'
import ProfilePage from './pages/ProfilePage'
import PrivacySettingsPage from './pages/PrivacySettingsPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'

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

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected routes with Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/family-tree" element={<FamilyTreePage />} />
          <Route path="/family-tree/builder" element={<FamilyTreeBuilderPage />} />
          <Route path="/family-tree/member/:id" element={<FamilyMemberDetailsPage />} />
          <Route path="/burial-sites" element={<BurialSitesPage />} />
          <Route path="/cultural-memories" element={<CulturalMemoriesPage />} />
          <Route path="/cultural-memories/:id" element={<CulturalMemoryDetailsPage />} />
          <Route path="/upload-memory" element={<UploadMemoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy-settings" element={<PrivacySettingsPage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}