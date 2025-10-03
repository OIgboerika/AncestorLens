"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Button = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, onClick = _a.onClick, _e = _a.type, type = _e === void 0 ? 'button' : _e, _f = _a.disabled, disabled = _f === void 0 ? false : _f;
    var baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ancestor-primary focus:ring-offset-2';
    var variantClasses = {
        primary: 'bg-ancestor-primary hover:bg-ancestor-dark text-white',
        secondary: 'bg-ancestor-secondary hover:bg-ancestor-accent text-white',
        outline: 'border-2 border-ancestor-primary text-ancestor-primary hover:bg-ancestor-primary hover:text-white',
        ghost: 'text-ancestor-primary hover:bg-ancestor-light'
    };
    var sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2',
        lg: 'px-8 py-3 text-lg'
    };
    var disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
    return (<button type={type} className={"".concat(baseClasses, " ").concat(variantClasses[variant], " ").concat(sizeClasses[size], " ").concat(disabledClasses, " ").concat(className)} onClick={onClick} disabled={disabled}>
      {children}
    </button>);
};
exports.default = Button;
