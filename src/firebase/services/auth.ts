import { auth } from '../config'
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      throw error
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      console.log('Google Sign-In Debug:', { auth })
      
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('Google Sign-In Success:', result.user)
      return result.user
    } catch (error) {
      console.error('Google Sign-In Error:', error)
      throw error
    }
  },

  // Create new user account
  signUp: async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      return userCredential.user
    } catch (error) {
      throw error
    }
  },

  // Sign out current user
  signOut: async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw error
    }
  },

  // Get current user
  getCurrentUser: (): MockUser | null => {
    return auth.currentUser
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: MockUser | null) => void) => {
    return onAuthStateChanged(auth, callback)
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