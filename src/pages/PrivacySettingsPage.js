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
var PrivacySettingsPage = function () {
    var _a = (0, react_1.useState)({
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
    }), privacySettings = _a[0], setPrivacySettings = _a[1];
    var handleSettingChange = function (setting, value) {
        var _a;
        setPrivacySettings(__assign(__assign({}, privacySettings), (_a = {}, _a[setting] = value, _a)));
    };
    var handleDataSharingChange = function (key, value) {
        var _a;
        setPrivacySettings(__assign(__assign({}, privacySettings), { dataSharing: __assign(__assign({}, privacySettings.dataSharing), (_a = {}, _a[key] = value, _a)) }));
    };
    var PrivacyToggle = function (_a) {
        var setting = _a.setting, value = _a.value, onChange = _a.onChange, title = _a.title, description = _a.description, Icon = _a.icon;
        return (<div className="flex items-start space-x-4">
      <div className="w-10 h-10 bg-ancestor-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-ancestor-primary"/>
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="flex items-center space-x-3">
          {['private', 'family', 'public'].map(function (option) { return (<label key={option} className="flex items-center">
              <input type="radio" name={setting} value={option} checked={value === option} onChange={function () { return onChange(option); }} className="h-4 w-4 text-ancestor-primary focus:ring-ancestor-primary border-gray-300"/>
              <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
            </label>); })}
        </div>
      </div>
      
      <div className={"flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ".concat(value === 'private' ? 'bg-gray-100 text-gray-600' :
                value === 'family' ? 'bg-ancestor-light text-ancestor-primary' :
                    'bg-green-100 text-green-800')}>
        {value === 'private' ? <lucide_react_1.Lock className="w-3 h-3"/> :
                value === 'family' ? <lucide_react_1.Users className="w-3 h-3"/> :
                    <lucide_react_1.Globe className="w-3 h-3"/>}
      </div>
    </div>);
    };
    var NotificationToggle = function (_a) {
        var setting = _a.setting, value = _a.value, onChange = _a.onChange, title = _a.title, description = _a.description;
        return (<div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={value} onChange={function () { return onChange(!value); }} className="sr-only peer"/>
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ancestor-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ancestor-primary"></div>
      </label>
    </div>);
    };
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Privacy Settings</h1>
        <p className="text-gray-600">Control who can see your family heritage data and how it's used</p>
      </div>

      {/* Profile Visibility */}
      <Card_1.default className="mb-8">
        <div className="flex items-center mb-6">
          <lucide_react_1.Shield className="w-6 h-6 text-ancestor-primary mr-3"/>
          <h2 className="text-xl font-semibold text-gray-900">Profile Visibility</h2>
        </div>
        
        <PrivacyToggle setting="profileVisibility" value={privacySettings.profileVisibility} onChange={function (value) { return handleSettingChange('profileVisibility', value); }} title="Profile Visibility" description="Control who can see your profile information and heritage contributions" icon={lucide_react_1.Shield}/>
      </Card_1.default>

      {/* Data Access Control */}
      <Card_1.default className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Access Control</h2>
        
        <div className="space-y-6">
          <PrivacyToggle setting="familyTreeAccess" value={privacySettings.familyTreeAccess} onChange={function (value) { return handleSettingChange('familyTreeAccess', value); }} title="Family Tree Access" description="Who can view your family tree and member information" icon={lucide_react_1.Users}/>
          
          <PrivacyToggle setting="burialSitesAccess" value={privacySettings.burialSitesAccess} onChange={function (value) { return handleSettingChange('burialSitesAccess', value); }} title="Burial Sites Access" description="Who can see and visit the burial sites you've mapped" icon={lucide_react_1.Globe}/>
          
          <PrivacyToggle setting="memoriesAccess" value={privacySettings.memoriesAccess} onChange={function (value) { return handleSettingChange('memoriesAccess', value); }} title="Cultural Memories Access" description="Who can listen to and download your uploaded cultural memories" icon={lucide_react_1.Shield}/>
        </div>
      </Card_1.default>

      {/* Notification Preferences */}
      <Card_1.default className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
        
        <div className="space-y-6">
          <NotificationToggle setting="emailNotifications" value={privacySettings.emailNotifications} onChange={function (value) { return handleSettingChange('emailNotifications', value); }} title="Email Notifications" description="Receive updates about your heritage activities and family contributions"/>
          
          <NotificationToggle setting="researchNotifications" value={privacySettings.researchNotifications} onChange={function (value) { return handleSettingChange('researchNotifications', value); }} title="Research Participation" description="Allow researchers to contact you about potential genealogical research"/>
          
          <NotificationToggle setting="familyUpdates" value={privacySettings.familyUpdates} onChange={function (value) { return handleSettingChange('familyUpdates', value); }} title="Family Updates" description="Get notified when family members add new information or memories"/>
          
          <NotificationToggle setting="marketingEmails" value={privacySettings.marketingEmails} onChange={function (value) { return handleSettingChange('marketingEmails', value); }} title="Marketing Communications" description="Receive updates about new features, tips, and heritage preservation events"/>
        </div>
      </Card_1.default>

      {/* Data Sharing */}
      <Card_1.default className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Sharing & Analytics</h2>
        
        <div className="space-y-6">
          <NotificationToggle setting="allowAnalytics" value={privacySettings.dataSharing.allowAnalytics} onChange={function (value) { return handleDataSharingChange('allowAnalytics', value); }} title="Usage Analytics" description="Help us improve AncestorLens by sharing anonymous usage data"/>
          
          <NotificationToggle setting="allowResearch" value={privacySettings.dataSharing.allowResearch} onChange={function (value) { return handleDataSharingChange('allowResearch', value); }} title="Academic Research" description="Allow anonymized data to be used for academic genealogical research"/>
          
          <NotificationToggle setting="allowThirdParty" value={privacySettings.dataSharing.allowThirdParty} onChange={function (value) { return handleDataSharingChange('allowThirdParty', value); }} title="Third-Party Services" description="Share anonymized insights with partner organizations (charities, cultural institutions)"/>
        </div>
      </Card_1.default>

      {/* Privacy Level Indicator */}
      <Card_1.default>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <lucide_react_1.Check className="w-8 h-8 text-green-600"/>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Status: Protected</h3>
          <p className="text-gray-600 mb-6">
            Your data is secure and protected according to our privacy policy. 
            You have full control over what information is shared and with whom.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button_1.default variant="outline">
              Download My Data
            </Button_1.default>
            <Button_1.default variant="outline">
              View Privacy Policy
            </Button_1.default>
          </div>
        </div>
      </Card_1.default>

      {/* Save Changes */}
      <div className="flex justify-end mt-8">
        <Button_1.default size="lg" className="flex items-center space-x-2">
          <lucide_react_1.Shield className="w-4 h-4"/>
          <span>Save Privacy Settings</span>
        </Button_1.default>
      </div>
    </div>);
};
exports.default = PrivacySettingsPage;
