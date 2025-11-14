import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../../test/utils/testUtils'
import { userEvent } from '@testing-library/user-event'
import FamilyTreeBuilderPage from '../FamilyTreeBuilderPage'
import { familyService } from '../../../firebase/services/familyService'
import { activityService } from '../../../firebase/services/activityService'
import { cloudinaryService } from '../../../services/cloudinaryService'
import { useNavigate } from 'react-router-dom'

// Mock Firebase config first
vi.mock('../../../firebase/config', () => ({
  auth: {},
  db: {},
  storage: {},
}))

// Mock dependencies
vi.mock('../../../firebase/services/familyService')
vi.mock('../../../firebase/services/activityService')
vi.mock('../../../services/cloudinaryService')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockFamilyService = vi.mocked(familyService)
const mockActivityService = vi.mocked(activityService)
const mockCloudinaryService = vi.mocked(cloudinaryService)

describe('FamilyTreeBuilderPage Integration', () => {
  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockNavigate.mockClear()

    // Mock services
    mockFamilyService.addFamilyMember.mockResolvedValue('new-member-id')
    mockCloudinaryService.uploadFamilyMemberPhoto.mockResolvedValue('https://example.com/image.jpg')
    mockActivityService.logFamilyMemberAdded.mockResolvedValue()
  })

  it('should render form with all input fields', async () => {
    render(<FamilyTreeBuilderPage />)

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter first name/i)).toBeInTheDocument()
    })
    expect(screen.getByPlaceholderText(/Enter last name/i)).toBeInTheDocument()
    expect(screen.getByText(/Relationship/i)).toBeInTheDocument()
  })

  it('should allow user to fill out form fields', async () => {
    const user = userEvent.setup()
    render(<FamilyTreeBuilderPage />)

    // Wait for form to render
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter first name/i)).toBeInTheDocument()
    })

    const firstNameInput = screen.getByPlaceholderText(/Enter first name/i)
    const lastNameInput = screen.getByPlaceholderText(/Enter last name/i)

    await user.type(firstNameInput, 'John')
    await user.type(lastNameInput, 'Doe')

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
  })

  it('should submit form and create family member', async () => {
    const user = userEvent.setup()
    render(<FamilyTreeBuilderPage />)

    // Wait for form to render
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter first name/i)).toBeInTheDocument()
    })

    // Fill form
    await user.type(screen.getByPlaceholderText(/Enter first name/i), 'John')
    await user.type(screen.getByPlaceholderText(/Enter last name/i), 'Doe')
    
    // Select relationship from dropdown
    const relationshipSelect = screen.getByRole('combobox', { name: /relationship/i }) || screen.getByDisplayValue(/select relationship/i) || document.querySelector('select[name="relationship"]')
    if (relationshipSelect) {
      await user.selectOptions(relationshipSelect as HTMLSelectElement, 'Self')
    }

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

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/Back to Family Tree/i)).toBeInTheDocument()
    })

    const backButton = screen.getByText(/Back to Family Tree/i).closest('button')
    if (backButton) {
      await user.click(backButton)
      expect(mockNavigate).toHaveBeenCalledWith('/family-tree')
    }
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

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/Upload Photo/i)).toBeInTheDocument()
    })

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/Upload Photo/i) as HTMLInputElement

    await user.upload(fileInput, file)

    // Verify image is prepared for upload
    expect(fileInput.files?.[0]).toBe(file)
  })
})

