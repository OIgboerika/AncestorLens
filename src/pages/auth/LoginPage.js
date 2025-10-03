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
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var Button_1 = require("../../components/ui/Button/Button");
var Input_1 = require("../../components/ui/Input/Input");
var LoginPage = function () {
    var _a = (0, react_1.useState)(false), showPassword = _a[0], setShowPassword = _a[1];
    var _b = (0, react_1.useState)({
        email: '',
        password: ''
    }), formData = _b[0], setFormData = _b[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleSubmit = function (e) {
        e.preventDefault();
        // Placeholder for login logic
        console.log('Login data:', formData);
        navigate('/dashboard');
    };
    var handleChange = function (e) {
        var _a;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[e.target.name] = e.target.value, _a)));
    };
    return (<div className="min-h-screen bg-gradient-to-br from-ancestor-light to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">𝔘</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-ancestor-dark mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue preserving your heritage</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input_1.default label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required/>
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Enter your password" className="input-field pr-12" required/>
              <button type="button" onClick={function () { return setShowPassword(!showPassword); }} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showPassword ? (<lucide_react_1.EyeOff className="h-5 w-5 text-gray-400"/>) : (<lucide_react_1.Eye className="h-5 w-5 text-gray-400"/>)}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-ancestor-primary focus:ring-ancestor-primary border-gray-300 rounded"/>
              <span className="ml-2 block text-sm text-gray-700">Remember me</span>
            </label>
            <react_router_dom_1.Link to="#" className="text-sm text-ancestor-primary hover:text-ancestor-dark">
              Forgot password?
            </react_router_dom_1.Link>
          </div>

          <Button_1.default type="submit" size="lg" className="w-full">
            Sign In
          </Button_1.default>
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <react_router_dom_1.Link to="/signup" className="font-medium text-ancestor-primary hover:text-ancestor-dark">
            Sign up here
          </react_router_dom_1.Link>
        </div>
      </div>
    </div>);
};
exports.default = LoginPage;
