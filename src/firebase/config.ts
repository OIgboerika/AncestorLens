import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
}

// Check if Firebase is properly configured
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID

let app: any = null
let auth: any = null
let db: any = null
let storage: any = null

try {
  if (isFirebaseConfigured) {
    // Initialize Firebase with real config
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } else {
    // Use mock implementations when Firebase is not configured
    console.warn('Firebase not configured. Using mock implementations.')
    
    auth = {
      currentUser: null,
      signInWithEmailAndPassword: () => Promise.resolve({ user: null }),
      createUserWithEmailAndPassword: () => Promise.resolve({ user: null }),
      signOut: () => Promise.resolve(),
      onAuthStateChanged: () => () => {},
    }
    
    db = {
      collection: () => ({
        doc: () => ({
          get: () => Promise.resolve({ exists: false, data: () => null }),
          set: () => Promise.resolve(),
          update: () => Promise.resolve(),
          delete: () => Promise.resolve(),
        }),
        add: () => Promise.resolve({ id: 'demo-id' }),
        get: () => Promise.resolve({ docs: [] }),
      }),
    }
    
    storage = {
      ref: () => ({
        put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('demo-url') } }),
      }),
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
  // Fallback to mock implementations
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.resolve({ user: null }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: null }),
    signOut: () => Promise.resolve(),
    onAuthStateChanged: () => () => {},
  }
  
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve(),
      }),
      add: () => Promise.resolve({ id: 'demo-id' }),
      get: () => Promise.resolve({ docs: [] }),
    }),
  }
  
  storage = {
    ref: () => ({
      put: () => Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve('demo-url') } }),
    }),
  }
}

export { auth, db, storage }

export default app