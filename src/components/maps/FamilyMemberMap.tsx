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
  city?: string
  state?: string
  country?: string
  address?: string
  coordinates?: { lat: number; lng: number }
  relationship: string
  birthYear?: string
  deathYear?: string
  gender?: string
}

// Function to create Apple Memoji-style avatar HTML
const createAvatarHTML = (gender?: string): string => {
  const size = 56
  const baseStyles = `
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 3px 12px rgba(0,0,0,0.25), 0 0 0 2px rgba(59, 130, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
    overflow: hidden;
  `
  
  // Determine colors and features based on gender
  let faceColor = '#FDBE87' // Default skin tone
  let hairColor = '#8B4513' // Default brown hair
  let hairStyle = ''
  
  if (gender === 'male') {
    faceColor = '#F4C2A1'
    hairColor = '#654321'
    // Short hair style for male - buzz cut style
    hairStyle = `
      <!-- Hair base -->
      <ellipse cx="28" cy="16" rx="20" ry="12" fill="${hairColor}"/>
      <ellipse cx="28" cy="14" rx="18" ry="10" fill="${hairColor}"/>
      <!-- Hair texture -->
      <path d="M 12 18 Q 16 14 20 18 Q 24 14 28 18 Q 32 14 36 18 Q 40 14 44 18" stroke="${hairColor}" stroke-width="1.5" fill="none" opacity="0.7"/>
    `
  } else if (gender === 'female') {
    faceColor = '#FDBE87'
    hairColor = '#8B4513'
    // Longer hair style for female - wavy/curly
    hairStyle = `
      <!-- Hair base -->
      <ellipse cx="28" cy="14" rx="22" ry="16" fill="${hairColor}"/>
      <!-- Wavy hair strands -->
      <path d="M 8 18 Q 12 10 16 18 Q 20 10 24 18 Q 28 10 32 18 Q 36 10 40 18 Q 44 10 48 18" stroke="${hairColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M 10 22 Q 14 14 18 22 Q 22 14 26 22 Q 30 14 34 22 Q 38 14 42 22" stroke="${hairColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Hair at sides -->
      <ellipse cx="12" cy="24" rx="6" ry="10" fill="${hairColor}"/>
      <ellipse cx="44" cy="24" rx="6" ry="10" fill="${hairColor}"/>
      <!-- Hair at bottom -->
      <ellipse cx="28" cy="32" rx="14" ry="8" fill="${hairColor}"/>
    `
  } else {
    // Neutral/other - simple, rounded style
    faceColor = '#F4C2A1'
    hairColor = '#654321'
    hairStyle = `
      <ellipse cx="28" cy="16" rx="18" ry="12" fill="${hairColor}"/>
      <ellipse cx="28" cy="14" rx="16" ry="10" fill="${hairColor}"/>
    `
  }
  
  return `
    <div style="${baseStyles}" onmouseover="this.style.transform='scale(1.15)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px rgba(59, 130, 246, 0.2)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 3px 12px rgba(0,0,0,0.25), 0 0 0 2px rgba(59, 130, 246, 0.1)';">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="pointer-events: none;">
        <!-- Hair (behind face) -->
        ${hairStyle}
        
        <!-- Face circle -->
        <circle cx="28" cy="28" r="22" fill="${faceColor}"/>
        
        <!-- Eyes -->
        <circle cx="22" cy="26" r="3" fill="#1a1a1a"/>
        <circle cx="34" cy="26" r="3" fill="#1a1a1a"/>
        <!-- Eye highlights -->
        <circle cx="23" cy="25" r="1" fill="white"/>
        <circle cx="35" cy="25" r="1" fill="white"/>
        
        <!-- Eyebrows -->
        <path d="M 18 22 Q 22 20 26 22" stroke="#654321" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 30 22 Q 34 20 38 22" stroke="#654321" stroke-width="2" fill="none" stroke-linecap="round"/>
        
        <!-- Nose -->
        <ellipse cx="28" cy="30" rx="2" ry="2.5" fill="#E8A87C" opacity="0.5"/>
        <path d="M 26 30 Q 28 32 30 30" stroke="#D4A574" stroke-width="1" fill="none" opacity="0.6"/>
        
        <!-- Mouth - friendly smile -->
        <path d="M 22 34 Q 28 38 34 34" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        
        <!-- Cheeks (rosy cheeks for warmth) -->
        <circle cx="18" cy="30" r="4" fill="#FFB6C1" opacity="0.5"/>
        <circle cx="38" cy="30" r="4" fill="#FFB6C1" opacity="0.5"/>
      </svg>
    </div>
  `
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

    // No global navigation; popup will only display info per requirements

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

    // Add markers for living family members with avatar faces
    const markers: L.Marker[] = []
    livingMembers.forEach(member => {
      if (member.coordinates) {
        // Create custom avatar icon
        const avatarHTML = createAvatarHTML(member.gender)
        
        const customIcon = L.divIcon({
          html: avatarHTML,
          className: 'custom-avatar-marker',
          iconSize: [56, 56],
          iconAnchor: [28, 28],
          popupAnchor: [0, -28],
        })
        
        const marker = L.marker([member.coordinates.lat, member.coordinates.lng], {
          icon: customIcon
        })
        
        // Create popup content
        const locationParts = []
        if (member.address) locationParts.push(member.address)
        if (member.city) locationParts.push(member.city)
        if (member.state) locationParts.push(member.state)
        if (member.country) locationParts.push(member.country)
        
        const fullLocation = locationParts.length > 0
          ? locationParts.join(', ')
          : (member.coordinates
              ? `${member.coordinates.lat.toFixed(5)}, ${member.coordinates.lng.toFixed(5)}`
              : 'Location not specified')
        
        const popupContent = `
          <div class="p-2">
            <h3 class="font-semibold text-lg">${member.name}</h3>
            <p class="text-sm text-gray-600">${member.relationship}</p>
            <p class="text-sm text-gray-500">📍 ${fullLocation}</p>
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
      // No global function to clean up
    }
  }, [familyMembers])

  return (
    <>
      <style>{`
        .custom-avatar-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-avatar-marker div {
          z-index: 1000;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
      `}</style>
      <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </>
  )
}

export default FamilyMemberMap
