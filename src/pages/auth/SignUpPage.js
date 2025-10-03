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
var SignUpPage = function () {
    var _a = (0, react_1.useState)(false), showPassword = _a[0], setShowPassword = _a[1];
    var _b = (0, react_1.useState)(false), showConfirmPassword = _b[0], setShowConfirmPassword = _b[1];
    var _c = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    }), formData = _c[0], setFormData = _c[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleSubmit = function (e) {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (!formData.agreeToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }
        // Placeholder for signup logic
        console.log('Signup data:', formData);
        navigate('/dashboard');
    };
    var handleChange = function (e) {
        var _a;
        var _b = e.target, name = _b.name, value = _b.value, type = _b.type, checked = _b.checked;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[name] = type === 'checkbox' ? checked : value, _a)));
    };
    return (<div className="min-h-screen bg-gradient-to-br from-ancestor-light to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="text-left">
          <react_router_dom_1.Link to="/login" className="inline-flex items-center text-ancestor-primary hover:text-ancestor-dark">
            <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
            Back to Sign In
          </react_router_dom_1.Link>
        </div>

        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-ancestor-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">𝔘</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-ancestor-dark mb-2">Create Account</h2>
          <p className="text-gray-600">Start preserving your family heritage</p>
        </div>

        {/* Sign Up Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input_1.default label="First Name" name="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="First name" required/>
            <Input_1.default label="Last Name" name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Last name" required/>
          </div>

          <Input_1.default label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required/>
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Create a password" className="input-field pr-12" required/>
              <button type="button" onClick={function () { return setShowPassword(!showPassword); }} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showPassword ? (<lucide_react_1.EyeOff className="h-5 w-5 text-gray-400"/>) : (<lucide_react_1.Eye className="h-5 w-5 text-gray-400"/>)}
              </button>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className="input-field pr-12" required/>
              <button type="button" onClick={function () { return setShowConfirmPassword(!showConfirmPassword); }} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showConfirmPassword ? (<lucide_react_1.EyeOff className="h-5 w-5 text-gray-400"/>) : (<lucide_react_1.Eye className="h-5 w-5 text-gray-400"/>)}
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="h-4 w-4 text-ancestor-primary focus:ring-ancestor-primary border-gray-300 rounded" required/>
            <span className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-ancestor-primary hover:text-ancestor-dark">Terms of Service</a> and <a href="#" className="text-ancestor-primary hover:text-ancestor-dark">Privacy Policy</a>
            </span>
          </div>

          <Button_1.default type="submit" size="lg" className="w-full">
            Create Account
          </Button_1.default>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <react_router_dom_1.Link to="/login" className="font-medium text-ancestor-primary hover:text-ancestor-dark">
            Sign in here
          </react_router_dom_1.Link>
        </div>
      </div>
    </div>);
};
exports.default = SignUpPage;
