import { vi } from 'vitest'

// Mock React Router
export const mockNavigate = vi.fn()
export const mockUseNavigate = () => mockNavigate
export const mockUseParams = vi.fn(() => ({}))
export const mockUseLocation = vi.fn(() => ({ pathname: '/', state: null }))
export const mockLink = vi.fn(({ to, children, ...props }: any) => {
  // Return a simple object instead of JSX for TypeScript compatibility
  return { type: 'a', href: to, children, ...props }
})

// Note: This file should not be imported directly in production code
// It's only used in test files which are excluded from the build

