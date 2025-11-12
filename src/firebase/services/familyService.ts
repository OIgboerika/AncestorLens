import { firestoreService, convertTimestamps } from './firestore'
import { where } from 'firebase/firestore'

export interface FamilyMember {
  id?: string
  userId: string
  name: string
  firstName: string
  lastName: string
  middleName?: string
  role: 'Living' | 'Deceased'
  birthYear?: string
  deathYear?: string
  birthDate?: string
  deathDate?: string
  birthPlace?: string
  deathPlace?: string
  location?: string
  city?: string
  state?: string
  country?: string
  coordinates?: { lat: number; lng: number }
  relationship: string
  gender?: string
  occupation?: string
  email?: string
  phone?: string
  address?: string
  bio?: string
  image?: string
  heritageTags?: string[]
  parentId?: string
  hasChildren?: boolean
  hasParents?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export const familyService = {
  // Get all family members for a user
  getFamilyMembers: async (userId: string): Promise<FamilyMember[]> => {
    try {
      const members = await firestoreService.getDocs('familyMembers', [
        where('userId', '==', userId)
      ])
      return members.map(convertTimestamps) as FamilyMember[]
    } catch (error) {
      console.error('Error fetching family members:', error)
      // Return empty array instead of throwing to prevent UI breaking
      return []
    }
  },

  // Get a single family member
  getFamilyMember: async (memberId: string): Promise<FamilyMember | null> => {
    try {
      const member = await firestoreService.getDoc('familyMembers', memberId)
      return member ? convertTimestamps(member) as FamilyMember : null
    } catch (error) {
      console.error('Error fetching family member:', error)
      throw error
    }
  },

  // Add a new family member
  addFamilyMember: async (userId: string, memberData: Omit<FamilyMember, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      // Strip undefined values – Firestore rejects undefined
      const payload: any = { ...memberData, userId }
      Object.keys(payload).forEach((k) => {
        if (payload[k] === undefined) delete payload[k]
      })
      const memberId = await firestoreService.addDoc('familyMembers', payload)
      return memberId
    } catch (error) {
      console.error('Error adding family member:', error)
      throw error
    }
  },

  // Update a family member
  updateFamilyMember: async (memberId: string, updates: Partial<FamilyMember>): Promise<void> => {
    try {
      await firestoreService.updateDoc('familyMembers', memberId, updates)
    } catch (error) {
      console.error('Error updating family member:', error)
      throw error
    }
  },

  // Delete a family member
  deleteFamilyMember: async (memberId: string): Promise<void> => {
    try {
      await firestoreService.deleteDoc('familyMembers', memberId)
    } catch (error) {
      console.error('Error deleting family member:', error)
      throw error
    }
  },

  // Listen to real-time family members updates
  onFamilyMembersChange: (userId: string, callback: (members: FamilyMember[]) => void) => {
    return firestoreService.onSnapshot('familyMembers', (docs) => {
      const members = docs.map(convertTimestamps) as FamilyMember[]
      callback(members)
    }, [
      where('userId', '==', userId)
    ])
  },
}
