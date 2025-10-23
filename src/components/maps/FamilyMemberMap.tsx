import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface FamilyMember {
  id: string | number
  name: string
  role: 'Living' | 'Deceased'
  location?: string
  city?: string
  state?: string
  country?: string
  address?: string
  coordinates?: { lat: number; lng: number }
  relationship: string
  birthYear?: string
  deathYear?: string
}

interface FamilyMemberMapProps {
  familyMembers: FamilyMember[]
  className?: string
}

const FamilyMemberMap = ({ familyMembers, className = '' }: FamilyMemberMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!mapRef.current) return

    // Add global navigation function
    (window as any).navigateToMemberDetails = (id: string, name: string, relationship: string, role: string, birthYear: string, deathYear: string, location: string, city: string, state: string, country: string, address: string, coordinates: string) => {
      const memberData = {
        id,
        name,
        relationship,
        role: role as 'Living' | 'Deceased',
        birthYear: birthYear || undefined,
        deathYear: deathYear || undefined,
        location: location || undefined,
        city: city || undefined,
        state: state || undefined,
        country: country || undefined,
        address: address || undefined,
        coordinates: coordinates ? JSON.parse(coordinates) : undefined
      }
      
      navigate(`/family-tree/member/${id}`, { state: { member: memberData } })
    }

    // Initialize map
    const map = L.map(mapRef.current).setView([0, 0], 2)
    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Filter living family members with coordinates
    const livingMembers = familyMembers.filter(member => 
      member.role === 'Living' && 
      member.coordinates && 
      member.coordinates.lat !== 0 && 
      member.coordinates.lng !== 0
    )

    // Add markers for living family members
    const markers: L.Marker[] = []
    livingMembers.forEach(member => {
      if (member.coordinates) {
        const marker = L.marker([member.coordinates.lat, member.coordinates.lng])
        
        // Create popup content
        const locationParts = []
        if (member.address) locationParts.push(member.address)
        if (member.city) locationParts.push(member.city)
        if (member.state) locationParts.push(member.state)
        if (member.country) locationParts.push(member.country)
        
        const fullLocation = locationParts.length > 0 ? locationParts.join(', ') : member.location || 'Location not specified'
        
        const popupContent = `
          <div class="p-2">
            <h3 class="font-semibold text-lg">${member.name}</h3>
            <p class="text-sm text-gray-600">${member.relationship}</p>
            <p class="text-sm text-gray-500">📍 ${fullLocation}</p>
            ${member.birthYear ? `<p class="text-sm text-gray-500">Born: ${member.birthYear}</p>` : ''}
            <div class="mt-2">
              <button 
                onclick="window.navigateToMemberDetails('${member.id}', '${member.name}', '${member.relationship}', '${member.role}', '${member.birthYear || ''}', '${member.deathYear || ''}', '${member.location || ''}', '${member.city || ''}', '${member.state || ''}', '${member.country || ''}', '${member.address || ''}', '${member.coordinates ? JSON.stringify(member.coordinates) : ''}')"
                class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        `
        
        marker.bindPopup(popupContent)
        marker.addTo(map)
        markers.push(marker)
      }
    })

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    } else {
      // Default view if no markers
      map.setView([20, 0], 2)
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      // Clean up global function
      delete (window as any).navigateToMemberDetails
    }
  }, [familyMembers])

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default FamilyMemberMap
