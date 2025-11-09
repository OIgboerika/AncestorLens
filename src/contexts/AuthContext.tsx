import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, AuthUser } from '../firebase/services/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, displayName?: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      setUser(authService.convertUser(firebaseUser))
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const firebaseUser = await authService.signIn(email, password)
      setUser(authService.convertUser(firebaseUser))
      return firebaseUser
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true)
    try {
      const firebaseUser = await authService.signUp(email, password, displayName)
      setUser(authService.convertUser(firebaseUser))
      return firebaseUser
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    // Don't set loading here - let the page handle its own loading state
    // This allows immediate navigation without waiting for state update
    try {
      const firebaseUser = await authService.signInWithGoogle()
      // Update user state asynchronously (non-blocking)
      setUser(authService.convertUser(firebaseUser))
      return firebaseUser
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
      // Clear all localStorage data
      localStorage.clear()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
