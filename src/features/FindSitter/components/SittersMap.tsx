import { useCallback, useMemo, useState } from 'react'
import { GoogleMap, useJsApiLoader, Circle, OverlayView } from '@react-google-maps/api'
import type { SitterSearchResult } from '@api/sitter/types'
import { MapStub } from './MapStub'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
// Must match the libraries used in AddressAutocomplete to share the same loader instance
const LIBRARIES: ('places')[] = ['places']

const DEFAULT_CENTER = { lat: 49.9935, lng: 36.2304 } // Kharkiv
const DEFAULT_ZOOM = 12

/**
 * Generates a deterministic random offset from real coordinates to protect sitter privacy.
 * The same sitter always gets the same jitter (based on their userId as a seed).
 */
function getApproximateLocation(
  lat: number,
  lng: number,
  seed: string,
  jitterRadiusMeters = 400,
): { lat: number; lng: number } {
  let hash = 5381
  for (let i = 0; i < seed.length; i++) {
    hash = (((hash << 5) + hash) ^ seed.charCodeAt(i)) >>> 0
  }
  const angle = (hash % 6284) / 1000 // 0..2π range
  const distance = (((hash >> 5) & 0xfff) / 0xfff) * jitterRadiusMeters
  const dLat = (distance / 111320) * Math.cos(angle)
  const dLng = (distance / (111320 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle)
  return { lat: lat + dLat, lng: lng + dLng }
}

type Props = {
  sitters: SitterSearchResult[]
  highlightedSitterId?: string | null
  onSitterClick?: (userId: string) => void
}

export function SittersMap({ sitters, highlightedSitterId, onSitterClick }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: LIBRARIES,
  })

  const [, setMap] = useState<google.maps.Map | null>(null)

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const markers = useMemo(
    () =>
      sitters
        .filter((s) => s.latitude != null && s.longitude != null)
        .map((s) => ({
          sitter: s,
          approxPos: getApproximateLocation(s.latitude!, s.longitude!, s.userId),
        })),
    [sitters],
  )

  if (loadError || !isLoaded) {
    return <MapStub />
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '100%',
        minHeight: '500px'
      }}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
      }}
    >
      {markers.map(({ sitter, approxPos }) => {
        const isHighlighted = sitter.userId === highlightedSitterId

        return (
          <div key={sitter.userId}>
            <Circle
              center={approxPos}
              radius={1000}
              options={{
                strokeColor: '#2C694E',
                strokeOpacity: isHighlighted ? 0.9 : 0.5,
                strokeWeight: isHighlighted ? 2.5 : 1.5,
                fillColor: '#2C694E',
                fillOpacity: isHighlighted ? 0.15 : 0.07,
                clickable: false,
              }}
            />
            <OverlayView
              position={approxPos}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <button
                type="button"
                onClick={() => onSitterClick?.(sitter.userId)}
                style={{
                  transform: 'translate(-50%, -50%)',
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                  outline: 'none',
                }}
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sitter.userId}`}
                  alt={sitter.fullName}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: isHighlighted ? '2.5px solid #2C694E' : '2px solid white',
                    boxShadow: isHighlighted
                      ? '0 0 0 2px #2C694E, 0 2px 8px rgba(0,0,0,0.25)'
                      : '0 2px 6px rgba(0,0,0,0.2)',
                    transform: isHighlighted ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    background: '#E8F5EF',
                  }}
                />
              </button>
            </OverlayView>
          </div>
        )
      })}
    </GoogleMap>
  )
}
