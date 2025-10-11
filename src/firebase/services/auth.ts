import { auth } from '../config'

// Check if Firebase is properly configured
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID

// Mock User type for when Firebase is not configured
interface MockUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export const authService = {
  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      if (isFirebaseConfigured && auth.signInWithEmailAndPassword) {
        const userCredential = await auth.signInWithEmailAndPassword(email, password)
        return userCredential.user
      } else {
        // Mock implementation
        console.log('Mock sign in:', email)
        const mockUser: MockUser = {
          uid: 'demo-uid',
          email: email,
          displayName: 'Demo User',
          photoURL: null,
        }
        return mockUser
      }
    } catch (error) {
      throw error
    }
  },

  // Create new user account
  signUp: async (email: string, password: string, displayName?: string) => {
    try {
      if (isFirebaseConfigured && auth.createUserWithEmailAndPassword) {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password)
        if (displayName && auth.updateProfile) {
          await auth.updateProfile(userCredential.user, { displayName })
        }
        return userCredential.user
      } else {
        // Mock implementation
        console.log('Mock sign up:', email, displayName)
        const mockUser: MockUser = {
          uid: 'demo-uid',
          email: email,
          displayName: displayName || 'Demo User',
          photoURL: null,
        }
        return mockUser
      }
    } catch (error) {
      throw error
    }
  },

  // Sign out current user
  signOut: async () => {
    try {
      if (isFirebaseConfigured && auth.signOut) {
        await auth.signOut()
      } else {
        // Mock implementation
        console.log('Mock sign out')
      }
    } catch (error) {
      throw error
    }
  },

  // Get current user
  getCurrentUser: (): MockUser | null => {
    if (isFirebaseConfigured && auth.currentUser) {
      return auth.currentUser
    }
    return null
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: MockUser | null) => void) => {
    if (isFirebaseConfigured && auth.onAuthStateChanged) {
      return auth.onAuthStateChanged(callback)
    } else {
      // Mock implementation - immediately call callback with null
      callback(null)
      return () => {} // unsubscribe function
    }
  },

  // Convert Firebase User to our AuthUser interface
  convertUser: (user: MockUser | null): AuthUser | null => {
    if (!user) return null
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }
  },
}