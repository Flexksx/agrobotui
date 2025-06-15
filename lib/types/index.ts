export interface Position {
  lat: number
  lng: number
  altitude?: number
  heading?: number
  timestamp?: string
}

export interface Component {
  id: string
  name: string
  type: "motor" | "sensor" | "camera" | "gps" | "radio" | "battery" | "pixhawk"
  status: "online" | "offline" | "error" | "warning"
  health: number // 0-100
  temperature?: number
  voltage?: number
  current?: number
  lastUpdate: string
  metadata?: Record<string, any>
}

export interface Telemetry {
  timestamp: string
  robotId: string
  position: Position
  battery: {
    level: number
    voltage: number
    current: number
    temperature: number
  }
  system: {
    cpu: number
    memory: number
    temperature: number
    uptime: number
  }
  communication: {
    signalStrength: number
    latency: number
    packetsLost: number
  }
  pixhawk: {
    mode: string
    armed: boolean
    gpsStatus: number
    satelliteCount: number
  }
}

export interface Robot {
  id: string
  name: string
  type: string
  status: "active" | "idle" | "error" | "offline" | "maintenance"
  position: Position
  battery: number
  currentMission?: string
  components: Component[]
  telemetry: Telemetry
  lastUpdate: string
  totalMissions: number
  uptime: string
  capabilities: string[]
}

export interface Waypoint {
  id: string
  lat: number
  lng: number
  altitude: number
  speed: number
  action: "survey" | "photo" | "sample" | "wait" | "land"
  parameters?: Record<string, any>
  order: number
}

export interface Mission {
  id: string
  name: string
  description: string
  type: "survey" | "monitoring" | "analysis" | "inspection" | "custom"
  status: "draft" | "scheduled" | "active" | "paused" | "completed" | "failed" | "cancelled"
  assignedRobot?: string
  waypoints: Waypoint[]
  parameters: {
    altitude: number
    speed: number
    overlap: number
    pattern: "grid" | "circular" | "linear" | "custom"
    safetyRadius: number
  }
  progress: number
  estimatedTime: number
  actualTime?: number
  fieldArea: string
  priority: "low" | "medium" | "high"
  createdAt: string
  startedAt?: string
  completedAt?: string
  createdBy: string
}

export interface Alert {
  id: string
  robotId?: string
  type: "battery" | "gps" | "communication" | "mission" | "system" | "weather" | "maintenance"
  severity: "info" | "warning" | "error" | "critical"
  title: string
  message: string
  timestamp: string
  acknowledged: boolean
  resolvedAt?: string
}

export interface Field {
  id: string
  name: string
  area: number // hectares
  boundaries: Position[]
  coverage: number // percentage
  lastSurveyed?: string
  cropType?: string
  missions: string[] // mission IDs
}

export interface SystemSettings {
  apiEndpoints: {
    backend: string
    piController: string
    websocket: string
    mqtt: string
  }
  map: {
    provider: "openstreetmap" | "google" | "mapbox"
    defaultZoom: number
    showTrails: boolean
    trailDuration: number
    refreshRate: number
  }
  robots: {
    defaultAltitude: number
    defaultSpeed: number
    safetyRadius: number
    batteryWarning: number
    batteryLow: number
  }
  notifications: {
    email: boolean
    push: boolean
    sound: boolean
    types: {
      battery: boolean
      mission: boolean
      system: boolean
      communication: boolean
    }
  }
  security: {
    sessionTimeout: number
    requireAuth: boolean
    twoFactorAuth: boolean
  }
}

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "operator" | "viewer"
  permissions: string[]
  lastLogin?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}
