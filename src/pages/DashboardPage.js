"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var Card_1 = require("../components/ui/Card/Card");
var Button_1 = require("../components/ui/Button/Button");
var DashboardPage = function () {
    var stats = (0, react_1.useState)({
        familyMembers: 24,
        burialSites: 8,
        oralMemories: 12,
        privacyLevel: 'Private'
    })[0];
    var recentActivities = [
        {
            id: 1,
            type: 'family',
            title: 'Added new family member: Sarah Johnson',
            time: '2 hours ago',
            icon: lucide_react_1.Users
        },
        {
            id: 2,
            type: 'burial',
            title: 'Updated burial site: Great Grandfather\'s grave',
            time: '1 day ago',
            icon: lucide_react_1.MapPin
        },
        {
            id: 3,
            type: 'memory',
            title: 'Uploaded oral story: The Journey West',
            time: '3 days ago',
            icon: lucide_react_1.Microphone
        }
    ];
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Welcome back, John</h1>
        <p className="text-gray-600">Manage your family heritage and preserve memories</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card_1.default hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Family Members</p>
              <p className="text-2xl font-bold text-ancestor-primary">{stats.familyMembers}</p>
            </div>
            <div className="w-12 h-12 bg-ancestor-primary bg-opacity-10 rounded-full flex items-center justify-center">
              <lucide_react_1.Users className="w-6 h-6 text-ancestor-primary"/>
            </div>
          </div>
        </Card_1.default>

        <Card_1.default hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Burial Sites</p>
              <p className="text-2xl font-bold text-ancestor-secondary">{stats.burialSites}</p>
            </div>
            <div className="w-12 h-12 bg-ancestor-secondary bg-opacity-10 rounded-full flex items-center justify-center">
              <lucide_react_1.MapPin className="w-6 h-6 text-ancestor-secondary"/>
            </div>
          </div>
        </Card_1.default>

        <Card_1.default hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Oral Memories</p>
              <p className="text-2xl font-bold text-ancestor-accent">{stats.oralMemories}</p>
            </div>
            <div className="w-12 h-12 bg-ancestor-accent bg-opacity-10 rounded-full flex items-center justify-center">
              <lucide_react_1.Microphone className="w-6 h-6 text-ancestor-accent"/>
            </div>
          </div>
        </Card_1.default>

        <Card_1.default hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Privacy Level</p>
              <p className="text-lg font-semibold text-gray-800">{stats.privacyLevel}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <lucide_react_1.Heart className="w-6 h-6 text-green-600"/>
            </div>
          </div>
        </Card_1.default>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card_1.default>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-ancestor-dark">Recent Activities</h2>
              <react_router_dom_1.Link to="#" className="text-ancestor-primary hover:text-ancestor-dark">
                View All
              </react_router_dom_1.Link>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map(function (activity) {
            var Icon = activity.icon;
            return (<div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-ancestor-primary"/>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>);
        })}
            </div>
          </Card_1.default>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card_1.default>
            <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <react_router_dom_1.Link to="/family-tree/builder">
                <Button_1.default variant="outline" className="w-full justify-start">
                  <lucide_react_1.TreePine className="w-5 h-5 mr-3"/>
                  Add Family Member
                </Button_1.default>
              </react_router_dom_1.Link>
              
              <react_router_dom_1.Link to="/burial-sites">
                <Button_1.default variant="outline" className="w-full justify-start">
                  <lucide_react_1.MapPin className="w-5 h-5 mr-3"/>
                  Map Burial Site
                </Button_1.default>
              </react_router_dom_1.Link>
              
              <react_router_dom_1.Link to="/upload-memory">
                <Button_1.default variant="outline" className="w-full justify-start">
                  <lucide_react_1.Microphone className="w-5 h-5 mr-3"/>
                  Record Memory
                </Button_1.default>
              </react_router_dom_1.Link>
              
              <react_router_dom_1.Link to="/cultural-memories">
                <Button_1.default variant="outline" className="w-full justify-start">
                  <lucide_react_1.BookOpen className="w-5 h-5 mr-3"/>
                  View Memories
                </Button_1.default>
              </react_router_dom_1.Link>
            </div>
          </Card_1.default>

          {/* Sharing Options */}
          <Card_1.default>
            <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Share Heritage</h2>
            
            <div className="space-y-4">
              <Button_1.default className="w-full justify-start">
                <lucide_react_1.Share2 className="w-5 h-5 mr-3"/>
                Invite Family Members
              </Button_1.default>
              
              <Button_1.default variant="secondary" className="w-full justify-start">
                <lucide_react_1.Calendar className="w-5 h-5 mr-3"/>
                Schedule Gathering
              </Button_1.default>
            </div>
          </Card_1.default>
        </div>
      </div>
    </div>);
};
exports.default = DashboardPage;
