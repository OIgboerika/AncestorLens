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

  // Load family members from localStorage on component mount and when component becomes visible
  useEffect(() => {
    const loadFamilyMembers = () => {
      const savedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]')
      
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
      
      // Merge saved members with mock members, avoiding duplicates
      const mergedData = {
        currentGeneration: [...mockMembers.currentGeneration, ...savedMembers.filter((m: FamilyMember) => m.relationship === 'Self' && !mockMembers.currentGeneration.some(existing => existing.id === m.id))],
        parents: [...mockMembers.parents, ...savedMembers.filter((m: FamilyMember) => ['Father', 'Mother'].includes(m.relationship) && !mockMembers.parents.some(existing => existing.id === m.id))],
        grandparents: [...mockMembers.grandparents, ...savedMembers.filter((m: FamilyMember) => ['Paternal Grandfather', 'Paternal Grandmother', 'Maternal Grandfather', 'Maternal Grandmother'].includes(m.relationship) && !mockMembers.grandparents.some(existing => existing.id === m.id))],
        children: [...mockMembers.children, ...savedMembers.filter((m: FamilyMember) => ['Son', 'Daughter'].includes(m.relationship) && !mockMembers.children.some(existing => existing.id === m.id))],
      }
      
      setFamilyData(mergedData)
    }
    
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
  }, [])

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
        onClick={() => navigate(`/family-tree/member/${member.id}`)}
        className="group relative flex flex-col items-center"
        title={`${member.name} • ${member.relationship}`}
      >
        <div className={`w-16 h-16 rounded-full ring-2 ${ringColor} ring-offset-2 overflow-hidden bg-gray-200 flex items-center justify-center`}
          style={hasImage ? { backgroundImage: `url(${member.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          {!hasImage && <span className="text-gray-600 font-semibold">{initials}</span>}
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-900 leading-tight max-w-[160px] truncate">{member.name}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </button>
    )
  }

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Family Tree</h1>
          <p className="text-gray-600">Explore your family history and connections</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <Button variant="outline" onClick={() => setScale(s => clamp(parseFloat((s - 0.1).toFixed(2)), 0.5, 2))} className="px-2 py-2"><ZoomOut className="w-4 h-4" /></Button>
            <Button variant="outline" onClick={() => setScale(s => clamp(parseFloat((s + 0.1).toFixed(2)), 0.5, 2))} className="px-2 py-2"><ZoomIn className="w-4 h-4" /></Button>
          </div>
          <Link to="/family-tree/builder">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search family members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex sm:hidden items-center gap-2">
            <Button variant="outline" onClick={() => setScale(s => clamp(parseFloat((s - 0.1).toFixed(2)), 0.5, 2))} className="px-2 py-2"><ZoomOut className="w-4 h-4" /></Button>
            <Button variant="outline" onClick={() => setScale(s => clamp(parseFloat((s + 0.1).toFixed(2)), 0.5, 2))} className="px-2 py-2"><ZoomIn className="w-4 h-4" /></Button>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>
      </Card>

      {/* Main content with right stats sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tree Canvas */}
        <Card className="lg:col-span-9 overflow-auto">
          <div className="relative min-w-[900px] py-10">
            {/* Zoomable content wrapper */}
            <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
              {/* Grandparents row */}
              <div className="flex justify-center gap-24 relative">
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
              <div className="mt-4 flex justify-center gap-48 relative">
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
                  <div className="mt-4 flex justify-center gap-32">
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