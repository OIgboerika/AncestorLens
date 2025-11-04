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
    <div className="min-h-screen bg-gradient-to-b from-white via-ancestor-light/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero */}
        <div className="text-center">
          <img
            src="/images/logo.png"
            alt="AncestorLens logo"
            className="h-14 md:h-16 mx-auto mb-6 select-none"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ancestor-dark mb-4">
            A place to preserve your heritage
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Preserve African heritage through interactive family trees, burial site mapping,
            and cultural memories — built for African families and traditions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-ancestor-primary text-white px-6 py-3 text-base md:text-lg font-semibold shadow-sm hover:bg-ancestor-dark transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg border border-ancestor-primary text-ancestor-primary px-6 py-3 text-base md:text-lg font-semibold hover:bg-ancestor-primary/10 transition"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Stacked showcase (images) */}
        <div className="mt-14 md:mt-20">
          <div className="relative mx-auto max-w-5xl h-80 md:h-96">
            {/* Images served from /public/landing-page-images/ */}
            <img src="/landing-page-images/abazie-uchenna-fedE6gJVSRA-unsplash.jpg" alt="Showcase 1" className="absolute left-4 top-8 w-40 md:w-56 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[-6deg]" />
            <img src="/landing-page-images/eyo-archibong-RJo9OowwG4g-unsplash.jpg" alt="Showcase 2" className="absolute left-36 md:left-56 top-2 w-44 md:w-64 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[4deg]" />
            <img src="/landing-page-images/joshua-duneebon-G8fEocK6g4w-unsplash.jpg" alt="Showcase 3" className="absolute left-64 md:left-[26rem] top-10 w-40 md:w-56 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[-2deg]" />
            <img src="/landing-page-images/lisa-marie-theck-igdYA2SwV8E-unsplash.jpg" alt="Showcase 4" className="absolute left-12 md:left-24 top-40 md:top-48 w-44 md:w-64 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[3deg]" />
            <img src="/landing-page-images/muhammad-taha-ibrahim-HfC8mUqulJ8-unsplash.jpg" alt="Showcase 5" className="absolute left-60 md:left-[22rem] top-48 md:top-56 w-40 md:w-56 aspect-[4/3] object-cover rounded-2xl shadow-xl rotate-[-5deg]" />
          </div>
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