import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc0F0_sbhmKnZKpADyTNxunicPSPuL0w8",
  authDomain: "ancestorlens.firebaseapp.com",
  projectId: "ancestorlens",
  storageBucket: "ancestorlens.appspot.com",
  messagingSenderId: "94900313233",
  appId: "1:94900313233:web:9800fdf080ea354d1e3330",
  measurementId: "G-YFZTMQD8EK"
}

// Debug logging
console.log('Firebase Config Debug:', {
  apiKey: firebaseConfig.apiKey,
  projectId: firebaseConfig.projectId,
  envVars: {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  }
})

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app, 'gs://ancestorlens.appspot.com')

console.log('Firebase initialized successfully')

export { auth, db, storage }

export default app