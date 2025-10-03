"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Input = (0, react_1.forwardRef)(function (_a, ref) {
    var label = _a.label, error = _a.error, helperText = _a.helperText, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["label", "error", "helperText", "className"]);
    return (<div className="w-full">
        {label && (<label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>)}
        <input ref={ref} {...props} className={"input-field ".concat(error ? 'border-red-300 focus:ring-red-500' : '', " ").concat(className)}/>
        {error && (<p className="mt-1 text-sm text-red-600">{error}</p>)}
        {helperText && !error && (<p className="mt-1 text-sm text-gray-500">{helperText}</p>)}
      </div>);
});
exports.default = Input;
