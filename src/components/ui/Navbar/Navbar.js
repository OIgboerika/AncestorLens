"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var Navbar = function () {
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var location = (0, react_router_dom_1.useLocation)();
    var navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: lucide_react_1.User },
        { name: 'Family Tree', href: '/family-tree', icon: lucide_react_1.TreePine },
        { name: 'Burial Sites', href: '/burial-sites', icon: lucide_react_1.MapPin },
        { name: 'Cultural Memories', href: '/cultural-memories', icon: lucide_react_1.BookOpen },
    ];
    return (<nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <react_router_dom_1.Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ancestor-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">𝔘</span>
              </div>
              <span className="font-bold text-xl text-ancestor-primary">AncestorLens</span>
            </react_router_dom_1.Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map(function (item) {
            var Icon = item.icon;
            return (<react_router_dom_1.Link key={item.name} to={item.href} className={"nav-link flex items-center space-x-2 ".concat(location.pathname === item.href ? 'active' : '')}>
                  <Icon className="w-4 h-4"/>
                  <span>{item.name}</span>
                </react_router_dom_1.Link>);
        })}
            
            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-ancestor-primary">
                <lucide_react_1.Settings className="w-4 h-4"/>
                <span>Settings</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <react_router_dom_1.Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Profile
                </react_router_dom_1.Link>
                <react_router_dom_1.Link to="/privacy-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Privacy Settings
                </react_router_dom_1.Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-ancestor-accent rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
              <span className="text-sm text-gray-600">John Doe</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={function () { return setIsOpen(!isOpen); }} className="text-gray-600 hover:text-ancestor-primary focus:outline-none">
              {isOpen ? <lucide_react_1.X className="w-6 h-6"/> : <lucide_react_1.Menu className="w-6 h-6"/>}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (<div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map(function (item) {
                var Icon = item.icon;
                return (<react_router_dom_1.Link key={item.name} to={item.href} className={"flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ".concat(location.pathname === item.href
                        ? 'text-ancestor-primary bg-ancestor-light'
                        : 'text-gray-600 hover:text-ancestor-primary hover:bg-gray-50')} onClick={function () { return setIsOpen(false); }}>
                    <Icon className="w-4 h-4"/>
                    <span>{item.name}</span>
                  </react_router_dom_1.Link>);
            })}
              <react_router_dom_1.Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-ancestor-primary hover:bg-gray-50" onClick={function () { return setIsOpen(false); }}>
                    <lucide_react_1.User className="w-4 h-4"/>
                    <span>Profile</span>
                  </react_router_dom_1.Link>
                  <react_router_dom_1.Link to="/privacy-settings" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-ancestor-primary hover:bg-gray-50" onClick={function () { return setIsOpen(false); }}>
                    <lucide_react_1.Settings className="w-4 h-4"/>
                    <span>Privacy Settings</span>
                  </react_router_dom_1.Link>
            </div>
          </div>)}
      </div>
    </nav>);
};
exports.default = Navbar;
