import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  ZoomIn,
  ZoomOut,
  UserPlus,
  Layout,
  Move
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'
import { useAuth } from '../../contexts/AuthContext'
import { familyService } from '../../firebase/services/familyService'
import DraggableFamilyTree from '../../components/family/DraggableFamilyTree'
import FamilyMemberMap from '../../components/maps/FamilyMemberMap'

interface FamilyMember {
  id: number | string
  name: string
  role: 'Living' | 'Deceased'
  birthYear?: string
  deathYear?: string
  location?: string
  coordinates?: { lat: number; lng: number }
  relationship: string
  parentId?: string | number
  hasChildren?: boolean
  hasParents?: boolean
  image?: string
  gender?: string
}

export default function FamilyTreePage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [scale, setScale] = useState(1)
  const [hideMock] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'static' | 'draggable'>('static')
  const [familyData, setFamilyData] = useState<{ grandparents: FamilyMember[]; parents: FamilyMember[]; currentGeneration: FamilyMember[]; children: FamilyMember[]; allMembers: FamilyMember[] }>({
    currentGeneration: [],
    parents: [],
    grandparents: [],
    children: [],
    allMembers: []
  })
  const navigate = useNavigate()

  // Helper to build family tree based on proper generational hierarchy with parent-child connections
  const buildFamilyTree = (members: FamilyMember[]) => {
    if (members.length === 0) return { grandparents: [], parents: [], currentGeneration: [], children: [], allMembers: [] }

    // Find the root member (Self)
    const rootMember = members.find(m => m.relationship === 'Self')
    if (!rootMember) return { grandparents: [], parents: [], currentGeneration: [], children: [], allMembers: [] }

    // Build generations properly based on relationships and parentId connections
    const grandparents: FamilyMember[] = []
    const parentsGeneration: FamilyMember[] = [] // Combined parents and their siblings (uncles/aunts)
    const currentGeneration: FamilyMember[] = []
    const children: FamilyMember[] = []

    // First, categorize by relationship type
    members.forEach(member => {
      switch (member.relationship) {
        case 'Grandfather':
        case 'Grandmother':
        case 'Paternal Grandfather':
        case 'Paternal Grandmother':
        case 'Maternal Grandfather':
        case 'Maternal Grandmother':
          grandparents.push(member)
          break
        
        case 'Father':
        case 'Mother':
        case 'Uncle':
        case 'Aunt':
          // Parents and their siblings (uncles/aunts) are in the same generation
          parentsGeneration.push(member)
          break
        
        case 'Self':
        case 'Brother':
        case 'Sister':
        case 'Husband':
        case 'Wife':
        case 'Spouse':
        case 'Partner':
          currentGeneration.push(member)
          break
        
        case 'Son':
        case 'Daughter':
        case 'Child':
        case 'Grandson':
        case 'Granddaughter':
          children.push(member)
          break
        
        default:
          // For other relationships, try to determine generation based on parentId
          if (member.parentId) {
            const parent = members.find(p => p.id === member.parentId)
            if (parent) {
              if (['Father', 'Mother'].includes(parent.relationship)) {
                children.push(member)
              } else if (['Self', 'Brother', 'Sister'].includes(parent.relationship)) {
                children.push(member)
              }
            }
          } else {
            // If no parentId, assume it's in current generation
            currentGeneration.push(member)
          }
      }
    })

    // Sort each generation appropriately
    const sortGeneration = (gen: FamilyMember[]) => {
      return gen.sort((a, b) => {
        const sortOrder = (rel: string) => {
          if (rel === 'Self') return 0
          if (['Father', 'Mother'].includes(rel)) return 1
          if (['Brother', 'Sister'].includes(rel)) return 2
          if (['Husband', 'Wife', 'Spouse', 'Partner'].includes(rel)) return 3
          if (['Son', 'Daughter', 'Child'].includes(rel)) return 4
          return 5
        }
        return sortOrder(a.relationship) - sortOrder(b.relationship)
      })
    }

    // Sort current generation to center Self with siblings on sides
    const sortCurrentGeneration = (gen: FamilyMember[]) => {
      const self = gen.find(m => m.relationship === 'Self')
      const siblings = gen.filter(m => ['Brother', 'Sister'].includes(m.relationship))
      const spouses = gen.filter(m => ['Husband', 'Wife', 'Spouse', 'Partner'].includes(m.relationship))
      
      // Center Self, siblings on sides, spouses after
      const sorted = []
      if (self) sorted.push(self)
      sorted.push(...siblings.sort((a, b) => a.relationship.localeCompare(b.relationship)))
      sorted.push(...spouses.sort((a, b) => a.relationship.localeCompare(b.relationship)))
      
      return sorted
    }

    // Sort grandparents to match their parent connections
    const sortGrandparentsByParent = (grandparents: FamilyMember[], parents: FamilyMember[]) => {
      const sorted: FamilyMember[] = []
      
      // Group grandparents by their parent connection
      parents.forEach(parent => {
        const parentGrandparents = grandparents.filter(gp => {
          // Check if this grandparent is connected to this parent via parentId
          return gp.parentId === parent.id || 
                 (parent.relationship === 'Father' && ['Paternal Grandfather', 'Paternal Grandmother'].includes(gp.relationship)) ||
                 (parent.relationship === 'Mother' && ['Maternal Grandfather', 'Maternal Grandmother'].includes(gp.relationship))
        })
        
        // Sort grandparents within each parent group (Father first, then Mother)
        parentGrandparents.sort((a, b) => {
          const aIsFather = ['Grandfather', 'Paternal Grandfather', 'Maternal Grandfather'].includes(a.relationship)
          const bIsFather = ['Grandfather', 'Paternal Grandfather', 'Maternal Grandfather'].includes(b.relationship)
          return aIsFather && !bIsFather ? -1 : !aIsFather && bIsFather ? 1 : 0
        })
        
        sorted.push(...parentGrandparents)
      })
      
      return sorted
    }

    // Sort parents generation (parents + uncles/aunts) by their relationships and connections
    const sortParentsGeneration = (parentsGen: FamilyMember[]) => {
      const parents = parentsGen.filter(m => ['Father', 'Mother'].includes(m.relationship))
      const unclesAunts = parentsGen.filter(m => ['Uncle', 'Aunt'].includes(m.relationship))
      
      const sorted: FamilyMember[] = []
      
      // First add parents (Father, then Mother)
      const sortedParents = parents.sort((a, b) => {
        const aIsFather = a.relationship === 'Father'
        const bIsFather = b.relationship === 'Father'
        return aIsFather && !bIsFather ? -1 : !aIsFather && bIsFather ? 1 : 0
      })
      sorted.push(...sortedParents)
      
      // Then add uncles/aunts grouped by their parent connection
      sortedParents.forEach(parent => {
        const parentUnclesAunts = unclesAunts.filter(ua => ua.parentId === parent.id)
        
        // Sort within each parent group (Uncle first, then Aunt)
        parentUnclesAunts.sort((a, b) => {
          const aIsUncle = a.relationship === 'Uncle'
          const bIsUncle = b.relationship === 'Uncle'
          return aIsUncle && !bIsUncle ? -1 : !aIsUncle && bIsUncle ? 1 : 0
        })
        
        sorted.push(...parentUnclesAunts)
      })
      
      return sorted
    }

    return {
      grandparents: sortGrandparentsByParent(sortGeneration(grandparents), parentsGeneration.filter(m => ['Father', 'Mother'].includes(m.relationship))),
      parents: sortParentsGeneration(parentsGeneration),
      currentGeneration: sortCurrentGeneration(currentGeneration),
      children: sortGeneration(children),
      allMembers: members
    }
  }

  // Helper to load family members respecting hideMock setting
  const loadFamilyMembers = () => {
      const savedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]')
      console.log('Family Tree - Loaded saved members:', savedMembers)
      
      // Build tree based on proper generational hierarchy
      const mergedData = buildFamilyTree(savedMembers)
      
      console.log('Family Tree - Merged data:', mergedData)
      console.log('Family Tree - All members:', savedMembers.map((m: { name: any; relationship: any; parentId: any }) => ({ name: m.name, relationship: m.relationship, parentId: m.parentId })))
      setFamilyData(mergedData)
  }

  // Load members: Firestore realtime when signed-in, else localStorage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    
    // Always load from localStorage first for instant render
    loadFamilyMembers()
    
    // Then load from Firestore on mount and set up real-time listener
    const loadFromFirestore = async () => {
      if (!user?.uid) return
      
      try {
        const firestoreMembers = await familyService.getFamilyMembers(user.uid)
        if (firestoreMembers && firestoreMembers.length > 0) {
          // Convert Firestore members to localStorage format
          const convertedMembers = firestoreMembers.map(member => ({
            id: member.id || Date.now(),
            name: member.name,
            firstName: member.firstName,
            lastName: member.lastName,
            middleName: member.middleName,
            role: member.role,
            birthYear: member.birthYear,
            deathYear: member.deathYear,
            birthDate: member.birthDate,
            deathDate: member.deathDate,
            birthPlace: member.birthPlace,
            deathPlace: member.deathPlace,
            location: member.location,
            city: member.city,
            state: member.state,
            country: member.country,
            coordinates: member.coordinates,
            relationship: member.relationship,
            gender: member.gender,
            occupation: member.occupation,
            email: member.email,
            phone: member.phone,
            address: member.address,
            bio: member.bio,
            image: member.image,
            heritageTags: member.heritageTags,
            parentId: member.parentId,
            hasChildren: member.hasChildren,
            hasParents: member.hasParents
          }))
          
          // Merge with existing localStorage data (don't overwrite)
          const localMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]')
          const mergedMembers = [...convertedMembers]
          
          // Add local members that aren't in Firestore (in case of sync issues)
          localMembers.forEach((local: any) => {
            if (!mergedMembers.find((m: any) => m.id === local.id || m.name === local.name)) {
              mergedMembers.push(local)
            }
          })
          
          localStorage.setItem('familyMembers', JSON.stringify(mergedMembers))
          console.log('Family Tree - Loaded from Firestore and merged:', mergedMembers.length, 'members')
          loadFamilyMembers()
        }
      } catch (error) {
        console.error('Error loading from Firestore:', error)
        // Keep using localStorage data
      }
    }
    
    if (user?.uid) {
      // Load from Firestore on mount
      loadFromFirestore()
      
      // Set up real-time listener
      unsubscribe = familyService.onFamilyMembersChange(user.uid, async (members) => {
        try {
          if (members && members.length > 0) {
            // Convert Firestore members to localStorage format
            const convertedMembers = members.map(member => ({
              id: member.id || Date.now(),
              name: member.name,
              firstName: member.firstName,
              lastName: member.lastName,
              middleName: member.middleName,
              role: member.role,
              birthYear: member.birthYear,
              deathYear: member.deathYear,
              birthDate: member.birthDate,
              deathDate: member.deathDate,
              birthPlace: member.birthPlace,
              deathPlace: member.deathPlace,
              location: member.location,
              city: member.city,
              state: member.state,
              country: member.country,
              coordinates: member.coordinates,
              relationship: member.relationship,
              gender: member.gender,
              occupation: member.occupation,
              email: member.email,
              phone: member.phone,
              address: member.address,
              bio: member.bio,
              image: member.image,
              heritageTags: member.heritageTags,
              parentId: member.parentId,
              hasChildren: member.hasChildren,
              hasParents: member.hasParents
            }))
            
            // Merge with existing localStorage data
            const localMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]')
            const mergedMembers = [...convertedMembers]
            
            // Add local members that aren't in Firestore
            localMembers.forEach((local: any) => {
              if (!mergedMembers.find((m: any) => m.id === local.id || m.name === local.name)) {
                mergedMembers.push(local)
              }
            })
            
            localStorage.setItem('familyMembers', JSON.stringify(mergedMembers))
            console.log('Family Tree - Updated from Firestore listener:', mergedMembers.length, 'members')
            loadFamilyMembers()
          }
          // If members is empty, don't clear localStorage - keep existing data
        } catch (error) {
          console.error('Error processing Firestore members:', error)
          // Keep using existing localStorage data
        }
      })
    } else {
      loadFamilyMembers()
    }

    // Listen for storage changes (when new members are added)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'familyMembers') {
        loadFamilyMembers()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // Also refresh when the page becomes visible (user navigates back)
    const handleVisibilityChange = () => { if (!document.hidden) loadFamilyMembers() }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (unsubscribe) unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [hideMock, user])

  const familyStats = useMemo(() => {
    const allMembers = [...familyData.grandparents, ...familyData.parents, ...familyData.currentGeneration, ...familyData.children]
    
    // Calculate actual number of generations based on which generations have members
    let generations = 0
    if (familyData.grandparents.length > 0) generations++
    if (familyData.parents.length > 0) generations++
    if (familyData.currentGeneration.length > 0) generations++
    if (familyData.children.length > 0) generations++
    
    return {
      totalMembers: allMembers.length,
      livingMembers: allMembers.filter(m => m.role === 'Living').length,
      deceasedMembers: allMembers.filter(m => m.role === 'Deceased').length,
      generations: generations,
    }
  }, [familyData])

  // Helper function to determine if two members are married
  const areMarried = (member1: FamilyMember, member2: FamilyMember) => {
    const marriagePairs = [
      ['Father', 'Mother'],
      ['Grandfather', 'Grandmother'],
      ['Paternal Grandfather', 'Paternal Grandmother'],
      ['Maternal Grandfather', 'Maternal Grandmother'],
      ['Husband', 'Wife'],
      ['Self', 'Spouse'],
      ['Self', 'Partner']
    ]
    
    return marriagePairs.some(pair => 
      (pair.includes(member1.relationship) && pair.includes(member2.relationship)) ||
      (member1.relationship === 'Self' && ['Husband', 'Wife', 'Spouse', 'Partner'].includes(member2.relationship)) ||
      (member2.relationship === 'Self' && ['Husband', 'Wife', 'Spouse', 'Partner'].includes(member1.relationship))
    )
  }


  const Node = ({ member }: { member: FamilyMember }) => {
    const initials = member.name.split(' ').map(n => n[0]).join('')
    const hasImage = Boolean(member.image)
    const ringColor = member.role === 'Living' ? 'ring-green-500' : 'ring-gray-400'
    const isCreator = member.relationship === 'Self'

    const subtitle = member.deathYear
      ? `${member.birthYear} – ${member.deathYear}`
      : member.birthYear
        ? `Born ${member.birthYear}`
        : member.role

    return (
      <button
        onClick={() => navigate(`/family-tree/member/${member.id}`, { state: { member } })}
        className="group relative flex flex-col items-center mx-2 sm:mx-3 lg:mx-4"
        title={`${member.name} • ${member.relationship}`}
      >
        {/* Crown icon for tree creator */}
        {isCreator && (
          <div className="absolute -top-2 -right-1 z-10 bg-yellow-400 rounded-full p-1 shadow-lg">
            <svg className="w-3 h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}
        
        <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full ring-2 ${ringColor} ring-offset-2 overflow-hidden bg-gray-200 flex items-center justify-center`}
          style={hasImage ? { backgroundImage: `url(${member.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          {!hasImage && <span className="text-gray-600 font-semibold text-xs sm:text-sm">{initials}</span>}
        </div>
        <div className="mt-2 text-center max-w-[140px] sm:max-w-[160px] lg:max-w-[180px]">
          <p className="text-xs sm:text-sm font-medium text-gray-900 leading-tight break-words">{member.name}</p>
          <p className="text-xs text-ancestor-primary font-medium mt-0.5">{member.relationship}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
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
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mr-2">
            <Button
              variant={viewMode === 'static' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('static')}
              className="px-3 py-1 text-xs"
            >
              <Layout className="w-3 h-3 mr-1" />
              Static
            </Button>
            <Button
              variant={viewMode === 'draggable' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('draggable')}
              className="px-3 py-1 text-xs"
            >
              <Move className="w-3 h-3 mr-1" />
              Draggable
            </Button>
          </div>
          
        {/* Reset Tree removed as per request */}
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
        <Card className="lg:col-span-9">
          {viewMode === 'static' ? (
            <div className="overflow-auto">
              <div className="relative min-w-[600px] sm:min-w-[800px] lg:min-w-[900px] py-10">
                {/* Zoomable content wrapper */}
                <div className="origin-center" style={{ transform: `scale(${scale})` }}>
              {/* Dynamic tree rendering with proper family connections */}
              
              {/* Grandparents Generation */}
              {familyData.grandparents.length > 0 && (
                <>
                  <div className="flex justify-center gap-8 sm:gap-12 lg:gap-16">
                    {familyData.grandparents.map((grandparent) => (
                      <div key={grandparent.id} className="flex flex-col items-center">
                        <Node member={grandparent} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Marriage lines for grandparents */}
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-8 sm:gap-12 lg:gap-16">
                      {familyData.grandparents.map((grandparent) => (
                        <div key={`marriage-${grandparent.id}`} className="flex items-center">
                          {familyData.grandparents.find(gp => 
                            gp.id !== grandparent.id && areMarried(grandparent, gp)
                          ) && (
                            <div className="w-8 sm:w-12 lg:w-16 h-0.5 bg-gray-800"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Vertical connector from grandparents to parents */}
                  {familyData.parents.length > 0 && (
                    <div className="flex justify-center items-center mt-4">
                      <div className="h-6 w-0.5 bg-gray-800"></div>
                    </div>
                  )}
                  
                  {/* Additional vertical line for Uncle (Chukwueme) from grandparents */}
                  {familyData.parents.find(p => p.relationship === 'Uncle') && (
                    <div className="flex justify-center items-center mt-4">
                      <div className="h-6 w-0.5 bg-gray-800"></div>
                    </div>
                  )}
                </>
              )}

              {/* Parents Generation */}
              {familyData.parents.length > 0 && (
                <>
                  <div className="mt-4 flex justify-center gap-6 sm:gap-8 lg:gap-10">
                    {familyData.parents.map((member) => (
                      <div key={member.id} className="flex flex-col items-center">
                        <Node member={member} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Marriage and sibling lines for parents generation */}
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
                      {familyData.parents.map((member) => (
                        <div key={`connection-${member.id}`} className="flex items-center">
                          {/* Marriage line between Father and Mother */}
                          {member.relationship === 'Father' && 
                           familyData.parents.find(m => m.relationship === 'Mother') && (
                            <div className="w-6 sm:w-8 lg:w-10 h-0.5 bg-gray-800"></div>
                          )}
                          {/* Sibling line between Father and Uncle */}
                          {member.relationship === 'Father' && 
                           familyData.parents.find(m => m.relationship === 'Uncle') && (
                            <div className="w-6 sm:w-8 lg:w-10 h-0.5 bg-gray-800"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Vertical connector from parents to current generation */}
                  <div className="flex justify-center mt-4">
                    <div className="h-6 w-0.5 bg-gray-800"></div>
                  </div>
                </>
              )}

              {/* Current Generation */}
              {familyData.currentGeneration.length > 0 && (
                <div className="mt-4 flex justify-center items-center gap-4 sm:gap-6 lg:gap-8">
                  {familyData.currentGeneration.map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <Node member={member} />
                    </div>
                  ))}
                </div>
              )}

              {/* Children Generation */}
              {familyData.children.length > 0 && (
                <>
                  {/* Vertical connector from current generation to children */}
                  <div className="flex justify-center items-center mt-4">
                    <div className="h-6 w-0.5 bg-gray-800"></div>
                  </div>
                  
                  {/* Horizontal line connecting all children */}
                  {familyData.children.length > 1 && (
                    <div className="flex justify-center mt-4">
                      <div className="w-8 sm:w-12 lg:w-16 h-0.5 bg-gray-800"></div>
                    </div>
                  )}
                  
                  {/* Individual vertical lines to each child */}
                  {familyData.children.length > 1 && (
                    <div className="flex justify-center items-center mt-4">
                      <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
                        {familyData.children.map((child) => (
                          <div key={child.id} className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-gray-800"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-center gap-6 sm:gap-8 lg:gap-10">
                    {familyData.children.map((child) => (
                      <div key={child.id} className="flex flex-col items-center">
                        <Node member={child} />
                      </div>
                    ))}
                  </div>
                </>
              )}

                  {/* Show message if no family members */}
                  {familyData.grandparents.length === 0 && 
                   familyData.parents.length === 0 && 
                   familyData.currentGeneration.length === 0 && 
                   familyData.children.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No Family Members Yet</h3>
                      <p className="text-gray-500 mb-4">Start building your family tree by adding your first family member.</p>
                      <Button onClick={() => navigate('/family-tree/builder')}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add First Family Member
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Family Member Location Map - Only for static view */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Living Family Members Map
                </h3>
                <FamilyMemberMap 
                  familyMembers={familyData.allMembers.filter(member => member.role === 'Living')}
                  className="border border-gray-200"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Showing locations of living family members. Add coordinates when creating family members to see them on the map.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <DraggableFamilyTree 
                familyData={familyData}
                onLayoutChange={(nodes, edges) => {
                  // Save layout changes to localStorage
                  const layoutData = { nodes, edges, timestamp: Date.now() }
                  localStorage.setItem('familyTreeLayout', JSON.stringify(layoutData))
                }}
              />
            </div>
          )}
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