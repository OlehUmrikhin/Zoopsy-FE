import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import type { SitterSearchResult } from '@api/sitter/types';
import { MapStub } from './MapStub';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const LIBRARIES: 'places'[] = ['places'];

const DEFAULT_CENTER = { lat: 49.9935, lng: 36.2304 }; // Kharkiv
const DEFAULT_ZOOM = 12;

const CITY_CENTERS: Record<string, { lat: number; lng: number }> = {
  kyiv: { lat: 50.4501, lng: 30.5234 },
  lviv: { lat: 49.8397, lng: 24.0297 },
  kharkiv: { lat: 49.9935, lng: 36.2304 },
  odesa: { lat: 46.4825, lng: 30.7233 },
  dnipro: { lat: 48.4647, lng: 35.0462 },
};

function getApproximateLocation(
  lat: number,
  lng: number,
  seed: string,
  jitterRadiusMeters = 400,
): { lat: number; lng: number } {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (((hash << 5) + hash) ^ seed.charCodeAt(i)) >>> 0;
  }
  const angle = (hash % 6284) / 1000;
  const distance = (((hash >> 5) & 0xfff) / 0xfff) * jitterRadiusMeters;
  const dLat = (distance / 111320) * Math.cos(angle);
  const dLng = (distance / (111320 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
  return { lat: lat + dLat, lng: lng + dLng };
}

type Props = {
  sitters: SitterSearchResult[];
  highlightedSitterId?: string | null;
  onSitterClick?: (userId: string) => void;
  city?: string;
  userLocation?: { lat: number; lng: number } | null;
};

export function SittersMap({ sitters, highlightedSitterId, onSitterClick, city, userLocation }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!map) return;
    if (userLocation) {
      map.panTo(userLocation);
      map.setZoom(14);
      return;
    }
    const center = city ? CITY_CENTERS[city.toLowerCase()] : undefined;
    if (center) {
      map.panTo(center);
      map.setZoom(DEFAULT_ZOOM);
    }
  }, [map, city, userLocation]);

  const markers = useMemo(
    () =>
      sitters
        .filter((s) => s.latitude != null && s.longitude != null)
        .map((s) => ({
          sitter: s,
          approxPos: getApproximateLocation(s.latitude!, s.longitude!, s.userId),
        })),
    [sitters],
  );

  useEffect(() => {
    if (!map) return;

    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = markers.map(
      ({ approxPos }) =>
        new google.maps.Circle({
          map,
          center: approxPos,
          radius: 1000,
          strokeColor: '#2C694E',
          strokeOpacity: 0.5,
          strokeWeight: 1.5,
          fillColor: '#2C694E',
          fillOpacity: 0.07,
          clickable: false,
        }),
    );

    return () => {
      circlesRef.current.forEach((c) => c.setMap(null));
      circlesRef.current = [];
    };
  }, [map, markers]);

  useEffect(() => {
    markers.forEach(({ sitter }, i) => {
      const circle = circlesRef.current[i];
      if (!circle) return;
      const isHighlighted = sitter.userId === highlightedSitterId;
      circle.setOptions({
        strokeOpacity: isHighlighted ? 0.9 : 0.5,
        strokeWeight: isHighlighted ? 2.5 : 1.5,
        fillOpacity: isHighlighted ? 0.15 : 0.07,
      });
    });
  }, [highlightedSitterId, markers]);

  if (loadError || !isLoaded) {
    return <MapStub />;
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
      }}
      center={userLocation ?? (city ? CITY_CENTERS[city.toLowerCase()] : undefined) ?? DEFAULT_CENTER}
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
      {userLocation && (
        <OverlayView
          position={userLocation}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            style={{ transform: 'translate(-50%, -50%)' }}
            title="Ваше місцезнаходження"
          >
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: '#2C694E', border: '3px solid white',
              boxShadow: '0 0 0 3px rgba(44,105,78,0.3)',
            }} />
          </div>
        </OverlayView>
      )}

      {markers.map(({ sitter, approxPos }) => {
        const isHighlighted = sitter.userId === highlightedSitterId;

        return (
          <OverlayView
            key={sitter.userId}
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
        );
      })}
    </GoogleMap>
  );
}
