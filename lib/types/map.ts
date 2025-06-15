export interface MapPosition {
  lat: number
  lng: number
  zoom?: number
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MapMarker {
  id: string
  position: { lat: number; lng: number }
  type: "robot" | "waypoint" | "field" | "base"
  data?: any
}

export interface MapPath {
  id: string
  positions: { lat: number; lng: number }[]
  type: "mission" | "trail" | "boundary"
  style?: {
    color?: string
    weight?: number
    opacity?: number
    dashArray?: string
  }
}
