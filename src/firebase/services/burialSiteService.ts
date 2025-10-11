import { firestoreService, convertTimestamps } from './firestore'
import { where, orderBy } from 'firebase/firestore'

export interface BurialSite {
  id?: string
  userId: string
  name: string
  deceasedName: string
  birthYear?: string
  deathYear?: string
  location: string
  coordinates: { lat: number; lng: number }
  description?: string
  visitNotes?: string
  lastVisit?: string
  images: string[]
  familyAccess?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export const burialSiteService = {
  // Get all burial sites for a user
  getBurialSites: async (userId: string): Promise<BurialSite[]> => {
    try {
      const sites = await firestoreService.getDocs('burialSites', [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      ])
      return sites.map(convertTimestamps) as BurialSite[]
    } catch (error) {
      console.error('Error fetching burial sites:', error)
      throw error
    }
  },

  // Get a single burial site
  getBurialSite: async (siteId: string): Promise<BurialSite | null> => {
    try {
      const site = await firestoreService.getDoc('burialSites', siteId)
      return site ? convertTimestamps(site) as BurialSite : null
    } catch (error) {
      console.error('Error fetching burial site:', error)
      throw error
    }
  },

  // Add a new burial site
  addBurialSite: async (userId: string, siteData: Omit<BurialSite, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const siteId = await firestoreService.addDoc('burialSites', {
        ...siteData,
        userId,
      })
      return siteId
    } catch (error) {
      console.error('Error adding burial site:', error)
      throw error
    }
  },

  // Update a burial site
  updateBurialSite: async (siteId: string, updates: Partial<BurialSite>): Promise<void> => {
    try {
      await firestoreService.updateDoc('burialSites', siteId)
    } catch (error) {
      console.error('Error updating burial site:', error)
      throw error
    }
  },

  // Delete a burial site
  deleteBurialSite: async (siteId: string): Promise<void> => {
    try {
      await firestoreService.deleteDoc('burialSites', siteId)
    } catch (error) {
      console.error('Error deleting burial site:', error)
      throw error
    }
  },

  // Update visit information
  updateVisit: async (siteId: string, visitDate: string, visitNotes?: string): Promise<void> => {
    try {
      await firestoreService.updateDoc('burialSites', siteId, {
        lastVisit: visitDate,
        visitNotes: visitNotes || '',
      })
    } catch (error) {
      console.error('Error updating visit:', error)
      throw error
    }
  },

  // Listen to real-time burial sites updates
  onBurialSitesChange: (userId: string, callback: (sites: BurialSite[]) => void) => {
    return firestoreService.onSnapshot('burialSites', (docs) => {
      const sites = docs
        .filter(doc => doc.userId === userId)
        .map(convertTimestamps) as BurialSite[]
      callback(sites)
    }, [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ])
  },
}
