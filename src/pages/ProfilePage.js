"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Card_1 = require("../components/ui/Card/Card");
var Button_1 = require("../components/ui/Button/Button");
var ProfilePage = function () {
    var _a = (0, react_1.useState)(false), isEditing = _a[0], setIsEditing = _a[1];
    var _b = (0, react_1.useState)({
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+234 812 345 6789',
        location: 'Lagos, Nigeria',
        bio: 'Family historian and heritage preservation enthusiast. Passionate about keeping African traditions alive for future generations.',
        joinDate: 'January 2023',
        profileImage: null,
        familyStats: {
            familyMembers: 24,
            memoriesUploaded: 8,
            burialSites: 3,
            profileViews: 156
        }
    }), userData = _b[0], setUserData = _b[1];
    var handleEdit = function () {
        setIsEditing(true);
    };
    var handleSave = function () {
        setIsEditing(false);
        // Here you would save the updated profile data
        console.log('Updated profile:', userData);
    };
    var handleInputChange = function (e) {
        var _a;
        var _b = e.target, name = _b.name, value = _b.value;
        setUserData(__assign(__assign({}, userData), (_a = {}, _a[name] = value, _a)));
    };
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ancestor-dark mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and personal information</p>
        </div>
        <div className="flex space-x-3">
          {isEditing && (<Button_1.default variant="outline" className="flex items-center space-x-2">
              <lucide_react_1.Save className="w-4 h-4"/>
              <span>Save Changes</span>
            </Button_1.default>)}
          {!isEditing && (<Button_1.default variant="outline" className="flex items-center space-x-2" onClick={handleEdit}>
              <lucide_react_1.Edit className="w-4 h-4"/>
              <span>Edit Profile</span>
            </Button_1.default>)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card_1.default>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-ancestor-primary to-ancestor-secondary rounded-full mx-auto flex items-center justify-center overflow-hidden">
                  {userData.profileImage ? (<img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover"/>) : (<span className="text-white font-bold text-4xl">
                      {userData.name.split(' ').map(function (n) { return n[0]; }).join('')}
                    </span>)}
                </div>
                
                {isEditing && (<button className="absolute bottom-0 right-0 w-10 h-10 bg-ancestor-primary rounded-full flex items-center justify-center text-white border-2 border-white">
                    <lucide_react_1.Camera className="w-5 h-5"/>
                  </button>)}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{userData.name}</h2>
              <div className="flex items-center justify-center mb-4">
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  Active Member
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                Member since {userData.joinDate}
              </div>
            </div>
          </Card_1.default>

          {/* Quick Stats */}
          <Card_1.default className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Heritage Contributions</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Family Members</span>
                <span className="font-semibold text-gray-900">{userData.familyStats.familyMembers}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Memories Uploaded</span>
                <span className="font-semibold text-gray-900">{userData.familyStats.memoriesUploaded}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Burial Sites</span>
                <span className="font-semibold text-gray-900">{userData.familyStats.burialSites}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="font-semibold text-gray-900">{userData.familyStats.profileViews}</span>
                </div>
              </div>
            </div>
          </Card_1.default>

          {/* Quick Actions */}
          <Card_1.default className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Button_1.default variant="outline" className="w-full justify-start">
                <lucide_react_1.Share2 className="w-4 h-4 mr-3"/>
                Share Profile
              </Button_1.default>
              
              <Button_1.default variant="outline" className="w-full justify-start">
                <lucide_react_1.Shield className="w-4 h-4 mr-3"/>
                Privacy Settings
              </Button_1.default>
              
              <Button_1.default variant="outline" className="w-full justify-start">
                <lucide_react_1.Settings className="w-4 h-4 mr-3"/>
                Account Settings
              </Button_1.default>
            </div>
          </Card_1.default>
        </div>

        {/* Main Profile Details */}
        <div className="lg:col-span-2">
          {/* Personal Information */}
          <Card_1.default className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (<input type="text" name="name" value={userData.name} onChange={handleInputChange} className="input-field"/>) : (<div className="flex items-center text-gray-900">
                    <lucide_react_1.User className="w-4 h-4 mr-2 text-gray-400"/>
                    {userData.name}
                  </div>)}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (<input type="text" name="location" value={userData.location} onChange={handleInputChange} className="input-field"/>) : (<div className="flex items-center text-gray-900">
                    <lucide_react_1.MapPin className="w-4 h-4 mr-2 text-gray-400"/>
                    {userData.location}
                  </div>)}
              </div>
            </div>
          </Card_1.default>

          {/* Contact Information */}
          <Card_1.default className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <lucide_react_1.Mail className="w-5 h-5 text-gray-400 mr-3"/>
                <div className="flex-1">
                  {isEditing ? (<input type="email" name="email" value={userData.email} onChange={handleInputChange} className="input-field"/>) : (<a href={"mailto:".concat(userData.email)} className="text-ancestor-primary hover:text-ancestor-dark">
                      {userData.email}
                    </a>)}
                </div>
              </div>
              
              <div className="flex items-center">
                <lucide_react_1.Phone className="w-5 h-5 text-gray-400 mr-3"/>
                <div className="flex-1">
                  {isEditing ? (<input type="tel" name="phone" value={userData.phone} onChange={handleInputChange} className="input-field"/>) : (<a href={"tel:".concat(userData.phone)} className="text-ancestor-primary hover:text-ancestor-dark">
                      {userData.phone}
                    </a>)}
                </div>
              </div>
            </div>
          </Card_1.default>

          {/* Biography */}
          <Card_1.default>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
            
            {isEditing ? (<textarea name="bio" value={userData.bio} onChange={handleInputChange} rows={4} className="input-field resize-none" placeholder="Tell us about yourself..."/>) : (<p className="text-gray-700 leading-relaxed">{userData.bio}</p>)}
          </Card_1.default>
          
          {/* Save Button */}
          {isEditing && (<div className="flex justify-end mt-6">
              <Button_1.default onClick={handleSave} className="flex items-center space-x-2">
                <lucide_react_1.Save className="w-4 h-4"/>
                <span>Save Changes</span>
              </Button_1.default>
            </div>)}
        </div>
      </div>
    </div>);
};
exports.default = ProfilePage;
