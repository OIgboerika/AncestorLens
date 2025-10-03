"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Card = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.hoverable, hoverable = _c === void 0 ? true : _c, _d = _a.padding, padding = _d === void 0 ? 'md' : _d;
    var paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };
    return (<div className={"".concat(paddingClasses[padding], " ").concat(hoverable ? 'hover:shadow-md' : '', " card ").concat(className)}>
      {children}
    </div>);
};
exports.default = Card;
