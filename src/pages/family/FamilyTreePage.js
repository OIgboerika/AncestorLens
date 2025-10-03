"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var Card_1 = require("../../components/ui/Card/Card");
var Button_1 = require("../../components/ui/Button/Button");
var FamilyTreePage = function () {
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = (0, react_1.useState)(false), showFilters = _b[0], setShowFilters = _b[1];
    // Mock family tree data
    var familyData = {
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
    };
    var familyStats = {
        totalMembers: 7,
        livingMembers: 5,
        deceasedMembers: 2,
        generations: 4
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Family Tree</h1>
          <p className="text-gray-600">Explore your family history and connections</p>
        </div>
        <div className="flex space-x-3">
          <react_router_dom_1.Link to="/family-tree/builder">
            <Button_1.default className="flex items-center space-x-2">
              <lucide_react_1.Plus className="w-4 h-4"/>
              <span>Add Member</span>
            </Button_1.default>
          </react_router_dom_1.Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card_1.default hoverable={false}>
          <div className="text-center">
            <lucide_react_1.Users className="w-8 h-8 text-ancestor-primary mx-auto mb-2"/>
            <p className="text-2xl font-bold text-ancestor-primary">{familyStats.totalMembers}</p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
        </Card_1.default>
        
        <Card_1.default hoverable={false}>
          <div className="text-center">
            <lucide_react_1.Calendar className="w-8 h-8 text-green-600 mx-auto mb-2"/>
            <p className="text-2xl font-bold text-green-600">{familyStats.livingMembers}</p>
            <p className="text-sm text-gray-600">Living</p>
          </div>
        </Card_1.default>
        
        <Card_1.default hoverable={false}>
          <div className="text-center">
            <lucide_react_1.Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2"/>
            <p className="text-2xl font-bold text-gray-600">{familyStats.deceasedMembers}</p>
            <p className="text-sm text-gray-600">Deceased</p>
          </div>
        </Card_1.default>
        
        <Card_1.default hoverable={false}>
          <div className="text-center">
            <lucide_react_1.UserPlus className="w-8 h-8 text-ancestor-secondary mx-auto mb-2"/>
            <p className="text-2xl font-bold text-ancestor-secondary">{familyStats.generations}</p>
            <p className="text-sm text-gray-600">Generations</p>
          </div>
        </Card_1.default>
      </div>

      {/* Search and Filters */}
      <Card_1.default className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <lucide_react_1.Search className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
            <input type="text" placeholder="Search family members..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="input-field pl-10"/>
          </div>
          <Button_1.default variant="outline" onClick={function () { return setShowFilters(!showFilters); }} className="flex items-center space-x-2">
            <lucide_react_1.Filter className="w-4 h-4"/>
            <span>Filters</span>
          </Button_1.default>
        </div>
        
        {showFilters && (<div className="mt-4 pt-4 border-t border-gray-200">
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
          </div>)}
      </Card_1.default>

      {/* Family Tree Visualization */}
      <div className="space-y-8">
        {/* Grandparents Generation */}
        <div>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-4">Grandparents (Generation 3)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyData.grandparents.map(function (member) { return (<Card_1.default key={member.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-gray-600 font-semibold">
                      {member.name.split(' ').map(function (n) { return n[0]; }).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.relationship}</p>
                    <p className="text-sm text-gray-500">{member.birthYear} - {member.deathYear}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={"px-2 py-1 text-xs rounded-full ".concat(member.role === 'Living' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
                        {member.role}
                      </span>
                      {member.location && (<span className="text-xs text-gray-500 flex items-center">
                          <lucide_react_1.MapPin className="w-3 h-3 mr-1"/>
                          {member.location}
                        </span>)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <react_router_dom_1.Link to={"/family-tree/member/".concat(member.id)}>
                      <Button_1.default variant="ghost" size="sm">
                        <lucide_react_1.Eye className="w-4 h-4"/>
                      </Button_1.default>
                    </react_router_dom_1.Link>
                    <Button_1.default variant="ghost" size="sm">
                      <lucide_react_1.Edit className="w-4 h-4"/>
                    </Button_1.default>
                  </div>
                </div>
              </Card_1.default>); })}
          </div>
        </div>

        {/* Parents Generation */}
        <div>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-4">Parents (Generation 2)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyData.parents.map(function (member) { return (<Card_1.default key={member.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-gray-600 font-semibold">
                      {member.name.split(' ').map(function (n) { return n[0]; }).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.relationship}</p>
                    <p className="text-sm text-gray-500">
                      {member.birthYear} {member.deathYear ? "- ".concat(member.deathYear) : ''}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={"px-2 py-1 text-xs rounded-full ".concat(member.role === 'Living' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
                        {member.role}
                      </span>
                      {member.location && (<span className="text-xs text-gray-500 flex items-center">
                          <lucide_react_1.MapPin className="w-3 h-3 mr-1"/>
                          {member.location}
                        </span>)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <react_router_dom_1.Link to={"/family-tree/member/".concat(member.id)}>
                      <Button_1.default variant="ghost" size="sm">
                        <lucide_react_1.Eye className="w-4 h-4"/>
                      </Button_1.default>
                    </react_router_dom_1.Link>
                    <Button_1.default variant="ghost" size="sm">
                      <lucide_react_1.Edit className="w-4 h-4"/>
                    </Button_1.default>
                  </div>
                </div>
              </Card_1.default>); })}
          </div>
        </div>

        {/* Current Generation */}
        <div>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-4">Current Generation</h2>
          <div className="grid grid-cols-1 gap-4">
            {familyData.currentGeneration.map(function (member) { return (<Card_1.default key={member.id} className="hover:shadow-lg transition-shadow bg-ancestor-light border-ancestor-primary">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-white font-semibold">
                      {member.name.split(' ').map(function (n) { return n[0]; }).join('')}
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
                      {member.location && (<span className="text-xs text-gray-500 flex items-center">
                          <lucide_react_1.MapPin className="w-3 h-3 mr-1"/>
                          {member.location}
                        </span>)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <react_router_dom_1.Link to={"/family-tree/member/".concat(member.id)}>
                      <Button_1.default variant="ghost" size="sm">
                        <lucide_react_1.Eye className="w-4 h-4"/>
                      </Button_1.default>
                    </react_router_dom_1.Link>
                    <Button_1.default variant="ghost" size="sm">
                      <lucide_react_1.Edit className="w-4 h-4"/>
                    </Button_1.default>
                  </div>
                </div>
              </Card_1.default>); })}
          </div>
        </div>

        {/* Children Generation */}
        {familyData.children.length > 0 && (<div>
            <h2 className="text-xl font-semibold text-ancestor-dark mb-4">Children (Generation 0)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {familyData.children.map(function (member) { return (<Card_1.default key={member.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      <span className="text-gray-600 font-semibold">
                        {member.name.split(' ').map(function (n) { return n[0]; }).join('')}
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
                        {member.location && (<span className="text-xs text-gray-500 flex items-center">
                            <lucide_react_1.MapPin className="w-3 h-3 mr-1"/>
                            {member.location}
                          </span>)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <react_router_dom_1.Link to={"/family-tree/member/".concat(member.id)}>
                        <Button_1.default variant="ghost" size="sm">
                          <lucide_react_1.Eye className="w-4 h-4"/>
                        </Button_1.default>
                      </react_router_dom_1.Link>
                      <Button_1.default variant="ghost" size="sm">
                        <lucide_react_1.Edit className="w-4 h-4"/>
                      </Button_1.default>
                    </div>
                  </div>
                </Card_1.default>); })}
            </div>
          </div>)}
      </div>
    </div>);
};
exports.default = FamilyTreePage;
