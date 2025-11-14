import { vi } from 'vitest'

// Mock React Router
export const mockNavigate = vi.fn()
export const mockUseNavigate = () => mockNavigate
export const mockUseParams = vi.fn(() => ({}))
export const mockUseLocation = vi.fn(() => ({ pathname: '/', state: null }))
export const mockLink = vi.fn(({ to, children, ...props }: any) => {
  return <a href={to} {...props}>{children}</a>
})

// Mock React Router DOM
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: mockUseParams,
    useLocation: mockUseLocation,
    Link: mockLink,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
  }
})

