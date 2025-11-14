import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/utils/testUtils'
import DashboardPage from '../DashboardPage'
import { activityService } from '../../firebase/services/activityService'
import { familyService } from '../../firebase/services/familyService'

// Mock Firebase config first
vi.mock('../../firebase/config', () => ({
  auth: {},
  db: {},
  storage: {},
}))

// Mock services
vi.mock('../../firebase/services/activityService')
vi.mock('../../firebase/services/familyService')

const mockActivityService = vi.mocked(activityService)
const mockFamilyService = vi.mocked(familyService)

describe('Dashboard and Family Tree Integration', () => {
  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
  }

  const mockFamilyMembers = [
    {
      id: 'member-1',
      userId: 'test-user-123',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Living' as const,
      birthYear: '1990',
      relationship: 'Self',
    },
    {
      id: 'member-2',
      userId: 'test-user-123',
      name: 'Jane Doe',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'Living' as const,
      birthYear: '1992',
      relationship: 'Sister',
    },
  ]

  const mockActivities = [
    {
      id: 'activity-1',
      userId: 'test-user-123',
      type: 'family_member_added' as const,
      title: 'Family Member Added',
      description: 'John Doe was added to the family tree',
      timestamp: { toDate: () => new Date('2024-01-01'), seconds: 1704067200 } as any,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockActivityService.onActivitiesChange.mockImplementation((userId, callback) => {
      // Call callback immediately with mock data
      Promise.resolve().then(() => callback(mockActivities))
      return vi.fn()
    })

    mockFamilyService.getFamilyMembers.mockResolvedValue(mockFamilyMembers as any)
  })

  it('should display family timeline with correct data from family service', async () => {
    render(<DashboardPage />)

    // Wait for AuthProvider to initialize and component to load
    await waitFor(() => {
      expect(mockFamilyService.getFamilyMembers).toHaveBeenCalledWith('test-user-123')
    }, { timeout: 3000 })

    // FamilyTimeline should receive the family members
    await waitFor(() => {
      expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should show recent activity when family member is added', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      expect(mockActivityService.onActivitiesChange).toHaveBeenCalled()
    }, { timeout: 3000 })

    // Activity should be displayed
    await waitFor(() => {
      expect(screen.getByText(/Family Member Added/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should synchronize family members and activities', async () => {
    render(<DashboardPage />)

    // Both services should be called
    await waitFor(() => {
      expect(mockFamilyService.getFamilyMembers).toHaveBeenCalled()
      expect(mockActivityService.onActivitiesChange).toHaveBeenCalled()
    }, { timeout: 3000 })

    // Both components should render
    await waitFor(() => {
      expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})

