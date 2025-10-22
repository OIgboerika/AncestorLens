import { useState, useEffect } from 'react'
import { User, Lock, Trash2, AlertTriangle } from 'lucide-react'
import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'
import { useAuth } from '../contexts/AuthContext'

export default function AccountSettingsPage() {
  const { user, signOut } = useAuth()
  const [accountData, setAccountData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Load account data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('accountSettings')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setAccountData(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.warn('Failed to load saved account settings:', error)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAccountData(prev => ({ ...prev, [name]: value }))
  }

  const saveAccountSettings = async () => {
    setSaving(true)
    try {
      // Save to localStorage (in a real app, this would save to Firestore)
      localStorage.setItem('accountSettings', JSON.stringify({
        displayName: accountData.displayName,
        phone: accountData.phone,
      }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save account settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      // In a real app, this would delete the account from Firestore
      localStorage.removeItem('accountSettings')
      localStorage.removeItem('privacySettings')
      localStorage.removeItem('culturalMemories')
      localStorage.removeItem('burialSites')
      localStorage.removeItem('familyMembers')
      localStorage.removeItem('familyTreeLayout')
      
      alert('Account deletion initiated. You will be logged out.')
      signOut()
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert('Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-ancestor-dark mb-6">Account Settings</h1>

      {/* Profile Information */}
      <Card className="mb-6">
        <div className="flex items-center mb-6">
          <User className="w-5 h-5 text-ancestor-primary mr-3" />
          <h2 className="text-xl font-semibold text-ancestor-dark">Profile Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={accountData.displayName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your display name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={accountData.email}
              disabled
              className="input-field bg-gray-50"
              placeholder="Email address"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={accountData.phone}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </Card>

      {/* Password Settings */}
      <Card className="mb-6">
        <div className="flex items-center mb-6">
          <Lock className="w-5 h-5 text-ancestor-primary mr-3" />
          <h2 className="text-xl font-semibold text-ancestor-dark">Password Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={accountData.currentPassword}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={accountData.newPassword}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={accountData.confirmPassword}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm">
            Change Password
          </Button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="mb-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
          <h2 className="text-xl font-semibold text-ancestor-dark">Danger Zone</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-medium text-red-800">Delete Account</h3>
              <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
            </div>
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          className="px-8" 
          onClick={saveAccountSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete your account? This will permanently remove:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                <li>All family tree data</li>
                <li>All cultural memories</li>
                <li>All burial site information</li>
                <li>All account settings</li>
              </ul>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button 
                variant="outline"
                className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
