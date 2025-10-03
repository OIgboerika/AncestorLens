import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'
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

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/family-tree" element={<Layout><FamilyTreePage /></Layout>} />
      <Route path="/family-tree/builder" element={<Layout><FamilyTreeBuilderPage /></Layout>} />
      <Route path="/family-tree/member/:id" element={<Layout><FamilyMemberDetailsPage /></Layout>} />
      <Route path="/burial-sites" element={<Layout><BurialSitesPage /></Layout>} />
      <Route path="/cultural-memories" element={<Layout><CulturalMemoriesPage /></Layout>} />
      <Route path="/cultural-memories/:id" element={<Layout><CulturalMemoryDetailsPage /></Layout>} />
      <Route path="/upload-memory" element={<Layout><UploadMemoryPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/privacy-settings" element={<Layout><PrivacySettingsPage /></Layout>} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App