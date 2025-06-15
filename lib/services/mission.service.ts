import { BaseService } from "./base.service"
import type { Mission, Waypoint, ApiResponse, PaginatedResponse } from "@/lib/types"

export class MissionService extends BaseService {
  constructor() {
    super()
  }

  async getMissions(params?: {
    status?: string
    robotId?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<PaginatedResponse<Mission>>> {
    return this.getPaginated<Mission>("/api/missions", params)
  }

  async getMission(id: string): Promise<ApiResponse<Mission>> {
    return this.get<Mission>(`/api/missions/${id}`)
  }

  async createMission(mission: Omit<Mission, "id" | "createdAt" | "progress">): Promise<ApiResponse<Mission>> {
    return this.post<Mission>("/api/missions", mission)
  }

  async updateMission(id: string, updates: Partial<Mission>): Promise<ApiResponse<Mission>> {
    return this.put<Mission>(`/api/missions/${id}`, updates)
  }

  async deleteMission(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/missions/${id}`)
  }

  async cloneMission(id: string, name: string): Promise<ApiResponse<Mission>> {
    return this.post<Mission>(`/api/missions/${id}/clone`, { name })
  }

  async getMissionWaypoints(id: string): Promise<ApiResponse<Waypoint[]>> {
    return this.get<Waypoint[]>(`/api/missions/${id}/waypoints`)
  }

  async addWaypoint(missionId: string, waypoint: Omit<Waypoint, "id">): Promise<ApiResponse<Waypoint>> {
    return this.post<Waypoint>(`/api/missions/${missionId}/waypoints`, waypoint)
  }

  async updateWaypoint(
    missionId: string,
    waypointId: string,
    updates: Partial<Waypoint>,
  ): Promise<ApiResponse<Waypoint>> {
    return this.put<Waypoint>(`/api/missions/${missionId}/waypoints/${waypointId}`, updates)
  }

  async deleteWaypoint(missionId: string, waypointId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/missions/${missionId}/waypoints/${waypointId}`)
  }

  async reorderWaypoints(missionId: string, waypoints: { id: string; order: number }[]): Promise<ApiResponse<void>> {
    return this.put<void>(`/api/missions/${missionId}/waypoints/reorder`, { waypoints })
  }

  async startMission(id: string, robotId: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/api/missions/${id}/start`, { robotId })
  }

  async pauseMission(id: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/api/missions/${id}/pause`)
  }

  async resumeMission(id: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/api/missions/${id}/resume`)
  }

  async stopMission(id: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/api/missions/${id}/stop`)
  }

  async getMissionTemplates(): Promise<ApiResponse<Mission[]>> {
    return this.get<Mission[]>("/api/missions/templates")
  }

  async createMissionFromTemplate(
    templateId: string,
    name: string,
    parameters?: Record<string, any>,
  ): Promise<ApiResponse<Mission>> {
    return this.post<Mission>(`/api/missions/templates/${templateId}/create`, { name, parameters })
  }

  async validateMission(mission: Mission): Promise<ApiResponse<{ valid: boolean; errors: string[] }>> {
    return this.post<{ valid: boolean; errors: string[] }>("/api/missions/validate", mission)
  }

  async estimateMissionTime(mission: Mission): Promise<ApiResponse<{ estimatedTime: number; distance: number }>> {
    return this.post<{ estimatedTime: number; distance: number }>("/api/missions/estimate", mission)
  }
}

export const missionService = new MissionService()
