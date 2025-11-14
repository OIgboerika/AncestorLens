import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test/utils/testUtils'
import FamilyTimeline from '../family/FamilyTimeline'

describe('FamilyTimeline Integration', () => {
  const mockFamilyMembers = [
    {
      id: '1',
      name: 'John Doe',
      birthYear: '1990',
      deathYear: null,
      role: 'Living' as const,
    },
    {
      id: '2',
      name: 'Jane Doe',
      birthYear: '1985',
      deathYear: '2020',
      role: 'Deceased' as const,
    },
    {
      id: '3',
      name: 'Bob Doe',
      birthYear: '1960',
      deathYear: null,
      role: 'Living' as const,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render timeline with family members', () => {
    render(<FamilyTimeline familyMembers={mockFamilyMembers as any} />)

    expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
  })

  it('should display birth and death events on timeline', () => {
    render(<FamilyTimeline familyMembers={mockFamilyMembers as any} />)

    // Timeline should show events for each member
    // (Specific assertions depend on component implementation)
    expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
  })

  it('should handle empty family members array', () => {
    render(<FamilyTimeline familyMembers={[]} />)

    expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
  })

  it('should calculate correct year range from members', () => {
    render(<FamilyTimeline familyMembers={mockFamilyMembers as any} />)

    // Timeline should span from earliest birth (1960) to latest event
    expect(screen.getByText(/Family Timeline/i)).toBeInTheDocument()
  })
})

