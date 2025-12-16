import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full px-4 py-3 bg-white border ${error ? 'border-red-300' : 'border-gray-200'} rounded-2xl focus:ring-2 ${error ? 'focus:ring-red-500/20' : 'focus:ring-ancestor-primary/20'} focus:border-ancestor-primary transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg ${className}`}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

export default Input