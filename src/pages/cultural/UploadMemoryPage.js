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
var UploadMemoryPage = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(false), isRecording = _a[0], setIsRecording = _a[1];
    var _b = (0, react_1.useState)(0), recordingTime = _b[0], setRecordingTime = _b[1];
    var _c = (0, react_1.useState)({
        title: '',
        description: '',
        category: '',
        tags: '',
        location: '',
        year: '',
        participants: '',
        audioFile: null,
        isPublic: false
    }), formData = _c[0], setFormData = _c[1];
    var categories = [
        'Migration Story',
        'Cultural Event',
        'Childhood Memory',
        'Daily Life',
        'Legend/Folklore',
        'Recipe/Food',
        'Music/Dance',
        'Family History',
        'Wedding/Union',
        'Other'
    ];
    var handleInputChange = function (e) {
        var _a;
        var _b = e.target, name = _b.name, value = _b.value, type = _b.type, checked = _b.checked;
        setFormData(__assign(__assign({}, formData), (_a = {}, _a[name] = type === 'checkbox' ? checked : value, _a)));
    };
    var handleFileUpload = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            setFormData(__assign(__assign({}, formData), { audioFile: file }));
        }
    };
    var handleStartRecording = function () {
        setIsRecording(true);
        // Start recording timer
        var timer = setInterval(function () {
            setRecordingTime(function (prev) { return prev + 1; });
        }, 1000);
        // Placeholder for actual recording implementation
        setTimeout(function () {
            setIsRecording(false);
            clearInterval(timer);
            setFormData(__assign(__assign({}, formData), { audioFile: 'recorded-file.mp3' // Placeholder
             }));
        }, 5000);
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        console.log('Memory data:', formData);
        // Here you would save the memory
        navigate('/cultural-memories');
    };
    var formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins.toString().padStart(2, '0'), ":").concat(secs.toString().padStart(2, '0'));
    };
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={function () { return navigate('/cultural-memories'); }} className="inline-flex items-center text-ancestor-primary hover:text-ancestor-dark mb-4">
          <lucide_react_1.ArrowLeft className="w-4 h-4 mr-2"/>
          Back to Cultural Memories
        </button>
        
        <h1 className="text-3xl font-bold text-ancestor-dark mb-2">Upload Memory</h1>
        <p className="text-gray-600">Preserve family stories and traditions through audio recordings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Audio Recording Section */}
        <Card_1.default>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Audio Recording</h2>
          
          <div className="text-center">
            {formData.audioFile ? (<div className="space-y-4">
                <div className="w-32 h-32 bg-gradient-to-br from-ancestor-primary to-ancestor-secondary rounded-lg mx-auto flex items-center justify-center mb-4">
                  <lucide_react_1.FileAudio className="w-12 h-12 text-white"/>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{formData.audioFile.name || 'Recording'}</p>
                  <p className="text-sm text-gray-500">
                    {formData.audioFile.type || 'Audio file'} • 
                    {isRecording ? formatTime(recordingTime) : 'Ready to upload'}
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Button_1.default onClick={handleStartRecording} disabled={isRecording}>
                    <lucide_react_1.Mic className="w-4 h-4 mr-2"/>
                    {isRecording ? 'Recording...' : 'Record New'}
                  </Button_1.default>
                  <Button_1.default variant="outline">
                    <lucide_react_1.Upload className="w-4 h-4 mr-2"/>
                    Upload File
                  </Button_1.default>
                </div>
              </div>) : (<div className="space-y-4">
                <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <lucide_react_1.Mic className="w-12 h-12 text-gray-400"/>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">No audio file uploaded</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Record a new memory or upload an existing audio file
                  </p>
                </div>
                
                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="audio-upload"/>
                <div className="flex justify-center space-x-4">
                  <Button_1.default onClick={handleStartRecording} disabled={isRecording}>
                    <lucide_react_1.Mic className="w-4 h-4 mr-2"/>
                    {isRecording ? 'Recording...' : 'Record Memory'}
                  </Button_1.default>
                  
                  <Button_1.default variant="outline" onClick={function () { var _a; return (_a = document.getElementById('audio-upload')) === null || _a === void 0 ? void 0 : _a.click(); }}>
                    <lucide_react_1.Upload className="w-4 h-4 mr-2"/>
                    Upload File
                  </Button_1.default>
                </div>
                
                {isRecording && (<div className="flex items-center justify-center space-x-2 mt-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-600">Recording in progress... {formatTime(recordingTime)}</span>
                  </div>)}
              </div>)}
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>
                <strong>Tip:</strong> Find a quiet place with good audio quality. 
                Ask the storyteller to speak clearly and include context about the story.
              </p>
            </div>
          </div>
        </Card_1.default>

        {/* Memory Details */}
        <Card_1.default>
          <h2 className="text-xl font-semibold text-ancestor-dark mb-6">Memory Details</h2>
          
          <div className="space-y-6">
            <Input_1.default label="Title *" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter a descriptive title for this memory" required/>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Provide context, background information, or summary of this memory..." rows={4} className="input-field resize-none"/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="input-field" required>
                  <option value="">Select category</option>
                  {categories.map(function (category) { return (<option key={category} value={category}>{category}</option>); })}
                </select>
              </div>
              
              <Input_1.default label="Year (Optional)" name="year" value={formData.year} onChange={handleInputChange} placeholder="e.g., 1965"/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input_1.default label="Participants" name="participants" value={formData.participants} onChange={handleInputChange} placeholder="e.g., Grandmother Sarah, Uncle Michael"/>
              
              <Input_1.default label="Location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Where did this take place?"/>
            </div>
            
            <Input_1.default label="Tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Add keywords separated by commas (e.g., wedding, tradition, ceremony)" helperText="Tags help others find and organize memories"/>
          </div>
        </Card_1.default>

        {/* Privacy Settings */}
        <Card_1.default>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
              <p className="text-sm text-gray-600">Who can view this memory?</p>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleInputChange} className="h-4 w-4 text-ancestor-primary focus:ring-ancestor-primary border-gray-300 rounded"/>
              <label className="ml-2 text-sm text-gray-700">
                Make this memory visible to family members
              </label>
            </div>
          </div>
        </Card_1.default>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button_1.default type="submit" size="lg" className="w-full sm:w-auto flex items-center space-x-2">
            <lucide_react_1.Save className="w-4 h-4"/>
            <span>Save Memory</span>
          </Button_1.default>
          
          <Button_1.default type="button" variant="outline" size="lg" onClick={function () { return navigate('/cultural-memories'); }} className="w-full sm:w-auto">
            Cancel
          </Button_1.default>
        </div>
      </form>
    </div>);
};
exports.default = UploadMemoryPage;
