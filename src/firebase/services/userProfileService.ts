import { db } from '../config'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  phone?: string
  location?: string
  bio?: string
  photoURL?: string
  createdAt: Date
  updatedAt: Date
}

export const userProfileService = {
  // Get user profile from Firestore
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'userProfiles', uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          uid: data.uid,
          displayName: data.displayName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          bio: data.bio,
          photoURL: data.photoURL,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        }
      }
      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  },

  // Create or update user profile in Firestore
  updateUserProfile: async (profile: Partial<UserProfile>): Promise<void> => {
    try {
      if (!profile.uid) {
        throw new Error('User ID is required')
      }

      const profileRef = doc(db, 'userProfiles', profile.uid)
      const existingProfile = await getDoc(profileRef)

      const profileData = {
        uid: profile.uid,
        displayName: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        photoURL: profile.photoURL,
        updatedAt: new Date(),
        ...(existingProfile.exists() ? {} : { createdAt: new Date() })
      }

      if (existingProfile.exists()) {
        await updateDoc(profileRef, profileData)
      } else {
        await setDoc(profileRef, profileData)
      }

      console.log('User profile updated successfully')
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }
}
