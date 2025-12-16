import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ancestor-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
  
  const variantClasses = {
    primary: 'bg-ancestor-primary hover:bg-ancestor-dark text-white shadow-lg shadow-ancestor-primary/20 hover:shadow-xl hover:shadow-ancestor-primary/30 transform hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-ancestor-secondary hover:bg-ancestor-accent text-white shadow-lg shadow-ancestor-secondary/20 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border-2 border-ancestor-primary text-ancestor-primary hover:bg-ancestor-primary hover:text-white shadow-sm hover:shadow-md bg-white',
    ghost: 'text-ancestor-primary hover:bg-ancestor-light/50 rounded-xl'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  }
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button