import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore'
import { db } from '../config'

// Generic Firestore service
export const firestoreService = {
  // Get a single document
  getDoc: async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      throw error
    }
  },

  // Get all documents from a collection
  getDocs: async (collectionName: string, constraints?: any[]) => {
    try {
      let q = collection(db, collectionName)
      if (constraints) {
        q = query(q, ...constraints)
      }
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw error
    }
  },

  // Add a new document
  addDoc: async (collectionName: string, data: any) => {
    try {
      console.log(`FirestoreService: Adding document to ${collectionName}`)
      console.log('FirestoreService: Data:', data)
      
      // Clean data to remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      )
      
      console.log('FirestoreService: Clean data:', cleanData)
      
      const docRef = await addDoc(collection(db, collectionName), {
        ...cleanData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      
      console.log('FirestoreService: Document added with ID:', docRef.id)
      return docRef.id
    } catch (error) {
      console.error(`FirestoreService: Error adding document to ${collectionName}:`, error)
      console.error('FirestoreService: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        collectionName,
        data
      })
      throw error
    }
  },

  // Update a document
  updateDoc: async (collectionName: string, docId: string, data: any) => {
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      throw error
    }
  },

  // Delete a document
  deleteDoc: async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
    } catch (error) {
      throw error
    }
  },

  // Listen to real-time updates
  onSnapshot: (
    collectionName: string,
    callback: (docs: any[]) => void,
    constraints?: any[]
  ) => {
    let q = collection(db, collectionName)
    if (constraints) {
      q = query(q, ...constraints)
    }
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      callback(docs)
    })
  },
}

// Helper function to convert Firestore timestamps to JavaScript dates
export const convertTimestamps = (data: any) => {
  const converted = { ...data }
  Object.keys(converted).forEach(key => {
    if (converted[key] && typeof converted[key].toDate === 'function') {
      converted[key] = converted[key].toDate()
    }
  })
  return converted
}