import { vi } from 'vitest'

// Mock Firebase Auth Service
export const mockAuthService = {
  signIn: vi.fn(),
  signUp: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((callback: (user: any) => void) => {
    // Immediately call callback with mock user
    callback({
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
    })
    // Return unsubscribe function
    return vi.fn()
  }),
  convertUser: vi.fn((firebaseUser: any) => {
    if (!firebaseUser) return null
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    }
  }),
}

// Mock the auth service module
vi.mock('../../firebase/services/auth', () => ({
  authService: mockAuthService,
}))

