import { db } from '../config'
import { collection, addDoc, getDocs, query, where, limit, Timestamp, onSnapshot } from 'firebase/firestore'

export interface Activity {
  id?: string
  userId: string
  type: 'family_member_added' | 'family_member_updated' | 'memory_uploaded' | 'burial_site_added' | 'burial_site_updated' | 'profile_updated'
  title: string
  description: string
  timestamp: Timestamp
  metadata?: {
    familyMemberId?: string
    memoryId?: string
    burialSiteId?: string
    [key: string]: any
  }
}

const ACTIVITIES_COLLECTION = 'activities'

export const activityService = {
  // Add a new activity
  async addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<void> {
    try {
      await addDoc(collection(db, ACTIVITIES_COLLECTION), {
        ...activity,
        timestamp: Timestamp.now()
      })
      console.log('Activity logged successfully:', activity.type)
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  },

  // Get recent activities for a user
  async getUserActivities(userId: string, limitCount: number = 10): Promise<Activity[]> {
    try {
      const q = query(
        collection(db, ACTIVITIES_COLLECTION),
        where('userId', '==', userId),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      const activities: Activity[] = []
      
      querySnapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data()
        } as Activity)
      })
      
      return activities
    } catch (error) {
      console.error('Error fetching user activities:', error)
      return []
    }
  },

  // Subscribe to recent activities for a user (real-time)
  subscribeUserActivities(
    userId: string,
    limitCount: number,
    callback: (activities: Activity[]) => void
  ): () => void {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where('userId', '==', userId),
      limit(limitCount)
    )
    return onSnapshot(q, (snapshot) => {
      const activities: Activity[] = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
      callback(activities)
    }, (error) => {
      console.error('Activity subscription error:', error)
      callback([])
    })
  },

  // Listen to real-time activity updates for a user
  onActivitiesChange: (userId: string, callback: (activities: Activity[]) => void, limitCount: number = 5) => {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where('userId', '==', userId),
      limit(limitCount)
    )

    return onSnapshot(q, (snapshot) => {
      const activities: Activity[] = []
      snapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data()
        } as Activity)
      })
      callback(activities)
    }, (error) => {
      console.error('Error listening to activities:', error)
    })
  },

  // Helper functions for common activity types
  async logFamilyMemberAdded(userId: string, memberName: string, memberId: string): Promise<void> {
    await this.addActivity({
      userId,
      type: 'family_member_added',
      title: 'Family Member Added',
      description: `${memberName} was added to the family tree`,
      metadata: { familyMemberId: memberId }
    })
  },

  async logFamilyMemberUpdated(userId: string, memberName: string, memberId: string): Promise<void> {
    await this.addActivity({
      userId,
      type: 'family_member_updated',
      title: 'Family Member Updated',
      description: `${memberName}'s information was updated`,
      metadata: { familyMemberId: memberId }
    })
  },

  async logMemoryUploaded(userId: string, memoryTitle: string, memoryId: string, memoryType: 'audio' | 'image'): Promise<void> {
    await this.addActivity({
      userId,
      type: 'memory_uploaded',
      title: 'Cultural Memory Uploaded',
      description: `${memoryTitle} (${memoryType}) was added to cultural memories`,
      metadata: { memoryId, memoryType }
    })
  },

  async logBurialSiteAdded(userId: string, siteName: string, siteId: string): Promise<void> {
    await this.addActivity({
      userId,
      type: 'burial_site_added',
      title: 'Burial Site Added',
      description: `${siteName} was added to burial sites`,
      metadata: { burialSiteId: siteId }
    })
  },

  async logBurialSiteUpdated(userId: string, siteName: string, siteId: string): Promise<void> {
    await this.addActivity({
      userId,
      type: 'burial_site_updated',
      title: 'Burial Site Updated',
      description: `${siteName} was updated`,
      metadata: { burialSiteId: siteId }
    })
  },

  async logProfileUpdated(userId: string): Promise<void> {
    await this.addActivity({
      userId,
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'Personal information was updated'
    })
  }
}
