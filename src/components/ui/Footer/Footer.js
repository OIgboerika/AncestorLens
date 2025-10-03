"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var Footer = function () {
    return (<footer className="bg-ancestor-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-ancestor-accent rounded-full flex items-center justify-center">
                <span className="text-ancestor-dark font-bold text-lg">𝔘</span>
              </div>
              <span className="font-bold text-xl">AncestorLens</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Preserving African heritage through modern technology. Create family trees, 
              map burial sites, and preserve oral traditions for future generations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><react_router_dom_1.Link to="/family-tree" className="text-gray-300 hover:text-white transition-colors">Family Tree</react_router_dom_1.Link></li>
              <li><react_router_dom_1.Link to="/burial-sites" className="text-gray-300 hover:text-white transition-colors">Burial Sites</react_router_dom_1.Link></li>
              <li><react_router_dom_1.Link to="/cultural-memories" className="text-gray-300 hover:text-white transition-colors">Cultural Memories</react_router_dom_1.Link></li>
              <li><react_router_dom_1.Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</react_router_dom_1.Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><react_router_dom_1.Link to="/privacy-settings" className="text-gray-300 hover:text-white transition-colors">Privacy</react_router_dom_1.Link></li>
              <li><react_router_dom_1.Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</react_router_dom_1.Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AncestorLens. Preserving African Heritage.</p>
        </div>
      </div>
    </footer>);
};
exports.default = Footer;
