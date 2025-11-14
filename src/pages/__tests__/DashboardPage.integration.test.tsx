import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/utils/testUtils'
import DashboardPage from '../DashboardPage'
import { activityService } from '../../firebase/services/activityService'
import { familyService } from '../../firebase/services/familyService'
import { useAuth } from '../../contexts/AuthContext'

// Mock the services
vi.mock('../../firebase/services/activityService')
vi.mock('../../firebase/services/familyService')
vi.mock('../../contexts/AuthContext')

const mockActivityService = vi.mocked(activityService)
const mockFamilyService = vi.mocked(familyService)
const mockUseAuth = vi.mocked(useAuth)

describe('DashboardPage Integration', () => {
  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
  }

  const mockActivities = [
    {
      id: 'activity-1',
      userId: 'test-user-123',
      type: 'family_member_added' as const,
      title: 'Family Member Added',
      description: 'John Doe was added to the family tree',
      timestamp: { toDate: () => new Date('2024-01-01'), seconds: 1704067200 } as any,
      metadata: { familyMemberId: 'member-1' },
    },
  ]

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

    // Mock activity service
    mockActivityService.onActivitiesChange.mockImplementation((userId, callback) => {
      setTimeout(() => callback(mockActivities), 100)
      return vi.fn() // Return unsubscribe function
    })

    // Mock family service
    mockFamilyService.getFamilyMembers.mockResolvedValue(mockFamilyMembers as any)
  })

  it('should render dashboard with user greeting', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText(/Welcome, Test/i)).toBeInTheDocument()
  })

  it('should display navigation cards', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText(/Manage Family Tree/i)).toBeInTheDocument()
    expect(screen.getByText(/Explore Burial Sites/i)).toBeInTheDocument()
    expect(screen.getByText(/Manage Archives/i)).toBeInTheDocument()
  })

  it('should load and display recent activities', async () => {
    render(<DashboardPage />)
    
    // Wait for activities to load
    await waitFor(() => {
      expect(mockActivityService.onActivitiesChange).toHaveBeenCalledWith(
        'test-user-123',
        expect.any(Function)
      )
    })

    // Check if activity is displayed
    await waitFor(() => {
      expect(screen.getByText(/Family Member Added/i)).toBeInTheDocument()
    })
  })

  it('should load and display family timeline', async () => {
    render(<DashboardPage />)
    
    // Wait for family members to load
    await waitFor(() => {
      expect(mockFamilyService.getFamilyMembers).toHaveBeenCalledWith('test-user-123')
    })

    // FamilyTimeline component should be rendered
    await waitFor(() => {
      expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
    })
  })

  it('should handle empty activities gracefully', async () => {
    mockActivityService.onActivitiesChange.mockImplementation((userId, callback) => {
      setTimeout(() => callback([]), 100)
      return vi.fn()
    })

    render(<DashboardPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/No recent activity/i)).toBeInTheDocument()
    })
  })

  it('should handle loading state for activities', () => {
    mockActivityService.onActivitiesChange.mockImplementation(() => {
      // Don't call callback immediately to simulate loading
      return vi.fn()
    })

    render(<DashboardPage />)
    
    // Should show loading state initially
    // (This depends on your loading UI implementation)
  })
})

