import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'

interface FamilyMember {
  id: number
  name: string
  role: 'Living' | 'Deceased'
  birthYear?: string
  deathYear?: string
  location?: string
  relationship: string
  hasChildren?: boolean
  hasParents?: boolean
  image?: string
}

export default function FamilyTreePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [scale, setScale] = useState(1)
  const [hideMock, setHideMock] = useState<boolean>(() => localStorage.getItem('hideMockFamily') === 'true')
  const [familyData, setFamilyData] = useState<{ grandparents: FamilyMember[]; parents: FamilyMember[]; currentGeneration: FamilyMember[]; children: FamilyMember[] }>({
    currentGeneration: [
      { id: 1, name: 'John Doe', role: 'Living', birthYear: '1980', location: 'Lagos, Nigeria', relationship: 'Self', hasChildren: true, hasParents: true, image: '' },
    ],
    parents: [
      { id: 2, name: 'Michael Doe', role: 'Deceased', birthYear: '1955', deathYear: '2020', location: 'Enugu, Nigeria', relationship: 'Father', hasChildren: true, hasParents: false, image: '' },
      { id: 3, name: 'Grace Doe', role: 'Living', birthYear: '1960', location: 'Enugu, Nigeria', relationship: 'Mother', hasChildren: true, hasParents: false, image: '' },
    ],
    grandparents: [
      { id: 4, name: 'Samuel Doe', role: 'Deceased', birthYear: '1925', deathYear: '1995', location: 'Abuja, Nigeria', relationship: 'Paternal Grandfather', hasChildren: true, hasParents: false, image: '' },
      { id: 5, name: 'Mary Doe', role: 'Deceased', birthYear: '1930', deathYear: '2000', location: 'Abuja, Nigeria', relationship: 'Paternal Grandmother', hasChildren: true, hasParents: false, image: '' },
    ],
    children: [
      { id: 6, name: 'David Doe', role: 'Living', birthYear: '2005', location: 'Lagos, Nigeria', relationship: 'Son', hasChildren: false, hasParents: true, image: '' },
      { id: 7, name: 'Sarah Doe', role: 'Living', birthYear: '2008', location: 'Lagos, Nigeria', relationship: 'Daughter', hasChildren: false, hasParents: true, image: '' },
    ],
  })
  const navigate = useNavigate()

  // Helper to load family members respecting hideMock setting
  const loadFamilyMembers = () => {
      const savedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]')
      console.log('Family Tree - Loaded saved members:', savedMembers)
      
      // Get existing mock members
      const mockMembers = {
        currentGeneration: [
          { id: 1, name: 'John Doe', role: 'Living' as const, birthYear: '1980', location: 'Lagos, Nigeria', relationship: 'Self', hasChildren: true, hasParents: true, image: '' },
        ],
        parents: [
          { id: 2, name: 'Michael Doe', role: 'Deceased' as const, birthYear: '1955', deathYear: '2020', location: 'Enugu, Nigeria', relationship: 'Father', hasChildren: true, hasParents: false, image: '' },
          { id: 3, name: 'Grace Doe', role: 'Living' as const, birthYear: '1960', location: 'Enugu, Nigeria', relationship: 'Mother', hasChildren: true, hasParents: false, image: '' },
        ],
        grandparents: [
          { id: 4, name: 'Samuel Doe', role: 'Deceased' as const, birthYear: '1925', deathYear: '1995', location: 'Abuja, Nigeria', relationship: 'Paternal Grandfather', hasChildren: true, hasParents: false, image: '' },
          { id: 5, name: 'Mary Doe', role: 'Deceased' as const, birthYear: '1930', deathYear: '2000', location: 'Abuja, Nigeria', relationship: 'Paternal Grandmother', hasChildren: true, hasParents: false, image: '' },
        ],
        children: [
          { id: 6, name: 'David Doe', role: 'Living' as const, birthYear: '2005', location: 'Lagos, Nigeria', relationship: 'Son', hasChildren: false, hasParents: true, image: '' },
          { id: 7, name: 'Sarah Doe', role: 'Living' as const, birthYear: '2008', location: 'Lagos, Nigeria', relationship: 'Daughter', hasChildren: false, hasParents: true, image: '' },
        ],
      }
      
      let mergedData: { grandparents: FamilyMember[]; parents: FamilyMember[]; currentGeneration: FamilyMember[]; children: FamilyMember[] }
      
      if (hideMock) {
        // Use only saved members, grouped by relationship
        mergedData = {
          currentGeneration: savedMembers.filter((m: FamilyMember) => ['Self', 'Husband', 'Partner'].includes(m.relationship)),
          parents: savedMembers.filter((m: FamilyMember) => ['Father', 'Mother'].includes(m.relationship)),
          grandparents: savedMembers.filter((m: FamilyMember) => ['Paternal Grandfather', 'Paternal Grandmother', 'Maternal Grandfather', 'Maternal Grandmother', 'Grandfather', 'Grandmother'].includes(m.relationship)),
          children: savedMembers.filter((m: FamilyMember) => ['Son', 'Daughter', 'Grandson', 'Granddaughter'].includes(m.relationship)),
        }
      } else {
        // Merge saved members with mock members, avoiding duplicates
        mergedData = {
          currentGeneration: [
            ...mockMembers.currentGeneration, 
            ...savedMembers.filter((m: FamilyMember) => 
              ['Self', 'Husband', 'Partner'].includes(m.relationship) && 
              !mockMembers.currentGeneration.some(existing => existing.id === m.id)
            )
          ],
          parents: [
            ...mockMembers.parents, 
            ...savedMembers.filter((m: FamilyMember) => 
              ['Father', 'Mother'].includes(m.relationship) && 
              !mockMembers.parents.some(existing => existing.id === m.id)
            )
          ],
          grandparents: [
            ...mockMembers.grandparents, 
            ...savedMembers.filter((m: FamilyMember) => 
              ['Paternal Grandfather', 'Paternal Grandmother', 'Maternal Grandfather', 'Maternal Grandmother', 'Grandfather', 'Grandmother'].includes(m.relationship) && 
              !mockMembers.grandparents.some(existing => existing.id === m.id)
            )
          ],
          children: [
            ...mockMembers.children, 
            ...savedMembers.filter((m: FamilyMember) => 
              ['Son', 'Daughter', 'Grandson', 'Granddaughter'].includes(m.relationship) && 
              !mockMembers.children.some(existing => existing.id === m.id)
            )
          ],
        }
      }
      
      console.log('Family Tree - Merged data:', mergedData)
      setFamilyData(mergedData)
  }

  // Load family members from localStorage on component mount and when component becomes visible
  useEffect(() => {
    loadFamilyMembers()
    
    // Listen for storage changes (when new members are added)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'familyMembers') {
        loadFamilyMembers()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also refresh when the page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadFamilyMembers()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [hideMock])

  const familyStats = useMemo(() => ({
    totalMembers: familyData.grandparents.length + familyData.parents.length + familyData.currentGeneration.length + familyData.children.length,
    livingMembers: [...familyData.grandparents, ...familyData.parents, ...familyData.currentGeneration, ...familyData.children].filter(m => m.role === 'Living').length,
    deceasedMembers: [...familyData.grandparents, ...familyData.parents, ...familyData.currentGeneration, ...familyData.children].filter(m => m.role === 'Deceased').length,
    generations: 4,
  }), [familyData])

  const Node = ({ member }: { member: FamilyMember }) => {
    const initials = member.name.split(' ').map(n => n[0]).join('')
    const hasImage = Boolean(member.image)
    const ringColor = member.role === 'Living' ? 'ring-green-500' : 'ring-gray-400'

    const subtitle = member.deathYear
      ? `${member.birthYear} – ${member.deathYear}`
      : member.birthYear
        ? `Born ${member.birthYear}`
        : member.role

    return (
      <button
        onClick={() => navigate(`/family-tree/member/${member.id}`, { state: { member } })}
        className="group relative flex flex-col items-center"
        title={`${member.name} • ${member.relationship}`}
      >
        <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full ring-2 ${ringColor} ring-offset-2 overflow-hidden bg-gray-200 flex items-center justify-center`}
          style={hasImage ? { backgroundImage: `url(${member.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          {!hasImage && <span className="text-gray-600 font-semibold text-xs sm:text-sm">{initials}</span>}
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs sm:text-sm font-medium text-gray-900 leading-tight max-w-[120px] sm:max-w-[140px] lg:max-w-[160px] truncate">{member.name}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </button>
    )
  }

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ancestor-dark mb-2">Family Tree</h1>
          <p className="text-gray-600">Explore your family history and connections</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <Button variant="outline" onClick={() => setScale(s => clamp(parseFloat((s - 0.1).toFixed(2)), 0.5, 2))} className="px-2 py-2"><ZoomOut className="w-4 h-4" /></Button>
            <Button variant="outline" onClick={() => setScale(s => clamp(parseFloat((s + 0.1).toFixed(2)), 0.5, 2))} className="px-2 py-2"><ZoomIn className="w-4 h-4" /></Button>
          </div>
        <Button
          variant="outline"
          onClick={() => {
            const next = !hideMock
            setHideMock(next)
            localStorage.setItem('hideMockFamily', String(next))
          }}
        >
          {hideMock ? 'Show Mock Data' : 'Hide Mock Data'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (confirm('This will clear all your added family members. Continue?')) {
              localStorage.removeItem('familyMembers')
              loadFamilyMembers()
            }
          }}
        >
          Reset Tree
        </Button>
          <Link to="/family-tree/builder">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Member</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search family members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="input-field">
                  <option value="">All</option>
                  <option value="living">Living</option>
                  <option value="deceased">Deceased</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Generation</label>
                <select className="input-field">
                  <option value="">All Generations</option>
                  <option value="current">Current</option>
                  <option value="parents">Parents</option>
                  <option value="grandparents">Grandparents</option>
                  <option value="children">Children</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select className="input-field">
                  <option value="">All Locations</option>
                  <option value="lagos">Lagos</option>
                  <option value="enugu">Enugu</option>
                  <option value="abuja">Abuja</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Main content with right stats sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tree Canvas */}
        <Card className="lg:col-span-9 overflow-auto">
          <div className="relative min-w-[600px] sm:min-w-[800px] lg:min-w-[900px] py-10">
            {/* Zoomable content wrapper */}
            <div className="origin-center" style={{ transform: `scale(${scale})` }}>
              {/* Grandparents row */}
              <div className="flex justify-center gap-12 sm:gap-16 lg:gap-24 relative">
                {familyData.grandparents.map((m) => (
                  <div key={m.id} className="flex flex-col items-center">
                    <Node member={m} />
                  </div>
                ))}
              </div>
              {/* straight connectors */}
              <div className="flex justify-center items-center mt-2">
                <div className="h-6 w-px bg-gray-400"></div>
                <div className="mx-6 h-px w-56 bg-gray-400"></div>
                <div className="h-6 w-px bg-gray-400"></div>
              </div>

              {/* Parents row */}
              <div className="mt-4 flex justify-center gap-24 sm:gap-32 lg:gap-48 relative">
                {familyData.parents.map((m) => (
                  <div key={m.id} className="flex flex-col items-center">
                    <Node member={m} />
                  </div>
                ))}
              </div>

              {/* connector to current */}
              <div className="flex justify-center mt-2">
                <div className="h-6 w-px bg-gray-400"></div>
              </div>

              {/* Current generation */}
              <div className="mt-4 flex justify-center">
                {familyData.currentGeneration.map((m) => (
                  <div key={m.id} className="flex flex-col items-center">
                    <Node member={m} />
                  </div>
                ))}
              </div>

              {/* connectors to children */}
              {familyData.children.length > 0 && (
                <>
                  <div className="flex justify-center items-center mt-2">
                    <div className="h-6 w-px bg-gray-400"></div>
                    <div className="mx-6 h-px w-48 bg-gray-400"></div>
                    <div className="h-6 w-px bg-gray-400"></div>
                  </div>
                  <div className="mt-4 flex justify-center gap-16 sm:gap-24 lg:gap-32">
                    {familyData.children.map((m) => (
                      <div key={m.id} className="flex flex-col items-center">
                        <Node member={m} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Right sidebar stats */}
        <div className="lg:col-span-3 space-y-4">
          <Card hoverable={false}>
            <div className="text-center">
              <Users className="w-8 h-8 text-ancestor-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-ancestor-primary">{familyStats.totalMembers}</p>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="text-center">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{familyStats.livingMembers}</p>
              <p className="text-sm text-gray-600">Living</p>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="text-center">
              <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-600">{familyStats.deceasedMembers}</p>
              <p className="text-sm text-gray-600">Deceased</p>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="text-center">
              <Calendar className="w-8 h-8 text-ancestor-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-ancestor-secondary">{familyStats.generations}</p>
              <p className="text-sm text-gray-600">Generations</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}