import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (!mapRef.current) return

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
        const popupContent = `
          <div class="p-2">
            <h3 class="font-semibold text-lg">${member.name}</h3>
            <p class="text-sm text-gray-600">${member.relationship}</p>
            ${member.location ? `<p class="text-sm text-gray-500">📍 ${member.location}</p>` : ''}
            ${member.birthYear ? `<p class="text-sm text-gray-500">Born: ${member.birthYear}</p>` : ''}
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
    }
  }, [familyMembers])

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default FamilyMemberMap
