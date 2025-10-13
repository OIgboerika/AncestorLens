import { firestoreService, convertTimestamps } from './firestore'
import { where } from 'firebase/firestore'

export interface CulturalMemory {
  id?: string
  userId: string
  title: string
  description: string
  category: string
  type: 'audio' | 'image'
  duration?: string
  imageUrl?: string
  images?: string[]
  audioUrl?: string
  year?: string
  location?: string
  participants?: string
  tags: string[]
  uploadedBy: string
  uploadDate: string
  createdAt?: Date
  updatedAt?: Date
}

export const culturalMemoryService = {
  // Get all cultural memories for a user
  getCulturalMemories: async (userId: string): Promise<CulturalMemory[]> => {
    try {
      const memories = await firestoreService.getDocs('culturalMemories', [
        where('userId', '==', userId)
      ])
      return memories.map(convertTimestamps) as CulturalMemory[]
    } catch (error) {
      console.error('Error fetching cultural memories:', error)
      throw error
    }
  },

  // Get a single cultural memory
  getCulturalMemory: async (memoryId: string): Promise<CulturalMemory | null> => {
    try {
      const memory = await firestoreService.getDoc('culturalMemories', memoryId)
      return memory ? convertTimestamps(memory) as CulturalMemory : null
    } catch (error) {
      console.error('Error fetching cultural memory:', error)
      throw error
    }
  },

  // Add a new cultural memory
  addCulturalMemory: async (userId: string, memoryData: Omit<CulturalMemory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      // Firestore does not allow undefined values; strip them out
      const payload: any = {
        ...memoryData,
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
      const memoryId = await firestoreService.addDoc('culturalMemories', payload)
      return memoryId
    } catch (error) {
      console.error('Error adding cultural memory:', error)
      throw error
    }
  },

  // Update a cultural memory
  updateCulturalMemory: async (memoryId: string, updates: Partial<CulturalMemory>): Promise<void> => {
    try {
      await firestoreService.updateDoc('culturalMemories', memoryId, updates)
    } catch (error) {
      console.error('Error updating cultural memory:', error)
      throw error
    }
  },

  // Delete a cultural memory
  deleteCulturalMemory: async (memoryId: string): Promise<void> => {
    try {
      await firestoreService.deleteDoc('culturalMemories', memoryId)
    } catch (error) {
      console.error('Error deleting cultural memory:', error)
      throw error
    }
  },

  // Get memories by category
  getMemoriesByCategory: async (userId: string, category: string): Promise<CulturalMemory[]> => {
    try {
      const memories = await firestoreService.getDocs('culturalMemories', [
        where('userId', '==', userId),
        where('category', '==', category)
      ])
      return memories.map(convertTimestamps) as CulturalMemory[]
    } catch (error) {
      console.error('Error fetching memories by category:', error)
      throw error
    }
  },

  // Listen to real-time cultural memories updates
  onCulturalMemoriesChange: (userId: string, callback: (memories: CulturalMemory[]) => void) => {
    return firestoreService.onSnapshot('culturalMemories', (docs) => {
      const memories = docs
        .filter(doc => doc.userId === userId)
        .map(convertTimestamps) as CulturalMemory[]
      callback(memories)
    }, [
      where('userId', '==', userId)
    ])
  },
}
