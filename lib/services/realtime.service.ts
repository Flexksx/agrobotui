import { BaseService } from "./base.service"
import type { Robot, Telemetry, Alert, Mission, ApiResponse } from "@/lib/types"

export class RealtimeService extends BaseService {
  private isPolling = false
  private callbacks: Map<string, ((data: any) => void)[]> = new Map()

  constructor() {
    super()
  }

  startPolling(): void {
    if (this.isPolling) return

    this.isPolling = true

    // Poll robot updates every 2 seconds
    this.startPolling(
      "robots",
      async () => {
        const response = await this.get<Robot[]>("/api/robots/status")
        if (response.success && response.data) {
          this.notifyCallbacks("robot_update", response.data)
        }
      },
      2000,
    )

    // Poll telemetry every 1 second
    this.startPolling(
      "telemetry",
      async () => {
        const response = await this.get<Telemetry[]>("/api/telemetry/latest")
        if (response.success && response.data) {
          response.data.forEach((telemetry) => {
            this.notifyCallbacks("telemetry", telemetry)
          })
        }
      },
      1000,
    )

    // Poll alerts every 5 seconds
    this.startPolling(
      "alerts",
      async () => {
        const response = await this.get<Alert[]>("/api/alerts/recent")
        if (response.success && response.data) {
          response.data.forEach((alert) => {
            this.notifyCallbacks("alert", alert)
          })
        }
      },
      5000,
    )

    // Poll mission updates every 3 seconds
    this.startPolling(
      "missions",
      async () => {
        const response = await this.get<Mission[]>("/api/missions/active")
        if (response.success && response.data) {
          this.notifyCallbacks("mission_update", response.data)
        }
      },
      3000,
    )
  }

  stopPolling(): void {
    if (!this.isPolling) return

    this.isPolling = false
    this.stopAllPolling()
  }

  subscribe(type: string, callback: (data: any) => void): () => void {
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, [])
    }
    this.callbacks.get(type)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(type)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private notifyCallbacks(type: string, data: any): void {
    const callbacks = this.callbacks.get(type) || []
    callbacks.forEach((callback) => callback(data))
  }

  // Convenience methods for specific subscriptions
  subscribeToRobotUpdates(callback: (robots: Robot[]) => void): () => void {
    return this.subscribe("robot_update", callback)
  }

  subscribeToTelemetry(callback: (telemetry: Telemetry) => void): () => void {
    return this.subscribe("telemetry", callback)
  }

  subscribeToAlerts(callback: (alert: Alert) => void): () => void {
    return this.subscribe("alert", callback)
  }

  subscribeToMissionUpdates(callback: (missions: Mission[]) => void): () => void {
    return this.subscribe("mission_update", callback)
  }

  // Manual refresh methods
  async refreshRobots(): Promise<ApiResponse<Robot[]>> {
    return this.get<Robot[]>("/api/robots")
  }

  async refreshTelemetry(robotId?: string): Promise<ApiResponse<Telemetry[]>> {
    const url = robotId ? `/api/robots/${robotId}/telemetry/latest` : "/api/telemetry/latest"
    return this.get<Telemetry[]>(url)
  }

  async refreshAlerts(): Promise<ApiResponse<Alert[]>> {
    return this.get<Alert[]>("/api/alerts?limit=50")
  }

  async refreshMissions(): Promise<ApiResponse<Mission[]>> {
    return this.get<Mission[]>("/api/missions")
  }
}

export const realtimeService = new RealtimeService()
