import { describe, it, expect, vi, beforeEach } from 'vitest'
import { familyService, FamilyMember } from '../familyService'
import * as firestoreService from '../firestore'

// Mock the firestore service
vi.mock('../firestore', () => ({
  firestoreService: {
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    onSnapshot: vi.fn(),
  },
  convertTimestamps: vi.fn((data) => data),
}))

describe('familyService', () => {
  const mockUserId = 'user-123'
  const mockMember: FamilyMember = {
    id: 'member-123',
    userId: mockUserId,
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Living',
    birthYear: '1990',
    relationship: 'Self',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getFamilyMembers', () => {
    it('should fetch family members for a user', async () => {
      vi.mocked(firestoreService.firestoreService.getDocs).mockResolvedValue([mockMember])

      const result = await familyService.getFamilyMembers(mockUserId)

      expect(result).toEqual([mockMember])
      expect(firestoreService.firestoreService.getDocs).toHaveBeenCalledWith(
        'familyMembers',
        expect.arrayContaining([])
      )
    })

    it('should return empty array on error', async () => {
      vi.mocked(firestoreService.firestoreService.getDocs).mockRejectedValue(
        new Error('Permission denied')
      )

      const result = await familyService.getFamilyMembers(mockUserId)

      expect(result).toEqual([])
    })

    it('should return empty array when no members found', async () => {
      vi.mocked(firestoreService.firestoreService.getDocs).mockResolvedValue([])

      const result = await familyService.getFamilyMembers(mockUserId)

      expect(result).toEqual([])
    })
  })

  describe('getFamilyMember', () => {
    it('should fetch a single family member', async () => {
      vi.mocked(firestoreService.firestoreService.getDoc).mockResolvedValue(mockMember)

      const result = await familyService.getFamilyMember('member-123')

      expect(result).toEqual(mockMember)
      expect(firestoreService.firestoreService.getDoc).toHaveBeenCalledWith(
        'familyMembers',
        'member-123'
      )
    })

    it('should return null when member not found', async () => {
      vi.mocked(firestoreService.firestoreService.getDoc).mockResolvedValue(null)

      const result = await familyService.getFamilyMember('non-existent')

      expect(result).toBeNull()
    })

    it('should throw error on fetch failure', async () => {
      vi.mocked(firestoreService.firestoreService.getDoc).mockRejectedValue(
        new Error('Network error')
      )

      await expect(familyService.getFamilyMember('member-123')).rejects.toThrow('Network error')
    })
  })

  describe('addFamilyMember', () => {
    it('should add a new family member', async () => {
      const newMemberData = {
        name: 'Jane Doe',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Living' as const,
        relationship: 'Sister',
      }

      vi.mocked(firestoreService.firestoreService.addDoc).mockResolvedValue('new-member-id')

      const result = await familyService.addFamilyMember(mockUserId, newMemberData)

      expect(result).toBe('new-member-id')
      expect(firestoreService.firestoreService.addDoc).toHaveBeenCalledWith(
        'familyMembers',
        expect.objectContaining({
          userId: mockUserId,
          ...newMemberData,
        })
      )
    })

    it('should remove undefined values from payload', async () => {
      const newMemberData = {
        name: 'Jane Doe',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Living' as const,
        relationship: 'Sister',
        middleName: undefined,
        email: undefined,
      }

      vi.mocked(firestoreService.firestoreService.addDoc).mockResolvedValue('new-member-id')

      await familyService.addFamilyMember(mockUserId, newMemberData)

      const callArgs = vi.mocked(firestoreService.firestoreService.addDoc).mock.calls[0]
      const payload = callArgs[1] as any

      expect(payload.middleName).toBeUndefined()
      expect(payload.email).toBeUndefined()
    })

    it('should throw error on add failure', async () => {
      const newMemberData = {
        name: 'Jane Doe',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Living' as const,
        relationship: 'Sister',
      }

      vi.mocked(firestoreService.firestoreService.addDoc).mockRejectedValue(
        new Error('Add failed')
      )

      await expect(familyService.addFamilyMember(mockUserId, newMemberData)).rejects.toThrow(
        'Add failed'
      )
    })
  })

  describe('updateFamilyMember', () => {
    it('should update a family member', async () => {
      const updates = { name: 'John Updated' }

      vi.mocked(firestoreService.firestoreService.updateDoc).mockResolvedValue(undefined)

      await familyService.updateFamilyMember('member-123', updates)

      expect(firestoreService.firestoreService.updateDoc).toHaveBeenCalledWith(
        'familyMembers',
        'member-123',
        updates
      )
    })

    it('should throw error on update failure', async () => {
      vi.mocked(firestoreService.firestoreService.updateDoc).mockRejectedValue(
        new Error('Update failed')
      )

      await expect(
        familyService.updateFamilyMember('member-123', { name: 'Updated' })
      ).rejects.toThrow('Update failed')
    })
  })

  describe('deleteFamilyMember', () => {
    it('should delete a family member', async () => {
      vi.mocked(firestoreService.firestoreService.deleteDoc).mockResolvedValue(undefined)

      await familyService.deleteFamilyMember('member-123')

      expect(firestoreService.firestoreService.deleteDoc).toHaveBeenCalledWith(
        'familyMembers',
        'member-123'
      )
    })

    it('should throw error on delete failure', async () => {
      vi.mocked(firestoreService.firestoreService.deleteDoc).mockRejectedValue(
        new Error('Delete failed')
      )

      await expect(familyService.deleteFamilyMember('member-123')).rejects.toThrow('Delete failed')
    })
  })

  describe('onFamilyMembersChange', () => {
    it('should set up real-time listener for family members', () => {
      const callback = vi.fn()
      const unsubscribe = vi.fn()

      vi.mocked(firestoreService.firestoreService.onSnapshot).mockReturnValue(unsubscribe)

      const result = familyService.onFamilyMembersChange(mockUserId, callback)

      expect(firestoreService.firestoreService.onSnapshot).toHaveBeenCalledWith(
        'familyMembers',
        expect.any(Function),
        expect.arrayContaining([])
      )
      expect(result).toBe(unsubscribe)
    })

    it('should call callback with converted members', () => {
      const callback = vi.fn()
      const unsubscribe = vi.fn()

      vi.mocked(firestoreService.firestoreService.onSnapshot).mockImplementation(
        (collection, cb) => {
          // Simulate snapshot callback
          cb([mockMember])
          return unsubscribe
        }
      )

      familyService.onFamilyMembersChange(mockUserId, callback)

      expect(callback).toHaveBeenCalledWith([mockMember])
    })
  })
})

