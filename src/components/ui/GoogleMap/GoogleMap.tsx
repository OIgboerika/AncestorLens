import React, { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'

interface GoogleMapProps {
  center: google.maps.LatLngLiteral
  zoom: number
  markers?: Array<{
    id: string
    position: google.maps.LatLngLiteral
    title: string
    info?: string
  }>
  onMapClick?: (lat: number, lng: number) => void
  onMarkerClick?: (markerId: string) => void
  className?: string
  height?: string
}

const MapComponent: React.FC<{
  center: google.maps.LatLngLiteral
  zoom: number
  markers?: Array<{
    id: string
    position: google.maps.LatLngLiteral
    title: string
    info?: string
  }>
  onMapClick?: (lat: number, lng: number) => void
  onMarkerClick?: (markerId: string) => void
}> = ({ center, zoom, markers = [], onMapClick, onMarkerClick }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()
  const [markerInstances, setMarkerInstances] = useState<google.maps.Marker[]>([])
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>()

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Add click listener for map
      if (onMapClick) {
        newMap.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            onMapClick(event.latLng.lat(), event.latLng.lng())
          }
        })
      }

      setMap(newMap)
      setInfoWindow(new google.maps.InfoWindow())
    }
  }, [ref, map, center, zoom, onMapClick])

  // Update map center and zoom when props change
  useEffect(() => {
    if (map) {
      map.setCenter(center)
      map.setZoom(zoom)
    }
  }, [map, center, zoom])

  // Handle markers
  useEffect(() => {
    if (map && infoWindow) {
      // Clear existing markers
      markerInstances.forEach(marker => marker.setMap(null))
      const newMarkers: google.maps.Marker[] = []

      markers.forEach(markerData => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#dc2626"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 24)
          }
        })

        // Add click listener for marker
        marker.addListener('click', () => {
          if (markerData.info) {
            infoWindow.setContent(`
              <div class="p-2">
                <h3 class="font-semibold text-gray-900">${markerData.title}</h3>
                <p class="text-sm text-gray-600 mt-1">${markerData.info}</p>
              </div>
            `)
            infoWindow.open(map, marker)
          }
          if (onMarkerClick) {
            onMarkerClick(markerData.id)
          }
        })

        newMarkers.push(marker)
      })

      setMarkerInstances(newMarkers)
    }
  }, [map, markers, infoWindow, onMarkerClick])

  return <div ref={ref} className="w-full h-full" />
}

const render = (status: Status): JSX.Element => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ancestor-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-red-600 text-sm">!</span>
            </div>
            <p className="text-sm text-gray-600">Failed to load map</p>
            <p className="text-xs text-gray-500 mt-1">Please check your API key</p>
          </div>
        </div>
      )
    case Status.SUCCESS:
      return <div />
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom,
  markers = [],
  onMapClick,
  onMarkerClick,
  className = '',
  height = '400px'
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ height }}>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-yellow-600 text-lg">⚠</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Google Maps API Key Required</h3>
          <p className="text-sm text-gray-600 mb-4">
            To display the map, you need to add your Google Maps API key to the environment variables.
          </p>
          <div className="text-left bg-gray-50 p-3 rounded-lg text-xs text-gray-700">
            <p className="font-medium mb-1">Steps to set up:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Get API key from Google Cloud Console</li>
              <li>Add VITE_GOOGLE_MAPS_API_KEY to .env.local</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={{ height }}>
      <Wrapper apiKey={apiKey} render={render}>
        <MapComponent
          center={center}
          zoom={zoom}
          markers={markers}
          onMapClick={onMapClick}
          onMarkerClick={onMarkerClick}
        />
      </Wrapper>
    </div>
  )
}

export default GoogleMap
