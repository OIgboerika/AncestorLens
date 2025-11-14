import { vi } from 'vitest'

// Mock geocoding service responses
export const mockGeocodingResponse = [
  {
    lat: '6.5244',
    lng: '3.3792',
    display_name: 'Lagos, Nigeria',
    place_id: 123456,
  },
]

export const mockReverseGeocodingResponse = {
  display_name: 'Lagos, Nigeria',
  address: {
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
  },
}

// Mock fetch for geocoding API calls
export const mockGeocodingFetch = (shouldSucceed: boolean = true, isReverse: boolean = false) => {
  return vi.fn(() =>
    Promise.resolve({
      ok: shouldSucceed,
      status: shouldSucceed ? 200 : 400,
      statusText: shouldSucceed ? 'OK' : 'Bad Request',
      json: async () => {
        if (!shouldSucceed) return { error: 'Geocoding failed' }
        return isReverse ? mockReverseGeocodingResponse : mockGeocodingResponse
      },
    } as Response)
  )
}

