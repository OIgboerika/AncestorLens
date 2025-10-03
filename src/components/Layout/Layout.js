"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var Navbar_1 = require("../ui/Navbar/Navbar");
var Footer_1 = require("../ui/Footer/Footer");
var Layout = function () {
    return (<div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar_1.default />
      <main className="flex-1 pt-16">
        <react_router_dom_1.Outlet />
      </main>
      <Footer_1.default />
    </div>);
};
exports.default = Layout;
