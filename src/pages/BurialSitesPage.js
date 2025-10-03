"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Card_1 = require("../components/ui/Card/Card");
var Button_1 = require("../components/ui/Button/Button");
var BurialSitesPage = function () {
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    // Mock burial sites data
    var burialSites = [
        {
            id: 1,
            name: "Grandfather's Grave",
            deceasedName: "Samuel Doe",
            birthYear: "1925",
            deathYear: "1995",
            location: "Abuja Central Cemetery",
            coordinates: { lat: 9.0765, lng: 7.3986 },
            description: "Final resting place of Samuel Doe, beloved grandfather",
            visitNotes: "Well maintained plot with a beautiful headstone",
            lastVisit: "March 15, 2024",
            images: ["placeholder-headstone-1.jpg"],
            familyAccess: ["John Doe", "Grace Doe"]
        },
        {
            id: 2,
            name: "Family Burial Ground",
            deceasedName: "Mary Doe",
            birthYear: "1930",
            deathYear: "2000",
            location: "Enugu Burial Ground",
            coordinates: { lat: 6.5244, lng: 7.4951 },
            description: "Traditional family burial site",
            visitNotes: "Located in the eastern section of the cemetery",
            lastVisit: "February 20, 2024",
            images: ["placeholder-headstone-2.jpg"],
            familyAccess: ["John Doe", "Michael Doe"]
        },
        {
            id: 3,
            name: "Uncle's Memorial",
            deceasedName: "Paul Doe",
            birthYear: "1970",
            deathYear: "2020",
            location: "Lagos Memorial Garden",
            coordinates: { lat: 6.5244, lng: 3.3792 },
            description: "Memorial for beloved uncle who passed suddenly",
            visitNotes: "Peaceful location with flowers",
            lastVisit: "January 10, 2024",
            images: ["placeholder-headstone-3.jpg"],
            familyAccess: ["John Doe", "David Doe"]
        }
    ];
    var stats = {
        totalSites: burialSites.length,
        visitsThisYear: 8,
        sitesWithPhotos: 3,
        familyMembers: 4
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Burial Sites</h1>
          <p className="text-gray-600">Map and preserve ancestral burial locations</p>
        </div>
        <div className="flex space-x-3">
          <Button_1.default className="flex items-center space-x-2">
            <lucide_react_1.Plus className="w-4 h-4"/>
            <span>Add Site</span>
          </Button_1.default>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card_1.default hoverable={false}>
          <div className="text-center">
            <lucide_react_1.MapPin className="w-8 h-8 text-ancestor-primary mx-auto mb-2"/>
            <p className="text-2xl font-bold text-ancestor-primary">{stats.totalSites}</p>
            <p className="text-sm text-gray-600">Total Sites</p>
          </div>
        </Card_1.default>
        
        <Card_1.default hoverable={false}>
          <div className="text-center">
            <lucide_react_1.Calendar className="w-8 h-8 text-ancestor-secondary mx-auto mb-2"/>
            <p className="text-2xl font-bold text-ancestor-secondary">{stats.visitsThisYear}</p>
            <p className="text-sm text-gray-600">Visits This Year</p>
          </div>
        </Card_1.default>
        
        <Card_1.default hoverable={false}>
          <div className="text-center">
            <lucide_react_1.Eye className="w-8 h-8 text-green-600 mx-auto mb-2"/>
            <p className="text-2xl font-bold text-green-600">{stats.sitesWithPhotos}</p>
            <p className="text-sm text-gray-600">With Photos</p>
          </div>
        </Card_1.default>
        
        <Card_1.default hoverable={false}>
          <div className="text-center">
            <lucide_react_1.Calendar className="w-8 h-8 text-ancestor-accent mx-auto mb-2"/>
            <p className="text-2xl font-bold text-ancestor-accent">{stats.familyMembers}</p>
            <p className="text-sm text-gray-600">Family Members</p>
          </div>
        </Card_1.default>
      </div>

      {/* Search */}
      <Card_1.default className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <lucide_react_1.Search className="absolute left-3 top-3 w-5 h-5 text-gray-400"/>
            <input type="text" placeholder="Search burial sites..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="input-field pl-10"/>
          </div>
          <Button_1.default variant="outline">
            View Map
          </Button_1.default>
        </div>
      </Card_1.default>

      {/* Map Placeholder */}
      <Card_1.default className="mb-8">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <lucide_react_1.MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Interactive Map</h3>
            <p className="text-gray-500 mb-4">
              Google Maps integration will show burial site locations
            </p>
            <Button_1.default variant="outline">
              Enable Map View
            </Button_1.default>
          </div>
        </div>
      </Card_1.default>

      {/* Burial Sites List */}
      <div className="space-y-6">
        {burialSites.map(function (site) { return (<Card_1.default key={site.id} className="hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Site Image */}
              <div className="lg:col-span-1">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img src={site.images[0]} alt={site.name} className="w-full h-full object-cover" onError={function (e) {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='60' font-family='sans-serif' font-size='14' text-anchor='middle' fill='%236b7280'%3EHeadstone%3C/text%3E%3C/svg%3E";
            }}/>
                </div>
              </div>

              {/* Site Details */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{site.name}</h2>
                    <p className="text-lg text-gray-600 mb-2">{site.deceasedName}</p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <lucide_react_1.Calendar className="w-4 h-4 mr-2"/>
                      <span>{site.birthYear} - {site.deathYear}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button_1.default variant="ghost" size="sm">
                      <lucide_react_1.Eye className="w-4 h-4"/>
                    </Button_1.default>
                    <Button_1.default variant="ghost" size="sm">
                      <lucide_react_1.Share2 className="w-4 h-4"/>
                    </Button_1.default>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location Details</h4>
                    <p className="text-sm text-gray-600 flex items-start">
                      <lucide_react_1.MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"/>
                      <span>{site.location}</span>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Last Visit</h4>
                    <p className="text-sm text-gray-600">{site.lastVisit}</p>
                  </div>
                </div>

                {site.description && (<div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{site.description}</p>
                  </div>)}

                {site.visitNotes && (<div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Visit Notes</h4>
                    <p className="text-sm text-gray-600">{site.visitNotes}</p>
                  </div>)}

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                      Coordinates: {site.coordinates.lat.toFixed(4)}°N, {site.coordinates.lng.toFixed(4)}°E
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button_1.default variant="outline" size="sm">
                      View Details
                    </Button_1.default>
                    <Button_1.default variant="outline" size="sm">
                      Add Visit
                    </Button_1.default>
                  </div>
                </div>
              </div>
            </div>
          </Card_1.default>); })}
      </div>

      {/* Empty State */}
      {burialSites.length === 0 && (<Card_1.default className="text-center py-12">
          <lucide_react_1.MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No burial sites mapped yet</h3>
          <p className="text-gray-600 mb-6">Start preserving ancestral burial locations by adding your first site.</p>
          <Button_1.default>
            <lucide_react_1.Plus className="w-4 h-4 mr-2"/>
            Add Burial Site
          </Button_1.default>
        </Card_1.default>)}
    </div>);
};
exports.default = BurialSitesPage;
