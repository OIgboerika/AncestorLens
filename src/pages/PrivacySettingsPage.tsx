import { useState } from 'react'
import { Shield, Users, Globe, Lock, Unlock, Check } from 'lucide-react'
import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'

const PrivacySettingsPage = () => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'family', // 'private', 'family', 'public'
    familyTreeAccess: 'family',
    burialSitesAccess: 'family',
    memoriesAccess: 'family',
    emailNotifications: true,
    researchNotifications: false,
    familyUpdates: true,
    marketingEmails: false,
    dataSharing: {
      allowAnalytics: true,
      allowResearch: false,
      allowThirdParty: false
    }
  })

  const handleSettingChange = (setting: string, value: any) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: value
    })
  }

  const handleDataSharingChange = (key: string, value: boolean) => {
    setPrivacySettings({
      ...privacySettings,
      dataSharing: {
        ...privacySettings.dataSharing,
        [key]: value
      }
    })
  }

  const PrivacyToggle = ({ setting, value, onChange, title, description, icon: Icon }: any) => (
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 bg-ancestor-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-ancestor-primary" />
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="flex items-center space-x-3">
          {['private', 'family', 'public'].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name={setting}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                className="h-4 w-4 text-ancestor-primary focus:ring-ancestor-primary border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
        value === 'private' ? 'bg-gray-100 text-gray-600' :
        value === 'family' ? 'bg-ancestor-light text-ancestor-primary' :
        'bg-green-100 text-green-800'
      }`}>
        {value === 'private' ? <Lock className="w-3 h-3" /> :
         value === 'family' ? <Users className="w-3 h-3" /> :
         <Globe className="w-3 h-3" />}
      </div>
    </div>
  )

  const NotificationToggle = ({ setting, value, onChange, title, description }: any) => (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={() => onChange(!value)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ancestor-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ancestor-primary"></div>
      </label>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Privacy Settings</h1>
        <p className="text-gray-600">Control who can see your family heritage data and how it's used</p>
      </div>

      {/* Profile Visibility */}
      <Card className="mb-8">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-ancestor-primary mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Profile Visibility</h2>
        </div>
        
        <PrivacyToggle
          setting="profileVisibility"
          value={privacySettings.profileVisibility}
          onChange={(value: string) => handleSettingChange('profileVisibility', value)}
          title="Profile Visibility"
          description="Control who can see your profile information and heritage contributions"
          icon={Shield}
        />
      </Card>

      {/* Data Access Control */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Access Control</h2>
        
        <div className="space-y-6">
          <PrivacyToggle
            setting="familyTreeAccess"
            value={privacySettings.familyTreeAccess}
            onChange={(value: string) => handleSettingChange('familyTreeAccess', value)}
            title="Family Tree Access"
            description="Who can view your family tree and member information"
            icon={Users}
          />
          
          <PrivacyToggle
            setting="burialSitesAccess"
            value={privacySettings.burialSitesAccess}
            onChange={(value: string) => handleSettingChange('burialSitesAccess', value)}
            title="Burial Sites Access"
            description="Who can see and visit the burial sites you've mapped"
            icon={Globe}
          />
          
          <PrivacyToggle
            setting="memoriesAccess"
            value={privacySettings.memoriesAccess}
            onChange={(value: string) => handleSettingChange('memoriesAccess', value)}
            title="Cultural Memories Access"
            description="Who can listen to and download your uploaded cultural memories"
            icon={Shield}
          />
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
        
        <div className="space-y-6">
          <NotificationToggle
            setting="emailNotifications"
            value={privacySettings.emailNotifications}
            onChange={(value: boolean) => handleSettingChange('emailNotifications', value)}
            title="Email Notifications"
            description="Receive updates about your heritage activities and family contributions"
          />
          
          <NotificationToggle
            setting="researchNotifications"
            value={privacySettings.researchNotifications}
            onChange={(value: boolean) => handleSettingChange('researchNotifications', value)}
            title="Research Participation"
            description="Allow researchers to contact you about potential genealogical research"
          />
          
          <NotificationToggle
            setting="familyUpdates"
            value={privacySettings.familyUpdates}
            onChange={(value: boolean) => handleSettingChange('familyUpdates', value)}
            title="Family Updates"
            description="Get notified when family members add new information or memories"
          />
          
          <NotificationToggle
            setting="marketingEmails"
            value={privacySettings.marketingEmails}
            onChange={(value: boolean) => handleSettingChange('marketingEmails', value)}
            title="Marketing Communications"
            description="Receive updates about new features, tips, and heritage preservation events"
          />
        </div>
      </Card>

      {/* Data Sharing */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Sharing & Analytics</h2>
        
        <div className="space-y-6">
          <NotificationToggle
            setting="allowAnalytics"
            value={privacySettings.dataSharing.allowAnalytics}
            onChange={(value: boolean) => handleDataSharingChange('allowAnalytics', value)}
            title="Usage Analytics"
            description="Help us improve AncestorLens by sharing anonymous usage data"
          />
          
          <NotificationToggle
            setting="allowResearch"
            value={privacySettings.dataSharing.allowResearch}
            onChange={(value: boolean) => handleDataSharingChange('allowResearch', value)}
            title="Academic Research"
            description="Allow anonymized data to be used for academic genealogical research"
          />
          
          <NotificationToggle
            setting="allowThirdParty"
            value={privacySettings.dataSharing.allowThirdParty}
            onChange={(value: boolean) => handleDataSharingChange('allowThirdParty', value)}
            title="Third-Party Services"
            description="Share anonymized insights with partner organizations (charities, cultural institutions)"
          />
        </div>
      </Card>

      {/* Privacy Level Indicator */}
      <Card>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Status: Protected</h3>
          <p className="text-gray-600 mb-6">
            Your data is secure and protected according to our privacy policy. 
            You have full control over what information is shared and with whom.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              Download My Data
            </Button>
            <Button variant="outline">
              View Privacy Policy
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end mt-8">
        <Button size="lg" className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Save Privacy Settings</span>
        </Button>
      </div>
    </div>
  )
}

export default PrivacySettingsPage