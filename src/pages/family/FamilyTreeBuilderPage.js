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
var Card_1 = require("../../components/ui/Card/Card");
var Button_1 = require("../../components/ui/Button/Button");
var Input_1 = require("../../components/ui/Input/Input");
var FamilyTreeBuilderPage = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)({
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        birthDate: '',
        deathDate: '',
        birthPlace: '',
        deathPlace: '',
        occupation: '',
        email: '',
        phone: '',
        address: '',
        bio: '',
        relationship: '',
        parentId: '',
        profileImage: null
    }), formData = _a[0], setFormData = _a[1];
    var relationships = (0, react_1.useState)([
        'Grandfather', 'Grandmother', 'Father', 'Mother', 'Brother', 'Sister',
        'Uncle', 'Aunt', 'Cousin', 'Son', 'Daughter', 'Grandson', 'Granddaughter',
        'Nephew', 'Niece', 'Husband', 'Partner', 'Other'
    ])[0];
    var handleInputChange = function (e) {
        var _a;
        var _b = e.target, name = _b.name, value = _b.value;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[name] = value, _a)));
    };
    var handleFileUpload = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setFormData(__assign(__assign({}, formData), { profileImage: file }));
        }
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        console.log('Form data:', formData);
        // Here you would save the family member data
        navigate('/family-tree');
    };
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={function () { return navigate('/family-tree'); }} className="inline-flex items-center text-ancestor-primary hover:text-ancestor-dark mb-4">
          <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
          Back to Family Tree
        </button>
        
        <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Add Family Member</h1>
        <p className="text-gray-600">Create a new profile for a family member</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo Section */}
        <Card_1.default>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Profile Photo</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              {formData.profileImage ? (<img src={URL.createObjectURL(formData.profileImage)} alt="Profile Preview" className="w-full h-full object-cover"/>) : (<lucide_react_1.Camera className="w-8 h-8 text-gray-400"/>)}
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ancestor-primary file:text-white hover:file:bg-ancestor-dark"/>
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>
        </Card_1.default>

        {/* Basic Information */}
        <Card_1.default>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input_1.default label="First Name *" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter first name" required/>
            
            <Input_1.default label="Middle Name" name="middleName" value={formData.middleName} onChange={handleInputChange} placeholder="Enter middle name"/>
            
            <Input_1.default label="Last Name *" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter last name" required/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="input-field">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <Input_1.default label="Occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="Enter occupation"/>
          </div>
        </Card_1.default>

        {/* Dates and Places */}
        <Card_1.default>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Dates and Places</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input_1.default label="Birth Date" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange}/>
              
              <Input_1.default label="Birth Place" name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} placeholder="Enter birth place"/>
            </div>
            
            <div>
              <Input_1.default label="Death Date" name="deathDate" type="date" value={formData.deathDate} onChange={handleInputChange}/>
              
              <Input_1.default label="Death Place" name="deathPlace" value={formData.deathPlace} onChange={handleInputChange} placeholder="Enter death place"/>
            </div>
          </div>
        </Card_1.default>

        {/* Contact Information */}
        <Card_1.default>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input_1.default label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email address"/>
            
            <Input_1.default label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Enter phone number"/>
          </div>
          
          <Input_1.default label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter full address" className="mt-4"/>
        </Card_1.default>

        {/* Family Relationships */}
        <Card_1.default>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Family Relationships</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship to You *
              </label>
              <select name="relationship" value={formData.relationship} onChange={handleInputChange} className="input-field" required>
                <option value="">Select relationship</option>
                {relationships.map(function (rel) { return (<option key={rel} value={rel}>{rel}</option>); })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent (if applicable)
              </label>
              <select name="parentId" value={formData.parentId} onChange={handleInputChange} className="input-field">
                <option value="">Select parent</option>
                <option value="father">Michael Doe (Father)</option>
                <option value="mother">Grace Doe (Mother)</option>
              </select>
            </div>
          </div>
        </Card_1.default>

        {/* Biography */}
        <Card_1.default>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
            <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Tell us about this family member's life, achievements, and stories..." rows={4} className="input-field resize-none"/>
            <p className="text-sm text-gray-500 mt-1">
              Help preserve their legacy by sharing their story
            </p>
          </div>
        </Card_1.default>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button_1.default type="submit" size="lg" className="w-full sm:w-auto flex items-center space-x-2">
            <lucide_react_1.Save className="w-4 h-4"/>
            <span>Save Family Member</span>
          </Button_1.default>
          
          <Button_1.default type="button" variant="outline" size="lg" onClick={function () { return navigate('/family-tree'); }} className="w-full sm:w-auto">
            Cancel
          </Button_1.default>
        </div>
      </form>
    </div>);
};
exports.default = FamilyTreeBuilderPage;
