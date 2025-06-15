export function calculateDistance(pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (pos1.lat * Math.PI) / 180
  const φ2 = (pos2.lat * Math.PI) / 180
  const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180
  const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export function calculateBearing(pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }): number {
  const φ1 = (pos1.lat * Math.PI) / 180
  const φ2 = (pos2.lat * Math.PI) / 180
  const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

  const θ = Math.atan2(y, x)

  return ((θ * 180) / Math.PI + 360) % 360
}

export function formatCoordinates(lat: number, lng: number, precision = 4): string {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`
}

export function isWithinBounds(
  position: { lat: number; lng: number },
  bounds: { north: number; south: number; east: number; west: number },
): boolean {
  return (
    position.lat >= bounds.south &&
    position.lat <= bounds.north &&
    position.lng >= bounds.west &&
    position.lng <= bounds.east
  )
}

export function calculatePolygonArea(coordinates: { lat: number; lng: number }[]): number {
  if (coordinates.length < 3) return 0

  let area = 0
  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length
    area += coordinates[i].lat * coordinates[j].lng
    area -= coordinates[j].lat * coordinates[i].lng
  }
  area = Math.abs(area) / 2

  // Convert to square meters (rough approximation)
  const metersPerDegree = 111320
  return area * metersPerDegree * metersPerDegree
}

export function calculatePolygonCenter(coordinates: { lat: number; lng: number }[]): { lat: number; lng: number } {
  if (coordinates.length === 0) return { lat: 0, lng: 0 }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 },
  )

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length,
  }
}
