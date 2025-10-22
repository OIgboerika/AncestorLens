// Geocoding service to convert addresses to coordinates
// Using OpenStreetMap Nominatim API (free, no API key required)

interface GeocodingResult {
  lat: number
  lng: number
  display_name: string
}

export const geocodingService = {
  // Convert address to coordinates
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      if (!address.trim()) return null
      
      // Clean and format the address
      const cleanAddress = address.trim().replace(/\s+/g, '+')
      
      // Use OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}&limit=1&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }
      
      const data: GeocodingResult[] = await response.json()
      
      if (data.length === 0) {
        console.warn('No results found for address:', address)
        return null
      }
      
      const result = data[0]
      return {
        lat: typeof result.lat === 'string' ? parseFloat(result.lat) : result.lat,
        lng: typeof result.lng === 'string' ? parseFloat(result.lng) : result.lng
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      return null
    }
  },

  // Convert coordinates to address (reverse geocoding)
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error('Reverse geocoding request failed')
      }
      
      const data = await response.json()
      return data.display_name || null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  },

  // Build address string from components
  buildAddressString(city?: string, state?: string, country?: string, address?: string): string {
    const parts = []
    
    if (address) parts.push(address)
    if (city) parts.push(city)
    if (state) parts.push(state)
    if (country) parts.push(country)
    
    return parts.join(', ')
  },

  // Get current location using browser geolocation
  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }
}
