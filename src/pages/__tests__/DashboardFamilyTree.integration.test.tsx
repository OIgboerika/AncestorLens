import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/utils/testUtils'
import DashboardPage from '../DashboardPage'
import { activityService } from '../../firebase/services/activityService'
import { familyService } from '../../firebase/services/familyService'
import { useAuth } from '../../contexts/AuthContext'

// Mock services
vi.mock('../../firebase/services/activityService')
vi.mock('../../firebase/services/familyService')
vi.mock('../../contexts/AuthContext')

const mockActivityService = vi.mocked(activityService)
const mockFamilyService = vi.mocked(familyService)
const mockUseAuth = vi.mocked(useAuth)

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
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    } as any)

    mockActivityService.onActivitiesChange.mockImplementation((userId, callback) => {
      setTimeout(() => callback(mockActivities), 100)
      return vi.fn()
    })

    mockFamilyService.getFamilyMembers.mockResolvedValue(mockFamilyMembers as any)
  })

  it('should display family timeline with correct data from family service', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      expect(mockFamilyService.getFamilyMembers).toHaveBeenCalledWith('test-user-123')
    })

    // FamilyTimeline should receive the family members
    await waitFor(() => {
      expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
    })
  })

  it('should show recent activity when family member is added', async () => {
    render(<DashboardPage />)

    await waitFor(() => {
      expect(mockActivityService.onActivitiesChange).toHaveBeenCalled()
    })

    // Activity should be displayed
    await waitFor(() => {
      expect(screen.getByText(/Family Member Added/i)).toBeInTheDocument()
    })
  })

  it('should synchronize family members and activities', async () => {
    render(<DashboardPage />)

    // Both services should be called
    await waitFor(() => {
      expect(mockFamilyService.getFamilyMembers).toHaveBeenCalled()
      expect(mockActivityService.onActivitiesChange).toHaveBeenCalled()
    })

    // Both components should render
    expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
  })
})

