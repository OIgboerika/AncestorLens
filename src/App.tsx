import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/Layout/Layout'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import FamilyTreePage from './pages/family/FamilyTreePage'
import FamilyTreeBuilderPage from './pages/family/FamilyTreeBuilderPage'
import FamilyMemberDetailsPage from './pages/family/FamilyMemberDetailsPage'
import BurialSitesPage from './pages/BurialSitesPage'
import CulturalMemoriesPage from './pages/cultural/CulturalMemoriesPage'
import CulturalMemoryDetailsPage from './pages/cultural/CulturalMemoryDetailsPage'
import UploadMemoryPage from './pages/cultural/UploadMemoryPage'
import ArchivesPage from './pages/archives/ArchivesPage'
import UploadArchivePage from './pages/archives/UploadArchivePage'
import ProfilePage from './pages/ProfilePage'
import PrivacySettingsPage from './pages/PrivacySettingsPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
          <Route path="/archives" element={<ArchivesPage />} />
          <Route path="/upload-archive" element={<UploadArchivePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy-settings" element={<PrivacySettingsPage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}