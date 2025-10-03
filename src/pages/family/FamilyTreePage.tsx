import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  UserPlus,
  Calendar,
  MapPin,
  Mic
} from 'lucide-react'
import Card from '../../components/ui/Card/Card'
import Button from '../../components/ui/Button/Button'

const FamilyTreePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Mock family tree data
  const familyData = {
    currentGeneration: [
      {
        id: 1,
        name: 'John Doe',
        role: 'Living',
        birthYear: '1980',
        location: 'Lagos, Nigeria',
        relationship: 'Self',
        hasChildren: true,
        hasParents: true,
        image: 'placeholder-avatar.jpg'
      }
    ],
    parents: [
      {
        id: 2,
        name: 'Michael Doe',
        role: 'Deceased',
        birthYear: '1955',
        deathYear: '2020',
        location: 'Enugu, Nigeria',
        relationship: 'Father',
        hasChildren: true,
        hasParents: false,
        image: 'placeholder-avatar.jpg'
      },
      {
        id: 3,
        name: 'Grace Doe',
        role: 'Living',
        birthYear: '1960',
        location: 'Enugu, Nigeria',
        relationship: 'Mother',
        hasChildren: true,
        hasParents: false,
        image: 'placeholder-avatar.jpg'
      }
    ],
    grandparents: [
      {
        id: 4,
        name: 'Samuel Doe',
        role: 'Deceased',
        birthYear: '1925',
        deathYear: '1995',
        location: 'Abuja, Nigeria',
        relationship: 'Paternal Grandfather',
        hasChildren: true,
        hasParents: false,
        image: 'placeholder-avatar.jpg'
      },
      {
        id: 5,
        name: 'Mary Doe',
        role: 'Deceased',
        birthYear: '1930',
        deathYear: '2000',
        location: 'Abuja, Nigeria',
        relationship: 'Paternal Grandmother',
        hasChildren: true,
        hasParents: false,
        image: 'placeholder-avatar.jpg'
      }
    ],
    children: [
      {
        id: 6,
        name: 'David Doe',
        role: 'Living',
        birthYear: '2005',
        location: 'Lagos, Nigeria',
        relationship: 'Son',
        hasChildren: false,
        hasParents: true,
        image: 'placeholder-avatar.jpg'
      },
      {
        id: 7,
        name: 'Sarah Doe',
        role: 'Living',
        birthYear: '2008',
        location: 'Lagos, Nigeria',
        relationship: 'Daughter',
        hasChildren: false,
        hasParents: true,
        image: 'placeholder-avatar.jpg'
      }
    ]
  }

  const familyStats = {
    totalMembers: 7,
    livingMembers: 5,
    deceasedMembers: 2,
    generations: 4
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Family Tree</h1>
          <p className="text-gray-600">Explore your family history and connections</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/family-tree/builder">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <UserPlus className="w-8 h-8 text-ancestor-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-ancestor-secondary">{familyStats.generations}</p>
            <p className="text-sm text-gray-600">Generations</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
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
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
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

      {/* Family Tree Visualization */}
      <div className="space-y-8">
        {/* Grandparents Generation */}
        <div>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-4">Grandparents (Generation 3)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyData.grandparents.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-gray-600 font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.relationship}</p>
                    <p className="text-sm text-gray-500">{member.birthYear} - {member.deathYear}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${member.role === 'Living' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {member.role}
                      </span>
                      {member.location && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {member.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/family-tree/member/${member.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Parents Generation */}
        <div>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-4">Parents (Generation 2)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyData.parents.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-gray-600 font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.relationship}</p>
                    <p className="text-sm text-gray-500">
                      {member.birthYear} {member.deathYear ? `- ${member.deathYear}` : ''}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${member.role === 'Living' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {member.role}
                      </span>
                      {member.location && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {member.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/family-tree/member/${member.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Generation */}
        <div>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-4">Current Generation</h2>
          <div className="grid grid-cols-1 gap-4">
            {familyData.currentGeneration.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow bg-ancestor-light border-ancestor-primary">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.relationship}</p>
                    <p className="text-sm text-gray-500">Born {member.birthYear}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-ancestor-primary text-white">
                        {member.role}
                      </span>
                      {member.location && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {member.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/family-tree/member/${member.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Children Generation */}
        {familyData.children.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-ancestor-dark mb-4">Children (Generation 0)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {familyData.children.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      <span className="text-gray-600 font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.relationship}</p>
                      <p className="text-sm text-gray-500">Born {member.birthYear}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {member.role}
                        </span>
                        {member.location && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {member.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/family-tree/member/${member.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FamilyTreePage