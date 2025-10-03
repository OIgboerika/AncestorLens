"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var Layout_1 = require("./components/Layout/Layout");
var HomePage_1 = require("./pages/HomePage");
var LoginPage_1 = require("./pages/auth/LoginPage");
var SignUpPage_1 = require("./pages/auth/SignUpPage");
var DashboardPage_1 = require("./pages/DashboardPage");
var FamilyTreePage_1 = require("./pages/family/FamilyTreePage");
var FamilyTreeBuilderPage_1 = require("./pages/family/FamilyTreeBuilderPage");
var FamilyMemberDetailsPage_1 = require("./pages/family/FamilyMemberDetailsPage");
var BurialSitesPage_1 = require("./pages/BurialSitesPage");
var CulturalMemoriesPage_1 = require("./pages/cultural/CulturalMemoriesPage");
var CulturalMemoryDetailsPage_1 = require("./pages/cultural/CulturalMemoryDetailsPage");
var UploadMemoryPage_1 = require("./pages/cultural/UploadMemoryPage");
var ProfilePage_1 = require("./pages/ProfilePage");
var PrivacySettingsPage_1 = require("./pages/PrivacySettingsPage");
function App() {
    return (<react_router_dom_1.Routes>
      {/* Public routes */}
      <react_router_dom_1.Route path="/" element={<HomePage_1.default />}/>
      <react_router_dom_1.Route path="/login" element={<LoginPage_1.default />}/>
      <react_router_dom_1.Route path="/signup" element={<SignUpPage_1.default />}/>
      
      {/* Protected routes */}
      <react_router_dom_1.Route path="/dashboard" element={<Layout_1.default><DashboardPage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/family-tree" element={<Layout_1.default><FamilyTreePage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/family-tree/builder" element={<Layout_1.default><FamilyTreeBuilderPage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/family-tree/member/:id" element={<Layout_1.default><FamilyMemberDetailsPage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/burial-sites" element={<Layout_1.default><BurialSitesPage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/cultural-memories" element={<Layout_1.default><CulturalMemoriesPage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/cultural-memories/:id" element={<Layout_1.default><CulturalMemoryDetailsPage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/upload-memory" element={<Layout_1.default><UploadMemoryPage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/profile" element={<Layout_1.default><ProfilePage_1.default /></Layout_1.default>}/>
      <react_router_dom_1.Route path="/privacy-settings" element={<Layout_1.default><PrivacySettingsPage_1.default /></Layout_1.default>}/>
      
      {/* Catch all route */}
      <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/" replace/>}/>
    </react_router_dom_1.Routes>);
}
exports.default = App;
