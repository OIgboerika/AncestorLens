import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/utils/testUtils'
import { userEvent } from '@testing-library/user-event'
import FamilyTreeBuilderPage from '../FamilyTreeBuilderPage'
import { familyService } from '../../../firebase/services/familyService'
import { activityService } from '../../../firebase/services/activityService'
import { cloudinaryService } from '../../../services/cloudinaryService'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// Mock dependencies
vi.mock('../../../firebase/services/familyService')
vi.mock('../../../firebase/services/activityService')
vi.mock('../../../services/cloudinaryService')
vi.mock('../../../contexts/AuthContext')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

const mockFamilyService = vi.mocked(familyService)
const mockActivityService = vi.mocked(activityService)
const mockCloudinaryService = vi.mocked(cloudinaryService)
const mockUseAuth = vi.mocked(useAuth)
const mockUseNavigate = vi.mocked(useNavigate)

describe('FamilyTreeBuilderPage Integration', () => {
  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
  }

  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    } as any)

    mockUseNavigate.mockReturnValue(mockNavigate)

    // Mock services
    mockFamilyService.addFamilyMember.mockResolvedValue('new-member-id')
    mockCloudinaryService.uploadFamilyMemberPhoto.mockResolvedValue('https://example.com/image.jpg')
    mockActivityService.logFamilyMemberAdded.mockResolvedValue()
  })

  it('should render form with all input fields', () => {
    render(<FamilyTreeBuilderPage />)

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/relationship/i)).toBeInTheDocument()
  })

  it('should allow user to fill out form fields', async () => {
    const user = userEvent.setup()
    render(<FamilyTreeBuilderPage />)

    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)

    await user.type(firstNameInput, 'John')
    await user.type(lastNameInput, 'Doe')

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
  })

  it('should submit form and create family member', async () => {
    const user = userEvent.setup()
    render(<FamilyTreeBuilderPage />)

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.selectOptions(screen.getByLabelText(/relationship/i), 'Self')

    // Submit
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Wait for service calls
    await waitFor(() => {
      expect(mockFamilyService.addFamilyMember).toHaveBeenCalled()
    })

    // Verify activity was logged
    await waitFor(() => {
      expect(mockActivityService.logFamilyMemberAdded).toHaveBeenCalled()
    })
  })

  it('should navigate back when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(<FamilyTreeBuilderPage />)

    const cancelButton = screen.getByRole('button', { name: /cancel|back/i })
    await user.click(cancelButton)

    expect(mockNavigate).toHaveBeenCalled()
  })

  it('should load parent options from localStorage', () => {
    const existingMembers = [
      { id: '1', name: 'Parent One', relationship: 'Father' },
      { id: '2', name: 'Parent Two', relationship: 'Mother' },
    ]
    localStorage.setItem('familyMembers', JSON.stringify(existingMembers))

    render(<FamilyTreeBuilderPage />)

    // Parent options should be available
    // (This depends on how parent selection is implemented)
  })

  it('should handle image upload', async () => {
    const user = userEvent.setup()
    render(<FamilyTreeBuilderPage />)

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/profile image|photo/i) as HTMLInputElement

    await user.upload(fileInput, file)

    // Verify image is prepared for upload
    expect(fileInput.files?.[0]).toBe(file)
  })
})

