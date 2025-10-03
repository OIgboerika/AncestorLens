import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const Card = ({ children, className = '', hoverable = true, padding = 'md' }: CardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return (
    <div className={`${paddingClasses[padding]} ${hoverable ? 'hover:shadow-md' : ''} card ${className}`}>
      {children}
    </div>
  )
}

export default Card