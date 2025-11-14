import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { geocodingService } from '../geocodingService'
import { mockGeocodingResponse, mockReverseGeocodingResponse, mockGeocodingFetch } from '../../test/mocks/geocoding'

// Mock global fetch
global.fetch = vi.fn()

describe('geocodingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('geocodeAddress', () => {
    it('should successfully geocode a valid address', async () => {
      const mockFetchFn = mockGeocodingFetch(true, false)
      global.fetch = mockFetchFn

      const result = await geocodingService.geocodeAddress('Lagos, Nigeria')

      expect(result).toEqual({
        lat: 6.5244,
        lng: 3.3792,
      })
      expect(mockFetchFn).toHaveBeenCalledWith(
        expect.stringContaining('Lagos%2C+Nigeria')
      )
    })

    it('should return null for empty address', async () => {
      const result = await geocodingService.geocodeAddress('')
      expect(result).toBeNull()
    })

    it('should return null for whitespace-only address', async () => {
      const result = await geocodingService.geocodeAddress('   ')
      expect(result).toBeNull()
    })

    it('should handle API errors gracefully', async () => {
      const mockFetchFn = mockGeocodingFetch(false, false)
      global.fetch = mockFetchFn

      const result = await geocodingService.geocodeAddress('Invalid Address')

      expect(result).toBeNull()
    })

    it('should return null when no results are found', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => [],
        } as Response)
      )

      const result = await geocodingService.geocodeAddress('Nonexistent Place')

      expect(result).toBeNull()
    })

    it('should clean and format address correctly', async () => {
      const mockFetchFn = mockGeocodingFetch(true, false)
      global.fetch = mockFetchFn

      await geocodingService.geocodeAddress('  Lagos  ,  Nigeria  ')

      expect(mockFetchFn).toHaveBeenCalledWith(
        expect.stringContaining('Lagos%2C+Nigeria')
      )
    })
  })

  describe('reverseGeocode', () => {
    it('should successfully reverse geocode coordinates', async () => {
      const mockFetchFn = mockGeocodingFetch(true, true)
      global.fetch = mockFetchFn

      const result = await geocodingService.reverseGeocode(6.5244, 3.3792)

      expect(result).toBe('Lagos, Nigeria')
      expect(mockFetchFn).toHaveBeenCalledWith(
        expect.stringContaining('lat=6.5244&lon=3.3792')
      )
    })

    it('should return null on API error', async () => {
      const mockFetchFn = mockGeocodingFetch(false, true)
      global.fetch = mockFetchFn

      const result = await geocodingService.reverseGeocode(0, 0)

      expect(result).toBeNull()
    })

    it('should return null when display_name is missing', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({}),
        } as Response)
      )

      const result = await geocodingService.reverseGeocode(0, 0)

      expect(result).toBeNull()
    })
  })

  describe('buildAddressString', () => {
    it('should build address string from all components', () => {
      const result = geocodingService.buildAddressString(
        'Lagos',
        'Lagos State',
        'Nigeria',
        '123 Main Street'
      )

      expect(result).toBe('123 Main Street, Lagos, Lagos State, Nigeria')
    })

    it('should build address without street address', () => {
      const result = geocodingService.buildAddressString(
        'Lagos',
        'Lagos State',
        'Nigeria'
      )

      expect(result).toBe('Lagos, Lagos State, Nigeria')
    })

    it('should build address with only city and country', () => {
      const result = geocodingService.buildAddressString(
        'Lagos',
        undefined,
        'Nigeria'
      )

      expect(result).toBe('Lagos, Nigeria')
    })

    it('should remove duplicate country from address', () => {
      const result = geocodingService.buildAddressString(
        'Lagos',
        'Lagos State',
        'Nigeria',
        '123 Main Street, Nigeria'
      )

      expect(result).toBe('123 Main Street, Lagos, Lagos State, Nigeria')
    })

    it('should handle empty strings', () => {
      const result = geocodingService.buildAddressString('', '', '', '')

      expect(result).toBe('')
    })

    it('should trim whitespace from components', () => {
      const result = geocodingService.buildAddressString(
        '  Lagos  ',
        '  Lagos State  ',
        '  Nigeria  '
      )

      expect(result).toBe('Lagos, Lagos State, Nigeria')
    })
  })

  describe('getCurrentLocation', () => {
    it('should get current location when geolocation is available', async () => {
      const mockPosition = {
        coords: {
          latitude: 6.5244,
          longitude: 3.3792,
          accuracy: 10,
        },
      }

      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => {
          success(mockPosition)
        }),
      }

      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      })

      const result = await geocodingService.getCurrentLocation()

      expect(result).toEqual({
        lat: 6.5244,
        lng: 3.3792,
      })
    })

    it('should return null when geolocation is not supported', async () => {
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        writable: true,
      })

      const result = await geocodingService.getCurrentLocation()

      expect(result).toBeNull()
    })

    it('should return null on geolocation error', async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((success, error) => {
          error(new Error('Permission denied'))
        }),
      }

      Object.defineProperty(global.navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      })

      const result = await geocodingService.getCurrentLocation()

      expect(result).toBeNull()
    })
  })
})

