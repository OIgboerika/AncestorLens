import { firestoreService, convertTimestamps } from './firestore'
import { where } from 'firebase/firestore'

export interface ArchiveDocument {
  id?: string
  userId: string
  title: string
  description?: string
  category?: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize?: number
  tags?: string[]
  uploadedBy: string
  uploadDate: string
  createdAt?: Date
  updatedAt?: Date
}

export const archiveService = {
  // Get all archive documents for a user
  getArchiveDocuments: async (userId: string): Promise<ArchiveDocument[]> => {
    try {
      const documents = await firestoreService.getDocs('archives', [
        where('userId', '==', userId)
      ])
      return documents.map(convertTimestamps) as ArchiveDocument[]
    } catch (error) {
      console.error('Error fetching archive documents:', error)
      throw error
    }
  },

  // Get a single archive document
  getArchiveDocument: async (documentId: string): Promise<ArchiveDocument | null> => {
    try {
      const document = await firestoreService.getDoc('archives', documentId)
      return document ? convertTimestamps(document) as ArchiveDocument : null
    } catch (error) {
      console.error('Error fetching archive document:', error)
      throw error
    }
  },

  // Add a new archive document
  addArchiveDocument: async (userId: string, documentData: Omit<ArchiveDocument, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const payload: any = {
        ...documentData,
        userId,
        uploadDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      }
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k]
      })
      const documentId = await firestoreService.addDoc('archives', payload)
      return documentId
    } catch (error) {
      console.error('Error adding archive document:', error)
      throw error
    }
  },

  // Update an archive document
  updateArchiveDocument: async (documentId: string, updates: Partial<ArchiveDocument>): Promise<void> => {
    try {
      await firestoreService.updateDoc('archives', documentId, updates)
    } catch (error) {
      console.error('Error updating archive document:', error)
      throw error
    }
  },

  // Delete an archive document
  deleteArchiveDocument: async (documentId: string): Promise<void> => {
    try {
      await firestoreService.deleteDoc('archives', documentId)
    } catch (error) {
      console.error('Error deleting archive document:', error)
      throw error
    }
  },

  // Get documents by category
  getDocumentsByCategory: async (userId: string, category: string): Promise<ArchiveDocument[]> => {
    try {
      const documents = await firestoreService.getDocs('archives', [
        where('userId', '==', userId),
        where('category', '==', category)
      ])
      return documents.map(convertTimestamps) as ArchiveDocument[]
    } catch (error) {
      console.error('Error fetching documents by category:', error)
      throw error
    }
  },

  // Listen to real-time archive documents updates
  onArchiveDocumentsChange: (userId: string, callback: (documents: ArchiveDocument[]) => void) => {
    return firestoreService.onSnapshot('archives', (docs) => {
      const documents = docs
        .filter(doc => doc.userId === userId)
        .map(convertTimestamps) as ArchiveDocument[]
      callback(documents)
    }, [
      where('userId', '==', userId)
    ])
  },
}

