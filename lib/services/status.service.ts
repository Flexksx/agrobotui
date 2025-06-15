import { BaseService } from "./base.service"
import type { ApiResponse } from "@/lib/types"

interface SystemStatus {
  backend: {
    status: "online" | "offline" | "degraded"
    latency: number
    lastCheck: string
  }
  piController: {
    status: "online" | "offline" | "degraded"
    latency: number
    lastCheck: string
  }
  database: {
    status: "online" | "offline" | "degraded"
    connections: number
    lastCheck: string
  }
  robots: {
    total: number
    online: number
    offline: number
    lastUpdate: string
  }
}

interface HealthCheck {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  timestamp: string
  details?: Record<string, any>
}

export class StatusService extends BaseService {
  constructor() {
    super()
  }

  async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    return this.get<SystemStatus>("/api/status")
  }

  async getHealthCheck(): Promise<ApiResponse<HealthCheck[]>> {
    return this.get<HealthCheck[]>("/api/health")
  }

  async pingBackend(): Promise<ApiResponse<{ latency: number; timestamp: string }>> {
    const startTime = Date.now()
    const response = await this.get<{ timestamp: string }>("/api/ping")
    const latency = Date.now() - startTime

    if (response.success && response.data) {
      return {
        success: true,
        data: {
          latency,
          timestamp: response.data.timestamp,
        },
      }
    }

    return response as ApiResponse<{ latency: number; timestamp: string }>
  }

  async testConnection(endpoint: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.get<any>(`/api/test-connection?endpoint=${encodeURIComponent(endpoint)}`)
      return response
    } catch (error) {
      return {
        success: false,
        error: "Connection test failed",
      }
    }
  }
}

export const statusService = new StatusService()
