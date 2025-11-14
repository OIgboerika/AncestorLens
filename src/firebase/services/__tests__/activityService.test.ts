import { describe, it, expect, vi, beforeEach } from 'vitest'
import { activityService, Activity } from '../activityService'
import { db } from '../../config'
import { collection, addDoc, getDocs, query, where, limit, onSnapshot, Timestamp } from 'firebase/firestore'

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({
      toDate: () => new Date(),
      seconds: Math.floor(Date.now() / 1000),
    })),
  },
}))

vi.mock('../../config', () => ({
  db: {},
}))

describe('activityService', () => {
  const mockUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('addActivity', () => {
    it('should add a new activity', async () => {
      const mockCollection = {}
      const mockAddDoc = vi.mocked(addDoc)
      vi.mocked(collection).mockReturnValue(mockCollection as any)
      mockAddDoc.mockResolvedValue({ id: 'activity-123' } as any)

      await activityService.addActivity({
        userId: mockUserId,
        type: 'family_member_added',
        title: 'Family Member Added',
        description: 'John Doe was added',
      })

      expect(collection).toHaveBeenCalledWith(db, 'activities')
      expect(mockAddDoc).toHaveBeenCalledWith(
        mockCollection,
        expect.objectContaining({
          userId: mockUserId,
          type: 'family_member_added',
          title: 'Family Member Added',
          description: 'John Doe was added',
          timestamp: expect.any(Object),
        })
      )
    })

    it('should handle errors gracefully', async () => {
      const mockCollection = {}
      const mockAddDoc = vi.mocked(addDoc)
      vi.mocked(collection).mockReturnValue(mockCollection as any)
      mockAddDoc.mockRejectedValue(new Error('Add failed'))

      // Should not throw
      await activityService.addActivity({
        userId: mockUserId,
        type: 'family_member_added',
        title: 'Test',
        description: 'Test',
      })

      // Error should be logged but not thrown
      expect(mockAddDoc).toHaveBeenCalled()
    })
  })

  describe('getUserActivities', () => {
    it('should fetch user activities', async () => {
      const mockCollection = {}
      const mockQuery = {}
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'activity-123',
            data: () => ({
              userId: mockUserId,
              type: 'family_member_added',
              title: 'Family Member Added',
              description: 'John Doe was added',
              timestamp: Timestamp.now(),
            }),
          },
        ],
        forEach: function(fn: (doc: any) => void) {
          this.docs.forEach(fn)
        }
      }

      vi.mocked(collection).mockReturnValue(mockCollection as any)
      vi.mocked(query).mockReturnValue(mockQuery as any)
      vi.mocked(where).mockReturnValue({} as any)
      vi.mocked(limit).mockReturnValue({} as any)
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any)

      const result = await activityService.getUserActivities(mockUserId, 10)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('activity-123')
      expect(collection).toHaveBeenCalledWith(db, 'activities')
    })

    it('should return empty array on error', async () => {
      vi.mocked(collection).mockReturnValue({} as any)
      vi.mocked(query).mockReturnValue({} as any)
      vi.mocked(where).mockReturnValue({} as any)
      vi.mocked(limit).mockReturnValue({} as any)
      vi.mocked(getDocs).mockRejectedValue(new Error('Fetch failed'))

      const result = await activityService.getUserActivities(mockUserId, 10)

      expect(result).toEqual([])
    })

    it('should use default limit of 10', async () => {
      const mockCollection = {}
      const mockQuery = {}
      const mockQuerySnapshot = { docs: [] }

      vi.mocked(collection).mockReturnValue(mockCollection as any)
      vi.mocked(query).mockReturnValue(mockQuery as any)
      vi.mocked(where).mockReturnValue({} as any)
      vi.mocked(limit).mockReturnValue({} as any)
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any)

      await activityService.getUserActivities(mockUserId)

      expect(limit).toHaveBeenCalledWith(10)
    })
  })

  describe('onActivitiesChange', () => {
    it('should set up real-time listener for activities', () => {
      const callback = vi.fn()
      const unsubscribe = vi.fn()
      const mockCollection = {}
      const mockQuery = {}

      vi.mocked(collection).mockReturnValue(mockCollection as any)
      vi.mocked(query).mockReturnValue(mockQuery as any)
      vi.mocked(where).mockReturnValue({} as any)
      vi.mocked(limit).mockReturnValue({} as any)
      vi.mocked(onSnapshot).mockImplementation((_q, cb, _onError) => {
        // Simulate snapshot callback
        const mockSnapshot = {
          docs: [
            {
              id: 'activity-123',
              data: () => ({
                userId: mockUserId,
                type: 'family_member_added',
                title: 'Test',
                description: 'Test',
                timestamp: Timestamp.now(),
              }),
            },
          ],
          forEach: (fn: (doc: any) => void) => {
            mockSnapshot.docs.forEach(fn)
          }
        } as any
        cb(mockSnapshot)
        return unsubscribe
      })

      const result = activityService.onActivitiesChange(mockUserId, callback)

      expect(onSnapshot).toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
      expect(result).toBe(unsubscribe)
    })

    it('should call callback with empty array on error', () => {
      const callback = vi.fn()
      const unsubscribe = vi.fn()
      const mockCollection = {}
      const mockQuery = {}

      vi.mocked(collection).mockReturnValue(mockCollection as any)
      vi.mocked(query).mockReturnValue(mockQuery as any)
      vi.mocked(where).mockReturnValue({} as any)
      vi.mocked(limit).mockReturnValue({} as any)
      vi.mocked(onSnapshot).mockImplementation((_q, _cb, onError) => {
        // Simulate error
        if (onError) {
          onError(new Error('Permission denied') as any)
        }
        return unsubscribe
      })

      activityService.onActivitiesChange(mockUserId, callback)

      expect(callback).toHaveBeenCalledWith([])
    })
  })

  describe('logActivity helpers', () => {
    it('should log family member added activity', async () => {
      const mockCollection = {}
      const mockAddDoc = vi.mocked(addDoc)
      vi.mocked(collection).mockReturnValue(mockCollection as any)
      mockAddDoc.mockResolvedValue({ id: 'activity-123' } as any)

      await activityService.logFamilyMemberAdded(mockUserId, 'John Doe', 'member-123')

      expect(mockAddDoc).toHaveBeenCalledWith(
        mockCollection,
        expect.objectContaining({
          userId: mockUserId,
          type: 'family_member_added',
          title: expect.stringContaining('Family Member Added'),
          metadata: expect.objectContaining({
            familyMemberId: 'member-123',
          }),
        })
      )
    })

    it('should log memory uploaded activity', async () => {
      const mockCollection = {}
      const mockAddDoc = vi.mocked(addDoc)
      vi.mocked(collection).mockReturnValue(mockCollection as any)
      mockAddDoc.mockResolvedValue({ id: 'activity-123' } as any)

      await activityService.logMemoryUploaded(mockUserId, 'Test Memory', 'memory-123', 'image')

      expect(mockAddDoc).toHaveBeenCalledWith(
        mockCollection,
        expect.objectContaining({
          type: 'memory_uploaded',
          metadata: expect.objectContaining({
            memoryId: 'memory-123',
          }),
        })
      )
    })

    it('should log burial site added activity', async () => {
      const mockCollection = {}
      const mockAddDoc = vi.mocked(addDoc)
      vi.mocked(collection).mockReturnValue(mockCollection as any)
      mockAddDoc.mockResolvedValue({ id: 'activity-123' } as any)

      await activityService.logBurialSiteAdded(mockUserId, 'Test Site', 'site-123')

      expect(mockAddDoc).toHaveBeenCalledWith(
        mockCollection,
        expect.objectContaining({
          type: 'burial_site_added',
          metadata: expect.objectContaining({
            burialSiteId: 'site-123',
          }),
        })
      )
    })

    it('should log archive uploaded activity', async () => {
      const mockCollection = {}
      const mockAddDoc = vi.mocked(addDoc)
      vi.mocked(collection).mockReturnValue(mockCollection as any)
      mockAddDoc.mockResolvedValue({ id: 'activity-123' } as any)

      await activityService.logArchiveUploaded(mockUserId, 'Test Document', 'archive-123')

      expect(mockAddDoc).toHaveBeenCalledWith(
        mockCollection,
        expect.objectContaining({
          type: 'archive_uploaded',
          metadata: expect.objectContaining({
            archiveId: 'archive-123',
          }),
        })
      )
    })
  })
})

