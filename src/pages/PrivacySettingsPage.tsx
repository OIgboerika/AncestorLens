import Card from '../components/ui/Card/Card'
import Button from '../components/ui/Button/Button'
import { Shield, Users, Globe, Database } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState({
    profileVisibility: 'family',
    familyTreeAccess: 'family',
    burialSitesAccess: 'family',
    memoriesAccess: 'family',
    emailNotifications: true,
    researchNotifications: false,
    familyUpdates: true,
    marketingEmails: false,
    allowAnalytics: true,
    allowResearch: false,
    allowThirdParty: false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('privacySettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.warn('Failed to load saved privacy settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = async () => {
    setSaving(true)
    try {
      localStorage.setItem('privacySettings', JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000) // Hide success message after 2 seconds
    } catch (error) {
      console.error('Failed to save privacy settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const setVis = (key: 'profileVisibility'|'familyTreeAccess'|'burialSitesAccess'|'memoriesAccess', value: string) => setSettings(s => ({ ...s, [key]: value }))

  const RadioRow = ({ title, desc, icon: Icon, value, onChange }: { title: string, desc: string, icon: any, value: string, onChange: (v:string)=>void }) => (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-ancestor-primary/10 text-ancestor-primary flex items-center justify-center"><Icon className="w-5 h-5" /></div>
      <div className="flex-1">
        <h4 className="font-medium text-ancestor-dark">{title}</h4>
        <p className="text-sm text-gray-600 mb-2">{desc}</p>
        <div className="flex items-center gap-4 text-sm">
          {['private','family','public'].map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" checked={value===opt} onChange={() => onChange(opt)} className="text-ancestor-primary" />
              <span className="capitalize">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const ToggleRow = ({ title, desc, value, onChange }: { title: string, desc: string, value: boolean, onChange:()=>void }) => (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium text-ancestor-dark">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition ${value ? 'bg-ancestor-primary' : 'bg-gray-300'}`}>
        <span className={`block w-5 h-5 bg-white rounded-full transform transition ${value ? 'translate-x-5' : 'translate-x-1'} mt-0.5`} />
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-ancestor-dark mb-6">Privacy Settings</h1>

      <Card className="mb-6">
        <div className="flex items-center mb-6"><Shield className="w-5 h-5 text-ancestor-primary mr-3" /><h2 className="text-xl font-semibold text-ancestor-dark">Profile Visibility</h2></div>
        <RadioRow title="Profile Visibility" desc="Control who can see your profile and contributions" icon={Shield} value={settings.profileVisibility} onChange={(v)=>setVis('profileVisibility', v)} />
      </Card>

      <Card className="mb-6">
        <div className="flex items-center mb-6"><Database className="w-5 h-5 text-ancestor-primary mr-3" /><h2 className="text-xl font-semibold text-ancestor-dark">Data Access Control</h2></div>
        <div className="space-y-6">
          <RadioRow title="Family Tree Access" desc="Who can view your family tree and member information" icon={Users} value={settings.familyTreeAccess} onChange={(v)=>setVis('familyTreeAccess', v)} />
          <RadioRow title="Burial Sites Access" desc="Who can see mapped burial sites" icon={Globe} value={settings.burialSitesAccess} onChange={(v)=>setVis('burialSitesAccess', v)} />
          <RadioRow title="Cultural Memories Access" desc="Who can listen to your uploaded memories" icon={Shield} value={settings.memoriesAccess} onChange={(v)=>setVis('memoriesAccess', v)} />
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Notification Preferences</h2>
        <div className="space-y-6">
          <ToggleRow title="Email Notifications" desc="Get updates about activity and contributions" value={settings.emailNotifications} onChange={()=>setSettings(s=>({...s,emailNotifications:!s.emailNotifications}))} />
          <ToggleRow title="Research Participation" desc="Allow researchers to contact you" value={settings.researchNotifications} onChange={()=>setSettings(s=>({...s,researchNotifications:!s.researchNotifications}))} />
          <ToggleRow title="Family Updates" desc="Notify me when family members add new info" value={settings.familyUpdates} onChange={()=>setSettings(s=>({...s,familyUpdates:!s.familyUpdates}))} />
          <ToggleRow title="Marketing Communications" desc="Receive news about features and events" value={settings.marketingEmails} onChange={()=>setSettings(s=>({...s,marketingEmails:!s.marketingEmails}))} />
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Data Sharing & Analytics</h2>
        <div className="space-y-6">
          <ToggleRow title="Usage Analytics" desc="Help improve AncestorLens by sharing anonymous usage data" value={settings.allowAnalytics} onChange={()=>setSettings(s=>({...s,allowAnalytics:!s.allowAnalytics}))} />
          <ToggleRow title="Academic Research" desc="Allow anonymized data for academic research" value={settings.allowResearch} onChange={()=>setSettings(s=>({...s,allowResearch:!s.allowResearch}))} />
          <ToggleRow title="Third-Party Services" desc="Share anonymized insights with partner institutions" value={settings.allowThirdParty} onChange={()=>setSettings(s=>({...s,allowThirdParty:!s.allowThirdParty}))} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button 
          className="px-8" 
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}