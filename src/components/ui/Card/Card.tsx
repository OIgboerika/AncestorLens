import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const Card = ({ children, className = '', hoverable = true, padding = 'md' }: CardProps) => {
  const paddingClasses = {
    sm: 'p-5',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const hoverClasses = hoverable 
    ? 'hover:shadow-xl hover:shadow-gray-300/50 hover:-translate-y-1 transition-all duration-300' 
    : ''
  
  return (
    <div className={`${paddingClasses[padding]} ${hoverClasses} bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  )
}

export default Card