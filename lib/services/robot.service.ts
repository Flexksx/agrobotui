import { BaseService } from "./base.service"
import type { Robot, Component, Telemetry, Position, ApiResponse } from "@/lib/types"

export class RobotService extends BaseService {
  constructor() {
    super()
  }

  async getRobots(): Promise<ApiResponse<Robot[]>> {
    return this.get<Robot[]>("/api/robots")
  }

  async getRobot(id: string): Promise<ApiResponse<Robot>> {
    return this.get<Robot>(`/api/robots/${id}`)
  }

  async createRobot(robot: Omit<Robot, "id" | "lastUpdate" | "telemetry">): Promise<ApiResponse<Robot>> {
    return this.post<Robot>("/api/robots", robot)
  }

  async updateRobot(id: string, updates: Partial<Robot>): Promise<ApiResponse<Robot>> {
    return this.put<Robot>(`/api/robots/${id}`, updates)
  }

  async deleteRobot(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api/robots/${id}`)
  }

  async getRobotComponents(id: string): Promise<ApiResponse<Component[]>> {
    return this.get<Component[]>(`/api/robots/${id}/components`)
  }

  async updateRobotComponent(
    robotId: string,
    componentId: string,
    updates: Partial<Component>,
  ): Promise<ApiResponse<Component>> {
    return this.put<Component>(`/api/robots/${robotId}/components/${componentId}`, updates)
  }

  async getRobotTelemetry(id: string, timeRange?: { start: string; end: string }): Promise<ApiResponse<Telemetry[]>> {
    const params = timeRange ? { start: timeRange.start, end: timeRange.end } : undefined
    return this.get<Telemetry[]>(`/api/robots/${id}/telemetry`, { params })
  }

  async getRobotPosition(id: string): Promise<ApiResponse<Position>> {
    return this.get<Position>(`/api/robots/${id}/position`)
  }

  async sendCommand(id: string, command: string, parameters?: Record<string, any>): Promise<ApiResponse<any>> {
    return this.post<any>(`/api/robots/${id}/command`, { command, parameters })
  }

  async armRobot(id: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "arm")
  }

  async disarmRobot(id: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "disarm")
  }

  async setMode(id: string, mode: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "set_mode", { mode })
  }

  async goToPosition(id: string, position: Position): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "goto", position)
  }

  async returnToLaunch(id: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "rtl")
  }

  async emergencyStop(id: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "emergency_stop")
  }

  async startMission(id: string, missionId: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "start_mission", { missionId })
  }

  async pauseMission(id: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "pause_mission")
  }

  async resumeMission(id: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "resume_mission")
  }

  async stopMission(id: string): Promise<ApiResponse<void>> {
    return this.sendCommand(id, "stop_mission")
  }
}

export const robotService = new RobotService()
