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
      
      console.log('Geocoding address:', cleanAddress) // Debug log
      
      // Use OpenStreetMap Nominatim API with better parameters
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}&limit=5&addressdetails=1&countrycodes=&extratags=1`
      )
      
      if (!response.ok) {
        console.error('Geocoding request failed:', response.status, response.statusText)
        throw new Error('Geocoding request failed')
      }
      
      const data: GeocodingResult[] = await response.json()
      
      console.log('Geocoding results:', data) // Debug log
      
      if (data.length === 0) {
        console.warn('No results found for address:', address)
        return null
      }
      
      const result = data[0]
      console.log('Selected result:', result) // Debug log
      
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
    
    // If we have a street address, use it as the primary identifier
    if (address && address.trim()) {
      // Clean the address to remove any country duplicates
      let cleanAddress = address.trim()
      
      // Remove country from address if it's already there
      if (country && country.trim()) {
        const countryRegex = new RegExp(`,\\s*${country.trim()}\\s*$`, 'i')
        cleanAddress = cleanAddress.replace(countryRegex, '').trim()
      }
      
      parts.push(cleanAddress)
    }
    
    // Add city if available
    if (city && city.trim()) {
      parts.push(city.trim())
    }
    
    // Add state if available
    if (state && state.trim()) {
      parts.push(state.trim())
    }
    
    // Always add country for better geocoding results
    if (country && country.trim()) {
      parts.push(country.trim())
    }
    
    const fullAddress = parts.join(', ')
    console.log('Built address string:', fullAddress) // Debug log
    return fullAddress
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
