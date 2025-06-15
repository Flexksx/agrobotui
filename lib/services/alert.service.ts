import { BaseService } from "./base.service"
import type { Alert, ApiResponse, PaginatedResponse } from "@/lib/types"

export class AlertService extends BaseService {
  constructor() {
    super()
  }

  async getAlerts(params?: {
    severity?: string
    type?: string
    robotId?: string
    acknowledged?: boolean
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<Alert>>> {
    return this.getPaginated<Alert>("/api/alerts", params)
  }

  async getAlert(id: string): Promise<ApiResponse<Alert>> {
    return this.get<Alert>(`/api/alerts/${id}`)
  }

  async acknowledgeAlert(id: string): Promise<ApiResponse<Alert>> {
    return this.put<Alert>(`/api/alerts/${id}/acknowledge`)
  }

  async resolveAlert(id: string, resolution?: string): Promise<ApiResponse<Alert>> {
    return this.put<Alert>(`/api/alerts/${id}/resolve`, { resolution })
  }

  async deleteAlert(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/alerts/${id}`)
  }

  async getUnacknowledgedCount(): Promise<ApiResponse<number>> {
    return this.get<number>("/api/alerts/unacknowledged/count")
  }

  async subscribeToAlerts(callback: (alert: Alert) => void): void {
    // WebSocket subscription for real-time alerts
    // This would be implemented with WebSocket connection
    console.log("Subscribing to real-time alerts", callback)
  }
}

export const alertService = new AlertService()
